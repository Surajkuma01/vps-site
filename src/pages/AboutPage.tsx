import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Shield, Award, Clock, Users } from 'lucide-react';
import Footer from '../components/Footer';

const tc = '#bfa15f';
const dark = '#131211';
const cream = '#faf8f5';

/* ── Generic Reveal ── */
function Reveal({
  children,
  direction = 'up',
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const init: Record<string, string> = { up: 'translateY(50px)', left: 'translateX(-50px)', right: 'translateX(50px)', scale: 'scale(0.93)' };
  return (
    <div
      ref={ref}
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : init[direction], transition: `opacity 0.85s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.85s ${delay}s cubic-bezier(0.16,1,0.3,1)`, ...style }}
    >
      {children}
    </div>
  );
}

function AnimNum({ target, suffix, isActive }: { target: number; suffix?: string; isActive: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    let s = 0;
    const inc = target / (1800 / 16);
    const t = setInterval(() => { s += inc; if (s >= target) { setN(target); clearInterval(t); } else setN(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [target, isActive]);
  return <>{n}{suffix}</>;
}

export default function AboutPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.2 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ backgroundColor: cream }}>
      {/* ─── HERO ─── */}
      <section
        style={{
          position: 'relative',
          height: '65vh',
          minHeight: '480px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=85)',
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,8,5,0.65) 0%, rgba(10,8,5,0.5) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 2rem', maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', animation: 'fadeDown 0.8s 0.3s both' }}>
            <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: tc, textTransform: 'uppercase' }}>ABOUT US</span>
            <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.3rem, 7vw, 6rem)', fontWeight: 300, color: 'white', lineHeight: 1.05, letterSpacing: '-0.01em', animation: 'fadeUp 0.9s 0.4s both' }}>
            Built on Trust.<br />
            <em style={{ fontStyle: 'italic', color: '#e8dcc8' }}>Crafted with Precision.</em>
          </h1>
        </div>
      </section>

      {/* ─── STORY ─── */}
      <section style={{ padding: '7rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="story-grid">
            <Reveal direction="left">
              <div style={{ position: 'relative' }}>
                <div style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '3/4' }}>
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80"
                    alt="FORM & SPACE BY VPS construction site"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                {/* Floating card */}
                <div
                  className="about-floating-card"
                  style={{
                    position: 'absolute', bottom: '-1.5rem', right: '-1.5rem',
                    backgroundColor: dark, borderRadius: '6px', padding: '1.5rem',
                    minWidth: '180px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  }}
                >
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5rem', fontWeight: 300, color: tc, lineHeight: 1, marginBottom: '4px' }}>10+</div>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(232,220,200,0.6)', textTransform: 'uppercase' }}>
                    Years of Excellence
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: tc, textTransform: 'uppercase' }}>OUR STORY</span>
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, color: dark, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                A Legacy of Quality Construction in Punjab
              </h2>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.95rem', color: '#5a5650', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                FORM & SPACE BY VPS was founded with a singular mission: to raise the standard of construction in Punjab. Over more than a decade, we have grown from a small construction firm into a trusted name in premium residential and commercial development.
              </p>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.95rem', color: '#5a5650', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                Our approach is simple — we treat every project as if it were our own home. That means no shortcuts, no compromise on materials, and a relentless focus on craftsmanship at every stage of construction.
              </p>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.95rem', color: '#5a5650', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                From luxury villas in Ludhiana to commercial developments in Amritsar, FORM & SPACE BY VPS has delivered over 50 projects with 100% client satisfaction — and we're just getting started.
              </p>
              <Link to="/projects" className="btn-primary" style={{ display: 'inline-flex' }}>
                Explore Our Work <ArrowUpRight size={14} />
              </Link>
            </Reveal>
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .story-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }
        `}</style>
      </section>

      {/* ─── STATS ─── */}
      <section ref={statsRef} style={{ backgroundColor: dark, padding: '6rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }} className="a-stats">
            {[
              { val: 50, suffix: '+', lab: 'Projects Delivered' },
              { val: 100, suffix: '%', lab: 'Client Satisfaction' },
              { val: 10, suffix: '+', lab: 'Years Experience' },
              { val: 5, suffix: '', lab: 'Cities Covered' },
            ].map((s, i) => (
              <div
                key={s.lab}
                style={{
                  textAlign: 'center', padding: '2.5rem 1.5rem',
                  borderRight: i < 3 ? '1px solid rgba(196,181,158,0.12)' : 'none',
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.8s ${i * 0.1}s, transform 0.8s ${i * 0.1}s`,
                }}
              >
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 300, color: tc, lineHeight: 1, marginBottom: '0.75rem' }}>
                  <AnimNum target={s.val} suffix={s.suffix} isActive={statsVisible} />
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', color: 'rgba(232,220,200,0.5)', textTransform: 'uppercase' }}>
                  {s.lab}
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) { .a-stats { grid-template-columns: repeat(2,1fr) !important; } .a-stats > *:nth-child(2) { border-right: none !important; } .a-stats > *:nth-child(1), .a-stats > *:nth-child(2) { border-bottom: 1px solid rgba(196,181,158,0.12); } }
        `}</style>
      </section>

      {/* ─── VALUES ─── */}
      <section style={{ padding: '6rem 0', backgroundColor: cream }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: tc, textTransform: 'uppercase' }}>WHAT DRIVES US</span>
                <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 300, color: dark }}>Our Core Values</h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }} className="values-grid">
            {[
              { icon: <Shield size={28} color={tc} />, title: 'Integrity', desc: 'Transparent pricing, honest timelines, and no hidden surprises — ever.' },
              { icon: <Award size={28} color={tc} />, title: 'Quality', desc: 'We use only premium-grade materials and skilled craftsmen on every project.' },
              { icon: <Clock size={28} color={tc} />, title: 'Reliability', desc: 'We deliver on time and within budget. Your schedule is our commitment.' },
              { icon: <Users size={28} color={tc} />, title: 'Client First', desc: 'Your vision guides every decision. We build what you dream, not what we prefer.' },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div
                  style={{
                    padding: '2.25rem 1.75rem',
                    backgroundColor: 'white',
                    border: '1px solid rgba(196,181,158,0.25)',
                    borderRadius: '6px',
                    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 50px rgba(26,23,20,0.1)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ marginBottom: '1.25rem' }}>{v.icon}</div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 500, color: dark, marginBottom: '0.65rem' }}>{v.title}</h3>
                  <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#8a8278', lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .values-grid { grid-template-columns: repeat(2,1fr) !important; } }
          @media (max-width: 560px) { .values-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ─── WHY US ─── */}
      <section style={{ backgroundColor: '#f5f0e8', padding: '6rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="why-grid">
            <Reveal direction="left">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: tc, textTransform: 'uppercase' }}>WHY CHOOSE US</span>
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, color: dark, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                The FORM & SPACE BY VPS Difference
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  ['Single Point of Contact', 'One dedicated project manager throughout — no confusion, no gaps.'],
                  ['In-House Engineering', 'Our own structural and MEP engineers ensure zero coordination failures.'],
                  ['Vetted Suppliers', 'We work exclusively with pre-approved, quality-tested material suppliers.'],
                  ['Regular Site Reporting', 'Detailed photo and progress updates so you always know what\'s happening.'],
                  ['Post-Completion Support', '12-month defect liability period on all completed projects.'],
                ].map(([title, desc], i) => (
                  <div key={title} style={{ display: 'flex', gap: '16px', padding: '1.25rem 0', borderBottom: i < 4 ? '1px solid rgba(196,181,158,0.3)' : 'none' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(191,161,95,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: tc }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 600, color: dark, marginBottom: '4px' }}>{title}</div>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#8a8278', lineHeight: 1.65 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal direction="right">
              <div style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '3/4' }}>
                <img
                  src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=900&q=80"
                  alt="FORM & SPACE BY VPS team at work"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
              </div>
            </Reveal>
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .why-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; } }
        `}</style>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '6rem 0', backgroundColor: dark }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: tc, textTransform: 'uppercase' }}>LET'S WORK TOGETHER</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: tc }} />
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: 'white', lineHeight: 1.05, marginBottom: '1.5rem' }}>
              Ready to Start Your Project?
            </h2>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.95rem', color: 'rgba(232,220,200,0.65)', marginBottom: '2.5rem', lineHeight: 1.75 }}>
              Get in touch with our team today. We'd love to hear about your vision and tell you how we can bring it to life.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/projects" className="btn-primary">
                View Projects <ArrowUpRight size={14} />
              </Link>
              <a
                href="tel:+918427930197"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 28px',
                  background: 'transparent', color: 'white',
                  fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = tc; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
              >
                +91 8427930197
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
