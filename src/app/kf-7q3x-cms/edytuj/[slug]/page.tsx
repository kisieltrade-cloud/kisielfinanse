'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default function EdytujPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/posts/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('Błąd połączenia'));
  }, [slug]);

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#030508', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff2d78', fontFamily: 'monospace' }}>
      Błąd: {error}
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: '100vh', background: '#030508', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6478', fontFamily: 'monospace' }}>
      Ładowanie...
    </div>
  );

  return (
    <ArticleEditor
      mode="edit"
      initialData={{
        slug: slug,
        title: (data.title as string) ?? '',
        excerpt: (data.excerpt as string) ?? '',
        date: (data.date as string) ?? '',
        tag: (data.tag as string) ?? '',
        readTime: (data.readTime as string) ?? '',
        published: (data.published as boolean) ?? false,
        content: (data.content as string) ?? '',
        metaTitle: (data.metaTitle as string) ?? '',
        metaDescription: (data.metaDescription as string) ?? '',
        author: (data.author as string) ?? '',
        image: (data.image as string) ?? '',
        gallery: (data.gallery as string[]) ?? [],
        keywords: Array.isArray(data.keywords) ? (data.keywords as string[]).join(', ') : ((data.keywords as string) ?? ''),
        faq: Array.isArray(data.faq) ? (data.faq as { q: string; a: string }[]) : [],
      }}
    />
  );
}
