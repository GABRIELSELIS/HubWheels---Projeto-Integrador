/* HubWheels MVP - dados salvos no navegador (localStorage) */
const KEY = 'hubwheels_v1';
let PHOTO = null;
const $ = id => document.getElementById(id);
const brl = n => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dbr = iso => iso.split('-').reverse().join('/');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { vehicle: null, services: [], reminders: [] }; } catch { return { vehicle: null, services: [], reminders: [] }; } };
const save = d => localStorage.setItem(KEY, JSON.stringify(d));
const uid = () => Date.now() + Math.floor(Math.random() * 1000);
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const daysTo = iso => Math.ceil((new Date(iso + 'T00:00:00') - new Date().setHours(0, 0, 0, 0)) / 864e5);
const status = d => d < 0 ? ['danger', 'vencido'] : d <= 30 ? ['warning text-dark', 'atenção'] : ['success', 'ok'];

function addVehicle() {
  if (!$('v_model').value.trim()) return;
  const d = load();
  d.vehicle = { model: $('v_model').value.trim(), plate: $('v_plate').value.toUpperCase(), year: +$('v_year').value || null,
    km: +$('v_km').value || 0, buy: +$('v_buy').value || null, market: +$('v_mkt').value || null };
  d.reminders = [['Trocar óleo', 180], ['Calibrar pneus', 15], ['IPVA', 60], ['Licenciamento', 90]]
    .map(([title, n]) => ({ id: uid(), title, due: addDays(n) }));
  save(d); render();
}
function setMarket() { const d = load(); d.vehicle.market = +$('m_val').value || d.vehicle.market; save(d); $('m_val').value = ''; render(); }
function addRem() {
  if (!$('r_title').value || !$('r_date').value) return;
  const d = load(); d.reminders.push({ id: uid(), title: $('r_title').value, due: $('r_date').value });
  save(d); $('r_title').value = ''; render();
}
function doneRem(id) { const d = load(); d.reminders = d.reminders.filter(r => r.id !== id); save(d); render(); }

/* foto da nota reduzida para caber no localStorage */
function prev(input) {
  const f = input.files[0]; if (!f) return;
  const img = new Image(), rd = new FileReader();
  rd.onload = () => { img.onload = () => {
      const s = Math.min(1, 800 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = img.width * s; c.height = img.height * s; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      PHOTO = c.toDataURL('image/jpeg', 0.6); $('s_prev').textContent = '📎 ' + f.name; };
    img.src = rd.result; };
  rd.readAsDataURL(f);
}
function addService() {
  const d = load(), km = +$('s_km').value || null;
  d.services.unshift({ id: uid(), date: new Date().toISOString().slice(0, 10), type: $('s_type').value, desc: $('s_desc').value,
    cost: +$('s_cost').value || 0, km, quality: $('s_q').checked, photo: PHOTO });
  if (km) d.vehicle.km = km;
  try { save(d); } catch { d.services[0].photo = null; save(d); alert('Armazenamento cheio: registro salvo sem a foto.'); }
  PHOTO = null; ['s_desc', 's_cost', 's_km'].forEach(i => $(i).value = ''); $('s_prev').textContent = ''; $('s_q').checked = false; render();
}

function histHtml(services) {
  return services.map(s => `<li class="list-group-item d-flex justify-content-between align-items-center px-0">
    <div><strong>${esc(s.type)}</strong> ${s.quality ? '<span class="badge text-bg-warning"><i class="bi bi-star-fill"></i> peça de qualidade</span>' : ''}
    <div class="small text-muted">${dbr(s.date)} • ${s.km || '-'} km • ${esc(s.desc)}</div>
    ${s.photo ? `<a href="${s.photo}" target="_blank"><img class="nota-thumb mt-1" src="${s.photo}" alt="nota"></a>` : ''}</div>
    <strong>${brl(s.cost)}</strong></li>`).join('') || '<li class="list-group-item px-0 text-muted">Nenhum registro ainda.</li>';
}
function show(id) { ['viewShare', 'viewEmpty', 'viewApp'].forEach(v => $(v).classList.toggle('d-none', v !== id)); }

function render() {
  const d = load();
  if (!d.vehicle) return show('viewEmpty');
  show('viewApp');
  const v = d.vehicle, total = d.services.reduce((a, s) => a + s.cost, 0);
  $('t_model').textContent = v.model;
  $('t_info').textContent = `${v.plate} • ${v.year || ''} • ${(v.km || 0).toLocaleString('pt-BR')} km`;
  $('t_total').textContent = brl(total);
  $('t_dep').textContent = v.buy && v.market ? ((1 - v.market / v.buy) * 100).toFixed(1) + '%' : '-';
  const rs = d.reminders.map(r => ({ ...r, days: daysTo(r.due) })).sort((a, b) => a.days - b.days);
  $('rem').innerHTML = rs.map(r => { const [cls, txt] = status(r.days);
    return `<li class="list-group-item d-flex justify-content-between align-items-center px-0">
      <div><strong>${esc(r.title)}</strong><div class="small text-muted">${dbr(r.due)} (${r.days < 0 ? 'vencido há ' + (-r.days) : 'em ' + r.days} dias)</div></div>
      <div><span class="badge text-bg-${cls} me-2">${txt}</span><button class="btn btn-sm btn-outline-danger" onclick="doneRem(${r.id})"><i class="bi bi-check-lg"></i></button></div></li>`; }).join('')
    || '<li class="list-group-item px-0 text-muted">Sem lembretes.</li>';
  $('hist').innerHTML = histHtml(d.services);
  notify(rs.filter(r => r.days <= 30));
}
function notify(rs) {
  if (!('Notification' in window) || !rs.length) return;
  const go = () => rs.forEach(r => new Notification('HubWheels', { body: `${r.title}: ${r.days < 0 ? 'vencido' : 'vence em ' + r.days + ' dias'}` }));
  if (Notification.permission === 'granted') go(); else if (Notification.permission !== 'denied') Notification.requestPermission().then(p => p === 'granted' && go());
}

/* Link do comprador: o prontuário (sem fotos) vai codificado no próprio link */
const enc = o => btoa(unescape(encodeURIComponent(JSON.stringify(o))));
const dec = s => JSON.parse(decodeURIComponent(escape(atob(s))));
function share() {
  const d = load(), pub = { v: d.vehicle, s: d.services.map(({ photo, id, ...r }) => r) };
  const url = location.origin + location.pathname + '#p=' + enc(pub);
  $('link').innerHTML = `<input class="form-control form-control-sm mb-1" readonly value="${url}" onclick="this.select()">
    <a class="btn btn-sm btn-warning fw-bold" target="_blank" href="https://wa.me/?text=${encodeURIComponent('Histórico completo do meu carro: ' + url)}"><i class="bi bi-whatsapp"></i> Enviar pelo WhatsApp</a>`;
}
function renderShare(p) {
  const total = p.s.reduce((a, s) => a + s.cost, 0); show('viewShare');
  $('viewShare').innerHTML = `<div class="alert alert-warning"><i class="bi bi-patch-check-fill me-1"></i>Prontuário compartilhado pelo proprietário</div>
    <div class="card shadow-sm mb-3"><div class="card-body"><h4>${esc(p.v.model)}</h4>
    <div class="text-muted small">${esc(p.v.plate)} • ${p.v.year || ''} • ${(p.v.km || 0).toLocaleString('pt-BR')} km</div>
    <p class="mt-2 mb-0">${p.s.length} registros • ${brl(total)} investidos em manutenção</p></div></div>
    <div class="card shadow-sm"><div class="card-body"><h5 class="card-title">Histórico de manutenção</h5><ul class="list-group list-group-flush">${histHtml(p.s)}</ul></div></div>`;
}

const m = location.hash.match(/^#p=(.+)$/);
if (m) { try { renderShare(dec(m[1])); } catch { render(); } } else render();
