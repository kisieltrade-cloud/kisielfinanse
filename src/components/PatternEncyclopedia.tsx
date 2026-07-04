'use client';

import { useState } from 'react';

type Candle = [number, number, number, number];
type Bias = 'byczy' | 'niedzwiedzi' | 'neutralny';
type Kind = 'odwrocenie' | 'kontynuacja' | 'niepewnosc';
type Group = 'swiecowe' | 'wykresu';

type Pattern = {
  name: string;
  en: string;
  group: Group;
  bias: Bias;
  kind: Kind;
  strength: 1 | 2 | 3;
  desc: string;
  play: string;
  candles?: Candle[];
  line?: number[];
  neck?: number;
};

const PATTERNS: Pattern[] = [
  // ── Świecowe ──
  {
    name: 'Młot', en: 'Hammer', group: 'swiecowe', bias: 'byczy', kind: 'odwrocenie', strength: 2,
    desc: 'Mały korpus u góry i długi dolny knot po spadkach. Sprzedający próbowali zejść niżej, ale zostali odparci.',
    play: 'Sygnał możliwego odwrócenia w górę. Wchodzisz po potwierdzeniu, ze stopem pod dołkiem knota.',
    candles: [[112, 113, 110, 110.5], [110.5, 111, 108, 108.5], [108.5, 109, 106, 106.6], [106.6, 107, 103.4, 106.8]],
  },
  {
    name: 'Spadająca gwiazda', en: 'Shooting star', group: 'swiecowe', bias: 'niedzwiedzi', kind: 'odwrocenie', strength: 2,
    desc: 'Mały korpus na dole i długi górny knot po wzrostach. Kupujący sięgnęli wyżej, ale zostali odrzuceni.',
    play: 'Zapowiada możliwy zwrot w dół. Stop nad szczytem knota, cel w stronę najbliższego wsparcia.',
    candles: [[100, 101, 99.5, 100.8], [100.8, 102, 100.4, 101.6], [101.6, 103, 101.2, 102.6], [102.6, 105.2, 102.4, 102.8]],
  },
  {
    name: 'Doji', en: 'Doji', group: 'swiecowe', bias: 'neutralny', kind: 'niepewnosc', strength: 1,
    desc: 'Otwarcie i zamknięcie niemal równe, korpus prawie zanika. Obraz równowagi i niezdecydowania.',
    play: 'Sam w sobie nie jest sygnałem wejścia. Po długim ruchu ostrzega, że dotychczasowa strona traci impet.',
    candles: [[100, 101, 99.6, 100.7], [100.7, 102, 100.4, 101.6], [101.6, 102.7, 100.6, 101.62]],
  },
  {
    name: 'Objęcie hossy', en: 'Bullish engulfing', group: 'swiecowe', bias: 'byczy', kind: 'odwrocenie', strength: 3,
    desc: 'Duża zielona świeca w całości obejmuje korpus poprzedniej czerwonej, po spadkach.',
    play: 'Jeden z mocniejszych sygnałów odwrócenia w górę. Wejście po zamknięciu świecy, stop pod dołkiem.',
    candles: [[104, 104.3, 102.2, 102.4], [102.4, 102.6, 100.8, 101.0], [101.0, 101.2, 100.4, 100.5], [100.4, 103.3, 100.2, 103.0]],
  },
  {
    name: 'Objęcie bessy', en: 'Bearish engulfing', group: 'swiecowe', bias: 'niedzwiedzi', kind: 'odwrocenie', strength: 3,
    desc: 'Duża czerwona świeca pochłania poprzednią zieloną, po serii wzrostów.',
    play: 'Mocny sygnał zwrotu w dół. Stop nad szczytem formacji, cel w stronę wsparcia.',
    candles: [[100, 101, 99.7, 100.9], [100.9, 102, 100.6, 101.8], [101.8, 102.2, 101.5, 101.7], [101.9, 102.0, 100.1, 100.3]],
  },
  {
    name: 'Gwiazda poranna', en: 'Morning star', group: 'swiecowe', bias: 'byczy', kind: 'odwrocenie', strength: 3,
    desc: 'Trzy świece na dnie: długa czerwona, mała świeca niezdecydowania, długa zielona.',
    play: 'Przewaga przechodzi od sprzedających do kupujących. Silny sygnał odwrócenia po spadkach.',
    candles: [[104, 104.3, 102.6, 102.8], [102.4, 102.7, 101.9, 102.1], [102.3, 104.6, 102.1, 104.3]],
  },
  {
    name: 'Gwiazda wieczorna', en: 'Evening star', group: 'swiecowe', bias: 'niedzwiedzi', kind: 'odwrocenie', strength: 3,
    desc: 'Trzy świece na szczycie: długa zielona, mała świeca, długa czerwona. Odbicie gwiazdy porannej.',
    play: 'Zapowiada spadki po wzrostach. Wejście short po potwierdzeniu, stop nad szczytem.',
    candles: [[100, 101.6, 99.9, 101.5], [101.9, 102.3, 101.7, 102.0], [101.7, 101.9, 99.7, 99.9]],
  },
  {
    name: 'Harami', en: 'Harami', group: 'swiecowe', bias: 'neutralny', kind: 'odwrocenie', strength: 1,
    desc: 'Mała świeca zamknięta wewnątrz korpusu poprzedniej, dużej. Nagłe wyhamowanie ruchu.',
    play: 'Wczesne ostrzeżenie przed zwrotem. Wymaga potwierdzenia kolejną świecą lub reakcją na poziomie.',
    candles: [[105, 105.2, 101.4, 101.7], [102.4, 103.0, 102.1, 102.7]],
  },
  {
    name: 'Marubozu', en: 'Marubozu', group: 'swiecowe', bias: 'byczy', kind: 'kontynuacja', strength: 2,
    desc: 'Świeca bez knotów, sam korpus. Pełna dominacja jednej strony od otwarcia do zamknięcia.',
    play: 'Potwierdza siłę ruchu. Zielona marubozu wspiera kontynuację wzrostów, czerwona spadków.',
    candles: [[98, 98.6, 97.6, 98.2], [98.2, 101.5, 98.15, 101.45], [101.45, 102.2, 101.3, 102.0]],
  },
  // ── Wykresu ──
  {
    name: 'Głowa z ramionami', en: 'Head and shoulders', group: 'wykresu', bias: 'niedzwiedzi', kind: 'odwrocenie', strength: 3,
    desc: 'Trzy szczyty: środkowy najwyższy (głowa), dwa boczne niżej (ramiona). Klasyczne odwrócenie szczytu.',
    play: 'Sygnał aktywuje przełamanie linii szyi. Zasięg w przybliżeniu równy odległości głowy od tej linii.',
    line: [2.6, 5.4, 3.8, 7.6, 3.9, 5.5, 2.4], neck: 4.0,
  },
  {
    name: 'Odwrócona głowa z ramionami', en: 'Inverse H&S', group: 'wykresu', bias: 'byczy', kind: 'odwrocenie', strength: 3,
    desc: 'Lustrzane odbicie głowy z ramionami na dnie. Środkowy dołek najgłębszy.',
    play: 'Wybicie ponad linię szyi zapowiada wzrosty. Jedno z pewniejszych odwróceń po spadkach.',
    line: [7.4, 4.6, 6.2, 2.4, 6.1, 4.5, 7.6], neck: 6.0,
  },
  {
    name: 'Podwójny szczyt', en: 'Double top', group: 'wykresu', bias: 'niedzwiedzi', kind: 'odwrocenie', strength: 2,
    desc: 'Dwa szczyty na podobnym poziomie z dołkiem między nimi. Rynek dwa razy nie dał rady wyżej.',
    play: 'Aktywacja po przełamaniu linii szyi (dołka między szczytami). Zasięg równy wysokości formacji.',
    line: [2.8, 7.2, 4.6, 7.1, 2.6], neck: 4.6,
  },
  {
    name: 'Podwójne dno', en: 'Double bottom', group: 'wykresu', bias: 'byczy', kind: 'odwrocenie', strength: 2,
    desc: 'Dwa dołki na podobnym poziomie. Rynek dwa razy obronił wsparcie.',
    play: 'Wybicie ponad opór między dołkami potwierdza odwrócenie trendu spadkowego.',
    line: [7.2, 2.8, 5.4, 2.9, 7.5], neck: 5.4,
  },
  {
    name: 'Trójkąt symetryczny', en: 'Symmetrical triangle', group: 'wykresu', bias: 'neutralny', kind: 'kontynuacja', strength: 2,
    desc: 'Coraz niższe szczyty i coraz wyższe dołki. Zmienność się zawęża, energia się kumuluje.',
    play: 'Grasz wybicie w kierunku dominującego trendu, po potwierdzeniu zamknięciem poza trójkątem.',
    line: [2, 8, 3.4, 6.8, 4.4, 5.8, 4.9, 5.3],
  },
  {
    name: 'Flaga byka', en: 'Bull flag', group: 'wykresu', bias: 'byczy', kind: 'kontynuacja', strength: 2,
    desc: 'Dynamiczny wzrost (maszt), potem wąska, lekko opadająca konsolidacja. Pauza przed dalszym ruchem.',
    play: 'Wybicie górą z flagi potwierdza kontynuację. Zasięg często zbliżony do długości masztu.',
    line: [1.2, 2.2, 8.0, 7.2, 7.7, 6.9, 7.5, 9.6],
  },
  {
    name: 'Flaga niedźwiedzia', en: 'Bear flag', group: 'wykresu', bias: 'niedzwiedzi', kind: 'kontynuacja', strength: 2,
    desc: 'Gwałtowny spadek, potem wąska, lekko rosnąca konsolidacja. Odpoczynek przed dalszymi spadkami.',
    play: 'Wybicie dołem z flagi potwierdza kontynuację spadków. Stop nad górną krawędzią flagi.',
    line: [8.8, 7.8, 2.0, 2.9, 2.4, 3.1, 2.6, 0.6],
  },
];

const TABS: { k: string; label: string; pred: (p: Pattern) => boolean }[] = [
  { k: 'all', label: 'Wszystkie', pred: () => true },
  { k: 'swiecowe', label: 'Świecowe', pred: (p) => p.group === 'swiecowe' },
  { k: 'wykresu', label: 'Wykresu', pred: (p) => p.group === 'wykresu' },
  { k: 'odwrocenie', label: 'Odwrócenie', pred: (p) => p.kind === 'odwrocenie' },
  { k: 'kontynuacja', label: 'Kontynuacja', pred: (p) => p.kind === 'kontynuacja' },
];

const BW = 240, BH = 118, PAD = 10;

function Candles({ candles }: { candles: Candle[] }) {
  let min = Infinity, max = -Infinity;
  candles.forEach((c) => { if (c[2] < min) min = c[2]; if (c[1] > max) max = c[1]; });
  const p = (max - min) * 0.08 || 1; min -= p; max += p;
  const n = candles.length;
  const step = (BW - PAD * 2) / n;
  const bw = Math.min(step * 0.6, 16);
  const cx = (i: number) => PAD + (i + 0.5) * step;
  const yy = (v: number) => PAD + (1 - (v - min) / (max - min)) * (BH - PAD * 2);
  return (
    <svg viewBox={`0 0 ${BW} ${BH}`} className="pe-svg" aria-hidden="true">
      {candles.map((c, i) => {
        const up = c[3] >= c[0];
        const col = up ? '#16a34a' : '#ef4453';
        const yO = yy(c[0]), yC = yy(c[3]);
        const top = Math.min(yO, yC), h = Math.max(Math.abs(yO - yC), 1.6);
        return (
          <g key={i}>
            <line x1={cx(i)} x2={cx(i)} y1={yy(c[1])} y2={yy(c[2])} stroke={col} strokeWidth={1.3} />
            <rect x={cx(i) - bw / 2} y={top} width={bw} height={h} fill={col} rx={0.6} />
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ pts, neck }: { pts: number[]; neck?: number }) {
  const min = Math.min(...pts, neck ?? Infinity) - 0.6;
  const max = Math.max(...pts, neck ?? -Infinity) + 0.6;
  const n = pts.length;
  const cx = (i: number) => PAD + (i / (n - 1)) * (BW - PAD * 2);
  const yy = (v: number) => PAD + (1 - (v - min) / (max - min)) * (BH - PAD * 2);
  const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${cx(i).toFixed(1)},${yy(v).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${BW} ${BH}`} className="pe-svg" aria-hidden="true">
      {neck !== undefined && <line className="pe-neck" x1={PAD} x2={BW - PAD} y1={yy(neck)} y2={yy(neck)} />}
      <path d={d} className="pe-line" />
      {pts.map((v, i) => <circle key={i} cx={cx(i)} cy={yy(v)} r={2} className="pe-dot" />)}
    </svg>
  );
}

const BIAS_LABEL: Record<Bias, string> = { byczy: 'Byczy', niedzwiedzi: 'Niedźwiedzi', neutralny: 'Neutralny' };
const KIND_LABEL: Record<Kind, string> = { odwrocenie: 'Odwrócenie', kontynuacja: 'Kontynuacja', niepewnosc: 'Niepewność' };

export default function PatternEncyclopedia() {
  const [tab, setTab] = useState('all');
  const active = TABS.find((t) => t.k === tab)!;
  const list = PATTERNS.filter(active.pred);

  return (
    <div className="pe">
      <style>{CSS}</style>

      <div className="pe-tabs">
        {TABS.map((t) => (
          <button key={t.k} className={`pe-tab${t.k === tab ? ' is-active' : ''}`} onClick={() => setTab(t.k)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="pe-grid">
        {list.map((p) => (
          <article key={p.name} className="pe-card">
            <div className="pe-chart">
              {p.candles ? <Candles candles={p.candles} /> : <LineChart pts={p.line!} neck={p.neck} />}
            </div>
            <div className="pe-body">
              <div className="pe-head">
                <h3 className="pe-name">{p.name}</h3>
                <span className="pe-en">{p.en}</span>
              </div>
              <div className="pe-badges">
                <span className={`pe-badge pe-${p.bias}`}>{BIAS_LABEL[p.bias]}</span>
                <span className="pe-badge pe-kind">{KIND_LABEL[p.kind]}</span>
                <span className="pe-strength" title="Siła sygnału">
                  {[1, 2, 3].map((s) => <span key={s} className={`pe-dot2${s <= p.strength ? ' on' : ''}`} />)}
                </span>
              </div>
              <p className="pe-desc">{p.desc}</p>
              <p className="pe-play"><b>Jak grać:</b> {p.play}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const CSS = `
.pe { --pe-up: #16a34a; --pe-dn: #ef4453; max-width: 1100px; margin: 0 auto; font-family: var(--font-body); color: var(--text); }
.pe-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
.pe-tab { background: var(--surface); border: 1px solid var(--border); color: var(--muted); border-radius: 999px; padding: 8px 16px; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all .12s ease; font-family: var(--font-body); }
.pe-tab:hover { border-color: var(--cyan); }
.pe-tab.is-active { background: var(--cyan); color: #0a0a0a; border-color: var(--cyan); }
.pe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.pe-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
.pe-chart { background: var(--bg); border-bottom: 1px solid var(--border); padding: 6px; }
.pe-svg { width: 100%; height: auto; display: block; }
.pe-neck { stroke: var(--cyan); stroke-width: 1; stroke-dasharray: 4 3; opacity: 0.8; }
.pe-line { fill: none; stroke: var(--text); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.pe-dot { fill: var(--cyan); }
.pe-body { padding: 16px 16px 18px; display: flex; flex-direction: column; gap: 10px; }
.pe-head { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.pe-name { font-size: 1.08rem; font-weight: 800; margin: 0; }
.pe-en { font-size: 0.78rem; color: var(--muted); opacity: 0.7; font-style: italic; }
.pe-badges { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.pe-badge { font-size: 0.7rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; }
.pe-byczy { background: rgba(22,163,74,0.15); color: var(--pe-up); }
.pe-niedzwiedzi { background: rgba(239,68,83,0.15); color: var(--pe-dn); }
.pe-neutralny { background: rgba(255,255,255,0.08); color: var(--muted); }
.pe-kind { background: rgba(201,162,39,0.14); color: var(--cyan); }
.pe-strength { display: inline-flex; gap: 3px; margin-left: 2px; align-items: center; }
.pe-dot2 { width: 6px; height: 6px; border-radius: 50%; background: var(--border); }
.pe-dot2.on { background: var(--cyan); }
.pe-desc { font-size: 0.9rem; line-height: 1.6; color: var(--muted); margin: 0; }
.pe-play { font-size: 0.88rem; line-height: 1.55; margin: 0; }
.pe-play b { color: var(--text); }
`;
