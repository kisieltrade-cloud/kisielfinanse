'use client';

import { useEffect, useRef } from 'react';

export default function RevealOnScroll() {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.current?.observe(el);
    });

    return () => observer.current?.disconnect();
  }, []);

  return null; // renders nothing, just sets up observer
}
