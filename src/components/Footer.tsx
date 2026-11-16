import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, ArrowUpRight } from 'lucide-react';

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.5C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
    { icon: <YoutubeIcon />, href: '#', label: 'YouTube' },
    { icon: <LinkedinIcon />, href: '#', label: 'LinkedIn' },
    { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
  ];

  return (
    <footer style={{ backgroundColor: '#1a1714', paddingTop: '5rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3rem',
            paddingBottom: '4rem',
            borderBottom: '1px solid rgba(196,181,158,0.12)',
          }}
          className="footer-grid"
        >
          {/* Brand col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
              <div
                style={{
                  backgroundColor: '#0d0c0b',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(191, 161, 95, 0.4)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                  flexShrink: 0,
                }}
              >
                <img
                  src="/vps-logo.png"
                  alt="FORM & SPACE BY VPS"
                  style={{
                    height: '32px',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '18px', letterSpacing: '0.08em', color: 'white' }}>
                  FORM & SPACE BY VPS
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                  BUILD &middot; INSPIRE &middot; LAST
                </div>
              </div>
            </div>
            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '13.5px',
                color: 'rgba(232,220,200,0.55)',
                lineHeight: 1.75,
                maxWidth: '280px',
                marginBottom: '1.75rem',
              }}
            >
              Crafting premium homes. Inspiring commercial spaces. Built to last.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '1px solid rgba(196,181,158,0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(232,220,200,0.5)',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#bfa15f';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#bfa15f';
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(191,161,95,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(196,181,158,0.2)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(232,220,200,0.5)';
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.25em',
                color: '#bfa15f',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'About', to: '/about' },
                { label: 'Services', to: '/services' },
                { label: 'Projects', to: '/projects' },
                { label: 'Contact', to: '/#contact' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.to}
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(232,220,200,0.55)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#bfa15f'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(232,220,200,0.55)'; }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.25em',
                color: '#bfa15f',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Residential Design', 'Commercial Projects', 'Builder Floors', 'Third-Party Turnkey Advisory', 'Interior Finishing', 'Structural Design'].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(232,220,200,0.55)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#bfa15f'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(232,220,200,0.55)'; }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.25em',
                color: '#bfa15f',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={14} color="#bfa15f" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'rgba(232,220,200,0.55)', lineHeight: 1.6 }}>
                  Ludhiana, Punjab, India
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={14} color="#bfa15f" />
                <a
                  href="tel:+918427930197"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(232,220,200,0.55)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#bfa15f'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(232,220,200,0.55)'; }}
                >
                  +91 8427930197
                </a>
              </div>
            </div>
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '1.75rem',
                padding: '10px 18px',
                backgroundColor: 'rgba(191,161,95,0.12)',
                border: '1px solid rgba(191,161,95,0.3)',
                borderRadius: '4px',
                color: '#bfa15f',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#bfa15f';
                (e.currentTarget as HTMLAnchorElement).style.color = 'white';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(191,161,95,0.12)';
                (e.currentTarget as HTMLAnchorElement).style.color = '#bfa15f';
              }}
            >
              Start a Project <ArrowUpRight size={12} />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="footer-bottom"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem 0',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: 'rgba(232,220,200,0.3)' }}>
            &copy; {year} FORM & SPACE BY VPS Private Limited. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/privacy-policy"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                color: 'rgba(232,220,200,0.55)',
                textDecoration: 'none',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#bfa15f'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(232,220,200,0.55)'; }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-use"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                color: 'rgba(232,220,200,0.55)',
                textDecoration: 'none',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#bfa15f'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(232,220,200,0.55)'; }}
            >
              Terms of Use
            </Link>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 580px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
