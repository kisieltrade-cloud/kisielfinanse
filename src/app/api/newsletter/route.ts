import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { addSubscriber, isSubscribed } from '@/lib/redis';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Mateusz | KisielFinanse <newsletter@kisielfinanse.pl>';

const WELCOME_HTML = `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <p style="font-size:11px;letter-spacing:2px;color:#c9a227;text-transform:uppercase;margin:0 0 32px;">KISIELFINANSE.PL</p>

    <h1 style="font-size:28px;font-weight:700;color:#e8eaf6;margin:0 0 16px;line-height:1.3;">
      Witaj w newsletterze.
    </h1>

    <p style="font-size:15px;color:#8892a4;line-height:1.7;margin:0 0 24px;">
      Dostajesz ten mail bo zapisałeś się na kisielfinanse.pl.<br>
      Bez bullshitu, bez "gwarantowanych zysków". Praktyczna wiedza finansowa — kiedy mam coś wartego wysłania.
    </p>

    <p style="font-size:15px;color:#8892a4;line-height:1.7;margin:0 0 32px;">
      Co możesz spodziewać się w mailach:<br>
      — analizy rynkowe zanim temat stanie się oczywisty<br>
      — konkretne strategie i narzędzia które sam używam<br>
      — bez cotygodniowego "musisz wysłać coś" szumu
    </p>

    <a href="https://kisielfinanse.pl/blog"
       style="display:inline-block;background:#c9a227;color:#0a0e1a;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
      Przejdź do artykułów
    </a>

    <hr style="border:none;border-top:1px solid #1e2535;margin:40px 0;">
    <p style="font-size:11px;color:#3a4258;margin:0;">
      KisielFinanse · kisielfinanse.pl<br>
      Możesz zrezygnować odpowiadając na tego maila.
    </p>
  </div>
</body>
</html>
`;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Podaj poprawny adres email.' }, { status: 400 });
    }

    const normalised = email.toLowerCase().trim();

    // Sprawdz czy juz zapisany
    const exists = await isSubscribed(normalised);
    if (exists) {
      return NextResponse.json({ error: 'Ten adres jest już zapisany.' }, { status: 409 });
    }

    // Zapisz do Redis
    await addSubscriber(normalised);

    // Wyslij maila powitalnego
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: FROM,
        to: normalised,
        subject: 'Witaj w newsletterze KisielFinanse',
        html: WELCOME_HTML,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[newsletter]', err);
    return NextResponse.json({ error: 'Coś poszło nie tak, spróbuj za chwilę.' }, { status: 500 });
  }
}
