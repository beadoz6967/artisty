'use client';

import { useEffect } from 'react';

const REVEAL_SELECTOR = '.smoke-reveal, .smoke-reveal-plate';
const REVEAL_READY_CLASS = 'reveal-enabled';
const REVEAL_FAILSAFE_MS = 1400;

// Adds "is-visible" when reveal targets enter viewport.
export function ScrollRevealController() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    if (nodes.length === 0) return;

    const html = document.documentElement;

    const revealNode = (node: HTMLElement) => {
      node.classList.add('is-visible');
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      nodes.forEach(revealNode);
      return;
    }

    // Keep in-view blocks visible before enabling reveal-hiding rules.
    const viewportH = window.innerHeight;
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const isNearViewport = rect.top < viewportH * 1.08 && rect.bottom > -64;
      if (isNearViewport) revealNode(node);
    });

    html.classList.add(REVEAL_READY_CLASS);

    const failsafeId = window.setTimeout(() => {
      nodes.forEach(revealNode);
    }, REVEAL_FAILSAFE_MS);

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          revealNode(entry.target as HTMLElement);
          currentObserver.unobserve(entry.target);
        }
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px 14% 0px',
      }
    );

    nodes.forEach((node) => {
      if (!node.classList.contains('is-visible')) {
        observer.observe(node);
      }
    });

    return () => {
      window.clearTimeout(failsafeId);
      observer.disconnect();
      html.classList.remove(REVEAL_READY_CLASS);
    };
  }, []);

  return null;
}