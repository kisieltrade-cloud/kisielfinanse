'use client';

import { useState } from 'react';

const FORMSPREE_URL = 'https://formspree.io/f/xreajlln';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="newsletter-bg" />

      <div className="section-label" style={{ textAlign: 'center', marginBottom: 16 }}>
        // zostań na bieżąco
      </div>

      <h2>
        DOŁĄCZ DO
        <br />
        <span className="gradient-text-cp">LISTY</span>
      </h2>

      <p>
        Cotygodniowe podsumowanie rynków, moje setup&apos;y i to,
        o czym nie piszę publicznie. Zero spamu.
      </p>

      {status === 'success' ? (
        <div style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--cyan)',
          fontSize: '0.9rem',
          border: '1px solid var(--border)',
          padding: '16px 32px',
          display: 'inline-block',
          position: 'relative',
          zIndex: 2,
        }}>
          ✓ Jesteś na liście. Do zobaczenia w skrzynce!
        </div>
      ) : (
        <>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="twoj@email.pl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn" disabled={status === 'loading'}>
              {status === 'loading' ? '...' : 'ZAPISZ'}
            </button>
          </form>
          {status === 'error' && (
            <p style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--pink)',
              fontSize: '0.75rem',
              marginTop: 12,
              position: 'relative',
              zIndex: 2,
            }}>
              Coś poszło nie tak. Spróbuj ponownie.
            </p>
          )}
        </>
      )}
    </section>
  );
}
