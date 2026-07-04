'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';

// Symulator paper-trading. Świece są GENEROWANE (błądzenie losowe z dryfem),
// nie są realnymi danymi rynkowymi - to sandbox do ćwiczenia decyzji.

type Candle = [number, number, number, number]; // open, high, low, close
type Instrument = { s: string; base: number; digits: number };

const TOTAL = 140;
const START = 34;
const WINDOW = 46;
const START_BALANCE = 10000;
const STAKE_FRAC = 0.25;

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
type Position = { dir: Dir; entry: number; stake: number };
type TradeLog = { dir: Dir; entry: number; exit: number; pnl: number };
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

export default function TradingSimulator() {
  // Pierwszy wykres z ziarnem (deterministyczny) - identyczny na serwerze i kliencie.
  const [chart, setChart] = useState<Chart>(() => genChart(mulberry32(20260704)));
  const [revealed, setRevealed] = useState(START);
  const [pos, setPos] = useState<Position | null>(null);
  const [balance, setBalance] = useState(START_BALANCE);
  const [log, setLog] = useState<TradeLog[]>([]);
  const [chartPnl, setChartPnl] = useState(0);   // wynik na bieżącym wykresie
  const [chartTrades, setChartTrades] = useState(0);

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

  const closePosition = useCallback(() => {
    if (!pos) return;
    const frac = (lastClose - pos.entry) / pos.entry;
    const pnl = pos.stake * (pos.dir === 'long' ? frac : -frac);
    setBalance((b) => b + pnl);
    setLog((l) => [{ dir: pos.dir, entry: pos.entry, exit: lastClose, pnl }, ...l].slice(0, 30));
    setChartPnl((p) => p + pnl);
    setChartTrades((n) => n + 1);
    setPos(null);
  }, [pos, lastClose]);

  const open = useCallback((dir: Dir) => {
    if (pos || ended) return;
    setPos({ dir, entry: lastClose, stake: Math.max(0, balance * STAKE_FRAC) });
  }, [pos, ended, balance, lastClose]);

  const step = useCallback((n = 1) => {
    setRevealed((r) => Math.min(TOTAL, r + n));
  }, []);

  useEffect(() => {
    if (ended && pos) closePosition();
  }, [ended, pos, closePosition]);

  const newChart = useCallback((resetAll = false) => {
    setChart(genChart());
    setRevealed(START);
    setPos(null);
    setChartPnl(0);
    setChartTrades(0);
    if (resetAll) { setBalance(START_BALANCE); setLog([]); }
  }, []);

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
  if (pos) { min = Math.min(min, pos.entry); max = Math.max(max, pos.entry); }
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

          {pos && (
            <g>
              <line className="tsim-entry" x1={PADX} x2={plotR} y1={yy(pos.entry)} y2={yy(pos.entry)} />
              <text className="tsim-entry-t" x={PADX + 4} y={yy(pos.entry) - 5}>{pos.dir === 'long' ? 'LONG' : 'SHORT'} @ {fmt(pos.entry, dg)}</text>
            </g>
          )}

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

      <div className="tsim-controls">
        {!pos ? (
          <>
            <button className="tsim-btn tsim-long" onClick={() => open('long')} disabled={ended}>▲ Long (kup)</button>
            <button className="tsim-btn tsim-short" onClick={() => open('short')} disabled={ended}>▼ Short (sprzedaj)</button>
          </>
        ) : (
          <button className="tsim-btn tsim-close" onClick={closePosition}>Zamknij pozycję ({fmtZl(unrealized)})</button>
        )}
        <div className="tsim-spacer" />
        <button className="tsim-btn tsim-step" onClick={() => step(1)} disabled={ended}>Następna ▶</button>
        <button className="tsim-btn tsim-step" onClick={() => step(5)} disabled={ended}>▶▶ x5</button>
        <button className="tsim-btn tsim-new" onClick={() => newChart(false)}>Nowy wykres</button>
      </div>

      {ended && (
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
          <button className="tsim-btn tsim-new" onClick={() => newChart(false)}>Nowy wykres →</button>
        </div>
      )}

      <p className="tsim-note">
        Świece są generowane losowo do treningu (instrument i interwał są losowane), to nie są realne notowania - dlatego bezpiecznie
        ćwiczysz sam proces. Każda pozycja to {Math.round(STAKE_FRAC * 100)}% salda; w realu wielkość dobierasz świadomie wg ryzyka.
        Skrót: spacja = następna świeca. Chcesz zacząć od zera? <button className="tsim-reset" onClick={() => newChart(true)}>Zresetuj saldo</button>
      </p>

      {log.length > 0 && (
        <div className="tsim-log">
          {log.slice(0, 6).map((t, i) => (
            <div key={i} className="tsim-log-row">
              <span className={`tsim-tag ${t.dir === 'long' ? 'is-long' : 'is-short'}`}>{t.dir === 'long' ? 'Long' : 'Short'}</span>
              <span className="tsim-log-px">{fmt(t.entry, dg)} → {fmt(t.exit, dg)}</span>
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
