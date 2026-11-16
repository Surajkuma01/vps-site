import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects, filterCategories, type Project, type FilterCategory } from '../data/projects';
import { normalizeImageUrl } from '../utils/imageUrl';

interface ProjectsPortfolioProps {
  onProjectClick: (project: Project) => void;
}

export default function ProjectsPortfolio({ onProjectClick }: ProjectsPortfolioProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [animating, setAnimating] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSectionVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleFilter = (cat: FilterCategory) => {
    if (cat === activeFilter) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveFilter(cat);
      setFilteredProjects(cat === 'ALL' ? projects : projects.filter(p => p.category === cat));
      setAnimating(false);
    }, 300);
  };

  // Asymmetric grid layout classes
  const gridPositions = [
    { gridColumn: '1 / 2', gridRow: '1 / 2', aspectRatio: '4/3' },
    { gridColumn: '2 / 4', gridRow: '1 / 2', aspectRatio: '16/9' },
    { gridColumn: '1 / 3', gridRow: '2 / 3', aspectRatio: '16/9' },
    { gridColumn: '3 / 4', gridRow: '2 / 3', aspectRatio: '4/3' },
    { gridColumn: '1 / 2', gridRow: '3 / 4', aspectRatio: '3/4' },
    { gridColumn: '2 / 4', gridRow: '3 / 4', aspectRatio: '4/3' },
  ];

  return (
    <section id="portfolio" ref={sectionRef} style={{ backgroundColor: '#faf8f4', paddingTop: '6rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '4rem',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              SELECTED WORK
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: 300,
                color: '#1a1714',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
              }}
            >
              Spaces We've Built
            </h2>
            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 400,
                color: '#8a8278',
                maxWidth: '400px',
                lineHeight: 1.75,
              }}
            >
              FORM & SPACE BY VPS delivers carefully planned residential and commercial projects with meticulous attention to structure, materials, finishing, and execution.
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '3.5rem',
            flexWrap: 'wrap',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              style={{
                padding: '9px 20px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: '1px solid',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap',
                backgroundColor: activeFilter === cat ? '#1a1714' : 'transparent',
                borderColor: activeFilter === cat ? '#1a1714' : 'rgba(196, 181, 158, 0.5)',
                color: activeFilter === cat ? 'white' : '#8a8278',
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== cat) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#bfa15f';
                  (e.currentTarget as HTMLButtonElement).style.color = '#bfa15f';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== cat) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(196, 181, 158, 0.5)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#8a8278';
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid — Asymmetric Editorial */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
          className="projects-grid"
        >
          {filteredProjects.map((project, index) => {
            const pos = gridPositions[index % gridPositions.length];
            const isHovered = hoveredId === project.id;
            return (
              <div
                key={project.id}
                onClick={() => onProjectClick(project)}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  gridColumn: pos.gridColumn,
                  gridRow: pos.gridRow,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s',
                  boxShadow: isHovered
                    ? '0 20px 60px rgba(26, 23, 20, 0.2)'
                    : '0 4px 20px rgba(26, 23, 20, 0.06)',
                  aspectRatio: pos.aspectRatio,
                  opacity: sectionVisible ? 1 : 0,
                  transitionDelay: sectionVisible ? `${0.3 + index * 0.08}s` : '0s',
                }}
              >
                {/* Project Image */}
                <img
                  src={normalizeImageUrl(project.image)}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                  }}
                />

                {/* Gradient overlay always */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(10,8,5,0.75) 0%, rgba(10,8,5,0.1) 60%, transparent 100%)',
                    transition: 'opacity 0.3s',
                  }}
                />

                {/* Hover overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(10,8,5,0.35)',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.4s',
                  }}
                />

                {/* Category pill top */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    left: '1.25rem',
                    padding: '5px 12px',
                    backgroundColor: 'rgba(191, 161, 95, 0.95)',
                    borderRadius: '3px',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    color: 'white',
                    textTransform: 'uppercase',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {project.category}
                </div>

                {/* Year top right */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 500,
                  }}
                >
                  {project.year}
                </div>

                {/* Bottom content */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1.5rem 1.25rem',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: 'clamp(1.2rem, 2.2vw, 1.65rem)',
                      fontWeight: 500,
                      color: 'white',
                      marginBottom: '0.35rem',
                      lineHeight: 1.2,
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(232, 220, 200, 0.8)',
                      fontWeight: 400,
                      marginBottom: '0.75rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {project.location}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '12px',
                      color: 'rgba(232, 220, 200, 0.7)',
                      maxWidth: '300px',
                      lineHeight: 1.6,
                      display: isHovered ? 'block' : '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      transition: 'opacity 0.3s',
                      opacity: isHovered ? 1 : 0.9,
                    }}
                  >
                    {project.description}
                  </p>

                  {/* View Project CTA — shows on hover */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '1rem',
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 0.3s, transform 0.3s',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.15em',
                        color: '#bfa15f',
                        textTransform: 'uppercase',
                      }}
                    >
                      View Project
                    </span>
                    <ArrowUpRight size={14} color="#bfa15f" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#8a8278' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300 }}>
              No projects found in this category.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .projects-grid > * {
            grid-column: auto !important;
            grid-row: auto !important;
            aspect-ratio: 4/3 !important;
          }
        }
        @media (max-width: 600px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
          .projects-grid > * {
            grid-column: auto !important;
            grid-row: auto !important;
            aspect-ratio: 4/3 !important;
          }
        }
      `}</style>
    </section>
  );
}
