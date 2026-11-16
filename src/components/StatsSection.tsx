import React, { useEffect, useRef, useState } from 'react';

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

const stats: StatItem[] = [
  { value: '50', label: 'Projects Delivered', suffix: '+' },
  { value: '100', label: 'Quality Focus', suffix: '%' },
  { value: '10', label: 'Years Experience', suffix: '+' },
  { value: '100', label: 'End-to-End Execution', suffix: '%' },
];

function AnimatedNumber({ target, suffix, isActive }: { target: number; suffix: string; isActive: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    let start = 0;
    const duration = 1800;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, isActive]);

  return <>{count}{suffix}</>;
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        backgroundColor: '#1c1a18',
        padding: '6rem 0',
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23bfa15f' fill-opacity='0.04'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
        {/* Heading */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '4.5rem',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s, transform 0.8s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '1rem' }}>
            <div style={{ width: '30px', height: '1px', backgroundColor: '#bfa15f' }} />
            <span
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.3em',
                color: '#bfa15f',
                textTransform: 'uppercase',
              }}
            >
              BY THE NUMBERS
            </span>
            <div style={{ width: '30px', height: '1px', backgroundColor: '#bfa15f' }} />
          </div>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 300,
              color: 'white',
              lineHeight: 1.1,
            }}
          >
            Our Impact in Punjab
          </h2>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
          }}
          className="stats-grid"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                borderRight: i < stats.length - 1 ? '1px solid rgba(196,181,158,0.15)' : 'none',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.8s ${0.1 + i * 0.1}s, transform 0.8s ${0.1 + i * 0.1}s`,
              }}
            >
              <div
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(3.5rem, 6vw, 6rem)',
                  fontWeight: 300,
                  color: '#bfa15f',
                  lineHeight: 1,
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.02em',
                }}
              >
                <AnimatedNumber target={parseInt(stat.value)} suffix={stat.suffix || ''} isActive={visible} />
              </div>
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  color: 'rgba(232, 220, 200, 0.6)',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom label */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '4rem',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s 0.6s',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              border: '1px solid rgba(191, 161, 95, 0.3)',
              borderRadius: '4px',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#bfa15f' }} />
            <span
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                color: 'rgba(232, 220, 200, 0.6)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Punjab Based · Established 2014
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stats-grid > *:nth-child(2) { border-right: none !important; }
          .stats-grid > *:nth-child(1),
          .stats-grid > *:nth-child(2) {
            border-bottom: 1px solid rgba(196,181,158,0.15);
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-grid > * { border-right: none !important; border-bottom: 1px solid rgba(196,181,158,0.15) !important; }
          .stats-grid > *:last-child { border-bottom: none !important; }
        }
      `}</style>
    </section>
  );
}
