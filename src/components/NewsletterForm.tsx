'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Props {
  variant?: 'inline' | 'card'; // inline = poziomy, card = pelny kafelek
}

const EBOOK_URL = '/ebook/finansowy-fundament-2026.pdf';

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
        setMsg(data.error ?? 'Coś poszło nie tak.');
      }
    } catch {
      setState('error');
      setMsg('Błąd połączenia. Spróbuj za chwilę.');
    }
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="newsletter-inline">
        {state === 'ok' ? (
          <p className="newsletter-ok">
            Zapisano. <a href={EBOOK_URL} target="_blank" rel="noopener" style={{ color: 'var(--cyan)', fontWeight: 700 }}>Pobierz przewodnik →</a> (jest też w mailu).
          </p>
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
              {state === 'loading' ? '...' : 'Zapisz się'}
            </button>
          </>
        )}
        {state === 'error' && <p className="newsletter-err">{msg}</p>}
        <p style={{ fontSize: '0.7rem', color: 'var(--muted)', margin: '4px 0 0' }}>
          Zapisując się akceptujesz{' '}
          <Link href="/regulamin" style={{ color: 'inherit', textDecoration: 'underline' }}>
            regulamin
          </Link>
          {' '}i{' '}
          <Link href="/polityka-prywatnosci" style={{ color: 'inherit', textDecoration: 'underline' }}>
            politykę prywatności
          </Link>
          .
        </p>
      </form>
    );
  }

  // card variant
  return (
    <div className="newsletter-card">
      <div className="newsletter-card-label">DARMOWY PRZEWODNIK</div>
      <h3 className="newsletter-card-title">Odbierz „Finansowy Fundament" za darmo.</h3>
      <p className="newsletter-card-desc">
        Zapisz się i pobierz przewodnik, który układa Twoje pieniądze w 7 krokach: od bilansu, przez poduszkę i konto, po pierwsze inwestycje. Plus mail, kiedy mam coś wartego wysłania.
      </p>

      {state === 'ok' ? (
        <div className="newsletter-card-ok">
          <span style={{ fontSize: '1.4rem' }}>✓</span>
          <p>
            Zapisano. <a href={EBOOK_URL} target="_blank" rel="noopener" style={{ color: 'var(--cyan)', fontWeight: 700, textDecoration: 'underline' }}>Pobierz przewodnik →</a><br />
            Wysłałem go też na Twojego maila.
          </p>
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
            {state === 'loading' ? 'Wysyłam...' : 'Zapisz się'}
          </button>
          {state === 'error' && <p className="newsletter-err">{msg}</p>}
        </form>
      )}

      <p className="newsletter-card-fine">
        Zero spamu. Wypiszesz się w każdej chwili.{' '}
        Zapisując się akceptujesz{' '}
        <Link href="/regulamin" style={{ color: 'inherit', textDecoration: 'underline' }}>
          regulamin
        </Link>
        {' '}i{' '}
        <Link href="/polityka-prywatnosci" style={{ color: 'inherit', textDecoration: 'underline' }}>
          politykę prywatności
        </Link>
        .
      </p>
    </div>
  );
}
