'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // Replace with your email service (Resend, Mailerlite, ConvertKit etc.)
    // Example: await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
    await new Promise((r) => setTimeout(r, 800)); // fake delay

    setStatus('success');
    setEmail('');
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
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--cyan)',
            fontSize: '0.9rem',
            border: '1px solid var(--border)',
            padding: '16px 32px',
            display: 'inline-block',
            position: 'relative',
            zIndex: 2,
          }}
        >
          ✓ Jesteś na liście. Do zobaczenia w skrzynce!
        </div>
      ) : (
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
      )}
    </section>
  );
}
