import type { Metadata } from 'next';
import QuizListClient from './QuizListClient';

const BASE_URL = 'https://kisielfinanse.pl';

export const metadata: Metadata = {
  title: { absolute: 'Quiz finansowy - sprawdź swoją wiedzę | KisielFinanse' },
  description:
    'Interaktywne quizy finansowe. Sprawdź jaki jesteś typem inwestora i przetestuj swoją wiedzę o finansach osobistych.',
  keywords: [
    'quiz finansowy', 'test inwestora', 'wiedza finansowa', 'typ inwestora',
    'quiz inwestycyjny', 'KisielFinanse quiz',
  ],
  alternates: { canonical: `${BASE_URL}/quiz` },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: `${BASE_URL}/quiz`,
    siteName: 'KisielFinanse',
    title: 'Quiz finansowy | KisielFinanse',
    description: 'Sprawdź jaki jesteś typem inwestora i przetestuj swoją wiedzę o finansach.',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Quiz finansowy KisielFinanse' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quiz finansowy | KisielFinanse',
    description: 'Sprawdź jaki jesteś typem inwestora i przetestuj swoją wiedzę.',
    images: [`${BASE_URL}/og-image.png`],
  },
};

export default function QuizPage() {
  return <QuizListClient />;
}
