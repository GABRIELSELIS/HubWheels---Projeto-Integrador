# 🚗 HubWheels — Hub Digital de Manutenção e Histórico Veicular

Prontuário digital do veículo: registro de revisões e trocas de peças, alertas de IPVA, licenciamento, óleo e pneus
e link compartilhável do histórico para valorizar o carro na revenda.
Projeto Integrador — Design Profissional (Universidade Positivo).

## Funcionalidades do MVP
- Cadastro do veículo (modelo, placa, ano, km, valor de compra e de mercado)
- Lembretes automáticos (óleo, pneus, IPVA, licenciamento) com status ok / atenção / vencido e notificação no navegador
- Registro rápido pós-oficina: foto da nota, tipo, valor, km e marcação de "peça de qualidade"
- Prontuário com histórico completo e gasto total
- Indicador de desvalorização (valor de compra x mercado)
- Link do comprador (somente leitura) com botão de envio por WhatsApp

## Tecnologias
| Camada | Tecnologia |
|---|---|
| Interface | HTML5 + CSS3 + **Bootstrap 5.3** (CDN) + Bootstrap Icons |
| Lógica | JavaScript (ES6) |
| Persistência | `localStorage` do navegador |

## Estrutura
```
index.html     # interface (Bootstrap)
css/style.css  # identidade visual (vermelho, amarelo e grafite) e background
img/           # logo HubWheels e imagem de fundo
js/app.js      # regras de negócio, lembretes, prontuário, link do comprador
```

## Como executar localmente
Basta abrir o `index.html` no navegador (precisa de internet para carregar o Bootstrap via CDN).
Opcionalmente, com servidor local (necessário para notificações em alguns navegadores):
```bash
git clone <URL-DO-REPOSITORIO>
cd hubwheels
python -m http.server 8000     # ou: npx serve
```
Acesse http://localhost:8000. Para publicar online, use GitHub Pages.

## Observação
O link do comprador carrega o prontuário (sem as fotos das notas) codificado no próprio endereço; para o comprador abrir, o site precisa estar publicado (ex.: GitHub Pages).
