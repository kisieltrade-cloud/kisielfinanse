'use client';

import Link from 'next/link';

export default function QuizPage() {
  return (
    <main style={{ minHeight: '80vh', padding: '120px 24px 80px', maxWidth: 800, margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '3px', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>
          QUIZ
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#e8eaf6', marginBottom: 48, lineHeight: 1.1 }}>
          WYBIERZ QUIZ
        </h1>

        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Link href="/quiz/typ-inwestora" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0d1520, #0a1020)',
              border: '1px solid rgba(201,162,39,0.3)',
              borderRadius: 16,
              padding: 32,
              cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,162,39,0.8)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,162,39,0.3)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>🎯</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '3px', color: 'var(--gold)', marginBottom: 12, textTransform: 'uppercase' }}>
                7 pytań
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#e8eaf6', marginBottom: 12, lineHeight: 1.2 }}>
                Jaki typ inwestora jesteś?
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#8892a4', lineHeight: 1.7, margin: 0 }}>
                Agresywny trader, pasywny inwestor ETF, a może konserwatywny oszczędzający? Sprawdź.
              </p>
            </div>
          </Link>

          <Link href="/quiz/wiedza" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0d1520, #0a1020)',
              border: '1px solid rgba(100,160,255,0.3)',
              borderRadius: 16,
              padding: 32,
              cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,160,255,0.8)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,160,255,0.3)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>🧠</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '3px', color: '#6aaeff', marginBottom: 12, textTransform: 'uppercase' }}>
                10 pytań
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#e8eaf6', marginBottom: 12, lineHeight: 1.2 }}>
                Sprawdź swoją wiedzę finansową
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#8892a4', lineHeight: 1.7, margin: 0 }}>
                10 pytań z finansów, inwestycji i tradingu. Ile punktów zdobędziesz?
              </p>
            </div>
          </Link>
        </div>
    </main>
  );
}
