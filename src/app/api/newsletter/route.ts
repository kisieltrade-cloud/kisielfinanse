import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { addSubscriber, isSubscribed } from '@/lib/redis';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Mateusz z KisielFinanse <newsletter@kisielfinanse.pl>';

const EBOOK_URL = 'https://kisielfinanse.pl/ebook/finansowy-fundament-2026.pdf';
const JOURNAL_URL = 'https://kisielfinanse.pl/pliki/dziennik-transakcji-kisielfinanse.xlsx';

// Wersja tekstowa (poprawia dostarczalność — maile tylko-HTML częściej trafiają do spamu).
const WELCOME_TEXT = `Twój przewodnik jest gotowy.

Dzięki, że jesteś. Pobierz "Finansowy Fundament" - przewodnik, który układa Twoje pieniądze w 7 krokach: od bilansu, przez poduszkę i konto, po pierwsze inwestycje.

Pobierz przewodnik (PDF): ${EBOOK_URL}

Bonus dla traderów: gotowy dziennik transakcji w Excelu (sam liczy winrate, R i wynik):
${JOURNAL_URL}

Piszę, kiedy mam coś wartego wysłania. Bez planu wysyłkowego i bez spamu.

KisielFinanse · kisielfinanse.pl
Materiał edukacyjny, nie stanowi porady inwestycyjnej. Możesz zrezygnować odpowiadając na tego maila.`;

const WELCOME_HTML = `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <p style="font-size:11px;letter-spacing:2px;color:#c9a227;text-transform:uppercase;margin:0 0 32px;">KISIELFINANSE.PL</p>

    <h1 style="font-size:28px;font-weight:700;color:#e8eaf6;margin:0 0 16px;line-height:1.3;">
      Twój przewodnik jest gotowy.
    </h1>

    <p style="font-size:15px;color:#c8d0dc;line-height:1.7;margin:0 0 28px;">
      Dzięki, że jesteś. Poniżej pobierzesz <strong style="color:#e8eaf6;">Finansowy Fundament</strong> &mdash;
      przewodnik, który układa Twoje pieniądze w 7 krokach: od bilansu, przez poduszkę i konto, po pierwsze inwestycje.
    </p>

    <a href="${EBOOK_URL}"
       style="display:inline-block;background:#c9a227;color:#0a0e1a;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
      Pobierz przewodnik (PDF)
    </a>

    <p style="font-size:13px;color:#8b94a6;line-height:1.7;margin:28px 0 0;">
      Gdyby przycisk nie działał, skopiuj link:<br>
      <a href="${EBOOK_URL}" style="color:#c9a227;word-break:break-all;">${EBOOK_URL}</a>
    </p>

    <hr style="border:none;border-top:1px solid #1e2535;margin:36px 0;">

    <p style="font-size:13px;letter-spacing:1px;color:#c9a227;text-transform:uppercase;margin:0 0 10px;font-weight:700;">Bonus dla traderów</p>
    <p style="font-size:15px;color:#c8d0dc;line-height:1.7;margin:0 0 16px;">
      Prowadzisz albo zaczynasz trading? Pobierz gotowy <strong style="color:#e8eaf6;">dziennik transakcji</strong> w Excelu.
      Sam liczy winrate, wynik w R i krzywą kapitału.
    </p>
    <a href="${JOURNAL_URL}"
       style="display:inline-block;border:1px solid #2a3346;color:#c8d0dc;text-decoration:none;padding:11px 26px;border-radius:6px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
      Pobierz dziennik (Excel)
    </a>

    <hr style="border:none;border-top:1px solid #1e2535;margin:36px 0;">

    <p style="font-size:15px;color:#c8d0dc;line-height:1.7;margin:0 0 20px;">
      Co dalej? Piszę, kiedy mam coś wartego wysłania. Bez planu wysyłkowego i bez spamu.
    </p>
    <a href="https://kisielfinanse.pl/blog"
       style="display:inline-block;border:1px solid #2a3346;color:#c8d0dc;text-decoration:none;padding:11px 26px;border-radius:6px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
      Przejdź do artykułów
    </a>

    <hr style="border:none;border-top:1px solid #1e2535;margin:40px 0;">
    <p style="font-size:11px;color:#3a4258;margin:0;">
      KisielFinanse · kisielfinanse.pl<br>
      Materiał edukacyjny, nie stanowi porady inwestycyjnej. Możesz zrezygnować odpowiadając na tego maila.
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

    // Wyslij maila powitalnego — best-effort, nie blokuje zapisu.
    // UWAGA: Resend NIE rzuca wyjatku przy bledzie API — zwraca { data, error }.
    // Trzeba sprawdzic `error`, inaczej blad jest polkniety (np. niezweryfikowana domena).
    if (process.env.RESEND_API_KEY) {
      resend.emails.send({
        from: FROM,
        to: normalised,
        subject: 'Twój przewodnik: Finansowy Fundament (KisielFinanse)',
        html: WELCOME_HTML,
        text: WELCOME_TEXT,
        replyTo: 'kisieltrade@gmail.com',
      }).then(({ data, error }) => {
        if (error) console.error('[newsletter] resend API error:', JSON.stringify(error));
        else console.log('[newsletter] wyslano, id:', data?.id, 'do:', normalised);
      }).catch(err => console.error('[newsletter] resend threw:', err));
    } else {
      console.error('[newsletter] BRAK RESEND_API_KEY w env — mail nie zostanie wyslany');
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[newsletter]', err);
    return NextResponse.json({ error: 'Coś poszło nie tak, spróbuj za chwilę.' }, { status: 500 });
  }
}
