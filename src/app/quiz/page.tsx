'use client';

import Link from 'next/link';

const QUIZZES = [
  {
    href: '/quiz/typ-inwestora',
    emoji: '🎯',
    count: '7 pytań',
    title: 'Jaki typ inwestora jesteś?',
    desc: 'Agresywny trader, pasywny inwestor ETF, a może konserwatywny oszczędzający? Sprawdź swój profil.',
    color: '#b8960a',
  },
  {
    href: '/quiz/wiedza',
    emoji: '🧠',
    count: '10 pytań',
    title: 'Sprawdź swoją wiedzę finansową',
    desc: '10 pytań z finansów, inwestycji i tradingu. Ile punktów zdobędziesz?',
    color: '#2563eb',
  },
];

const C = { white: '#ffffff', text: '#1a2230', muted: '#5a6a7a', border: '#dde3ea', gold: '#b8960a' };

export default function QuizPage() {
  return (
    <main style={{ minHeight: '80vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', background: C.white, borderRadius: 16, padding: '48px 40px', border: `1px solid ${C.border}` }}>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '3px', color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>
          Quiz
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: C.text, marginBottom: 8, lineHeight: 1.1 }}>
          Wybierz quiz
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: C.muted, marginBottom: 40, lineHeight: 1.6, margin: '0 0 40px' }}>
          Sprawdź swój profil inwestora lub przetestuj wiedzę finansową.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {QUIZZES.map((q) => (
            <Link key={q.href} href={q.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  padding: '22px 24px',
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 12,
                  background: C.white,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = q.color}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = C.border}
              >
                <div style={{ fontSize: '2rem', flexShrink: 0, lineHeight: 1 }}>{q.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '2px', color: q.color, textTransform: 'uppercase', marginBottom: 6 }}>
                    {q.count}
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: C.text, margin: '0 0 5px', lineHeight: 1.25 }}>
                    {q.title}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: C.muted, margin: 0, lineHeight: 1.6 }}>
                    {q.desc}
                  </p>
                </div>
                <div style={{ color: C.muted, fontSize: '1rem', flexShrink: 0, opacity: 0.6 }}>→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
