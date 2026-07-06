# ⚡ CircuitoCerto

Cálculos elétricos com precisão e segurança — app web para dimensionamento
elétrico residencial/comercial baseado em valores de referência simplificados
da **NBR 5410**.

> Ferramenta educativa. Os resultados são referências simplificadas — toda
> instalação real deve ser projetada, validada e executada por um profissional
> habilitado.

## Funcionalidades

- **Dashboard**: consumo mensal estimado, potência e corrente total.
- **Equipamentos**: adicione da lista pré-definida (TV, geladeira, ar-condicionado
  9.000/12.000 BTU, ventilador, lâmpada, máquina de lavar, roteador, freezer ou
  item personalizado), ajuste potência/tensão/quantidade/horas de uso, e veja
  a corrente de cada equipamento e um gráfico de consumo.
- **Dimensionamento**: calcula disjuntor geral, cabo alimentador, IDR, DPS e
  queda de tensão a partir da carga total, com diagrama unifilar interativo.
- **Motor**: calculadora de motor elétrico (CV ou W), monofásico/bifásico/
  trifásico, cabo de cobre ou alumínio, distância — calcula corrente nominal,
  corrente de partida estimada, disjuntor, bitola de cabo e queda de tensão.
- **Normas**: tabelas de referência da NBR 5410 (ampacidade de cabos,
  disjuntores padronizados, seções mínimas, IDR/DPS, limites de queda de
  tensão).
- Estado salvo automaticamente (localStorage) entre sessões.

## Rodando localmente

Requer [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (geralmente `http://localhost:5173`).

## Build de produção

```bash
npm run build
npm run preview
```

Os arquivos de produção ficam em `dist/`, prontos para publicar em qualquer
hospedagem estática (Vercel, Netlify, GitHub Pages, etc.).

## Publicando um app nativo (Android/iOS)

Este projeto é um app web responsivo. Para gerar um app instalável nas lojas
(Google Play / App Store), o caminho mais direto é empacotar o build com
[Capacitor](https://capacitorjs.com/):

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npm run build
npx cap add android
npx cap add ios
npx cap copy
```

A partir daí, abra os projetos gerados no Android Studio / Xcode para gerar
os instaladores.

## Stack

- React 18 + Vite
- Tailwind CSS
- Recharts (gráficos)
- lucide-react (ícones)

## Assinatura

assinatura eletrônica: **N!coll@$**
