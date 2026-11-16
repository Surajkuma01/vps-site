import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowLeft, Phone, Mail, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import Footer from '../components/Footer';

const tc = '#bfa15f';
const dark = '#131211';
const cream = '#faf8f5';

export default function TermsOfUsePage() {
  const [activeSection, setActiveSection] = useState('using-site');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: 'using-site', title: '1. Using This Website' },
    { id: 'visuals', title: '2. Designs, Images & 360° Views' },
    { id: 'no-guarantees', title: '3. Estimates & No Website Guarantees' },
    { id: 'ownership', title: '4. Content & Design Ownership' },
    { id: 'client-info', title: '5. Project Information & Site Access' },
    { id: 'changes', title: '6. Updates to These Terms' },
    { id: 'contact', title: '7. Contact Us' },
  ];

  return (
    <div style={{ backgroundColor: cream, minHeight: '100vh', color: dark }}>
      {/* ── HERO BANNER ── */}
      <section
        style={{
          position: 'relative',
          padding: '9rem 0 4.5rem',
          backgroundColor: '#131211',
          color: 'white',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(191,161,95,0.22)',
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23bfa15f' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.8,
          }}
        />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', fontSize: '11px', fontFamily: 'Manrope, sans-serif', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(232,220,200,0.6)' }}>
            <Link to="/" style={{ color: 'rgba(232,220,200,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
            <ChevronRight size={12} style={{ color: tc }} />
            <span style={{ color: tc }}>Legal</span>
            <ChevronRight size={12} style={{ color: tc }} />
            <span style={{ color: 'white' }}>Terms of Use</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: 'rgba(191,161,95,0.12)', border: '1px solid rgba(191,161,95,0.3)', borderRadius: '30px', marginBottom: '1.25rem' }}>
            <Scale size={13} style={{ color: tc }} />
            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: tc }}>
              Simple Terms &amp; Guidelines
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              color: 'white',
            }}
          >
            Terms of Use
          </h1>

          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '15px',
              color: 'rgba(232,220,200,0.75)',
              maxWidth: '720px',
              lineHeight: 1.75,
              marginBottom: '2rem',
            }}
          >
            Welcome to FORM &amp; SPACE BY VPS . These Terms of Use explain in plain, simple language how you can use this website and what to expect when you reach out to us for a project.
          </p>

          {/* Metadata badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(232,220,200,0.5)', marginBottom: '3px' }}>Last Updated</div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'white', fontWeight: 600 }}>November 2026</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(232,220,200,0.5)', marginBottom: '3px' }}>Company</div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'white', fontWeight: 600 }}>FORM &amp; SPACE BY VPS</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(232,220,200,0.5)', marginBottom: '3px' }}>Jurisdiction</div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'white', fontWeight: 600 }}>Punjab, India</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT SECTION ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4.5rem 2rem' }} className="legal-main-section">
        <div className="legal-layout-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3.5rem', alignItems: 'start' }}>

          {/* Sidebar Navigation */}
          <aside className="legal-sidebar" style={{ position: 'sticky', top: '100px' }}>
            <div
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(191,161,95,0.2)',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: tc, marginBottom: '1rem' }}>
                Quick Links
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {sections.map(sec => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(sec.id);
                      const el = document.getElementById(sec.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '13px',
                      color: activeSection === sec.id ? dark : '#6e655b',
                      fontWeight: activeSection === sec.id ? 600 : 400,
                      textDecoration: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      backgroundColor: activeSection === sec.id ? 'rgba(191,161,95,0.12)' : 'transparent',
                      borderLeft: activeSection === sec.id ? `2px solid ${tc}` : '2px solid transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    {sec.title}
                  </a>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11.5px', color: '#6e655b', marginBottom: '8px', fontWeight: 600 }}>
                  Questions? Contact us:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontFamily: 'Manrope, sans-serif', color: dark }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={13} style={{ color: tc }} /> vpsgroup02@gmail.com
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={13} style={{ color: tc }} /> +91 8427930197
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Terms Document Body */}
          <div
            style={{
              backgroundColor: 'white',
              border: '1px solid rgba(191,161,95,0.2)',
              borderRadius: '10px',
              padding: '3rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
            }}
            className="legal-content-card"
          >
            {/* 1. Using This Website */}
            <div id="using-site" style={{ marginBottom: '3rem', scrollMarginTop: '110px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <div style={{ width: '22px', height: '1px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: tc }}>
                  Section 01
                </span>
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 600, color: dark, marginBottom: '1rem' }}>
                Using This Website
              </h2>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14.5px', lineHeight: 1.8, color: '#4a443d' }}>
                By browsing this website or submitting an enquiry form, you agree to use the site fairly and for genuine project, architecture, or construction enquiries. Please provide accurate contact details so our team can reach you properly.
              </p>
            </div>

            {/* 2. Designs, Images & 360° Views */}
            <div id="visuals" style={{ marginBottom: '3rem', scrollMarginTop: '110px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <div style={{ width: '22px', height: '1px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: tc }}>
                  Section 02
                </span>
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 600, color: dark, marginBottom: '1rem' }}>
                Designs, Images &amp; 360° Views
              </h2>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14.5px', lineHeight: 1.8, color: '#4a443d' }}>
                The project photos, 3D renders, floor concepts, and 360° panoramic previews shown on this website are for general display and inspiration only. Actual construction results, finishes, and layouts depend on your plot size, site conditions, local building rules, and the final approved drawings.
              </p>
            </div>

            {/* 3. Estimates & No Website Guarantees */}
            <div id="no-guarantees" style={{ marginBottom: '3rem', scrollMarginTop: '110px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <div style={{ width: '22px', height: '1px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: tc }}>
                  Section 03
                </span>
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 600, color: dark, marginBottom: '1rem' }}>
                Estimates &amp; No Website Guarantees
              </h2>
              <div style={{ padding: '1.25rem', backgroundColor: 'rgba(191,161,95,0.08)', border: '1px solid rgba(191,161,95,0.22)', borderRadius: '6px', display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <AlertCircle size={17} style={{ color: tc, flexShrink: 0, marginTop: '3px' }} />
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', lineHeight: 1.75, color: '#4a443d', margin: 0 }}>
                  Information, price ranges, timelines, and service descriptions on this website are for general guidance only. <strong>Nothing on this website is a guarantee, warranty, or binding offer.</strong>
                </p>
              </div>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14.5px', lineHeight: 1.8, color: '#4a443d' }}>
                Exact project pricing, work scope, timelines, and post-handover terms are finalized only after a site review and are governed strictly by the written project agreement signed between you and FORM &amp; SPACE BY VPS .
              </p>
            </div>

            {/* 4. Content & Design Ownership */}
            <div id="ownership" style={{ marginBottom: '3rem', scrollMarginTop: '110px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <div style={{ width: '22px', height: '1px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: tc }}>
                  Section 04
                </span>
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 600, color: dark, marginBottom: '1rem' }}>
                Content &amp; Design Ownership
              </h2>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14.5px', lineHeight: 1.8, color: '#4a443d' }}>
                All text, logos, project photos, architectural concepts, and 3D visuals on this website belong to FORM &amp; SPACE BY VPS . Please do not copy, republish, or use our designs or website material for commercial purposes without asking us first.
              </p>
            </div>

            {/* 5. Project Information & Site Access */}
            <div id="client-info" style={{ marginBottom: '3rem', scrollMarginTop: '110px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <div style={{ width: '22px', height: '1px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: tc }}>
                  Section 05
                </span>
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 600, color: dark, marginBottom: '1rem' }}>
                Project Information &amp; Site Access
              </h2>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14.5px', lineHeight: 1.8, color: '#4a443d' }}>
                When we begin a consultation or project with you, accurate plot details, ownership papers, and safe site access help us plan properly. Construction timelines can also be affected by weather, material availability, or local government rules outside anyone&apos;s control.
              </p>
            </div>

            {/* 6. Updates to These Terms */}
            <div id="changes" style={{ marginBottom: '3rem', scrollMarginTop: '110px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <div style={{ width: '22px', height: '1px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: tc }}>
                  Section 06
                </span>
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 600, color: dark, marginBottom: '1rem' }}>
                Updates to These Terms
              </h2>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14.5px', lineHeight: 1.8, color: '#4a443d' }}>
                We may update these Terms of Use from time to time to keep them clear and accurate. Any updates will be posted on this page.
              </p>
            </div>

            {/* 7. Contact Us */}
            <div id="contact" style={{ scrollMarginTop: '110px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <div style={{ width: '22px', height: '1px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: tc }}>
                  Section 07
                </span>
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 600, color: dark, marginBottom: '1rem' }}>
                Contact Us
              </h2>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14.5px', lineHeight: 1.8, color: '#4a443d', marginBottom: '1.5rem' }}>
                If you have any questions about these Terms of Use, please contact us:
              </p>

              <div style={{ padding: '1.5rem', backgroundColor: '#131211', borderRadius: '8px', color: 'white', border: '1px solid rgba(191,161,95,0.3)' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'white', marginBottom: '0.5rem' }}>
                  FORM &amp; SPACE BY VPS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'Manrope, sans-serif', fontSize: '13.5px', color: 'rgba(232,220,200,0.8)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} style={{ color: tc, flexShrink: 0 }} /> <span><strong>Regional Office:</strong> Ground Floor Tarjas Hotel near Baba Chicken Mandi Mullanpur Dakha, Ludhiana, Punjab 141101</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} style={{ color: tc, flexShrink: 0 }} /> <span><strong>Phone:</strong> +91 8427930197</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} style={{ color: tc, flexShrink: 0 }} /> <span><strong>Email:</strong> vpsgroup02@gmail.com</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── BACK ACTION STRIP ── */}
        <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.5rem 0', borderTop: '1px solid rgba(191,161,95,0.25)' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: dark,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = tc)}
            onMouseLeave={e => (e.currentTarget.style.color = dark)}
          >
            <ArrowLeft size={16} /> Return to Home
          </Link>

          <Link
            to="/privacy-policy"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: tc,
              textDecoration: 'none',
            }}
          >
            Read Privacy Policy <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .legal-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .legal-sidebar {
            position: static !important;
          }
          .legal-content-card {
            padding: 1.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
