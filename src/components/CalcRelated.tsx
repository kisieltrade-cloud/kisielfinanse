import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import { postUrl } from '@/lib/url';
import NewsletterForm from '@/components/NewsletterForm';

const ALL_CALCS = [
  { href: '/kalkulator/procent-skladany', label: 'Procent składany',   icon: '📈' },
  { href: '/kalkulator/dca',              label: 'DCA',                 icon: '🔁' },
  { href: '/kalkulator/risk-reward',      label: 'Risk / Reward',       icon: '⚖️' },
  { href: '/kalkulator/fire',             label: 'Kalkulator FIRE',     icon: '🔥' },
  { href: '/kalkulator/etf',             label: 'ETF vs lokata',       icon: '📊' },
  { href: '/kalkulator/godziny-pracy',   label: 'Ile godzin pracy?',   icon: '⏱️' },
  { href: '/kalkulator/kredyt-gotowkowy', label: 'Kredyt gotówkowy',    icon: '💳' },
  { href: '/kalkulator-hipoteczny',       label: 'Kalkulator hipoteczny', icon: '🏠' },
];

export default async function CalcRelated({ currentPath }: { currentPath: string }) {
  const posts = await getAllPosts();
  const related = posts.slice(0, 3);
  const otherCalcs = ALL_CALCS.filter(c => c.href !== currentPath);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>

      {/* ── Inne kalkulatory ── */}
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
        color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        Inne kalkulatory
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 10,
        marginBottom: 56,
      }}>
        {otherCalcs.map(c => (
          <Link key={c.href} href={c.href} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            textDecoration: 'none',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 700,
            transition: 'border-color 0.15s, transform 0.15s',
          }}
          onMouseEnter={undefined}
          >
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{c.icon}</span>
            {c.label}
          </Link>
        ))}
      </div>

      {/* ── Newsletter ── */}
      <div style={{ marginBottom: 56 }}>
        <NewsletterForm />
      </div>

      {/* ── Polecane artykuły ── */}
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
        color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        Polecane artykuły
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16,
      }}>
        {related.map(post => (
          <Link key={post.slug} href={postUrl(post)} style={{
            display: 'flex', flexDirection: 'column',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            overflow: 'hidden',
            textDecoration: 'none',
            color: 'var(--text)',
            transition: 'transform 0.18s, border-color 0.18s',
          }}>
            {post.image && (
              <div style={{ position: 'relative', height: 140, flexShrink: 0 }}>
                <Image
                  src={post.image} alt={post.title} fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  sizes="(max-width: 640px) 100vw, 300px"
                />
              </div>
            )}
            <div style={{ padding: '14px 16px 18px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                color: '#c9a227', textTransform: 'uppercase', letterSpacing: '1px',
              }}>
                {post.tag}
              </span>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                fontWeight: 700, margin: '6px 0 0', lineHeight: 1.35,
                color: 'var(--text)',
              }}>
                {post.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
