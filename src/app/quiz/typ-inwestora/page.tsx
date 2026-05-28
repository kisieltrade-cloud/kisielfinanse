import type { Metadata } from 'next';
import QuizTypInwestoraClient from './QuizTypInwestoraClient';

const BASE_URL = 'https://kisielfinanse.pl';

export const metadata: Metadata = {
  title: { absolute: 'Jaki jesteś typem inwestora? Quiz | KisielFinanse' },
  description:
    'Agresywny trader, pasywny inwestor ETF czy konserwatywny oszczędzający? 7 pytań, które określą Twój profil inwestycyjny.',
  keywords: [
    'typ inwestora', 'quiz inwestycyjny', 'profil inwestora', 'agresywny inwestor',
    'pasywne inwestowanie', 'ETF inwestor', 'KisielFinanse quiz',
  ],
  alternates: { canonical: `${BASE_URL}/quiz/typ-inwestora` },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: `${BASE_URL}/quiz/typ-inwestora`,
    siteName: 'KisielFinanse',
    title: 'Jaki jesteś typem inwestora? | KisielFinanse',
    description: '7 pytań, które określą Twój profil inwestycyjny. Trader, inwestor ETF czy oszczędzający?',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Quiz typ inwestora KisielFinanse' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaki jesteś typem inwestora? | KisielFinanse',
    description: '7 pytań, które określą Twój profil inwestycyjny.',
    images: [`${BASE_URL}/og-image.png`],
  },
};

export default function QuizTypInwestoraPage() {
  return <QuizTypInwestoraClient />;
}
