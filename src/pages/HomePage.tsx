import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowUpRight, Building2, Home, Layers, Wrench, CheckCircle, Phone, Play, AlertCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import Footer from '../components/Footer';
import { sendEnquiryToSpreadsheet, PROJECT_TYPES, BUDGET_RANGES } from '../config/spreadsheet';
import { normalizeImageUrl } from '../utils/imageUrl';

/* ────────────────────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────────────────────── */
const tc = '#bfa15f';
const dark = '#131211';
const cream = '#faf8f5';

/* ────────────────────────────────────────────────────────────
   HOOKS
──────────────────────────────────────────────────────────── */
function useParallax(factor = 0.35) {
  const [y, setY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setY(window.scrollY * factor);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [factor]);
  return y;
}

function useCountUp(target: number, duration = 1600, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration, active]);
  return count;
}

/* ────────────────────────────────────────────────────────────
   REVEAL WRAPPER — scroll-triggered with spring easing
──────────────────────────────────────────────────────────── */
function Reveal({
  children,
  direction = 'up',
  delay = 0,
  style = {},
  className = '',
}: {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right' | 'scale' | 'fade';
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const initial: Record<string, string> = {
    up: 'translateY(56px)',
    left: 'translateX(-56px)',
    right: 'translateX(56px)',
    scale: 'scale(0.92)',
    fade: 'translateY(0)',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : initial[direction],
        transition: `opacity 1s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 1s ${delay}s cubic-bezier(0.16,1,0.3,1)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   FLOATING PARTICLES (hero decoration)
──────────────────────────────────────────────────────────── */
function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 5,
    dur: 4 + Math.random() * 4,
    dx: (Math.random() - 0.5) * 80,
    dy: -(40 + Math.random() * 80),
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            backgroundColor: 'rgba(191,161,95,0.5)',
            animation: `particleDrift ${p.dur}s ${p.delay}s ease-out infinite`,
            // @ts-ignore CSS custom properties
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   ANIMATED STAT COUNTER
──────────────────────────────────────────────────────────── */
function AnimatedStat({ val, label }: { val: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Parse numeric prefix
  const num = parseInt(val.replace(/\D/g, ''), 10) || 0;
  const suffix = val.replace(/[\d]/g, '');
  const counted = useCountUp(num, 1400, vis);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '2.1rem',
          fontWeight: 300,
          color: tc,
          lineHeight: 1,
          opacity: vis ? 1 : 0,
          transform: vis ? 'none' : 'translateY(10px)',
          transition: 'opacity 0.6s, transform 0.6s',
        }}
      >
        {vis ? `${counted}${suffix}` : val}
      </div>
      <div
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.55)',
          textTransform: 'uppercase',
          marginTop: '4px',
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   SERVICE CARD (with glass shimmer)
──────────────────────────────────────────────────────────── */
function ServiceCard({
  icon, title, desc, link,
}: {
  icon: React.ReactElement<{ color?: string }>;
  title: string;
  desc: string;
  link: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={link}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="service-card-glass"
      style={{
        display: 'block',
        padding: '2.25rem 1.75rem',
        backgroundColor: hovered ? '#131211' : 'white',
        border: `1px solid ${hovered ? 'rgba(191,161,95,0.45)' : 'rgba(191,161,95,0.22)'}`,
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-8px) scale(1.015)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? '0 24px 60px rgba(19,18,17,0.18), 0 4px 16px rgba(191,161,95,0.14)'
          : '0 2px 12px rgba(19,18,17,0.04)',
        position: 'relative',
      }}
    >
      <div
        style={{
          marginBottom: '1.25rem',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          transform: hovered ? 'scale(1.12) rotate(-4deg)' : 'scale(1) rotate(0deg)',
          display: 'inline-block',
        }}
      >
        {React.cloneElement(icon, { color: tc })}
      </div>
      <h3
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.45rem',
          fontWeight: 500,
          color: hovered ? 'white' : dark,
          marginBottom: '0.65rem',
          transition: 'color 0.35s',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '13px',
          color: hovered ? 'rgba(232,220,200,0.65)' : '#8a8278',
          lineHeight: 1.7,
          transition: 'color 0.35s',
        }}
      >
        {desc}
      </p>
      <div
        style={{
          marginTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(-10px)',
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: tc,
            textTransform: 'uppercase',
          }}
        >
          Explore
        </span>
        <ArrowUpRight size={13} color={tc} />
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────
   HOME PROJECT CARD
──────────────────────────────────────────────────────────── */
function HomeProjectCard({ project }: { project: import('../data/projects').Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to="/projects"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="project-grid-card image-sheen-container"
      style={{
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '10px',
        textDecoration: 'none',
        aspectRatio: '4/3',
        transform: hovered ? 'translateY(-10px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1), box-shadow 0.55s',
        boxShadow: hovered
          ? '0 32px 80px rgba(19,18,17,0.26), 0 8px 24px rgba(191,161,95,0.16)'
          : '0 4px 20px rgba(19,18,17,0.06)',
      }}
    >
      <img
        src={normalizeImageUrl(project.image)}
        alt={project.title}
        className="project-card-img"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.85s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(10,8,5,0.88) 0%, rgba(10,8,5,0.2) 55%, transparent 100%)',
        }}
      />
      {/* Hover overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,8,5,0.25)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s',
        }}
      />
      {/* 360° indicator badge */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 10px',
          backgroundColor: 'rgba(191,161,95,0.92)',
          backdropFilter: 'blur(6px)',
          borderRadius: '20px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.9)',
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '9px', fontWeight: 700, color: 'white', letterSpacing: '0.1em' }}>
          360° VIEW
        </span>
      </div>
      {/* Bottom content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.75rem 1.5rem' }}>
        <div
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: tc,
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(6px)',
            transition: 'all 0.35s 0.05s',
          }}
        >
          {project.category}
        </div>
        <h3
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
            fontWeight: 500,
            color: 'white',
            marginBottom: '0.4rem',
            lineHeight: 1.15,
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '12px',
            color: 'rgba(232,220,200,0.7)',
            marginBottom: '0.75rem',
          }}
        >
          {project.location}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.35s 0.1s',
          }}
        >
          <span
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: tc,
              textTransform: 'uppercase',
            }}
          >
            View Project
          </span>
          <ArrowUpRight size={13} color={tc} />
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────
   HERO SCENES (CURATED ARCHITECTURAL MASTERPIECES)
──────────────────────────────────────────────────────────── */
const HERO_SCENES = [
  {
    id: 'estate',
    label: 'The Grand Estate',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=85',
  },
  {
    id: 'minimalist',
    label: 'Minimalist Villa',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=85',
  },
  {
    id: 'horizon',
    label: 'Horizon Pavilion',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=85',
  },
];

/* ════════════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { projects } = useSiteData();
  const featuredProjects = projects.slice(0, 3);

  /* Curated scene state (minimalist crossfade) */
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSceneIndex(prev => (prev + 1) % HERO_SCENES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  /* Mouse-parallax for subtle hero content floating */
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    setMouse({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => setMouse({ x: 0, y: 0 }), []);

  /* Bottom Inquiry Form State (Exactly matching EnquiryForm modal) */
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: '',
    location: '',
    budget: '',
    message: '',
  });
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [inquiryFocused, setInquiryFocused] = useState<string | null>(null);

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setInquiryForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus('submitting');
    try {
      const res = await sendEnquiryToSpreadsheet({
        ...inquiryForm,
        source: 'Home Page Bottom Enquiry Form',
      });
      if (res.success) {
        setInquiryStatus('success');
      } else {
        setInquiryStatus('error');
      }
    } catch {
      setInquiryStatus('error');
    }
  };

  return (
    <div style={{ backgroundColor: cream }}>

      {/* ─────────────────── HERO ─────────────────── */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '700px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#131211',
        }}
      >
        {/* Static architectural backdrop images with smooth filmic crossfade */}
        {HERO_SCENES.map((scene, idx) => (
          <div
            key={scene.id}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${scene.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: 'none',
              opacity: idx === activeSceneIndex ? 1 : 0,
              transition: 'opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: 'brightness(0.85) contrast(1.05) saturate(1.06)',
              zIndex: 0,
            }}
          />
        ))}

        {/* Ambient warm golden glow */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            right: '-10%',
            width: '850px',
            height: '850px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(191,161,95,0.18) 0%, transparent 60%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 1,
            animation: 'vignettePulse 7s ease-in-out infinite',
          }}
        />

        {/* Minimalist cinematic reading gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(95deg, rgba(13,12,11,0.88) 0%, rgba(13,12,11,0.58) 46%, rgba(13,12,11,0.18) 85%, rgba(13,12,11,0.35) 100%),
              linear-gradient(to top, #131211 0%, transparent 22%)
            `,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Floating micro-particles */}
        <FloatingParticles />

        {/* Content */}
        <div
          className="hero-content"
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 2.5rem',
            width: '100%',
            transform: `translate(${mouse.x * 0.4}px, ${mouse.y * 0.25}px)`,
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '1.75rem',
              animation: 'fadeDown 0.8s 0.2s both',
            }}
          >
            <div style={{ width: '36px', height: '1px', backgroundColor: tc }} />
            <span
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.28em',
                color: tc,
                textTransform: 'uppercase',
              }}
            >
              Architectural Studio · Punjab &amp; Tricity
            </span>
          </div>

          {/* Main headline */}
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.75rem, 7.5vw, 7.5rem)',
              fontWeight: 300,
              color: 'white',
              lineHeight: 1.05,
              letterSpacing: '-0.015em',
              maxWidth: '850px',
              marginBottom: '1.75rem',
            }}
          >
            <span
              style={{
                display: 'block',
                animation: 'fadeUp 0.9s 0.3s both',
              }}
            >
              We Shape Spaces.
            </span>
            <span
              className="text-shimmer-light"
              style={{
                display: 'block',
                animation: 'fadeUp 0.9s 0.45s both',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              We Build Legacies.
            </span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              color: 'rgba(232,220,200,0.8)',
              maxWidth: '480px',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
              animation: 'fadeUp 0.9s 0.6s both',
              fontWeight: 400,
            }}
          >
            Form & Space by VPS crafts signature luxury residences and commercial landmarks — uniting structural permanence with timeless architectural grace across Punjab.
          </p>

          {/* CTAs */}
          <div
            className="hero-cta-row"
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              animation: 'fadeUp 0.9s 0.75s both',
              alignItems: 'center',
            }}
          >
            <Link
              to="/projects"
              className="btn-primary btn-glow"
              style={{
                fontSize: '12px',
                letterSpacing: '0.14em',
                padding: '14px 30px',
              }}
            >
              Explore Projects <ArrowUpRight size={14} />
            </Link>
            <a
              href="tel:+918427930197"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 26px',
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
                color: 'white',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: '1px solid rgba(191,161,95,0.28)',
                borderRadius: '4px',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = tc;
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(191,161,95,0.15)';
                (e.currentTarget as HTMLAnchorElement).style.color = '#edd9b3';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(191,161,95,0.28)';
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'white';
              }}
            >
              <Phone size={14} /> Direct Consultation
            </a>
          </div>
        </div>

        {/* Minimalist Architectural Scene Index (Bottom Left) */}
        <div
          className="hero-scene-dial"
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '3rem',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {HERO_SCENES.map((scene, i) => (
            <button
              key={scene.id}
              onClick={() => setActiveSceneIndex(i)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: activeSceneIndex === i ? 'white' : 'rgba(232,220,200,0.4)',
                transition: 'color 0.3s',
              }}
            >
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: activeSceneIndex === i ? 700 : 500, letterSpacing: '0.1em' }}>
                0{i + 1}
              </span>
              <div
                style={{
                  width: activeSceneIndex === i ? '24px' : '10px',
                  height: '1px',
                  backgroundColor: activeSceneIndex === i ? tc : 'rgba(232,220,200,0.25)',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
            </button>
          ))}
        </div>

        {/* Scroll indicator (Center) */}
        <div
          className="hero-scroll-indicator"
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            zIndex: 2,
            animation: 'fadeUp 0.9s 1.1s both',
          }}
          onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: '1px',
              height: '42px',
              background: 'linear-gradient(to bottom, rgba(191,161,95,0.7), transparent)',
              animation: 'scrollLine 1.6s ease-in-out infinite',
            }}
          />
        </div>

        {/* Minimalist Floating Stat Capsule (Bottom Right) */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            right: '3rem',
            backgroundColor: 'rgba(19,18,17,0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(191,161,95,0.25)',
            borderRadius: '30px',
            padding: '10px 22px',
            animation: 'fadeUp 0.9s 1.1s both',
            zIndex: 3,
          }}
          className="hero-stat-card"
        >
          <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
            {[
              { val: '50+', lab: 'Projects' },
              { val: '10+', lab: 'Years' },
              { val: '100%', lab: 'On-Time' },
            ].map(s => (
              <AnimatedStat key={s.lab} val={s.val} label={s.lab} />
            ))}
          </div>
        </div>

        {/* Keyframe definitions */}
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeDown {
            from { opacity: 0; transform: translateY(-20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes scrollLine {
            0%,100% { opacity: 0.5; transform: scaleY(1); }
            50%      { opacity: 1;   transform: scaleY(1.2); }
          }
          @keyframes particleDrift {
            0%   { transform: translate(0, 0) scale(1);        opacity: 0; }
            20%  { opacity: 0.7; }
            80%  { opacity: 0.3; }
            100% { transform: translate(var(--dx), var(--dy)) scale(0.3); opacity: 0; }
          }
          @media (max-width: 900px) {
            .hero-stat-card { display: none !important; }
            .hero-scene-dial { left: 1.5rem !important; bottom: 1.5rem !important; }
          }
        `}</style>
      </section>

      {/* ─────────────────── SERVICES ─────────────────── */}
      <section id="services" style={{ padding: '7rem 0', backgroundColor: cream }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: tc, textTransform: 'uppercase' }}>
                WHAT WE DO
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginBottom: '3.5rem',
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                    fontWeight: 300,
                    color: dark,
                    lineHeight: 1.08,
                    letterSpacing: '-0.01em',
                  }}
                >
                  End-to-End<br />Architectural &amp; Build Services
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', color: '#8a8278', maxWidth: '360px', lineHeight: 1.8 }}>
                  From architectural blueprints and feasibility advisory to third-party turnkey contractor suggestions — we guide every phase with clarity.
                </p>
                <Link
                  to="/services"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: tc,
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(191,161,95,0.4)',
                    paddingBottom: '2px',
                    transition: 'border-color 0.3s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = tc}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(191,161,95,0.4)'}
                >
                  All Services &amp; Consultation →
                </Link>
              </div>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }} className="services-grid">
            {[
              { icon: <Home size={28} color={tc} />, title: 'Architectural Design', desc: 'Luxury villas, bespoke residences, and masterplans crafted to your exact site context.', link: '/services' },
              { icon: <Building2 size={28} color={tc} />, title: 'Commercial & Retail', desc: 'High-performance commercial plazas and luxury retail environments engineered for visual impact.', link: '/services' },
              { icon: <Layers size={28} color={tc} />, title: 'Advisory & Consultation', desc: '1-on-1 strategic site feasibility, zoning bylaws, and Vastu compliance consultations.', link: '/services#consultation-booking' },
              { icon: <Wrench size={28} color={tc} />, title: 'Third-Party Turnkey Advisory', desc: 'We do not do turnkey construction ourselves — we suggest trusted third-party turnkey contractors if you need one.', link: '/services' },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <ServiceCard {...s} />
              </Reveal>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2,1fr) !important; } }
          @media (max-width: 560px) { .services-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ─────────────────── ABOUT STRIP ─────────────────── */}
      <section style={{ backgroundColor: '#1a1714', padding: '7rem 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="about-grid">

            {/* Left image */}
            <Reveal direction="left">
              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '4/3' }}>
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80"
                  alt="FORM & SPACE BY VPS Construction"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
                {/* Corner accent */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1.2rem',
                    right: '-1.2rem',
                    width: '130px',
                    height: '130px',
                    border: '3px solid #bfa15f',
                    borderRadius: '6px',
                    zIndex: -1,
                  }}
                />
                {/* Experience badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    left: '1.5rem',
                    backgroundColor: tc,
                    borderRadius: '6px',
                    padding: '0.75rem 1rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '2rem',
                      fontWeight: 300,
                      color: 'white',
                      lineHeight: 1,
                    }}
                  >
                    28+
                  </div>
                  <div
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      color: 'rgba(255,255,255,0.8)',
                      textTransform: 'uppercase',
                      marginTop: '4px',
                    }}
                  >
                    Years Legacy
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right text */}
            <Reveal direction="right">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: tc, textTransform: 'uppercase' }}>
                  WHO WE ARE
                </span>
              </div>
              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 300,
                  color: 'white',
                  lineHeight: 1.1,
                  marginBottom: '1.5rem',
                }}
              >
                Crafting Spaces<br />
                <em style={{ fontStyle: 'italic', color: '#e8dcc8' }}>Since 1996</em>
              </h2>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.95rem', color: 'rgba(232,220,200,0.65)', lineHeight: 1.85, marginBottom: '1.25rem' }}>
                Founded in 1996 by Vijaypal, VPS began with a commitment to quality craftsmanship in tile and marble flooring and cladding. In 2023, VPS expanded into architectural design and planning, bringing together decades of practical construction experience with a contemporary design approach.
              </p>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.95rem', color: 'rgba(232,220,200,0.65)', lineHeight: 1.85, marginBottom: '2.5rem' }}>
                Today, VPS stands at the intersection of tradition, innovation, and thoughtful design—building functional, timeless, and enduring spaces.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                {['Third-party turnkey suggestions', 'Clear architectural drawings', 'Transparent design process', 'Dedicated client support'].map((item, i) => (
                  <div
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      opacity: 0,
                      animation: `fadeUp 0.6s ${0.1 + i * 0.12}s both`,
                    }}
                  >
                    <CheckCircle size={15} color={tc} />
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'rgba(232,220,200,0.75)' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/about" className="btn-primary btn-glow" style={{ display: 'inline-flex' }}>
                Our Story <ArrowUpRight size={14} />
              </Link>
            </Reveal>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; } }
        `}</style>
      </section>

      {/* ─────────────────── FEATURED PROJECTS ─────────────────── */}
      <section style={{ padding: '7rem 0', backgroundColor: cream }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <Reveal>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginBottom: '3rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
                  <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: tc, textTransform: 'uppercase' }}>
                    OUR WORK
                  </span>
                </div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 300, color: dark, lineHeight: 1.08 }}>
                  Featured <span className="text-shimmer-gold">Projects</span>
                </h2>
                <p
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '13px',
                    color: '#8a8278',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 10px',
                      backgroundColor: 'rgba(191,161,95,0.12)',
                      border: '1px solid rgba(191,161,95,0.25)',
                      borderRadius: '20px',
                      color: tc,
                      fontWeight: 700,
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    ✦ 360° immersive view available
                  </span>
                </p>
              </div>
              <Link
                to="/projects"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: tc,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid rgba(191,161,95,0.4)',
                  paddingBottom: '2px',
                  transition: 'border-color 0.3s',
                }}
              >
                View All Projects <ArrowUpRight size={14} />
              </Link>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }} className="proj-grid">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.12}>
                <HomeProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) { .proj-grid { grid-template-columns: repeat(2,1fr) !important; } }
          @media (max-width: 560px) { .proj-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ─────────────────── PROCESS ─────────────────── */}
      <section style={{ backgroundColor: '#f5f0e8', padding: '7rem 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: tc, textTransform: 'uppercase' }}>
                  HOW WE WORK
                </span>
                <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 300, color: dark }}>
                Our Process
              </h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }} className="process-grid">
            {[
              { num: '01', title: 'Consultation', desc: 'We understand your vision, requirements, site, and budget in detail.' },
              { num: '02', title: 'Design', desc: 'Our team creates detailed architectural plans and material specifications.' },
              { num: '03', title: 'Build', desc: 'Skilled craftsmen execute the construction with precision and care.' },
              { num: '04', title: 'Handover', desc: 'Quality-checked completion and smooth handover to you on schedule.' },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 0.12}>
                <div
                  className="process-step"
                  style={{
                    padding: '2.5rem 2rem',
                    borderRight: i < 3 ? '1px solid rgba(196,181,158,0.35)' : 'none',
                    position: 'relative',
                    borderRadius: i === 0 ? '8px 0 0 8px' : i === 3 ? '0 8px 8px 0' : undefined,
                    cursor: 'default',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '4.5rem',
                      fontWeight: 300,
                      color: 'rgba(191,161,95,0.2)',
                      lineHeight: 1,
                      marginBottom: '1rem',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {step.num}
                  </div>
                  <div style={{ width: '28px', height: '2px', backgroundColor: tc, marginBottom: '1rem' }} />
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.55rem', fontWeight: 500, color: dark, marginBottom: '0.75rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#8a8278', lineHeight: 1.7 }}>
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .process-grid { grid-template-columns: repeat(2,1fr) !important; }
            .process-grid > *:nth-child(2) { border-right: none !important; }
            .process-grid > *:nth-child(1), .process-grid > *:nth-child(2) { border-bottom: 1px solid rgba(196,181,158,0.35); }
          }
          @media (max-width: 560px) {
            .process-grid { grid-template-columns: 1fr !important; }
            .process-grid > * { border-right: none !important; border-bottom: 1px solid rgba(196,181,158,0.35) !important; }
            .process-grid > *:last-child { border-bottom: none !important; }
          }
        `}</style>
      </section>

      {/* ─────────────────── CONTACT & PROJECT INQUIRIES ─────────────────── */}
      <section
        id="contact"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '7rem 0',
          backgroundColor: '#161311',
          color: 'white',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(22,19,17,0.94) 0%, rgba(22,19,17,0.99) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <Reveal>
            <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4rem auto' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '30px', height: '1.5px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.28em', color: tc, textTransform: 'uppercase' }}>
                  START A PROJECT
                </span>
                <div style={{ width: '30px', height: '1.5px', backgroundColor: tc }} />
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', fontWeight: 300, color: 'white', lineHeight: 1.08, marginBottom: '1.25rem' }}>
                Connect With Our Principal Architects
              </h2>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '15px', color: 'rgba(232,220,200,0.75)', lineHeight: 1.8 }}>
                Whether you have land ready for planning or want suggestions for reliable third-party turnkey contractors (note: turnkey construction is executed by third parties, not by us), our studio provides clear architectural guidance from first sketch onward.
              </p>
            </div>
          </Reveal>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'start' }}
            className="contact-section-grid"
          >
            {/* Left Column */}
            <Reveal direction="left">
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'white', fontWeight: 400, marginBottom: '1.5rem' }}>
                  Our Design Studios
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
                  {[
                    {
                      icon: <Phone size={18} />,
                      label: 'Direct Architectural Line',
                      content: <a href="tel:+918427930197" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '16px', color: 'white', textDecoration: 'none', fontWeight: 600 }}>+91 8427930197</a>,
                    },

                    {
                      icon: <Layers size={18} />,
                      label: 'Regional Advisory Office',
                      content: <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14.5px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>Ground Floor Tarjas Hotel near Baba Chicken Mandi Mullanpur Dakha,<br />Ludhiana, Punjab 141101</div>,
                    },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: 'rgba(191,161,95,0.15)', color: tc, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#9e9589', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '4px' }}>
                          {item.label}
                        </div>
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a
                    href="https://wa.me/918427930197?text=Hello%20I%20am%20interested%20in%20discussing%20a%20project."
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 22px',
                      backgroundColor: '#25D366',
                      color: 'white',
                      borderRadius: '4px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      letterSpacing: '0.08em',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(37,211,102,0.35)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.transform = '';
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = '';
                    }}
                  >
                    Chat on WhatsApp
                  </a>
                  <Link
                    to="/services#consultation-booking"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 22px',
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '4px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      letterSpacing: '0.08em',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = tc;
                      (e.currentTarget as HTMLAnchorElement).style.color = '#f0d4c0';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'white';
                    }}
                  >
                    Book Consultation <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Right Column */}
            <Reveal direction="right">
              <div
                style={{
                  backgroundColor: '#1f1b18',
                  borderRadius: '10px',
                  border: '1px solid rgba(196,181,158,0.25)',
                  padding: '2.5rem',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
                }}
              >
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'white', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Direct Project Inquiry
                </h4>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'rgba(232,220,200,0.65)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                  Submit your site specifications below and our principal architect will respond within 24 hours.
                </p>

                {inquiryStatus === 'success' ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: '2.5rem 1rem',
                      gap: '1rem',
                      backgroundColor: 'rgba(191,161,95,0.06)',
                      border: '1px solid rgba(191,161,95,0.3)',
                      borderRadius: '8px',
                    }}
                  >
                    <CheckCircle size={44} color={tc} />
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 400, color: 'white' }}>
                      Inquiry Received &amp; Logged
                    </h3>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13.5px', color: 'rgba(232,220,200,0.8)', maxWidth: '380px', lineHeight: 1.65 }}>
                      Thank you, <strong>{inquiryForm.name}</strong>. Your project details have been recorded. Our lead architectural coordinator will contact you at <strong>{inquiryForm.phone}</strong> shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setInquiryStatus('idle');
                        setInquiryForm({ name: '', phone: '', email: '', projectType: '', location: '', budget: '', message: '' });
                      }}
                      style={{
                        marginTop: '0.5rem',
                        padding: '10px 22px',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(191,161,95,0.4)',
                        borderRadius: '4px',
                        color: tc,
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleInquirySubmit}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}
                    className="contact-inquiry-form"
                  >
                    {inquiryStatus === 'error' && (
                      <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '10px', padding: '0.85rem 1rem', backgroundColor: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: '4px' }}>
                        <AlertCircle size={16} color="#ff8080" />
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#ffb3b3' }}>
                          Could not submit inquiry. Please check connection or call us directly.
                        </span>
                      </div>
                    )}

                    {/* 1. Full Name */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: '#c4b59e', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={inquiryForm.name}
                        onChange={handleInquiryChange}
                        onFocus={() => setInquiryFocused('name')}
                        onBlur={() => setInquiryFocused(null)}
                        placeholder="Rajesh Kumar"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: `1px solid ${inquiryFocused === 'name' ? tc : 'rgba(196,181,158,0.25)'}`,
                          borderRadius: '5px',
                          color: 'white',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '13px',
                          outline: 'none',
                          transition: 'border-color 0.3s',
                        }}
                      />
                    </div>

                    {/* 2. Phone Number */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: '#c4b59e', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={inquiryForm.phone}
                        onChange={handleInquiryChange}
                        onFocus={() => setInquiryFocused('phone')}
                        onBlur={() => setInquiryFocused(null)}
                        placeholder="+91 98765 43210"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: `1px solid ${inquiryFocused === 'phone' ? tc : 'rgba(196,181,158,0.25)'}`,
                          borderRadius: '5px',
                          color: 'white',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '13px',
                          outline: 'none',
                          transition: 'border-color 0.3s',
                        }}
                      />
                    </div>

                    {/* 3. Email Address */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: '#c4b59e', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={inquiryForm.email}
                        onChange={handleInquiryChange}
                        onFocus={() => setInquiryFocused('email')}
                        onBlur={() => setInquiryFocused(null)}
                        placeholder="your@email.com"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: `1px solid ${inquiryFocused === 'email' ? tc : 'rgba(196,181,158,0.25)'}`,
                          borderRadius: '5px',
                          color: 'white',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '13px',
                          outline: 'none',
                          transition: 'border-color 0.3s',
                        }}
                      />
                    </div>

                    {/* 4. Project Type */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: '#c4b59e', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Project Type *
                      </label>
                      <select
                        name="projectType"
                        required
                        value={inquiryForm.projectType}
                        onChange={handleInquiryChange}
                        onFocus={() => setInquiryFocused('projectType')}
                        onBlur={() => setInquiryFocused(null)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: '#26211d',
                          border: `1px solid ${inquiryFocused === 'projectType' ? tc : 'rgba(196,181,158,0.25)'}`,
                          borderRadius: '5px',
                          color: 'white',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '13px',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">Select project type</option>
                        {PROJECT_TYPES.map(pt => (
                          <option key={pt} value={pt}>
                            {pt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 5. Location / City */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: '#c4b59e', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Site Location / City
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={inquiryForm.location}
                        onChange={handleInquiryChange}
                        onFocus={() => setInquiryFocused('location')}
                        onBlur={() => setInquiryFocused(null)}
                        placeholder="e.g. Ludhiana, Mohali, Jalandhar"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: `1px solid ${inquiryFocused === 'location' ? tc : 'rgba(196,181,158,0.25)'}`,
                          borderRadius: '5px',
                          color: 'white',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '13px',
                          outline: 'none',
                          transition: 'border-color 0.3s',
                        }}
                      />
                    </div>

                    {/* 6. Approximate Budget */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: '#c4b59e', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Approximate Budget
                      </label>
                      <select
                        name="budget"
                        value={inquiryForm.budget}
                        onChange={handleInquiryChange}
                        onFocus={() => setInquiryFocused('budget')}
                        onBlur={() => setInquiryFocused(null)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: '#26211d',
                          border: `1px solid ${inquiryFocused === 'budget' ? tc : 'rgba(196,181,158,0.25)'}`,
                          borderRadius: '5px',
                          color: 'white',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '13px',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">Select budget range</option>
                        {BUDGET_RANGES.map(b => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 7. Vision / Message */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: '#c4b59e', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Brief Project Vision or Timeline
                      </label>
                      <textarea
                        rows={3}
                        name="message"
                        value={inquiryForm.message}
                        onChange={handleInquiryChange}
                        onFocus={() => setInquiryFocused('message')}
                        onBlur={() => setInquiryFocused(null)}
                        placeholder="Plot size, planned construction year, specific architectural requirements..."
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: `1px solid ${inquiryFocused === 'message' ? tc : 'rgba(196,181,158,0.25)'}`,
                          borderRadius: '5px',
                          color: 'white',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '13px',
                          outline: 'none',
                          resize: 'vertical',
                          transition: 'border-color 0.3s',
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <button
                        type="submit"
                        disabled={inquiryStatus === 'submitting'}
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: `linear-gradient(135deg, ${tc}, #9a7a38)`,
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '12px',
                          fontWeight: 700,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          cursor: inquiryStatus === 'submitting' ? 'wait' : 'pointer',
                          opacity: inquiryStatus === 'submitting' ? 0.8 : 1,
                          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                          boxShadow: '0 4px 20px rgba(191,161,95,0.3)',
                        }}
                        onMouseEnter={e => {
                          if (inquiryStatus !== 'submitting') {
                            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(191,161,95,0.5)';
                          }
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.transform = '';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(191,161,95,0.3)';
                        }}
                      >
                        {inquiryStatus === 'submitting' ? 'Submitting to Studio Registry...' : 'Submit Project Inquiry →'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .contact-section-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          }
          @media (max-width: 600px) {
            .contact-inquiry-form { grid-template-columns: 1fr !important; }
            .contact-inquiry-form > div { grid-column: span 1 !important; }
          }
        `}</style>
      </section>

      <Footer />
    </div>
  );
}
