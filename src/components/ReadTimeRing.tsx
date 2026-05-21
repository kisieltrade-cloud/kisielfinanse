interface Props {
  readTime: string;   // e.g. "7 min"
  size?: number;
  maxMinutes?: number;
}

export default function ReadTimeRing({ readTime, size = 32, maxMinutes = 15 }: Props) {
  const minutes = parseInt(readTime) || 1;
  const progress = Math.min(minutes / maxMinutes, 1);
  const sw = 2.5;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);
  const c = size / 2;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)', display: 'block' }}
        >
          <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(0,245,212,0.1)" strokeWidth={sw} />
          <circle
            cx={c} cy={c} r={r}
            fill="none"
            stroke="#00f5d4"
            strokeWidth={sw}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: Math.round(size * 0.3) + 'px',
          color: '#00f5d4',
          fontWeight: 600,
          lineHeight: 1,
        }}>
          {minutes}
        </div>
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.58rem',
        color: 'var(--muted)',
        letterSpacing: '0.5px',
      }}>
        min
      </span>
    </div>
  );
}
