'use client';

import { useState } from 'react';

const OFFERS = [
  {
    icon: '✦',
    title: 'Artykuł sponsorowany',
    desc: 'Piszę sam, 800–1500 słów. Nie ghost-writing. Produkt wpleciony w kontekst, który czytelnika faktycznie interesuje. Disclosure obowiązkowe, link dofollow.',
    tags: ['Natywny format', 'SEO', 'Długa widoczność'],
    color: 'var(--cyan)',
  },
  {
    icon: '⬡',
    title: 'Afiliacja',
    desc: 'Linki lub bannery w artykułach z dopasowanym tematem. Rozliczenie prowizyjne, miesięczne. Zależy mi na długoterminowych umowach z czytelnym rozliczeniem po obu stronach.',
    tags: ['Pay per result', 'Miesięczne rozliczenie', 'Długoterminowe'],
    color: 'var(--purple)',
  },
  {
    icon: '◈',
    title: 'Recenzja produktu',
    desc: 'Testuję produkt przed publikacją i piszę własną opinię. Jeśli jest dobry, napiszę to. Jeśli ma wady, też. Recenzja pisana pod sznurek ma zerową wartość dla czytelnika.',
    tags: ['Własne testy', 'Pełna szczerość', 'Wysoka konwersja'],
    color: 'var(--yellow)',
  },
  {
    icon: '◇',
    title: 'Inne formy',
    desc: 'Newsletter, wzmianka w artykule, dedykowana sekcja w kalkulatorze. Jeśli masz inny pomysł, napisz. Albo będzie miało sens, albo nie, ale przynajmniej się dowiemy.',
    tags: ['Newsletter', 'Kalkulatory', 'Custom'],
    color: 'var(--pink)',
  },
];

const STATS = [
  { val: '9', label: 'Lat na rynkach finansowych' },
  { val: '5+', label: 'Kategorii tematycznych' },
  { val: '100%', label: 'Treść pisana ręcznie' },
];

const PRINCIPLES = [
  'Memecoin, pump&dump, schematy szybkiego wzbogacenia - odpada bez rozmowy.',
  'Każda płatna współpraca jest oznaczona. Czytelnicy wiedzą, że to reklama.',
  'Treści sugerujące "gwarantowany zysk" lub ukrywające ryzyko inwestycyjne - nie.',
  'Nie polecam produktów, których sam nie sprawdziłem i których bym nie użył.',
];

const READER = [
  { icon: '◈', label: 'Aktywni traderzy', desc: 'Forex, futures, krypto. Interesuje ich konkret i własne doświadczenia, nie teorie z YouTube.' },
  { icon: '◇', label: 'Świadomi inwestorzy', desc: 'ETF, lokaty, IKE/IKZE. Budują portfel metodycznie i mają dość clickbaitu o kryptowalutach.' },
  { icon: '◎', label: 'Obserwatorzy rynków', desc: 'Geopolityka, AI, gospodarka. Śledzą makro, bo wiedzą, że przekłada się na ich portfel.' },
  { icon: '◉', label: 'Decydenci finansowi', desc: 'Kredyt hipoteczny, emerytura, pierwsze inwestycje. Szukają narzędzi i rzetelnych informacji.' },
];

const STEPS = [
  { n: '01', title: 'Wyślij brief', desc: 'Kim jesteś, co sprzedajesz, jak wyobrażasz sobie współpracę i jaki masz budżet. Konkret przyspiesza wszystko.' },
  { n: '02', title: 'Omówimy warunki', desc: 'Odpiszę w ciągu 48h. Jeśli widzę sens w połączeniu z moją publicznością, proponuję format i warunki.' },
  { n: '03', title: 'Realizacja', desc: 'Piszę, publikuję, rozliczamy. Bez 17 rund akceptacji i bez tygodni czekania na odpowiedź.' },
];

export default function Wspolpraca() {
  const [form, setForm] = useState({ name: '', company: '', email: '', type: '', message: '' });
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('https://formspree.io/f/xykdoplw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setSent(true);
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="collab-section">
      <div className="collab-bg-grid" />
      <div className="collab-glow" />

      <div className="collab-inner">

        {/* ── HEADER ─────────────────────────────────────────── */}
        <div className="collab-header">
          <h1 className="section-title">
            WSPÓŁPRACA<br />
            <span className="gradient-text-cp">Z KISIELFINANSE</span>
          </h1>
          <p className="collab-intro">
            Piszę o rynkach finansowych. Moi czytelnicy to traderzy, inwestorzy i osoby,
            które poważnie podchodzą do własnych pieniędzy. Jeśli Twój produkt do nich trafia, napisz.
          </p>
        </div>

        {/* ── KIM JEST CZYTELNIK ──────────────────────────────── */}
        <div style={{ marginBottom: 64 }}>
          <h2 className="collab-subtitle">
            KIM JEST <span className="gradient-text-pp">CZYTELNIK</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.8, maxWidth: 560, marginBottom: 28 }}>
            Nie piszę dla każdego. Niszowa, zaangażowana publiczność jest dla partnera
            cenniejsza niż masowy ruch z niską intencją zakupową.
          </p>
          <div className="collab-reader-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {READER.map(r => (
              <div key={r.label} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '20px 24px',
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '1.4rem', lineHeight: 1, marginTop: 2 }}>{r.icon}</span>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', fontWeight: 700, marginBottom: 4 }}>{r.label}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS ───────────────────────────────────────────── */}
        <div className="collab-stats">
          {STATS.map(s => (
            <div key={s.label} className="collab-stat">
              <span className="collab-stat-num">{s.val}</span>
              <span className="collab-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── FORMY WSPÓŁPRACY ────────────────────────────────── */}
        <div className="collab-offers">
          <h2 className="collab-subtitle">
            FORMY <span className="gradient-text-pp">WSPÓŁPRACY</span>
          </h2>
          <div className="collab-offers-grid">
            {OFFERS.map(o => (
              <div
                key={o.title}
                className="collab-offer-card"
                style={{ '--oc': o.color } as React.CSSProperties}
              >
                <div className="collab-offer-icon">{o.icon}</div>
                <div className="collab-offer-title">{o.title}</div>
                <p className="collab-offer-desc">{o.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
                  {o.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                      color: o.color, border: `1px solid ${o.color}`,
                      padding: '2px 8px', opacity: 0.7, letterSpacing: '0.5px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CZEGO NIE ROBIĘ ─────────────────────────────────── */}
        <div style={{ marginBottom: 72 }}>
          <h2 className="collab-subtitle">
            CZEGO <span style={{ color: 'var(--pink)' }}>NIE ROBIĘ</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.8, maxWidth: 560, marginBottom: 28 }}>
            Każdy partner wie z góry czego może oczekiwać. Czytelnik wie, że mu nie kłamię.
            To ważniejsze niż jednorazowa współpraca.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PRINCIPLES.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                padding: '16px 20px',
              }}>
                <span style={{ color: 'var(--pink)', fontFamily: 'var(--font-display)', fontSize: '1.1rem', lineHeight: 1, marginTop: 1, flexShrink: 0 }}>✕</span>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── JAK TO DZIAŁA ───────────────────────────────────── */}
        <div style={{ marginBottom: 72 }}>
          <h2 className="collab-subtitle">
            JAK TO <span className="gradient-text-cp">DZIAŁA</span>
          </h2>
          <div className="collab-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {STEPS.map(s => (
              <div key={s.n} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '28px 24px',
                position: 'relative',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem', lineHeight: 1,
                  color: 'rgba(201,162,39,0.15)',
                  display: 'block', marginBottom: 16,
                  letterSpacing: '2px',
                }}>
                  {s.n}
                </span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8 }}>{s.title}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FORMULARZ ───────────────────────────────────────── */}
        <div className="collab-form-wrap">
          <h2 className="collab-subtitle">
            ZACZNIJMY <span className="gradient-text-cp">ROZMOWĘ</span>
          </h2>

          {sent ? (
            <div className="collab-success">
              <div className="collab-success-icon">✓</div>
              <div className="collab-success-title">Wiadomość wysłana!</div>
              <p className="collab-success-desc">
                Odezwę się w ciągu 48 godzin. Dzięki za kontakt.
              </p>
            </div>
          ) : (
            <form className="collab-form" onSubmit={handleSubmit}>
              <div className="collab-form-row">
                <div className="collab-field">
                  <label className="collab-label">Imię i nazwisko *</label>
                  <input className="collab-input" type="text" name="name" value={form.name}
                    onChange={handleChange} placeholder="Jan Kowalski" required />
                </div>
                <div className="collab-field">
                  <label className="collab-label">Firma / Platforma *</label>
                  <input className="collab-input" type="text" name="company" value={form.company}
                    onChange={handleChange} placeholder="np. Binance, XTB, własna marka" required />
                </div>
              </div>

              <div className="collab-form-row">
                <div className="collab-field">
                  <label className="collab-label">Email *</label>
                  <input className="collab-input" type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="kontakt@firma.com" required />
                </div>
                <div className="collab-field">
                  <label className="collab-label">Forma współpracy *</label>
                  <select className="collab-input collab-select" name="type" value={form.type}
                    onChange={handleChange} required>
                    <option value="">Wybierz...</option>
                    <option value="artykul">Artykuł sponsorowany</option>
                    <option value="afiliacja">Afiliacja</option>
                    <option value="recenzja">Recenzja produktu</option>
                    <option value="gielda">Giełda krypto</option>
                    <option value="broker">Broker Forex / futures</option>
                    <option value="inne">Inne</option>
                  </select>
                </div>
              </div>

              <div className="collab-field">
                <label className="collab-label">Opisz propozycję *</label>
                <textarea className="collab-input collab-textarea" name="message" value={form.message}
                  onChange={handleChange}
                  placeholder="Czym się zajmujesz, do kogo trafia Twój produkt i jak wyobrażasz sobie tę współpracę. Budżet lub oczekiwana prowizja też pomaga."
                  required />
              </div>

              <button type="submit" className="collab-submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Wysyłam...' : 'WYŚLIJ WIADOMOŚĆ →'}
              </button>

              {status === 'error' && (
                <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--pink)', fontSize: '0.75rem', marginTop: -8 }}>
                  Coś poszło nie tak. Napisz bezpośrednio: kisieltrade@gmail.com
                </p>
              )}

              <p className="collab-disclaimer">
                * Odpiszę w ciągu 48h. Nie przyjmuję każdej propozycji, ale na każdą odpowiem.
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
