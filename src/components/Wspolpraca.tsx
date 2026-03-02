'use client';

import { useState } from 'react';

const OFFERS = [
  {
    icon: '◈',
    title: 'Giełdy krypto',
    desc: 'Promocja platformy wśród aktywnych traderów. Recenzje, testy i długoterminowe partnerstwo afiliacyjne.',
    color: 'var(--cyan)',
  },
  {
    icon: '◎',
    title: 'Sponsoring i lokowanie',
    desc: 'Naturalne wplecenie produktu w treści — artykuły blogowe, sekcje na stronie, wzmianki w comiesięcznych podsumowaniach.',
    color: 'var(--purple)',
  },
  {
    icon: '◇',
    title: 'Afiliacja',
    desc: 'Programy partnerskie z prowizją od poleconych użytkowników. Preferuję długoterminowe umowy z jasnym rozliczeniem.',
    color: 'var(--yellow)',
  },
  {
    icon: '◉',
    title: 'Inne formy',
    desc: 'Masz inny pomysł na współpracę? Jestem otwarty na niestandardowe propozycje — napisz i porozmawiajmy.',
    color: 'var(--pink)',
  },
];

const STATS = [
  { val: '9', label: 'Lat na rynkach' },
  { val: '1000+', label: 'Zamkniętych pozycji' },
  { val: '2026', label: 'Rok startu platformy' },
];

export default function Wspolpraca() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    type: '',
    message: '',
  });
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
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="collab-section">
      <div className="collab-bg-grid" />
      <div className="collab-glow" />

      <div className="collab-inner">

        {/* HEADER */}
        <div className="collab-header">
          <div className="section-label">// partnerstwo</div>
          <h1 className="section-title">
            WSPÓŁPRACA<br />
            <span className="gradient-text-cp">Z NYSETH</span>
          </h1>
          <p className="collab-intro">
            Buduję markę opartą na transparentności i realnych wynikach.
            Jeśli Twój produkt lub platforma jest skierowana do aktywnych traderów —
            porozmawiajmy o tym jak możemy razem dotrzeć do tej społeczności.
          </p>
        </div>

        {/* STATS */}
        <div className="collab-stats">
          {STATS.map((s) => (
            <div key={s.label} className="collab-stat">
              <span className="collab-stat-num">{s.val}</span>
              <span className="collab-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* CO OFERUJĘ */}
        <div className="collab-offers">
          <div className="section-label">// co oferuję</div>
          <h2 className="collab-subtitle">
            FORMY <span className="gradient-text-pp">WSPÓŁPRACY</span>
          </h2>

          <div className="collab-offers-grid">
            {OFFERS.map((o) => (
              <div
                key={o.title}
                className="collab-offer-card"
                style={{ '--oc': o.color } as React.CSSProperties}
              >
                <div className="collab-offer-icon">{o.icon}</div>
                <div className="collab-offer-title">{o.title}</div>
                <p className="collab-offer-desc">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FORMULARZ */}
        <div className="collab-form-wrap">
          <div className="section-label">// napisz do mnie</div>
          <h2 className="collab-subtitle">
            ZACZNIJMY <span className="gradient-text-cp">ROZMOWĘ</span>
          </h2>

          {sent ? (
            <div className="collab-success">
              <div className="collab-success-icon">✓</div>
              <div className="collab-success-title">Wiadomość wysłana!</div>
              <p className="collab-success-desc">
                Odezwę się w ciągu 48 godzin. Dzięki za kontakt!
              </p>
            </div>
          ) : (
            <form className="collab-form" onSubmit={handleSubmit}>
              <div className="collab-form-row">
                <div className="collab-field">
                  <label className="collab-label">Imię i nazwisko *</label>
                  <input
                    className="collab-input"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jan Kowalski"
                    required
                  />
                </div>
                <div className="collab-field">
                  <label className="collab-label">Firma / Platforma *</label>
                  <input
                    className="collab-input"
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="np. Binance, własna marka"
                    required
                  />
                </div>
              </div>

              <div className="collab-form-row">
                <div className="collab-field">
                  <label className="collab-label">Email *</label>
                  <input
                    className="collab-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="kontakt@firma.com"
                    required
                  />
                </div>
                <div className="collab-field">
                  <label className="collab-label">Rodzaj współpracy *</label>
                  <select
                    className="collab-input collab-select"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Wybierz...</option>
                    <option value="gielda">Giełda krypto</option>
                    <option value="sponsoring">Sponsoring / lokowanie</option>
                    <option value="afiliacja">Afiliacja</option>
                    <option value="inne">Inne</option>
                  </select>
                </div>
              </div>

              <div className="collab-field">
                <label className="collab-label">Opisz propozycję *</label>
                <textarea
                  className="collab-input collab-textarea"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Opisz krótko czym się zajmujesz i jak wyobrażasz sobie współpracę..."
                  required
                />
              </div>

              <button type="submit" className="collab-submit" disabled={status === 'loading'}>
                {status === 'loading' ? '...' : 'WYŚLIJ WIADOMOŚĆ →'}
              </button>
              {status === 'error' && (
                <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--pink)', fontSize: '0.75rem', marginTop: -8 }}>
                  Coś poszło nie tak. Spróbuj ponownie.
                </p>
              )}

              <p className="collab-disclaimer">
                * Odpowiadam na wszystkie wiadomości w ciągu 48 godzin.
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
