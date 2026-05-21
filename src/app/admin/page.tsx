'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.error ?? 'Błąd logowania');
      }
    } catch {
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#030508',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          border: '1px solid rgba(0,245,212,0.15)',
          background: '#080d14',
          padding: '48px 40px',
        }}
      >
        {/* Logo / title */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '0.6rem',
              letterSpacing: '6px',
              color: '#00f5d4',
              marginBottom: '12px',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            KISIEL
          </div>
          <div
            style={{
              fontSize: '2.2rem',
              letterSpacing: '8px',
              color: '#e8edf5',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 300,
            }}
          >
            ADMIN
          </div>
          <div
            style={{
              fontSize: '2.2rem',
              letterSpacing: '8px',
              color: '#00f5d4',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 300,
              marginTop: '-6px',
            }}
          >
            PANEL
          </div>
          <div
            style={{
              marginTop: '16px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0,245,212,0.4), transparent)',
            }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '8px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.58rem',
                letterSpacing: '2px',
                color: '#00f5d4',
                marginBottom: '8px',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              HASŁO DOSTĘPU
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              style={{
                width: '100%',
                background: '#0d1520',
                border: '1px solid rgba(0,245,212,0.1)',
                color: '#e8edf5',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.85rem',
                padding: '12px 14px',
                outline: 'none',
                letterSpacing: '2px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,245,212,0.4)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,245,212,0.1)';
              }}
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                background: 'rgba(255,45,120,0.08)',
                border: '1px solid rgba(255,45,120,0.2)',
                color: '#ff2d78',
                fontSize: '0.72rem',
                letterSpacing: '0.5px',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              // ERROR: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '24px',
              padding: '13px',
              background: loading ? 'rgba(0,245,212,0.1)' : '#00f5d4',
              color: loading ? '#00f5d4' : '#030508',
              border: 'none',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.72rem',
              letterSpacing: '3px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(0,245,212,0.85)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#00f5d4';
              }
            }}
          >
            {loading ? '// WERYFIKACJA...' : 'ZALOGUJ →'}
          </button>
        </form>

        <div
          style={{
            marginTop: '32px',
            fontSize: '0.58rem',
            color: '#5a6478',
            textAlign: 'center',
            letterSpacing: '1px',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          // DOSTĘP TYLKO DLA ADMINISTRATORA
        </div>
      </div>
    </div>
  );
}
