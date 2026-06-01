'use client';

import { useEffect, useRef } from 'react';

export default function RevealOnScroll() {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Bez tej klasy .reveal jest widoczny — Googlebot i uzytkownicy bez JS widza tresc
    document.documentElement.classList.add('js-ready');

    const reveal = (el: Element) => {
      el.classList.add('visible');
      el.querySelectorAll('[data-stagger]').forEach((child, i) => {
        (child as HTMLElement).style.transitionDelay = `${i * 80}ms`;
        child.classList.add('visible');
      });
    };

    const targets = Array.from(
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-wrap')
    );

    // Wszystko co jest w poczatkowym widoku (lub powyzej) odslon od razu —
    // Googlebot renderuje przy bardzo wysokim viewporcie i nie przewija, wiec
    // bez tego robi screenshot pustej strony zanim observer zdazy zadzialac.
    const vh = window.innerHeight || 800;
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 1.2) {
        // Bez animacji — od razu pelna widocznosc (bot nie zlapie klatki w trakcie fade)
        (el as HTMLElement).style.transition = 'none';
        reveal(el);
        // Przywroc animacje dla pozostalych interakcji
        requestAnimationFrame(() => ((el as HTMLElement).style.transition = ''));
      }
    });

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => {
      if (!el.classList.contains('visible')) observer.current?.observe(el);
    });

    // Bezpiecznik: gdyby observer nie zadzialal (boty, brak scrolla), odslon
    // wszystko po chwili — zaden element nie zostanie ukryty na stale.
    const fallback = window.setTimeout(() => targets.forEach(reveal), 1200);

    return () => {
      observer.current?.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
