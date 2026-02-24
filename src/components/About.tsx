'use client';

import { useState } from 'react';

const TIMELINE = [
  {
    year: '2018',
    title: 'Pierwsze kroki — krypto',
    desc: 'Zacząłem jak większość — od Bitcoina, nocnych sesji i uczenia się na własnych błędach. Rynek krypto nauczył mnie szybko, że emocje to najgorszy doradca.',
    color: 'var(--purple)',
  },
  {
    year: '2020',
    title: 'Forex i pierwsza strategia',
    desc: 'Wejście na rynek Forex otworzyło mi oczy na to czym naprawdę jest płynność i struktura rynku. Zbudowałem swój pierwszy system oparty na price action.',
    color: 'var(--cyan)',
  },
  {
    year: '2022',
    title: 'Futures i indeksy',
    desc: 'Rozszerzenie na futures i indeksy — NAS100, S&P500. Nauczyłem się czytać makro i rozumieć jak wielki kapitał porusza rynkami.',
    color: 'var(--yellow)',
  },
  {
    year: '2026',
    title: 'NysethTrading',
    desc: 'Decyzja o jawności — publikowanie wyników, dzielenie się wiedzą i budowanie społeczności traderów, którzy traktują to poważnie.',
    color: 'var(--pink)',
  },
];

const VALUES = [
  {
    icon: '◈',
    title: 'Transparentność',
    desc: 'Pokazuję wszystko — dobre i złe tygodnie. Prawdziwy trading to nie tylko zielone wyniki.',
    color: 'var(--cyan)',
  },
  {
    icon: '◎',
    title: 'Dyscyplina',
    desc: 'System ponad emocje. Każda transakcja musi spełniać moje kryteria — bez wyjątków.',
    color: 'var(--purple)',
  },
  {
    icon: '◇',
    title: 'Ciągły rozwój',
    desc: '7 lat i wciąż się uczę. Rynek się zmienia — trader też musi.',
    color: 'var(--yellow)',
  },
];

// ─────────────────────────────────────
// AKTUALIZUJ WIN RATE CO TYDZIEŃ
// ─────────────────────────────────────
const CURRENT_WIN_RATE = '—';  // wpisz np. '68%' kiedy będziesz mieć dane

export default function About() {
  const [tlIdx, setTlIdx] = useState(0);

  return (
    <section className="about-section" id="o-mnie">
      <div className="about-bg-grid" />
      <div className="about-glow" />

      <div className="about-inner">

        <div className="about-hero">
          <div className="section-label">// kim jestem</div>
          <h2 className="section-title" style={{ marginBottom: 24 }}>
            CZEŚĆ,<br />
            JESTEM{' '}
            <span className="gradient-text-cp">NYSETH</span>
          </h2>

          <p className="about-bio">
            Trader z <strong>Wrocławia</strong> z blisko{' '}
            <strong>7-letnim doświadczeniem</strong> na rynkach finansowych.
            Zajmuję się day tradingiem na Forexie, rynku krypto oraz kontraktach
            futures na indeksy giełdowe. Wierzę, że konsekwencja, zarządzanie
            ryzykiem i chłodna głowa są ważniejsze niż jakikolwiek system czy
            strategia.
          </p>

          <div className="about-tags">
            {['Day Trading', 'Forex', 'Krypto', 'Futures / Indeksy'].map((tag) => (
              <span key={tag} className="about-tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="about-stats">
          {[
            { val: '7', label: 'Lat doświadczenia' },
            { val: '1000+', label: 'Zamkniętych pozycji' },
            { val: CURRENT_WIN_RATE, label: 'Aktualny Win Rate' },
          ].map((s) => (
            <div key={s.label} className="about-stat-card">
              <span className="about-stat-num">{s.val}</span>
              <span className="about-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="about-timeline-wrap">
          <div className="section-label">// moja droga</div>
          <h3 className="about-subtitle">
            7 LAT{' '}
            <span className="gradient-text-pp">NA RYNKACH</span>
          </h3>

          <div className="tl-nav">
            {TIMELINE.map((t, i) => (
              <button
                key={t.year}
                className={`tl-btn${tlIdx === i ? ' tl-btn-active' : ''}`}
                style={tlIdx === i ? { color: t.color, borderBottomColor: t.color } : {}}
                onClick={() => setTlIdx(i)}
              >
                {t.year}
              </button>
            ))}
          </div>

          <div className="tl-content" style={{ borderTopColor: TIMELINE[tlIdx].color }}>
            <div className="tl-title">{TIMELINE[tlIdx].title}</div>
            <p className="tl-desc">{TIMELINE[tlIdx].desc}</p>
          </div>
        </div>

        <div className="about-values-wrap">
          <div className="section-label">// moja filozofia</div>
          <h3 className="about-subtitle">
            W CO{' '}
            <span className="gradient-text-cp">WIERZĘ</span>
          </h3>

          <div className="about-values-grid">
            {VALUES.map((v) => (
              <div key={v.title} className="value-card" style={{ '--vc': v.color } as React.CSSProperties}>
                <div className="value-icon">{v.icon}</div>
                <div className="value-title">{v.title}</div>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-cta">
          <div>
            <div className="about-cta-title">Śledź moje wyniki na żywo</div>
            <div className="about-cta-sub">
              Co tydzień publikuję swoje wyniki. Bez filtrów, bez owijania w bawełnę.
            </div>
          </div>
          <a href="/wyniki" className="btn-primary">
            ZOBACZ WYNIKI →
          </a>
        </div>

      </div>
    </section>
  );
}
