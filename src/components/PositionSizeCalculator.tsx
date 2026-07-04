'use client';

import { useMemo, useState } from 'react';

type Dir = 'long' | 'short';

function parsePl(v: string): number | null {
  const s = v.trim().replace(/\s/g, '').replace(',', '.');
  if (s === '') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
function fmt(n: number, max = 2): string {
  return n.toLocaleString('pl-PL', { maximumFractionDigits: max });
}

export default function PositionSizeCalculator() {
  const [kapital, setKapital] = useState('10000');
  const [ryzyko, setRyzyko] = useState('1');
  const [dir, setDir] = useState<Dir>('long');
  const [entry, setEntry] = useState('');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');

  const r = useMemo(() => {
    const kap = parsePl(kapital);
    const ryz = parsePl(ryzyko);
    const e = parsePl(entry);
    const s = parsePl(sl);
    const t = parsePl(tp);
    if (kap === null || ryz === null || e === null || s === null) return null;
    if (kap <= 0 || ryz <= 0 || e <= 0) return null;
    const slDist = Math.abs(e - s);
    if (slDist === 0) return null;
    const slSideOk = dir === 'long' ? s < e : s > e;
    const riskZl = kap * (ryz / 100);
    const units = riskZl / slDist;
    const notional = units * e;
    const slPct = (slDist / e) * 100;
    const leverage = notional / kap;
    let rr: number | null = null;
    let profit: number | null = null;
    let tpSideOk = true;
    if (t !== null) {
      const tpDist = Math.abs(t - e);
      tpSideOk = dir === 'long' ? t > e : t < e;
      rr = tpDist / slDist;
      profit = units * tpDist;
    }
    return { riskZl, slDist, units, notional, slPct, leverage, rr, profit, slSideOk, tpSideOk, e };
  }, [kapital, ryzyko, dir, entry, sl, tp]);

  const set = (fn: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => fn(e.target.value);

  return (
    <div className="psc">
      <style>{CSS}</style>

      <div className="psc-grid">
        {/* formularz */}
        <form className="psc-form" onSubmit={(e) => e.preventDefault()}>
          <div className="psc-row2">
            <label className="psc-field">
              <span>Kapitał (zł)</span>
              <input inputMode="decimal" value={kapital} onChange={set(setKapital)} placeholder="10 000" />
            </label>
            <label className="psc-field">
              <span>Ryzyko na transakcję (%)</span>
              <input inputMode="decimal" value={ryzyko} onChange={set(setRyzyko)} placeholder="1" />
            </label>
          </div>

          <div className="psc-dir">
            <button type="button" className={`psc-dir-btn${dir === 'long' ? ' is-long' : ''}`} onClick={() => setDir('long')}>▲ Long</button>
            <button type="button" className={`psc-dir-btn${dir === 'short' ? ' is-short' : ''}`} onClick={() => setDir('short')}>▼ Short</button>
          </div>

          <label className="psc-field">
            <span>Cena wejścia</span>
            <input inputMode="decimal" value={entry} onChange={set(setEntry)} placeholder="np. 100" />
          </label>
          <label className="psc-field">
            <span>Stop loss</span>
            <input inputMode="decimal" value={sl} onChange={set(setSl)} placeholder="np. 98" />
          </label>
          <label className="psc-field">
            <span>Take profit <em>(opcjonalnie)</em></span>
            <input inputMode="decimal" value={tp} onChange={set(setTp)} placeholder="np. 106" />
          </label>

          {r && !r.slSideOk && (
            <p className="psc-warn">Uwaga: przy pozycji {dir === 'long' ? 'Long stop loss powinien być poniżej' : 'Short stop loss powinien być powyżej'} ceny wejścia.</p>
          )}
          {r && r.rr !== null && !r.tpSideOk && (
            <p className="psc-warn">Uwaga: take profit jest po niewłaściwej stronie wejścia dla pozycji {dir === 'long' ? 'Long' : 'Short'}.</p>
          )}
        </form>

        {/* wyniki */}
        <div className="psc-out">
          {!r ? (
            <div className="psc-empty">Uzupełnij kapitał, ryzyko, cenę wejścia i stop loss, żeby policzyć wielkość pozycji.</div>
          ) : (
            <>
              <div className="psc-hero">
                <span className="psc-hero-l">Wielkość pozycji</span>
                <span className="psc-hero-n">{fmt(r.units, r.units < 10 ? 4 : 2)}</span>
                <span className="psc-hero-s">jednostek / akcji / kontraktów</span>
              </div>
              <div className="psc-cards">
                <div className="psc-card">
                  <span className="psc-card-l">Ryzykujesz</span>
                  <span className="psc-card-n">{fmt(r.riskZl)} zł</span>
                </div>
                <div className="psc-card">
                  <span className="psc-card-l">Wartość pozycji</span>
                  <span className="psc-card-n">{fmt(r.notional)} zł</span>
                </div>
                <div className="psc-card">
                  <span className="psc-card-l">Odległość SL</span>
                  <span className="psc-card-n">{fmt(r.slDist, 4)} <small>({fmt(r.slPct)}%)</small></span>
                </div>
                <div className="psc-card">
                  <span className="psc-card-l">Potrzebna dźwignia</span>
                  <span className="psc-card-n">{r.leverage <= 1 ? 'brak' : fmt(r.leverage) + '×'}</span>
                </div>
                {r.rr !== null && (
                  <>
                    <div className="psc-card psc-card-rr">
                      <span className="psc-card-l">Stosunek zysku do ryzyka</span>
                      <span className="psc-card-n" style={{ color: r.rr >= 2 ? 'var(--psc-up)' : r.rr >= 1 ? 'var(--cyan)' : 'var(--psc-dn)' }}>1 : {fmt(r.rr)}</span>
                    </div>
                    <div className="psc-card">
                      <span className="psc-card-l">Potencjalny zysk</span>
                      <span className="psc-card-n" style={{ color: 'var(--psc-up)' }}>{fmt(r.profit ?? 0)} zł</span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <p className="psc-note">
        Zasada jest prosta: nie ryzykuj więcej niż 1-2% kapitału na jedną transakcję. Wielkość pozycji liczy się tak,
        żeby przy dojściu ceny do stop lossa strata wyniosła dokładnie tyle, ile założyłeś. To ona, a nie „przeczucie",
        decyduje ile kupujesz. Więcej o tym w{' '}
        <a href="/trading/wsparcie-i-opor-jak-wyznaczac-poziomy">poziomach</a> i przewodniku{' '}
        <a href="/naucz-sie-tradowac">naucz się tradować</a>.
      </p>
    </div>
  );
}

const CSS = `
.psc { --psc-up: #16a34a; --psc-dn: #ef4453; max-width: 900px; margin: 0 auto; font-family: var(--font-body); color: var(--text); }
.psc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; align-items: start; }
.psc-form { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.psc-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.psc-field { display: flex; flex-direction: column; gap: 6px; }
.psc-field span { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); font-weight: 600; }
.psc-field em { text-transform: none; letter-spacing: 0; opacity: 0.7; font-style: italic; }
.psc-field input { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 11px 12px; color: var(--text); font-family: var(--font-body); font-size: 0.98rem; transition: border-color .15s ease, box-shadow .15s ease; }
.psc-field input:focus { outline: none; border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(201,162,39,0.18); }
.psc-dir { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.psc-dir-btn { background: var(--bg); border: 1px solid var(--border); color: var(--muted); border-radius: 10px; padding: 10px; font-weight: 800; cursor: pointer; font-family: var(--font-body); transition: all .12s ease; }
.psc-dir-btn.is-long { background: rgba(22,163,74,0.15); border-color: var(--psc-up); color: var(--psc-up); }
.psc-dir-btn.is-short { background: rgba(239,68,83,0.15); border-color: var(--psc-dn); color: var(--psc-dn); }
.psc-warn { font-size: 0.82rem; color: var(--psc-dn); margin: 0; line-height: 1.5; }
.psc-out { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 20px; min-height: 100%; }
.psc-empty { color: var(--muted); font-size: 0.95rem; line-height: 1.6; }
.psc-hero { display: flex; flex-direction: column; gap: 4px; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border); }
.psc-hero-l { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); font-weight: 600; }
.psc-hero-n { font-family: var(--font-mono); font-size: 2.2rem; font-weight: 800; line-height: 1; color: var(--cyan); }
.psc-hero-s { font-size: 0.8rem; color: var(--muted); opacity: 0.8; }
.psc-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.psc-card { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; }
.psc-card-rr { grid-column: span 2; }
.psc-card-l { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.03em; color: var(--muted); opacity: 0.85; }
.psc-card-n { font-family: var(--font-mono); font-size: 1.15rem; font-weight: 700; }
.psc-card-n small { font-size: 0.8rem; color: var(--muted); font-weight: 400; }
.psc-note { font-size: 0.86rem; line-height: 1.65; color: var(--muted); opacity: 0.9; margin: 18px 2px 0; }
.psc-note a { color: var(--cyan); }
@media (max-width: 720px) {
  .psc-grid { grid-template-columns: 1fr; }
}
`;
