import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects, type Project } from '../data/projects';

interface FeaturedProjectProps {
  onProjectClick: (project: Project) => void;
}

export default function FeaturedProject({ onProjectClick }: FeaturedProjectProps) {
  const featured = projects.find(p => p.featured) || projects[0];
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#1a1714',
        padding: '7rem 0',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '3rem',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s, transform 0.8s',
          }}
        >
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
            FEATURED PROJECT
          </span>
        </div>

        {/* Main layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
          }}
          className="featured-grid"
        >
          {/* Left — Image */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-60px)',
              transition: 'opacity 0.9s 0.1s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s 0.1s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
              <img
                src={featured.image}
                alt={featured.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                }}
              />
            </div>
            {/* Category badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.5rem',
                padding: '6px 14px',
                backgroundColor: '#bfa15f',
                borderRadius: '3px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: 'white',
                textTransform: 'uppercase',
              }}
            >
              {featured.category}
            </div>
          </div>

          {/* Right — Info */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(60px)',
              transition: 'opacity 0.9s 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2.5rem, 4vw, 3.8rem)',
                fontWeight: 300,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                letterSpacing: '-0.01em',
              }}
            >
              {featured.title}
            </h2>
            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.95rem',
                color: 'rgba(232, 220, 200, 0.7)',
                lineHeight: 1.75,
                marginBottom: '2.5rem',
              }}
            >
              {featured.longDescription}
            </p>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginBottom: '2.5rem', borderTop: '1px solid rgba(196,181,158,0.15)' }}>
              {[
                { label: 'Location', value: featured.location },
                { label: 'Project Type', value: featured.category },
                { label: 'Built Area', value: featured.area },
                { label: 'Status', value: featured.status },
              ].map((item, i) => (
                <div
                  key={item.label}
                  style={{
                    padding: '1.25rem 0',
                    borderBottom: '1px solid rgba(196,181,158,0.15)',
                    paddingRight: i % 2 === 0 ? '1.5rem' : 0,
                    paddingLeft: i % 2 === 1 ? '1.5rem' : 0,
                    borderRight: i % 2 === 0 ? '1px solid rgba(196,181,158,0.15)' : 'none',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      color: '#bfa15f',
                      textTransform: 'uppercase',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '1.25rem',
                      fontWeight: 400,
                      color: 'white',
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Scope */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  color: '#8a8278',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                SCOPE OF WORK
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {featured.scope.map(s => (
                  <span
                    key={s}
                    style={{
                      padding: '5px 12px',
                      border: '1px solid rgba(196,181,158,0.25)',
                      borderRadius: '3px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(232, 220, 200, 0.7)',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onProjectClick(featured)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                backgroundColor: '#bfa15f',
                color: 'white',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#9a7a38';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(191, 161, 95, 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#bfa15f';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              View Project <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .featured-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
