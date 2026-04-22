// Client-side Lenis wrapper that enables smooth scrolling for selected page sections.
'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';

type Props = {
  children: ReactNode;
};

export function LenisProvider({ children }: Props) {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: false,
    });

    let frameId = 0;

    // Drive Lenis manually so we can stop its RAF loop on unmount.
    const runFrame = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(runFrame);
    };

    frameId = window.requestAnimationFrame(runFrame);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
