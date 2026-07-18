'use client';

import { useState } from 'react';
import { PATTERNS, BIAS_LABEL, KIND_LABEL, type Pattern } from '@/lib/patterns';
import { Candles, LineChart } from './PatternChart';

const TABS: { k: string; label: string; pred: (p: Pattern) => boolean }[] = [
  { k: 'all', label: 'Wszystkie', pred: () => true },
  { k: 'swiecowe', label: 'Świecowe', pred: (p) => p.group === 'swiecowe' },
  { k: 'wykresu', label: 'Wykresu', pred: (p) => p.group === 'wykresu' },
  { k: 'odwrocenie', label: 'Odwrócenie', pred: (p) => p.kind === 'odwrocenie' },
  { k: 'kontynuacja', label: 'Kontynuacja', pred: (p) => p.kind === 'kontynuacja' },
];

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
