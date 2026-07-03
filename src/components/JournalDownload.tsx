'use client';

import { useState } from 'react';
import Link from 'next/link';

const FILE_URL = '/pliki/dziennik-transakcji-kisielfinanse.xlsx';

const INSIDE = [
  { t: 'Gotowe kolumny', d: 'Data, instrument, kierunek, wejście, SL, wyjście, ryzyko i notatki.' },
  { t: 'Auto-liczenie', d: 'Wynik w R, w złotówkach i etykieta zysk/strata liczą się same.' },
  { t: 'Podsumowanie', d: 'Winrate, średnie R, profit factor i krzywa kapitału na osobnym arkuszu.' },
  { t: 'Excel i Sheets', d: 'Działa w Excelu, LibreOffice i Google Sheets. Plus arkusz z instrukcją.' },
];

function triggerDownload() {
  const a = document.createElement('a');
  a.href = FILE_URL;
  a.download = 'dziennik-transakcji-kisielfinanse.xlsx';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function JournalDownload() {
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
      // 409 = już zapisany. Nie karzemy stałych czytelników — też dostają plik.
      if (res.ok || res.status === 409) {
        setState('ok');
        setEmail('');
        triggerDownload();
      } else {
        const data = await res.json().catch(() => ({}));
        setState('error');
        setMsg(data.error ?? 'Coś poszło nie tak, spróbuj za chwilę.');
      }
    } catch {
      setState('error');
      setMsg('Błąd połączenia. Spróbuj za chwilę.');
    }
  }

  return (
    <section className="jd">
      <style>{CSS}</style>

      <div className="jd-inner">
        <div className="jd-left">
          <p className="jd-eyebrow"><span>Darmowy szablon · dla zapisanych</span></p>
          <h2 className="jd-title">Pobierz gotowy <em>dziennik transakcji</em></h2>
          <p className="jd-lead">
            Ten sam dziennik, tylko w Excelu — do prowadzenia offline, na spokojnie, przez cały rok.
            Zapisz się do newslettera, a plik pobierze się od razu. Zero spamu, wypiszesz się w każdej chwili.
          </p>

          <ul className="jd-list">
            {INSIDE.map((it, i) => (
              <li key={i} className="jd-item">
                <span className="jd-check" aria-hidden="true" />
                <span><b>{it.t}.</b> {it.d}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="jd-right">
          {state === 'ok' ? (
            <div className="jd-ok">
              <span className="jd-ok-mark" aria-hidden="true">✓</span>
              <h3 className="jd-ok-title">Gotowe. Plik się pobiera.</h3>
              <p className="jd-ok-text">
                Gdyby pobieranie nie ruszyło automatycznie, kliknij poniżej. Kopię linku wysłałem też na Twój mail.
              </p>
              <button type="button" className="jd-btn" onClick={triggerDownload}>Pobierz dziennik (.xlsx)</button>
            </div>
          ) : (
            <form className="jd-form" onSubmit={handleSubmit}>
              <div className="jd-file">
                <span className="jd-file-ico" aria-hidden="true">XLSX</span>
                <div>
                  <span className="jd-file-name">dziennik-transakcji.xlsx</span>
                  <span className="jd-file-sub">Excel · Sheets · LibreOffice</span>
                </div>
              </div>
              <label className="jd-label" htmlFor="jd-email">Twój adres e-mail</label>
              <input
                id="jd-email"
                type="email"
                className="jd-input"
                placeholder="twoj@email.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={state === 'loading'}
                required
              />
              <button type="submit" className="jd-btn" disabled={state === 'loading'}>
                {state === 'loading' ? 'Chwila...' : 'Zapisz się i pobierz'}
              </button>
              {state === 'error' && <p className="jd-err">{msg}</p>}
              <p className="jd-fine">
                Zapisując się akceptujesz{' '}
                <Link href="/regulamin">regulamin</Link> i{' '}
                <Link href="/polityka-prywatnosci">politykę prywatności</Link>.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const CSS = `
.jd {
  --jd-accent: #c9a227;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px clamp(48px, 8vw, 96px);
  font-family: var(--font-body);
  color: var(--text);
}
.jd-inner {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(24px, 4vw, 48px);
  align-items: center;
  background:
    radial-gradient(120% 120% at 100% 0%, rgba(201,162,39,0.10), transparent 55%),
    var(--surface);
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: clamp(28px, 4vw, 48px);
}
.jd-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.72rem; letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--jd-accent); margin: 0 0 16px; font-weight: 600;
}
.jd-title {
  font-family: var(--font-serif, Georgia, serif);
  font-weight: 600; line-height: 1.06;
  font-size: clamp(1.9rem, 4vw, 2.8rem); margin: 0 0 16px;
}
.jd-title em { font-style: italic; color: var(--jd-accent); }
.jd-lead { font-size: 1.02rem; line-height: 1.7; color: var(--muted); margin: 0 0 24px; max-width: 46ch; }
.jd-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.jd-item { display: flex; gap: 12px; align-items: flex-start; font-size: 0.95rem; line-height: 1.55; color: var(--muted); }
.jd-item b { color: var(--text); }
.jd-check {
  flex: none; width: 20px; height: 20px; margin-top: 1px; border-radius: 999px;
  background: rgba(201,162,39,0.14); position: relative;
}
.jd-check::after {
  content: ''; position: absolute; left: 6px; top: 4px;
  width: 5px; height: 9px; border: solid var(--jd-accent); border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* ── Karta z formularzem ── */
.jd-right { min-width: 0; }
.jd-form, .jd-ok {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 22px;
  display: flex; flex-direction: column;
}
.jd-file { display: flex; align-items: center; gap: 12px; padding-bottom: 18px; margin-bottom: 18px; border-bottom: 1px solid var(--border); }
.jd-file-ico {
  flex: none; display: grid; place-items: center;
  width: 46px; height: 46px; border-radius: 10px;
  background: rgba(201,162,39,0.14); color: var(--jd-accent);
  font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em;
}
.jd-file-name { display: block; font-weight: 700; font-size: 0.95rem; }
.jd-file-sub { display: block; font-size: 0.78rem; color: var(--muted); opacity: 0.75; margin-top: 2px; }
.jd-label { font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); font-weight: 600; margin-bottom: 8px; }
.jd-input {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 13px;
  color: var(--text);
  font-family: var(--font-body); font-size: 0.98rem;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.jd-input:focus { outline: none; border-color: var(--jd-accent); box-shadow: 0 0 0 3px rgba(201,162,39,0.18); }
.jd-btn {
  margin-top: 12px;
  background: var(--jd-accent); color: #0a0a0a;
  border: none; border-radius: 10px;
  padding: 13px 18px; font-weight: 800; font-size: 0.98rem; cursor: pointer;
  transition: transform .12s ease, filter .12s ease;
}
.jd-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
.jd-btn:disabled { opacity: 0.7; cursor: default; }
.jd-err { color: #ef4453; font-size: 0.86rem; font-weight: 600; margin: 10px 0 0; }
.jd-fine { font-size: 0.72rem; color: var(--muted); opacity: 0.8; line-height: 1.5; margin: 12px 0 0; }
.jd-fine a { color: inherit; text-decoration: underline; }

/* ── Sukces ── */
.jd-ok { align-items: flex-start; text-align: left; }
.jd-ok-mark {
  display: grid; place-items: center; width: 44px; height: 44px; border-radius: 999px;
  background: rgba(22,163,74,0.16); color: #16a34a; font-size: 1.4rem; font-weight: 700; margin-bottom: 14px;
}
.jd-ok-title { font-size: 1.15rem; font-weight: 700; margin: 0 0 8px; }
.jd-ok-text { font-size: 0.92rem; line-height: 1.6; color: var(--muted); margin: 0 0 18px; }
.jd-ok .jd-btn { width: 100%; margin-top: 0; }

@media (max-width: 820px) {
  .jd-inner { grid-template-columns: 1fr; }
}
`;
