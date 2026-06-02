'use client';

import { useState, useEffect, useMemo } from 'react';
import { BACKTEST_ASSETS, type PricePoint } from '@/lib/backtest';

const fmtMoney = (n: number) => Math.round(n).toLocaleString('pl-PL') + ' zł';

interface SimPoint { t: number; value: number; invested: number; }
interface SimResult {
  points: SimPoint[];
  invested: number;
  value: number;
  profit: number;
  mult: number;
}

function simulate(prices: PricePoint[], amount: number, startYear: number, monthly: boolean): SimResult | null {
  const series = prices.filter((p) => new Date(p.t * 1000).getFullYear() >= startYear);
  if (series.length < 2 || amount <= 0) return null;

  let units = 0;
  let invested = 0;
  const points: SimPoint[] = [];

  if (monthly) {
    for (const p of series) {
      units += amount / p.c;
      invested += amount;
      points.push({ t: p.t, value: units * p.c, invested });
    }
  } else {
    units = amount / series[0].c;
    invested = amount;
    for (const p of series) points.push({ t: p.t, value: units * p.c, invested });
  }

  const last = points[points.length - 1];
  return { points, invested: last.invested, value: last.value, profit: last.value - last.invested, mult: last.value / last.invested };
}

function Chart({ result, accent }: { result: SimResult; accent: string }) {
  const W = 600, H = 220, padX = 8, padY = 14;
  const pts = result.points;
  const max = Math.max(...pts.map((p) => Math.max(p.value, p.invested)));
  const x = (i: number) => padX + (i / (pts.length - 1)) * (W - padX * 2);
  const y = (v: number) => H - padY - (v / max) * (H - padY * 2);

  const valLine = pts.map((p, i) => `${x(i)},${y(p.value)}`).join(' ');
  const invLine = pts.map((p, i) => `${x(i)},${y(p.invested)}`).join(' ');
  const area = `${x(0)},${H - padY} ${valLine} ${x(pts.length - 1)},${H - padY}`;

  const firstYear = new Date(pts[0].t * 1000).getFullYear();
  const lastYear = new Date(pts[pts.length - 1].t * 1000).getFullYear();

  return (
    <svg viewBox={`0 0 ${W} ${H + 22}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="tt-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#tt-fill)" />
      {/* linia wpłat (przerywana) */}
      <polyline points={invLine} fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      {/* linia wartości */}
      <polyline points={valLine} fill="none" stroke={accent} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(pts.length - 1)} cy={y(pts[pts.length - 1].value)} r="4" fill={accent} />
      <text x={padX} y={H + 16} fill="var(--muted)" fontSize="11" fontFamily="var(--font-mono)">{firstYear}</text>
      <text x={W - padX} y={H + 16} fill="var(--muted)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="end">{lastYear}</text>
    </svg>
  );
}

export default function TimeTravel() {
  const [assetKey, setAssetKey] = useState('sp500');
  const [amount, setAmount] = useState('500');
  const [monthly, setMonthly] = useState(true);
  const [startYear, setStartYear] = useState(2015);
  const [cache, setCache] = useState<Record<string, PricePoint[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const asset = BACKTEST_ASSETS.find((a) => a.key === assetKey)!;
  const prices = cache[assetKey] ?? [];

  useEffect(() => {
    if (cache[assetKey]) return;
    setLoading(true);
    setError('');
    fetch(`/api/backtest/${assetKey}`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.prices) && d.prices.length > 1) {
          setCache((c) => ({ ...c, [assetKey]: d.prices }));
        } else {
          setError('Dane chwilowo niedostępne dla tego aktywa.');
        }
      })
      .catch(() => setError('Brak połączenia z danymi.'))
      .finally(() => setLoading(false));
  }, [assetKey, cache]);

  // dostępny zakres lat dla aktywa
  const { minYear, maxYear } = useMemo(() => {
    if (prices.length < 2) return { minYear: 2010, maxYear: 2024 };
    const first = new Date(prices[0].t * 1000).getFullYear();
    const last = new Date(prices[prices.length - 1].t * 1000).getFullYear();
    return { minYear: first, maxYear: Math.max(first + 1, last - 1) };
  }, [prices]);

  // przytnij startYear do zakresu
  useEffect(() => {
    setStartYear((y) => Math.min(Math.max(y, minYear), maxYear));
  }, [minYear, maxYear]);

  const result = useMemo(
    () => simulate(prices, parseFloat(amount) || 0, startYear, monthly),
    [prices, amount, startYear, monthly],
  );

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 20, padding: 'clamp(20px, 4vw, 34px)',
    }}>
      {/* Wybór aktywa */}
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>W co inwestujesz</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 26 }}>
        {BACKTEST_ASSETS.map((a) => {
          const on = a.key === assetKey;
          return (
            <button key={a.key} type="button" onClick={() => setAssetKey(a.key)} style={{
              textAlign: 'left', padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
              background: on ? `${a.accent}1c` : 'var(--bg)',
              border: `1px solid ${on ? a.accent : 'var(--border)'}`,
              transition: 'all 0.15s',
            }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem', color: on ? a.accent : 'var(--text)' }}>{a.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: 2 }}>{a.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Kwota + tryb */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 22 }}>
        <div>
          <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
            {monthly ? 'Kwota miesięcznie' : 'Kwota jednorazowo'}
          </label>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 7 }}>
            <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '1.2rem', fontWeight: 700, width: '100%', outline: 'none' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>zł</span>
          </div>
        </div>
        <div>
          <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Sposób</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ k: true, l: 'Co miesiąc' }, { k: false, l: 'Jednorazowo' }].map((m) => (
              <button key={m.l} type="button" onClick={() => setMonthly(m.k)} style={{
                flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.74rem',
                background: monthly === m.k ? `${asset.accent}1c` : 'transparent',
                border: `1px solid ${monthly === m.k ? asset.accent : 'var(--border)'}`,
                color: monthly === m.k ? asset.accent : 'var(--muted)',
              }}>{m.l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Rok startu */}
      <div style={{ marginBottom: 30 }}>
        <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Od kiedy inwestujesz</span>
          <span style={{ color: asset.accent, fontWeight: 700 }}>{startYear}</span>
        </label>
        <input type="range" min={minYear} max={maxYear} value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value, 10))}
          style={{ width: '100%', accentColor: asset.accent, cursor: 'pointer' }} />
      </div>

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 28 }} />

      {/* Wynik */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>Wczytuję dane...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e0524d' }}>{error}</div>
      ) : result ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, padding: '22px 26px', background: `${asset.accent}12`, border: `1px solid ${asset.accent}40`, borderRadius: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: 6 }}>Dziś miałbyś</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 3.2rem)', color: asset.accent, letterSpacing: '1px', lineHeight: 1 }}>{fmtMoney(result.value)}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 26 }}>
            {[
              { l: 'Wpłaciłeś', v: fmtMoney(result.invested), c: 'var(--text)' },
              { l: 'Zysk', v: (result.profit >= 0 ? '+' : '') + fmtMoney(result.profit), c: result.profit >= 0 ? '#3fb96b' : '#e0524d' },
              { l: 'Pomnożone', v: '×' + result.mult.toFixed(1), c: asset.accent },
            ].map((s) => (
              <div key={s.l} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: 4 }}>{s.l}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', color: s.c, letterSpacing: '0.5px' }}>{s.v}</div>
              </div>
            ))}
          </div>

          <Chart result={result} accent={asset.accent} />
          <div style={{ display: 'flex', gap: 18, marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--muted)' }}>
            <span><span style={{ color: asset.accent }}>━</span> wartość portfela</span>
            <span><span style={{ color: 'var(--muted)' }}>┄</span> suma wpłat</span>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>Ustaw kwotę i rok, żeby zobaczyć wynik.</div>
      )}
    </div>
  );
}
