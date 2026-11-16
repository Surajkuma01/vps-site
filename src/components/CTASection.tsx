import React, { useEffect, useRef, useState } from 'react';
import { Send, Phone } from 'lucide-react';

interface CTASectionProps {
  onEnquiryClick?: () => void;
}

export default function CTASection({ onEnquiryClick }: CTASectionProps) {
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
        position: 'relative',
        overflow: 'hidden',
        padding: '7rem 0',
        backgroundColor: '#faf8f4',
      }}
    >
      {/* Background image with overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(26,23,20,0.92) 0%, rgba(45,41,38,0.88) 50%, rgba(26,23,20,0.92) 100%)',
        }}
      />

      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 2rem',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s, transform 0.8s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '1.5rem' }}>
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
              GET IN TOUCH
            </span>
            <div style={{ width: '30px', height: '1px', backgroundColor: '#bfa15f' }} />
          </div>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 300,
              color: 'white',
              lineHeight: 1.05,
              marginBottom: '1.5rem',
              letterSpacing: '-0.01em',
            }}
          >
            Have a project
            <br />
            <em style={{ fontStyle: 'italic', color: '#e8d5c4' }}>in mind?</em>
          </h2>
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '1rem',
              color: 'rgba(232, 220, 200, 0.7)',
              maxWidth: '520px',
              margin: '0 auto 3rem',
              lineHeight: 1.75,
            }}
          >
            Tell us your vision. Our engineering and construction team will help turn it into a finished space — built with precision, built to last.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s 0.2s, transform 0.8s 0.2s',
          }}
        >
          <button
            onClick={onEnquiryClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              backgroundColor: '#bfa15f',
              color: 'white',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              border: '1px solid #bfa15f',
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
            <Send size={14} /> Send Enquiry
          </button>
          <a
            href="tel:+918427930197"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              backgroundColor: 'transparent',
              color: 'white',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = '#bfa15f';
              (e.currentTarget as HTMLAnchorElement).style.color = '#bfa15f';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)';
              (e.currentTarget as HTMLAnchorElement).style.color = 'white';
            }}
          >
            <Phone size={14} /> Talk to Our Team
          </a>
        </div>
      </div>
    </section>
  );
}
