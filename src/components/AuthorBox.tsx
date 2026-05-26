import Image from 'next/image';
import Link from 'next/link';

export default function AuthorBox() {
  return (
    <div style={{
      maxWidth: 860,
      margin: '0 auto',
      padding: '0 24px 60px',
    }}>
      <div style={{
        borderTop: '1px solid rgba(201,162,39,0.12)',
        paddingTop: 40,
        display: 'flex',
        gap: 28,
        alignItems: 'flex-start',
      }}>
        <div style={{ flexShrink: 0 }}>
          <Image
            src="/images/profile.png"
            alt="Mateusz Kisiel"
            width={80}
            height={80}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              filter: 'grayscale(20%) contrast(1.05)',
              border: '2px solid rgba(201,162,39,0.2)',
              display: 'block',
            }}
          />
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '2px',
            color: '#c9a227',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            O autorze
          </div>

          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            letterSpacing: '2px',
            color: '#ffffff',
            marginBottom: 10,
          }}>
            Mateusz Kisiel
          </div>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: '#c8d4e8',
            lineHeight: 1.8,
            margin: '0 0 16px',
            maxWidth: 560,
          }}>
            9 lat na rynkach finansowych. Twórca KisielFinanse.
            Piszę o finansach tak, jak sam chciałem o nich czytać: bez ściemy, bez kursów
            za fortunę i bez obietnic szybkiego wzbogacenia.
          </p>

          <Link
            href="/o-mnie"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '1.5px',
              color: '#c9a227',
              textDecoration: 'none',
              border: '1px solid rgba(201,162,39,0.25)',
              padding: '7px 16px',
              display: 'inline-block',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            Więcej o mnie →
          </Link>
        </div>
      </div>
    </div>
  );
}
