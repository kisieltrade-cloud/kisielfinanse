'use client';

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

// Symulator paper-trading. Świece są GENEROWANE (błądzenie losowe z dryfem),
// nie są realnymi danymi rynkowymi - to sandbox do ćwiczenia decyzji.

type Candle = [number, number, number, number]; // open, high, low, close
type Instrument = { s: string; base: number; digits: number };

const TOTAL = 140;
const START = 34;
const WINDOW = 46;
const START_BALANCE = 10000;
const STAKE_FRAC = 0.25;

// ── tryb wyzwania ──
const CH_TRADES = 10;             // seria kończy się po tylu zamkniętych transakcjach
// Limit straty serii, odpowiednik maksymalnego obsunięcia z planu tradingowego.
// Przy rozsądnym ryzyku nie zadziała ani razu; bije dopiero w szeroki SL i trzymanie strat.
const CH_MAXDD = 0.1;
const CH_KEY = 'kf-symulator-rekord-v1';

const INSTRUMENTS: Instrument[] = [
  { s: 'US100', base: 19500, digits: 0 },
  { s: 'GER40', base: 18400, digits: 0 },
  { s: 'US500', base: 5400, digits: 0 },
  { s: 'US30', base: 42000, digits: 0 },
  { s: 'EUR/USD', base: 1.084, digits: 4 },
  { s: 'GBP/USD', base: 1.272, digits: 4 },
  { s: 'BTC/USD', base: 64000, digits: 0 },
  { s: 'ETH/USD', base: 3200, digits: 0 },
  { s: 'XAU/USD', base: 2350, digits: 1 },
];
const TFS = ['M15', 'H1', 'H4', 'D1'];

type Dir = 'long' | 'short';
type Position = { dir: Dir; entry: number; stake: number; sl?: number; tp?: number };
type ExitReason = 'sl' | 'tp' | 'reczne' | 'koniec';
type TradeLog = { dir: Dir; entry: number; exit: number; pnl: number; reason: ExitReason };

const REASON_LABEL: Record<ExitReason, string> = {
  sl: 'stop loss',
  tp: 'take profit',
  reczne: 'ręcznie',
  koniec: 'koniec wykresu',
};
type Chart = { candles: Candle[]; inst: Instrument; tf: string; regime: number };

function mulberry32(a: number): () => number {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Reżimy rynku - każdy daje inny charakter wykresu, żeby nie dało się nauczyć
// na pamięć: trend, konsolidacja, wybicie, odwrócenie, parabola, chop.
// drift(t,dir) = tendencja w danym momencie (t=0..1), mr(t) = siła powrotu do anchora.
const REGIMES: { drift: (t: number, d: number) => number; vol: number; mr?: (t: number) => number }[] = [
  { drift: (_t, d) => d * 0.0072, vol: 0.011 },                              // silny trend
  { drift: (_t, d) => d * 0.0034, vol: 0.012 },                              // łagodny trend
  { drift: () => 0, vol: 0.011, mr: () => 0.06 },                            // konsolidacja / range
  { drift: () => 0, vol: 0.026, mr: () => 0.02 },                            // chop / wysoka zmienność
  { drift: (t, d) => (t < 0.55 ? 0 : d * 0.009), vol: 0.011, mr: (t) => (t < 0.55 ? 0.07 : 0) }, // wybicie z konsolidacji
  { drift: (t, d) => (t < 0.5 ? d : -d) * 0.0072, vol: 0.011 },              // odwrócenie V
  { drift: (t, d) => d * (0.002 + 0.014 * t * t), vol: 0.012 },              // parabola (przyspieszenie)
  { drift: (_t, d) => d * 0.0035, vol: 0.0065 },                             // spokojny grind (low vol)
];

function genChart(rnd: () => number = Math.random): Chart {
  const inst = INSTRUMENTS[Math.floor(rnd() * INSTRUMENTS.length)];
  const tf = TFS[Math.floor(rnd() * TFS.length)];
  const ri = Math.floor(rnd() * REGIMES.length);
  const rg = REGIMES[ri];
  const dir = rnd() < 0.5 ? 1 : -1;
  const anchor = inst.base * (1 + (rnd() - 0.5) * 0.03);
  const candles: Candle[] = [];
  let price = anchor;
  for (let i = 0; i < TOTAL; i++) {
    const t = i / TOTAL;
    const open = price;
    let change = rg.drift(t, dir) + (rnd() - 0.5) * rg.vol;
    if (rg.mr) change += rg.mr(t) * (anchor - open) / open;
    const close = Math.max(0.0001, open * (1 + change));
    const wv = rg.vol * 0.5;
    const hi = Math.max(open, close) * (1 + rnd() * wv);
    const lo = Math.min(open, close) * (1 - rnd() * wv);
    candles.push([open, hi, lo, close]);
    price = close;
  }
  return { candles, inst, tf, regime: ri };
}

// Wyjaśnienie pokazywane na końcu wykresu - odsłania, co to był za reżim i czego uczy.
const REGIME_INFO: { title: string; body: string }[] = [
  { title: 'Silny trend', body: 'Cena szła w jednym kierunku z płytkimi korektami. Najwięcej dawało wejście zgodnie z trendem na cofnięciach i trzymanie pozycji, a nie łapanie szczytu czy dołka. Gra przeciw trendowi to jeden z najczęstszych sposobów na stratę.' },
  { title: 'Łagodny trend', body: 'Kierunek był widoczny, ale spokojniejszy, z większymi przystankami. Zasada ta sama: graj z trendem, ale licz się z głębszymi korektami i nie przesadzaj z wielkością pozycji.' },
  { title: 'Konsolidacja (range)', body: 'Cena krążyła w bok między wsparciem a oporem. Tu zarabia się kupując przy dolnej krawędzi i sprzedając przy górnej, a nie goniąc wybicia, którego nie ma. Prawdziwe wybicie trzeba potwierdzić zamknięciem świecy.' },
  { title: 'Chop / wysoka zmienność', body: 'Rynek szarpał w obie strony bez wyraźnego kierunku. To najtrudniejsze warunki i często najlepszą decyzją jest brak pozycji. Chaotyczny ruch zbiera stop lossy z obu stron.' },
  { title: 'Wybicie z konsolidacji', body: 'Najpierw range, potem zdecydowany ruch w jedną stronę. Sygnałem było wybicie poza granicę konsolidacji z impetem. Wejście po potwierdzeniu i reteście przełamanego poziomu dawało dobry stosunek zysku do ryzyka.' },
  { title: 'Odwrócenie (V)', body: 'Trend w jedną stronę, a potem gwałtowny zwrot. Kto trzymał pierwotny kierunek za długo bez stop lossa, oddał zysk. Zwroty często zapowiada reakcja świecowa na ważnym poziomie.' },
  { title: 'Parabola', body: 'Ruch przyspieszał, aż zrobił się niemal pionowy. Takie fazy euforii lub paniki kończą się gwałtownie, a goniący na końcu zwykle kupują szczyt. Realizacja zysku w sile bywa lepsza niż czekanie na jeszcze trochę.' },
  { title: 'Spokojny grind', body: 'Powolny, mało zmienny trend. Nudny, ale przewidywalny. Nagradza cierpliwość i wyższy interwał, karze nadaktywność i przepłacanie za emocje.' },
];

function axisLabel(idx: number, tf: string): string {
  if (tf === 'D1') {
    const d = new Date(Date.UTC(2026, 0, 5) + idx * 86400000);
    return String(d.getUTCDate()).padStart(2, '0') + '.' + String(d.getUTCMonth() + 1).padStart(2, '0');
  }
  const stepMin = tf === 'H4' ? 240 : tf === 'H1' ? 60 : 15;
  const d = new Date(Date.UTC(2026, 0, 5, 8, 0) + idx * stepMin * 60000);
  return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
}

const W = 720, H = 348, PADX = 12, PADTOP = 14, PADBOT = 30, AXIS = 62;

function fmt(p: number, digits = 2): string {
  return p.toLocaleString('pl-PL', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
function fmtZl(n: number): string {
  return (n >= 0 ? '+' : '') + Math.round(n).toLocaleString('pl-PL') + ' zł';
}
function plT(n: number): string {
  const a = n % 10, b = n % 100;
  if (n === 1) return 'transakcja';
  if (a >= 2 && a <= 4 && !(b >= 12 && b <= 14)) return 'transakcje';
  return 'transakcji';
}

type ChStats = {
  pnl: number; balance: number; wins: number; losses: number; winrate: number;
  best: number | null; worst: number | null; maxLossStreak: number; profitFactor: number | null;
};

function chStats(trades: TradeLog[]): ChStats {
  let pnl = 0, wins = 0, losses = 0, zysk = 0, strata = 0;
  let best: number | null = null, worst: number | null = null;
  let streak = 0, maxLossStreak = 0;
  for (const t of trades) {
    pnl += t.pnl;
    if (t.pnl > 0) { wins++; zysk += t.pnl; streak = 0; }
    else if (t.pnl < 0) { losses++; strata += -t.pnl; streak++; if (streak > maxLossStreak) maxLossStreak = streak; }
    if (best === null || t.pnl > best) best = t.pnl;
    if (worst === null || t.pnl < worst) worst = t.pnl;
  }
  const decided = wins + losses;
  return {
    pnl, balance: START_BALANCE + pnl, wins, losses,
    winrate: decided ? Math.round((wins / decided) * 100) : 0,
    best, worst, maxLossStreak,
    profitFactor: strata > 0 ? zysk / strata : null,
  };
}

// Komentarz do serii. Uczy tego, co w tradingu decyduje: relacji trafności do wielkości wygranych.
function ocenaSerii(s: ChStats, stop: boolean): string {
  if (stop) {
    return `Seria skończyła się wcześniej, bo strata przekroczyła ${Math.round(CH_MAXDD * 100)}% kapitału. Dokładnie tak działa limit obsunięcia w planie tradingowym: odcina Cię od rynku, zanim zaczniesz odrabiać na siłę. Przy pozycji ${Math.round(STAKE_FRAC * 100)}% salda taki limit da się przebić tylko szerokim stopem albo trzymaniem stratnej pozycji.`;
  }
  if (s.pnl > 0 && s.winrate < 50) {
    return `Wyszedłeś na plus przy trafności ${s.winrate}%, czyli częściej się myliłeś, niż trafiałeś. To jest właśnie mechanizm przewagi: zyski były większe od strat. Dokładnie po to ustawia się take profit dalej niż stop loss.`;
  }
  if (s.pnl > 0) {
    return `Seria na plusie przy trafności ${s.winrate}%. Sprawdź jednak, czy zysk nie wisi na jednej transakcji: najlepsza dała ${fmtZl(s.best ?? 0)}, a cała seria ${fmtZl(s.pnl)}. Jeśli różnica jest mała, to nie system zarobił, tylko jeden udany ruch.`;
  }
  if (s.winrate >= 50) {
    return `Trafiłeś ${s.winrate}% transakcji i mimo to seria jest na minusie. To najczęstszy błąd początkującego: zyski ucinane szybko, straty trzymane długo. Najgorsza transakcja to ${fmtZl(s.worst ?? 0)}, najlepsza ${fmtZl(s.best ?? 0)}.`;
  }
  if (s.wins === 0) {
    return `Dziesięć stratnych transakcji pod rząd wygląda dramatycznie, ale przy losowych wejściach to normalny wynik: stop loss jest bliżej ceny niż take profit, więc rynek trafia w niego częściej. Sens ma dopiero wejście z powodu, nie z ciekawości. Zobacz, po czym rozpoznać sygnał.`;
  }
  return `Seria na minusie przy trafności ${s.winrate}%. Zanim zmienisz strategię, zobacz najdłuższą serię strat: ${s.maxLossStreak} pod rząd. Dziesięć transakcji to za mało, żeby ocenić system, ale wystarczy, żeby zobaczyć, jak zachowujesz się po kilku stratach z rzędu.`;
}

export default function TradingSimulator() {
  // Pierwszy wykres z ziarnem (deterministyczny) - identyczny na serwerze i kliencie.
  const [chart, setChart] = useState<Chart>(() => genChart(mulberry32(20260704)));
  const [revealed, setRevealed] = useState(START);
  const [pos, setPos] = useState<Position | null>(null);
  const [balance, setBalance] = useState(START_BALANCE);
  const [log, setLog] = useState<TradeLog[]>([]);
  const [chartPnl, setChartPnl] = useState(0);   // wynik na bieżącym wykresie
  const [chartTrades, setChartTrades] = useState(0);
  const [useSlTp, setUseSlTp] = useState(true);
  const [slPct, setSlPct] = useState(1);
  const [tpPct, setTpPct] = useState(2);
  // Tryb wyzwania: seria CH_TRADES transakcji na wynik, z osobnym logiem i rekordem.
  const [chOn, setChOn] = useState(false);
  const [chLog, setChLog] = useState<TradeLog[]>([]);
  const [record, setRecord] = useState<number | null>(null);
  // Świece sprawdzone już pod kątem trafienia SL/TP, żeby nie badać ich dwa razy.
  const checkedTo = useRef(START);

  const { candles, inst, tf, regime } = chart;
  const dg = inst.digits;
  const lastC = candles[revealed - 1];
  const lastClose = lastC[3];
  const ended = revealed >= TOTAL;

  const unrealized = useMemo(() => {
    if (!pos) return 0;
    const frac = (lastClose - pos.entry) / pos.entry;
    return pos.stake * (pos.dir === 'long' ? frac : -frac);
  }, [pos, lastClose]);

  // ── wyzwanie: stan pochodny (musi powstać przed open/closeAt, bo wchodzi w ich zależności) ──
  const ch = useMemo(() => chStats(chLog), [chLog]);
  const chStop = chOn && ch.balance <= START_BALANCE * (1 - CH_MAXDD);
  const chOver = chOn && (chLog.length >= CH_TRADES || chStop);

  const closeAt = useCallback((price: number, reason: ExitReason) => {
    if (!pos) return;
    const frac = (price - pos.entry) / pos.entry;
    const pnl = pos.stake * (pos.dir === 'long' ? frac : -frac);
    const trade: TradeLog = { dir: pos.dir, entry: pos.entry, exit: price, pnl, reason };
    setBalance((b) => b + pnl);
    setLog((l) => [trade, ...l].slice(0, 30));
    setChartPnl((p) => p + pnl);
    setChartTrades((n) => n + 1);
    if (chOn) setChLog((l) => (l.length < CH_TRADES ? [...l, trade] : l));
    setPos(null);
  }, [pos, chOn]);

  const closePosition = useCallback(() => closeAt(lastClose, 'reczne'), [closeAt, lastClose]);

  const open = useCallback((dir: Dir) => {
    if (pos || ended || chOver) return;
    const entry = lastClose;
    const sl = useSlTp ? entry * (dir === 'long' ? 1 - slPct / 100 : 1 + slPct / 100) : undefined;
    const tp = useSlTp ? entry * (dir === 'long' ? 1 + tpPct / 100 : 1 - tpPct / 100) : undefined;
    checkedTo.current = revealed; // zlecenia mogą zadziałać dopiero od następnej świecy
    setPos({ dir, entry, stake: Math.max(0, balance * STAKE_FRAC), sl, tp });
  }, [pos, ended, chOver, balance, lastClose, useSlTp, slPct, tpPct, revealed]);

  // Sprawdzanie zleceń na każdej nowo odsłoniętej świecy, po jej maksimum i minimum.
  useEffect(() => {
    if (!pos || (pos.sl === undefined && pos.tp === undefined)) {
      checkedTo.current = revealed;
      return;
    }
    for (let i = checkedTo.current; i < revealed; i++) {
      const c = candles[i];
      const hitSl = pos.sl !== undefined && (pos.dir === 'long' ? c[2] <= pos.sl : c[1] >= pos.sl);
      const hitTp = pos.tp !== undefined && (pos.dir === 'long' ? c[1] >= pos.tp : c[2] <= pos.tp);
      if (hitSl || hitTp) {
        // Gdy jedna świeca obejmuje oba poziomy, nie wiadomo, który cenę dotknęła pierwszy.
        // Przyjmujemy wariant gorszy dla tradera, czyli stop loss. Tak samo robi się w rzetelnych testach.
        checkedTo.current = revealed;
        closeAt(hitSl ? pos.sl! : pos.tp!, hitSl ? 'sl' : 'tp');
        return;
      }
    }
    checkedTo.current = revealed;
  }, [revealed, pos, candles, closeAt]);

  const step = useCallback((n = 1) => {
    setRevealed((r) => Math.min(TOTAL, r + n));
  }, []);

  useEffect(() => {
    if (ended && pos) closeAt(lastClose, 'koniec');
  }, [ended, pos, closeAt, lastClose]);

  const newChart = useCallback((resetAll = false) => {
    setChart(genChart());
    setRevealed(START);
    checkedTo.current = START;
    setPos(null);
    setChartPnl(0);
    setChartTrades(0);
    if (resetAll) { setBalance(START_BALANCE); setLog([]); }
  }, []);

  const startChallenge = useCallback(() => {
    setChOn(true);
    setChLog([]);
    setBalance(START_BALANCE);
    setLog([]);
    newChart(false);
  }, [newChart]);

  const exitChallenge = useCallback(() => { setChOn(false); setChLog([]); }, []);

  // Rekord trzymamy lokalnie. Odczyt w efekcie, żeby nie rozjechać hydracji.
  useEffect(() => {
    const raw = window.localStorage.getItem(CH_KEY);
    if (raw !== null && Number.isFinite(Number(raw))) setRecord(Number(raw));
  }, []);

  useEffect(() => {
    if (!chOver) return;
    const wynik = Math.round(ch.balance);
    const poprzedni = Number(window.localStorage.getItem(CH_KEY));
    if (Number.isFinite(poprzedni) && poprzedni >= wynik) return;
    window.localStorage.setItem(CH_KEY, String(wynik));
    setRecord(wynik);
  }, [chOver, ch.balance]);

  // skrót: spacja = następna świeca
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !ended) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault(); step(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ended, step]);

  const wins = log.filter((t) => t.pnl > 0).length;
  const decided = log.filter((t) => t.pnl !== 0).length;
  const winrate = decided ? Math.round((wins / decided) * 100) : null;
  const totalPnl = balance - START_BALANCE;
  const net = (candles[TOTAL - 1][3] - candles[0][0]) / candles[0][0];

  // ── okno widoku ──
  const from = Math.max(0, revealed - WINDOW);
  const view = candles.slice(from, revealed);
  let min = Infinity, max = -Infinity;
  view.forEach((c) => { if (c[2] < min) min = c[2]; if (c[1] > max) max = c[1]; });
  if (pos) {
    min = Math.min(min, pos.entry);
    max = Math.max(max, pos.entry);
    // Poziomy zleceń dociągamy do widoku, ale najwyżej o połowę zakresu świec.
    // Bez tego szeroki take profit rozciąga skalę i zgniata wykres do paska na dole.
    const luz = (max - min) * 0.5;
    const dolnyLimit = min - luz;
    const gornyLimit = max + luz;
    for (const lvl of [pos.sl, pos.tp]) {
      if (lvl === undefined) continue;
      if (lvl < min && lvl >= dolnyLimit) min = lvl;
      if (lvl > max && lvl <= gornyLimit) max = lvl;
    }
  }
  const pad = (max - min) * 0.06 || 1;
  min -= pad; max += pad;
  const plotR = W - AXIS;
  const plotW = plotR - PADX;
  const plotH = H - PADTOP - PADBOT;
  const step_ = plotW / Math.max(view.length, 1);
  const bw = Math.max(step_ * 0.6, 2.5);
  const cx = (i: number) => PADX + (i + 0.5) * step_;
  const yy = (p: number) => PADTOP + (1 - (p - min) / (max - min)) * plotH;
  const gstep = (max - min) / 4;
  const ticks: number[] = [];
  for (let t = 1; t < 4; t++) ticks.push(min + gstep * t);
  const tEvery = Math.ceil(view.length / 6);

  const posUp = pos ? unrealized >= 0 : false;
  const lastUp = lastC[3] >= lastC[0];

  return (
    <div className="tsim">
      <style>{CSS}</style>

      <div className="tsim-mode">
        <div className="tsim-mode-tabs" role="group" aria-label="Tryb symulatora">
          <button
            className={`tsim-mode-b${!chOn ? ' on' : ''}`}
            onClick={exitChallenge} aria-pressed={!chOn}
          >Trening swobodny</button>
          <button
            className={`tsim-mode-b${chOn ? ' on' : ''}`}
            onClick={() => { if (!chOn) startChallenge(); }} aria-pressed={chOn}
          >Wyzwanie: {CH_TRADES} transakcji</button>
        </div>

        {chOn && !chOver && (
          <span className="tsim-prog">
            <b>{chLog.length}</b> / {CH_TRADES}
            <span className="tsim-prog-bar" aria-hidden="true">
              <i style={{ width: `${(chLog.length / CH_TRADES) * 100}%` }} />
            </span>
          </span>
        )}

        {record !== null && (
          <span className="tsim-rec">Twój rekord serii: <b>{record.toLocaleString('pl-PL')} zł</b></span>
        )}
      </div>

      <div className="tsim-stats">
        <div className="tsim-stat"><span className="tsim-stat-l">Saldo</span><span className="tsim-stat-n">{Math.round(balance).toLocaleString('pl-PL')} zł</span></div>
        <div className="tsim-stat"><span className="tsim-stat-l">Wynik łączny</span><span className="tsim-stat-n" style={{ color: totalPnl >= 0 ? 'var(--tsim-up)' : 'var(--tsim-dn)' }}>{fmtZl(totalPnl)}</span></div>
        <div className="tsim-stat"><span className="tsim-stat-l">Transakcje</span><span className="tsim-stat-n">{decided}</span></div>
        <div className="tsim-stat"><span className="tsim-stat-l">Trafność</span><span className="tsim-stat-n">{winrate === null ? '—' : winrate + '%'}</span></div>
      </div>

      <div className="tsim-chart">
        {/* nagłówek: instrument, interwał, OHLC bieżącej świecy */}
        <div className="tsim-head">
          <span className="tsim-inst">{inst.s}</span>
          <span className="tsim-tf">interwał {tf}</span>
          <span className="tsim-ohlc">
            O {fmt(lastC[0], dg)} &nbsp;H {fmt(lastC[1], dg)} &nbsp;L {fmt(lastC[2], dg)} &nbsp;
            <b style={{ color: lastUp ? 'var(--tsim-up)' : 'var(--tsim-dn)' }}>C {fmt(lastC[3], dg)}</b>
          </span>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Wykres świecowy ${inst.s} interwał ${tf}`}>
          {ticks.map((t, i) => (
            <g key={i}>
              <line className="tsim-grid" x1={PADX} x2={plotR} y1={yy(t)} y2={yy(t)} />
              <text className="tsim-axis" x={plotR + 6} y={yy(t)} dominantBaseline="middle">{fmt(t, dg)}</text>
            </g>
          ))}

          {pos && (() => {
            // Poziom poza widokiem rysujemy przy krawędzi ze strzałką, zamiast go gubić.
            const lvlY = (p: number) => Math.max(PADTOP, Math.min(PADTOP + plotH, yy(p)));
            const poza = (p: number) => p > max || p < min;

            const poziom = (p: number, label: 'TP' | 'SL', kolor: string, cls: string) => {
              const y = lvlY(p);
              const out = poza(p);
              return (
                <>
                  <rect
                    x={PADX} y={Math.min(lvlY(pos.entry), y)} width={plotW}
                    height={Math.abs(y - lvlY(pos.entry))} fill={kolor} opacity={0.07}
                  />
                  <line className={cls} x1={PADX} x2={plotR} y1={y} y2={y} />
                  <text
                    className="tsim-lvl-t" x={plotR - 6}
                    y={label === 'TP' ? y + (out ? 12 : -5) : y + (out ? -5 : 12)}
                    textAnchor="end" fill={kolor}
                  >
                    {label} {fmt(p, dg)}{out ? (label === 'TP' ? ' ↑' : ' ↓') : ''}
                  </text>
                </>
              );
            };

            return (
              <g>
                {pos.tp !== undefined && poziom(pos.tp, 'TP', '#16a34a', 'tsim-tp')}
                {pos.sl !== undefined && poziom(pos.sl, 'SL', '#ef4453', 'tsim-sl')}
                <line className="tsim-entry" x1={PADX} x2={plotR} y1={yy(pos.entry)} y2={yy(pos.entry)} />
                <text className="tsim-entry-t" x={PADX + 4} y={yy(pos.entry) - 5}>{pos.dir === 'long' ? 'LONG' : 'SHORT'} @ {fmt(pos.entry, dg)}</text>
              </g>
            );
          })()}

          {view.map((c, i) => {
            const up = c[3] >= c[0];
            const col = up ? '#16a34a' : '#ef4453';
            const yO = yy(c[0]), yC = yy(c[3]);
            const top = Math.min(yO, yC);
            const h = Math.max(Math.abs(yO - yC), 1.4);
            return (
              <g key={from + i}>
                <line x1={cx(i)} x2={cx(i)} y1={yy(c[1])} y2={yy(c[2])} stroke={col} strokeWidth={1.1} />
                <rect x={cx(i) - bw / 2} y={top} width={bw} height={h} fill={col} rx={0.5} />
              </g>
            );
          })}

          {/* oś czasu */}
          {view.map((c, i) => (i % tEvery === 0
            ? <text key={`t${i}`} className="tsim-time" x={cx(i)} y={H - 9} textAnchor="middle">{axisLabel(from + i, tf)}</text>
            : null))}

          <line className="tsim-last" x1={PADX} x2={plotR} y1={yy(lastClose)} y2={yy(lastClose)} />
          <rect x={plotR} y={yy(lastClose) - 9} width={AXIS} height={18} fill={lastUp ? '#16a34a' : '#ef4453'} rx={1} />
          <text className="tsim-last-t" x={plotR + AXIS / 2} y={yy(lastClose)} textAnchor="middle" dominantBaseline="middle">{fmt(lastClose, dg)}</text>
        </svg>

        {pos && <span className={`tsim-float ${posUp ? 'is-up' : 'is-dn'}`}>Otwarta {pos.dir === 'long' ? 'Long' : 'Short'}: {fmtZl(unrealized)}</span>}
        {ended && <span className="tsim-end">Koniec wykresu</span>}
      </div>

      {!pos && (
        <div className="tsim-orders">
          <button
            className={`tsim-toggle${useSlTp ? ' on' : ''}`}
            onClick={() => setUseSlTp((v) => !v)}
            aria-pressed={useSlTp}
          >
            <span className="tsim-toggle-box" aria-hidden="true">{useSlTp ? '✓' : ''}</span>
            Zlecenia obronne (SL / TP)
          </button>

          {useSlTp && (
            <div className="tsim-order-fields">
              <label className="tsim-of">
                <span>Stop loss</span>
                <input type="number" min={0.1} max={10} step={0.1} value={slPct}
                  onChange={(e) => setSlPct(Math.min(10, Math.max(0.1, Number(e.target.value) || 0.1)))} />
                <em>%</em>
              </label>
              <label className="tsim-of">
                <span>Take profit</span>
                <input type="number" min={0.1} max={20} step={0.1} value={tpPct}
                  onChange={(e) => setTpPct(Math.min(20, Math.max(0.1, Number(e.target.value) || 0.1)))} />
                <em>%</em>
              </label>
              <span className="tsim-rr">
                R/R 1:{(tpPct / slPct).toFixed(2).replace(/\.?0+$/, '')}
                <small>wyjście na zero przy {Math.round((1 / (1 + tpPct / slPct)) * 100)}% trafień</small>
              </span>
            </div>
          )}
        </div>
      )}

      <div className="tsim-controls">
        {!pos ? (
          <>
            <button className="tsim-btn tsim-long" onClick={() => open('long')} disabled={ended || chOver}>▲ Long (kup)</button>
            <button className="tsim-btn tsim-short" onClick={() => open('short')} disabled={ended || chOver}>▼ Short (sprzedaj)</button>
          </>
        ) : (
          <button className="tsim-btn tsim-close" onClick={closePosition}>Zamknij ręcznie ({fmtZl(unrealized)})</button>
        )}
        <div className="tsim-spacer" />
        <button className="tsim-btn tsim-step" onClick={() => step(1)} disabled={ended}>Następna ▶</button>
        <button className="tsim-btn tsim-step" onClick={() => step(5)} disabled={ended}>▶▶ x5</button>
        <button className="tsim-btn tsim-new" onClick={() => newChart(false)} disabled={chOver}>Nowy wykres</button>
      </div>

      {chOver && (
        <div className={`tsim-result${ch.pnl >= 0 ? ' is-up' : ' is-dn'}`}>
          <div className="tsim-result-head">
            <span className="tsim-result-badge">{chStop ? 'Limit straty przekroczony' : 'Seria zakończona'}</span>
            <strong className="tsim-result-bal">{Math.round(ch.balance).toLocaleString('pl-PL')} zł</strong>
            <span className="tsim-result-pnl">
              {fmtZl(ch.pnl)} ({ch.pnl >= 0 ? '+' : ''}{((ch.pnl / START_BALANCE) * 100).toFixed(1)}%)
              po {chLog.length} {plT(chLog.length)}
            </span>
          </div>

          <div className="tsim-result-grid">
            <div><span>Trafność</span><b>{ch.winrate}%</b></div>
            <div>
              <span>Najlepsza</span>
              <b style={{ color: ch.wins ? 'var(--tsim-up)' : undefined }}>{ch.wins ? fmtZl(ch.best!) : '—'}</b>
            </div>
            <div>
              <span>Najgorsza</span>
              <b style={{ color: ch.losses ? 'var(--tsim-dn)' : undefined }}>{ch.losses ? fmtZl(ch.worst!) : '—'}</b>
            </div>
            <div><span>Serii strat pod rząd</span><b>{ch.maxLossStreak}</b></div>
            <div>
              <span>Profit factor</span>
              <b>{ch.profitFactor === null ? '—' : ch.profitFactor.toFixed(2)}</b>
            </div>
          </div>

          <p className="tsim-result-say">{ocenaSerii(ch, chStop)}</p>

          {record !== null && Math.round(ch.balance) >= record && !chStop && (
            <p className="tsim-result-rec">To Twój najlepszy wynik serii.</p>
          )}

          <div className="tsim-result-btns">
            <button className="tsim-btn tsim-new" onClick={startChallenge}>Jeszcze raz →</button>
            <button className="tsim-btn tsim-step" onClick={exitChallenge}>Wróć do treningu</button>
          </div>

          <div className="tsim-explain-links">
            <a href="/kalkulator/wielkosc-pozycji">Kalkulator wielkości pozycji</a>
            <a href="/trading/stop-loss-i-take-profit">Stop loss i take profit</a>
            <a href="/kreator-planu-tradingowego">Kreator planu tradingowego</a>
          </div>
        </div>
      )}

      {ended && !chOver && (
        <div className="tsim-explain">
          <div className="tsim-explain-head">
            <span className="tsim-explain-badge">Co to było</span>
            <h3 className="tsim-explain-title">{REGIME_INFO[regime].title}</h3>
            <span className="tsim-explain-net" style={{ color: net >= 0 ? 'var(--tsim-up)' : 'var(--tsim-dn)' }}>
              Ruch netto {net >= 0 ? '+' : ''}{(net * 100).toFixed(1)}%
            </span>
          </div>
          <p className="tsim-explain-body">{REGIME_INFO[regime].body}</p>
          <p className="tsim-explain-you">
            {chartTrades > 0
              ? <>Twój wynik na tym wykresie: <b style={{ color: chartPnl >= 0 ? 'var(--tsim-up)' : 'var(--tsim-dn)' }}>{fmtZl(chartPnl)}</b> ({chartTrades} {plT(chartTrades)}).</>
              : 'Nie zawarłeś tu żadnej transakcji. Czasem brak pozycji, gdy nie ma czytelnego sygnału, to też dobra decyzja.'}
          </p>
          <div className="tsim-explain-links">
            <a href="/trading/swiece-japonskie-jak-czytac-wykres">Świece japońskie</a>
            <a href="/trading/wsparcie-i-opor-jak-wyznaczac-poziomy">Wsparcie i opór</a>
            <a href="/naucz-sie-tradowac">Pełna nauka tradingu</a>
          </div>
          <button className="tsim-btn tsim-new" onClick={() => newChart(false)}>
            {chOn ? `Dalej: ${chLog.length}/${CH_TRADES} transakcji →` : 'Nowy wykres →'}
          </button>
        </div>
      )}

      <p className="tsim-note">
        Świece są generowane losowo do treningu (instrument i interwał są losowane), to nie są realne notowania - dlatego bezpiecznie
        ćwiczysz sam proces. Każda pozycja to {Math.round(STAKE_FRAC * 100)}% salda; w realu wielkość dobierasz świadomie wg ryzyka.
        Zlecenia SL i TP sprawdzane są po maksimum i minimum każdej świecy. Gdy jedna świeca obejmie oba poziomy, symulator
        przyjmuje wariant gorszy dla Ciebie, czyli stop loss, bo z samej świecy nie wynika, którą cenę rynek dotknął pierwszy.
        Skrót: spacja = następna świeca.
        {chOn
          ? ` W wyzwaniu liczy się seria ${CH_TRADES} zamkniętych transakcji na kolejnych wykresach. Seria kończy się wcześniej, gdy strata przekroczy ${Math.round(CH_MAXDD * 100)}% kapitału, tak jak limit obsunięcia w planie tradingowym.`
          : <> Chcesz zacząć od zera? <button className="tsim-reset" onClick={() => newChart(true)}>Zresetuj saldo</button></>}
      </p>

      {log.length > 0 && (
        <div className="tsim-log">
          {log.slice(0, 6).map((t, i) => (
            <div key={i} className="tsim-log-row">
              <span className={`tsim-tag ${t.dir === 'long' ? 'is-long' : 'is-short'}`}>{t.dir === 'long' ? 'Long' : 'Short'}</span>
              <span className="tsim-log-px">{fmt(t.entry, dg)} → {fmt(t.exit, dg)}</span>
              <span className={`tsim-why is-${t.reason}`}>{REASON_LABEL[t.reason]}</span>
              <span className="tsim-log-pnl" style={{ color: t.pnl >= 0 ? 'var(--tsim-up)' : 'var(--tsim-dn)' }}>{fmtZl(t.pnl)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const CSS = `
.tsim { --tsim-up: #16a34a; --tsim-dn: #ef4453; max-width: 820px; margin: 0 auto; font-family: var(--font-body); color: var(--text); }

/* ── tryb wyzwania ── */
.tsim-mode { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin: 0 0 12px; }
.tsim-mode-tabs { display: flex; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
.tsim-mode-b { padding: 8px 14px; font: inherit; font-size: .86rem; font-weight: 600; letter-spacing: .01em;
  background: transparent; color: var(--muted); border: 0; cursor: pointer; transition: background .15s, color .15s; }
.tsim-mode-b + .tsim-mode-b { border-left: 1px solid var(--border); }
.tsim-mode-b:hover { color: var(--text); }
.tsim-mode-b.on { background: var(--cyan); color: #0b0f15; }
.tsim-prog { display: inline-flex; align-items: center; gap: 9px; font-size: .84rem; color: var(--muted); }
.tsim-prog b { color: var(--text); font-size: 1rem; }
.tsim-prog-bar { display: block; width: 96px; height: 4px; border-radius: 2px; background: var(--border); overflow: hidden; }
.tsim-prog-bar i { display: block; height: 100%; background: var(--cyan); transition: width .3s ease; }
.tsim-rec { margin-left: auto; font-size: .82rem; color: var(--muted); }
.tsim-rec b { color: var(--text); }

.tsim-result { margin-top: 16px; padding: 20px 22px; border: 1px solid var(--border); border-radius: 14px;
  background: var(--surface); border-top: 3px solid var(--tsim-dn); }
.tsim-result.is-up { border-top-color: var(--tsim-up); }
.tsim-result-head { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.tsim-result-badge { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--muted); }
.tsim-result-bal { font-family: var(--font-display, inherit); font-size: 2rem; line-height: 1; color: var(--text); }
.tsim-result-pnl { font-size: .88rem; color: var(--muted); }
.tsim-result.is-up .tsim-result-pnl { color: var(--tsim-up); }
.tsim-result.is-dn .tsim-result-pnl { color: var(--tsim-dn); }
.tsim-result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(112px, 1fr)); gap: 12px;
  margin: 16px 0; padding: 14px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.tsim-result-grid div { display: flex; flex-direction: column; gap: 3px; }
.tsim-result-grid span { font-size: .72rem; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.tsim-result-grid b { font-size: 1.06rem; color: var(--text); }
.tsim-result-say { margin: 0; font-size: .93rem; line-height: 1.65; color: var(--text); }
.tsim-result-rec { margin: 10px 0 0; font-size: .86rem; font-weight: 600; color: var(--cyan); }
.tsim-result-btns { display: flex; gap: 10px; flex-wrap: wrap; margin: 16px 0 4px; }

@media (max-width: 560px) {
  .tsim-mode { gap: 10px; }
  .tsim-rec { margin-left: 0; width: 100%; }
  .tsim-result { padding: 16px; }
  .tsim-result-bal { font-size: 1.6rem; }
}

.tsim-orders { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin: 12px 0 0; padding: 12px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
.tsim-toggle { display: inline-flex; align-items: center; gap: 9px; background: none; border: none; color: var(--muted); font-family: var(--font-body); font-size: 0.88rem; font-weight: 700; cursor: pointer; padding: 0; }
.tsim-toggle.on { color: var(--text); }
.tsim-toggle-box { width: 18px; height: 18px; border-radius: 5px; border: 1px solid var(--border); display: inline-flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #0a0a0a; }
.tsim-toggle.on .tsim-toggle-box { background: var(--cyan); border-color: var(--cyan); }
.tsim-order-fields { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.tsim-of { display: inline-flex; align-items: center; gap: 7px; font-size: 0.84rem; color: var(--muted); }
.tsim-of input { width: 66px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 6px 8px; color: var(--text); font-family: var(--font-mono); font-size: 0.85rem; }
.tsim-of input:focus { outline: none; border-color: var(--cyan); }
.tsim-of em { font-style: normal; color: var(--muted); font-size: 0.8rem; }
.tsim-rr { display: flex; flex-direction: column; font-size: 0.86rem; font-weight: 700; color: var(--cyan); }
.tsim-rr small { font-size: 0.74rem; font-weight: 400; color: var(--muted); }
.tsim-sl { stroke: #ef4453; stroke-width: 1.2; stroke-dasharray: 5 4; }
.tsim-tp { stroke: #16a34a; stroke-width: 1.2; stroke-dasharray: 5 4; }
.tsim-lvl-t { font-family: var(--font-mono); font-size: 10px; font-weight: 700; }
.tsim-why { font-size: 0.7rem; padding: 2px 8px; border-radius: 999px; background: rgba(255,255,255,0.06); color: var(--muted); white-space: nowrap; }
.tsim-why.is-sl { background: rgba(239,68,83,0.15); color: #ef4453; }
.tsim-why.is-tp { background: rgba(22,163,74,0.15); color: #16a34a; }
.tsim-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
.tsim-stat { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.tsim-stat-l { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); opacity: 0.8; }
.tsim-stat-n { font-family: var(--font-mono); font-size: 1.15rem; font-weight: 700; }
.tsim-chart { position: relative; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 6px; }
.tsim-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 6px 8px 8px; }
.tsim-inst { font-weight: 800; font-size: 0.98rem; letter-spacing: 0.02em; }
.tsim-tf { font-family: var(--font-mono); font-size: 0.72rem; padding: 2px 8px; border-radius: 999px; background: rgba(201,162,39,0.14); color: var(--cyan); font-weight: 700; }
.tsim-ohlc { font-family: var(--font-mono); font-size: 0.74rem; color: var(--muted); margin-left: auto; }
.tsim-chart svg { width: 100%; height: auto; display: block; }
.tsim-grid { stroke: var(--border); stroke-width: 1; opacity: 0.5; }
.tsim-axis, .tsim-last-t, .tsim-entry-t, .tsim-time { font-family: var(--font-mono); font-size: 10px; fill: var(--muted); }
.tsim-last-t { fill: #fff; font-weight: 700; }
.tsim-last { stroke: var(--muted); stroke-width: 1; stroke-dasharray: 3 3; opacity: 0.6; }
.tsim-entry { stroke: var(--cyan); stroke-width: 1.2; stroke-dasharray: 5 4; }
.tsim-entry-t { fill: var(--cyan); font-weight: 700; }
.tsim-float { position: absolute; top: 44px; left: 14px; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; font-family: var(--font-mono); }
.tsim-float.is-up { background: rgba(22,163,74,0.16); color: var(--tsim-up); }
.tsim-float.is-dn { background: rgba(239,68,83,0.16); color: var(--tsim-dn); }
.tsim-end { position: absolute; top: 44px; right: 74px; padding: 6px 12px; border-radius: 8px; background: rgba(255,255,255,0.08); color: var(--muted); font-weight: 700; font-size: 0.8rem; }
.tsim-controls { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 14px; }
.tsim-spacer { flex: 1 1 auto; }
.tsim-btn { border: none; border-radius: 10px; padding: 11px 16px; font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: filter .12s ease, transform .12s ease; font-family: var(--font-body); }
.tsim-btn:disabled { opacity: 0.45; cursor: default; }
.tsim-btn:not(:disabled):hover { filter: brightness(1.08); transform: translateY(-1px); }
.tsim-long { background: var(--tsim-up); color: #fff; }
.tsim-short { background: var(--tsim-dn); color: #fff; }
.tsim-close { background: var(--cyan); color: #0a0a0a; }
.tsim-step { background: var(--bg); color: var(--text); border: 1px solid var(--border); }
.tsim-new { background: var(--cyan); color: #0a0a0a; }
.tsim-note { font-size: 0.82rem; line-height: 1.6; color: var(--muted); opacity: 0.85; margin: 14px 2px 0; }
.tsim-reset { background: none; border: none; color: var(--cyan); text-decoration: underline; cursor: pointer; font: inherit; padding: 0; }
.tsim-log { margin-top: 14px; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.tsim-log-row { display: flex; align-items: center; gap: 12px; padding: 9px 14px; border-bottom: 1px solid var(--border); font-size: 0.88rem; }
.tsim-log-row:last-child { border-bottom: none; }
.tsim-tag { padding: 2px 9px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; }
.tsim-tag.is-long { background: rgba(22,163,74,0.14); color: var(--tsim-up); }
.tsim-tag.is-short { background: rgba(239,68,83,0.14); color: var(--tsim-dn); }
.tsim-log-px { font-family: var(--font-mono); color: var(--muted); }
.tsim-log-pnl { margin-left: auto; font-family: var(--font-mono); font-weight: 700; }
.tsim-explain { margin-top: 16px; background: var(--surface); border: 1px solid var(--cyan); border-radius: 14px; padding: 20px; }
.tsim-explain-head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.tsim-explain-badge { font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--cyan); font-weight: 700; padding: 3px 9px; border: 1px solid var(--cyan); border-radius: 999px; }
.tsim-explain-title { font-size: 1.25rem; font-weight: 800; margin: 0; }
.tsim-explain-net { margin-left: auto; font-family: var(--font-mono); font-weight: 700; font-size: 0.95rem; }
.tsim-explain-body { font-size: 0.98rem; line-height: 1.7; color: var(--muted); margin: 0 0 12px; }
.tsim-explain-you { font-size: 0.95rem; line-height: 1.6; margin: 0 0 16px; }
.tsim-explain-links { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.tsim-explain-links a { font-size: 0.85rem; font-weight: 600; color: var(--text); text-decoration: none; border: 1px solid var(--border); border-radius: 999px; padding: 6px 14px; transition: border-color .12s ease, background .12s ease; }
.tsim-explain-links a:hover { border-color: var(--cyan); background: rgba(201,162,39,0.08); }
@media (max-width: 560px) {
  .tsim-explain-net { margin-left: 0; flex-basis: 100%; }
  .tsim-stats { grid-template-columns: repeat(2, 1fr); }
  .tsim-ohlc { margin-left: 0; flex-basis: 100%; }
  .tsim-controls { gap: 6px; }
  .tsim-btn { padding: 10px 12px; font-size: 0.85rem; }
  .tsim-spacer { flex-basis: 100%; height: 0; }
}
`;
