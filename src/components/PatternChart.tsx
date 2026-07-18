import type { Candle } from '@/lib/patterns';

const UP = '#16a34a';
const DN = '#ef4453';

type Box = { w: number; h: number; pad: number };
const DEFAULT_BOX: Box = { w: 240, h: 118, pad: 10 };

export function Candles({ candles, box = DEFAULT_BOX }: { candles: Candle[]; box?: Box }) {
  const { w, h, pad } = box;
  let min = Infinity, max = -Infinity;
  candles.forEach((c) => { if (c[2] < min) min = c[2]; if (c[1] > max) max = c[1]; });
  const p = (max - min) * 0.08 || 1;
  min -= p; max += p;
  const n = candles.length;
  const step = (w - pad * 2) / n;
  const bw = Math.min(step * 0.6, box === DEFAULT_BOX ? 16 : 30);
  const cx = (i: number) => pad + (i + 0.5) * step;
  const yy = (v: number) => pad + (1 - (v - min) / (max - min)) * (h - pad * 2);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }} aria-hidden="true">
      {candles.map((c, i) => {
        const up = c[3] >= c[0];
        const col = up ? UP : DN;
        const yO = yy(c[0]), yC = yy(c[3]);
        const top = Math.min(yO, yC);
        const bh = Math.max(Math.abs(yO - yC), 1.6);
        return (
          <g key={i}>
            <line x1={cx(i)} x2={cx(i)} y1={yy(c[1])} y2={yy(c[2])} stroke={col} strokeWidth={1.3} />
            <rect x={cx(i) - bw / 2} y={top} width={bw} height={bh} fill={col} rx={0.6} />
          </g>
        );
      })}
    </svg>
  );
}

export function LineChart({ pts, neck, box = DEFAULT_BOX }: { pts: number[]; neck?: number; box?: Box }) {
  const { w, h, pad } = box;
  const min = Math.min(...pts, neck ?? Infinity) - 0.6;
  const max = Math.max(...pts, neck ?? -Infinity) + 0.6;
  const n = pts.length;
  const cx = (i: number) => pad + (i / (n - 1)) * (w - pad * 2);
  const yy = (v: number) => pad + (1 - (v - min) / (max - min)) * (h - pad * 2);
  const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${cx(i).toFixed(1)},${yy(v).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }} aria-hidden="true">
      {neck !== undefined && (
        <line
          x1={pad} x2={w - pad} y1={yy(neck)} y2={yy(neck)}
          stroke="var(--cyan)" strokeWidth={1} strokeDasharray="4 3" opacity={0.8}
        />
      )}
      <path d={d} fill="none" stroke="var(--text)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((v, i) => <circle key={i} cx={cx(i)} cy={yy(v)} r={2} fill="var(--cyan)" />)}
    </svg>
  );
}

export const BIG_BOX: Box = { w: 460, h: 190, pad: 18 };
