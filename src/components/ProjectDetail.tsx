import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, MapPin, Calendar, ArrowLeft, ArrowRight, ArrowUpRight, 
  ChevronLeft, Compass, Layers, CheckCircle2, RotateCw, 
  Maximize2, Eye, Ruler, Building, Sun, Moon, MoveHorizontal, 
  Sparkles, Crosshair, Info
} from 'lucide-react';
import { type Project } from '../data/projects';
import { normalizeImageUrl } from '../utils/imageUrl';

/* ════════════════════════════════════════════════════════════
   ADVANCED 360° PANORAMIC VIEWER COMPONENT
   — CSS 3D cylindrical projection with drag/pinch/keyboard
   — Scan-line, hotspots, depth-vignette, compass HUD
════════════════════════════════════════════════════════════ */
const tc360 = '#bfa15f';

interface Viewer360Props {
  angleViews: string[];
  angleLabels: string[];
  lightingMode: 'daylight' | 'twilight';
  isRotating: boolean;
  tc: string;
}

function Advanced360Viewer({ angleViews, angleLabels, lightingMode, isRotating, tc }: Viewer360Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── state ── */
  const [yaw,          setYaw]          = useState(0);   // horizontal rotation (deg)
  const [pitch,        setPitch]        = useState(0);   // vertical tilt (deg, clamped)
  const [fov,          setFov]          = useState(100); // field-of-view zoom proxy (100 = exact 1:1, no zoom)
  const [viewFit,      setViewFit]      = useState<'contain' | 'cover'>('contain'); // default 100% exact uncropped
  const [activeAngle,  setActiveAngle]  = useState(0);
  const [isDragging,   setIsDragging]   = useState(false);
  const [lastPos,      setLastPos]      = useState({ x: 0, y: 0 });
  const [activeHotspot,setActiveHotspot]= useState<number | null>(null);
  const [imgKey,       setImgKey]       = useState(0);   // triggers crossfade
  const [gyroSupport,  setGyroSupport]  = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rotTimerRef    = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const animRef        = useRef<number | undefined>(undefined);

  /* ── image changes → crossfade ── */
  useEffect(() => { setImgKey(k => k + 1); }, [activeAngle]);

  /* ── auto-rotate ── */
  useEffect(() => {
    clearInterval(rotTimerRef.current);
    if (isRotating) {
      rotTimerRef.current = setInterval(() => {
        setYaw(y => y + 0.35);
        setActiveAngle(prev => {
          const newYaw = yaw + 0.35;
          return Math.floor(((newYaw % 360) + 360) / 90) % angleViews.length;
        });
      }, 30);
    }
    return () => clearInterval(rotTimerRef.current);
  }, [isRotating, angleViews.length, yaw]);

  /* ── keyboard nav ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  { setYaw(y => y - 5); setActiveAngle(a => (a - 1 + angleViews.length) % angleViews.length); }
      if (e.key === 'ArrowRight') { setYaw(y => y + 5); setActiveAngle(a => (a + 1) % angleViews.length); }
      if (e.key === 'ArrowUp')    setPitch(p => Math.min(30, p - 3));
      if (e.key === 'ArrowDown')  setPitch(p => Math.max(-30, p + 3));
      if (e.key === '+')          setFov(f => Math.max(40, f - 5));
      if (e.key === '-')          setFov(f => Math.min(100, f + 5));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [angleViews.length]);

  /* ── mouse/touch drag ── */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setYaw(y => {
      const next = y - dx * (fov / 120);
      return next;
    });
    setPitch(p => Math.max(-30, Math.min(30, p + dy * 0.15)));
    setLastPos({ x: e.clientX, y: e.clientY });

    // update angle index based on yaw
    setYaw(prev => {
      const norm = ((prev % 360) + 360) % 360;
      setActiveAngle(Math.round(norm / 90) % angleViews.length);
      return prev;
    });
  }, [isDragging, lastPos, fov, angleViews.length]);

  const onPointerUp = useCallback(() => setIsDragging(false), []);

  /* ── pinch-to-zoom (wheel) ── */
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setFov(f => Math.max(40, Math.min(100, f + e.deltaY * 0.05)));
  }, []);

  /* ── fullscreen toggle ── */
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  /* ── derived CSS pan factor ── */
  const normYaw   = ((yaw % 360) + 360) % 360;   // 0-360
  const bgOffsetX = (normYaw / 360) * 100;         // 0-100%
  const bgOffsetY = 50 - pitch;                    // center ± tilt

  /* ── lighting filter ── */
  const imgFilter = lightingMode === 'twilight'
    ? 'contrast(1.18) brightness(0.82) saturate(1.25) sepia(0.22) hue-rotate(-8deg)'
    : `contrast(${1 + (100 - fov) * 0.003}) brightness(${0.98 + (100 - fov) * 0.002}) saturate(1.05)`;

  /* ── hotspots ── */
  const hotspots = [
    { id: 1, azimuth: 20,  elevation: 42, title: 'Curtain Wall Facade',      desc: 'Double-glazed Low-E acoustic glass with thermal bridge insulation.' },
    { id: 2, azimuth: 160, elevation: 30, title: 'Cantilevered Portico',     desc: 'Post-tensioned architectural concrete canopy spanning 4.8 m.' },
    { id: 3, azimuth: 280, elevation: 66, title: 'Natural Travertine Cladding', desc: 'Ventilated dry-fixed stone rainscreen for climate resilience.' },
  ];

  const visibleHotspots = hotspots.filter(h => {
    const diff = Math.abs(((h.azimuth - normYaw) % 360 + 360) % 360);
    return diff < fov * 0.7 || diff > 360 - fov * 0.7;
  });

  /* ── compute hotspot screen position ── */
  const getHotspotPos = (azimuth: number, elevation: number) => {
    let relAngle = ((azimuth - normYaw) % 360 + 360) % 360;
    if (relAngle > 180) relAngle -= 360; // -180..180
    const x = 50 + (relAngle / fov) * 100 * 0.5;
    const y = elevation - pitch;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(10, Math.min(90, y)) };
  };

  return (
    <div
      style={{
        backgroundColor: '#100d0b',
        borderRadius: '12px',
        padding: '1.5rem',
        color: 'white',
        boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
        border: '1px solid rgba(196,181,158,0.2)',
      }}
    >
      {/* ── Viewport ── */}
      <div
        ref={containerRef}
        className="viewer-360-wrap"
        style={{
          position: 'relative',
          width: '100%',
          height: isFullscreen ? '100vh' : 'clamp(320px, 55vh, 560px)',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#0a0807',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        {/* ── Angle Image — exact 100% uncropped view with objectFit: contain ── */}
        <div
          key={imgKey}
          className="viewer-img-enter"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={angleViews[activeAngle % angleViews.length]}
            alt={angleLabels[activeAngle % angleLabels.length] || `Angle ${activeAngle + 1}`}
            referrerPolicy="no-referrer"
            style={{
              width: '100%',
              height: '100%',
              objectFit: viewFit,
              transform: `scale(${100 / fov}) translateY(${-pitch * 0.4}px)`,
              transition: isDragging ? 'none' : 'transform 0.12s ease',
              filter: imgFilter,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* ── Depth vignette ── */}
        <div className="viewer-360-vignette" />

        {/* ── Scan line (only when dragging / rotating) ── */}
        {(isDragging || isRotating) && <div className="viewer-360-scan" />}

        {/* ── Twilight colour grade ── */}
        {lightingMode === 'twilight' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 60% 40%, rgba(255,120,30,0.12) 0%, rgba(10,5,30,0.5) 100%)',
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
              zIndex: 4,
            }}
          />
        )}

        {/* ── HUD top-left: Compass ── */}
        <div
          className="hud-compass"
          style={{
            position: 'absolute',
            top: '1.2rem',
            left: '1.2rem',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(16,13,11,0.88)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(191,161,95,0.35)',
            borderRadius: '8px',
            padding: '8px 14px',
            boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
          }}
        >
          {/* Animated compass dial */}
          <div style={{ position: 'relative', width: '34px', height: '34px', flexShrink: 0 }}>
            <svg width="34" height="34" viewBox="0 0 34 34">
              <circle cx="17" cy="17" r="15" stroke="rgba(191,161,95,0.4)" strokeWidth="1.5" fill="none" />
              <circle cx="17" cy="17" r="11" stroke="rgba(191,161,95,0.2)" strokeWidth="1" fill="none" />
              {/* N marker */}
              <g transform={`rotate(${-normYaw} 17 17)`}>
                <line x1="17" y1="4" x2="17" y2="14" stroke={tc} strokeWidth="2" strokeLinecap="round" />
                <polygon points="17,3 14.5,10 19.5,10" fill={tc} />
                <line x1="17" y1="20" x2="17" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                <text x="17" y="10" fill={tc} fontSize="5" textAnchor="middle" dy="-3" fontFamily="Manrope,sans-serif" fontWeight="700">N</text>
              </g>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '9px', color: '#8a8278', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
              {Math.round(normYaw)}° AZIMUTH
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', color: 'white', fontWeight: 600 }}>
              {angleLabels[activeAngle % angleLabels.length]}
            </div>
          </div>
        </div>

        {/* ── HUD top-right: Controls ── */}
        <div
          className="hud-controls"
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {/* Drag hint pill */}
          <div
            className="hud-hint-pill"
            style={{
              backgroundColor: 'rgba(16,13,11,0.85)',
              backdropFilter: 'blur(10px)',
              padding: '5px 12px',
              borderRadius: '30px',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <MoveHorizontal size={12} color={tc} />
            <span className="hud-hint-text">Drag to Orbit · Scroll to Zoom</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-end' }}>
            {/* 100% Exact Fit vs Fill Toggle */}
            <button
              type="button"
              onClick={() => {
                setViewFit(f => f === 'contain' ? 'cover' : 'contain');
                setFov(100);
                setPitch(0);
              }}
              title="Toggle between 100% Uncropped Exact Fit and Fill"
              style={{
                backgroundColor: 'rgba(16,13,11,0.85)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${viewFit === 'contain' ? tc : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '6px',
                padding: '5px 10px',
                fontSize: '10px',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                cursor: 'pointer',
                color: viewFit === 'contain' ? tc : 'white',
              }}
            >
              {viewFit === 'contain' ? '✓ 100% Exact Fit' : 'Fill'}
            </button>

            {/* Reset Zoom */}
            {fov !== 100 && (
              <button
                type="button"
                onClick={() => { setFov(100); setPitch(0); }}
                title="Reset zoom to 100% exact"
                style={{
                  backgroundColor: 'rgba(16,13,11,0.85)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${tc}`,
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '10px',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: tc,
                }}
              >
                1:1
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              style={{
                backgroundColor: 'rgba(16,13,11,0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'background 0.25s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = tc)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(16,13,11,0.85)')}
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {/* ── FOV zoom progress bar ── */}
        <div
          style={{
            position: 'absolute',
            left: '1.2rem',
            bottom: '4.5rem',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Zoom</span>
          <div style={{ width: '4px', height: '80px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: `${((100 - fov) / 60) * 100}%`,
                background: `linear-gradient(to top, ${tc}, rgba(191,161,95,0.4))`,
                borderRadius: '2px',
                transition: 'height 0.2s',
              }}
            />
          </div>
        </div>

        {/* ── Architectural Hotspots ── */}
        {visibleHotspots.map(spot => {
          const pos = getHotspotPos(spot.azimuth, spot.elevation);
          return (
            <div
              key={spot.id}
              style={{
                position: 'absolute',
                top: `${pos.y}%`,
                left: `${pos.x}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 15,
              }}
            >
              {/* Pulsing rings */}
              <div className="hotspot-ring" />
              <div className="hotspot-ring hotspot-ring-2" />
              <button
                onClick={e => { e.stopPropagation(); setActiveHotspot(a => a === spot.id ? null : spot.id); }}
                style={{
                  position: 'relative',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: activeHotspot === spot.id ? 'white' : tc,
                  border: `2px solid ${activeHotspot === spot.id ? tc : 'white'}`,
                  color: activeHotspot === spot.id ? tc : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: `0 0 20px rgba(191,161,95,${activeHotspot === spot.id ? 1 : 0.6})`,
                  transition: 'all 0.3s',
                  animation: activeHotspot === spot.id ? 'none' : 'hotspotPulse 2.2s infinite',
                }}
              >
                <Crosshair size={12} />
              </button>

              {/* Popover */}
              {activeHotspot === spot.id && (
                <div
                  className="hotspot-popover"
                  style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#1a1512',
                    border: `1px solid ${tc}`,
                    borderRadius: '8px',
                    padding: '14px 16px',
                    width: '240px',
                    maxWidth: 'calc(100vw - 40px)',
                    boxShadow: '0 16px 45px rgba(0,0,0,0.6)',
                    zIndex: 25,
                    animation: 'fadeInUp 0.3s cubic-bezier(0.16,1,0.3,1)',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <div style={{ width: '100%', height: '2px', background: `linear-gradient(90deg, ${tc}, transparent)`, marginBottom: '10px', borderRadius: '1px' }} />
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '9px', color: tc, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Architectural Spec
                  </div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: 'white', fontWeight: 600, marginBottom: '6px' }}>
                    {spot.title}
                  </div>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11.5px', color: 'rgba(232,220,200,0.75)', lineHeight: 1.5 }}>
                    {spot.desc}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ── Bottom orbit dial ── */}
        <div
          className="angle-dial-container"
          style={{
            position: 'absolute',
            bottom: '1.4rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(16,13,11,0.9)',
            backdropFilter: 'blur(14px)',
            padding: '6px 14px',
            borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            maxWidth: 'calc(100% - 1.5rem)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {angleViews.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setActiveAngle(i); setYaw(i * 90); }}
              style={{
                padding: '5px 14px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: activeAngle === i ? tc : 'rgba(255,255,255,0.1)',
                color: 'white',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                transform: activeAngle === i ? 'scale(1.1)' : 'scale(1)',
                letterSpacing: '0.05em',
              }}
            >
              {i * 90}°
            </button>
          ))}
        </div>

        {/* ── Corner bracket decoration ── */}
        <style>{`
          .viewer-360-wrap::before,
          .viewer-360-wrap::after { z-index: 18; }
        `}</style>
      </div>

      {/* ── Bottom legend & controls ── */}
      <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
            <Crosshair size={14} color={tc} /> Click glowing pins to inspect specs
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
            <MoveHorizontal size={14} color={tc} /> Drag · Scroll to zoom · Arrow keys
          </span>
        </div>
        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: tc, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Vantage {activeAngle + 1} of {angleViews.length}
        </span>
      </div>

      <style>{`
        @keyframes hotspotPulse {
          0%   { box-shadow: 0 0 0 0   rgba(191,161,95,0.9); }
          70%  { box-shadow: 0 0 0 12px rgba(191,161,95,0); }
          100% { box-shadow: 0 0 0 0   rgba(191,161,95,0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}



interface ProjectDetailProps {
  project: Project;
  allProjects?: Project[];
  onClose: () => void;
  onNavigate: (project: Project) => void;
  onBookConsultation?: (projectTitle: string) => void;
}

export default function ProjectDetail({ 
  project, 
  allProjects = [],
  onClose, 
  onNavigate,
  onBookConsultation 
}: ProjectDetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [galleryFit, setGalleryFit] = useState<'contain' | 'cover'>('contain'); // 100% exact uncropped by default
  const [activeBlueprint, setActiveBlueprint] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | '360' | 'blueprint'>('gallery');
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [lightingMode, setLightingMode] = useState<'daylight' | 'twilight'>('daylight');
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Normalized asset URLs (auto-converts Google Drive links)
  const normalizedCover = normalizeImageUrl(project.image);
  const normalizedGallery = (project.gallery && project.gallery.length > 0 ? project.gallery : [project.image]).map(normalizeImageUrl);
  const normalizedBlueprints = (project.blueprints || []).map(normalizeImageUrl).filter(Boolean);
  const rawAngleViews = project.views360 && project.views360.length > 0 
    ? project.views360 
    : normalizedGallery.length > 0 ? normalizedGallery : [normalizedCover];
  const angleViews = rawAngleViews.map(normalizeImageUrl);

  const angleLabels = ['0° Front Elevation', '90° Right Profile', '180° Rear Garden', '270° Left Profile'];

  const currentIndex = allProjects.length > 0 
    ? allProjects.findIndex(p => p.id === project.id)
    : -1;
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1 
    ? allProjects[currentIndex + 1] 
    : null;

  // Lock body scroll and scroll modal to top whenever project changes
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setActiveImage(0);
    setActiveAngleIndex(0);
    setViewMode('gallery');
    setHeroLoaded(false);

    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [project.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && nextProject) onNavigate(nextProject);
      if (e.key === 'ArrowLeft' && prevProject) onNavigate(prevProject);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextProject, prevProject, onClose, onNavigate]);

  // Auto 360 rotation effect if activated
  useEffect(() => {
    let timer: any;
    if (isRotating && angleViews.length > 1) {
      timer = setInterval(() => {
        setActiveAngleIndex(prev => (prev + 1) % angleViews.length);
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isRotating, angleViews.length]);

  const tc = '#bfa15f';

  const modalContent = (
    <div
      ref={modalScrollRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#faf8f5',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="project-detail-scroll-container"
    >
      {/* Top Floating Action Bar */}
      <header
        className="detail-header-bar"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: 'rgba(26, 23, 20, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(196,181,158,0.2)',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={onClose}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            padding: '7px 16px',
            cursor: 'pointer',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = tc;
            e.currentTarget.style.borderColor = tc;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
        >
          <ChevronLeft size={15} /> Back to Portfolio
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
            className="hide-mobile"
          >
            {project.category} &middot; {project.location}
          </span>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = tc)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="project-detail-hero" style={{ position: 'relative', width: '100%', minHeight: '65vh', height: '65vh', overflow: 'hidden', backgroundColor: '#1a1714' }}>
        <img
          src={normalizedCover}
          alt={project.title}
          onLoad={() => setHeroLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: heroLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(26,23,20,0.3) 0%, rgba(26,23,20,0.65) 60%, rgba(26,23,20,0.95) 100%)',
          }}
        />

        {/* Hero Meta Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: 0,
            right: 0,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                backgroundColor: tc,
                borderRadius: '3px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: 'white',
                textTransform: 'uppercase',
              }}
            >
              {project.category}
            </span>

            {project.isLive ? (
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
                  letterSpacing: '0.15em',
                  color: 'white',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#a5d6a7', animation: 'pulse 1.8s infinite' }} />
                Live Project &middot; {project.progress || 75}% Complete
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '3px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: 'white',
                  textTransform: 'uppercase',
                }}
              >
                {project.status}
              </span>
            )}
          </div>

          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
              fontWeight: 400,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '1rem',
              letterSpacing: '-0.01em',
            }}
          >
            {project.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', color: 'rgba(232,220,200,0.85)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color={tc} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}>{project.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color={tc} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}>{project.year}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Ruler size={15} color={tc} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}>{project.area}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Construction Meter (if live) */}
      {project.isLive && (
        <div style={{ backgroundColor: '#13110f', borderBottom: '1px solid rgba(196,181,158,0.2)', padding: '1.25rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={16} color={tc} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 700, color: 'white', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Current Milestone: {project.currentPhase || 'Under Active Construction'}
                </span>
              </div>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: tc, fontWeight: 700 }}>
                {project.progress || 75}% / Target: {project.estimatedHandover || '2025'}
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${project.progress || 75}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #bfa15f 0%, #dfc796 100%)',
                  borderRadius: '3px',
                  transition: 'width 1s ease',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Media Section: Gallery & 360° Panoramic Viewer */}
      <section className="detail-media-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 2rem 0', width: '100%' }}>
        {/* Media Mode Tabs */}
        <div
          className="media-tabs"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(196,181,158,0.3)',
            paddingBottom: '1rem',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setViewMode('gallery')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                border: '1px solid',
                backgroundColor: viewMode === 'gallery' ? '#1a1714' : 'transparent',
                borderColor: viewMode === 'gallery' ? '#1a1714' : 'rgba(196,181,158,0.5)',
                color: viewMode === 'gallery' ? 'white' : '#5a5650',
                transition: 'all 0.25s',
              }}
            >
              <Eye size={14} /> High-Res Gallery ({normalizedGallery.length})
            </button>

            <button
              onClick={() => setViewMode('360')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                border: '1px solid',
                backgroundColor: viewMode === '360' ? '#bfa15f' : 'transparent',
                borderColor: viewMode === '360' ? '#bfa15f' : 'rgba(196,181,158,0.5)',
                color: viewMode === '360' ? 'white' : '#5a5650',
                transition: 'all 0.25s',
              }}
            >
              <Compass size={14} /> 360° Multi-Angle View ({angleViews.length} Angles)
            </button>

            {normalizedBlueprints.length > 0 && (
              <button
                onClick={() => setViewMode('blueprint')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  border: '1px solid',
                  backgroundColor: viewMode === 'blueprint' ? '#1a1714' : 'transparent',
                  borderColor: viewMode === 'blueprint' ? '#1a1714' : 'rgba(196,181,158,0.5)',
                  color: viewMode === 'blueprint' ? 'white' : '#5a5650',
                  transition: 'all 0.25s',
                }}
              >
                <Layers size={14} /> Architectural Blueprints
              </button>
            )}
          </div>

          {viewMode === '360' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Daylight / Twilight Mode Toggle */}
              <button
                onClick={() => setLightingMode(m => m === 'daylight' ? 'twilight' : 'daylight')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: lightingMode === 'twilight' ? '#3e2723' : 'rgba(255,255,255,0.06)',
                  color: lightingMode === 'twilight' ? '#ffcc80' : 'white',
                  border: '1px solid rgba(196,181,158,0.3)',
                  borderRadius: '4px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                {lightingMode === 'daylight' ? <Sun size={13} color="#ffa726" /> : <Moon size={13} color="#ffb74d" />}
                <span>{lightingMode === 'daylight' ? 'Solar Daylight' : 'Twilight Render'}</span>
              </button>

              <button
                onClick={() => setIsRotating(r => !r)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  backgroundColor: isRotating ? 'rgba(191,161,95,0.2)' : 'transparent',
                  color: tc,
                  border: `1px solid ${tc}`,
                  borderRadius: '4px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'all 0.25s',
                }}
              >
                <RotateCw size={13} className={isRotating ? 'spin' : ''} /> {isRotating ? 'Pause Rotation' : 'Auto Rotate'}
              </button>
            </div>
          )}
        </div>

        {/* ── ADVANCED PANORAMIC 360° VIEWER ── */}
        {viewMode === '360' && (
          <Advanced360Viewer
            angleViews={angleViews}
            angleLabels={angleLabels}
            lightingMode={lightingMode}
            isRotating={isRotating}
            tc={tc}
          />
        )}



        <style>{`
          @keyframes hotspotPulse {
            0% { box-shadow: 0 0 0 0 rgba(191,161,95,0.8); }
            70% { box-shadow: 0 0 0 10px rgba(191,161,95,0); }
            100% { box-shadow: 0 0 0 0 rgba(191,161,95,0); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translate(-50%, 10px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}</style>

        {/* Gallery View Mode */}
        {viewMode === 'gallery' && (
          <div>
            <div
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                aspectRatio: '16/9',
                maxHeight: '620px',
                backgroundColor: '#14110e',
                boxShadow: '0 20px 45px rgba(26,23,20,0.12)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={normalizedGallery[activeImage] || normalizedCover}
                alt={`${project.title} view ${activeImage + 1}`}
                referrerPolicy="no-referrer"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: galleryFit,
                  transition: 'opacity 0.35s',
                }}
              />

              {/* Exact Fit toggle pill */}
              <button
                type="button"
                onClick={() => setGalleryFit(f => f === 'contain' ? 'cover' : 'contain')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(20,17,14,0.85)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${galleryFit === 'contain' ? tc : 'rgba(255,255,255,0.2)'}`,
                  color: galleryFit === 'contain' ? tc : 'white',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  fontSize: '10.5px',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  zIndex: 5,
                }}
              >
                {galleryFit === 'contain' ? '✓ Exact Fit (Uncropped)' : 'Fill Screen'}
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                overflowX: 'auto',
                paddingBottom: '8px',
                marginTop: '1rem',
                scrollbarWidth: 'thin',
              }}
            >
              {normalizedGallery.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    flexShrink: 0,
                    width: 'clamp(70px, 15vw, 100px)',
                    aspectRatio: '16/10',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: `2px solid ${activeImage === i ? tc : 'transparent'}`,
                    transition: 'border-color 0.25s, transform 0.2s',
                    opacity: activeImage === i ? 1 : 0.65,
                    backgroundColor: '#14110e',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
                  onMouseLeave={e => { if (activeImage !== i) (e.currentTarget as HTMLDivElement).style.opacity = '0.65'; }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    referrerPolicy="no-referrer"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blueprint Mode */}
        {viewMode === 'blueprint' && normalizedBlueprints.length > 0 && (
          <div style={{ backgroundColor: '#131924', borderRadius: '8px', padding: '1.5rem', color: 'white' }}>
            {/* Multi-sheet switcher tabs if more than 1 blueprint exists */}
            {normalizedBlueprints.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {normalizedBlueprints.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveBlueprint(idx)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '4px',
                      backgroundColor: activeBlueprint === idx ? tc : 'rgba(255,255,255,0.08)',
                      color: 'white',
                      border: 'none',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    Architectural Plan {idx + 1}
                  </button>
                ))}
              </div>
            )}
            <div
              style={{
                aspectRatio: '16/9',
                maxHeight: '620px',
                overflow: 'hidden',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0a0f18',
              }}
            >
              <img
                src={normalizedBlueprints[activeBlueprint] || normalizedBlueprints[0]}
                alt={`Blueprint ${activeBlueprint + 1}`}
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#90caf9', marginTop: '1rem', textAlign: 'center' }}>
              Schematic Floor Plan & Architectural Section (Scale 1:100 / Verified Statutory Drawings)
            </p>
          </div>
        )}
      </section>

      {/* Main Narrative & Details Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4.5rem 2rem', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4.5rem', alignItems: 'start' }} className="project-detail-main-grid">
          
          {/* Left Column: Architectural Narrative, Scope, Materials */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ width: '25px', height: '1.5px', backgroundColor: tc }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.28em', color: tc, textTransform: 'uppercase' }}>
                DESIGN PHILOSOPHY & BRIEF
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2rem, 3.5vw, 2.9rem)',
                fontWeight: 400,
                color: '#1a1714',
                lineHeight: 1.2,
                marginBottom: '1.5rem',
              }}
            >
              {project.description}
            </h2>

            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '15px',
                color: '#55514b',
                lineHeight: 1.85,
                marginBottom: '3rem',
                whiteSpace: 'pre-line',
              }}
            >
              {project.longDescription}
            </p>

            {/* Scope of Execution */}
            <div style={{ marginBottom: '3rem' }}>
              <h3
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: '#8a8278',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                COMPREHENSIVE SCOPE OF WORK
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                {project.scope.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: '#f1ece2',
                      border: '1px solid rgba(196,181,158,0.45)',
                      borderRadius: '4px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '12px',
                      color: '#3d3834',
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle2 size={13} color={tc} />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Materials Palette */}
            <div>
              <h3
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: '#8a8278',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                MATERIAL PALETTE & SPECIFICATIONS
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {project.materials.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      backgroundColor: 'white',
                      border: '1px solid rgba(196,181,158,0.3)',
                      borderRadius: '4px',
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: tc, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#4a453f', fontWeight: 500 }}>
                      {m}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key Specifications Card */}
          <div>
            <div
              style={{
                backgroundColor: '#1a1714',
                borderRadius: '8px',
                padding: '2.25rem',
                position: 'sticky',
                top: '5rem',
                boxShadow: '0 25px 60px rgba(26,23,20,0.18)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.75rem' }}>
                <div style={{ width: '20px', height: '1.5px', backgroundColor: tc }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.25em', color: tc, textTransform: 'uppercase' }}>
                  SPECIFICATION DOSSIER
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { label: 'Category', value: project.category },
                  { label: 'Location', value: project.location },
                  { label: 'Year Completed / Target', value: project.year },
                  { label: 'Area Footprint', value: project.area },
                  { label: 'Status', value: project.status },
                  ...project.stats.filter(s => !['Year', 'Floors', 'Category', 'Built Area', 'Total Footprint', 'Location', 'Status'].includes(s.label)),
                ].map((item, idx, arr) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 0',
                      borderBottom: idx < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    }}
                  >
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#a0988e', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'white', fontWeight: 400 }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  onClose();
                  onBookConsultation?.(project.title);
                }}
                style={{
                  marginTop: '2rem',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  backgroundColor: tc,
                  color: 'white',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 0.25s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#a56245')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = tc)}
              >
                Inquire For Similar Build <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Project Stats Summary Row */}
        {project.stats && project.stats.length > 0 && (
          <div
            style={{
              marginTop: '5rem',
              display: 'grid',
              gridTemplateColumns: `repeat(${project.stats.length}, 1fr)`,
              border: '1px solid rgba(196,181,158,0.35)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
            className="stats-summary-strip"
          >
            {project.stats.map((s, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 1.5rem',
                  backgroundColor: idx % 2 === 0 ? '#faf8f4' : '#f4efe6',
                  borderRight: idx < project.stats.length - 1 ? '1px solid rgba(196,181,158,0.35)' : 'none',
                }}
              >
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.6rem', color: tc, lineHeight: 1, marginBottom: '0.5rem', fontWeight: 400 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.18em', color: '#7a7369', textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Next / Previous Project Footer Navigation */}
        <div
          style={{
            marginTop: '5rem',
            paddingTop: '3rem',
            borderTop: '1px solid rgba(196,181,158,0.35)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '2rem',
          }}
          className="project-prev-next-nav"
        >
          {prevProject ? (
            <button
              onClick={() => onNavigate(prevProject)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border: '1px solid rgba(196,181,158,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ArrowLeft size={16} color={tc} />
              </div>
              <div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: '#8a8278', textTransform: 'uppercase' }}>
                  Previous Project
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem', color: '#1a1714', fontWeight: 500 }}>
                  {prevProject.title}
                </div>
              </div>
            </button>
          ) : <div />}

          {nextProject ? (
            <button
              onClick={() => onNavigate(nextProject)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'right',
                flexDirection: 'row-reverse',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border: '1px solid rgba(196,181,158,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ArrowRight size={16} color={tc} />
              </div>
              <div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: '#8a8278', textTransform: 'uppercase' }}>
                  Next Project
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem', color: '#1a1714', fontWeight: 500 }}>
                  {nextProject.title}
                </div>
              </div>
            </button>
          ) : <div />}
        </div>
      </section>

      <style>{`
        .spin {
          animation: spinAnim 2s linear infinite;
        }
        @keyframes spinAnim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        @media (max-width: 960px) {
          .project-detail-main-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .stats-summary-strip {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
          .stats-summary-strip {
            grid-template-columns: 1fr !important;
          }
          .project-prev-next-nav {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}
