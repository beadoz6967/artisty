'use client';

// Reusable viewport-triggered reveal wrapper powered by Framer Motion.
import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ComponentType, ReactNode } from 'react';

type RevealElement = keyof HTMLElementTagNameMap;

type ScrollRevealProps = {
  children: ReactNode;
  as?: RevealElement;
  className?: string;
  style?: CSSProperties;
  duration?: number;
  distance?: number;
  delay?: number;
  maxDelay?: number;
  once?: boolean;
  amount?: number;
  margin?: string;
  shadow?: boolean;
  shadowStrength?: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function ScrollReveal({
  children,
  as = 'div',
  className,
  style,
  duration = 0.32,
  distance = 18,
  delay = 0,
  maxDelay = 0.2,
  once = true,
  amount = 0.12,
  margin = '0px 0px 20% 0px',
  shadow,
  shadowStrength = 0.14,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = (motion as unknown as Record<string, ComponentType<any>>)[as] ?? motion.div;
  const effectiveDelay = Math.min(delay, maxDelay);
  const autoShadow = className?.includes('smoke-panel') || className?.includes('smoke-frame');
  const withShadow = shadow ?? autoShadow;
  const mergedStyle: CSSProperties = withShadow
    ? {
        ...style,
        boxShadow: style?.boxShadow
          ? `${style.boxShadow}, 0 8px 18px rgba(0,0,0,${shadowStrength})`
          : `0 8px 18px rgba(0,0,0,${shadowStrength})`,
      }
    : { ...(style ?? {}) };

  if (prefersReducedMotion) {
    return (
      <MotionTag className={className} style={mergedStyle}>
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      style={mergedStyle}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin }}
      transition={{ duration, delay: effectiveDelay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
