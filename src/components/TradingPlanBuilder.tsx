'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'kf-plan-tradingowy';

type Plan = {
  rynek: string;
  instrumenty: string;
  styl: string;
  interwaly: string;
  kapital: number;
  ryzykoProc: number;
  setup: string[];
  setupWlasny: string;
  stop: string;
  rr: number;
  maxTransakcje: number;
  maxStrataDzien: number;
  maxStrataTydzien: number;
  stopLista: string[];
  rutyna: string[];
  przeglad: string;
};

const EMPTY: Plan = {
  rynek: 'Indeksy',
  instrumenty: '',
  styl: 'Swing trading',
  interwaly: 'D1 kontekst, H4 wejście',
  kapital: 10000,
  ryzykoProc: 1,
  setup: [],
  setupWlasny: '',
  stop: 'Za ostatnim dołkiem lub szczytem struktury',
  rr: 2,
  maxTransakcje: 2,
  maxStrataDzien: 3,
  maxStrataTydzien: 6,
  stopLista: [],
  rutyna: [],
  przeglad: 'Niedziela wieczorem, 30 minut',
};

const RYNKI = ['Forex', 'Indeksy', 'Krypto', 'Akcje'];
const STYLE = ['Scalping', 'Day trading', 'Swing trading', 'Trading pozycyjny'];
const STOPY = [
  'Za ostatnim dołkiem lub szczytem struktury',
  'Pod poziomem wsparcia lub nad oporem',
  'Odległość liczona ze zmienności (ATR)',
  'Za linią szyi formacji',
];

const SETUP_OPCJE = [
  'Cena jest przy ważnym wsparciu lub oporze',
  'Kierunek zgodny z trendem wyższego interwału',
  'Pojawiła się formacja potwierdzająca zwrot lub kontynuację',
  'Wskaźnik potwierdza sygnał (RSI, MACD, średnia)',
  'Wybicie zamknęło się poza poziomem, nie tylko go dotknęło',
  'W najbliższych godzinach nie ma ważnych danych makro',
];

const STOP_LISTA_OPCJE = [
  'Jestem niewyspany lub chory',
  'Jestem zły po poprzedniej stracie i chcę się odegrać',
  'Nie mam czasu doprowadzić transakcji do końca',
  'Rynek stoi w wąskiej konsolidacji bez czytelnej struktury',
  'Przekroczyłem dzienny limit straty',
  'Nie potrafię nazwać setupu, po prostu chcę wejść',
];

const RUTYNA_OPCJE = [
  'Przed sesją: przegląd wykresów i zaznaczenie poziomów',
  'Przed wejściem: policzenie wielkości pozycji w kalkulatorze',
  'Po każdej transakcji: wpis do dziennika ze zrzutem wykresu',
  'Na koniec dnia: podsumowanie, czy trzymałem się planu',
  'Raz w tygodniu: przegląd statystyk i wniosków',
];

const STEPS = ['Rynek i styl', 'Kapitał i ryzyko', 'Wejście', 'Wyjście', 'Zasady'];

// Te podkomponenty muszą żyć poza głównym komponentem. Zdefiniowane w środku dostawałyby
// nową tożsamość przy każdym renderze, React montowałby je od nowa, a pola tekstowe
// traciłyby focus po każdym wpisanym znaku.
function Pole({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="tp-field">
      <label className="tp-label">{label}</label>
      {hint && <p className="tp-hint">{hint}</p>}
      {children}
    </div>
  );
}

function Wybor({ opcje, wartosc, onChange }: { opcje: string[]; wartosc: string; onChange: (v: string) => void }) {
  return (
    <div className="tp-seg">
      {opcje.map((o) => (
        <button key={o} type="button" className={`tp-segb${wartosc === o ? ' on' : ''}`} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

function Checki({ opcje, wybrane, onToggle }: { opcje: string[]; wybrane: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="tp-checks">
      {opcje.map((o) => {
        const on = wybrane.includes(o);
        return (
          <button key={o} type="button" className={`tp-check${on ? ' on' : ''}`} onClick={() => onToggle(o)}>
            <span className="tp-box" aria-hidden="true">{on ? '✓' : ''}</span>
            <span>{o}</span>
          </button>
        );
      })}
    </div>
  );
}

function toggle(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function pln(n: number): string {
  return n.toLocaleString('pl-PL', { maximumFractionDigits: 0 }) + ' zł';
}

export default function TradingPlanBuilder() {
  const [plan, setPlan] = useState<Plan>(EMPTY);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Wczytanie po stronie klienta, żeby serwerowy render nie rozjechał się z zapisanym planem.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPlan({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      // uszkodzony wpis w pamięci przeglądarki nie ma prawa wywalić narzędzia
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      // brak miejsca lub tryb prywatny: plan działa dalej, po prostu się nie zapisze
    }
  }, [plan, loaded]);

  const set = <K extends keyof Plan>(k: K, v: Plan[K]) => setPlan((p) => ({ ...p, [k]: v }));

  const liczby = useMemo(() => {
    const ryzykoKwota = (plan.kapital * plan.ryzykoProc) / 100;
    const limitDzien = (plan.kapital * plan.maxStrataDzien) / 100;
    const limitTydzien = (plan.kapital * plan.maxStrataTydzien) / 100;
    const stratDoLimitu = ryzykoKwota > 0 ? Math.floor(limitDzien / ryzykoKwota) : 0;
    const bePct = (1 / (1 + plan.rr)) * 100;
    const zyskPrzyTP = ryzykoKwota * plan.rr;
    // Plan bywa wewnętrznie sprzeczny, a to najlepszy moment, żeby to zobaczyć.
    let ostrzezenie = '';
    if (stratDoLimitu === 0) {
      ostrzezenie = 'Dzienny limit straty jest mniejszy niż ryzyko na jedną transakcję, więc pierwsza strata od razu kończy dzień. Albo zmniejsz ryzyko, albo podnieś limit.';
    } else if (stratDoLimitu < plan.maxTransakcje) {
      ostrzezenie = `Przy tym ryzyku dzienny limit zatrzyma cię po ${stratDoLimitu} stratnych transakcjach, choć dopuszczasz ${plan.maxTransakcje} dziennie. To nie błąd, ale wiedz, że w gorszy dzień skończysz wcześniej.`;
    } else if (plan.ryzykoProc > 2) {
      ostrzezenie = `Ryzykujesz ${plan.ryzykoProc}% na transakcję. Przy takiej wielkości seria pięciu strat zabiera około ${Math.round((1 - Math.pow(1 - plan.ryzykoProc / 100, 5)) * 100)}% kapitału, a odrobienie tego wymaga większego zysku niż sama strata.`;
    }

    return { ryzykoKwota, limitDzien, limitTydzien, stratDoLimitu, bePct, zyskPrzyTP, ostrzezenie };
  }, [plan]);

  const tekstPlanu = useMemo(() => {
    const l = (t: string) => (t ? t : 'nie uzupełniono');
    return [
      'MÓJ PLAN TRADINGOWY',
      '',
      '1. RYNEK I STYL',
      `Rynek: ${plan.rynek}`,
      `Instrumenty: ${l(plan.instrumenty)}`,
      `Styl: ${plan.styl}`,
      `Interwały: ${l(plan.interwaly)}`,
      '',
      '2. KAPITAŁ I RYZYKO',
      `Kapitał: ${pln(plan.kapital)}`,
      `Ryzyko na transakcję: ${plan.ryzykoProc}%, czyli ${pln(liczby.ryzykoKwota)}`,
      `Dzienny limit straty: ${plan.maxStrataDzien}%, czyli ${pln(liczby.limitDzien)} (${liczby.stratDoLimitu} stratne transakcje pod rząd)`,
      `Tygodniowy limit straty: ${plan.maxStrataTydzien}%, czyli ${pln(liczby.limitTydzien)}`,
      `Maksymalnie transakcji dziennie: ${plan.maxTransakcje}`,
      ...(liczby.ostrzezenie ? ['', `Uwaga: ${liczby.ostrzezenie}`] : []),
      '',
      '3. WEJŚCIE (wchodzę tylko gdy)',
      ...(plan.setup.length ? plan.setup.map((s) => `- ${s}`) : ['- nie wybrano warunków']),
      ...(plan.setupWlasny ? [`- ${plan.setupWlasny}`] : []),
      '',
      '4. WYJŚCIE',
      `Stop loss: ${plan.stop}`,
      `Minimalny stosunek zysku do ryzyka: 1:${plan.rr}`,
      `Przy trafionym take profit zarabiam ${pln(liczby.zyskPrzyTP)} przy ryzyku ${pln(liczby.ryzykoKwota)}`,
      `Przy takim R/R wychodzę na zero mając ${liczby.bePct.toFixed(0)}% trafionych transakcji`,
      '',
      '5. DZIŚ NIE TRADUJĘ, GDY',
      ...(plan.stopLista.length ? plan.stopLista.map((s) => `- ${s}`) : ['- nie wybrano zasad']),
      '',
      '6. RUTYNA',
      ...(plan.rutyna.length ? plan.rutyna.map((s) => `- ${s}`) : ['- nie wybrano rutyny']),
      `Przegląd planu: ${l(plan.przeglad)}`,
      '',
      'Plan zbudowany na kisielfinanse.pl/kreator-planu-tradingowego',
    ].join('\n');
  }, [plan, liczby]);

  const kopiuj = async () => {
    try {
      await navigator.clipboard.writeText(tekstPlanu);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  if (done) {
    return (
      <div className="tp">
        <style>{CSS}</style>
        <div className="tp-panel tp-doc" id="plan-do-druku">
          <div className="tp-doc-head">
            <p className="tp-kicker">Plan tradingowy</p>
            <h2 className="tp-doc-h">Twoje zasady, spisane</h2>
          </div>

          <section className="tp-sec">
            <h3>01 · Rynek i styl</h3>
            <dl className="tp-dl">
              <div><dt>Rynek</dt><dd>{plan.rynek}</dd></div>
              <div><dt>Instrumenty</dt><dd>{plan.instrumenty || 'nie uzupełniono'}</dd></div>
              <div><dt>Styl</dt><dd>{plan.styl}</dd></div>
              <div><dt>Interwały</dt><dd>{plan.interwaly || 'nie uzupełniono'}</dd></div>
            </dl>
          </section>

          <section className="tp-sec">
            <h3>02 · Kapitał i ryzyko</h3>
            <div className="tp-nums">
              <div className="tp-num"><span>{pln(liczby.ryzykoKwota)}</span><small>ryzyko na transakcję ({plan.ryzykoProc}%)</small></div>
              <div className="tp-num"><span>{pln(liczby.limitDzien)}</span><small>dzienny limit straty ({plan.maxStrataDzien}%)</small></div>
              <div className="tp-num"><span>{pln(liczby.limitTydzien)}</span><small>tygodniowy limit ({plan.maxStrataTydzien}%)</small></div>
              <div className="tp-num"><span>{liczby.stratDoLimitu}</span><small>stratne transakcje pod rząd do limitu dnia</small></div>
            </div>
            <p className="tp-note">
              Kapitał {pln(plan.kapital)}, maksymalnie {plan.maxTransakcje} transakcje dziennie.
            </p>
            {liczby.ostrzezenie && <p className="tp-warn">{liczby.ostrzezenie}</p>}
          </section>

          <section className="tp-sec">
            <h3>03 · Wchodzę tylko wtedy, gdy</h3>
            {plan.setup.length === 0 && !plan.setupWlasny
              ? <p className="tp-empty">Nie wybrałeś warunków wejścia. Wróć i uzupełnij, bo to serce planu.</p>
              : <ul className="tp-list">
                  {plan.setup.map((s) => <li key={s}>{s}</li>)}
                  {plan.setupWlasny && <li>{plan.setupWlasny}</li>}
                </ul>}
          </section>

          <section className="tp-sec">
            <h3>04 · Wyjście</h3>
            <dl className="tp-dl">
              <div><dt>Stop loss</dt><dd>{plan.stop}</dd></div>
              <div><dt>Minimalne R/R</dt><dd>1:{plan.rr}</dd></div>
              <div><dt>Zysk przy trafionym TP</dt><dd>{pln(liczby.zyskPrzyTP)}</dd></div>
              <div><dt>Próg wyjścia na zero</dt><dd>{liczby.bePct.toFixed(0)}% trafionych transakcji</dd></div>
            </dl>
          </section>

          <section className="tp-sec">
            <h3>05 · Dziś nie traduję, gdy</h3>
            {plan.stopLista.length === 0
              ? <p className="tp-empty">Brak zasad stop. To ta część planu, która ratuje konto w gorszy dzień.</p>
              : <ul className="tp-list">{plan.stopLista.map((s) => <li key={s}>{s}</li>)}</ul>}
          </section>

          <section className="tp-sec">
            <h3>06 · Rutyna</h3>
            {plan.rutyna.length === 0
              ? <p className="tp-empty">Nie wybrałeś rutyny.</p>
              : <ul className="tp-list">{plan.rutyna.map((s) => <li key={s}>{s}</li>)}</ul>}
            <p className="tp-note">Przegląd planu: {plan.przeglad || 'nie uzupełniono'}</p>
          </section>

          <p className="tp-sign">kisielfinanse.pl · plan zbudowany {new Date().toLocaleDateString('pl-PL')}</p>
        </div>

        <div className="tp-actions tp-noprint">
          <button className="tp-cta" onClick={() => window.print()}>Drukuj lub zapisz PDF</button>
          <button className="tp-ghost" onClick={kopiuj}>{copied ? 'Skopiowano' : 'Kopiuj jako tekst'}</button>
          <button className="tp-ghost" onClick={() => { setDone(false); setStep(0); }}>Wróć do edycji</button>
        </div>

        <p className="tp-links tp-noprint">
          Plan zapisuje się w tej przeglądarce, więc możesz tu wrócić i go poprawić. Wielkość pozycji policzysz w{' '}
          <Link href="/kalkulator/wielkosc-pozycji">kalkulatorze wielkości pozycji</Link>, a rozpoznawanie setupów
          przećwiczysz w <Link href="/trener-formacji">trenerze formacji</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="tp">
      <style>{CSS}</style>
      <div className="tp-panel">
        <div className="tp-steps">
          {STEPS.map((s, n) => (
            <button key={s} className={`tp-step${n === step ? ' on' : ''}${n < step ? ' past' : ''}`} onClick={() => setStep(n)}>
              <span className="tp-step-n">{String(n + 1).padStart(2, '0')}</span>
              <span className="tp-step-t">{s}</span>
            </button>
          ))}
        </div>

        {step === 0 && (
          <>
            <Pole label="Na czym handlujesz" hint="Jeden rynek na start. Rozpraszanie się na wszystko naraz to najczęstszy błąd początku.">
              <Wybor opcje={RYNKI} wartosc={plan.rynek} onChange={(v) => set('rynek', v)} />
            </Pole>
            <Pole label="Konkretne instrumenty" hint="Dwa, trzy maksymalnie. Na przykład: US100, DE40.">
              <input className="tp-input" value={plan.instrumenty} onChange={(e) => set('instrumenty', e.target.value)} placeholder="np. US100, EURUSD" />
            </Pole>
            <Pole label="Styl" hint="Styl musi pasować do tego, ile realnie masz czasu przed wykresem.">
              <Wybor opcje={STYLE} wartosc={plan.styl} onChange={(v) => set('styl', v)} />
            </Pole>
            <Pole label="Interwały" hint="Zwykle jeden wyższy na kontekst i jeden niższy na wejście.">
              <input className="tp-input" value={plan.interwaly} onChange={(e) => set('interwaly', e.target.value)} placeholder="np. D1 kontekst, H4 wejście" />
            </Pole>
          </>
        )}

        {step === 1 && (
          <>
            <Pole label="Kapitał na koncie">
              <input className="tp-input" type="number" min={0} step={100} value={plan.kapital} onChange={(e) => set('kapital', Math.max(0, Number(e.target.value)))} />
            </Pole>
            <Pole label={`Ryzyko na jedną transakcję: ${plan.ryzykoProc}%`} hint="Standard to 1%. Powyżej 2% seria strat robi się bolesna matematycznie, nie tylko emocjonalnie.">
              <input className="tp-range" type="range" min={0.25} max={5} step={0.25} value={plan.ryzykoProc} onChange={(e) => set('ryzykoProc', Number(e.target.value))} />
              <p className="tp-calc">To {pln(liczby.ryzykoKwota)} na transakcję.</p>
            </Pole>
            <Pole label={`Dzienny limit straty: ${plan.maxStrataDzien}%`} hint="Po jego przekroczeniu zamykasz platformę. To zasada, która ratuje konta.">
              <input className="tp-range" type="range" min={1} max={15} step={1} value={plan.maxStrataDzien} onChange={(e) => set('maxStrataDzien', Number(e.target.value))} />
              <p className="tp-calc">{pln(liczby.limitDzien)}, czyli {liczby.stratDoLimitu} stratne transakcje pod rząd.</p>
            </Pole>
            <Pole label={`Tygodniowy limit straty: ${plan.maxStrataTydzien}%`}>
              <input className="tp-range" type="range" min={2} max={30} step={1} value={plan.maxStrataTydzien} onChange={(e) => set('maxStrataTydzien', Number(e.target.value))} />
              <p className="tp-calc">{pln(liczby.limitTydzien)}</p>
            </Pole>
            <Pole label={`Maksymalnie transakcji dziennie: ${plan.maxTransakcje}`} hint="Limit chroni przed overtradingiem, czyli wchodzeniem z nudów.">
              <input className="tp-range" type="range" min={1} max={10} step={1} value={plan.maxTransakcje} onChange={(e) => set('maxTransakcje', Number(e.target.value))} />
            </Pole>
            {liczby.ostrzezenie && <p className="tp-warn">{liczby.ostrzezenie}</p>}
          </>
        )}

        {step === 2 && (
          <>
            <Pole label="Wchodzę tylko wtedy, gdy" hint="Zaznacz warunki, które muszą być spełnione RAZEM. Im mniej ogólników, tym łatwiej ocenić, czy trzymałeś się planu.">
              <Checki opcje={SETUP_OPCJE} wybrane={plan.setup} onToggle={(v) => set('setup', toggle(plan.setup, v))} />
            </Pole>
            <Pole label="Własny warunek">
              <input className="tp-input" value={plan.setupWlasny} onChange={(e) => set('setupWlasny', e.target.value)} placeholder="np. wejście tylko w pierwszych 2 godzinach sesji" />
            </Pole>
          </>
        )}

        {step === 3 && (
          <>
            <Pole label="Gdzie stawiam stop loss" hint="Stop wynika ze struktury wykresu, nie z kwoty, którą nie chcesz stracić.">
              <Wybor opcje={STOPY} wartosc={plan.stop} onChange={(v) => set('stop', v)} />
            </Pole>
            <Pole label={`Minimalny stosunek zysku do ryzyka: 1:${plan.rr}`} hint="Poniżej 1:1,5 musisz mieć bardzo wysoką skuteczność, żeby wyjść na swoje.">
              <input className="tp-range" type="range" min={1} max={5} step={0.5} value={plan.rr} onChange={(e) => set('rr', Number(e.target.value))} />
              <p className="tp-calc">
                Przy 1:{plan.rr} wychodzisz na zero mając {liczby.bePct.toFixed(0)}% trafionych transakcji.
                Trafiony take profit to {pln(liczby.zyskPrzyTP)} przy ryzyku {pln(liczby.ryzykoKwota)}.
              </p>
            </Pole>
          </>
        )}

        {step === 4 && (
          <>
            <Pole label="Dziś nie traduję, gdy" hint="Ta lista działa tylko wtedy, gdy przeczytasz ją przed sesją, a nie po stracie.">
              <Checki opcje={STOP_LISTA_OPCJE} wybrane={plan.stopLista} onToggle={(v) => set('stopLista', toggle(plan.stopLista, v))} />
            </Pole>
            <Pole label="Moja rutyna">
              <Checki opcje={RUTYNA_OPCJE} wybrane={plan.rutyna} onToggle={(v) => set('rutyna', toggle(plan.rutyna, v))} />
            </Pole>
            <Pole label="Kiedy przeglądam plan">
              <input className="tp-input" value={plan.przeglad} onChange={(e) => set('przeglad', e.target.value)} placeholder="np. niedziela wieczorem, 30 minut" />
            </Pole>
          </>
        )}

        <div className="tp-nav">
          <button className="tp-ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Wstecz</button>
          {step < STEPS.length - 1
            ? <button className="tp-cta" onClick={() => setStep((s) => s + 1)}>Dalej</button>
            : <button className="tp-cta" onClick={() => setDone(true)}>Pokaż mój plan</button>}
        </div>
      </div>
    </div>
  );
}

const CSS = `
.tp { max-width: 760px; margin: 0 auto; font-family: var(--font-body); color: var(--text); }
.tp-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 24px; }

.tp-steps { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 24px; }
.tp-step { display: flex; align-items: center; gap: 7px; background: var(--bg); border: 1px solid var(--border); border-radius: 999px; padding: 7px 14px; cursor: pointer; font-family: var(--font-body); color: var(--muted); transition: all .12s ease; }
.tp-step:hover { border-color: var(--cyan); }
.tp-step.on { background: var(--cyan); border-color: var(--cyan); color: #0a0a0a; }
.tp-step.past { color: var(--text); }
.tp-step-n { font-family: var(--font-mono); font-size: 0.68rem; opacity: 0.75; }
.tp-step-t { font-size: 0.85rem; font-weight: 700; }

.tp-field { margin-bottom: 22px; }
.tp-label { display: block; font-size: 1rem; font-weight: 800; margin-bottom: 5px; }
.tp-hint { font-size: 0.86rem; line-height: 1.6; color: var(--muted); margin: 0 0 10px; }
.tp-input { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 11px 13px; color: var(--text); font-size: 0.95rem; font-family: var(--font-body); }
.tp-input:focus { outline: none; border-color: var(--cyan); }
.tp-range { width: 100%; accent-color: var(--cyan); }
.tp-calc { font-size: 0.88rem; color: var(--cyan); margin: 8px 0 0; font-weight: 600; }

.tp-seg { display: flex; gap: 6px; flex-wrap: wrap; }
.tp-segb { background: var(--bg); border: 1px solid var(--border); color: var(--muted); border-radius: 999px; padding: 8px 15px; font-weight: 700; font-size: 0.85rem; cursor: pointer; font-family: var(--font-body); transition: all .12s ease; }
.tp-segb:hover { border-color: var(--cyan); }
.tp-segb.on { background: var(--cyan); color: #0a0a0a; border-color: var(--cyan); }

.tp-checks { display: flex; flex-direction: column; gap: 7px; }
.tp-check { display: flex; align-items: flex-start; gap: 11px; text-align: left; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 11px 13px; cursor: pointer; font-family: var(--font-body); font-size: 0.92rem; color: var(--muted); line-height: 1.5; transition: all .12s ease; }
.tp-check:hover { border-color: var(--cyan); }
.tp-check.on { border-color: var(--cyan); color: var(--text); }
.tp-box { flex: none; width: 19px; height: 19px; border-radius: 5px; border: 1px solid var(--border); display: inline-flex; align-items: center; justify-content: center; font-size: 0.72rem; color: #0a0a0a; margin-top: 1px; }
.tp-check.on .tp-box { background: var(--cyan); border-color: var(--cyan); }

.tp-nav { display: flex; gap: 10px; justify-content: space-between; margin-top: 26px; padding-top: 20px; border-top: 1px solid var(--border); }
.tp-cta { background: var(--cyan); color: #0a0a0a; border: none; border-radius: 999px; padding: 12px 28px; font-weight: 800; font-size: 0.98rem; cursor: pointer; font-family: var(--font-body); }
.tp-cta:hover { filter: brightness(1.08); }
.tp-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); border-radius: 999px; padding: 11px 22px; font-weight: 700; font-size: 0.92rem; cursor: pointer; font-family: var(--font-body); }
.tp-ghost:hover:not(:disabled) { border-color: var(--cyan); color: var(--text); }
.tp-ghost:disabled { opacity: 0.4; cursor: default; }

.tp-doc-head { border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-bottom: 22px; }
.tp-kicker { font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--cyan); margin: 0 0 8px; }
.tp-doc-h { font-size: 1.5rem; font-weight: 800; margin: 0; }
.tp-sec { margin-bottom: 26px; }
.tp-sec h3 { font-size: 0.78rem; font-family: var(--font-mono); letter-spacing: 0.16em; text-transform: uppercase; color: var(--cyan); margin: 0 0 12px; font-weight: 700; }
.tp-dl { margin: 0; display: flex; flex-direction: column; gap: 9px; }
.tp-dl > div { display: grid; grid-template-columns: 190px 1fr; gap: 12px; align-items: baseline; }
.tp-dl dt { font-size: 0.86rem; color: var(--muted); }
.tp-dl dd { margin: 0; font-size: 0.96rem; font-weight: 600; }
.tp-list { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 7px; }
.tp-list li { font-size: 0.95rem; line-height: 1.55; }
.tp-empty { font-size: 0.92rem; color: var(--muted); margin: 0; font-style: italic; }
.tp-note { font-size: 0.88rem; color: var(--muted); margin: 12px 0 0; }
.tp-warn { font-size: 0.88rem; line-height: 1.6; color: var(--text); background: rgba(232,150,58,0.10); border-left: 3px solid #e8963a; border-radius: 0 8px 8px 0; padding: 11px 13px; margin: 12px 0 0; }
.tp-nums { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
.tp-num { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 14px; }
.tp-num span { display: block; font-size: 1.3rem; font-weight: 800; color: var(--cyan); margin-bottom: 4px; }
.tp-num small { font-size: 0.78rem; color: var(--muted); line-height: 1.4; display: block; }
.tp-sign { font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); border-top: 1px solid var(--border); padding-top: 14px; margin: 0; }

.tp-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 18px; }
.tp-links { font-size: 0.9rem; line-height: 1.7; color: var(--muted); margin: 18px 0 0; }
.tp-links a { color: var(--cyan); }

@media (max-width: 560px) {
  .tp-panel { padding: 18px 15px; }
  .tp-dl > div { grid-template-columns: 1fr; gap: 2px; }
  .tp-step-t { display: none; }
}

@media print {
  .tp-noprint, .tp-steps { display: none !important; }
  .tp-panel { border: none; background: #fff; color: #111; padding: 0; }
  .tp-doc, .tp-doc * { color: #111 !important; }
  .tp-sec h3, .tp-kicker, .tp-num span { color: #7a6410 !important; }
  .tp-num { border: 1px solid #ccc; background: #fff; }
}
`;
