'use client';

import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'kf-dziennik-tradera-v1';

type Trade = {
  id: string;
  data: string;
  instrument: string;
  kierunek: 'Long' | 'Short';
  ryzyko: number;
  wynik: number;
  wgPlanu: boolean;
  setup: string;
  notatka: string;
};

type Draft = {
  data: string;
  instrument: string;
  kierunek: 'Long' | 'Short';
  ryzyko: string;
  wynik: string;
  wgPlanu: boolean;
  setup: string;
  notatka: string;
};

const dzisiaj = () => new Date().toISOString().slice(0, 10);

const pustyDraft = (): Draft => ({
  data: dzisiaj(),
  instrument: '',
  kierunek: 'Long',
  ryzyko: '',
  wynik: '',
  wgPlanu: true,
  setup: '',
  notatka: '',
});

// Pełne wyrażenie z przyimkiem, bo dni tygodnia wymagają tu biernika, a wtorek dodatkowo „we".
const W_DNIU = ['w niedzielę', 'w poniedziałek', 'we wtorek', 'w środę', 'w czwartek', 'w piątek', 'w sobotę'];

const zl = (n: number) =>
  `${n > 0 ? '+' : n < 0 ? '-' : ''}${Math.abs(n).toLocaleString('pl-PL', { maximumFractionDigits: 2 })} zł`;

const proc = (n: number) => `${n.toLocaleString('pl-PL', { maximumFractionDigits: 1 })}%`;

const erka = (n: number) => `${n > 0 ? '+' : n < 0 ? '-' : ''}${Math.abs(n).toFixed(2)} R`;

// Podkomponenty muszą żyć na poziomie modułu. Zdefiniowane wewnątrz głównego komponentu
// dostawałyby nową tożsamość przy każdym renderze, React montowałby je od nowa,
// a pola tekstowe traciłyby focus po każdym wpisanym znaku.
function Pole({ label, children, szer }: { label: string; children: React.ReactNode; szer?: string }) {
  return (
    <div className="dz-field" style={szer ? { gridColumn: szer } : undefined}>
      <label className="dz-label">{label}</label>
      {children}
    </div>
  );
}

function Kafel({ etykieta, wartosc, ton, opis }: { etykieta: string; wartosc: string; ton?: 'plus' | 'minus'; opis?: string }) {
  return (
    <div className="dz-tile">
      <span className="dz-tile-l">{etykieta}</span>
      <span className={`dz-tile-v${ton ? ` ${ton}` : ''}`}>{wartosc}</span>
      {opis && <span className="dz-tile-o">{opis}</span>}
    </div>
  );
}

/** Krzywa kapitału: skumulowany wynik transakcja po transakcji. */
function Krzywa({ punkty }: { punkty: number[] }) {
  if (punkty.length < 2) return null;
  const W = 640;
  const H = 170;
  const pad = 8;
  const min = Math.min(0, ...punkty);
  const max = Math.max(0, ...punkty);
  const rozpietosc = max - min || 1;
  const x = (i: number) => pad + (i / (punkty.length - 1)) * (W - pad * 2);
  const y = (v: number) => H - pad - ((v - min) / rozpietosc) * (H - pad * 2);
  const d = punkty.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const zeroY = y(0);
  const koncowy = punkty[punkty.length - 1];
  const kolor = koncowy >= 0 ? '#4ea67a' : '#d4574e';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="dz-chart" role="img" aria-label="Krzywa kapitału">
      <line x1={pad} y1={zeroY} x2={W - pad} y2={zeroY} stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
      <path d={`${d} L${x(punkty.length - 1).toFixed(1)},${zeroY.toFixed(1)} L${x(0).toFixed(1)},${zeroY.toFixed(1)} Z`} fill={kolor} opacity="0.12" />
      <path d={d} fill="none" stroke={kolor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function TradeJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [draft, setDraft] = useState<Draft>(pustyDraft);
  const [loaded, setLoaded] = useState(false);
  const [blad, setBlad] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTrades(parsed);
      }
    } catch {
      // uszkodzony wpis w pamięci przeglądarki nie ma prawa wywalić narzędzia
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    } catch {
      // brak miejsca lub tryb prywatny: dziennik działa dalej, po prostu się nie zapisze
    }
  }, [trades, loaded]);

  const setD = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const dodaj = () => {
    const ryzyko = parseFloat(draft.ryzyko.replace(',', '.'));
    const wynik = parseFloat(draft.wynik.replace(',', '.'));
    if (!draft.instrument.trim()) return setBlad('Podaj instrument, na przykład EUR/USD albo DAX.');
    if (!isFinite(ryzyko) || ryzyko <= 0) return setBlad('Ryzyko musi być liczbą większą od zera. To kwota, którą tracisz po dojściu ceny do stop lossa.');
    if (!isFinite(wynik)) return setBlad('Podaj wynik transakcji. Strata ze znakiem minus, zysk bez znaku.');
    setBlad('');
    setTrades((t) => [
      ...t,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        data: draft.data,
        instrument: draft.instrument.trim(),
        kierunek: draft.kierunek,
        ryzyko,
        wynik,
        wgPlanu: draft.wgPlanu,
        setup: draft.setup.trim(),
        notatka: draft.notatka.trim(),
      },
    ]);
    setDraft({ ...pustyDraft(), data: draft.data, instrument: draft.instrument, kierunek: draft.kierunek });
  };

  const usun = (id: string) => setTrades((t) => t.filter((x) => x.id !== id));

  const wyczysc = () => {
    if (trades.length && !confirm('Usunąć wszystkie transakcje z dziennika? Tej operacji nie da się cofnąć.')) return;
    setTrades([]);
  };

  const s = useMemo(() => statystyki(trades), [trades]);
  const wnioski = useMemo(() => czytajWnioski(trades, s), [trades, s]);

  const eksportCsv = () => {
    const naglowek = 'data;instrument;kierunek;ryzyko;wynik;R;wg_planu;setup;notatka';
    const wiersze = trades.map((t) =>
      [t.data, t.instrument, t.kierunek, t.ryzyko, t.wynik, (t.wynik / t.ryzyko).toFixed(2), t.wgPlanu ? 'tak' : 'nie', t.setup, t.notatka]
        .map((p) => `"${String(p).replace(/"/g, '""')}"`)
        .join(';'),
    );
    const blob = new Blob([`﻿${[naglowek, ...wiersze].join('\n')}`], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dziennik-tradera-${dzisiaj()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const przyklad = () => {
    if (trades.length && !confirm('Wczytanie przykładu zastąpi obecne transakcje. Kontynuować?')) return;
    setTrades(PRZYKLAD());
  };

  return (
    <div className="dz">
      <style>{CSS}</style>

      <div className="dz-panel">
        <p className="dz-kicker">Nowa transakcja</p>
        <div className="dz-form">
          <Pole label="Data">
            <input type="date" className="dz-input" value={draft.data} onChange={(e) => setD('data', e.target.value)} />
          </Pole>
          <Pole label="Instrument">
            <input className="dz-input" placeholder="EUR/USD" value={draft.instrument} onChange={(e) => setD('instrument', e.target.value)} />
          </Pole>
          <Pole label="Kierunek">
            <div className="dz-seg">
              {(['Long', 'Short'] as const).map((k) => (
                <button key={k} type="button" className={`dz-segb${draft.kierunek === k ? ' on' : ''}`} onClick={() => setD('kierunek', k)}>{k}</button>
              ))}
            </div>
          </Pole>
          <Pole label="Ryzyko (zł)">
            <input inputMode="decimal" className="dz-input" placeholder="100" value={draft.ryzyko} onChange={(e) => setD('ryzyko', e.target.value)} />
          </Pole>
          <Pole label="Wynik (zł)">
            <input inputMode="decimal" className="dz-input" placeholder="-100 albo 220" value={draft.wynik} onChange={(e) => setD('wynik', e.target.value)} />
          </Pole>
          <Pole label="Setup" szer="span 2">
            <input className="dz-input" placeholder="Odbicie od wsparcia, zgodne z trendem D1" value={draft.setup} onChange={(e) => setD('setup', e.target.value)} />
          </Pole>
          <Pole label="Notatka" szer="span 3">
            <input className="dz-input" placeholder="Co poszło dobrze, co źle, jak się czułeś" value={draft.notatka} onChange={(e) => setD('notatka', e.target.value)} />
          </Pole>
        </div>

        <button type="button" className={`dz-check${draft.wgPlanu ? ' on' : ''}`} onClick={() => setD('wgPlanu', !draft.wgPlanu)}>
          <span className="dz-box" aria-hidden="true">{draft.wgPlanu ? '✓' : ''}</span>
          <span>Transakcja zgodna z planem: setup był na liście, ryzyko policzone, wyjście według zasad</span>
        </button>

        {blad && <p className="dz-blad">{blad}</p>}

        <div className="dz-actions">
          <button type="button" className="dz-cta" onClick={dodaj}>Zapisz transakcję</button>
          {trades.length === 0 && (
            <button type="button" className="dz-ghost" onClick={przyklad}>Zobacz na przykładzie</button>
          )}
        </div>
      </div>

      {trades.length > 0 && (
        <>
          <div className="dz-panel">
            <p className="dz-kicker">Statystyki · {s.n} {s.n === 1 ? 'transakcja' : s.n < 5 ? 'transakcje' : 'transakcji'}</p>

            <Krzywa punkty={s.krzywa} />

            <div className="dz-tiles">
              <Kafel etykieta="Wynik łączny" wartosc={zl(s.suma)} ton={s.suma >= 0 ? 'plus' : 'minus'} />
              <Kafel etykieta="Trafność" wartosc={proc(s.trafnosc)} opis={`${s.wygrane} z ${s.n}`} />
              <Kafel etykieta="Profit factor" wartosc={s.pf === null ? 'brak strat' : s.pf.toFixed(2)} ton={s.pf === null || s.pf >= 1 ? 'plus' : 'minus'} opis="zyski / straty" />
              <Kafel etykieta="Średni wynik" wartosc={erka(s.sredniR)} ton={s.sredniR >= 0 ? 'plus' : 'minus'} opis="na transakcję" />
              <Kafel etykieta="Maks. obsunięcie" wartosc={zl(-s.obsuniecie)} ton="minus" opis="od szczytu krzywej" />
              <Kafel etykieta="Najdłuższa seria strat" wartosc={`${s.seria}`} opis="pod rząd" />
            </div>
          </div>

          {s.planowe.n > 0 && s.wbrew.n > 0 && (
            <div className="dz-panel">
              <p className="dz-kicker">Plan kontra improwizacja</p>
              <p className="dz-lead">
                To jest jedyne porównanie, którego nie zobaczysz w zestawieniu od brokera, a które najczęściej rozstrzyga o wyniku roku.
              </p>
              <div className="dz-split">
                <div className="dz-col">
                  <span className="dz-col-h">Zgodne z planem ({s.planowe.n})</span>
                  <span className={`dz-col-v ${s.planowe.suma >= 0 ? 'plus' : 'minus'}`}>{zl(s.planowe.suma)}</span>
                  <span className="dz-col-s">trafność {proc(s.planowe.trafnosc)} · średnio {erka(s.planowe.sredniR)}</span>
                </div>
                <div className="dz-col">
                  <span className="dz-col-h">Wbrew planowi ({s.wbrew.n})</span>
                  <span className={`dz-col-v ${s.wbrew.suma >= 0 ? 'plus' : 'minus'}`}>{zl(s.wbrew.suma)}</span>
                  <span className="dz-col-s">trafność {proc(s.wbrew.trafnosc)} · średnio {erka(s.wbrew.sredniR)}</span>
                </div>
              </div>
            </div>
          )}

          {wnioski.length > 0 && (
            <div className="dz-panel">
              <p className="dz-kicker">Co mówią twoje dane</p>
              <ul className="dz-wnioski">
                {wnioski.map((w, i) => (
                  <li key={i} className={`dz-wniosek ${w.ton}`}>
                    <strong>{w.tytul}</strong>
                    <span>{w.tresc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="dz-panel">
            <p className="dz-kicker">Transakcje</p>
            <div className="dz-tablewrap">
              <table className="dz-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Instrument</th>
                    <th>Kier.</th>
                    <th className="r">Ryzyko</th>
                    <th className="r">Wynik</th>
                    <th className="r">R</th>
                    <th>Plan</th>
                    <th>Setup</th>
                    <th aria-label="Usuń" />
                  </tr>
                </thead>
                <tbody>
                  {[...trades].reverse().map((t) => {
                    const r = t.wynik / t.ryzyko;
                    return (
                      <tr key={t.id}>
                        <td className="dz-mono">{t.data}</td>
                        <td>{t.instrument}</td>
                        <td>{t.kierunek}</td>
                        <td className="r dz-mono">{t.ryzyko.toLocaleString('pl-PL')}</td>
                        <td className={`r dz-mono ${t.wynik >= 0 ? 'plus' : 'minus'}`}>{zl(t.wynik)}</td>
                        <td className={`r dz-mono ${r >= 0 ? 'plus' : 'minus'}`}>{r.toFixed(2)}</td>
                        <td>{t.wgPlanu ? 'tak' : 'nie'}</td>
                        <td className="dz-setup" title={[t.setup, t.notatka].filter(Boolean).join(' · ')}>{t.setup || '-'}</td>
                        <td><button type="button" className="dz-del" onClick={() => usun(t.id)} aria-label="Usuń transakcję">×</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="dz-actions">
              <button type="button" className="dz-ghost" onClick={eksportCsv}>Pobierz jako CSV</button>
              <button type="button" className="dz-ghost" onClick={wyczysc}>Wyczyść dziennik</button>
            </div>
            <p className="dz-note">
              Dziennik zapisuje się wyłącznie w twojej przeglądarce. Nic nie trafia na serwer, ale też nic nie przetrwa
              wyczyszczenia danych przeglądarki ani nie przeniesie się na inne urządzenie. Jeśli zbierasz dane dłużej niż
              kilka tygodni, pobieraj CSV co jakiś czas.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

type Grupa = { n: number; suma: number; trafnosc: number; sredniR: number };

function grupa(ts: Trade[]): Grupa {
  const n = ts.length;
  if (!n) return { n: 0, suma: 0, trafnosc: 0, sredniR: 0 };
  const suma = ts.reduce((a, t) => a + t.wynik, 0);
  const wygrane = ts.filter((t) => t.wynik > 0).length;
  const sredniR = ts.reduce((a, t) => a + t.wynik / t.ryzyko, 0) / n;
  return { n, suma, trafnosc: (wygrane / n) * 100, sredniR };
}

function statystyki(trades: Trade[]) {
  const n = trades.length;
  const wygrane = trades.filter((t) => t.wynik > 0);
  const stratne = trades.filter((t) => t.wynik < 0);
  const suma = trades.reduce((a, t) => a + t.wynik, 0);
  const zyski = wygrane.reduce((a, t) => a + t.wynik, 0);
  const straty = Math.abs(stratne.reduce((a, t) => a + t.wynik, 0));

  // Krzywa kapitału startuje od zera, żeby pierwszy punkt nie sugerował wyniku sprzed dziennika.
  const krzywa: number[] = [0];
  let biezacy = 0;
  for (const t of trades) {
    biezacy += t.wynik;
    krzywa.push(biezacy);
  }

  let szczyt = 0;
  let obsuniecie = 0;
  for (const v of krzywa) {
    if (v > szczyt) szczyt = v;
    obsuniecie = Math.max(obsuniecie, szczyt - v);
  }

  let seria = 0;
  let biezacaSeria = 0;
  for (const t of trades) {
    if (t.wynik < 0) {
      biezacaSeria += 1;
      seria = Math.max(seria, biezacaSeria);
    } else {
      biezacaSeria = 0;
    }
  }

  return {
    n,
    suma,
    wygrane: wygrane.length,
    trafnosc: n ? (wygrane.length / n) * 100 : 0,
    // Brak strat oznacza, że profit factor jest nieokreślony, a nie nieskończenie dobry.
    pf: straty === 0 ? null : zyski / straty,
    sredniR: n ? trades.reduce((a, t) => a + t.wynik / t.ryzyko, 0) / n : 0,
    obsuniecie,
    seria,
    krzywa,
    sredniZysk: wygrane.length ? zyski / wygrane.length : 0,
    sredniaStrata: stratne.length ? straty / stratne.length : 0,
    planowe: grupa(trades.filter((t) => t.wgPlanu)),
    wbrew: grupa(trades.filter((t) => !t.wgPlanu)),
  };
}

type Wniosek = { tytul: string; tresc: string; ton: 'ok' | 'uwaga' | 'info' };

/**
 * Wnioski celowo mówią o tym, co widać w danych, i nie udają prognozy.
 * Przy małej próbce narzędzie ma powiedzieć wprost, że jeszcze nie ma o czym mówić.
 */
function czytajWnioski(trades: Trade[], s: ReturnType<typeof statystyki>): Wniosek[] {
  const w: Wniosek[] = [];
  if (!s.n) return w;

  if (s.n < 20) {
    w.push({
      ton: 'info',
      tytul: `Za mało transakcji na wnioski (${s.n})`,
      tresc: 'Przy tak małej próbce o wyniku decyduje przypadek, a nie twoja strategia. Liczby poniżej traktuj jako ćwiczenie w liczeniu, nie jako ocenę metody. Sensowne wnioski zaczynają się od kilkudziesięciu transakcji obejmujących różne warunki rynkowe.',
    });
  }

  if (s.planowe.n >= 3 && s.wbrew.n >= 3) {
    const roznica = s.planowe.sredniR - s.wbrew.sredniR;
    if (roznica > 0.15) {
      w.push({
        ton: 'uwaga',
        tytul: 'Łamanie planu kosztuje cię pieniądze',
        tresc: `Transakcje zgodne z planem dają średnio ${erka(s.planowe.sredniR)}, a te wbrew planowi ${erka(s.wbrew.sredniR)}. Łącznie improwizacja dała ${zl(s.wbrew.suma)} na ${s.wbrew.n} transakcjach. To najtańsza poprawka, jaką możesz wprowadzić: nie zmieniasz strategii, tylko przestajesz od niej odchodzić.`,
      });
    } else if (roznica < -0.15) {
      w.push({
        ton: 'info',
        tytul: 'Transakcje wbrew planowi wypadają lepiej',
        tresc: 'To rzadki wynik i ma dwa możliwe wytłumaczenia. Albo twój plan jest zbyt ciasny i odrzuca dobre okazje, albo próbka jest za mała i widzisz przypadek. Zanim zmienisz zasady, sprawdź, co konkretnie robisz w tych transakcjach inaczej, i dopisz to do planu jako regułę.',
      });
    }
  }

  if (s.n >= 10) {
    if (s.trafnosc >= 50 && s.suma < 0) {
      w.push({
        ton: 'uwaga',
        tytul: 'Wygrywasz częściej, niż przegrywasz, a mimo to tracisz',
        tresc: `Trafność ${proc(s.trafnosc)} przy ujemnym wyniku oznacza jedno: twoje straty są większe od zysków. Średni zysk to ${zl(s.sredniZysk)}, a średnia strata ${zl(-s.sredniaStrata)}. Problemem nie jest wybieranie transakcji, tylko wyjście z nich. Zwykle chodzi o zbyt wczesne zamykanie zysków albo przesuwanie stop lossa.`,
      });
    }
    if (s.trafnosc < 50 && s.suma > 0) {
      w.push({
        ton: 'ok',
        tytul: 'Zarabiasz mimo trafności poniżej połowy',
        tresc: `To dokładnie tak ma działać stosunek zysku do ryzyka. Trafność ${proc(s.trafnosc)} przy dodatnim wyniku znaczy, że twoje wygrane są wyraźnie większe od przegranych. Nie próbuj podnosić trafności kosztem wcześniejszego zamykania zysków, bo to zabiłoby przewagę, którą już masz.`,
      });
    }
    if (s.sredniaStrata > s.sredniZysk * 1.5 && s.sredniZysk > 0) {
      w.push({
        ton: 'uwaga',
        tytul: 'Średnia strata jest wyraźnie większa od średniego zysku',
        tresc: `Tracisz średnio ${zl(-s.sredniaStrata)}, a zarabiasz ${zl(s.sredniZysk)}. Przy takiej proporcji musisz mieć bardzo wysoką trafność, żeby wyjść na zero. Sprawdź w transakcjach stratnych, czy stop loss faktycznie był w miejscu, które ustaliłeś przed wejściem.`,
      });
    }
  }

  const ryzyka = trades.map((t) => t.ryzyko).sort((a, b) => a - b);
  const mediana = ryzyka[Math.floor(ryzyka.length / 2)];
  const maks = ryzyka[ryzyka.length - 1];
  if (s.n >= 8 && maks > mediana * 2.5) {
    w.push({
      ton: 'uwaga',
      tytul: 'Ryzyko na transakcję nie jest stałe',
      tresc: `Twoja największa pozycja ryzykowała ${maks.toLocaleString('pl-PL')} zł przy typowej ${mediana.toLocaleString('pl-PL')} zł. Zmienna wielkość ryzyka sprawia, że kilka transakcji decyduje o całym wyniku, a statystyki przestają cokolwiek znaczyć. Stałe ryzyko jest warunkiem tego, żeby dziennik mierzył strategię, a nie odwagę z danego dnia.`,
    });
  }

  if (s.n >= 15) {
    const wgDnia = new Map<number, { suma: number; n: number }>();
    for (const t of trades) {
      const d = new Date(t.data).getDay();
      if (Number.isNaN(d)) continue;
      const p = wgDnia.get(d) ?? { suma: 0, n: 0 };
      wgDnia.set(d, { suma: p.suma + t.wynik, n: p.n + 1 });
    }
    let najgorszy: [number, { suma: number; n: number }] | null = null;
    for (const wpis of wgDnia) {
      if (wpis[1].n >= 3 && (!najgorszy || wpis[1].suma < najgorszy[1].suma)) najgorszy = wpis;
    }
    if (najgorszy && najgorszy[1].suma < 0 && Math.abs(najgorszy[1].suma) > Math.abs(s.suma) * 0.4) {
      w.push({
        ton: 'info',
        tytul: `Najwięcej tracisz ${W_DNIU[najgorszy[0]]}`,
        tresc: `Ten jeden dzień tygodnia odpowiada za ${zl(najgorszy[1].suma)} przy ${najgorszy[1].n} transakcjach. To może być przypadek, ale sprawdź, czy nie handlujesz wtedy w innych warunkach: zmęczony, w pośpiechu albo w dniu regularnych publikacji danych.`,
      });
    }
  }

  if (s.seria >= 4) {
    w.push({
      ton: 'info',
      tytul: `Najdłuższa seria strat: ${s.seria} pod rząd`,
      tresc: 'Serie strat są normalne i wracają. Sprawdź, czy przy swoim ryzyku na transakcję przetrwasz dwa razy dłuższą serię niż dotychczasowa, bo prędzej czy później taka się pojawi. Jeśli nie, ryzyko jest za duże.',
    });
  }

  return w;
}

/** Przykładowa seria: dodatni wynik przy trafności poniżej połowy plus wyraźnie gorsze transakcje wbrew planowi. */
function PRZYKLAD(): Trade[] {
  const dane: Array<[string, string, 'Long' | 'Short', number, number, boolean, string]> = [
    ['2026-06-01', 'EUR/USD', 'Long', 100, -100, true, 'Odbicie od wsparcia, trend D1 w górę'],
    ['2026-06-02', 'DAX', 'Long', 100, 240, true, 'Wybicie z konsolidacji'],
    ['2026-06-03', 'EUR/USD', 'Short', 100, -100, true, 'Test oporu po wybiciu'],
    ['2026-06-04', 'BTC/USD', 'Long', 260, -260, false, 'Wejście bez setupu, po ruchu'],
    ['2026-06-05', 'DAX', 'Short', 100, -100, true, 'Odwrócenie pod oporem'],
    ['2026-06-08', 'EUR/USD', 'Long', 100, 310, true, 'Kontynuacja trendu po korekcie'],
    ['2026-06-09', 'GBP/USD', 'Long', 100, -100, true, 'Odbicie od wsparcia'],
    ['2026-06-10', 'BTC/USD', 'Short', 100, -100, false, 'Odgrywanie się po stracie'],
    ['2026-06-11', 'DAX', 'Long', 100, 190, true, 'Wybicie z flagi'],
    ['2026-06-12', 'EUR/USD', 'Short', 100, -100, true, 'Formacja odwrócenia pod oporem'],
    ['2026-06-15', 'US100', 'Long', 100, 280, true, 'Kontynuacja po korekcie do średniej'],
    ['2026-06-16', 'EUR/USD', 'Long', 100, -100, true, 'Odbicie od wsparcia'],
    ['2026-06-17', 'GBP/USD', 'Short', 320, -320, false, 'Powiększona pozycja, chęć odrobienia'],
    ['2026-06-18', 'DAX', 'Long', 100, 220, true, 'Wybicie z konsolidacji'],
    ['2026-06-19', 'US100', 'Short', 100, -100, true, 'Test oporu'],
    ['2026-06-22', 'EUR/USD', 'Long', 100, 260, true, 'Trend D1, wejście z H4'],
    ['2026-06-23', 'BTC/USD', 'Long', 100, -100, false, 'Wejście pod wpływem newsa'],
    ['2026-06-24', 'DAX', 'Short', 100, 210, true, 'Odwrócenie pod oporem'],
    ['2026-06-25', 'GBP/USD', 'Long', 100, -100, true, 'Odbicie od wsparcia'],
    ['2026-06-26', 'US100', 'Long', 100, 240, true, 'Kontynuacja trendu'],
  ];
  return dane.map(([data, instrument, kierunek, ryzyko, wynik, wgPlanu, setup], i) => ({
    id: `demo-${i}`,
    data,
    instrument,
    kierunek,
    ryzyko,
    wynik,
    wgPlanu,
    setup,
    notatka: '',
  }));
}

const CSS = `
.dz { max-width: 900px; margin: 0 auto; font-family: var(--font-body); color: var(--text); display: flex; flex-direction: column; gap: 18px; }
.dz-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 24px; }
.dz-kicker { font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--cyan); margin: 0 0 16px; font-weight: 600; }
.dz-lead { font-size: 0.92rem; line-height: 1.65; color: var(--muted); margin: -6px 0 16px; }

.dz-form { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.dz-field { min-width: 0; }
.dz-label { display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px; color: var(--muted); }
.dz-input { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; color: var(--text); font-size: 0.94rem; font-family: var(--font-body); }
.dz-input:focus { outline: none; border-color: var(--cyan); }

.dz-seg { display: flex; gap: 6px; }
.dz-segb { flex: 1; background: var(--bg); border: 1px solid var(--border); color: var(--muted); border-radius: 10px; padding: 10px 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; font-family: var(--font-body); transition: all .12s ease; }
.dz-segb:hover { border-color: var(--cyan); }
.dz-segb.on { background: var(--cyan); color: #0a0a0a; border-color: var(--cyan); }

.dz-check { display: flex; align-items: flex-start; gap: 11px; text-align: left; width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 13px; margin-top: 16px; cursor: pointer; font-family: var(--font-body); font-size: 0.9rem; color: var(--muted); line-height: 1.5; transition: all .12s ease; }
.dz-check:hover { border-color: var(--cyan); }
.dz-check.on { border-color: var(--cyan); color: var(--text); }
.dz-box { flex: none; width: 19px; height: 19px; border-radius: 5px; border: 1px solid var(--border); display: inline-flex; align-items: center; justify-content: center; font-size: 0.72rem; color: #0a0a0a; margin-top: 1px; }
.dz-check.on .dz-box { background: var(--cyan); border-color: var(--cyan); }

.dz-blad { font-size: 0.88rem; color: #e0796f; margin: 14px 0 0; line-height: 1.55; }
.dz-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 18px; }
.dz-cta { background: var(--cyan); color: #0a0a0a; border: none; border-radius: 999px; padding: 12px 28px; font-weight: 800; font-size: 0.96rem; cursor: pointer; font-family: var(--font-body); }
.dz-cta:hover { filter: brightness(1.08); }
.dz-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); border-radius: 999px; padding: 11px 22px; font-weight: 700; font-size: 0.9rem; cursor: pointer; font-family: var(--font-body); }
.dz-ghost:hover { border-color: var(--cyan); color: var(--text); }

.dz-chart { width: 100%; height: auto; display: block; margin-bottom: 20px; }

.dz-tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.dz-tile { display: flex; flex-direction: column; gap: 3px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 14px; }
.dz-tile-l { font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-family: var(--font-mono); }
.dz-tile-v { font-size: 1.35rem; font-weight: 800; }
.dz-tile-o { font-size: 0.78rem; color: var(--muted); }
.plus { color: #6fc79a; }
.minus { color: #e0796f; }

.dz-split { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.dz-col { display: flex; flex-direction: column; gap: 5px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
.dz-col-h { font-size: 0.82rem; font-weight: 700; color: var(--muted); }
.dz-col-v { font-size: 1.5rem; font-weight: 800; }
.dz-col-s { font-size: 0.8rem; color: var(--muted); }

.dz-wnioski { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.dz-wniosek { display: flex; flex-direction: column; gap: 5px; background: var(--bg); border: 1px solid var(--border); border-left-width: 3px; border-radius: 10px; padding: 14px 16px; }
.dz-wniosek strong { font-size: 0.96rem; }
.dz-wniosek span { font-size: 0.89rem; line-height: 1.65; color: var(--muted); }
.dz-wniosek.uwaga { border-left-color: #e0796f; }
.dz-wniosek.ok { border-left-color: #6fc79a; }
.dz-wniosek.info { border-left-color: var(--cyan); }

.dz-tablewrap { overflow-x: auto; }
.dz-table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
.dz-table th { text-align: left; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); font-family: var(--font-mono); font-weight: 600; padding: 0 10px 9px; white-space: nowrap; }
.dz-table td { padding: 9px 10px; border-top: 1px solid var(--border); white-space: nowrap; }
.dz-table .r { text-align: right; }
.dz-mono { font-family: var(--font-mono); font-size: 0.82rem; }
.dz-setup { max-width: 240px; overflow: hidden; text-overflow: ellipsis; color: var(--muted); }
.dz-del { background: none; border: none; color: var(--muted); font-size: 1.1rem; cursor: pointer; padding: 0 4px; line-height: 1; }
.dz-del:hover { color: #e0796f; }
.dz-note { font-size: 0.82rem; line-height: 1.6; color: var(--muted); margin: 16px 0 0; }

@media (max-width: 720px) {
  .dz-panel { padding: 18px; }
  .dz-form { grid-template-columns: 1fr 1fr; }
  .dz-field[style] { grid-column: span 2 !important; }
  .dz-tiles { grid-template-columns: 1fr 1fr; }
  .dz-split { grid-template-columns: 1fr; }
}
`;
