'use client';

import { useEffect, useRef } from 'react';

export default function RevealOnScroll() {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Bez tej klasy .reveal jest widoczny — Googlebot i uzytkownicy bez JS widza tresc
    document.documentElement.classList.add('js-ready');

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stagger children with data-stagger attribute
            const children = entry.target.querySelectorAll('[data-stagger]');
            children.forEach((child, i) => {
              (child as HTMLElement).style.transitionDelay = `${i * 80}ms`;
              child.classList.add('visible');
            });
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-wrap').forEach((el) => {
      observer.current?.observe(el);
    });

    return () => observer.current?.disconnect();
  }, []);

  return null;
}
