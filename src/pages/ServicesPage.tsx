import React, { useState } from 'react';
import {
  Building2, Home, ShoppingBag, Layers, Wrench, Sparkles,
  Eye, MessageSquare, ChevronRight, CheckCircle2, Calendar,
  Clock, ArrowUpRight, ShieldCheck, FileCheck, PhoneCall,
  HelpCircle, ChevronDown, Check
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { consultationPackages, type ServiceItem } from '../data/services';
import { sendEnquiryToSpreadsheet } from '../config/spreadsheet';
import { normalizeImageUrl } from '../utils/imageUrl';
import Footer from '../components/Footer';

// Map icon string name to Lucide component
const iconMap: Record<string, React.ReactElement> = {
  Building2: <Building2 size={24} />,
  MessageSquare: <MessageSquare size={24} />,
  Home: <Home size={24} />,
  ShoppingBag: <ShoppingBag size={24} />,
  Layers: <Layers size={24} />,
  Wrench: <Wrench size={24} />,
  Sparkles: <Sparkles size={24} />,
  Eye: <Eye size={24} />,
};

export default function ServicesPage() {
  const { services } = useSiteData();
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'Design' | 'Engineering' | 'Construction' | 'Consulting'>('ALL');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Consultation booking form state
  const [consultForm, setConsultForm] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'VIP Architectural Strategy Session',
    plotSize: '',
    location: '',
    preferredDate: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const tc = '#bfa15f';
  const dark = '#131211';

  const filteredServices = activeCategory === 'ALL'
    ? services
    : services.filter(s => s.category === activeCategory);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const result = await sendEnquiryToSpreadsheet({
      name: consultForm.name,
      phone: consultForm.phone,
      email: consultForm.email,
      projectType: consultForm.serviceType,
      location: consultForm.location,
      budget: consultForm.plotSize,
      message: consultForm.message,
      source: 'Services Page - Consultation Booking',
      sheetName: 'Consultations',
    });

    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setSubmitError(result.message);
    }
  };

  const faqs = [
    {
      q: 'What is included in the initial Architectural Consultation?',
      a: 'Our consultation includes a comprehensive site viability review, local municipal zoning and setback analysis, Vastu & solar alignment advisory, preliminary layout zoning sketches, and a phased, itemized construction cost estimation.'
    },
    {
      q: 'Do you offer Turnkey Construction or only Architectural Blueprinting?',
      a: 'We focus on architectural design, structural drawings, and advisory — we do not undertake turnkey construction ourselves. However, if you want turnkey execution, we can suggest reliable independent third-party turnkey contractors who execute the construction directly for you.'
    },
    {
      q: 'Can FORM & SPACE BY VPS handle statutory municipal approvals & sanctions?',
      a: 'Yes. Our architectural team drafts all compliance blueprints aligned with local building bylaws (PUDA, GMADA, Municipal Corporations) and liaises with structural authorities for timely sanctions.'
    },
    {
      q: 'How long does a complete architectural design process typically take?',
      a: 'For a luxury residence or commercial building, schematic concepts take 2–3 weeks, followed by 3–4 weeks for detailed structural, MEP, and working blueprints, allowing construction to commence within 6–8 weeks of engagement.'
    },
  ];

  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', color: '#3d3834' }}>

      {/* ── Editorial Hero ── */}
      <section
        style={{
          position: 'relative',
          paddingTop: '160px',
          paddingBottom: '100px',
          backgroundColor: '#161311',
          color: 'white',
          overflow: 'hidden',
        }}
        className="services-hero"
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.22,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(22,19,17,0.85) 0%, rgba(22,19,17,0.98) 100%)',
          }}
        />

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
            <div style={{ width: '32px', height: '1.5px', backgroundColor: tc }} />
            <span className="animate-letter-expand" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.28em', color: tc, textTransform: 'uppercase' }}>
              OUR ARCHITECTURAL PRACTICE
            </span>
          </div>

          <h1
            className="animate-text-reveal"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.8rem, 6vw, 5.2rem)',
              fontWeight: 300,
              color: 'white',
              lineHeight: 1.05,
              maxWidth: '900px',
              marginBottom: '1.75rem',
            }}
          >
            End-to-End <span className="text-shimmer-light">Architectural Mastery</span>, Engineering & Advisory
          </h1>

          <p
            className="animate-fade-in anim-delay-200"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(15px, 1.3vw, 17px)',
              color: 'rgba(232,220,200,0.8)',
              maxWidth: '680px',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
            }}
          >
            From conceptual massing and statutory approvals to architectural planning and strategic site consultations (plus third-party turnkey contractor suggestions when needed), FORM & SPACE BY VPS delivers spaces designed with clarity and care.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }} className="services-hero-ctas">
            <a
              href="#consultation-booking"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                backgroundColor: tc,
                color: 'white',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '4px',
                transition: 'background 0.25s',
              }}
            >
              Book Strategic Consultation <ArrowUpRight size={15} />
            </a>

            <a
              href="#services-grid"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 26px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.25)',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '4px',
                transition: 'all 0.25s',
              }}
            >
              Browse All Services <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Category Filter Bar ── */}
      <section id="services-grid" style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <div style={{ width: '20px', height: '1.5px', backgroundColor: tc }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: tc, textTransform: 'uppercase' }}>
                SERVICE DIRECTORY
              </span>
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: dark }}>
              Disciplines & Technical Capabilities
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} className="category-filter-bar">
            {(['ALL', 'Design', 'Engineering', 'Construction', 'Consulting'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '4px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: '1px solid',
                  backgroundColor: activeCategory === cat ? dark : 'white',
                  borderColor: activeCategory === cat ? dark : 'rgba(196,181,158,0.4)',
                  color: activeCategory === cat ? 'white' : '#736d64',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Services Cards Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }} className="services-cards-grid">
          {filteredServices.map(service => {
            const isConsult = service.id === 'consultation-service';
            return (
              <div
                key={service.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: isConsult ? `2px solid ${tc}` : '1px solid rgba(196,181,158,0.3)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 8px 30px rgba(26,23,20,0.04)',
                  position: 'relative',
                }}
                className="service-card-hover"
              >
                {isConsult && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      backgroundColor: tc,
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '3px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      zIndex: 2,
                    }}
                  >
                    Featured Advisory
                  </div>
                )}

                {/* Card Visual Header */}
                <div className="image-sheen-container" style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={normalizeImageUrl(service.image)}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="service-card-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(26,23,20,0.85) 0%, rgba(26,23,20,0.2) 60%)',
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 6 }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '6px',
                        backgroundColor: tc,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0,
                      }}
                    >
                      {iconMap[service.iconName] || <Building2 size={22} />}
                    </div>
                    <div>
                      <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Service {service.number}
                      </span>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#e09f7d', fontWeight: 700, textTransform: 'uppercase' }}>
                        {service.category}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3
                    className="hover-card-title"
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '1.75rem',
                      fontWeight: 500,
                      color: dark,
                      lineHeight: 1.15,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {service.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '13.5px',
                      color: '#6e675d',
                      lineHeight: 1.7,
                      marginBottom: '1.5rem',
                    }}
                  >
                    {service.description}
                  </p>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.18em', color: '#8a8278', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Key Deliverables
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {service.deliverables.slice(0, 3).map((d, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontFamily: 'Manrope, sans-serif', fontSize: '12.5px', color: '#4d4841' }}>
                          <CheckCircle2 size={14} color={tc} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>

                    {isConsult ? (
                      <a
                        href="#consultation-booking"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          width: '100%',
                          padding: '11px',
                          backgroundColor: tc,
                          color: 'white',
                          borderRadius: '4px',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          textDecoration: 'none',
                          transition: 'background 0.2s',
                        }}
                      >
                        Schedule 1-on-1 Consultation <ArrowUpRight size={13} />
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedService(service);
                          setTimeout(() => {
                            document.getElementById('service-detail-expanded')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                          }, 50);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          width: '100%',
                          padding: '11px',
                          backgroundColor: '#f5efe4',
                          border: '1px solid rgba(196,181,158,0.5)',
                          color: dark,
                          borderRadius: '4px',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = dark;
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = '#f5efe4';
                          e.currentTarget.style.color = dark;
                        }}
                      >
                        View Full Workflow & Specs <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── In-page Expanded Detail Card (Shows below grid without blur overlay) ── */}
        {selectedService && (
          <div
            id="service-detail-expanded"
            className="service-detail-expanded-box"
            style={{
              marginTop: '3.5rem',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: `2px solid ${tc}`,
              boxShadow: '0 20px 60px rgba(26,23,20,0.08)',
              padding: '3rem 2.5rem',
              position: 'relative',
              animation: 'serviceExpandAnim 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: tc, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {selectedService.category} &middot; SERVICE {selectedService.number} SPECIFICATION
                </span>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.4rem', color: dark, marginTop: '4px', fontWeight: 500 }}>
                  {selectedService.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: '#f5efe4',
                  border: '1px solid rgba(196,181,158,0.5)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: dark,
                  textTransform: 'uppercase',
                }}
              >
                Close Details &times;
              </button>
            </div>

            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '15px', color: '#524d45', lineHeight: 1.85, marginBottom: '2.5rem' }}>
              {selectedService.detailedOverview}
            </p>

            {/* 4-Step Technical Workflow */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#8a8278', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                TECHNICAL ARCHITECTURAL WORKFLOW
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                {selectedService.workflowSteps.map((ws, i) => (
                  <div key={i} style={{ backgroundColor: '#faf8f4', border: '1px solid rgba(196,181,158,0.35)', borderRadius: '6px', padding: '1.25rem' }}>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: tc, fontWeight: 700, marginBottom: '4px' }}>
                      0{i + 1}
                    </div>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 700, color: dark, marginBottom: '6px' }}>
                      {ws.step}
                    </div>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#736d64', lineHeight: 1.6 }}>
                      {ws.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Deliverables */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#8a8278', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                CONTRACTUAL ARCHITECTURAL DELIVERABLES
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                {selectedService.deliverables.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#3d3834' }}>
                    <Check size={15} color={tc} style={{ flexShrink: 0 }} /> {d}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(196,181,158,0.3)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#686055' }}>
                <strong>Ideal Project Types:</strong> {selectedService.idealFor}
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedService(null)}
                  style={{
                    padding: '11px 20px',
                    backgroundColor: 'transparent',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <a
                  href="#consultation-booking"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '11px 24px',
                    backgroundColor: tc,
                    color: 'white',
                    borderRadius: '4px',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  Book Consultation For This Service &rarr;
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      <style>{`
        @keyframes serviceExpandAnim {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── DEDICATED CONSULTATION SERVICE MODULE ── */}
      <section
        id="consultation-booking"
        style={{
          backgroundColor: '#161311',
          color: 'white',
          padding: '6rem 2rem',
          marginTop: '6rem',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <div style={{ width: '25px', height: '1.5px', backgroundColor: tc }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.28em', color: tc, textTransform: 'uppercase' }}>
                EXPERT STRATEGIC ADVISORY
              </span>
              <div style={{ width: '25px', height: '1.5px', backgroundColor: tc }} />
            </div>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                marginBottom: '1.25rem',
              }}
            >
              Architectural Consultation & Feasibility Service
            </h2>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '15px', color: 'rgba(232,220,200,0.75)', lineHeight: 1.8 }}>
              Book a direct 1-on-1 advisory session with our Principal Architect before committing to land purchase, contractor hiring, or blueprint approvals.
            </p>
          </div>

          {/* Consultation Tier Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4.5rem' }} className="consultation-packages-grid">
            {consultationPackages.map(pkg => (
              <div
                key={pkg.id}
                style={{
                  backgroundColor: pkg.isPopular ? '#201b17' : '#1b1815',
                  border: pkg.isPopular ? `2px solid ${tc}` : '1px solid rgba(196,181,158,0.2)',
                  borderRadius: '8px',
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {pkg.isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: tc,
                      color: 'white',
                      padding: '4px 16px',
                      borderRadius: '12px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Most Recommended
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: tc, marginBottom: '0.5rem' }}>
                  <Clock size={14} />
                  <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {pkg.duration}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.85rem', fontWeight: 500, color: 'white', marginBottom: '0.5rem' }}>
                  {pkg.name}
                </h3>

                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'rgba(232,220,200,0.65)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  {pkg.tagline}
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginBottom: '1.75rem', flex: 1 }}>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: '#9e9589', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    What We Audit & Deliver
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pkg.features.map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontFamily: 'Manrope, sans-serif', fontSize: '12.5px', color: 'rgba(255,255,255,0.85)' }}>
                        <CheckCircle2 size={14} color={tc} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '4px', padding: '12px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: tc, fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
                    Deliverable Report
                  </div>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11.5px', color: 'rgba(255,255,255,0.7)' }}>
                    {pkg.deliverable}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setConsultForm(f => ({ ...f, serviceType: pkg.name }));
                    document.getElementById('booking-form-box')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    width: '100%',
                    padding: '13px',
                    backgroundColor: pkg.isPopular ? tc : 'transparent',
                    border: pkg.isPopular ? 'none' : '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                >
                  Book This Session
                </button>
              </div>
            ))}
          </div>

          {/* Interactive Consultation Appointment Form */}
          <div
            id="booking-form-box"
            className="booking-form-box"
            style={{
              backgroundColor: '#1f1b18',
              borderRadius: '10px',
              border: '1px solid rgba(196,181,158,0.25)',
              padding: '3.5rem 3rem',
              maxWidth: '960px',
              margin: '0 auto',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(191,161,95,0.2)', color: tc, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: 'white', marginBottom: '0.75rem' }}>
                  Consultation Request Received
                </h3>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '15px', color: 'rgba(232,220,200,0.8)', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
                  Our lead architectural coordinator will contact you at <strong>{consultForm.phone || '+91 8427930197'}</strong> within 4 hours to verify site location and lock the calendar slot.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <a
                    href="https://wa.me/918427930197?text=Hello%20D%20Lam%20Infra,%20I%20have%20scheduled%20an%20architectural%20consultation."
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      backgroundColor: '#25D366',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    Confirm via WhatsApp Now
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    style={{
                      padding: '12px 20px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      borderRadius: '4px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: tc, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    CALENDAR RESERVATION
                  </div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: 'white', fontWeight: 400 }}>
                    Schedule Your Strategic Site & Blueprint Advisory
                  </h3>
                </div>

                <form onSubmit={handleBookingSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="consult-form-grid">
                  <div>
                    <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#c4b59e', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gurpreet Singh"
                      value={consultForm.name}
                      onChange={e => setConsultForm({ ...consultForm, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(196,181,158,0.3)',
                        borderRadius: '4px',
                        color: 'white',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#c4b59e', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={consultForm.phone}
                      onChange={e => setConsultForm({ ...consultForm, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(196,181,158,0.3)',
                        borderRadius: '4px',
                        color: 'white',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#c4b59e', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={consultForm.email}
                      onChange={e => setConsultForm({ ...consultForm, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(196,181,158,0.3)',
                        borderRadius: '4px',
                        color: 'white',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#c4b59e', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Advisory Package *
                    </label>
                    <select
                      value={consultForm.serviceType}
                      onChange={e => setConsultForm({ ...consultForm, serviceType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: '#26211d',
                        border: '1px solid rgba(196,181,158,0.3)',
                        borderRadius: '4px',
                        color: 'white',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    >
                      {consultationPackages.map(p => (
                        <option key={p.id} value={p.name}>{p.name} ({p.duration})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#c4b59e', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Plot / Site Location (City/Sector)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ludhiana / South City"
                      value={consultForm.location}
                      onChange={e => setConsultForm({ ...consultForm, location: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(196,181,158,0.3)',
                        borderRadius: '4px',
                        color: 'white',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#c4b59e', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Estimated Plot Size / Built Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500 sq. yards / 4,500 sq.ft."
                      value={consultForm.plotSize}
                      onChange={e => setConsultForm({ ...consultForm, plotSize: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(196,181,158,0.3)',
                        borderRadius: '4px',
                        color: 'white',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#c4b59e', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Specific Questions / Project Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your architectural vision, budget parameters, or specific zoning questions..."
                      value={consultForm.message}
                      onChange={e => setConsultForm({ ...consultForm, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(196,181,158,0.3)',
                        borderRadius: '4px',
                        color: 'white',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '13.5px',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2', marginTop: '0.5rem' }}>
                    {submitError && (
                      <div
                        style={{
                          padding: '12px 14px',
                          backgroundColor: 'rgba(220, 38, 38, 0.15)',
                          border: '1px solid rgba(220, 38, 38, 0.4)',
                          borderRadius: '4px',
                          color: '#fca5a5',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '12.5px',
                          marginBottom: '1rem',
                        }}
                      >
                        {submitError}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        width: '100%',
                        padding: '16px',
                        backgroundColor: submitting ? '#8c7442' : tc,
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.8 : 1,
                        transition: 'background 0.25s',
                      }}
                      onMouseEnter={e => !submitting && (e.currentTarget.style.backgroundColor = '#a56245')}
                      onMouseLeave={e => !submitting && (e.currentTarget.style.backgroundColor = tc)}
                    >
                      {submitting ? 'Recording Consultation...' : 'Confirm Consultation Booking →'}
                    </button>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11.5px', color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginTop: '12px' }}>
                      Strictly Confidential &middot; Principal Architect Attendance Guaranteed
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 5-Stage Project Delivery Roadmap ── */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <div style={{ width: '25px', height: '1.5px', backgroundColor: tc }} />
            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.25em', color: tc, textTransform: 'uppercase' }}>
              HOW WE OPERATE
            </span>
            <div style={{ width: '25px', height: '1.5px', backgroundColor: tc }} />
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', fontWeight: 400, color: dark }}>
            The 5-Stage Architectural Lifecycle
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {[
            { num: '01', title: 'Site Due Diligence', desc: 'Topography survey, soil bearing calculations, solar angles, and local municipal zoning analysis.' },
            { num: '02', title: 'Conceptual Massing', desc: 'Iterative 3D volumes, floorplate flow, daylight penetration, and visual spatial renderings.' },
            { num: '03', title: 'Engineering & BIM', desc: 'STAAD structural calculations, clash-free MEP layouts, and statutory authority sanctions.' },
            { num: '04', title: 'Contractor Advisory', desc: 'Design clarification and optional third-party turnkey contractor suggestions (execution by third party, not by us).' },
            { num: '05', title: 'Commission & Handover', desc: '120-point quality audit, as-built documentation dossier, and structural warranty handover.' },
          ].map((stage, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(196,181,158,0.3)',
                borderRadius: '8px',
                padding: '2rem 1.5rem',
                position: 'relative',
              }}
            >
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: tc, fontWeight: 300, lineHeight: 1, marginBottom: '1rem' }}>
                {stage.num}
              </div>
              <h4 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 700, color: dark, marginBottom: '0.75rem' }}>
                {stage.title}
              </h4>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12.5px', color: '#6e675d', lineHeight: 1.7, margin: 0 }}>
                {stage.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '0 2rem 7rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: dark }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', color: '#7a7369' }}>
            Everything you need to know regarding our practice, fees, and execution framework.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(196,181,158,0.35)',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 500, color: dark }}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  color={tc}
                  style={{
                    transform: activeFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s',
                    flexShrink: 0,
                  }}
                />
              </button>

              {activeFaq === i && (
                <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', fontFamily: 'Manrope, sans-serif', fontSize: '13.5px', color: '#5e5951', lineHeight: 1.75 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <style>{`
        .service-card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(26,23,20,0.12) !important;
        }
        @media (max-width: 768px) {
          .consult-form-grid {
            grid-template-columns: 1fr !important;
          }
          .consult-form-grid > div {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
