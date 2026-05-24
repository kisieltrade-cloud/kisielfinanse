'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { marked } from 'marked';

interface InitialData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  readTime: string;
  published: boolean;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  author?: string;
  image?: string;
  gallery?: string[];
  keywords?: string;
}

interface Props {
  initialData?: InitialData;
  mode: 'new' | 'edit';
}

const TAGS = [
  'Edukacja',
  'Strategia',
  'Psychologia',
  'Analiza',
  'Krypto',
  'Forex',
  'Futures',
  'Risk Management',
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function calcReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

const inputStyle: React.CSSProperties = {
  background: '#0d1520',
  border: '1px solid rgba(0,245,212,0.1)',
  color: '#e8edf5',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.8rem',
  padding: '10px 14px',
  width: '100%',
  outline: 'none',
  display: 'block',
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.58rem',
  color: '#00f5d4',
  letterSpacing: '2px',
  marginBottom: '6px',
  display: 'block',
};

const sectionHeaderStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.65rem',
  color: '#00f5d4',
  letterSpacing: '3px',
  marginBottom: '20px',
  paddingBottom: '10px',
  borderBottom: '1px solid rgba(0,245,212,0.1)',
};

const fieldGroupStyle: React.CSSProperties = {
  marginBottom: '16px',
};

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div style={fieldGroupStyle}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          cursor: readOnly ? 'default' : 'text',
          color: readOnly ? '#5a6478' : '#e8edf5',
        }}
        onFocus={(e) => {
          if (!readOnly) e.currentTarget.style.borderColor = 'rgba(0,245,212,0.4)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0,245,212,0.1)';
        }}
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 3,
  minHeight,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  minHeight?: string;
  placeholder?: string;
}) {
  return (
    <div style={fieldGroupStyle}>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          resize: 'vertical',
          minHeight: minHeight ?? 'auto',
          lineHeight: '1.6',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0,245,212,0.4)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0,245,212,0.1)';
        }}
      />
    </div>
  );
}

// ── SERP Preview ─────────────────────────────────────────────────────────────
function SerpPreview({ title, slug, metaTitle, metaDescription }: {
  title: string; slug: string; metaTitle: string; metaDescription: string;
}) {
  const displayTitle = metaTitle || title || 'Tytuł artykułu';
  const displayDesc = metaDescription || 'Opis artykułu pojawi się tutaj — uzupełnij excerpt lub meta opis.';

  const titleOver = displayTitle.length > 60;
  const descOver = displayDesc.length > 160;

  const shownTitle = titleOver ? displayTitle.slice(0, 57) + '...' : displayTitle;
  const shownDesc = descOver ? displayDesc.slice(0, 157) + '...' : displayDesc;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem',
        color: '#5a6478', letterSpacing: 2, marginBottom: 10,
      }}>
        // PODGLĄD W GOOGLE
      </div>

      {/* Google SERP card */}
      <div style={{
        background: '#fff', borderRadius: 10, padding: '14px 18px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.28)',
        fontFamily: 'Arial, sans-serif',
      }}>
        {/* Favicon + site name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: '#0b0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6rem', color: '#00f5d4', fontWeight: 700, flexShrink: 0,
          }}>N</div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#202124', fontWeight: 500, lineHeight: 1.2 }}>KisielFinanse</div>
            <div style={{ fontSize: '0.72rem', color: '#4d5156', lineHeight: 1.2 }}>
              KisielFinanse.pl{slug ? ` › blog › ${slug}` : ' › blog'}
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontSize: '1.15rem', color: titleOver ? '#c0392b' : '#1a0dab',
          lineHeight: 1.3, marginBottom: 4,
          fontWeight: 400, cursor: 'pointer',
        }}>
          {shownTitle}
          {titleOver && <span style={{ fontSize: '0.65rem', color: '#c0392b', marginLeft: 6, fontFamily: 'system-ui' }}>za długi ({displayTitle.length}/60)</span>}
        </div>

        {/* Description */}
        <div style={{ fontSize: '0.82rem', color: descOver ? '#c0392b' : '#4d5156', lineHeight: 1.6 }}>
          {shownDesc}
          {descOver && <span style={{ fontSize: '0.65rem', color: '#c0392b', marginLeft: 6, fontFamily: 'system-ui' }}>za długi ({displayDesc.length}/160)</span>}
        </div>
      </div>
    </div>
  );
}

// ── SEO progress bar ─────────────────────────────────────────────────────────
function SeoBar({ value, max, thresholds }: { value: number; max: number; thresholds: [number, number] }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = value <= thresholds[0] ? '#10b981' : value <= thresholds[1] ? '#f59e0b' : '#ff2d78';
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 5 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.2s, background 0.2s' }} />
    </div>
  );
}

// ── Toolbar helpers ───────────────────────────────────────────────────────────
const tbBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.07)',
  color: '#a0a8bc',
  borderRadius: 4,
  padding: '3px 8px',
  fontSize: '0.7rem',
  fontFamily: "'JetBrains Mono', monospace",
  cursor: 'pointer',
  lineHeight: 1.4,
  transition: 'color 0.1s, border-color 0.1s',
};

function TbSep() {
  return <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)', margin: '0 2px' }} />;
}

// ── SEO Checklist panel ───────────────────────────────────────────────────────
function SeoChecklist({ title, metaTitle, metaDescription, keywords, image, excerpt, content }: {
  title: string; metaTitle: string; metaDescription: string;
  keywords: string; image: string; excerpt: string; content: string;
}) {
  const hasH2 = /^## /m.test(content);
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const hasDoubleH1 = (content.match(/^# /gm) || []).length > 0;

  const checks = [
    { label: 'Tytuł artykułu (H1)', ok: !!title, warn: false, tip: 'Wpisz tytuł artykułu' },
    { label: 'Excerpt / opis skrócony', ok: excerpt.length >= 50, warn: excerpt.length > 0 && excerpt.length < 50, tip: 'Napisz excerpt - min. 50 znaków' },
    { label: 'Meta tytuł (≤ 60 znaków)', ok: metaTitle.length > 0 && metaTitle.length <= 60, warn: metaTitle.length > 60, tip: 'Tytuł SEO - maks. 60 znaków' },
    { label: 'Meta opis (≤ 160 znaków)', ok: metaDescription.length >= 100 && metaDescription.length <= 160, warn: metaDescription.length > 160 || (metaDescription.length > 0 && metaDescription.length < 100), tip: '100-160 znaków to idealne SEO' },
    { label: 'Słowa kluczowe', ok: keywords.split(',').filter(Boolean).length >= 3, warn: keywords.length > 0 && keywords.split(',').filter(Boolean).length < 3, tip: 'Dodaj min. 3 słowa kluczowe' },
    { label: 'Zdjęcie główne (cover)', ok: !!image, warn: false, tip: 'Dodaj zdjęcie główne artykułu' },
    { label: 'Nagłówki H2 w treści', ok: hasH2, warn: false, tip: 'Używaj ## do podziału na sekcje' },
    { label: 'Brak H1 w treści', ok: !hasDoubleH1, warn: hasDoubleH1, tip: 'Nie dodawaj # w treści — tytuł to już H1' },
    { label: 'Długość artykułu (≥ 300 słów)', ok: wordCount >= 300, warn: wordCount > 0 && wordCount < 300, tip: `Masz ${wordCount} słów — min. 300 to dobra baza SEO` },
  ];

  const passed = checks.filter(c => c.ok).length;
  const score = Math.round((passed / checks.length) * 100);
  const scoreColor = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ff2d78';

  return (
    <div style={{
      background: '#0d1520', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10, padding: '14px 16px', marginBottom: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#5a6478', letterSpacing: 2 }}>// SEO SCORE</span>
        <span style={{ fontFamily: 'system-ui', fontSize: '0.9rem', fontWeight: 700, color: scoreColor }}>{score}%</span>
      </div>
      {/* Score bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 12 }}>
        <div style={{ height: '100%', width: `${score}%`, background: scoreColor, borderRadius: 2, transition: 'width 0.3s, background 0.3s' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {checks.map(c => (
          <div key={c.label} title={c.ok ? '' : c.tip} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem', flexShrink: 0, width: 14, textAlign: 'center' }}>
              {c.ok ? '✓' : c.warn ? '⚠' : '○'}
            </span>
            <span style={{
              fontFamily: 'system-ui', fontSize: '0.7rem',
              color: c.ok ? '#10b981' : c.warn ? '#f59e0b' : '#5a6478',
            }}>
              {c.label}
              {!c.ok && <span style={{ color: '#3a4258', fontSize: '0.62rem' }}> — {c.tip}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ArticleEditor({ initialData, mode }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [author, setAuthor] = useState(initialData?.author ?? 'Mateusz');
  const [date, setDate] = useState(initialData?.date ?? new Date().toISOString().split('T')[0]);
  const [tag, setTag] = useState(initialData?.tag ?? TAGS[0]);
  const [readTime, setReadTime] = useState(initialData?.readTime ?? '5 min');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '');
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? '');
  const [keywords, setKeywords] = useState(initialData?.keywords ?? '');
  // true = field is auto-managed, false = user manually edited it
  const [metaTitleAuto, setMetaTitleAuto] = useState(!initialData?.metaTitle);
  const [metaDescAuto, setMetaDescAuto] = useState(!initialData?.metaDescription);
  const [image, setImage] = useState(initialData?.image ?? '');
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery ?? []);
  const [galleryOpen, setGalleryOpen] = useState(true);
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [content, setContent] = useState(initialData?.content ?? '');
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentImgInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = useCallback((before: string, after = '', placeholder = '') => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = content.slice(start, end) || placeholder;
    const next = content.slice(0, start) + before + sel + after + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + sel.length);
    });
  }, [content]);

  const insertLinePrefix = useCallback((prefix: string) => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const next = content.slice(0, lineStart) + prefix + content.slice(lineStart);
    setContent(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  }, [content]);

  // Auto-slug from title (new mode only)
  useEffect(() => {
    if (mode === 'new') {
      setSlug(generateSlug(title));
    }
  }, [title, mode]);

  // Auto readTime from content
  useEffect(() => {
    setReadTime(calcReadTime(content));
  }, [content]);

  // Auto meta title from article title
  useEffect(() => {
    if (!metaTitleAuto || !title) return;
    const auto = `${title} | KisielFinanse`;
    setMetaTitle(auto.length <= 60 ? auto : title.slice(0, 57) + '...');
  }, [title, metaTitleAuto]);

  // Auto meta description from excerpt
  useEffect(() => {
    if (!metaDescAuto || !excerpt) return;
    setMetaDescription(excerpt.slice(0, 160));
  }, [excerpt, metaDescAuto]);

  // Preview render
  useEffect(() => {
    if (!content.trim()) {
      setPreview('');
      return;
    }
    const result = marked(content);
    if (typeof result === 'string') {
      setPreview(result);
    } else {
      result.then(setPreview);
    }
  }, [content]);

  const handleSave = useCallback(async () => {
    setSaveError('');
    setSaving(true);

    const keywordsArray = keywords
      ? keywords.split(',').map((k) => k.trim()).filter(Boolean)
      : [];

    const payload = {
      slug,
      title,
      excerpt,
      date,
      tag,
      readTime,
      published,
      content,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      author: author || undefined,
      image: image || undefined,
      gallery: gallery.filter(Boolean).length ? gallery.filter(Boolean) : undefined,
      keywords: keywordsArray.length ? keywordsArray : undefined,
    };

    try {
      const url = mode === 'new' ? '/api/admin/posts' : `/api/admin/posts/${slug}`;
      const method = mode === 'new' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/kf-7q3x-cms/dashboard");
      } else {
        const data = await res.json();
        setSaveError(data.error ?? 'Błąd zapisu');
      }
    } catch {
      setSaveError('Błąd połączenia z serwerem');
    } finally {
      setSaving(false);
    }
  }, [
    slug, title, excerpt, date, tag, readTime, published, content,
    metaTitle, metaDescription, author, image, gallery, keywords, mode, router,
  ]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setImage(data.url);
      } else {
        alert('Błąd przesyłania zdjęcia');
      }
    } catch {
      alert('Błąd połączenia przy przesyłaniu');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingContentImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (slug) formData.append('slug', slug);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        insertAtCursor(`\n![](${data.url})\n`);
      } else {
        alert('Błąd przesyłania zdjęcia do treści');
      }
    } catch {
      alert('Błąd połączenia przy przesyłaniu');
    } finally {
      setUploadingContentImage(false);
      if (contentImgInputRef.current) contentImgInputRef.current.value = '';
    }
  };

  const btnBase: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '2px',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 18px',
    transition: 'all 0.15s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#030508' }}>
      {/* ── Sticky top bar ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(8,13,20,0.97)',
          borderBottom: '1px solid rgba(0,245,212,0.12)',
          backdropFilter: 'blur(12px)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => router.push("/kf-7q3x-cms/dashboard")}
            style={{
              ...btnBase,
              background: 'transparent',
              color: '#5a6478',
              border: '1px solid rgba(90,100,120,0.2)',
              padding: '6px 14px',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#e8edf5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#5a6478'; }}
          >
            ← DASHBOARD
          </button>
          <span
            style={{
              fontSize: '0.65rem',
              letterSpacing: '2px',
              color: '#5a6478',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            // {mode === 'new' ? 'NOWY ARTYKUŁ' : `EDYCJA: ${initialData?.slug ?? slug}`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Status badge */}
          {(() => {
            const isScheduled = published && date && new Date(date) > new Date();
            return (
              <span
                style={{
                  fontSize: '0.58rem',
                  letterSpacing: '1.5px',
                  padding: '4px 10px',
                  fontFamily: "'JetBrains Mono', monospace",
                  background: isScheduled
                    ? 'rgba(245,197,24,0.1)'
                    : published
                      ? 'rgba(0,245,212,0.1)'
                      : 'rgba(90,100,120,0.15)',
                  color: isScheduled ? '#f5c518' : published ? '#00f5d4' : '#5a6478',
                  border: `1px solid ${isScheduled ? 'rgba(245,197,24,0.25)' : published ? 'rgba(0,245,212,0.2)' : 'rgba(90,100,120,0.2)'}`,
                }}
              >
                {isScheduled ? `📅 ${new Date(date).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' })}` : published ? 'LIVE' : 'SZKIC'}
              </span>
            );
          })()}

          {saveError && (
            <span
              style={{
                fontSize: '0.65rem',
                color: '#ff2d78',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {saveError}
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              ...btnBase,
              background: saving ? 'rgba(0,245,212,0.1)' : '#00f5d4',
              color: saving ? '#00f5d4' : '#030508',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!saving) e.currentTarget.style.background = 'rgba(0,245,212,0.85)';
            }}
            onMouseLeave={(e) => {
              if (!saving) e.currentTarget.style.background = '#00f5d4';
            }}
          >
            {saving ? '// ZAPISYWANIE...' : 'ZAPISZ →'}
          </button>
        </div>
      </div>

      {/* ── Main split layout ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEFT — Form */}
        <div
          style={{
            width: '50%',
            borderRight: '1px solid rgba(0,245,212,0.08)',
            overflowY: 'auto',
            padding: '28px 28px',
          }}
        >
          {/* Section: PODSTAWOWE */}
          <div style={{ marginBottom: '32px' }}>
            <div style={sectionHeaderStyle}>// PODSTAWOWE</div>

            <InputField label="TYTUŁ" value={title} onChange={setTitle} placeholder="Tytuł artykułu" />
            <InputField
              label="SLUG (URL)"
              value={slug}
              onChange={mode === 'edit' ? undefined : setSlug}
              readOnly={mode === 'edit'}
              placeholder="slug-artykulu"
            />
            <InputField label="AUTOR" value={author} onChange={setAuthor} placeholder="KISIEL" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <InputField label="DATA PUBLIKACJI" value={date} onChange={setDate} type="date" />
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>KATEGORIA</label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                    appearance: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.4)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.1)'; }}
                >
                  {TAGS.map((t) => (
                    <option key={t} value={t} style={{ background: '#0d1520' }}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <InputField
              label="CZAS CZYTANIA (AUTO)"
              value={readTime}
              readOnly
            />
          </div>

          {/* Section: SEO */}
          <div style={{ marginBottom: '32px' }}>
            <div style={sectionHeaderStyle}>// SEO</div>

            <TextareaField
              label="EXCERPT (OPIS SKRÓCONY)"
              value={excerpt}
              onChange={setExcerpt}
              rows={3}
              placeholder="Krótki opis artykułu widoczny na liście bloga..."
            />

            {/* Meta title + counter + auto badge */}
            <div style={fieldGroupStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={labelStyle}>META TYTUŁ</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {metaTitleAuto && (
                    <span style={{ fontSize: '0.55rem', background: 'rgba(0,245,212,0.12)', color: '#00f5d4', padding: '2px 7px', borderRadius: 10, fontFamily: 'system-ui', letterSpacing: 1 }}>AUTO</span>
                  )}
                  <span style={{ fontSize: '0.6rem', fontFamily: 'system-ui', color: metaTitle.length <= 55 ? '#10b981' : metaTitle.length <= 60 ? '#f59e0b' : '#ff2d78' }}>
                    {metaTitle.length}/60
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => { setMetaTitleAuto(false); setMetaTitle(e.target.value); }}
                placeholder="Generuje się automatycznie z tytułu artykułu..."
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.4)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.1)'; }}
              />
              <SeoBar value={metaTitle.length} max={60} thresholds={[55, 60]} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: '0.6rem', color: '#5a6478', fontFamily: 'system-ui' }}>Google wyświetla ok. 60 znaków</span>
                {!metaTitleAuto && (
                  <button onClick={() => setMetaTitleAuto(true)} style={{ fontSize: '0.6rem', color: '#00f5d4', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui', padding: 0 }}>
                    ↺ Przywróć auto
                  </button>
                )}
              </div>
            </div>

            {/* Meta description + counter + auto badge */}
            <div style={fieldGroupStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={labelStyle}>META OPIS</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {metaDescAuto && (
                    <span style={{ fontSize: '0.55rem', background: 'rgba(0,245,212,0.12)', color: '#00f5d4', padding: '2px 7px', borderRadius: 10, fontFamily: 'system-ui', letterSpacing: 1 }}>AUTO</span>
                  )}
                  <span style={{ fontSize: '0.6rem', fontFamily: 'system-ui', color: metaDescription.length <= 140 ? '#10b981' : metaDescription.length <= 160 ? '#f59e0b' : '#ff2d78' }}>
                    {metaDescription.length}/160
                  </span>
                </div>
              </div>
              <textarea
                value={metaDescription}
                onChange={(e) => { setMetaDescAuto(false); setMetaDescription(e.target.value); }}
                rows={3}
                placeholder="Generuje się automatycznie z excerpta artykułu..."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.4)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.1)'; }}
              />
              <SeoBar value={metaDescription.length} max={160} thresholds={[140, 160]} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: '0.6rem', color: '#5a6478', fontFamily: 'system-ui' }}>Najlepiej 140-155 znaków</span>
                {!metaDescAuto && (
                  <button onClick={() => setMetaDescAuto(true)} style={{ fontSize: '0.6rem', color: '#00f5d4', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui', padding: 0 }}>
                    ↺ Przywróć auto
                  </button>
                )}
              </div>
            </div>

            <InputField
              label="SŁOWA KLUCZOWE (ODDZIELONE PRZECINKAMI)"
              value={keywords}
              onChange={setKeywords}
              placeholder="trading, forex, strategia..."
            />
          </div>

          {/* Section: ZDJĘCIA */}
          <div style={{ marginBottom: '32px' }}>
            {/* Collapsible card header */}
            <button
              onClick={() => setGalleryOpen((o) => !o)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#0d1520', border: '1px solid rgba(0,245,212,0.12)',
                borderRadius: galleryOpen ? '10px 10px 0 0' : '10px',
                padding: '14px 18px', cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem',
                color: '#e8edf5', fontWeight: 600,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1rem' }}>🖼</span>
                <span>Zdjęcia</span>
              </div>
              <span style={{ color: '#5a6478', fontSize: '0.75rem', transform: galleryOpen ? 'rotate(0)' : 'rotate(180deg)', transition: 'transform 0.2s' }}>∧</span>
            </button>

            {galleryOpen && (
              <div style={{
                background: '#0d1520', border: '1px solid rgba(0,245,212,0.12)',
                borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '20px 18px',
              }}>
                {/* Cover image */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#e8edf5', marginBottom: 8 }}>
                    Główne zdjęcie (cover)
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/cover.jpg"
                      style={{
                        ...inputStyle, flex: 1,
                        borderRadius: 8, background: '#131929',
                        border: '1px solid rgba(255,255,255,0.08)',
                        fontFamily: 'system-ui, sans-serif',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.4)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      style={{
                        padding: '10px 14px', borderRadius: 8, cursor: uploadingImage ? 'not-allowed' : 'pointer',
                        border: '1px solid rgba(0,245,212,0.25)', color: uploadingImage ? '#5a6478' : '#00f5d4',
                        background: 'rgba(0,245,212,0.04)', fontFamily: 'system-ui, sans-serif',
                        fontSize: '0.75rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center',
                      }}
                    >
                      {uploadingImage ? '...' : '↑ Prześlij'}
                    </label>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#5a6478', fontFamily: 'system-ui, sans-serif' }}>
                    Zdjęcie hero artykułu - wyświetla się na górze artykułu i w kartach na stronie głównej
                  </div>

                  {/* Cover preview */}
                  {image && (
                    <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt="Cover"
                        style={{
                          height: 80, width: 'auto', maxWidth: '100%',
                          objectFit: 'cover', borderRadius: 6,
                          border: '1px solid rgba(0,245,212,0.15)',
                        }}
                      />
                      <button
                        onClick={() => setImage('')}
                        style={{
                          position: 'absolute', top: -6, right: -6,
                          width: 20, height: 20, borderRadius: '50%',
                          background: '#ff2d78', border: 'none', color: '#fff',
                          fontSize: '0.65rem', cursor: 'pointer', lineHeight: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >×</button>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0 18px' }} />

                {/* Gallery */}
                <div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#e8edf5', marginBottom: 12 }}>
                    Dodatkowe zdjęcia (galeria)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {gallery.map((url, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: '#5a6478', width: 18, flexShrink: 0, textAlign: 'right' }}>
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => {
                            const next = [...gallery];
                            next[idx] = e.target.value;
                            setGallery(next);
                          }}
                          placeholder={`https://example.com/image-${idx + 1}.jpg`}
                          style={{
                            ...inputStyle, flex: 1, borderRadius: 8,
                            background: '#131929', border: '1px solid rgba(255,255,255,0.08)',
                            fontFamily: 'system-ui, sans-serif',
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.4)'; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                        />
                        <button
                          onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                          style={{
                            background: 'transparent', border: 'none', color: '#5a6478',
                            cursor: 'pointer', fontSize: '1rem', padding: '4px 6px', lineHeight: 1,
                          }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setGallery([...gallery, ''])}
                    style={{
                      marginTop: 12, background: 'transparent', border: 'none',
                      color: '#5a6478', fontFamily: 'system-ui, sans-serif',
                      fontSize: '0.78rem', cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#e8edf5'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5a6478'; }}
                  >
                    <span style={{ fontSize: '1rem' }}>+</span> Dodaj kolejne zdjęcie
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section: PUBLIKACJA */}
          <div style={{ marginBottom: '32px' }}>
            <div style={sectionHeaderStyle}>// PUBLIKACJA</div>

            {/* Scheduled info box */}
            {(() => {
              const isScheduled = published && date && new Date(date) > new Date();
              const isPast = published && date && new Date(date) <= new Date();
              if (isScheduled) {
                return (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '14px 16px', marginBottom: 12,
                    background: 'rgba(245,197,24,0.06)',
                    border: '1px solid rgba(245,197,24,0.2)',
                    borderRadius: 8,
                  }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>📅</span>
                    <div>
                      <div style={{ fontFamily: 'system-ui', fontSize: '0.8rem', fontWeight: 600, color: '#f5c518', marginBottom: 3 }}>
                        Zaplanowany — opublikuje się automatycznie
                      </div>
                      <div style={{ fontFamily: 'system-ui', fontSize: '0.72rem', color: '#a89030' }}>
                        {new Date(date).toLocaleDateString('pl-PL', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                );
              }
              if (isPast) {
                return (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', marginBottom: 12,
                    background: 'rgba(0,245,212,0.05)',
                    border: '1px solid rgba(0,245,212,0.15)',
                    borderRadius: 8,
                  }}>
                    <span style={{ fontSize: '0.9rem' }}>🟢</span>
                    <span style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: '#00f5d4' }}>
                      Artykuł jest widoczny publicznie od {new Date(date).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                );
              }
              return null;
            })()}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px',
                background: published ? 'rgba(0,245,212,0.04)' : 'rgba(90,100,120,0.05)',
                border: `1px solid ${published ? 'rgba(0,245,212,0.12)' : 'rgba(90,100,120,0.15)'}`,
                borderRadius: 8,
              }}
            >
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#00f5d4' }}
              />
              <div>
                <label
                  htmlFor="published"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.72rem',
                    color: published ? '#00f5d4' : '#5a6478',
                    cursor: 'pointer',
                    letterSpacing: '1px',
                    display: 'block',
                  }}
                >
                  {published
                    ? '// ARTYKUŁ WIDOCZNY PUBLICZNIE'
                    : '// SZKIC — NIEWIDOCZNY DLA CZYTELNIKÓW'}
                </label>
                {!published && (
                  <div style={{ fontFamily: 'system-ui', fontSize: '0.65rem', color: '#3a4258', marginTop: 3 }}>
                    Zaznacz + ustaw datę powyżej aby zaplanować publikację
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: TREŚĆ */}
          <div style={{ marginBottom: '32px' }}>
            <div style={sectionHeaderStyle}>// TREŚĆ (MARKDOWN)</div>

            {/* Markdown Toolbar */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center',
              padding: '8px 10px',
              background: '#0a0f1c',
              border: '1px solid rgba(0,245,212,0.1)',
              borderBottom: '1px solid rgba(0,245,212,0.06)',
              borderRadius: '6px 6px 0 0',
            }}>
              {/* H1 info chip */}
              <span title="Tytuł artykułu jest automatycznie oznaczony jako H1 — nie dodawaj H1 w treści" style={{
                fontSize: '0.6rem', padding: '3px 8px', borderRadius: 4,
                background: 'rgba(0,245,212,0.08)', color: '#00f5d4',
                fontFamily: "'JetBrains Mono', monospace", cursor: 'default',
                border: '1px solid rgba(0,245,212,0.15)',
              }}>
                H1 = tytuł ✓
              </span>
              <TbSep />
              {/* Headings */}
              {([
                { l: 'H2', title: 'Nagłówek H2 — główna sekcja artykułu (## )', fn: () => insertLinePrefix('## ') },
                { l: 'H3', title: 'Nagłówek H3 — podsekcja (### )', fn: () => insertLinePrefix('### ') },
                { l: 'H4', title: 'Nagłówek H4 — szczegółowy punkt (#### )', fn: () => insertLinePrefix('#### ') },
              ] as const).map(b => (
                <button key={b.l} title={b.title} onClick={b.fn} style={tbBtn}>{b.l}</button>
              ))}
              <TbSep />
              {/* Inline formatting */}
              <button title="Pogrubienie (Ctrl+B)" onClick={() => insertAtCursor('**', '**', 'pogrubiony tekst')} style={{ ...tbBtn, fontWeight: 700 }}>B</button>
              <button title="Kursywa (Ctrl+I)" onClick={() => insertAtCursor('*', '*', 'kursywa')} style={{ ...tbBtn, fontStyle: 'italic' }}>I</button>
              <button title="Przekreślenie" onClick={() => insertAtCursor('~~', '~~', 'tekst')} style={{ ...tbBtn, textDecoration: 'line-through' }}>S</button>
              <TbSep />
              {/* Links & code */}
              <button title="Link" onClick={() => insertAtCursor('[', '](url)', 'tekst linku')} style={tbBtn}>🔗</button>
              <button title="Kod inline" onClick={() => insertAtCursor('`', '`', 'kod')} style={tbBtn}>`</button>
              <button title="Blok kodu" onClick={() => insertAtCursor('\n```\n', '\n```\n', 'kod')} style={tbBtn}>{'<>'}</button>
              <TbSep />
              {/* Block elements */}
              <button title="Cytat (blockquote)" onClick={() => insertLinePrefix('> ')} style={tbBtn}>"</button>
              <button title="Lista punktowana" onClick={() => insertLinePrefix('- ')} style={tbBtn}>•</button>
              <button title="Lista numerowana" onClick={() => insertLinePrefix('1. ')} style={tbBtn}>1.</button>
              <button title="Linia pozioma (separator)" onClick={() => insertAtCursor('\n\n---\n\n')} style={tbBtn}>—</button>
              <TbSep />
              {/* Content image upload */}
              <input
                ref={contentImgInputRef}
                type="file"
                accept="image/*"
                onChange={handleContentImageUpload}
                style={{ display: 'none' }}
                id="content-image-upload"
              />
              <button
                title="Wstaw zdjęcie w miejscu kursora"
                disabled={uploadingContentImage}
                onClick={() => contentImgInputRef.current?.click()}
                style={{
                  ...tbBtn,
                  color: uploadingContentImage ? '#5a6478' : '#00f5d4',
                  borderColor: uploadingContentImage ? 'rgba(255,255,255,0.07)' : 'rgba(0,245,212,0.25)',
                  background: uploadingContentImage ? 'transparent' : 'rgba(0,245,212,0.04)',
                  cursor: uploadingContentImage ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                {uploadingContentImage ? '...' : '🖼 Wstaw'}
              </button>
            </div>

            {/* Content textarea */}
            <div style={fieldGroupStyle}>
              <label style={{ ...labelStyle, marginTop: 0 }}>ZAWARTOŚĆ ARTYKUŁU</label>
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={24}
                placeholder={'# Tytuł sekcji\n\nZacznij pisać treść artykułu...\n\n## Podsekcja\n\n**Pogrubiony tekst**, *kursywa*, `kod inline`'}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '500px',
                  lineHeight: '1.7',
                  borderRadius: '0 0 6px 6px',
                  borderTop: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.4)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.1)'; }}
              />
            </div>

            <div style={{ fontSize: '0.58rem', color: '#5a6478', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1px', marginTop: '4px' }}>
              // {content.trim().split(/\s+/).filter(Boolean).length} słów · {readTime} czytania
            </div>
          </div>
        </div>

        {/* RIGHT — Preview */}
        <div
          style={{
            width: '50%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Preview header */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              background: 'rgba(8,13,20,0.97)',
              borderBottom: '1px solid rgba(0,245,212,0.08)',
              padding: '14px 28px',
              zIndex: 10,
            }}
          >
            <span style={{ ...sectionHeaderStyle, marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
              // PODGLĄD
            </span>
          </div>

          <div style={{ padding: '28px 28px', flex: 1 }}>
            {/* SERP Preview */}
            <SerpPreview
              title={title}
              slug={slug}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
            />

            {/* SEO Checklist */}
            <SeoChecklist
              title={title}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              keywords={keywords}
              image={image}
              excerpt={excerpt}
              content={content}
            />

            {/* Image preview */}
            {image && (
              <div style={{ marginBottom: '24px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={title}
                  style={{
                    width: '100%',
                    maxHeight: '220px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            )}

            {/* Title preview */}
            {title && (
              <div
                style={{
                  fontSize: '1.4rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#e8edf5',
                  marginBottom: '8px',
                  lineHeight: '1.3',
                  fontWeight: 500,
                }}
              >
                {title}
              </div>
            )}

            {/* Meta bar */}
            {(date || tag || readTime) && (
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '24px',
                  fontSize: '0.65rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#5a6478',
                  flexWrap: 'wrap',
                }}
              >
                {date && <span>{new Date(date).toLocaleDateString('pl-PL')}</span>}
                {tag && <span style={{ color: '#00f5d4' }}>{tag}</span>}
                {readTime && <span>{readTime}</span>}
              </div>
            )}

            {/* Separator */}
            {(title || date) && (
              <div
                style={{
                  height: '1px',
                  background: 'rgba(0,245,212,0.1)',
                  marginBottom: '24px',
                }}
              />
            )}

            {/* Content preview */}
            {preview ? (
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: preview }}
                style={{
                  color: '#e8edf5',
                  lineHeight: '1.8',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.85rem',
                }}
              />
            ) : (
              <div
                style={{
                  color: '#5a6478',
                  fontSize: '0.72rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '1px',
                  textAlign: 'center',
                  marginTop: '60px',
                }}
              >
                // Zacznij pisać...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
