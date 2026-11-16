import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  const scrollToPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={heroRef}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '700px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Static Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'none',
        }}
      />

      {/* Layered dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,8,5,0.55) 0%, rgba(10,8,5,0.45) 50%, rgba(10,8,5,0.75) 100%)',
        }}
      />

      {/* Subtle texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.5,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 2rem', maxWidth: '900px' }}>
        {/* Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '2rem',
            animation: 'fadeDown 0.8s 0.2s both',
          }}
        >
          <div style={{ width: '40px', height: '1px', backgroundColor: '#bfa15f' }} />
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
            OUR PROJECTS
          </span>
          <div style={{ width: '40px', height: '1px', backgroundColor: '#bfa15f' }} />
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
            fontWeight: 300,
            color: 'white',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            marginBottom: '1.5rem',
            animation: 'fadeUp 0.9s 0.35s both',
          }}
        >
          Projects Built
          <br />
          <em style={{ fontStyle: 'italic', color: '#e8dcc8' }}>to Last.</em>
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            fontWeight: 400,
            color: 'rgba(232, 220, 200, 0.85)',
            maxWidth: '580px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
            animation: 'fadeUp 0.9s 0.5s both',
          }}
        >
          Explore our portfolio of premium homes, builder floors, commercial spaces, and architectural designs across Punjab.
        </p>

        {/* CTA */}
        <div style={{ animation: 'fadeUp 0.9s 0.65s both' }}>
          <button
            onClick={scrollToPortfolio}
            style={{
              padding: '14px 32px',
              background: 'transparent',
              color: 'white',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(191,161,95,0.25)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#bfa15f';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)';
            }}
          >
            Explore Portfolio
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        onClick={scrollToPortfolio}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          animation: 'fadeUp 0.9s 0.9s both',
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '50px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
            animation: 'scrollLine 1.5s ease-in-out infinite',
          }}
        />
        <ChevronDown size={14} color="rgba(255,255,255,0.4)" />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollLine {
          0%, 100% { opacity: 0.5; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
}
