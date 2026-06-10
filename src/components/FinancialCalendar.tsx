'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CAL_CATEGORIES, CalCategoryId, CalEvent, dayNum, monthName, nextEvent,
} from '@/lib/calendar-2026';

// Finansowy kalendarz 2026 - design edytorialny (agenda), nie card-grid.
// Duża typografia dat, serif nagłówki miesięcy, hairline'y, kategoria jako
// powściągliwa kolorowa etykieta. Bez poświat, gradientów i wypełnionych chipsów.

interface Props {
  events: CalEvent[];
  todayISO: string;
}

const MONTHS_PL = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];
const MONTHS_ABBR = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU'];
const catMap = Object.fromEntries(CAL_CATEGORIES.map((c) => [c.id, c]));

export default function FinancialCalendar({ events, todayISO }: Props) {
  const [active, setActive] = useState<CalCategoryId | 'all'>('all');

  const sorted = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [events]);
  const upcoming = useMemo(() => nextEvent(events, todayISO), [events, todayISO]);
  const filtered = active === 'all' ? sorted : sorted.filter((e) => e.category === active);

  const byMonth = useMemo(() => {
    const m = new Map<number, CalEvent[]>();
    for (const e of filtered) {
      const k = new Date(e.date).getMonth();
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(e);
    }
    return Array.from(m.entries()).sort((a, b) => a[0] - b[0]);
  }, [filtered]);

  return (
    <div className="fc">
      {/* Najbliższe - jedna edytorialna linia, bez pudełka */}
      {upcoming && (
        <p className="fc-next" style={{ ['--c' as string]: catMap[upcoming.category].rgb }}>
          <span className="fc-next-tag">Najbliżej</span>
          <span className="fc-next-date">{dayNum(upcoming.date)} {monthName(upcoming.date).toLowerCase()}</span>
          <span className="fc-next-sep">·</span>
          <span className="fc-next-title">{upcoming.title}</span>
        </p>
      )}

      {/* Filtr - powściągliwa nawigacja tekstowa */}
      <nav className="fc-filters" aria-label="Filtruj kategorie">
        <button
          type="button"
          className={`fc-filter${active === 'all' ? ' fc-filter--on' : ''}`}
          onClick={() => setActive('all')}
        >
          Wszystkie
        </button>
        {CAL_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`fc-filter${active === c.id ? ' fc-filter--on' : ''}`}
            style={{ ['--c' as string]: c.rgb }}
            onClick={() => setActive(c.id)}
          >
            {c.label}
          </button>
        ))}
      </nav>

      {/* Miesiące */}
      {byMonth.map(([monthIdx, evs]) => (
        <section key={monthIdx} className="fc-month">
          <h3 className="fc-month-head">
            <span className="fc-month-name">{MONTHS_PL[monthIdx]}</span>
            <span className="fc-month-rule" aria-hidden="true" />
            <span className="fc-month-count">{evs.length}</span>
          </h3>

          {evs.map((e, i) => {
            const cat = catMap[e.category];
            const past = e.date < todayISO;
            const isNext = upcoming && e.date === upcoming.date && e.title === upcoming.title;
            const cls = `fc-row${past ? ' fc-row--past' : ''}${isNext ? ' fc-row--next' : ''}`;
            const inner = (
              <>
                <span className="fc-day" style={{ ['--c' as string]: cat.rgb }}>
                  <strong>{dayNum(e.date)}</strong>
                  <em>{MONTHS_ABBR[new Date(e.date).getMonth()]}</em>
                </span>
                <span className="fc-content">
                  <span className="fc-headline">
                    {isNext && <span className="fc-flag">Najbliżej</span>}
                    <span className="fc-title">{e.title}</span>
                    <span className="fc-cat" style={{ ['--c' as string]: cat.rgb }}>{cat.label}</span>
                  </span>
                  <span className="fc-desc">{e.desc}{e.approx && <em className="fc-approx"> (data orientacyjna)</em>}</span>
                  {e.href && <span className="fc-cta">Przeczytaj <span aria-hidden="true">&rarr;</span></span>}
                </span>
              </>
            );
            return e.href
              ? <Link key={`${e.date}-${i}`} href={e.href} className={cls}>{inner}</Link>
              : <div key={`${e.date}-${i}`} className={cls}>{inner}</div>;
          })}
        </section>
      ))}

      <style>{`
        .fc { margin-top: 18px; }

        .fc-next { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px;
          margin: 0 0 30px; padding: 0 0 0 16px; border-left: 3px solid rgb(var(--c));
          font-size: 1.02rem; }
        .fc-next-tag { font-size: .7rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase;
          color: rgb(var(--c)); }
        .fc-next-date { font-weight: 800; color: var(--text); }
        .fc-next-sep { color: var(--muted); }
        .fc-next-title { color: var(--muted); }

        .fc-filters { display: flex; flex-wrap: wrap; gap: 22px; margin: 0 0 6px;
          padding-bottom: 16px; }
        .fc-filter { background: none; border: none; padding: 0 0 4px; cursor: pointer;
          font-size: .82rem; font-weight: 700; letter-spacing: .04em; color: var(--muted);
          border-bottom: 2px solid transparent; transition: color .15s, border-color .15s; }
        .fc-filter:hover { color: var(--text); }
        .fc-filter--on { color: var(--text); border-bottom-color: rgb(var(--c, 201 162 39)); }

        .fc-month { margin-top: 34px; }
        .fc-month-head { display: flex; align-items: center; gap: 16px; margin: 0 0 6px; }
        .fc-month-name { font-family: var(--font-serif, Georgia), serif; font-size: 1.7rem;
          font-weight: 800; color: var(--text); letter-spacing: -.01em; }
        .fc-month-rule { flex: 1; height: 1px; background: var(--border); }
        .fc-month-count { font-size: .8rem; color: var(--muted); font-variant-numeric: tabular-nums; }

        .fc-row { display: grid; grid-template-columns: 64px 1fr; gap: 22px; align-items: start;
          padding: 20px 0; border-bottom: 1px solid var(--border);
          text-decoration: none; color: inherit; }
        a.fc-row:hover .fc-title { text-decoration: underline; text-underline-offset: 4px; }
        a.fc-row:hover .fc-cta { opacity: 1; transform: translateX(0); }
        .fc-row--past { opacity: .42; }

        .fc-day { display: flex; flex-direction: column; align-items: flex-start; line-height: 1;
          padding-top: 2px; }
        .fc-day strong { font-family: var(--font-display, sans-serif); font-size: 2.5rem; font-weight: 400;
          letter-spacing: .02em; color: var(--text); }
        .fc-day em { font-style: normal; font-size: .72rem; font-weight: 700; letter-spacing: .12em;
          color: rgb(var(--c)); margin-top: 2px; }
        /* cienki znacznik kategorii przy dacie */
        .fc-row--next .fc-day { position: relative; }

        .fc-content { min-width: 0; }
        .fc-headline { display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px 14px; }
        .fc-flag { font-size: .64rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase;
          color: #0e1116; background: rgb(var(--c)); padding: 3px 8px; border-radius: 4px; }
        .fc-title { font-size: 1.18rem; font-weight: 700; color: var(--text); line-height: 1.25; }
        .fc-cat { font-size: .68rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase;
          color: rgb(var(--c)); }
        .fc-desc { display: block; margin-top: 7px; color: var(--muted); font-size: .96rem; line-height: 1.6;
          max-width: 62ch; }
        .fc-approx { font-style: italic; }
        .fc-cta { display: inline-block; margin-top: 9px; font-size: .82rem; font-weight: 700;
          color: var(--text); opacity: .55; transform: translateX(-4px);
          transition: opacity .15s, transform .15s; }
        .fc-cta span { color: rgb(var(--c, 201 162 39)); }

        @media (max-width: 560px) {
          .fc-row { grid-template-columns: 52px 1fr; gap: 16px; padding: 16px 0; }
          .fc-day strong { font-size: 2rem; }
          .fc-title { font-size: 1.08rem; }
        }
      `}</style>
    </div>
  );
}
