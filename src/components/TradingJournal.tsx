'use client';

import { useEffect, useMemo, useState } from 'react';

type Dir = 'long' | 'short';

type Trade = {
  id: string;
  date: string;
  instrument: string;
  dir: Dir;
  entry: number;
  sl: number | null;
  exit: number;
  risk: number | null; // kwota ryzykowana w zł
  note: string;
};

const LS_KEY = 'kf-dziennik-transakcji-v1';

const EXAMPLE: Trade[] = [
  { id: 'ex1', date: '2026-06-02', instrument: 'EUR/USD', dir: 'long',  entry: 1.0820, sl: 1.0790, exit: 1.0910, risk: 100, note: 'Odbicie od wsparcia, engulfing H1' },
  { id: 'ex2', date: '2026-06-03', instrument: 'US100',   dir: 'short', entry: 19850,  sl: 19980,  exit: 20040, risk: 100, note: 'Fałszywe wybicie, wszedłem za wcześnie' },
  { id: 'ex3', date: '2026-06-05', instrument: 'BTC/USD',  dir: 'long',  entry: 68200,  sl: 66800,  exit: 72600, risk: 100, note: 'Flaga byka, trzymałem do TP' },
  { id: 'ex4', date: '2026-06-06', instrument: 'GER40',    dir: 'long',  entry: 18420,  sl: 18300,  exit: 18420, risk: 100, note: 'Setup się nie rozwinął, wyjście na BE' },
];

/* ── Obliczenia ── */
function rMultiple(t: Trade): number | null {
  if (t.sl === null) return null;
  const riskPerUnit = t.dir === 'long' ? t.entry - t.sl : t.sl - t.entry;
  if (riskPerUnit <= 0) return null;
  const reward = t.dir === 'long' ? t.exit - t.entry : t.entry - t.exit;
  return reward / riskPerUnit;
}
function pnlZl(t: Trade): number | null {
  const r = rMultiple(t);
  if (r === null || t.risk === null) return null;
  return r * t.risk;
}
type Outcome = 'win' | 'loss' | 'be';
function outcome(t: Trade): Outcome {
  const diff = t.dir === 'long' ? t.exit - t.entry : t.entry - t.exit;
  if (Math.abs(diff) < 1e-9) return 'be';
  return diff > 0 ? 'win' : 'loss';
}

function fmtNum(n: number, max = 4): string {
  return n.toLocaleString('pl-PL', { maximumFractionDigits: max });
}
function fmtR(r: number | null): string {
  if (r === null) return '—';
  return (r >= 0 ? '+' : '') + r.toFixed(2) + 'R';
}
function fmtZl(n: number | null): string {
  if (n === null) return '—';
  return (n >= 0 ? '+' : '') + n.toLocaleString('pl-PL', { maximumFractionDigits: 0 }) + ' zł';
}
function parsePl(v: string): number | null {
  const s = v.trim().replace(/\s/g, '').replace(',', '.');
  if (s === '') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const EMPTY_FORM = { date: '', instrument: '', dir: 'long' as Dir, entry: '', sl: '', exit: '', risk: '', note: '' };

export default function TradingJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [error, setError] = useState('');

  // wczytaj z localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setTrades(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  // zapisz po każdej zmianie (dopiero po wczytaniu, żeby nie nadpisać pustym)
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(trades)); } catch { /* ignore */ }
  }, [trades, loaded]);

  const stats = useMemo(() => {
    const n = trades.length;
    const wins = trades.filter((t) => outcome(t) === 'win').length;
    const losses = trades.filter((t) => outcome(t) === 'loss').length;
    const decided = wins + losses;
    const rs = trades.map(rMultiple).filter((r): r is number => r !== null);
    const sumR = rs.reduce((a, b) => a + b, 0);
    const avgR = rs.length ? sumR / rs.length : null;
    const grossWin = rs.filter((r) => r > 0).reduce((a, b) => a + b, 0);
    const grossLoss = Math.abs(rs.filter((r) => r < 0).reduce((a, b) => a + b, 0));
    const pf = grossLoss > 0 ? grossWin / grossLoss : null;
    const zls = trades.map(pnlZl).filter((z): z is number => z !== null);
    const sumZl = zls.length ? zls.reduce((a, b) => a + b, 0) : null;
    const best = rs.length ? Math.max(...rs) : null;
    const worst = rs.length ? Math.min(...rs) : null;
    return { n, wins, losses, decided, winrate: decided ? (wins / decided) * 100 : null, sumR, avgR, pf, sumZl, best, worst, hasR: rs.length > 0 };
  }, [trades]);

  function addTrade(e: React.FormEvent) {
    e.preventDefault();
    const entry = parsePl(form.entry);
    const exit = parsePl(form.exit);
    if (!form.instrument.trim()) { setError('Podaj instrument.'); return; }
    if (entry === null) { setError('Podaj poprawną cenę wejścia.'); return; }
    if (exit === null) { setError('Podaj poprawną cenę wyjścia.'); return; }
    const t: Trade = {
      id: (crypto.randomUUID?.() ?? String(Date.now() + Math.random())),
      date: form.date || new Date().toISOString().slice(0, 10),
      instrument: form.instrument.trim(),
      dir: form.dir,
      entry,
      sl: parsePl(form.sl),
      exit,
      risk: parsePl(form.risk),
      note: form.note.trim(),
    };
    setTrades((prev) => [t, ...prev]);
    setForm({ ...EMPTY_FORM, dir: form.dir });
    setError('');
  }

  function remove(id: string) {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  }
  function clearAll() {
    if (confirm('Usunąć wszystkie transakcje z dziennika? Tej operacji nie da się cofnąć.')) setTrades([]);
  }
  function loadExample() {
    setTrades(EXAMPLE);
  }
  function exportCsv() {
    const head = ['Data', 'Instrument', 'Kierunek', 'Wejscie', 'SL', 'Wyjscie', 'Ryzyko_zl', 'Wynik_R', 'Wynik_zl', 'Notatka'];
    const rows = trades.map((t) => {
      const r = rMultiple(t);
      const z = pnlZl(t);
      return [
        t.date, t.instrument, t.dir === 'long' ? 'Long' : 'Short',
        t.entry, t.sl ?? '', t.exit, t.risk ?? '',
        r === null ? '' : r.toFixed(2), z === null ? '' : z.toFixed(2),
        (t.note ?? '').replace(/"/g, '""'),
      ].map((c) => `"${c}"`).join(';');
    });
    const csv = '﻿' + [head.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dziennik-transakcji-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section className="tj">
      <style>{CSS}</style>

      <header className="tj-head">
        <p className="tj-eyebrow"><span>Narzędzie · prowadź dziennik</span></p>
        <h2 className="tj-title">Twój <em>dziennik transakcji</em></h2>
        <p className="tj-intro">
          Bez dziennika nie wiesz, czy Twoja strategia działa, tylko zgadujesz. Zapisuj każdą transakcję,
          a poniżej policzy się winrate, średnie R i wynik. Dane trzymane są wyłącznie w Twojej przeglądarce.
          W każdej chwili wyeksportujesz je do pliku CSV.
        </p>
      </header>

      {/* ── Statystyki ── */}
      <div className="tj-stats">
        <div className="tj-stat">
          <span className="tj-stat-n">{stats.n}</span>
          <span className="tj-stat-l">transakcji</span>
        </div>
        <div className="tj-stat">
          <span className="tj-stat-n" style={{ color: stats.winrate === null ? undefined : stats.winrate >= 50 ? 'var(--tj-win)' : 'var(--tj-loss)' }}>
            {stats.winrate === null ? '—' : Math.round(stats.winrate) + '%'}
          </span>
          <span className="tj-stat-l">winrate {stats.decided ? `(${stats.wins}/${stats.decided})` : ''}</span>
        </div>
        <div className="tj-stat">
          <span className="tj-stat-n" style={{ color: stats.avgR === null ? undefined : stats.avgR >= 0 ? 'var(--tj-win)' : 'var(--tj-loss)' }}>
            {stats.avgR === null ? '—' : fmtR(stats.avgR)}
          </span>
          <span className="tj-stat-l">średnie R / trade</span>
        </div>
        <div className="tj-stat">
          <span className="tj-stat-n" style={{ color: !stats.hasR ? undefined : stats.sumR >= 0 ? 'var(--tj-win)' : 'var(--tj-loss)' }}>
            {stats.hasR ? fmtR(stats.sumR) : '—'}
          </span>
          <span className="tj-stat-l">suma R</span>
        </div>
        <div className="tj-stat">
          <span className="tj-stat-n" style={{ color: stats.sumZl === null ? undefined : stats.sumZl >= 0 ? 'var(--tj-win)' : 'var(--tj-loss)' }}>
            {fmtZl(stats.sumZl)}
          </span>
          <span className="tj-stat-l">wynik łączny</span>
        </div>
        <div className="tj-stat">
          <span className="tj-stat-n">{stats.pf === null ? '—' : stats.pf.toFixed(2)}</span>
          <span className="tj-stat-l">profit factor</span>
        </div>
      </div>

      {/* ── Formularz ── */}
      <form className="tj-form" onSubmit={addTrade}>
        <div className="tj-field tj-f-date">
          <label>Data</label>
          <input type="date" value={form.date} onChange={set('date')} />
        </div>
        <div className="tj-field tj-f-inst">
          <label>Instrument</label>
          <input type="text" placeholder="np. EUR/USD" value={form.instrument} onChange={set('instrument')} />
        </div>
        <div className="tj-field tj-f-dir">
          <label>Kierunek</label>
          <select value={form.dir} onChange={set('dir')}>
            <option value="long">Long (kupno)</option>
            <option value="short">Short (sprzedaż)</option>
          </select>
        </div>
        <div className="tj-field">
          <label>Wejście</label>
          <input inputMode="decimal" placeholder="0,00" value={form.entry} onChange={set('entry')} />
        </div>
        <div className="tj-field">
          <label>Stop Loss</label>
          <input inputMode="decimal" placeholder="0,00" value={form.sl} onChange={set('sl')} />
        </div>
        <div className="tj-field">
          <label>Wyjście</label>
          <input inputMode="decimal" placeholder="0,00" value={form.exit} onChange={set('exit')} />
        </div>
        <div className="tj-field">
          <label>Ryzyko (zł)</label>
          <input inputMode="decimal" placeholder="np. 100" value={form.risk} onChange={set('risk')} />
        </div>
        <div className="tj-field tj-f-note">
          <label>Notatka / setup</label>
          <input type="text" placeholder="np. odbicie od wsparcia, engulfing" value={form.note} onChange={set('note')} />
        </div>
        <div className="tj-field tj-f-submit">
          <button type="submit" className="tj-add">Dodaj transakcję</button>
        </div>
        {error && <p className="tj-error">{error}</p>}
      </form>

      <p className="tj-hint">
        <b>R</b> to wynik w jednostkach ryzyka: liczy się z wejścia, stop lossa i wyjścia. Podaj SL, żeby policzyć R.
        Ryzyko w zł jest opcjonalne, ale dzięki niemu zobaczysz wynik w złotówkach.
      </p>

      {/* ── Tabela ── */}
      {trades.length === 0 ? (
        <div className="tj-empty">
          <p>Dziennik jest jeszcze pusty.</p>
          <button type="button" className="tj-ghost" onClick={loadExample}>Wczytaj przykładowe transakcje</button>
        </div>
      ) : (
        <>
          <div className="tj-table-wrap">
            <table className="tj-table">
              <thead>
                <tr>
                  <th>Data</th><th>Instrument</th><th>Kier.</th>
                  <th className="tj-r">Wejście</th><th className="tj-r">SL</th><th className="tj-r">Wyjście</th>
                  <th className="tj-r">Wynik R</th><th className="tj-r">Wynik zł</th><th>Notatka</th><th aria-label="Usuń" />
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => {
                  const r = rMultiple(t);
                  const z = pnlZl(t);
                  const oc = outcome(t);
                  const col = oc === 'win' ? 'var(--tj-win)' : oc === 'loss' ? 'var(--tj-loss)' : 'var(--muted)';
                  return (
                    <tr key={t.id}>
                      <td className="tj-dim">{t.date}</td>
                      <td><b>{t.instrument}</b></td>
                      <td><span className={`tj-badge ${t.dir === 'long' ? 'is-long' : 'is-short'}`}>{t.dir === 'long' ? 'Long' : 'Short'}</span></td>
                      <td className="tj-r tj-mono">{fmtNum(t.entry)}</td>
                      <td className="tj-r tj-mono tj-dim">{t.sl === null ? '—' : fmtNum(t.sl)}</td>
                      <td className="tj-r tj-mono">{fmtNum(t.exit)}</td>
                      <td className="tj-r tj-mono" style={{ color: r === null ? undefined : col, fontWeight: 700 }}>{fmtR(r)}</td>
                      <td className="tj-r tj-mono" style={{ color: z === null ? undefined : col, fontWeight: 700 }}>{fmtZl(z)}</td>
                      <td className="tj-note-cell">{t.note || <span className="tj-dim">—</span>}</td>
                      <td><button className="tj-del" onClick={() => remove(t.id)} aria-label="Usuń transakcję" title="Usuń">×</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="tj-actions">
            <button type="button" className="tj-ghost" onClick={exportCsv}>Eksportuj do CSV</button>
            <button type="button" className="tj-ghost tj-danger" onClick={clearAll}>Wyczyść dziennik</button>
          </div>
        </>
      )}
    </section>
  );
}

const CSS = `
.tj {
  --tj-win: #16a34a;
  --tj-loss: #ef4453;
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(48px, 8vw, 96px) 24px;
  font-family: var(--font-body);
  color: var(--text);
}
.tj-head { max-width: 760px; margin: 0 0 clamp(28px, 4vw, 44px); }
.tj-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.72rem; letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--muted); opacity: 0.75; margin: 0 0 18px; font-weight: 600;
}
.tj-title {
  font-family: var(--font-serif, Georgia, serif);
  font-weight: 600; line-height: 1.05;
  font-size: clamp(2rem, 5vw, 3.1rem); margin: 0 0 18px;
}
.tj-title em { font-style: italic; color: var(--cyan); }
.tj-intro { font-size: 1.02rem; line-height: 1.7; color: var(--muted); margin: 0; }

/* ── Statystyki ── */
.tj-stats {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;
  margin: 0 0 28px;
}
.tj-stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px 16px;
  display: flex; flex-direction: column; gap: 6px;
  min-width: 0;
}
.tj-stat-n { font-family: var(--font-mono); font-size: clamp(1.3rem, 2.4vw, 1.8rem); font-weight: 700; line-height: 1; }
.tj-stat-l { font-size: 0.74rem; color: var(--muted); opacity: 0.8; letter-spacing: 0.02em; }

/* ── Formularz ── */
.tj-form {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
}
.tj-field { display: flex; flex-direction: column; gap: 7px; grid-column: span 3; min-width: 0; }
.tj-f-date { grid-column: span 2; }
.tj-f-inst { grid-column: span 3; }
.tj-f-dir  { grid-column: span 3; }
.tj-f-note { grid-column: span 8; }
.tj-f-submit { grid-column: span 4; justify-content: flex-end; }
.tj-field label {
  font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--muted); opacity: 0.85; font-weight: 600;
}
.tj-field input, .tj-field select {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 11px 12px;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.95rem;
  width: 100%;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.tj-field input:focus, .tj-field select:focus {
  outline: none;
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(201,162,39,0.18);
}
.tj-add {
  width: 100%;
  background: var(--cyan);
  color: #0a0a0a;
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform .12s ease, filter .12s ease;
}
.tj-add:hover { filter: brightness(1.08); transform: translateY(-1px); }
.tj-error { grid-column: 1 / -1; margin: 2px 0 0; color: var(--tj-loss); font-size: 0.88rem; font-weight: 600; }
.tj-hint { font-size: 0.86rem; line-height: 1.6; color: var(--muted); opacity: 0.8; margin: 14px 2px 30px; }
.tj-hint b { color: var(--cyan); }

/* ── Tabela ── */
.tj-table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 16px; }
.tj-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; min-width: 860px; }
.tj-table thead th {
  text-align: left; padding: 14px 14px;
  font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--muted); opacity: 0.75; font-weight: 700;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  white-space: nowrap;
}
.tj-table td { padding: 13px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.tj-table tbody tr:last-child td { border-bottom: none; }
.tj-table tbody tr:hover { background: rgba(201,162,39,0.04); }
.tj-r { text-align: right; }
.tj-mono { font-family: var(--font-mono); }
.tj-dim { color: var(--muted); opacity: 0.7; }
.tj-note-cell { max-width: 260px; color: var(--muted); font-size: 0.85rem; }
.tj-badge {
  display: inline-block; padding: 3px 9px; border-radius: 999px;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.02em;
}
.tj-badge.is-long  { background: rgba(22,163,74,0.14);  color: var(--tj-win); }
.tj-badge.is-short { background: rgba(239,68,83,0.14); color: var(--tj-loss); }
.tj-del {
  background: transparent; border: none; color: var(--muted); opacity: 0.55;
  font-size: 1.3rem; line-height: 1; cursor: pointer; padding: 2px 6px; border-radius: 6px;
  transition: color .12s ease, opacity .12s ease, background .12s ease;
}
.tj-del:hover { color: var(--tj-loss); opacity: 1; background: rgba(239,68,83,0.1); }

/* ── Akcje / empty ── */
.tj-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 18px; }
.tj-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 10px;
  padding: 11px 18px;
  font-weight: 700; font-size: 0.9rem; cursor: pointer;
  transition: border-color .15s ease, background .15s ease;
}
.tj-ghost:hover { border-color: var(--cyan); background: rgba(201,162,39,0.06); }
.tj-danger:hover { border-color: var(--tj-loss); background: rgba(239,68,83,0.08); color: var(--tj-loss); }
.tj-empty {
  text-align: center; padding: 44px 24px;
  border: 1px dashed var(--border); border-radius: 16px;
  color: var(--muted);
}
.tj-empty p { margin: 0 0 18px; font-size: 1rem; }

/* ── Responsywność ── */
@media (max-width: 900px) {
  .tj-stats { grid-template-columns: repeat(3, 1fr); }
  .tj-field, .tj-f-date, .tj-f-inst, .tj-f-dir, .tj-f-note, .tj-f-submit { grid-column: span 6; }
}
@media (max-width: 560px) {
  .tj-stats { grid-template-columns: repeat(2, 1fr); }
  .tj-field, .tj-f-date, .tj-f-inst, .tj-f-dir, .tj-f-note, .tj-f-submit { grid-column: span 12; }
}
`;
