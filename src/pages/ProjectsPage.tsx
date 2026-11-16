import React, { useState } from 'react';
import {
  ArrowUpRight, MapPin, Calendar, Ruler, Compass,
  Building, Sparkles, Filter, CheckCircle2, Hammer
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { type Project, type FilterCategory, filterCategories } from '../data/projects';
import { normalizeImageUrl } from '../utils/imageUrl';
import ProjectDetail from '../components/ProjectDetail';
import EnquiryForm from '../components/EnquiryForm';
import Footer from '../components/Footer';

export default function ProjectsPage() {
  const { projects } = useSiteData();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [inquiryProjectTitle, setInquiryProjectTitle] = useState('');

  const tc = '#bfa15f';
  const dark = '#131211';

  // Extract ongoing live projects
  const liveProjects = projects.filter(p => p.isLive || p.status === 'Under Construction');

  // Filter projects by category
  const filteredProjects = activeFilter === 'ALL'
    ? projects
    : activeFilter === 'Live Projects'
      ? liveProjects
      : projects.filter(p => p.category === activeFilter);

  const handleBookConsultation = (projectTitle: string) => {
    setInquiryProjectTitle(projectTitle);
    setEnquiryOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', color: '#3d3834' }}>

      {/* ── Editorial Portfolio Hero ── */}
      <section
        className="projects-hero"
        style={{
          position: 'relative',
          paddingTop: '160px',
          paddingBottom: '90px',
          backgroundColor: '#161311',
          color: 'white',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2,
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
              ARCHITECTURAL ARCHIVE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h1
                className="animate-text-reveal"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                  fontWeight: 300,
                  color: 'white',
                  lineHeight: 1.05,
                  maxWidth: '850px',
                  marginBottom: '1rem',
                }}
              >
                Selected Works, <span className="text-shimmer-light">Spatial Landmarks</span> & Live Builds
              </h1>
              <p className="animate-fade-in anim-delay-200" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '15px', color: 'rgba(232,220,200,0.75)', maxWidth: '640px', lineHeight: 1.75 }}>
                Explore our curated portfolio across luxury residences, high-performance office towers, experiential retail boutiques, and active on-site construction works.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(196,181,158,0.25)',
                padding: '1.25rem 2rem',
                borderRadius: '6px',
              }}
              className="stats-quick-pill"
            >
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: tc, lineHeight: 1, fontWeight: 400 }}>
                  {projects.length}
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Total Works
                </div>
              </div>
              <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#81c784', lineHeight: 1, fontWeight: 400 }}>
                  {liveProjects.length}
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Live Active Builds
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEDICATED LIVE PROJECTS SECTION ── */}
      {liveProjects.length > 0 && (
        <section
          style={{
            backgroundColor: '#12100f',
            color: 'white',
            padding: '4.5rem 2rem',
            borderBottom: '1px solid rgba(196,181,158,0.2)',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4caf50', animation: 'livePulse 1.5s infinite' }} />
                  <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.25em', color: '#81c784', textTransform: 'uppercase' }}>
                    ON-SITE SURVEILLANCE
                  </span>
                </div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'white' }}>
                  Live Construction & Ongoing Developments
                </h2>
              </div>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'rgba(232,220,200,0.65)', maxWidth: '400px', lineHeight: 1.6 }}>
                Active architectural and third-party executed sites currently in progress. We provide design oversight and progress tracking alongside independent site contractors.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }} className="live-projects-grid">
              {liveProjects.map(project => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  style={{
                    backgroundColor: '#1c1916',
                    border: '1px solid rgba(196,181,158,0.25)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                  }}
                  className="live-card-hover"
                >
                  <div className="image-sheen-container" style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                    <img src={normalizeImageUrl(project.image)} alt={project.title} className="live-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,22,0.9) 0%, rgba(28,25,22,0.2) 60%)' }} />

                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '8px', zIndex: 6 }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 12px',
                          backgroundColor: '#2e7d32',
                          borderRadius: '3px',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '10px',
                          fontWeight: 700,
                          color: 'white',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        }}
                      >
                        <span className="badge-live-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#a5d6a7' }} />
                        {project.progress || 70}% Complete
                      </span>
                    </div>

                    <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem', zIndex: 6 }}>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: tc, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        {project.category} &middot; {project.location}
                      </div>
                      <h3 className="hover-card-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.65rem', color: 'white', fontWeight: 500 }}>
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    {/* Progress Bar */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                          Current Phase: {project.currentPhase || 'Superstructure & Façade'}
                        </span>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: tc, fontWeight: 700 }}>
                          ETA: {project.estimatedHandover || '2025'}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${project.progress || 70}%`,
                            height: '100%',
                            backgroundColor: tc,
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                    </div>

                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12.5px', color: 'rgba(232,220,200,0.65)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {project.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                      <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11.5px', color: 'rgba(255,255,255,0.5)' }}>
                        Area: {project.area}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: tc, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Inspect Live Blueprint & 360 <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PORTFOLIO CATEGORY FILTER & PROJECT GRID ── */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '5rem 2rem' }}>

        {/* Filter Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            borderBottom: '1px solid rgba(196,181,158,0.3)',
            paddingBottom: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} className="project-filter-bar">
            {filterCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '4px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: '1px solid',
                  backgroundColor: activeFilter === cat ? dark : 'transparent',
                  borderColor: activeFilter === cat ? dark : 'rgba(196,181,158,0.5)',
                  color: activeFilter === cat ? 'white' : '#6b655c',
                  transition: 'all 0.25s',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat} {cat === 'Live Projects' && `(${liveProjects.length})`}
              </button>
            ))}
          </div>

          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#8a8278', fontWeight: 600 }}>
            Showing {filteredProjects.length} of {projects.length} Works
          </div>
        </div>

        {/* Dynamic Project Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2.5rem',
          }}
          className="projects-main-grid"
        >
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid rgba(196,181,158,0.3)',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease',
                boxShadow: '0 4px 20px rgba(26,23,20,0.04)',
              }}
              className="project-grid-card"
            >
              {/* Image Container */}
              <div className="image-sheen-container" style={{ position: 'relative', height: '280px', overflow: 'hidden', backgroundColor: '#1a1714' }}>
                <img
                  src={normalizeImageUrl(project.image)}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  className="project-card-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(26,23,20,0.8) 0%, rgba(26,23,20,0.1) 60%)',
                  }}
                />

                {/* Top Badges */}
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '8px', zIndex: 6 }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'rgba(26,23,20,0.85)',
                      backdropFilter: 'blur(6px)',
                      color: 'white',
                      borderRadius: '3px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {project.category}
                  </span>

                  {project.isLive && (
                    <span
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        borderRadius: '3px',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Live &middot; {project.progress || 75}%
                    </span>
                  )}
                </div>

                {/* 360 View Indicator Pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: dark,
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 6,
                  }}
                >
                  <Compass size={13} color={tc} /> 360°
                </div>

                {/* Bottom Overlay Meta */}
                <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem', zIndex: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontFamily: 'Manrope, sans-serif' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} color={tc} /> {project.location}
                    </span>
                    <span>&middot;</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} color={tc} /> {project.year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3
                  className="hover-card-title"
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.85rem',
                    fontWeight: 500,
                    color: dark,
                    lineHeight: 1.15,
                    marginBottom: '0.65rem',
                  }}
                >
                  {project.title}
                </h3>

                <p
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '13px',
                    color: '#6e675d',
                    lineHeight: 1.7,
                    marginBottom: '1.5rem',
                  }}
                >
                  {project.description}
                </p>

                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(196,181,158,0.25)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11.5px', color: '#8a8278', fontWeight: 600 }}>
                    Footprint: {project.area}
                  </span>

                  <span
                    className="link-hover-swipe"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: tc,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Explore Project <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECT DETAIL MODAL (React Portal, fully scrollable) ── */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          allProjects={filteredProjects}
          onClose={() => setSelectedProject(null)}
          onNavigate={setSelectedProject}
          onBookConsultation={handleBookConsultation}
        />
      )}

      {/* ── Global Enquiry Modal ── */}
      <EnquiryForm
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        initialSubject={inquiryProjectTitle ? `Inquiry for project: ${inquiryProjectTitle}` : undefined}
        sheetName="Projects"
        sourceLabel="Projects Page - Project Inquiry"
      />

      <Footer />

      <style>{`
        @keyframes livePulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .live-card-hover:hover {
          transform: translateY(-5px);
          border-color: ${tc} !important;
        }
        .project-grid-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(26,23,20,0.12) !important;
        }
        .project-grid-card:hover .project-card-img {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .stats-quick-pill { display: none !important; }
        }
      `}</style>
    </div>
  );
}
