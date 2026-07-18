'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { PATTERNS, BIAS_LABEL, KIND_LABEL, type Bias, type Candle, type Pattern } from '@/lib/patterns';
import { Candles, LineChart, BIG_BOX } from './PatternChart';

const ROUNDS = 10;

type Mode = 'nazwa' | 'kierunek' | 'mieszany';
type Level = 'latwy' | 'trudny';
type QType = 'nazwa' | 'kierunek';

type Round = {
  pattern: Pattern;
  qType: QType;
  candles?: Candle[];
  line?: number[];
  options: string[];
  correct: string;
};

const BIAS_OPTION: Record<Bias, string> = {
  byczy: 'Wzrosty (byczy)',
  niedzwiedzi: 'Spadki (niedźwiedzi)',
  neutralny: 'Bez kierunku (niepewność)',
};

// ── Losowe wariacje, żeby trener nie uczył jednego obrazka ──

function rnd(amp: number) {
  return (Math.random() * 2 - 1) * amp;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Korpus zachowuje rozmiar (przesuwa się tylko o mały dryf), zmieniają się knoty.
 * Dzięki temu relacje między świecami (objęcie, harami) pozostają prawdziwe.
 */
function varyCandles(cs: Candle[]): Candle[] {
  let min = Infinity, max = -Infinity;
  cs.forEach((c) => { if (c[2] < min) min = c[2]; if (c[1] > max) max = c[1]; });
  const drift = ((max - min) || 1) * 0.006;

  return cs.map(([o, h, l, c]) => {
    const d = rnd(drift);
    const no = o + d;
    const nc = c + d;
    // Knot zmienia się proporcjonalnie do własnej świecy, żeby nie rozjechać małych świec przy dużym zakresie serii.
    const wick = ((h - l) || 1) * 0.04;
    const nh = Math.max(h + d + rnd(wick), no, nc);
    const nl = Math.min(l + d - rnd(wick), no, nc);
    return [no, nh, nl, nc] as Candle;
  });
}

function varyLine(pts: number[]): number[] {
  return pts.map((v) => v + rnd(0.16));
}

// ── Budowa rundy ──

function distractors(target: Pattern, level: Level): string[] {
  const others = PATTERNS.filter((p) => p.name !== target.name);
  if (level === 'latwy') return shuffle(others).slice(0, 3).map((p) => p.name);

  // Trudny: najpierw mylące, czyli ta sama grupa i ten sam charakter formacji.
  const sameGroup = others.filter((p) => p.group === target.group);
  const veryClose = shuffle(sameGroup.filter((p) => p.kind === target.kind || p.bias === target.bias));
  const rest = shuffle([...sameGroup.filter((p) => !veryClose.includes(p)), ...others.filter((p) => p.group !== target.group)]);
  return [...veryClose, ...rest].slice(0, 3).map((p) => p.name);
}

function buildRound(pattern: Pattern, mode: Mode, level: Level): Round {
  const qType: QType = mode === 'mieszany' ? (Math.random() < 0.65 ? 'nazwa' : 'kierunek') : mode;

  const options = qType === 'nazwa'
    ? shuffle([pattern.name, ...distractors(pattern, level)])
    : [BIAS_OPTION.byczy, BIAS_OPTION.niedzwiedzi, BIAS_OPTION.neutralny];

  return {
    pattern,
    qType,
    candles: pattern.candles ? varyCandles(pattern.candles) : undefined,
    line: pattern.line ? varyLine(pattern.line) : undefined,
    options,
    correct: qType === 'nazwa' ? pattern.name : BIAS_OPTION[pattern.bias],
  };
}

function buildDeck(mode: Mode, level: Level): Round[] {
  return shuffle(PATTERNS).slice(0, ROUNDS).map((p) => buildRound(p, mode, level));
}

// ── Komponent ──

export default function PatternTrainer() {
  const [phase, setPhase] = useState<'idle' | 'play' | 'done'>('idle');
  const [mode, setMode] = useState<Mode>('mieszany');
  const [level, setLevel] = useState<Level>('latwy');
  const [deck, setDeck] = useState<Round[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [misses, setMisses] = useState<Pattern[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const round = deck[i];
  const isLast = i === deck.length - 1;

  const start = useCallback(() => {
    setDeck(buildDeck(mode, level));
    setI(0);
    setPicked(null);
    setScore(0);
    setStreak(0);
    setBest(0);
    setMisses([]);
    setPhase('play');
  }, [mode, level]);

  const answer = useCallback((opt: string) => {
    if (picked !== null || !round) return;
    setPicked(opt);
    if (opt === round.correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBest((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
      setMisses((m) => (m.some((p) => p.name === round.pattern.name) ? m : [...m, round.pattern]));
    }
  }, [picked, round]);

  const next = useCallback(() => {
    if (picked === null) return;
    if (isLast) { setPhase('done'); return; }
    setI((n) => n + 1);
    setPicked(null);
  }, [picked, isLast]);

  // Nowe pytanie zmienia wysokość panelu, więc ustawiamy go pod navem zamiast zostawiać przewinięty ekran.
  useEffect(() => {
    if (phase === 'idle' || !panelRef.current) return;
    const y = panelRef.current.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, [i, phase]);

  // Skróty klawiszowe: 1-4 odpowiedź, Enter/spacja dalej.
  useEffect(() => {
    if (phase !== 'play') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (picked !== null) { e.preventDefault(); next(); }
        return;
      }
      const n = Number(e.key);
      if (picked === null && round && n >= 1 && n <= round.options.length) answer(round.options[n - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, picked, round, answer, next]);

  const verdict = useMemo(() => {
    const pct = (score / ROUNDS) * 100;
    if (pct === 100) return { t: 'Komplet punktów', d: 'Formacje masz opanowane. Teraz najtrudniejsze: rozpoznać je na żywym wykresie, gdzie nikt nie zaznacza, gdzie formacja się zaczyna.' };
    if (pct >= 80) return { t: 'Bardzo dobry wynik', d: 'Rozpoznajesz większość formacji. Popracuj nad tymi, które poniżej wypadły słabiej, i przejdź na poziom trudny.' };
    if (pct >= 60) return { t: 'Solidna podstawa', d: 'Znasz klasykę, ale mylą ci się formacje o podobnym wyglądzie. Przejrzyj te z listy i zagraj jeszcze raz.' };
    return { t: 'Do powtórki', d: 'Zacznij od encyklopedii formacji i artykułu o świecach japońskich, potem wróć tutaj. Rozpoznawanie przychodzi z powtórzeń.' };
  }, [score]);

  return (
    <div className="pt" ref={panelRef}>
      <style>{CSS}</style>

      {phase === 'idle' && (
        <div className="pt-panel pt-start">
          <h2 className="pt-h">Sprawdź, czy rozpoznasz formację</h2>
          <p className="pt-sub">
            Dziesięć wykresów, za każdym razem trochę inaczej narysowanych. Nazwij formację albo powiedz,
            w którą stronę wychyla. Po każdej odpowiedzi dostajesz wyjaśnienie.
          </p>

          <div className="pt-cfg">
            <div className="pt-cfg-row">
              <span className="pt-cfg-label">Pytania</span>
              <div className="pt-seg">
                {([['mieszany', 'Mieszane'], ['nazwa', 'Nazwa formacji'], ['kierunek', 'Kierunek']] as [Mode, string][]).map(([k, l]) => (
                  <button key={k} className={`pt-segb${mode === k ? ' on' : ''}`} onClick={() => setMode(k)}>{l}</button>
                ))}
              </div>
            </div>
            <div className="pt-cfg-row">
              <span className="pt-cfg-label">Poziom</span>
              <div className="pt-seg">
                {([['latwy', 'Łatwy'], ['trudny', 'Trudny']] as [Level, string][]).map(([k, l]) => (
                  <button key={k} className={`pt-segb${level === k ? ' on' : ''}`} onClick={() => setLevel(k)}>{l}</button>
                ))}
              </div>
            </div>
            <p className="pt-hint">
              Na poziomie trudnym odpowiedzi do wyboru są celowo podobne do siebie: ta sama grupa formacji i ten sam charakter sygnału.
            </p>
          </div>

          <button className="pt-cta" onClick={start}>Zaczynam</button>
        </div>
      )}

      {phase === 'play' && round && (
        <div className="pt-panel">
          <div className="pt-top">
            <span className="pt-count">Pytanie {i + 1} / {ROUNDS}</span>
            <div className="pt-stats">
              <span className="pt-stat">Punkty <b>{score}</b></span>
              <span className="pt-stat">Seria <b>{streak}</b></span>
            </div>
          </div>
          <div className="pt-bar"><div className="pt-bar-fill" style={{ width: `${(i / ROUNDS) * 100}%` }} /></div>

          <div className="pt-chart">
            {round.candles
              ? <Candles candles={round.candles} box={BIG_BOX} />
              : <LineChart pts={round.line!} neck={round.pattern.neck} box={BIG_BOX} />}
          </div>

          <h2 className="pt-q">
            {round.qType === 'nazwa' ? 'Jaka to formacja?' : 'Co ta formacja zapowiada?'}
          </h2>

          <div className="pt-opts">
            {round.options.map((o, n) => {
              const isCorrect = o === round.correct;
              const state = picked === null ? '' : isCorrect ? ' ok' : o === picked ? ' bad' : ' dim';
              return (
                <button key={o} className={`pt-opt${state}`} onClick={() => answer(o)} disabled={picked !== null}>
                  <span className="pt-key">{n + 1}</span>
                  <span className="pt-opt-t">{o}</span>
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className={`pt-expl${picked === round.correct ? ' good' : ''}`}>
              <div className="pt-expl-head">
                <strong>{picked === round.correct ? 'Dobrze.' : 'Niedokładnie.'}</strong>{' '}
                {round.pattern.name} <span className="pt-en">({round.pattern.en})</span>
                <span className="pt-tags">
                  <span className={`pt-tag pt-${round.pattern.bias}`}>{BIAS_LABEL[round.pattern.bias]}</span>
                  <span className="pt-tag pt-kind">{KIND_LABEL[round.pattern.kind]}</span>
                </span>
              </div>
              <p className="pt-expl-p">{round.pattern.desc}</p>
              <p className="pt-expl-p"><b>Jak grać:</b> {round.pattern.play}</p>
              <button className="pt-cta pt-cta-sm" onClick={next}>
                {isLast ? 'Zobacz wynik' : 'Następne pytanie'}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div className="pt-panel pt-result">
          <p className="pt-score">{score}<span>/{ROUNDS}</span></p>
          <h2 className="pt-h">{verdict.t}</h2>
          <p className="pt-sub">{verdict.d}</p>
          <p className="pt-best">Najdłuższa seria poprawnych odpowiedzi: <b>{best}</b></p>

          {misses.length > 0 && (
            <div className="pt-misses">
              <h3 className="pt-misses-h">Formacje do powtórzenia</h3>
              {misses.map((p) => (
                <div key={p.name} className="pt-miss">
                  <div className="pt-miss-chart">
                    {p.candles ? <Candles candles={p.candles} /> : <LineChart pts={p.line!} neck={p.neck} />}
                  </div>
                  <div>
                    <p className="pt-miss-n">{p.name} <span className="pt-en">({p.en})</span></p>
                    <p className="pt-miss-d">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-actions">
            <button className="pt-cta" onClick={start}>Jeszcze raz</button>
            <button className="pt-ghost" onClick={() => setPhase('idle')}>Zmień ustawienia</button>
          </div>

          <p className="pt-links">
            Powtórz teorię w <Link href="/formacje-tradingowe">encyklopedii formacji</Link>, przećwicz na żywym wykresie
            w <Link href="/symulator-tradingu">symulatorze tradingu</Link> albo wróć do przewodnika{' '}
            <Link href="/naucz-sie-tradowac">naucz się tradować</Link>.
          </p>
        </div>
      )}
    </div>
  );
}

const CSS = `
.pt { --pt-up: #16a34a; --pt-dn: #ef4453; max-width: 760px; margin: 0 auto; font-family: var(--font-body); color: var(--text); }
.pt-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 26px 24px 28px; }
.pt-h { font-size: 1.5rem; font-weight: 800; margin: 0 0 10px; line-height: 1.2; }
.pt-sub { font-size: 0.98rem; line-height: 1.7; color: var(--muted); margin: 0 0 22px; }

.pt-cfg { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
.pt-cfg-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.pt-cfg-label { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); min-width: 74px; }
.pt-seg { display: flex; gap: 6px; flex-wrap: wrap; }
.pt-segb { background: var(--bg); border: 1px solid var(--border); color: var(--muted); border-radius: 999px; padding: 7px 15px; font-weight: 700; font-size: 0.85rem; cursor: pointer; font-family: var(--font-body); transition: all .12s ease; }
.pt-segb:hover { border-color: var(--cyan); }
.pt-segb.on { background: var(--cyan); color: #0a0a0a; border-color: var(--cyan); }
.pt-hint { font-size: 0.84rem; line-height: 1.6; color: var(--muted); opacity: 0.85; margin: 0; }

.pt-cta { background: var(--cyan); color: #0a0a0a; border: none; border-radius: 999px; padding: 13px 30px; font-weight: 800; font-size: 1rem; cursor: pointer; font-family: var(--font-body); }
.pt-cta:hover { filter: brightness(1.08); }
.pt-cta-sm { padding: 10px 22px; font-size: 0.92rem; margin-top: 14px; }
.pt-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); border-radius: 999px; padding: 12px 24px; font-weight: 700; font-size: 0.92rem; cursor: pointer; font-family: var(--font-body); }
.pt-ghost:hover { border-color: var(--cyan); color: var(--text); }

.pt-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
.pt-count { font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
.pt-stats { display: flex; gap: 14px; }
.pt-stat { font-size: 0.8rem; color: var(--muted); }
.pt-stat b { color: var(--cyan); font-size: 0.95rem; margin-left: 4px; }
.pt-bar { height: 3px; background: var(--border); border-radius: 999px; overflow: hidden; margin-bottom: 18px; }
.pt-bar-fill { height: 100%; background: var(--cyan); transition: width .25s ease; }

.pt-chart { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 10px; margin-bottom: 18px; }
.pt-q { font-size: 1.18rem; font-weight: 800; margin: 0 0 14px; }

.pt-opts { display: flex; flex-direction: column; gap: 8px; }
.pt-opt { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; background: var(--bg); border: 1px solid var(--border); border-radius: 11px; padding: 13px 15px; font-size: 0.96rem; font-weight: 600; color: var(--text); cursor: pointer; font-family: var(--font-body); transition: all .12s ease; }
.pt-opt:hover:not(:disabled) { border-color: var(--cyan); }
.pt-opt:disabled { cursor: default; }
.pt-key { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; flex: none; border-radius: 6px; background: var(--surface); border: 1px solid var(--border); font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); }
.pt-opt.ok { border-color: var(--pt-up); background: rgba(22,163,74,0.12); }
.pt-opt.bad { border-color: var(--pt-dn); background: rgba(239,68,83,0.12); }
.pt-opt.dim { opacity: 0.45; }

.pt-expl { margin-top: 18px; padding: 16px 16px 18px; border-radius: 12px; border: 1px solid var(--border); border-left: 3px solid var(--pt-dn); background: var(--bg); }
.pt-expl.good { border-left-color: var(--pt-up); }
.pt-expl-head { font-size: 1rem; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.pt-en { color: var(--muted); font-style: italic; font-size: 0.84rem; font-weight: 400; }
.pt-tags { display: inline-flex; gap: 6px; }
.pt-tag { font-size: 0.68rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; }
.pt-byczy { background: rgba(22,163,74,0.15); color: var(--pt-up); }
.pt-niedzwiedzi { background: rgba(239,68,83,0.15); color: var(--pt-dn); }
.pt-neutralny { background: rgba(255,255,255,0.08); color: var(--muted); }
.pt-kind { background: rgba(201,162,39,0.14); color: var(--cyan); }
.pt-expl-p { font-size: 0.92rem; line-height: 1.65; color: var(--muted); margin: 0 0 8px; }
.pt-expl-p b { color: var(--text); }

.pt-result { text-align: center; }
.pt-score { font-size: 3.4rem; font-weight: 800; color: var(--cyan); margin: 0 0 4px; line-height: 1; font-family: var(--font-display, var(--font-body)); }
.pt-score span { font-size: 1.4rem; color: var(--muted); }
.pt-result .pt-sub { max-width: 520px; margin: 0 auto 16px; }
.pt-best { font-size: 0.9rem; color: var(--muted); margin: 0 0 22px; }
.pt-best b { color: var(--text); }

.pt-misses { text-align: left; border-top: 1px solid var(--border); padding-top: 20px; margin-bottom: 22px; }
.pt-misses-h { font-size: 1.05rem; font-weight: 800; margin: 0 0 14px; }
.pt-miss { display: grid; grid-template-columns: 150px 1fr; gap: 14px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
.pt-miss:last-child { border-bottom: none; }
.pt-miss-chart { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 4px; }
.pt-miss-n { font-weight: 800; font-size: 0.95rem; margin: 0 0 4px; }
.pt-miss-d { font-size: 0.86rem; line-height: 1.55; color: var(--muted); margin: 0; }

.pt-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 18px; }
.pt-links { font-size: 0.9rem; line-height: 1.7; color: var(--muted); margin: 0; }
.pt-links a { color: var(--cyan); }

@media (max-width: 560px) {
  .pt-panel { padding: 20px 16px 24px; }
  .pt-miss { grid-template-columns: 1fr; }
  .pt-miss-chart { max-width: 220px; }
}
`;
