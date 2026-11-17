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

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.59L5.06 16.27C4.24 14.96 3.81 13.45 3.81 11.91C3.81 7.37 7.5 3.68 12.04 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.05 20.15ZM16.57 14.37C16.32 14.25 15.1 13.65 14.88 13.56C14.65 13.48 14.49 13.44 14.32 13.69C14.16 13.93 13.69 14.49 13.55 14.65C13.41 14.81 13.27 14.83 13.02 14.71C12.78 14.59 11.99 14.33 11.05 13.49C10.32 12.84 9.83 12.04 9.69 11.79C9.55 11.55 9.67 11.42 9.79 11.3C9.9 11.19 10.04 11.01 10.16 10.87C10.28 10.73 10.32 10.63 10.4 10.46C10.48 10.3 10.44 10.16 10.38 10.04C10.32 9.92 9.83 8.71 9.63 8.21C9.43 7.73 9.23 7.79 9.07 7.79C8.93 7.78 8.76 7.78 8.6 7.78C8.44 7.78 8.17 7.84 7.95 8.08C7.72 8.33 7.09 8.92 7.09 10.12C7.09 11.33 7.97 12.49 8.09 12.65C8.21 12.81 9.82 15.3 12.3 16.36C12.89 16.61 13.35 16.76 13.71 16.88C14.3 17.07 14.84 17.04 15.27 16.98C15.75 16.91 16.74 16.38 16.95 15.8C17.16 15.21 17.16 14.71 17.09 14.6C17.03 14.49 16.82 14.49 16.57 14.37Z" />
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <InstagramIcon />,
      href: 'https://www.instagram.com/vijaypal_and_sons?xtok=MWkxb28xcngxdGl4bw==',
      label: 'Instagram',
    },
    {
      icon: <WhatsAppIcon />,
      href: 'https://wa.me/918427930197?text=Hello%20FORM%20%26%20SPACE%20BY%20VPS,%20I%20am%20interested%20in%20discussing%20a%20project.',
      label: 'WhatsApp',
    },
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
                  target="_blank"
                  rel="noopener noreferrer"
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
