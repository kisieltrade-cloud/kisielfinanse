'use client';

import { useState, useEffect } from 'react';

interface PublicComment { id: string; name: string; text: string; ts: number; }

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'przed chwilą';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min temu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} godz. temu`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} dni temu`;
  return new Date(ts).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
}

const ACCENT = '#c9a227';

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot

  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/comments/${slug}`)
      .then((r) => r.json())
      .then((d) => setComments(Array.isArray(d.comments) ? d.comments : []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, text, newsletter, website }),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error ?? 'Coś poszło nie tak.');
        setStatus('error');
        return;
      }
      if (d.comment) setComments((c) => [d.comment, ...c]);
      setName(''); setEmail(''); setText(''); setNewsletter(false);
      setStatus('ok');
    } catch {
      setError('Brak połączenia. Spróbuj ponownie.');
      setStatus('error');
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '11px 14px',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.92rem',
    width: '100%',
    outline: 'none',
  };

  return (
    <section style={{ maxWidth: 860, margin: '0 auto', padding: '8px 24px 64px' }}>
      <h2 style={{
        fontFamily: 'var(--font-body)', fontWeight: 800,
        fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.3px',
        color: 'var(--text)', margin: '0 0 20px',
      }}>
        Komentarze {loaded && comments.length > 0 && (
          <span style={{ color: ACCENT }}>({comments.length})</span>
        )}
      </h2>

      {/* Formularz */}
      <form onSubmit={submit} style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 'clamp(18px, 3vw, 26px)', marginBottom: 36,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
          <input
            type="text" placeholder="Imię *" value={name} maxLength={60}
            onChange={(e) => setName(e.target.value)} required style={inputStyle}
          />
          <input
            type="email" placeholder="E-mail * (nie będzie widoczny)" value={email}
            onChange={(e) => setEmail(e.target.value)} required style={inputStyle}
          />
        </div>

        <textarea
          placeholder="Twój komentarz *" value={text} maxLength={2000} rows={4}
          onChange={(e) => setText(e.target.value)} required
          style={{ ...inputStyle, resize: 'vertical', marginBottom: 12, lineHeight: 1.6 }}
        />

        {/* Honeypot — ukryte, tylko boty to wypełnią */}
        <input
          type="text" tabIndex={-1} autoComplete="off" value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
          aria-hidden="true"
        />

        <label style={{
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 16,
        }}>
          <input
            type="checkbox" checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
            style={{ width: 17, height: 17, accentColor: ACCENT, cursor: 'pointer', flexShrink: 0 }}
          />
          Zapisz mnie jednocześnie na newsletter
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button
            type="submit" disabled={status === 'sending'}
            style={{
              background: ACCENT, color: '#0a0a0a', border: 'none', borderRadius: 10,
              padding: '11px 26px', fontFamily: 'var(--font-body)', fontWeight: 700,
              fontSize: '0.9rem', cursor: status === 'sending' ? 'default' : 'pointer',
              opacity: status === 'sending' ? 0.6 : 1, transition: 'opacity 0.2s',
            }}
          >
            {status === 'sending' ? 'Wysyłanie...' : 'Dodaj komentarz'}
          </button>
          {status === 'ok' && <span style={{ color: '#3fb96b', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>Dodano komentarz. Dzięki!</span>}
          {status === 'error' && <span style={{ color: '#e0524d', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{error}</span>}
        </div>
      </form>

      {/* Lista komentarzy */}
      {loaded && comments.length === 0 && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)' }}>
          Brak komentarzy. Bądź pierwszy.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {comments.map((c) => (
          <div key={c.id} style={{ display: 'flex', gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: `${ACCENT}22`, color: ACCENT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '1rem',
            }}>
              {c.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>
                  {c.name}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--muted)' }}>
                  {timeAgo(c.ts)}
                </span>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text)',
                lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {c.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
