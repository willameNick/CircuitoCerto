# ⚡ Circuito Certo Pro

Cálculos elétricos com precisão e segurança — app web para dimensionamento
elétrico residencial/comercial baseado em valores de referência simplificados
da **NBR 5410**, agora com dimensionamento fotovoltaico (NBR 16690).

> Ferramenta educativa. Os resultados são referências simplificadas — toda
> instalação real deve ser projetada, validada e executada por um profissional
> habilitado.

## Funcionalidades

- **Dashboard**: consumo mensal estimado, potência e corrente total.
- **Equipamentos**: mais de 35 eletrodomésticos pré-cadastrados (com ícone e
  potência média de referência cada), busca rápida, e cadastro de quantos
  itens personalizados o usuário quiser (nome + potência + tensão), ajuste
  de potência/tensão/quantidade/horas de uso, e um gráfico de consumo.
- **Dimensionamento**: calcula disjuntor geral, cabo alimentador, IDR, DPS e
  queda de tensão a partir da carga total, com diagrama unifilar interativo.
- **Motor**: calculadora de motor elétrico (CV ou W), monofásico/bifásico/
  trifásico, cabo de cobre ou alumínio, distância — calcula corrente nominal,
  corrente de partida estimada, disjuntor, bitola de cabo e queda de tensão.
- **Fotovoltaico**: dimensionamento de sistemas ongrid/offgrid/híbridos —
  informe potência e quantidade dos módulos e a localização (UF); o app
  calcula geração em kWh/dia/mês/ano com base na irradiação solar da região,
  gera o esquema unifilar, recomenda o inversor e dimensiona disjuntores
  CA/CC, cabos, DPS, IDR e banco de baterias.
- **Normas**: tabelas de referência da NBR 5410 (ampacidade de cabos,
  disjuntores padronizados, seções mínimas, IDR/DPS, limites de queda de
  tensão) e NBR 16690 (fotovoltaico).
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
(Google Play / App Store), o caminho mais