'use client';

import { useState } from 'react';

interface Props {
  variant?: 'inline' | 'card'; // inline = poziomy, card = pelny kafelek
}

export default function NewsletterForm({ variant = 'card' }: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setState('ok');
        setEmail('');
      } else {
        setState('error');
        setMsg(data.error ?? 'Cos poszlo nie tak.');
      }
    } catch {
      setState('error');
      setMsg('Blad polaczenia. Sprobuj za chwile.');
    }
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="newsletter-inline">
        {state === 'ok' ? (
          <p className="newsletter-ok">Zapisano. Sprawdz skrzynke.</p>
        ) : (
          <>
            <input
              type="email"
              className="newsletter-input"
              placeholder="twoj@email.pl"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={state === 'loading'}
              required
            />
            <button
              type="submit"
              className="newsletter-btn"
              disabled={state === 'loading'}
            >
              {state === 'loading' ? '...' : 'Zapisz sie'}
            </button>
          </>
        )}
        {state === 'error' && <p className="newsletter-err">{msg}</p>}
      </form>
    );
  }

  // card variant
  return (
    <div className="newsletter-card">
      <div className="newsletter-card-label">NEWSLETTER</div>
      <h3 className="newsletter-card-title">Bez szumu. Kiedy mam cos wartego wysłania.</h3>
      <p className="newsletter-card-desc">
        Analizy, strategie i rzeczy ktore sam stosuje — zanim stana sie oczywiste.
        Bez cotygodniowego przymusu.
      </p>

      {state === 'ok' ? (
        <div className="newsletter-card-ok">
          <span style={{ fontSize: '1.4rem' }}>✓</span>
          <p>Zapisano. Sprawdz skrzynke - wyslałem maila powitalnego.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="newsletter-card-form">
          <input
            type="email"
            className="newsletter-input newsletter-input-card"
            placeholder="twoj@email.pl"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={state === 'loading'}
            required
          />
          <button
            type="submit"
            className="newsletter-btn newsletter-btn-card"
            disabled={state === 'loading'}
          >
            {state === 'loading' ? 'Wysylam...' : 'Zapisz sie'}
          </button>
          {state === 'error' && <p className="newsletter-err">{msg}</p>}
        </form>
      )}

      <p className="newsletter-card-fine">Zero spamu. Wypiszesz sie w jednym kliknieciu.</p>
    </div>
  );
}
