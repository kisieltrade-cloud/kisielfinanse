'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea,
  ResponsiveContainer, Cell,
} from 'recharts';

// ─── PALETA (motyw marki, ciemny) ────────────────────────────────────────────
const GOLD = '#c9a227';
const CRIMSON = '#ff2d78';
const GRID = 'rgba(255,255,255,0.06)';
const AXIS = '#8a93a5';

// ─── DANE (zweryfikowane, czerwiec 2026) ─────────────────────────────────────
// Dług sektora gg (metodologia EDP/unijna), % PKB. Historia GUS/Eurostat,
// 2026-2029 = prognoza (Strategia zarzadzania dlugiem MF + szacunki).
const debtGDP = [
  { rok: '2000', dlug: 36.5 }, { rok: '2001', dlug: 37.3 },
  { rok: '2002', dlug: 41.8 }, { rok: '2003', dlug: 46.6 },
  { rok: '2004', dlug: 45.0 }, { rok: '2005', dlug: 46.5 },
  { rok: '2006', dlug: 46.9 }, { rok: '2007', dlug: 44.2 },
  { rok: '2008', dlug: 46.3 }, { rok: '2009', dlug: 49.4 },
  { rok: '2010', dlug: 53.1 }, { rok: '2011', dlug: 54.4 },
  { rok: '2012', dlug: 53.7 }, { rok: '2013', dlug: 56.0 },
  { rok: '2014', dlug: 50.4 }, { rok: '2015', dlug: 51.3 },
  { rok: '2016', dlug: 54.2 }, { rok: '2017', dlug: 50.6 },
  { rok: '2018', dlug: 48.8 }, { rok: '2019', dlug: 45.7 },
  { rok: '2020', dlug: 57.2 }, { rok: '2021', dlug: 53.6 },
  { rok: '2022', dlug: 49.2 }, { rok: '2023', dlug: 49.6 },
  { rok: '2024', dlug: 55.3 }, { rok: '2025', dlug: 59.7 },
  { rok: '2026*', dlug: 61.6, prognoza: true },
  { rok: '2027*', dlug: 61.3, prognoza: true },
  { rok: '2028*', dlug: 61.8, prognoza: true },
  { rok: '2029*', dlug: 62.3, prognoza: true },
];

// Koszt obslugi dlugu Skarbu Panstwa (mld PLN), budzet/MF
const obslugi = [
  { rok: '2020', kwota: 27.1 },
  { rok: '2021', kwota: 26.0 },
  { rok: '2022', kwota: 32.7 },
  { rok: '2023', kwota: 48.2 },
  { rok: '2024', kwota: 66.0 },
  { rok: '2025', kwota: 75.5 },
  { rok: '2026', kwota: 90.0 },
];

// Dlug sektora gg, wybrane kraje UE (% PKB, ~2026)
const euPorownanie = [
  { kraj: 'Dania', dlug: 30 },
  { kraj: 'Szwecja', dlug: 33 },
  { kraj: 'Czechy', dlug: 44 },
  { kraj: 'Polska', dlug: 62, highlight: true },
  { kraj: 'Niemcy', dlug: 63 },
  { kraj: 'Węgry', dlug: 73 },
  { kraj: 'Belgia', dlug: 105 },
  { kraj: 'Francja', dlug: 114 },
  { kraj: 'Włochy', dlug: 138 },
  { kraj: 'Grecja', dlug: 150 },
];

// ─── KOMPONENTY POMOCNICZE ───────────────────────────────────────────────────

interface TooltipPayload { value: number | string; name: string; color?: string; payload?: { prognoza?: boolean } }
const ChartTooltip = ({ active, payload, label, suffix = '%' }: {
  active?: boolean; payload?: TooltipPayload[]; label?: string; suffix?: string;
}) => {
  if (!active || !payload || !payload.length) return null;
  const isPrognoza = payload[0]?.payload?.prognoza;
  return (
    <div style={{
      background: '#0c1119', border: '1px solid var(--border)',
      borderRadius: 8, padding: '10px 14px', fontSize: 13,
      fontFamily: 'var(--font-body)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: '#fff' }}>
        {label} {isPrognoza && <span style={{ color: AXIS, fontSize: 11 }}>(prognoza)</span>}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || '#cbd3e0' }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}{suffix}</strong>
        </div>
      ))}
    </div>
  );
};

const Section = ({ id, kicker, title, children }: {
  id?: string; kicker: string; title: string; children: React.ReactNode;
}) => (
  <section id={id} style={{ marginBottom: 64 }}>
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '3px',
      textTransform: 'uppercase', color: CRIMSON, marginBottom: 10,
    }}>{kicker}</div>
    <h2 style={{
      fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3.4vw, 2.3rem)',
      fontWeight: 800, color: 'var(--text)', lineHeight: 1.2, margin: '0 0 8px',
    }}>{title}</h2>
    <div style={{ height: 1, background: 'var(--border)', margin: '0 0 26px' }} />
    {children}
  </section>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{
    fontFamily: 'var(--font-body)', fontSize: '1.02rem', lineHeight: 1.85,
    color: 'var(--muted)', margin: '0 0 18px',
  }}>{children}</p>
);

const Note = ({ accent = GOLD, label, children }: {
  accent?: string; label?: string; children: React.ReactNode;
}) => (
  <div style={{
    borderLeft: `3px solid ${accent}`, background: 'rgba(255,255,255,0.02)',
    padding: '16px 20px', margin: '0 0 24px', borderRadius: '0 8px 8px 0',
  }}>
    {label && (
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '2px',
        textTransform: 'uppercase', color: accent, fontWeight: 700, marginBottom: 8,
      }}>{label}</div>
    )}
    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.98rem', lineHeight: 1.8, color: 'var(--text)' }}>{children}</div>
  </div>
);

const ChartCard = ({ title, source, children }: {
  title: string; source: string; children: React.ReactNode;
}) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '22px 14px 14px', marginBottom: 24,
  }}>
    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: 3, paddingLeft: 8 }}>{title}</div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: AXIS, marginBottom: 16, paddingLeft: 8 }}>{source}</div>
    {children}
  </div>
);

// ─── KOMPONENT GLOWNY ────────────────────────────────────────────────────────

export default function DlugPubliczny() {
  const [tab, setTab] = useState<'gdp' | 'koszt' | 'ue'>('gdp');

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>

      {/* ── PASEK LICZB (hero) ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 1, background: 'var(--border)', border: '1px solid var(--border)',
        borderRadius: 14, overflow: 'hidden', marginBottom: 56,
      }}>
        {[
          { v: '61,6%', l: 'Dług / PKB (EDP)', s: 'I kw. 2026, próg UE: 60%' },
          { v: '115 mld', l: 'Koszt obsługi długu', s: 'rocznie, 2026' },
          { v: '6,8%', l: 'Deficyt sektora', s: 'drugi największy w UE' },
          { v: '3 000 zł', l: 'Odsetki na osobę', s: 'rocznie, każdy Polak' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg)', padding: '22px 20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', lineHeight: 1, color: CRIMSON, letterSpacing: '1px' }}>{s.v}</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', marginTop: 8 }}>{s.l}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: AXIS, marginTop: 4 }}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* ── INTRO ── */}
      <P>
        Wyobraź sobie, że zarabiasz 5 000 zł miesięcznie, a sam procent od twoich kredytów pochłania 3 000 zł co miesiąc. Nie spłacasz kapitału. Płacisz wyłącznie odsetki, i co miesiąc dokładasz nowe długi. W dużym uproszczeniu tak właśnie wygląda sytuacja polskiego państwa w 2026 roku.
      </P>
      <P>
        Dług publiczny wielu z nas traktuje jak abstrakcję, coś, co dotyczy rządu, a nie nas samych. To złudzenie. Każda złotówka długu państwa to przyszłe podatki, twoje albo twoich dzieci. To mniej pieniędzy na szpitale, drogi i szkoły. To presja na twoją lokatę, twój kredyt i wartość złotówki w portfelu.
      </P>
      <Note accent={CRIMSON} label="O czym jest ta strona">
        Pokazujemy, jak rosło polskie zadłużenie przez ćwierć wieku, dlaczego akurat teraz przebiło unijny próg 60 procent PKB, ile realnie kosztuje nas jego obsługa i co to oznacza dla twojego budżetu. Same dane i wykresy, bez politycznych wycieczek.
      </Note>

      {/* ── SEKCJA 1 ── */}
      <Section id="historia" kicker="01 · Historia" title="Ćwierć wieku polskiego długu">
        <P>
          Polska ani razu w historii III RP nie domknęła budżetu bez deficytu. Co roku wydajemy więcej, niż zbieramy z podatków, a różnicę dokładamy do długu. Poniższy wykres pokazuje, jak relacja długu do PKB zmieniała się od 2000 roku, i dokąd zmierza do końca dekady według prognoz Ministerstwa Finansów.
        </P>

        {/* przelacznik wykresow */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {[
            { id: 'gdp', label: 'Dług % PKB' },
            { id: 'koszt', label: 'Koszt obsługi' },
            { id: 'ue', label: 'Polska na tle UE' },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)} style={{
              padding: '8px 18px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '1px', fontWeight: 700,
              border: `1px solid ${tab === t.id ? CRIMSON : 'var(--border)'}`,
              background: tab === t.id ? CRIMSON : 'transparent',
              color: tab === t.id ? '#fff' : 'var(--muted)', transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'gdp' && (
          <ChartCard title="Dług sektora instytucji rządowych i samorządowych do PKB (EDP, %)" source="Linia od 2026 = prognoza. Źródło: GUS, Eurostat, Ministerstwo Finansów">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={debtGDP} margin={{ top: 8, right: 18, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradDebt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CRIMSON} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={CRIMSON} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                <XAxis dataKey="rok" tick={{ fontSize: 11, fill: AXIS }} interval={2} />
                <YAxis domain={[25, 80]} tick={{ fontSize: 11, fill: AXIS }} tickFormatter={(v) => `${v}%`} width={40} />
                <Tooltip content={<ChartTooltip suffix="%" />} />
                <ReferenceArea x1="2026*" x2="2029*" fill={GOLD} fillOpacity={0.05} />
                <ReferenceLine y={60} stroke={CRIMSON} strokeDasharray="6 3" strokeWidth={1.5}
                  label={{ value: 'Próg UE 60%', position: 'insideTopRight', fontSize: 10, fill: CRIMSON, fontWeight: 700 }} />
                <Area type="monotone" dataKey="dlug" name="Dług/PKB" stroke={CRIMSON} strokeWidth={2.5} fill="url(#gradDebt)"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  dot={(props: any) => {
                    const { payload, cx, cy, index } = props;
                    const show = payload && ['2014', '2020', '2025', '2026*'].includes(payload.rok);
                    return <circle key={index} cx={cx} cy={cy} r={show ? 4.5 : 0}
                      fill={payload?.prognoza ? GOLD : CRIMSON} stroke="#030508" strokeWidth={2} />;
                  }} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: AXIS, flexWrap: 'wrap' }}>
              <span style={{ color: CRIMSON }}>● dane GUS/Eurostat</span>
              <span style={{ color: GOLD }}>● prognoza MF</span>
            </div>
          </ChartCard>
        )}

        {tab === 'koszt' && (
          <ChartCard title="Roczny koszt obsługi długu Skarbu Państwa (mld PLN)" source="Źródło: ustawa budżetowa, Ministerstwo Finansów">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={obslugi} margin={{ top: 8, right: 18, left: -4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                <XAxis dataKey="rok" tick={{ fontSize: 12, fill: AXIS }} />
                <YAxis tick={{ fontSize: 11, fill: AXIS }} tickFormatter={(v) => `${v}`} width={36} />
                <Tooltip content={<ChartTooltip suffix=" mld" />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="kwota" name="Koszt obsługi" radius={[5, 5, 0, 0]}>
                  {obslugi.map((e) => (
                    <Cell key={e.rok} fill={e.rok === '2026' ? CRIMSON : e.kwota > 60 ? 'rgba(255,45,120,0.55)' : 'rgba(255,45,120,0.25)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <Note accent={CRIMSON}>
              W cztery lata koszt obsługi samego długu Skarbu Państwa urósł z 32,7 mld do 90 mld zł. To skok o niemal 175 procent. Budżet na zdrowie rósł w tym czasie o kilkanaście procent rocznie.
            </Note>
          </ChartCard>
        )}

        {tab === 'ue' && (
          <ChartCard title="Dług publiczny wybranych krajów UE (% PKB, 2026)" source="Źródło: Eurostat, szacunki dla 2026 r.">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={euPorownanie} layout="vertical" margin={{ top: 4, right: 36, left: 56, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: AXIS }} tickFormatter={(v) => `${v}%`} domain={[0, 170]} />
                <YAxis type="category" dataKey="kraj" tick={{ fontSize: 12, fill: '#cbd3e0', fontWeight: 600 }} width={56} />
                <Tooltip content={<ChartTooltip suffix="%" />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <ReferenceLine x={60} stroke={CRIMSON} strokeDasharray="5 3" strokeWidth={1.5} />
                <Bar dataKey="dlug" name="Dług/PKB" radius={[0, 5, 5, 0]}>
                  {euPorownanie.map((e) => (
                    <Cell key={e.kraj} fill={e.kraj === 'Polska' ? CRIMSON : e.dlug > 100 ? 'rgba(255,255,255,0.22)' : 'rgba(201,162,39,0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: AXIS, textAlign: 'center' }}>
              pionowa linia = próg UE 60% PKB · różowy słupek = Polska
            </div>
          </ChartCard>
        )}

        <P>Kilka momentów z tego wykresu zmieniło trajektorię długu na tyle, że warto je rozłożyć osobno.</P>

        {[
          { rok: '2014: reforma OFE', opis: 'Dług w jeden rok „spadł” z 56 do 50 procent PKB. Nie dlatego, że rząd zaczął oszczędzać. Państwo przejęło obligacje skarbowe z OFE do ZUS i je umorzyło. Dług przesunął się w inne miejsce, zamiast realnie zniknąć.' },
          { rok: '2020: pandemia', opis: 'COVID zmusił rządy całego świata do gigantycznych wydatków. Polska wydała ponad 100 mld zł na tarcze antykryzysowe, a dług skoczył z 46 do 57 procent PKB. Część tych pieniędzy przeszła przez fundusze pozabudżetowe BGK, poza zwykłym budżetem.' },
          { rok: '2022: inflacja zamydliła obraz', opis: 'Relacja długu do PKB spadła wtedy do 49 procent, choć długu nie spłacaliśmy. Wysoka inflacja podbijała nominalne PKB, czyli mianownik tego ułamka rósł szybciej niż licznik. Statystyczne złudzenie, nie realna poprawa.' },
          { rok: '2025-2026: przekroczenie progu', opis: 'Wydatki na obronność, świadczenia i osłony cenowe utrzymały deficyt sektora blisko 7 procent PKB przez kilka lat z rzędu. W I kwartale 2026 relacja długu do PKB sięgnęła 61,6 procent. Polska po raz pierwszy w historii przebiła unijny próg 60 procent.' },
        ].map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 18, alignItems: 'baseline', borderBottom: '1px solid var(--border)', paddingBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.5px', color: GOLD, minWidth: 8, flexShrink: 0 }}>›</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text)', marginBottom: 5 }}>{e.rok}</div>
              <div style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.75 }}>{e.opis}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* ── SEKCJA 2 ── */}
      <Section id="powody" kicker="02 · Przyczyny" title="Dlaczego dług rośnie tak szybko">
        <P>
          Dług nie rośnie sam z siebie. Za każdym rokiem deficytu stoi konkretna decyzja: co kupić, komu wypłacić, ile pożyczyć. Od kilku lat w Polsce działa równolegle kilka silników zadłużenia.
        </P>

        {[
          { n: '01', tit: 'Zbrojenia', txt: 'Polska przeznacza na obronę ponad 4 procent PKB, najwięcej w całym NATO. W obliczu zagrożenia ze strony Rosji to wydatek racjonalny, ale pieniądze na armię trzeba skądś wziąć. Rząd woli je pożyczać, niż podnosić podatki albo ciąć inne pozycje budżetu.' },
          { n: '02', tit: 'Świadczenia społeczne', txt: 'Program 800 plus, trzynasta i czternasta emerytura, renta wdowia, bon na dziecko. Każdy z osobna da się obronić społecznie. Razem to dziesiątki miliardów rocznie, bez stałego źródła finansowania, więc trafiają wprost do deficytu.' },
          { n: '03', tit: 'Osłony cenowe', txt: 'Mrożenie cen energii, bony energetyczne i dopłaty do rachunków miały chronić domowe budżety przed skutkami kryzysu energetycznego. Skutek uboczny jest taki, że to kolejne miliardy dokładane do deficytu, rok po roku.' },
          { n: '04', tit: 'Dług ukryty w funduszach BGK', txt: 'To najbardziej sporna pozycja. Część zobowiązań państwa siedzi w funduszach pozabudżetowych Banku Gospodarstwa Krajowego, między innymi w Funduszu Przeciwdziałania COVID-19 i Funduszu Wsparcia Sił Zbrojnych. W metodologii krajowej (PDP) tego długu prawie nie widać, w unijnej (EDP) już tak. Dlatego krajowy wskaźnik pokazuje 50,6 procent, a unijny 61,6 procent. Różnica to skala długu schowanego poza budżetem.' },
        ].map((c) => (
          <div key={c.n} style={{ display: 'flex', gap: 18, marginBottom: 22, alignItems: 'flex-start' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1, color: GOLD, flexShrink: 0, minWidth: 44 }}>
              {c.n}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)', marginBottom: 6 }}>{c.tit}</div>
              <div style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.78 }}>{c.txt}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* ── SEKCJA 3 ── */}
      <Section id="koszty" kicker="03 · Cena" title="115 miliardów złotych rocznie">
        <P>
          W 2026 roku obsługa całego długu publicznego pochłonie około <strong style={{ color: 'var(--text)' }}>115 miliardów złotych</strong>, z czego 90 miliardów to odsetki od długu samego Skarbu Państwa. To nie spłata kapitału. To czysta opłata za to, że jesteśmy zadłużeni. Trudno wyczuć skalę takiej liczby, więc zestawmy ją z czymś znajomym.
        </P>

        <Note accent={CRIMSON} label="Porównanie">
          115 miliardów złotych na samą obsługę długu to więcej, niż rząd wyda łącznie na 800 plus, trzynastą i czternastą emeryturę, rentę wdowią oraz bon na dziecko razem wzięte. Odsetki zjadają większą kwotę niż wszystkie te programy społeczne naraz.
        </Note>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { v: '90 mld', l: 'Obsługa długu Skarbu Państwa', c: CRIMSON },
            { v: '115 mld', l: 'Obsługa całego długu publicznego', c: CRIMSON },
            { v: '+19%', l: 'Wzrost kosztu rok do roku', c: GOLD },
            { v: '+175%', l: 'Wzrost od 2022 roku', c: GOLD },
          ].map((s) => (
            <div key={s.l} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '18px 16px', background: 'var(--surface)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1, color: s.c, letterSpacing: '1px' }}>{s.v}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 8, lineHeight: 1.4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <P>
          Inaczej licząc, na każdego Polaka, od noworodka po seniora, przypada w 2026 roku około <strong style={{ color: 'var(--text)' }}>3 000 zł samych odsetek</strong> od długu państwa. Czteroosobowa rodzina dokłada do obsługi długu mniej więcej 12 000 zł rocznie, tyle że nigdy nie dostaje takiej faktury. Płaci ją ukrytą w cenach, podatkach i słabszych usługach publicznych.
        </P>

        <Note accent={GOLD} label="Drogi dług">
          Polska należy do krajów UE o najwyższym koszcie obsługi długu w relacji do jego wielkości. Powód jest podwójny: większość długu mamy w złotych, przy wciąż wysokich stopach NBP, a do tego spora część zobowiązań siedzi w drogo oprocentowanych funduszach BGK. Pożyczamy drożej niż państwa strefy euro.
        </Note>
      </Section>

      {/* ── SEKCJA 4 ── */}
      <Section id="prognoza" kicker="04 · Prognoza" title="Dokąd to zmierza do 2029 roku">
        <P>
          Ministerstwo Finansów opublikowało Strategię zarządzania długiem na lata 2026-2029. Niezależne ośrodki, między innymi Forum Obywatelskiego Rozwoju, dorzuciły własne wyliczenia. Scenariusz bazowy zakłada stabilizację tuż powyżej 60 procent PKB, ale tylko pod warunkiem, że deficyt zacznie maleć.
        </P>

        <ChartCard title="Prognoza długu publicznego do 2029 roku (% PKB)" source="Cieniowany obszar = prognoza. Źródło: Strategia MF, FOR">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={debtGDP.filter((d) => parseInt(d.rok) >= 2019 || d.rok.includes('*'))} margin={{ top: 8, right: 30, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
              <XAxis dataKey="rok" tick={{ fontSize: 11, fill: AXIS }} />
              <YAxis domain={[44, 70]} tick={{ fontSize: 11, fill: AXIS }} tickFormatter={(v) => `${v}%`} width={40} />
              <Tooltip content={<ChartTooltip suffix="%" />} />
              <ReferenceArea x1="2026*" x2="2029*" fill={GOLD} fillOpacity={0.06} />
              <ReferenceLine y={60} stroke={CRIMSON} strokeDasharray="5 3" strokeWidth={1.5}
                label={{ value: '60%', position: 'right', fontSize: 10, fill: CRIMSON, fontWeight: 700 }} />
              <Line type="monotone" dataKey="dlug" name="Dług/PKB" stroke={CRIMSON} strokeWidth={2.5}
                dot={{ fill: CRIMSON, r: 3.5, stroke: '#030508', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { col: CRIMSON, tit: 'Scenariusz pesymistyczny', body: 'Deficyt nie spada, dług dobija w okolice 66-68 procent PKB do 2029. W tle ryzyko obniżki ratingu, droższe pożyczki i unijna procedura nadmiernego deficytu.' },
            { col: GOLD, tit: 'Scenariusz bazowy', body: 'Dług stabilizuje się w przedziale 61-63 procent PKB. Koszt obsługi pozostaje wysoki, ale bez gwałtownego kryzysu, o ile stopy procentowe nie pójdą w górę.' },
            { col: '#4caf7d', tit: 'Scenariusz optymistyczny', body: 'Mocny wzrost PKB, obniżki stóp NBP i realna konsolidacja finansów schładzają dług poniżej 60 procent. Mało realne bez głębszych reform.' },
          ].map((s) => (
            <div key={s.tit} style={{ border: `1px solid ${s.col}40`, borderTop: `3px solid ${s.col}`, borderRadius: 12, padding: '18px', background: 'var(--surface)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: s.col, marginBottom: 8 }}>{s.tit}</div>
              <div style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.7 }}>{s.body}</div>
            </div>
          ))}
        </div>

        <Note accent={CRIMSON} label="Ratingi ostrzegają">
          We wrześniu 2025 agencje Moody&apos;s i Fitch obniżyły perspektywę ratingu Polski ze stabilnej do negatywnej, wskazując na pogarszający się stan finansów publicznych. Moody&apos;s trzyma ocenę na poziomie A2, Fitch na A-. S&amp;P w listopadzie 2025 utrzymała A- ze stabilną perspektywą. Samo cięcie ratingu, a nie tylko perspektywy, oznaczałoby droższe pożyczki dla całej polskiej gospodarki, od państwa po kredytobiorców.
        </Note>
      </Section>

      {/* ── SEKCJA 5 ── */}
      <Section id="dla-ciebie" kicker="05 · Twój portfel" title="Co to znaczy dla twoich pieniędzy">
        <P>
          Dług publiczny nie jest problemem czysto teoretycznym. Przekłada się na finanse osobiste przez pięć kanałów, które warto znać.
        </P>

        {[
          { tit: 'Wyższe podatki, prędzej czy później', txt: 'Dług trzeba kiedyś obsłużyć. Jeśli rząd nie tnie wydatków, a historia pokazuje, że politycznie jest to bardzo trudne, sięga po podatki. VAT, PIT, CIT, danina od nieruchomości, każdy z nich bywał już podnoszony w ramach konsolidacji finansów.' },
          { tit: 'Stopy procentowe, czyli twoja rata i lokata', txt: 'Rosnący dług i gorszy rating wymuszają na NBP utrzymywanie wyższych stóp, żeby inwestorzy chcieli kupować polskie obligacje. Dla kredytobiorców ze zmiennym oprocentowaniem to wyższa rata. Dla oszczędzających wyższe odsetki, ale tylko dopóki nie wróci inflacja.' },
          { tit: 'Mniej na usługi publiczne', txt: 'Kiedy 115 mld zł znika na odsetki, na resztę zostaje mniej. Mniej na szpitale, szkoły, drogi i koleje. To nie hasło polityczne, tylko arytmetyka budżetu. Każda złotówka odsetek to złotówka odjęta od czegoś konkretnego.' },
          { tit: 'Kurs złotego', txt: 'Wysoki dług i negatywne perspektywy ratingów ciążą złotemu. Słabsza waluta to droższe wakacje za granicą, droższa elektronika, droższe paliwo i leki z importu. Pośrednio także wyższa inflacja u nas w sklepie.' },
          { tit: 'Rachunek dla następnego pokolenia', txt: 'Dług spłacają roczniki, które go nie zaciągały. Twoje dzieci, wchodząc na rynek pracy za dekadę czy dwie, odziedziczą zobowiązania zaciągane dzisiaj na świadczenia, osłony i zbrojenia. To realny transfer między pokoleniami.' },
        ].map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 18, alignItems: 'baseline', borderBottom: '1px solid var(--border)', paddingBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: CRIMSON, minWidth: 26, flexShrink: 0 }}>{`0${i + 1}`}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text)', marginBottom: 5 }}>{p.tit}</div>
              <div style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.78 }}>{p.txt}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* ── SEKCJA 6 ── */}
      <Section id="co-robic" kicker="06 · Co możesz zrobić" title="Jak chronić oszczędności">
        <P>
          Na politykę fiskalną nie masz wpływu. Na to, jak ustawisz własny portfel pod rosnące zadłużenie państwa, już tak. Cztery proste kierunki, którymi inwestorzy zwykle zabezpieczają się przed słabszą walutą i ryzykiem fiskalnym.
        </P>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { tit: 'ETF na globalny rynek', txt: 'Dywersyfikacja geograficzna chroni przed słabnącym złotym i krajowym ryzykiem. ETF na MSCI World albo S&P 500 to ekspozycja na globalną gospodarkę, nie tylko polską.', href: '/inwestycje/etf-czym-jest-jak-zaczac-inwestowac', cta: 'ETF od zera' },
            { tit: 'Obligacje indeksowane inflacją', txt: 'Detaliczne obligacje EDO i COI doliczają inflację do oprocentowania, więc bronią siły nabywczej oszczędności wtedy, gdy ceny przyspieszają.', href: '/pieniadze/obligacje-skarbowe-2026-ktore-wybrac-i-jak-kupic', cta: 'Obligacje skarbowe' },
            { tit: 'Złoto, 5-10% portfela', txt: 'Klasyczna ochrona przed osłabieniem walut i kryzysami zadłużenia. Nie płaci dywidendy, ale w długim terminie trzyma siłę nabywczą.', href: '/gospodarka/zloto-2026-dlaczego-wszyscy-kupuja-i-czy-warto', cta: 'Złoto w 2026' },
            { tit: 'Część oszczędności w walucie', txt: 'Konto albo lokata w euro czy dolarze to element dywersyfikacji walutowej. Gdy złoty się osłabia, ta część portfela zyskuje.', href: '/symulator-inwestycji', cta: 'Symulator inwestycji' },
          ].map((c) => (
            <div key={c.tit} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '18px', background: 'var(--surface)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: 8 }}>{c.tit}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 12 }}>{c.txt}</div>
              <a href={c.href} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '1px', color: GOLD, textDecoration: 'none', fontWeight: 700 }}>{c.cta} ›</a>
            </div>
          ))}
        </div>

        <Note accent={GOLD} label="Najważniejsze">
          Nie chowaj głowy w piasek. Dług publiczny to nie problem samych polityków, tylko każdego, kto trzyma złotówki. Im wcześniej zrozumiesz mechanizm i ustawisz oszczędności pod inflację, podatki i słabszą walutę, tym mniej cię to zaskoczy. Świadomy inwestor wie, że te trzy rzeczy nie biorą się znikąd, tylko z decyzji fiskalnych podejmowanych dzisiaj.
        </Note>
      </Section>

      {/* ── PODSUMOWANIE ── */}
      <Section id="podsumowanie" kicker="07 · Skrót" title="Siedem liczb, które warto zapamiętać">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { v: '61,6%', l: 'Dług EDP / PKB, I kw. 2026' },
            { v: '50,6%', l: 'Dług krajowy (PDP) / PKB' },
            { v: '115 mld', l: 'Koszt obsługi długu rocznie' },
            { v: '90 mld', l: 'Odsetki samego Skarbu Państwa' },
            { v: '6,8%', l: 'Deficyt sektora, drugi w UE' },
            { v: '3 000 zł', l: 'Odsetki na głowę Polaka' },
          ].map((s) => (
            <div key={s.l} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '18px', textAlign: 'left', background: 'var(--surface)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: CRIMSON, letterSpacing: '1px', lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginTop: 8, lineHeight: 1.4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <P>
          Przez lata dług Polski uchodził za problem łagodny, niski na tle Unii i pod kontrolą. To się skończyło. Dziś przebiliśmy unijny próg 60 procent PKB, koszty obsługi biją rekordy, a agencje ratingowe trzymają negatywną perspektywę.
        </P>
        <P>
          To jeszcze nie apokalipsa, Polska nie jest Grecją z 2010 roku. Ale udawanie, że temat nas nie dotyczy, byłoby błędem każdego, kto chce świadomie zarządzać własnymi pieniędzmi. Rachunek i tak na końcu trafia do podatnika.
        </P>
      </Section>

      {/* ── ZASTRZEZENIE ── */}
      <div style={{
        border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px',
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: AXIS, lineHeight: 1.7, marginTop: 8,
      }}>
        <strong style={{ color: 'var(--muted)' }}>Zastrzeżenie.</strong> Strona ma charakter edukacyjny i nie jest poradą inwestycyjną. Dane pochodzą z GUS, Eurostatu, Ministerstwa Finansów oraz publikacji niezależnych ośrodków analitycznych (stan na czerwiec 2026). Prognozy to szacunki, rzeczywistość może się od nich różnić. KisielFinanse nie odpowiada za decyzje podjęte na podstawie tych informacji.
      </div>
    </div>
  );
}
