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

