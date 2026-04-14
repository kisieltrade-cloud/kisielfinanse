'use client';

import { useEffect } from 'react';

export default function BlogImageLightbox() {
  useEffect(() => {
    const content = document.querySelector('.blog-post-content');
    if (!content) return;

    const images = content.querySelectorAll('img');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'img-lightbox';
    overlay.innerHTML = `
      <button class="lightbox-close" aria-label="Zamknij">✕</button>
      <img class="lightbox-img" src="" alt="" />
    `;
    document.body.appendChild(overlay);

    const lightboxImg = overlay.querySelector('.lightbox-img') as HTMLImageElement;
    const closeBtn = overlay.querySelector('.lightbox-close') as HTMLButtonElement;

    const open = (src: string, alt: string) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    images.forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => open(img.src, img.alt));
    });

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
    };
  }, []);

  return null;
}
