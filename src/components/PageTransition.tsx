import React, { useEffect, useRef, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [phase, setPhase] = useState<'enter' | 'visible'>('enter');

  useEffect(() => {
    // Double rAF ensures the initial state is painted before transition starts
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase('visible'))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      {/* Wipe overlay — slides out on enter */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#1a1714',
          zIndex: 99998,
          transformOrigin: 'right center',
          transform: phase === 'visible' ? 'scaleX(0)' : 'scaleX(1)',
          transition: 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* Content wrapper — fades + rises in */}
      <div
        style={{
          opacity: phase === 'visible' ? 1 : 0,
          transform: phase === 'visible' ? 'none' : 'translateY(16px)',
          transition:
            'opacity 0.7s 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.7s 0.35s cubic-bezier(0.16,1,0.3,1)',
          minHeight: '100vh',
        }}
        className="page-transition-wrapper"
      >
        {children}
      </div>
    </>
  );
}

/* ── Scroll Reveal hook ── */
export function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/* ── Count-up hook ── */
export function useCountUp(target: number, duration = 1800, isActive = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    let start = 0;
    const inc = target / (duration / 16);
    const t = setInterval(() => {
      start += inc;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration, isActive]);
  return count;
}
