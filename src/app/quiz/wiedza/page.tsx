import type { Metadata } from 'next';
import QuizWiedzaClient from './QuizWiedzaClient';

const BASE_URL = 'https://kisielfinanse.pl';

export const metadata: Metadata = {
  title: { absolute: 'Quiz z wiedzy finansowej - 10 pytań | KisielFinanse' },
  description:
    'Przetestuj swoją wiedzę o finansach osobistych. 10 pytań z odpowiedziami i wyjaśnieniami. Podatek Belki, IKZE, procent składany i więcej.',
  keywords: [
    'quiz wiedza finansowa', 'test finansowy', 'wiedza o inwestowaniu',
    'podatek Belki', 'finanse osobiste test', 'KisielFinanse quiz',
  ],
  alternates: { canonical: `${BASE_URL}/quiz/wiedza` },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: `${BASE_URL}/quiz/wiedza`,
    siteName: 'KisielFinanse',
    title: 'Quiz z wiedzy finansowej | KisielFinanse',
    description: '10 pytań z wyjaśnieniami. Sprawdź co wiesz o finansach osobistych.',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Quiz wiedza finansowa KisielFinanse' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quiz z wiedzy finansowej | KisielFinanse',
    description: '10 pytań. Sprawdź co wiesz o finansach osobistych.',
    images: [`${BASE_URL}/og-image.png`],
  },
};

export default function QuizWiedzaPage() {
  return <QuizWiedzaClient />;
}
