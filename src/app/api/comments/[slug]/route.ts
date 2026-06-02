import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  addComment, getComments, commentAllowed,
  addSubscriber, isSubscribed,
  type StoredComment,
} from '@/lib/redis';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Mateusz | KisielFinanse <newsletter@kisielfinanse.pl>';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const comments = await getComments(slug);
    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const body = await req.json();
    const { name, email, text, newsletter, website } = body as {
      name?: string; email?: string; text?: string; newsletter?: boolean; website?: string;
    };

    // Honeypot — bot wypełnił ukryte pole. Udajemy sukces, nic nie zapisujemy.
    if (website) return NextResponse.json({ ok: true });

    const cleanName = (name ?? '').trim();
    const cleanText = (text ?? '').trim();
    const cleanEmail = (email ?? '').toLowerCase().trim();

    if (cleanName.length < 2 || cleanName.length > 60) {
      return NextResponse.json({ error: 'Podaj imię (2-60 znaków).' }, { status: 400 });
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      return NextResponse.json({ error: 'Podaj poprawny adres e-mail.' }, { status: 400 });
    }
    if (cleanText.length < 3 || cleanText.length > 2000) {
      return NextResponse.json({ error: 'Komentarz musi mieć od 3 do 2000 znaków.' }, { status: 400 });
    }

    const allowed = await commentAllowed(cleanEmail);
    if (!allowed) {
      return NextResponse.json({ error: 'Chwila, zwolnij. Spróbuj za moment.' }, { status: 429 });
    }

    const comment: StoredComment = {
      id: crypto.randomUUID(),
      name: cleanName.slice(0, 60),
      text: cleanText.slice(0, 2000),
      ts: Date.now(),
      email: cleanEmail,
    };
    await addComment(slug, comment);

    // Zapis na newsletter, jeśli zaznaczono i jeszcze nie zapisany
    if (newsletter && !(await isSubscribed(cleanEmail))) {
      await addSubscriber(cleanEmail);
      if (process.env.RESEND_API_KEY) {
        resend.emails.send({
          from: FROM,
          to: cleanEmail,
          subject: 'Witaj w newsletterze KisielFinanse',
          html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1e2535;">
            <p style="font-size:11px;letter-spacing:2px;color:#c9a227;text-transform:uppercase;">KISIELFINANSE.PL</p>
            <h1 style="font-size:24px;">Dzięki za komentarz i zapis!</h1>
            <p style="font-size:15px;line-height:1.7;color:#444;">Zapisałem Cię na newsletter. Piszę, kiedy mam coś wartościowego do powiedzenia, bez spamu.</p>
            <a href="https://kisielfinanse.pl/blog" style="display:inline-block;background:#c9a227;color:#fff;text-decoration:none;padding:12px 26px;border-radius:6px;font-weight:700;">Przejdź do artykułów</a>
          </div>`,
        }).catch((err) => console.error('[comments] resend error:', err));
      }
    }

    // Zwracamy publiczną wersję (bez e-maila)
    return NextResponse.json({
      ok: true,
      comment: { id: comment.id, name: comment.name, text: comment.text, ts: comment.ts },
      subscribed: !!newsletter,
    });
  } catch (err) {
    console.error('[comments]', err);
    return NextResponse.json({ error: 'Coś poszło nie tak, spróbuj za chwilę.' }, { status: 500 });
  }
}
