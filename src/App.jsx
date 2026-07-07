import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Zap, Plus, Trash2, Gauge, ShieldCheck, Cable, ListChecks, Settings2, Info,
  LayoutDashboard, Wrench, BookOpen, Save, AlertTriangle, CheckCircle2,
  Sun, MapPin, Battery, Tv, Refrigerator, Snowflake, Fan, Lightbulb,
  WashingMachine, Router, Microwave, Flame, Coffee, Blend, ChefHat, Shirt,
  Heater, Speaker, Gamepad2, Printer, Monitor, Droplet, Droplets, Plug,
} from "lucide-react";

/* ============================== REFERENCE DATA ==============================
   Valores de referência simplificados baseados na NBR 5410 (método de
   instalação B1, condutores de PVC, 2 condutores carregados, 30°C ambiente).
   Um profissional habilitado deve validar o projeto final considerando
   todas as condições reais de instalação (agrupamento, temperatura, método,
   número de condutores, etc.) conforme a norma completa.
============================================================================ */

const CABLE_TABLE = [
  { s: 1.5, a: 17.5 }, { s: 2.5, a: 24 }, { s: 4, a: 32 }, { s: 6, a: 41 },
  { s: 10, a: 57 }, { s: 16, a: 76 }, { s: 25, a: 96 }, { s: 35, a: 119 },
  { s: 50, a: 144 }, { s: 70, a: 184 }, { s: 95, a: 223 }, { s: 120, a: 259 },
  { s: 150, a: 299 }, { s: 185, a: 341 }, { s: 240, a: 403 },
];

const BREAKERS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 70, 80, 100, 125];

const RHO = { cobre: 0.0178, aluminio: 0.0282 }; // Ω·mm²/m

/* Lista de eletrodomésticos mais comuns em residências, com potência média
   de referência (W). O usuário pode ajustar a potência de cada item depois
   de adicionado, ou cadastrar um equipamento totalmente personalizado. */
const EQUIP_PRESETS = [
  { id: "tv", name: "TV", power: 100, voltage: 127, fp: 0.9, circuito: "tomada" },
  { id: "geladeira", name: "Geladeira", power: 150, voltage: 127, fp: 0.8, circuito: "tomada" },
  { id: "freezer", name: "Freezer", power: 200, voltage: 127, fp: 0.8, circuito: "dedicado" },
  { id: "adega", name: "Adega climatizada", power: 100, voltage: 127, fp: 0.85, circuito: "tomada" },
  { id: "ar9", name: "Ar-condicionado 9.000 BTU", power: 850, voltage: 220, fp: 0.85, circuito: "dedicado" },
  { id: "ar12", name: "Ar-condicionado 12.000 BTU", power: 1100, voltage: 220, fp: 0.85, circuito: "dedicado" },
  { id: "ar18", name: "Ar-condicionado 18.000 BTU", power: 1700, voltage: 220, fp: 0.85, circuito: "dedicado" },
  { id: "ar24", name: "Ar-condicionado 24.000 BTU", power: 2200, voltage: 220, fp: 0.85, circuito: "dedicado" },
  { id: "ventilador", name: "Ventilador", power: 120, voltage: 127, fp: 0.85, circuito: "tomada" },
  { id: "exaustor", name: "Exaustor / coifa", power: 200, voltage: 127, fp: 0.85, circuito: "tomada" },
  { id: "lampada", name: "Lâmpada (LED)", power: 15, voltage: 127, fp: 1, circuito: "iluminacao" },
  { id: "maquina", name: "Máquina de lavar", power: 500, voltage: 127, fp: 0.8, circuito: "dedicado" },
  { id: "secadora", name: "Secadora de roupas", power: 2500, voltage: 220, fp: 0.9, circuito: "dedicado" },
  { id: "chuveiro", name: "Chuveiro elétrico", power: 5500, voltage: 220, fp: 0.95, circuito: "dedicado" },
  { id: "torneira", name: "Torneira elétrica", power: 3000, voltage: 220, fp: 0.95, circuito: "dedicado" },
  { id: "bomba", name: "Bomba d'água", power: 750, voltage: 220, fp: 0.8, circuito: "dedicado" },
  { id: "purificador", name: "Purificador de água", power: 90, voltage: 127, fp: 1, circuito: "tomada" },
  { id: "roteador", name: "Roteador / modem", power: 10, voltage: 127, fp: 1, circuito: "tomada" },
  { id: "microondas", name: "Micro-ondas", power: 1200, voltage: 127, fp: 0.95, circuito: "dedicado" },
  { id: "forno", name: "Forno elétrico", power: 1500, voltage: 220, fp: 0.95, circuito: "dedicado" },
  { id: "cooktop", name: "Cooktop elétrico", power: 3500, voltage: 220, fp: 0.95, circuito: "dedicado" },
  { id: "cafeteira", name: "Cafeteira elétrica", power: 800, voltage: 127, fp: 0.95, circuito: "tomada" },
  { id: "liquidificador", name: "Liquidificador", power: 400, voltage: 127, fp: 0.85, circuito: "tomada" },
  { id: "torradeira", name: "Torradeira", power: 800, voltage: 127, fp: 1, circuito: "tomada" },
  { id: "sanduicheira", name: "Sanduicheira / grill", power: 750, voltage: 127, fp: 1, circuito: "tomada" },
  { id: "ferro", name: "Ferro de passar roupa", power: 1200, voltage: 127, fp: 1, circuito: "dedicado" },
  { id: "secador", name: "Secador de cabelo", power: 1800, voltage: 127, fp: 1, circuito: "tomada" },
  { id: "aspirador", name: "Aspirador de pó", power: 1400, voltage: 127, fp: 0.85, circuito: "tomada" },
  { id: "aquecedor", name: "Aquecedor de ambiente", power: 1500, voltage: 127, fp: 0.95, circuito: "dedicado" },
  { id: "churrasqueira", name: "Churrasqueira elétrica", power: 1200, voltage: 220, fp: 0.95, circuito: "dedicado" },
  { id: "som", name: "Som / home theater", power: 150, voltage: 127, fp: 0.9, circuito: "tomada" },
  { id: "videogame", name: "Videogame", power: 200, voltage: 127, fp: 0.95, circuito: "tomada" },
  { id: "impressora", name: "Impressora", power: 50, voltage: 127, fp: 1, circuito: "tomada" },
  { id: "computador", name: "Computador / notebook", power: 150, voltage: 127, fp: 0.95, circuito: "tomada" },
  { id: "outro", name: "Outro (personalizado)", power: 100, voltage: 127, fp: 1, circuito: "tomada" },
];

/* Pequeno ícone de referência para cada equipamento da lista. */
const EQUIP_ICONS = {
  tv: Tv, geladeira: Refrigerator, freezer: Refrigerator, adega: Snowflake,
  ar9: Snowflake, ar12: Snowflake, ar18: Snowflake, ar24: Snowflake,
  ventilador: Fan, exaustor: Fan, lampada: Lightbulb, maquina: WashingMachine,
  secadora: WashingMachine, chuveiro: Droplets, torneira: Droplet, bomba: Droplet,
  purificador: Droplet, roteador: Router, microondas: Microwave, forno: Flame,
  cooktop: Flame, cafeteira: Coffee, liquidificador: Blend, torradeira: ChefHat,
  sanduicheira: ChefHat, ferro: Shirt, secador: Fan, aspirador: Zap,
  aquecedor: Heater, churrasqueira: Flame, som: Speaker, videogame: Gamepad2,
  impressora: Printer, computador: Monitor, outro: Plug,
};

const MIN_SECTION_BY_CIRCUIT = { iluminacao: 1.5, tomada: 2.5, dedicado: 2.5 };

function pickCable(current, minSize = 1.5) {
  for (const row of CABLE_TABLE) {
    if (row.s >= minSize && row.a >= current) return row;
  }
  return { ...CABLE_TABLE[CABLE_TABLE.length - 1], overflow: true };
}
function pickBreaker(current) {
  for (const b of BREAKERS) if (b >= current) return b;
  return BREAKERS[BREAKERS.length - 1];
}
function currentOf(power, qty, voltage, fp, phase = "mono") {
  const p = power * qty;
  if (phase === "tri") return p / (Math.sqrt(3) * voltage * fp);
  return p / (voltage * fp);
}
function voltageDropPct(current, lengthM, areaMm2, material, phase, voltage) {
  const rho = RHO[material];
  const factor = phase === "tri" ? Math.sqrt(3) : 2;
  const dv = (factor * rho * lengthM * current) / areaMm2;
  return (dv / voltage) * 100;
}
function pickDPS(voltage) {
  if (voltage <= 130) return { classe: "II", tensao: "175V", ik: "20kA" };
  if (voltage <= 250) return { classe: "II", tensao: "275V", ik: "20kA" };
  return { classe: "II", tensao: "420V", ik: "20kA" };
}
function pickIDR(mainBreaker) {
  const idrSizes = [25, 40, 63, 80, 100];
  for (const s of idrSizes) if (s >= mainBreaker) return s;
  return idrSizes[idrSizes.length - 1];
}
const uid = () => Math.random().toString(36).slice(2, 10);

/* ============================== SOLAR REFERENCE DATA ==============================
   Estimativas simplificadas de irradiação solar média (HSP — Horas de Sol
   Pleno, em kWh/m²/dia) por estado, baseadas em médias aproximadas do Atlas
   Brasileiro de Energia Solar. São valores de referência para fins
   educativos: um projeto real deve usar dados de irradiância local
   (CRESESB/INPE) ou medição em campo.
============================================================================ */
const HSP_BY_UF = {
  AC: 4.8, AL: 5.5, AP: 4.9, AM: 4.6, BA: 5.5, CE: 5.7, DF: 5.3, ES: 5.0,
  GO: 5.4, MA: 5.3, MT: 5.2, MS: 5.3, MG: 5.3, PA: 4.9, PB: 5.6, PR: 4.8,
  PE: 5.6, PI: 5.6, RJ: 4.9, RN: 5.8, RS: 4.7, RO: 4.7, RR: 4.9, SC: 4.5,
  SP: 4.9, SE: 5.5, TO: 5.4,
};
const UF_NAMES = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia",
  CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás",
  MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul",
  MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná",
  PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte", RS: "Rio Grande do Sul", RO: "Rondônia",
  RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe",
  TO: "Tocantins",
};
const UF_LIST = Object.keys(UF_NAMES).sort((a, b) => UF_NAMES[a].localeCompare(UF_NAMES[b]));

const INVERTER_SIZES = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50]; // kW
const BATTERY_TYPES = {
  litio: { label: "Lítio (LiFePO4)", dod: 0.9 },
  chumbo: { label: "Chumbo-ácido (estacionária)", dod: 0.5 },
};
const MODULE_VMP_REF = 37; // V — referência simplificada de tensão de módulo (Vmp) para estimar corrente/strings
const PV_PERFORMANCE_RATIO = 0.8; // referência simplificada de perdas globais do sistema (~80% de performance ratio)
const DC_AC_OVERSIZE_RATIO = 1.15; // referência simplificada de fator de dimensionamento DC/AC do inversor

function pickInverter(kw) {
  for (const s of INVERTER_SIZES) if (s >= kw) return s;
  return INVERTER_SIZES[INVERTER_SIZES.length - 1];
}
function pickBatteryVoltage(kwp) {
  if (kwp <= 1.5) return 12;
  if (kwp <= 5) return 24;
  return 48;
}

/* ============================== STORAGE HELPERS ==============================
   Usa window.storage quando disponível (ambiente Claude Artifacts) e cai
   automaticamente para localStorage quando rodando como app standalone
   (ex.: após clonar do GitHub e rodar com `npm run dev`).
============================================================================ */
async function saveState(key, value) {
  try {
    if (window.storage) {
      await window.storage.set(key, JSON.stringify(value), false);
      return;
    }
  } catch (e) { /* silent */ }
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* silent */ }
}
async function loadState(key, fallback) {
  try {
    if (window.storage) {
      const r = await window.storage.get(key, false);
      if (r && r.value) return JSON.parse(r.value);
      return fallback;
    }
  } catch (e) { /* not found or error, fall through to localStorage */ }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* silent */ }
  return fallback;
}

/* ============================== SMALL UI PIECES ============================== */
function Panel({ title, icon: Icon, children, className = "" }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          {Icon && <Icon className="w-4 h-4 text-orange-400" />}
          <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}
function Stat({ label, value, unit, tone = "orange" }) {
  const toneMap = {
    orange: "text-orange-400", blue: "text-blue-400",
    green: "text-emerald-400", red: "text-red-400", yellow: "text-yellow-400",
    purple: "text-purple-400",
  };
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 flex-1 min-w-[120px]">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`font-mono text-xl font-bold ${toneMap[tone]}`}>
        {value}<span className="text-xs text-slate-500 ml-1">{unit}</span>
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-400">
      {label}
      {children}
    </label>
  );
}
const inputCls = "bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/60";
const selectCls = inputCls + " appearance-none";

/* ============================== DIAGRAM ============================== */
function LegendWires() {
  return (
    <div className="flex gap-4 text-xs text-slate-400 mt-4 flex-wrap">
      <span className="flex items-center gap-1"><span className="w-3 h-1 bg-red-500 inline-block rounded" /> Fase</span>
      <span className="flex items-center gap-1"><span className="w-3 h-1 bg-blue-500 inline-block rounded" /> Neutro</span>
      <span className="flex items-center gap-1"><span className="w-3 h-1 bg-emerald-500 inline-block rounded" /> Terra</span>
    </div>
  );
}
function UnifilarDiagram({ mainInfo, circuits }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[560px] flex flex-col items-center py-2">
        <NodeBox label="REDE CONCESSIONÁRIA" muted />
        <Wire />
        <NodeBox label="MEDIDOR" sub={mainInfo.consumoLabel} />
        <Wire />
        <NodeBox label="DISJUNTOR GERAL" sub={`${mainInfo.mainBreaker} A`} highlight="orange" />
        <Wire />
        <NodeBox label="IDR (DR)" sub={`${mainInfo.idr} A / 30 mA`} highlight="blue" />
        <Wire />
        <NodeBox label="DPS" sub={`${mainInfo.dps.tensao} / ${mainInfo.dps.ik} (Classe ${mainInfo.dps.classe})`} highlight="red" />
        <Wire />
        <div className="w-full border-t-2 border-dashed border-slate-700 mt-2 pt-4 flex gap-4 flex-wrap justify-center">
          {circuits.map((c) => (
            <div key={c.id} className="flex flex-col items-center">
              <div className="w-px h-4 bg-slate-600" />
              <NodeBox small label={c.label} sub={`Disj: ${c.breaker} A`} sub2={`Cabo: ${c.section} mm²`} highlight={c.overflow ? "red" : "green"} />
            </div>
          ))}
          {circuits.length === 0 && (
            <div className="text-slate-500 text-sm py-4">Adicione equipamentos para gerar os circuitos ramais.</div>
          )}
        </div>
        <LegendWires />
      </div>
    </div>
  );
}
function Wire() { return <div className="w-px h-5 bg-slate-600" />; }
function NodeBox({ label, sub, sub2, muted, highlight, small }) {
  const highlightMap = {
    orange: "border-orange-500/60 text-orange-300",
    blue: "border-blue-500/60 text-blue-300",
    red: "border-red-500/60 text-red-300",
    green: "border-emerald-500/60 text-emerald-300",
  };
  return (
    <div className={`rounded-xl border ${highlight ? highlightMap[highlight] : "border-slate-700 text-slate-300"}
      ${muted ? "bg-transparent text-slate-500 border-dashed" : "bg-slate-950"}
      px-3 py-2 text-center ${small ? "min-w-[110px]" : "min-w-[200px]"}`}>
      <div className={`font-semibold ${small ? "text-xs" : "text-sm"}`}>{label}</div>
      {sub && <div className="font-mono text-xs mt-0.5">{sub}</div>}
      {sub2 && <div className="font-mono text-xs">{sub2}</div>}
    </div>
  );
}

/* ============================== SOLAR DIAGRAM ============================== */
function SolarPanelIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="23" height="15" rx="1.5" className="stroke-current" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
      <line x1="6" y1="0.5" x2="6" y2="15.5" className="stroke-current" strokeWidth="0.6" />
      <line x1="12" y1="0.5" x2="12" y2="15.5" className="stroke-current" strokeWidth="0.6" />
      <line x1="18" y1="0.5" x2="18" y2="15.5" className="stroke-current" strokeWidth="0.6" />
      <line x1="0.5" y1="8" x2="23.5" y2="8" className="stroke-current" strokeWidth="0.6" />
    </svg>
  );
}
const SYSTEM_TYPE_LABEL = { ongrid: "On-grid", offgrid: "Off-grid", hybrid: "Híbrido" };
function SolarUnifilarDiagram({ qty, modulesPerString, numStrings, potenciaKwp, geracaoMensal, inverterKw, systemType, acInfo, batteryInfo }) {
  const MAX_ICONS = 60;
  const shown = Math.min(qty, MAX_ICONS);
  const showGrid = systemType === "ongrid" || systemType === "hybrid";
  const showBattery = systemType === "offgrid" || systemType === "hybrid";
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[560px] flex flex-col items-center py-2">
        <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
          {qty} módulo{qty === 1 ? "" : "s"} · {numStrings} string{numStrings === 1 ? "" : "s"} de até {modulesPerString}
        </div>
        <div className="flex flex-wrap gap-1 justify-center max-w-md mb-2">
          {Array.from({ length: shown }).map((_, i) => (
            <SolarPanelIcon key={i} className="w-6 h-4 text-orange-400" />
          ))}
          {qty > MAX_ICONS && <span className="text-[10px] text-slate-500 self-center ml-1">+{qty - MAX_ICONS}</span>}
        </div>
        <Wire />
        <NodeBox label="STRINGS / COMBINADOR CC" sub={`${numStrings}x — Disj. CC + DPS CC`} highlight="orange" />
        <Wire />
        <NodeBox
          label="INVERSOR"
          sub={`${inverterKw} kW · ${SYSTEM_TYPE_LABEL[systemType]}`}
          sub2={`${potenciaKwp.toFixed(2)} kWp · ${geracaoMensal.toFixed(0)} kWh/mês`}
          highlight="blue"
        />
        <Wire />
        <div className="w-full border-t-2 border-dashed border-slate-700 mt-2 pt-4 flex gap-6 flex-wrap justify-center">
          {showGrid && (
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-slate-600" />
              <NodeBox small label="DPS/DISJ. CA + IDR" sub={`${acInfo.disjuntorCA} A`} sub2={`Cabo: ${acInfo.caboCA} mm²`} highlight="red" />
              <div className="w-px h-4 bg-slate-600" />
              <NodeBox small label="REDE CONCESSIONÁRIA" muted />
            </div>
          )}
          {showBattery && (
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-slate-600" />
              <NodeBox small label="BANCO DE BATERIAS" sub={`${batteryInfo.voltage} V`} sub2={`${batteryInfo.ah.toFixed(0)} Ah`} highlight="green" />
            </div>
          )}
        </div>
        <LegendWires />
      </div>
    </div>
  );
}

/* ============================== DASHBOARD TAB ============================== */
function DashboardTab({ stats, setTab }) {
  const shortcuts = [
    { id: "equipamentos", label: "Equipamentos", icon: ListChecks, tone: "text-blue-400" },
    { id: "dimensionamento", label: "Dimensionamento", icon: Gauge, tone: "text-orange-400" },
    { id: "motor", label: "Cálculo de Motor", icon: Wrench, tone: "text-purple-400" },
    { id: "fotovoltaico", label: "Fotovoltaico", icon: Sun, tone: "text-yellow-400" },
    { id: "normas", label: "Normas NBR 5410", icon: BookOpen, tone: "text-emerald-400" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <Panel title="Consumo mensal estimado" icon={Gauge}>
        <div className="font-mono text-3xl font-bold text-orange-400">
          {stats.kwhMonth.toFixed(2)} <span className="text-sm text-slate-500">kWh/mês</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Baseado nas horas de uso informadas em cada equipamento.</p>
      </Panel>
      <div className="flex gap-3 flex-wrap">
        <Stat label="Potência total" value={stats.totalPower.toFixed(0)} unit="W" tone="orange" />
        <Stat label="Corrente total (entrada)" value={stats.totalCurrent.toFixed(1)} unit="A" tone="blue" />
        <Stat label="Equipamentos" value={stats.count} unit="itens" tone="green" />
      </div>
      <Panel title="Ações rápidas" icon={Zap}>
        <div className="grid grid-cols-2 gap-3">
          {shortcuts.map((s) => (
            <button key={s.id} onClick={() => setTab(s.id)}
              className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-orange-500/60 transition rounded-xl px-3 py-3 text-left">
              <s.icon className={`w-4 h-4 ${s.tone}`} />
              <span className="text-sm text-slate-200">{s.label}</span>
            </button>
          ))}
        </div>
      </Panel>
      <Panel title="Sobre o app" icon={Info}>
        <p className="text-xs text-slate-400 leading-relaxed">
          Circuito Certo Pro ajuda a estimar cargas, corrente e dimensionamento de cabos/disjuntores
          com base em valores de referência da NBR 5410, além de um dimensionamento simplificado
          de sistemas fotovoltaicos. Os resultados são educativos — a instalação real deve ser
          projetada e executada por um profissional habilitado.
        </p>
      </Panel>
    </div>
  );
}

/* ============================== EQUIPAMENTOS TAB ============================== */
function EquipamentosTab({ equipment, setEquipment, phase }) {
  const [presetId, setPresetId] = useState(EQUIP_PRESETS[0].id);
  const [filter, setFilter] = useState("");
  const [customName, setCustomName] = useState("");
  const [customPower, setCustomPower] = useState(100);
  const [customVoltage, setCustomVoltage] = useState(127);

  const isCustom = presetId === "outro";

  const filteredPresets = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return EQUIP_PRESETS;
    return EQUIP_PRESETS.filter((p) => p.name.toLowerCase().includes(q));
  }, [filter]);

  function pushEquipment(entry) {
    setEquipment((prev) => [...prev, { id: uid(), qty: 1, hours: 2, ...entry }]);
  }

  function quickAdd(id) {
    setPresetId(id);
    if (id === "outro") return; // apenas seleciona; usuário preenche nome/potência
    const p = EQUIP_PRESETS.find((e) => e.id === id);
    pushEquipment({ presetId: p.id, name: p.name, power: p.power, voltage: p.voltage, fp: p.fp, circuito: p.circuito });
  }

  function addCustom() {
    const name = customName.trim();
    if (!name) return;
    pushEquipment({ presetId: "outro", name, power: Math.max(1, Number(customPower) || 0), voltage: customVoltage, fp: 1, circuito: "tomada" });
    setCustomName("");
  }

  function updateRow(id, patch) {
    setEquipment((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function removeRow(id) {
    setEquipment((prev) => prev.filter((r) => r.id !== id));
  }

  const rows = useMemo(() => equipment.map((r) => {
    const current = currentOf(r.power, r.qty, r.voltage, r.fp, "mono");
    const kwh = (r.power * r.qty * r.hours * 30) / 1000;
    const minSection = MIN_SECTION_BY_CIRCUIT[r.circuito] || 2.5;
    const cable = pickCable(current, minSection);
    const breaker = pickBreaker(current);
    return { ...r, current, kwh, cable, breaker };
  }), [equipment]);

  const chartData = rows.map((r) => ({ name: r.name.length > 14 ? r.name.slice(0, 13) + "…" : r.name, potencia: r.power * r.qty }));

  return (
    <div className="flex flex-col gap-4">
      <Panel title="Adicionar equipamento" icon={Plus}>
        <Field label="Buscar na lista">
          <input className={inputCls} placeholder="Ex.: chuveiro, ar-condicionado, tv..." value={filter}
            onChange={(e) => setFilter(e.target.value)} />
        </Field>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3 max-h-64 overflow-y-auto pr-1">
          {filteredPresets.map((p) => {
            const Icon = EQUIP_ICONS[p.id] || Plug;
            const active = presetId === p.id;
            return (
              <button key={p.id} onClick={() => quickAdd(p.id)}
                className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition
                  ${active ? "border-orange-500/70 bg-orange-500/10" : "border-slate-800 bg-slate-950 hover:border-slate-600"}`}>
                <Icon className={`w-6 h-6 ${active ? "text-orange-400" : "text-slate-400"}`} />
                <span className="text-[11px] leading-tight text-slate-200">{p.name}</span>
                {p.id !== "outro" && <span className="text-[10px] font-mono text-slate-500">{p.power} W</span>}
              </button>
            );
          })}
          {filteredPresets.length === 0 && (
            <div className="col-span-full text-sm text-slate-500 py-4 text-center">Nenhum equipamento encontrado para "{filter}".</div>
          )}
        </div>

        {isCustom && (
          <div className="mt-3 bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
            <p className="text-xs text-slate-400 flex gap-1">
              <Info className="w-3 h-3 mt-0.5 shrink-0" />
              Digite o nome e a potência do equipamento que não está na lista. Você pode adicionar
              quantos equipamentos personalizados quiser, um de cada vez.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Nome do equipamento">
                <input className={inputCls} placeholder="Ex.: Aquário, Sauna..." value={customName}
                  onChange={(e) => setCustomName(e.target.value)} />
              </Field>
              <Field label="Potência (W)">
                <input type="number" min={1} className={inputCls} value={customPower}
                  onChange={(e) => setCustomPower(Number(e.target.value) || 0)} />
              </Field>
              <Field label="Tensão (V)">
                <select className={selectCls} value={customVoltage} onChange={(e) => setCustomVoltage(Number(e.target.value))}>
                  <option value={127}>127</option>
                  <option value={220}>220</option>
                </select>
              </Field>
            </div>
            <button onClick={addCustom} disabled={!customName.trim()}
              className="self-start bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:hover:bg-orange-500 transition text-slate-950 font-semibold rounded-lg px-4 py-2 flex items-center gap-1 text-sm">
              <Plus className="w-4 h-4" /> Adicionar personalizado
            </button>
          </div>
        )}
      </Panel>

      <Panel title={`Lista de equipamentos (${rows.length})`} icon={ListChecks}>
        {rows.length === 0 && <p className="text-sm text-slate-500">Nenhum equipamento adicionado ainda.</p>}
        <div className="flex flex-col gap-3">
          {rows.map((r) => {
            const Icon = EQUIP_ICONS[r.presetId] || Plug;
            return (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-orange-400 shrink-0" />
                    <div className="text-sm font-semibold text-slate-200">{r.name}</div>
                  </div>
                  <button onClick={() => removeRow(r.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Field label="Nome">
                    <input className={inputCls} value={r.name}
                      onChange={(e) => updateRow(r.id, { name: e.target.value })} />
                  </Field>
                  <Field label="Tensão (V)">
                    <select className={selectCls} value={r.voltage} onChange={(e) => updateRow(r.id, { voltage: Number(e.target.value) })}>
                      <option value={127}>127</option>
                      <option value={220}>220</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Field label="Potência (W)">
                    <input type="number" className={inputCls} value={r.power}
                      onChange={(e) => updateRow(r.id, { power: Number(e.target.value) || 0 })} />
                  </Field>
                  <Field label="Qtd.">
                    <input type="number" min={1} className={inputCls} value={r.qty}
                      onChange={(e) => updateRow(r.id, { qty: Math.max(1, Number(e.target.value) || 1) })} />
                  </Field>
                  <Field label="Uso (h/dia)">
                    <input type="number" min={0} className={inputCls} value={r.hours}
                      onChange={(e) => updateRow(r.id, { hours: Number(e.target.value) || 0 })} />
                  </Field>
                </div>
                <div className="flex gap-3 mt-3 flex-wrap text-xs font-mono">
                  <span className="text-blue-400">I = {r.current.toFixed(2)} A</span>
                  <span className="text-emerald-400">{r.kwh.toFixed(1)} kWh/mês</span>
                  <span className="text-orange-400">Disjuntor: {r.breaker} A</span>
                  <span className="text-slate-300">Cabo: {r.cable.s} mm²</span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {rows.length > 0 && (
        <Panel title="Gráfico de consumo por equipamento (W)" icon={Gauge}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} height={60} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", fontSize: 12 }} labelStyle={{ color: "#e2e8f0" }} />
                <Bar dataKey="potencia" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? "#fb923c" : "#60a5fa"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      )}
    </div>
  );
}

/* ============================== DIMENSIONAMENTO TAB ============================== */
function DimensionamentoTab({ equipment, network, setNetwork }) {
  const rows = useMemo(() => equipment.map((r) => {
    const current = currentOf(r.power, r.qty, r.voltage, r.fp, "mono");
    const minSection = MIN_SECTION_BY_CIRCUIT[r.circuito] || 2.5;
    const cable = pickCable(current, minSection);
    const breaker = pickBreaker(current);
    return { id: r.id, label: r.name, current, breaker, section: cable.s, overflow: cable.overflow };
  }), [equipment]);

  const apparentTotal = useMemo(() =>
    equipment.reduce((acc, r) => acc + (r.power * r.qty) / (r.fp || 1), 0), [equipment]);

  const demanded = apparentTotal * network.demand;
  const isTri = network.supply === "380-tri" || network.supply === "220-tri";
  const supplyVoltage = network.supply.startsWith("380") ? 380 : network.supply.startsWith("220") ? 220 : 127;
  const totalCurrent = isTri ? demanded / (Math.sqrt(3) * supplyVoltage) : demanded / supplyVoltage;

  const mainBreaker = pickBreaker(totalCurrent);
  const mainCable = pickCable(totalCurrent, 6);
  const idr = pickIDR(mainBreaker);
  const dps = pickDPS(supplyVoltage);
  const dropPct = voltageDropPct(totalCurrent, network.feederLength, mainCable.s, network.material, isTri ? "tri" : "mono", supplyVoltage);

  const consumoMes = equipment.reduce((acc, r) => acc + (r.power * r.qty * r.hours * 30) / 1000, 0);

  return (
    <div className="flex flex-col gap-4">
      <Panel title="Configuração da entrada de energia" icon={Settings2}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo de fornecimento">
            <select className={selectCls} value={network.supply} onChange={(e) => setNetwork((n) => ({ ...n, supply: e.target.value }))}>
              <option value="127-mono">Monofásico 127V</option>
              <option value="220-mono">Monofásico 220V</option>
              <option value="220-tri">Trifásico 220V</option>
              <option value="380-tri">Trifásico 380V</option>
            </select>
          </Field>
          <Field label="Material do cabo alimentador">
            <select className={selectCls} value={network.material} onChange={(e) => setNetwork((n) => ({ ...n, material: e.target.value }))}>
              <option value="cobre">Cobre</option>
              <option value="aluminio">Alumínio</option>
            </select>
          </Field>
          <Field label="Fator de demanda (0.5–1.0)">
            <input type="number" step="0.05" min="0.5" max="1" className={inputCls} value={network.demand}
              onChange={(e) => setNetwork((n) => ({ ...n, demand: Number(e.target.value) || 1 }))} />
          </Field>
          <Field label="Distância do alimentador (m)">
            <input type="number" min="1" className={inputCls} value={network.feederLength}
              onChange={(e) => setNetwork((n) => ({ ...n, feederLength: Number(e.target.value) || 1 }))} />
          </Field>
        </div>
        <p className="text-xs text-slate-500 mt-2 flex gap-1"><Info className="w-3 h-3 mt-0.5 shrink-0" /> O fator de demanda simplifica a diversidade de uso simultâneo das cargas; sem informação mais precisa, mantenha 1.0 para dimensionamento mais seguro.</p>
      </Panel>

      <div className="flex gap-3 flex-wrap">
        <Stat label="Corrente total" value={totalCurrent.toFixed(1)} unit="A" tone="blue" />
        <Stat label="Disjuntor geral" value={mainBreaker} unit="A" tone="orange" />
        <Stat label="Cabo alimentador" value={mainCable.s} unit="mm²" tone="green" />
        <Stat label="Queda de tensão" value={dropPct.toFixed(2)} unit="%" tone={dropPct > 4 ? "red" : "green"} />
      </div>
      {dropPct > 4 && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> Queda de tensão acima de 4% — considere aumentar a bitola do cabo alimentador ou reduzir a distância.
        </div>
      )}
      {mainCable.overflow && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> Corrente acima da tabela de referência simplificada — projeto exige dimensionamento por engenharia especializada (cabos de grande porte / instalação industrial).
        </div>
      )}

      <Panel title="Proteções recomendadas" icon={ShieldCheck}>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">IDR (DR)</div>
            <div className="font-mono text-blue-300">{idr} A / 30 mA</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">DPS</div>
            <div className="font-mono text-red-300">{dps.tensao} · {dps.ik} · Classe {dps.classe}</div>
          </div>
        </div>
      </Panel>

      <Panel title="Esquema unifilar" icon={Cable}>
        <UnifilarDiagram
          mainInfo={{ mainBreaker, idr, dps, consumoLabel: `Consumo: ${consumoMes.toFixed(0)} kWh/mês` }}
          circuits={rows}
        />
      </Panel>

      <Panel title="Dimensionamento por circuito" icon={ListChecks}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 text-left">
                <th className="py-1 pr-2">Circuito</th>
                <th className="py-1 pr-2">Corrente</th>
                <th className="py-1 pr-2">Disjuntor</th>
                <th className="py-1 pr-2">Cabo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-800">
                  <td className="py-1 pr-2 text-slate-200">{r.label}</td>
                  <td className="py-1 pr-2 font-mono text-blue-300">{r.current.toFixed(2)} A</td>
                  <td className="py-1 pr-2 font-mono text-orange-300">{r.breaker} A</td>
                  <td className="py-1 pr-2 font-mono text-emerald-300">{r.section} mm²</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="py-3 text-slate-500">Adicione equipamentos na aba "Equipamentos".</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ============================== MOTOR TAB ============================== */
function MotorTab() {
  const [m, setM] = useState({
    mode: "cv", cv: 2, watts: 1500, voltage: 220, phase: "monofasico",
    material: "cobre", distance: 20, fp: 0.8, eff: 0.85,
  });
  function upd(patch) { setM((prev) => ({ ...prev, ...patch })); }

  const mecPower = m.mode === "cv" ? m.cv * 735.5 : m.watts;
  const elecPower = mecPower / m.eff;
  const phaseKey = m.phase === "trifasico" ? "tri" : "mono";
  const current = currentOf(elecPower, 1, m.voltage, m.fp, phaseKey);
  const startCurrent = current * 6.5; // referência: partida direta ~6-8x In

  const minSection = 2.5;
  const cable = pickCable(current, minSection);
  const breaker = pickBreaker(current * 1.3); // margem para corrente de partida (referência)
  const dropPct = voltageDropPct(current, m.distance, cable.s, m.material, phaseKey, m.voltage);

  const circuits = [{ id: "motor", label: "Motor", breaker, section: cable.s, overflow: cable.overflow }];
  const idr = pickIDR(breaker);
  const dps = pickDPS(m.voltage);

  return (
    <div className="flex flex-col gap-4">
      <Panel title="Dados do motor" icon={Wrench}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Unidade de potência">
            <select className={selectCls} value={m.mode} onChange={(e) => upd({ mode: e.target.value })}>
              <option value="cv">CV</option>
              <option value="w">Watts</option>
            </select>
          </Field>
          {m.mode === "cv" ? (
            <Field label="Potência (CV)">
              <input type="number" step="0.1" className={inputCls} value={m.cv} onChange={(e) => upd({ cv: Number(e.target.value) || 0 })} />
            </Field>
          ) : (
            <Field label="Potência (W)">
              <input type="number" className={inputCls} value={m.watts} onChange={(e) => upd({ watts: Number(e.target.value) || 0 })} />
            </Field>
          )}
          <Field label="Tipo de motor">
            <select className={selectCls} value={m.phase} onChange={(e) => upd({ phase: e.target.value })}>
              <option value="monofasico">Monofásico</option>
              <option value="bifasico">Bifásico</option>
              <option value="trifasico">Trifásico</option>
            </select>
          </Field>
          <Field label="Tensão (V)">
            <select className={selectCls} value={m.voltage} onChange={(e) => upd({ voltage: Number(e.target.value) })}>
              <option value={127}>127</option>
              <option value={220}>220</option>
              <option value={380}>380</option>
            </select>
          </Field>
          <Field label="Material do cabo">
            <select className={selectCls} value={m.material} onChange={(e) => upd({ material: e.target.value })}>
              <option value="cobre">Cobre</option>
              <option value="aluminio">Alumínio</option>
            </select>
          </Field>
          <Field label="Distância (m)">
            <input type="number" min="1" className={inputCls} value={m.distance} onChange={(e) => upd({ distance: Number(e.target.value) || 1 })} />
          </Field>
          <Field label="Fator de potência">
            <input type="number" step="0.05" min="0.5" max="1" className={inputCls} value={m.fp} onChange={(e) => upd({ fp: Number(e.target.value) || 0.8 })} />
          </Field>
          <Field label="Eficiência do motor">
            <input type="number" step="0.05" min="0.5" max="1" className={inputCls} value={m.eff} onChange={(e) => upd({ eff: Number(e.target.value) || 0.85 })} />
          </Field>
        </div>
      </Panel>

      <div className="flex gap-3 flex-wrap">
        <Stat label="Corrente nominal" value={current.toFixed(2)} unit="A" tone="blue" />
        <Stat label="Corrente de partida (~6.5x)" value={startCurrent.toFixed(1)} unit="A" tone="red" />
        <Stat label="Disjuntor" value={breaker} unit="A" tone="orange" />
        <Stat label="Cabo" value={cable.s} unit="mm²" tone="green" />
        <Stat label="Queda de tensão" value={dropPct.toFixed(2)} unit="%" tone={dropPct > 4 ? "red" : "green"} />
      </div>
      {dropPct > 4 && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> Queda de tensão acima de 4% — aumente a bitola do cabo ou reduza a distância até o motor.
        </div>
      )}
      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
        <Info className="w-4 h-4 shrink-0" /> Motores exigem proteção específica contra sobrecarga (relé térmico) além do disjuntor — o disjuntor aqui aplica uma margem simplificada de 1,3× In para suportar a partida; valide com o fabricante do motor.
      </div>

      <Panel title="Esquema unifilar do motor" icon={Cable}>
        <UnifilarDiagram
          mainInfo={{ mainBreaker: breaker, idr, dps, consumoLabel: `Potência elétrica: ${(elecPower / 1000).toFixed(2)} kW` }}
          circuits={circuits}
        />
      </Panel>
    </div>
  );
}

/* ============================== FOTOVOLTAICO TAB ============================== */
function FotovoltaicoTab({ solar, setSolar, equipment, kwhMonth }) {
  function upd(patch) { setSolar((s) => ({ ...s, ...patch })); }
  function selectUF(uf) { setSolar((s) => ({ ...s, uf, hsp: HSP_BY_UF[uf] })); }

  const qty = Math.max(1, Number(solar.qty) || 1);
  const modulePower = Math.max(1, Number(solar.modulePower) || 0);

  const potenciaInstaladaW = modulePower * qty;
  const potenciaInstaladaKwp = potenciaInstaladaW / 1000;

  const hsp = Math.max(0, Number(solar.hsp) || 0);
  const geracaoDiaria = potenciaInstaladaKwp * hsp * PV_PERFORMANCE_RATIO;
  const geracaoMensal = geracaoDiaria * 30;
  const geracaoAnual = geracaoDiaria * 365;

  const inversorRecomendado = pickInverter(potenciaInstaladaKwp / DC_AC_OVERSIZE_RATIO);

  const isTri = solar.acSupply === "220-tri" || solar.acSupply === "380-tri";
  const acVoltage = solar.acSupply.startsWith("380") ? 380 : solar.acSupply.startsWith("220") ? 220 : 127;
  const acCurrent = isTri
    ? (inversorRecomendado * 1000) / (Math.sqrt(3) * acVoltage)
    : (inversorRecomendado * 1000) / acVoltage;
  const disjuntorCA = pickBreaker(acCurrent);
  const caboCA = pickCable(acCurrent, 2.5);
  const dpsCA = pickDPS(acVoltage);
  const idrCA = pickIDR(disjuntorCA);

  const modulesPerString = Math.max(1, Math.min(Number(solar.modulesPerString) || 1, qty));
  const numStrings = Math.max(1, Math.ceil(qty / modulesPerString));
  const correntePorModulo = modulePower / MODULE_VMP_REF;
  const tensaoString = modulesPerString * MODULE_VMP_REF;
  const correnteString = correntePorModulo;
  const correnteTotalCC = correnteString * numStrings;
  const caboCC = pickCable(correnteString * 1.25, 4);
  const disjuntorCCString = pickBreaker(correnteString * 1.25);
  const disjuntorCCGeral = pickBreaker(correnteTotalCC * 1.25);

  const showGrid = solar.systemType === "ongrid" || solar.systemType === "hybrid";
  const showBattery = solar.systemType === "offgrid" || solar.systemType === "hybrid";

  const consumoDiarioRef = equipment.length > 0 ? kwhMonth / 30 : geracaoDiaria;
  const consumoDiarioFonte = equipment.length > 0 ? "equipamentos cadastrados" : "geração diária estimada (nenhum equipamento cadastrado)";
  const batteryVoltage = pickBatteryVoltage(potenciaInstaladaKwp);
  const battType = BATTERY_TYPES[solar.batteryType] || BATTERY_TYPES.litio;
  const autonomyDays = Math.max(0.5, Number(solar.autonomyDays) || 1);
  const energiaNecessariaKwh = consumoDiarioRef * autonomyDays;
  const capacidadeBancoAh = battType.dod > 0 ? (energiaNecessariaKwh * 1000) / (batteryVoltage * battType.dod) : 0;

  return (
    <div className="flex flex-col gap-4">
      <Panel title="Módulos fotovoltaicos" icon={Sun}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Potência de cada módulo (Wp)">
            <input type="number" min={1} className={inputCls} value={solar.modulePower}
              onChange={(e) => upd({ modulePower: Number(e.target.value) || 0 })} />
          </Field>
          <Field label="Quantidade de módulos">
            <input type="number" min={1} className={inputCls} value={solar.qty}
              onChange={(e) => upd({ qty: Math.max(1, Number(e.target.value) || 1) })} />
          </Field>
          <Field label="Tipo de sistema">
            <select className={selectCls} value={solar.systemType} onChange={(e) => upd({ systemType: e.target.value })}>
              <option value="ongrid">On-grid (conectado à rede)</option>
              <option value="offgrid">Off-grid (isolado, com bateria)</option>
              <option value="hybrid">Híbrido (rede + bateria)</option>
            </select>
          </Field>
          <Field label="Módulos em série por string">
            <input type="number" min={1} className={inputCls} value={solar.modulesPerString}
              onChange={(e) => upd({ modulesPerString: Math.max(1, Number(e.target.value) || 1) })} />
          </Field>
        </div>
      </Panel>

      <Panel title="Localização e radiação solar" icon={MapPin}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Estado (UF)">
            <select className={selectCls} value={solar.uf} onChange={(e) => selectUF(e.target.value)}>
              {UF_LIST.map((uf) => <option key={uf} value={uf}>{UF_NAMES[uf]}</option>)}
            </select>
          </Field>
          <Field label="Irradiação solar média — HSP (kWh/m²/dia)">
            <input type="number" step="0.1" min="1" className={inputCls} value={solar.hsp}
              onChange={(e) => upd({ hsp: Number(e.target.value) || 0 })} />
          </Field>
        </div>
        <p className="text-xs text-slate-500 mt-2 flex gap-1">
          <Info className="w-3 h-3 mt-0.5 shrink-0" /> Estimativa simplificada de irradiação média por estado. Para maior
          precisão, ajuste manualmente com dados locais de irradiância (CRESESB/INPE) ou medição em campo na região exata do projeto.
        </p>
      </Panel>

      <div className="flex gap-3 flex-wrap">
        <Stat label="Potência instalada" value={potenciaInstaladaKwp.toFixed(2)} unit="kWp" tone="orange" />
        <Stat label="Geração diária" value={geracaoDiaria.toFixed(1)} unit="kWh/dia" tone="yellow" />
        <Stat label="Geração mensal" value={geracaoMensal.toFixed(0)} unit="kWh/mês" tone="green" />
        <Stat label="Geração anual" value={geracaoAnual.toFixed(0)} unit="kWh/ano" tone="blue" />
      </div>

      <Panel title="Esquema unifilar fotovoltaico" icon={Cable}>
        <SolarUnifilarDiagram
          qty={qty}
          modulesPerString={modulesPerString}
          numStrings={numStrings}
          potenciaKwp={potenciaInstaladaKwp}
          geracaoMensal={geracaoMensal}
          inverterKw={inversorRecomendado}
          systemType={solar.systemType}
          acInfo={{ disjuntorCA, caboCA: caboCA.s }}
          batteryInfo={{ voltage: batteryVoltage, ah: capacidadeBancoAh }}
        />
      </Panel>

      <Panel title="Inversor e lado CA" icon={Zap}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tensão de saída do inversor">
            <select className={selectCls} value={solar.acSupply} onChange={(e) => upd({ acSupply: e.target.value })}>
              <option value="127-mono">Monofásico 127V</option>
              <option value="220-mono">Monofásico 220V</option>
              <option value="220-tri">Trifásico 220V</option>
              <option value="380-tri">Trifásico 380V</option>
            </select>
          </Field>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">Inversor recomendado</div>
            <div className="font-mono text-blue-300">{inversorRecomendado} kW</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">Disjuntor CA</div>
            <div className="font-mono text-orange-300">{disjuntorCA} A</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">Cabo CA</div>
            <div className="font-mono text-emerald-300">{caboCA.s} mm²</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">DPS CA</div>
            <div className="font-mono text-red-300">{dpsCA.tensao} · {dpsCA.ik} · Classe {dpsCA.classe}</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">IDR (DR) CA</div>
            <div className="font-mono text-blue-300">{idrCA} A / 30 mA</div>
          </div>
        </div>
      </Panel>

      <Panel title="Lado CC (módulos e strings)" icon={Cable}>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">Strings</div>
            <div className="font-mono text-slate-200">{numStrings}x de até {modulesPerString} módulos</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">Tensão aprox. por string</div>
            <div className="font-mono text-slate-200">{tensaoString.toFixed(0)} V</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">Corrente aprox. por string</div>
            <div className="font-mono text-blue-300">{correnteString.toFixed(2)} A</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">Cabo CC (por string)</div>
            <div className="font-mono text-emerald-300">{caboCC.s} mm²</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">Disjuntor CC (por string)</div>
            <div className="font-mono text-orange-300">{disjuntorCCString} A</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs uppercase">Disjuntor CC geral (combinador)</div>
            <div className="font-mono text-orange-300">{disjuntorCCGeral} A</div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 flex gap-1">
          <Info className="w-3 h-3 mt-0.5 shrink-0" /> Corrente e tensão de string estimadas a partir de uma tensão de
          referência simplificada por módulo ({MODULE_VMP_REF} V). Um projetista deve validar as strings com os valores
          reais de Voc/Isc do módulo escolhido e os limites de MPPT do inversor.
        </p>
      </Panel>

      {showBattery && (
        <Panel title="Banco de baterias" icon={Battery}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo de bateria">
              <select className={selectCls} value={solar.batteryType} onChange={(e) => upd({ batteryType: e.target.value })}>
                {Object.entries(BATTERY_TYPES).map(([id, t]) => <option key={id} value={id}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Autonomia desejada (dias)">
              <input type="number" step="0.5" min="0.5" className={inputCls} value={solar.autonomyDays}
                onChange={(e) => upd({ autonomyDays: Number(e.target.value) || 1 })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <div className="text-slate-400 text-xs uppercase">Tensão do banco</div>
              <div className="font-mono text-slate-200">{batteryVoltage} V</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <div className="text-slate-400 text-xs uppercase">Energia necessária</div>
              <div className="font-mono text-slate-200">{energiaNecessariaKwh.toFixed(1)} kWh</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 col-span-2">
              <div className="text-slate-400 text-xs uppercase">Capacidade do banco de baterias</div>
              <div className="font-mono text-emerald-300 text-lg">{capacidadeBancoAh.toFixed(0)} Ah @ {batteryVoltage} V</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex gap-1">
            <Info className="w-3 h-3 mt-0.5 shrink-0" /> Consumo diário de referência baseado em: {consumoDiarioFonte}
            {" "}({consumoDiarioRef.toFixed(1)} kWh/dia). Cadastre seus equipamentos na aba "Equipamentos" para um
            dimensionamento de bateria mais fiel ao consumo real da residência.
          </p>
        </Panel>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-3 py-3">
        <Info className="w-4 h-4 text-yellow-400 shrink-0" />
        Dimensionamento fotovoltaico simplificado com base em referências gerais (NBR 16690) para fins educativos.
        A geração real depende de sombreamento, orientação/inclinação dos módulos, temperatura e perdas específicas do
        sistema — um projeto executivo deve ser elaborado por um profissional habilitado.
      </div>
    </div>
  );
}

/* ============================== NORMAS TAB ============================== */
function NormasTab() {
  return (
    <div className="flex flex-col gap-4">
      <Panel title="Capacidade de condução de corrente — cabos PVC (Método B1, 2 condutores carregados, 30°C)" icon={BookOpen}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-slate-500"><th className="text-left py-1">Seção (mm²)</th><th className="text-left py-1">Corrente máx. (A)</th></tr></thead>
            <tbody>
              {CABLE_TABLE.map((r) => (
                <tr key={r.s} className="border-t border-slate-800">
                  <td className="py-1 font-mono text-slate-200">{r.s}</td>
                  <td className="py-1 font-mono text-blue-300">{r.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-2">Valores de referência simplificados. A norma completa considera método de instalação, agrupamento, temperatura e tipo de isolação.</p>
      </Panel>

      <Panel title="Disjuntores termomagnéticos padronizados" icon={ShieldCheck}>
        <div className="flex flex-wrap gap-2">
          {BREAKERS.map((b) => (
            <span key={b} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 font-mono text-sm text-orange-300">{b} A</span>
          ))}
        </div>
      </Panel>

      <Panel title="Seções mínimas por tipo de circuito (NBR 5410)" icon={Cable}>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>Circuitos de iluminação: <span className="font-mono text-emerald-300">1,5 mm²</span></li>
          <li>Circuitos de tomadas de uso geral: <span className="font-mono text-emerald-300">2,5 mm²</span></li>
          <li>Circuitos dedicados / motores: <span className="font-mono text-emerald-300">2,5 mm² (mínimo)</span></li>
        </ul>
      </Panel>

      <Panel title="Proteções obrigatórias" icon={ShieldCheck}>
        <ul className="text-sm text-slate-300 space-y-2">
          <li><b className="text-blue-300">IDR (Interruptor Diferencial Residual):</b> obrigatório em circuitos de tomadas, áreas molhadas e circuitos que alimentem equipamentos em locais com risco de choque. Sensibilidade típica de 30 mA.</li>
          <li><b className="text-red-300">DPS (Dispositivo de Proteção contra Surtos):</b> obrigatório na maioria das instalações residenciais e comerciais, protegendo contra surtos de origem atmosférica ou de manobra na rede.</li>
          <li><b className="text-orange-300">Disjuntor geral:</b> deve suportar a corrente total da instalação, coordenado com a capacidade do cabo alimentador.</li>
        </ul>
      </Panel>

      <Panel title="Queda de tensão admissível" icon={Gauge}>
        <p className="text-sm text-slate-300">Recomendação usual da NBR 5410: até <b className="text-emerald-300">4%</b> em circuitos terminais e até <b className="text-emerald-300">7%</b> somando alimentador + circuito terminal, quando a instalação é alimentada diretamente por rede de baixa tensão da concessionária.</p>
      </Panel>

      <Panel title="Sistemas fotovoltaicos (NBR 16690)" icon={Sun}>
        <p className="text-sm text-slate-300">A NBR 16690 trata dos requisitos de projeto de sistemas fotovoltaicos, incluindo proteção contra surtos e sobrecorrentes nos lados CC e CA, aterramento, seccionamento e identificação. As estimativas da aba "Fotovoltaico" são simplificadas para fins educativos.</p>
      </Panel>

      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-3 py-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        Estas tabelas são referências educativas resumidas da NBR 5410 / NBR 16690. Consulte a norma completa e um profissional habilitado antes de executar qualquer instalação.
      </div>
    </div>
  );
}

/* ============================== APP ROOT ============================== */
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [equipment, setEquipment] = useState([]);
  const [network, setNetwork] = useState({ supply: "220-mono", demand: 1, material: "cobre", feederLength: 20 });
  const [solar, setSolar] = useState({
    modulePower: 550,
    qty: 10,
    systemType: "ongrid",
    uf: "SP",
    hsp: HSP_BY_UF.SP,
    modulesPerString: 10,
    acSupply: "220-mono",
    batteryType: "litio",
    autonomyDays: 1,
  });
  const [loaded, setLoaded] = useState(false);
  const [saveNote, setSaveNote] = useState("");

  useEffect(() => {
    (async () => {
      const eq = await loadState("circuitocerto:equipamentos", []);
      const net = await loadState("circuitocerto:rede", network);
      const sol = await loadState("circuitocerto:solar", solar);
      setEquipment(eq);
      setNetwork(net);
      setSolar(sol);
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveState("circuitocerto:equipamentos", equipment);
  }, [equipment, loaded]);

  useEffect(() => {
    if (!loaded) return;
    saveState("circuitocerto:rede", network);
  }, [network, loaded]);

  useEffect(() => {
    if (!loaded) return;
    saveState("circuitocerto:solar", solar);
  }, [solar, loaded]);

  const stats = useMemo(() => {
    const totalPower = equipment.reduce((a, r) => a + r.power * r.qty, 0);
    const kwhMonth = equipment.reduce((a, r) => a + (r.power * r.qty * r.hours * 30) / 1000, 0);
    const totalCurrent = equipment.reduce((a, r) => a + currentOf(r.power, r.qty, r.voltage, r.fp, "mono"), 0);
    return { totalPower, kwhMonth, totalCurrent, count: equipment.length };
  }, [equipment]);

  const TABS = [
    { id: "dashboard", label: "Início", icon: LayoutDashboard },
    { id: "equipamentos", label: "Equipamentos", icon: ListChecks },
    { id: "dimensionamento", label: "Dimensionamento", icon: Gauge },
    { id: "motor", label: "Motor", icon: Wrench },
    { id: "fotovoltaico", label: "Fotovoltaico", icon: Sun },
    { id: "normas", label: "Normas", icon: BookOpen },
  ];

  function manualSave() {
    saveState("circuitocerto:equipamentos", equipment);
    saveState("circuitocerto:rede", network);
    saveState("circuitocerto:solar", solar);
    setSaveNote("Salvo!");
    setTimeout(() => setSaveNote(""), 1500);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="font-bold text-sm leading-none">Circuito<span className="text-orange-400">Certo</span> <span className="text-blue-400">Pro</span></div>
            <div className="text-[10px] text-slate-500 leading-none mt-0.5">Cálculos elétricos com precisão</div>
          </div>
        </div>
        <button onClick={manualSave} className="flex items-center gap-1 text-xs text-slate-400 hover:text-orange-400 transition">
          <Save className="w-4 h-4" /> {saveNote || "Salvar"}
        </button>
      </header>

      <nav className="flex overflow-x-auto border-b border-slate-800 bg-slate-950 sticky top-[57px] z-10">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs whitespace-nowrap border-b-2 transition
              ${tab === t.id ? "border-orange-500 text-orange-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-4 max-w-2xl w-full mx-auto">
        {tab === "dashboard" && <DashboardTab stats={stats} setTab={setTab} />}
        {tab === "equipamentos" && <EquipamentosTab equipment={equipment} setEquipment={setEquipment} phase="mono" />}
        {tab === "dimensionamento" && <DimensionamentoTab equipment={equipment} network={network} setNetwork={setNetwork} />}
        {tab === "motor" && <MotorTab />}
        {tab === "fotovoltaico" && <FotovoltaicoTab solar={solar} setSolar={setSolar} equipment={equipment} kwhMonth={stats.kwhMonth} />}
        {tab === "normas" && <NormasTab />}
      </main>

      <footer className="border-t border-slate-800 px-4 py-3 text-center text-[11px] text-slate-600">
        Circuito Certo Pro — ferramenta de referência educativa (NBR 5410 simplificada). Válide sempre com um profissional habilitado.
        <div className="mt-1 italic text-slate-700">assinatura eletrôni