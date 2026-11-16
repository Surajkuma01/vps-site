import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onContactClick?: () => void;
  forceLight?: boolean; // force light (dark text) mode — used on About page hero
}

export default function Navbar({ onContactClick, forceLight = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Projects', to: '/projects' },
    { label: 'Contact', to: '/#contact' },
  ];

  const isLight = isScrolled || forceLight;

  const activeLinkColor = '#bfa15f';
  const normalLinkColor = isLight ? '#3d3834' : 'rgba(255,255,255,0.85)';

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: isLight ? 'rgba(250, 248, 245, 0.96)' : 'transparent',
          backdropFilter: isLight ? 'blur(16px)' : 'none',
          borderBottom: isLight
            ? '1px solid rgba(191, 161, 95, 0.2)'
            : '1px solid transparent',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div
                style={{
                  backgroundColor: '#0d0c0b',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(191, 161, 95, 0.45)',
                  boxShadow: isLight
                    ? '0 4px 14px rgba(0, 0, 0, 0.18)'
                    : '0 4px 16px rgba(0, 0, 0, 0.55)',
                  flexShrink: 0,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
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
                <div
                  className="nav-logo-text"
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    letterSpacing: '0.08em',
                    color: isLight ? '#1a1714' : 'white',
                    transition: 'color 0.3s',
                    lineHeight: 1,
                  }}
                >
                  FORM & SPACE BY VPS
                </div>
                <div
                  className="nav-logo-sub"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    color: isLight ? '#8a8278' : 'rgba(255,255,255,0.55)',
                    textTransform: 'uppercase',
                    transition: 'color 0.3s',
                  }}
                >
                  BUILD &middot; INSPIRE &middot; LAST
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="nav-desktop">
              {navLinks.map(({ label, to }) => {
                const isActive = to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(to) && to !== '/';
                return (
                  <Link
                    key={label}
                    to={to}
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isActive ? activeLinkColor : normalLinkColor,
                      textDecoration: 'none',
                      transition: 'color 0.25s',
                      borderBottom: isActive ? '1px solid #bfa15f' : 'none',
                      paddingBottom: isActive ? '1px' : '0',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#bfa15f';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = normalLinkColor;
                    }}
                  >
                    {label}
                  </Link>
                );
              })}

              <button
                onClick={onContactClick}
                className="btn-primary"
                style={{ padding: '10px 22px', fontSize: '11.5px' }}
              >
                Start a Project <ChevronRight size={13} />
              </button>
            </div>

            {/* Hamburger */}
            <button
              className="nav-mobile-btn"
              onClick={() => setMobileOpen(v => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: isLight ? '#1a1714' : 'white',
                display: 'none',
              }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(26,23,20,0.98)',
          backdropFilter: 'blur(16px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.75rem',
          padding: '4rem 1.5rem',
          overflowY: 'auto',
          minHeight: '100dvh',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white'
          }}
        >
          <X size={24} />
        </button>
        {navLinks.map(({ label, to }, i) => (
          <Link
            key={label}
            to={to}
            onClick={() => setMobileOpen(false)}
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.2rem, 8vw, 3.5rem)',
              fontWeight: 300,
              color: location.pathname === to ? '#bfa15f' : 'white',
              textDecoration: 'none',
              opacity: 0,
              transform: 'translateY(24px)',
              animation: mobileOpen ? `fadeUp 0.4s ${i * 0.07}s forwards` : 'none',
              letterSpacing: '0.04em',
            }}
          >
            {label}
          </Link>
        ))}
        <button
          onClick={() => { setMobileOpen(false); onContactClick?.(); }}
          className="btn-primary"
          style={{
            marginTop: '0.5rem',
            opacity: 0,
            animation: mobileOpen ? `fadeUp 0.4s ${navLinks.length * 0.07}s forwards` : 'none',
          }}
        >
          Start a Project
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
