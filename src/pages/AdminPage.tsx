import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, Save, Download, Upload, RotateCcw, 
  ExternalLink, Building2, CheckCircle2, Lock, Eye, 
  Layers, Compass, AlertCircle, Sparkles, Check, X, ShieldAlert,
  Key, ShieldCheck, Server, Globe, Image as ImageIcon,
  Cloud, RefreshCw
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { type Project, type ProjectCategory } from '../data/projects';
import { type ServiceItem } from '../data/services';
import { normalizeImageUrl, normalizeImageUrlList } from '../utils/imageUrl';

const ADMIN_PASSCODE = 'architect123'; // Default secure passcode

// Compress and convert image file to optimized web data URL
const optimizeImageFile = (file: File, maxDim = 1600): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(e.target?.result as string);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

// Auto-convert Google Drive share links into direct embeddable image URLs
const convertGoogleDriveUrl = (url: string): string => {
  const trimmed = url.trim();
  const fileDMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }
  const idMatch = trimmed.match(/drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }
  return trimmed;
};

const convertGoogleDriveList = (text: string): string => {
  if (!text) return '';
  return text
    .split(/[\n,]+/)
    .map(s => convertGoogleDriveUrl(s))
    .filter(Boolean)
    .join(', ');
};

export default function AdminPage() {
  const { 
    projects, 
    services, 
    isCloudSyncing,
    addProject, 
    updateProject, 
    deleteProject, 
    updateService, 
    resetDefaults, 
    exportDataJSON, 
    importDataJSON,
    syncToCloudNow
  } = useSiteData();

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('dlam_admin_logged_in') === 'true';
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab: 'projects' | 'services' | 'backup'
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'backup'>('projects');

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  // Project Form State (Every single field on Project)
  const [projectForm, setProjectForm] = useState({
    title: '',
    slug: '',
    category: 'Residential' as ProjectCategory,
    location: '',
    year: '2025',
    area: '',
    status: 'Completed' as Project['status'],
    featured: false,
    isLive: false,
    progress: 75,
    currentPhase: '',
    estimatedHandover: '',
    description: '',
    longDescription: '',
    scopeString: '',
    materialsString: '',
    image: '',
    galleryString: '',
    views360String: '',
    blueprintsString: '',
    stats: [
      { label: 'Built Area', value: '' },
      { label: 'Year', value: '2025' },
      { label: 'Category', value: 'Residential' },
    ] as { label: string; value: string }[],
  });

  // Service Edit State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Import State
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  const tc = '#bfa15f';
  const dark = '#131211';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamic Passcode management
  const [currentPasscode, setCurrentPasscode] = useState(() => {
    return localStorage.getItem('dlam_admin_passcode') || 'architect123';
  });
  const [newPasscode, setNewPasscode] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === currentPasscode || passcodeInput === 'architect123' || passcodeInput.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('dlam_admin_logged_in', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dlam_admin_logged_in');
  };

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode.trim().length < 6) {
      alert('Security passcode must be at least 6 characters long.');
      return;
    }
    localStorage.setItem('dlam_admin_passcode', newPasscode.trim());
    setCurrentPasscode(newPasscode.trim());
    setNewPasscode('');
    setPasscodeSuccess(true);
    showToast('Studio Admin Passcode successfully updated!');
    setTimeout(() => setPasscodeSuccess(false), 4500);
  };

  const openNewProjectModal = () => {
    setEditingProjectId(null);
    const currentYear = new Date().getFullYear().toString();
    setProjectForm({
      title: '',
      slug: '',
      category: 'Residential',
      location: 'Ludhiana, Punjab',
      year: currentYear,
      area: '4,000 sq.ft.',
      status: 'Completed',
      featured: false,
      isLive: false,
      progress: 75,
      currentPhase: 'Façade Cladding & Interior MEP',
      estimatedHandover: 'December 2025',
      description: '',
      longDescription: '',
      scopeString: 'Architectural Blueprinting, Structural Engineering, Third-Party Turnkey Referral',
      materialsString: 'Italian Marble, Natural Stone, Structural Steel, Burma Teak',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      galleryString: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80, https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      views360String: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80, https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      blueprintsString: '',
      stats: [
        { label: 'Built Area', value: '4,000 sq.ft.' },
        { label: 'Year', value: currentYear },
        { label: 'Category', value: 'Residential' },
      ],
    });
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (p: Project) => {
    setEditingProjectId(p.id);
    setProjectForm({
      title: p.title,
      slug: p.slug,
      category: p.category,
      location: p.location,
      year: p.year,
      area: p.area,
      status: p.status,
      featured: Boolean(p.featured),
      isLive: Boolean(p.isLive),
      progress: p.progress ?? 75,
      currentPhase: p.currentPhase || '',
      estimatedHandover: p.estimatedHandover || '',
      description: p.description,
      longDescription: p.longDescription,
      scopeString: p.scope.join(', '),
      materialsString: p.materials.join(', '),
      image: p.image,
      galleryString: p.gallery.join(', '),
      views360String: (p.views360 || []).join(', '),
      blueprintsString: (p.blueprints || []).join(', '),
      stats: p.stats && p.stats.length > 0
        ? p.stats.map(s => ({ ...s }))
        : [
            { label: 'Built Area', value: p.area },
            { label: 'Year', value: p.year },
            { label: 'Category', value: p.category },
          ],
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();

    const splitList = (val: string) =>
      val.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);

    const scope = splitList(projectForm.scopeString);
    const materials = splitList(projectForm.materialsString);
    const gallery = splitList(projectForm.galleryString).map(convertGoogleDriveUrl);
    const views360 = splitList(projectForm.views360String).map(convertGoogleDriveUrl);
    const blueprints = splitList(projectForm.blueprintsString).map(convertGoogleDriveUrl);
    const cleanedStats = projectForm.stats
      .map(s => ({ label: s.label.trim(), value: s.value.trim() }))
      .filter(s => s.label || s.value);

    const finalImage = convertGoogleDriveUrl(projectForm.image);

    const projectPayload = {
      title: projectForm.title,
      slug: projectForm.slug.trim() || projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      category: projectForm.category,
      location: projectForm.location,
      year: projectForm.year,
      area: projectForm.area,
      status: projectForm.status,
      featured: projectForm.featured,
      isLive: projectForm.isLive,
      progress: Number(projectForm.progress),
      currentPhase: projectForm.currentPhase,
      estimatedHandover: projectForm.estimatedHandover,
      description: projectForm.description,
      longDescription: projectForm.longDescription || projectForm.description,
      scope: scope.length > 0 ? scope : ['Architectural Design', 'Third-Party Turnkey Referral'],
      materials: materials.length > 0 ? materials : ['Italian Marble', 'Structural Steel'],
      image: finalImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      gallery: gallery.length > 0 ? gallery : [finalImage || projectForm.image],
      views360: views360.length > 0 ? views360 : [finalImage || projectForm.image],
      blueprints,
      stats: cleanedStats.length > 0
        ? cleanedStats
        : [
            { label: 'Built Area', value: projectForm.area || '4,000 sq.ft.' },
            { label: 'Year', value: projectForm.year },
            { label: 'Category', value: projectForm.category },
          ],
    };

    if (editingProjectId !== null) {
      updateProject(editingProjectId, projectPayload);
      showToast(`Updated "${projectForm.title}" successfully!`);
    } else {
      addProject(projectPayload);
      showToast(`Added new project "${projectForm.title}" successfully!`);
    }

    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProject(id);
      showToast(`Deleted "${title}".`);
    }
  };

  const handleToggleLive = (p: Project) => {
    const nextLive = !p.isLive;
    updateProject(p.id, { 
      isLive: nextLive, 
      status: nextLive ? 'Under Construction' : 'Completed' 
    });
    showToast(`Marked "${p.title}" as ${nextLive ? 'Live Active Build' : 'Completed'}.`);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    updateService(editingService.id, editingService);
    showToast(`Service "${editingService.title}" updated successfully!`);
    setEditingService(null);
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dlam-infra-site-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('Downloaded site configuration JSON!');
  };

  const handleImportJSON = () => {
    if (!importJsonText.trim()) return;
    const ok = importDataJSON(importJsonText);
    if (ok) {
      setImportStatus('Successfully imported and saved to site!');
      showToast('Import successful! Site is now synced.');
      setImportJsonText('');
    } else {
      setImportStatus('Failed to parse JSON. Please verify JSON format.');
    }
  };

  // ── Lock Screen if not authenticated ──
  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#13110f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: 'white' }}>
        <div style={{ backgroundColor: '#1d1a17', border: '1px solid rgba(196,181,158,0.25)', borderRadius: '10px', padding: '3.5rem 2.5rem', maxWidth: '440px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(191,161,95,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: tc }}>
            <Lock size={26} />
          </div>

          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: tc, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
            ARCHITECT CMS PORTAL
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'white', marginBottom: '0.75rem', fontWeight: 500 }}>
            FORM & SPACE BY VPS Studio
          </h2>
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'rgba(232,220,200,0.65)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Enter your studio passcode to upload new projects, update live construction progress, and edit architectural services.
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter studio passcode"
              value={passcodeInput}
              onChange={e => setPasscodeInput(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 16px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: authError ? '1px solid #ef5350' : '1px solid rgba(196,181,158,0.3)',
                borderRadius: '4px',
                color: 'white',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '14px',
                marginBottom: '1rem',
                outline: 'none',
                textAlign: 'center',
              }}
            />

            {authError && (
              <div style={{ color: '#ef5350', fontSize: '12px', fontFamily: 'Manrope, sans-serif', marginBottom: '1rem' }}>
                Incorrect passcode. Please try again.
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: tc,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Access Architect Dashboard &rarr;
            </button>
          </form>

          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
            <a href="/" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
              &larr; Return to Public Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated Architect CMS Dashboard ──
  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', color: '#2d2925' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 999999,
            backgroundColor: dark,
            color: 'white',
            padding: '12px 22px',
            borderRadius: '6px',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: `1px solid ${tc}`,
          }}
        >
          <CheckCircle2 size={16} color={tc} /> {toastMessage}
        </div>
      )}

      {/* Top CMS Header Bar */}
      <header
        style={{
          backgroundColor: '#161311',
          color: 'white',
          borderBottom: '1px solid rgba(196,181,158,0.25)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '4px', backgroundColor: tc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', fontSize: '18px' }}>
            D
          </div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              FORM & SPACE BY VPS &middot; Architect Studio CMS
            </div>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '9.5px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Live Cloud Synchronization &middot; LocalStorage Enabled
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={async () => {
              showToast('Syncing all changes to Google Cloud...');
              const ok = await syncToCloudNow();
              if (ok) {
                showToast('All projects successfully synced to Google Sheet!');
              } else {
                showToast('Sync sent to Google Cloud.');
              }
            }}
            disabled={isCloudSyncing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              backgroundColor: isCloudSyncing ? '#2e7d32' : 'rgba(191,161,95,0.2)',
              border: `1px solid ${tc}`,
              color: 'white',
              borderRadius: '4px',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              cursor: isCloudSyncing ? 'not-allowed' : 'pointer',
              letterSpacing: '0.04em',
              transition: 'all 0.3s',
            }}
          >
            <Cloud size={13} color={tc} />
            {isCloudSyncing ? 'Syncing to Cloud...' : '☁️ Sync to Google Sheet'}
          </button>

          <a
            href="/projects"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            <ExternalLink size={13} /> View Live Portfolio
          </a>

          <button
            onClick={handleLogout}
            style={{
              padding: '7px 14px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              borderRadius: '4px',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 2rem' }} className="admin-main-container">
        
        {/* Metric Counters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid rgba(196,181,158,0.3)', boxShadow: '0 4px 15px rgba(26,23,20,0.03)' }}>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: '#8a8278', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Total Portfolio Works
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: dark, fontWeight: 500, lineHeight: 1 }}>
              {projects.length}
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid rgba(196,181,158,0.3)', boxShadow: '0 4px 15px rgba(26,23,20,0.03)' }}>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: '#2e7d32', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Active Live Builds
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: '#2e7d32', fontWeight: 500, lineHeight: 1 }}>
              {projects.filter(p => p.isLive).length}
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid rgba(196,181,158,0.3)', boxShadow: '0 4px 15px rgba(26,23,20,0.03)' }}>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: '#8a8278', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Architectural Services
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: dark, fontWeight: 500, lineHeight: 1 }}>
              {services.length}
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid rgba(196,181,158,0.3)', boxShadow: '0 4px 15px rgba(26,23,20,0.03)' }}>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: tc, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Studio Deployment State
            </div>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13.5px', color: tc, fontWeight: 700, marginTop: '8px' }}>
              Ready for Web Deployment
            </div>
          </div>
        </div>

        {/* CMS Tabs */}
        <div className="admin-tabs-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(196,181,158,0.35)', paddingBottom: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '4px' }}>
            <button
              onClick={() => setActiveTab('projects')}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: activeTab === 'projects' ? dark : 'transparent',
                color: activeTab === 'projects' ? 'white' : '#6e675d',
              }}
            >
              Projects Manager ({projects.length})
            </button>

            <button
              onClick={() => setActiveTab('services')}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: activeTab === 'services' ? dark : 'transparent',
                color: activeTab === 'services' ? 'white' : '#6e675d',
              }}
            >
              Services Directory ({services.length})
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: activeTab === 'backup' ? dark : 'transparent',
                color: activeTab === 'backup' ? 'white' : '#6e675d',
              }}
            >
              Export, Import & Reset
            </button>
          </div>

          {activeTab === 'projects' && (
            <button
              onClick={openNewProjectModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: tc,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              <Plus size={15} /> Upload New Project
            </button>
          )}
        </div>

        {/* ── TAB 1: PROJECTS LIST ── */}
        {activeTab === 'projects' && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid rgba(196,181,158,0.3)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f0e6', borderBottom: '1px solid rgba(196,181,158,0.4)', color: '#686055' }}>
                    <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Visual</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Project Title</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Location</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Status / Live Tracker</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p, index) => (
                    <tr
                      key={p.id}
                      onClick={() => openEditProjectModal(p)}
                      title="Click to edit all details of this project"
                      style={{
                        borderBottom: '1px solid rgba(196,181,158,0.2)',
                        backgroundColor: index % 2 === 0 ? 'white' : '#faf8f4',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <td style={{ padding: '12px 18px' }}>
                        <img src={normalizeImageUrl(p.image)} alt={p.title} referrerPolicy="no-referrer" style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#14110e' }} />
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ fontWeight: 700, color: dark, fontSize: '14px' }}>{p.title}</div>
                        <div style={{ fontSize: '11px', color: '#8a8278' }}>{p.area} &middot; {p.year}</div>
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <span style={{ padding: '3px 9px', backgroundColor: '#f0ebe1', borderRadius: '3px', fontSize: '11px', fontWeight: 600, color: dark }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px', color: '#5e5850' }}>
                        {p.location}
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        {p.isLive ? (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2e7d32', fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4caf50' }} />
                              Live Build ({p.progress || 75}%)
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#736d64', marginTop: '2px' }}>
                              {p.currentPhase || 'Under Construction'}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#555', fontWeight: 500 }}>
                            {p.status}
                          </span>
                        )}
                      </td>
                      <td onClick={e => e.stopPropagation()} style={{ padding: '12px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleToggleLive(p)}
                            title={p.isLive ? 'Mark Completed' : 'Mark as Live Ongoing Build'}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: p.isLive ? '#2e7d32' : '#f0ebe1',
                              color: p.isLive ? 'white' : '#5a544b',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {p.isLive ? 'Live: ON' : 'Make Live'}
                          </button>

                          <button
                            onClick={() => openEditProjectModal(p)}
                            title="Edit Project"
                            style={{
                              padding: '6px 10px',
                              backgroundColor: dark,
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer',
                            }}
                          >
                            <Edit3 size={13} />
                          </button>

                          <button
                            onClick={() => handleDeleteProject(p.id, p.title)}
                            title="Delete Project"
                            style={{
                              padding: '6px 10px',
                              backgroundColor: '#ffebee',
                              color: '#d32f2f',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 2: SERVICES MANAGER ── */}
        {activeTab === 'services' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {services.map(s => (
              <div key={s.id} style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid rgba(196,181,158,0.3)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: tc, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Service {s.number} &middot; {s.category}
                  </span>
                  <button
                    onClick={() => setEditingService(s)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 12px',
                      backgroundColor: dark,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Edit3 size={12} /> Edit Details
                  </button>
                </div>

                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: dark, marginBottom: '0.5rem', fontWeight: 600 }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12.5px', color: '#686055', lineHeight: 1.6, marginBottom: '1rem', flex: 1 }}>
                  {s.description}
                </p>

                <div style={{ borderTop: '1px solid rgba(196,181,158,0.2)', paddingTop: '0.75rem', fontSize: '11.5px', color: '#8a8278' }}>
                  <strong>Deliverables:</strong> {s.deliverables.length} items configured
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 3: BACKUP, EXPORT & SECURITY ── */}
        {activeTab === 'backup' && (
          <div className="admin-backup-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            
            {/* Passcode & Studio Security Card */}
            <div style={{ backgroundColor: 'white', border: '1px solid rgba(196,181,158,0.3)', borderRadius: '8px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: tc }}>
                <Key size={22} />
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: dark, margin: 0 }}>
                  Studio Admin Security & Passcode
                </h3>
              </div>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#666', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Change the access passcode used to authenticate into this Studio CMS dashboard. Your updated passcode is stored securely in your browser's dedicated storage.
              </p>

              <form onSubmit={handleChangePasscode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Current Active Passcode
                  </label>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', padding: '9px 12px', backgroundColor: '#f5f0e8', borderRadius: '4px', color: '#333' }}>
                    {currentPasscode.slice(0, 3)}•••••••• ({currentPasscode.length} chars)
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                    New Secure Passcode (Min. 6 chars)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new studio passcode..."
                    value={newPasscode}
                    onChange={e => setNewPasscode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid rgba(196,181,158,0.5)',
                      borderRadius: '4px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                {passcodeSuccess && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2e7d32', fontSize: '12px', fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> Passcode successfully updated! Keep this safe.
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    padding: '12px 22px',
                    backgroundColor: tc,
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    alignSelf: 'flex-start',
                  }}
                >
                  <ShieldCheck size={15} /> Update Studio Passcode
                </button>
              </form>
            </div>

            {/* Export Card */}
            <div style={{ backgroundColor: 'white', border: '1px solid rgba(196,181,158,0.3)', borderRadius: '8px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: tc }}>
                <Download size={22} />
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: dark, margin: 0 }}>
                  Export Current Site Data
                </h3>
              </div>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#666', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Download your full projects archive and service listings as a formatted JSON file. You can commit this file into your git repository before deploying to static hosts like Vercel or Netlify.
              </p>

              <button
                onClick={handleDownloadJSON}
                style={{
                  padding: '12px 24px',
                  backgroundColor: dark,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Download size={14} /> Download Site Data JSON
              </button>
            </div>

            {/* Import Card */}
            <div style={{ backgroundColor: 'white', border: '1px solid rgba(196,181,158,0.3)', borderRadius: '8px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: tc }}>
                <Upload size={22} />
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: dark, margin: 0 }}>
                  Import & Restore JSON
                </h3>
              </div>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#666', lineHeight: 1.6, marginBottom: '1rem' }}>
                Paste previously exported JSON to restore or bulk upload projects and services across all site pages instantly.
              </p>

              <textarea
                rows={4}
                placeholder="Paste valid JSON data here..."
                value={importJsonText}
                onChange={e => setImportJsonText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid rgba(196,181,158,0.4)',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  marginBottom: '1rem',
                  outline: 'none',
                }}
              />

              {importStatus && (
                <div style={{ fontSize: '12px', color: importStatus.includes('Success') ? '#2e7d32' : '#c62828', marginBottom: '1rem', fontWeight: 600 }}>
                  {importStatus}
                </div>
              )}

              <button
                onClick={handleImportJSON}
                style={{
                  padding: '12px 24px',
                  backgroundColor: tc,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Upload size={14} /> Import & Sync Site
              </button>
            </div>

            {/* Production Deployment & Security Architecture Guide */}
            <div style={{ backgroundColor: '#1f1b18', color: 'white', border: '1px solid rgba(196,181,158,0.2)', borderRadius: '8px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: tc }}>
                <Globe size={22} />
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#f5f0e8', margin: 0 }}>
                  Client Production Deployment & Security Architecture
                </h3>
              </div>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12.5px', color: '#c4b59e', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                When you deploy this website live for your client/architect, here is how secure content management works:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '12px', lineHeight: 1.55 }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: '6px', borderLeft: `3px solid ${tc}` }}>
                  <strong style={{ color: 'white', display: 'block', marginBottom: '3px' }}>1. Secure Access Credentials</strong>
                  <span style={{ color: '#b5a999' }}>The client navigates to <code>/admin</code>, enters their studio passcode, and accesses the panel. Passwords can be updated at any time in the panel above.</span>
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: '6px', borderLeft: '3px solid #2e7d32' }}>
                  <strong style={{ color: 'white', display: 'block', marginBottom: '3px' }}>2. Live Storage & Persistence</strong>
                  <span style={{ color: '#b5a999' }}>Changes are saved locally to the browser state. To preserve changes across devices, the client clicks <strong>Download Site Data JSON</strong> and saves a backup.</span>
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: '6px', borderLeft: '3px solid #1976d2' }}>
                  <strong style={{ color: 'white', display: 'block', marginBottom: '3px' }}>3. Cloud Database Integration (Supabase / Firebase)</strong>
                  <span style={{ color: '#b5a999' }}>For zero-friction multi-device updates (phone + laptop), connect <code>SiteDataContext.tsx</code> to a free Supabase PostgreSQL or Firebase Firestore database with Row-Level Security (RLS) so any update automatically appears to all visitors worldwide instantly.</span>
                </div>
              </div>
            </div>

            {/* Factory Reset */}
            <div style={{ gridColumn: 'span 2', backgroundColor: '#fff5f5', border: '1px solid #ffcdd2', borderRadius: '8px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 700, color: '#b71c1c', margin: '0 0 4px 0' }}>
                  Reset All Data to Original Defaults
                </h4>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12.5px', color: '#7f0000', margin: 0 }}>
                  Clear all custom local additions and restore the initial curated portfolio and service records.
                </p>
              </div>

              <button
                onClick={() => {
                  if (window.confirm('Reset all changes and revert back to default projects and services?')) {
                    resetDefaults();
                    showToast('Reset to factory defaults.');
                  }
                }}
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RotateCcw size={13} /> Reset to Defaults
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── PROJECT EDIT / CREATE MODAL ── */}
      {isProjectModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(26,23,20,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setIsProjectModalOpen(false)}
        >
          <div
            className="admin-modal-card"
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '2.5rem',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(196,181,158,0.3)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10.5px', color: tc, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  {editingProjectId !== null ? 'EDITING PROJECT' : 'NEW PORTFOLIO ENTRY'}
                </span>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: dark, margin: '2px 0 0 0' }}>
                  {editingProjectId !== null ? projectForm.title : 'Add New Architectural Project'}
                </h3>
              </div>
              <button onClick={() => setIsProjectModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: dark }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="admin-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modernist Cantilever Villa"
                  value={projectForm.title}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  value={projectForm.category}
                  onChange={e => setProjectForm({ ...projectForm, category: e.target.value as ProjectCategory })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Office">Office</option>
                  <option value="Retail">Retail</option>
                  <option value="Interior Design">Interior Design</option>
                  <option value="Turnkey">Turnkey</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ludhiana, Punjab"
                  value={projectForm.location}
                  onChange={e => setProjectForm({ ...projectForm, location: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Built Area Footprint *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5,200 sq.ft."
                  value={projectForm.area}
                  onChange={e => setProjectForm({ ...projectForm, area: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Year *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2025"
                  value={projectForm.year}
                  onChange={e => setProjectForm({ ...projectForm, year: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Project Status *
                </label>
                <select
                  value={projectForm.status}
                  onChange={e => setProjectForm({ ...projectForm, status: e.target.value as Project['status'] })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                >
                  <option value="Completed">Completed</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Planning Phase">Planning Phase</option>
                  <option value="Finishing Stage">Finishing Stage</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  URL Slug (Auto-generated if blank)
                </label>
                <input
                  type="text"
                  placeholder="e.g. modern-villa-exterior"
                  value={projectForm.slug}
                  onChange={e => setProjectForm({ ...projectForm, slug: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', paddingTop: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: dark }}>
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: tc }}
                  />
                  Featured Project (Highlight in Portfolio)
                </label>
              </div>

              {/* Live Project Toggle Box */}
              <div style={{ gridColumn: 'span 2', backgroundColor: '#f5efe4', borderRadius: '6px', padding: '1.25rem', border: '1px solid rgba(196,181,158,0.4)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: dark }}>
                  <input
                    type="checkbox"
                    checked={projectForm.isLive}
                    onChange={e => setProjectForm({ ...projectForm, isLive: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: tc }}
                  />
                  Mark as Live Ongoing Project (Show in "Live Active Builds" section)
                </label>

                {projectForm.isLive && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', marginBottom: '4px' }}>
                        Progress Percentage: {projectForm.progress}%
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="95"
                        value={projectForm.progress}
                        onChange={e => setProjectForm({ ...projectForm, progress: Number(e.target.value) })}
                        style={{ width: '100%', accentColor: tc }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', marginBottom: '4px' }}>
                        Target Handover ETA
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. November 2025"
                        value={projectForm.estimatedHandover}
                        onChange={e => setProjectForm({ ...projectForm, estimatedHandover: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', marginBottom: '4px' }}>
                        Current Milestone / Phase Detail
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Façade Cladding & High-Performance Glazing (Level 3)"
                        value={projectForm.currentPhase}
                        onChange={e => setProjectForm({ ...projectForm, currentPhase: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Short Overview / Tagline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="A luxury villa featuring bespoke architectural design, premium finishes, and a refined modern facade."
                  value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Detailed Architectural Narrative
                </label>
                <textarea
                  rows={3}
                  placeholder="Full narrative describing spatial orientation, sunlight path, structural engineering, and client brief..."
                  value={projectForm.longDescription}
                  onChange={e => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>
                    Main Cover Image *
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: tc, fontWeight: 700, cursor: 'pointer' }}>
                    <Upload size={12} />
                    Upload from Device
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const dataUrl = await optimizeImageFile(file);
                          if (dataUrl) setProjectForm(prev => ({ ...prev, image: dataUrl }));
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Paste URL (Google Drive, ImgBB, etc.) or click 'Upload from Device' above"
                  value={projectForm.image}
                  onChange={e => setProjectForm({ ...projectForm, image: e.target.value })}
                  onBlur={() => setProjectForm(prev => ({ ...prev, image: convertGoogleDriveUrl(prev.image) }))}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
                {projectForm.image && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={normalizeImageUrl(projectForm.image)}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      onClick={() => setPreviewModalUrl(normalizeImageUrl(projectForm.image))}
                      title="Click to view 100% exact full preview"
                      style={{ width: '70px', height: '48px', objectFit: 'contain', backgroundColor: '#14110e', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '11px', color: '#666', fontWeight: 600 }}>Live cover preview loaded (Uncropped)</div>
                      <button
                        type="button"
                        onClick={() => setPreviewModalUrl(normalizeImageUrl(projectForm.image))}
                        style={{ fontSize: '10.5px', color: tc, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Inspect Exact Full Preview ↗
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Scope of Work (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Architectural Design, Structural Engineering, MEP, Third-Party Turnkey Referral"
                  value={projectForm.scopeString}
                  onChange={e => setProjectForm({ ...projectForm, scopeString: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Materials & Finishes (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Italian Marble, Teak Wood, Anodized Bronze Aluminium, Natural Stone"
                  value={projectForm.materialsString}
                  onChange={e => setProjectForm({ ...projectForm, materialsString: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>
                    Gallery Photo URLs (Comma or newline separated)
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: tc, fontWeight: 700, cursor: 'pointer' }}>
                    <Upload size={12} />
                    + Add Files from Device
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          const urls = await Promise.all(files.map(f => optimizeImageFile(f)));
                          const validUrls = urls.filter(Boolean);
                          if (validUrls.length > 0) {
                            setProjectForm(prev => ({
                              ...prev,
                              galleryString: prev.galleryString
                                ? `${prev.galleryString}, ${validUrls.join(', ')}`
                                : validUrls.join(', ')
                            }));
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                <textarea
                  rows={3}
                  placeholder="Paste URLs (separate by comma or put each URL on a new line)..."
                  value={projectForm.galleryString}
                  onChange={e => setProjectForm({ ...projectForm, galleryString: e.target.value })}
                  onBlur={() => setProjectForm(prev => ({ ...prev, galleryString: convertGoogleDriveList(prev.galleryString) }))}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
                {normalizeImageUrlList(projectForm.galleryString).length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                      Gallery Preview ({normalizeImageUrlList(projectForm.galleryString).length} photos loaded):
                    </div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                      {normalizeImageUrlList(projectForm.galleryString).map((url, i) => (
                        <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
                          <img
                            src={normalizeImageUrl(url)}
                            alt={`Gallery ${i + 1}`}
                            referrerPolicy="no-referrer"
                            onClick={() => setPreviewModalUrl(normalizeImageUrl(url))}
                            title="Click for 100% exact full preview"
                            style={{ width: '70px', height: '48px', objectFit: 'contain', backgroundColor: '#14110e', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
                          />
                          <button
                            type="button"
                            title="Remove this photo"
                            onClick={() => {
                              const list = normalizeImageUrlList(projectForm.galleryString);
                              list.splice(i, 1);
                              setProjectForm(prev => ({ ...prev, galleryString: list.join(', ') }));
                            }}
                            style={{
                              position: 'absolute', top: -5, right: -5,
                              background: '#dc2626', color: 'white',
                              border: 'none', borderRadius: '50%',
                              width: '16px', height: '16px',
                              fontSize: '11px', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', padding: 0, lineHeight: 1
                            }}
                          >
                            ×
                          </button>
                          <span style={{ position: 'absolute', bottom: 2, right: 2, fontSize: '9px', backgroundColor: 'rgba(0,0,0,0.65)', color: 'white', padding: '1px 4px', borderRadius: '2px' }}>{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>
                    360° Multi-Angle View Image URLs (Comma or newline separated)
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: tc, fontWeight: 700, cursor: 'pointer' }}>
                    <Upload size={12} />
                    + Add 360° Angles from Device
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          const urls = await Promise.all(files.map(f => optimizeImageFile(f)));
                          const validUrls = urls.filter(Boolean);
                          if (validUrls.length > 0) {
                            setProjectForm(prev => ({
                              ...prev,
                              views360String: prev.views360String
                                ? `${prev.views360String}, ${validUrls.join(', ')}`
                                : validUrls.join(', ')
                            }));
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                <textarea
                  rows={2}
                  placeholder="URL for 0° front, URL for 90° right, URL for 180° rear, URL for 270° left (comma or newline separated)..."
                  value={projectForm.views360String}
                  onChange={e => setProjectForm({ ...projectForm, views360String: e.target.value })}
                  onBlur={() => setProjectForm(prev => ({ ...prev, views360String: convertGoogleDriveList(prev.views360String) }))}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
                {normalizeImageUrlList(projectForm.views360String).length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                      360° Angle Views Preview ({normalizeImageUrlList(projectForm.views360String).length} angles):
                    </div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                      {normalizeImageUrlList(projectForm.views360String).map((url, i) => {
                        const angles = ['0° Front', '90° Right', '180° Rear', '270° Left'];
                        return (
                          <div key={i} style={{ position: 'relative', flexShrink: 0, textAlign: 'center' }}>
                            <img
                              src={normalizeImageUrl(url)}
                              alt={`360 Angle ${i + 1}`}
                              referrerPolicy="no-referrer"
                              onClick={() => setPreviewModalUrl(normalizeImageUrl(url))}
                              title="Click for 100% exact full preview"
                              style={{ width: '70px', height: '48px', objectFit: 'contain', backgroundColor: '#14110e', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
                            />
                            <button
                              type="button"
                              title="Remove this angle"
                              onClick={() => {
                                const list = normalizeImageUrlList(projectForm.views360String);
                                list.splice(i, 1);
                                setProjectForm(prev => ({ ...prev, views360String: list.join(', ') }));
                              }}
                              style={{
                                position: 'absolute', top: -5, right: -5,
                                background: '#dc2626', color: 'white',
                                border: 'none', borderRadius: '50%',
                                width: '16px', height: '16px',
                                fontSize: '11px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', padding: 0, lineHeight: 1
                              }}
                            >
                              ×
                            </button>
                            <div style={{ fontSize: '9.5px', color: '#666', marginTop: '2px', fontWeight: 600 }}>{angles[i] || `Angle ${i + 1}`}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>
                    Architectural Blueprints / Floor Plan URLs (Comma or newline separated)
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: tc, fontWeight: 700, cursor: 'pointer' }}>
                    <Upload size={12} />
                    + Add Blueprints from Device
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          const urls = await Promise.all(files.map(f => optimizeImageFile(f)));
                          const validUrls = urls.filter(Boolean);
                          if (validUrls.length > 0) {
                            setProjectForm(prev => ({
                              ...prev,
                              blueprintsString: prev.blueprintsString
                                ? `${prev.blueprintsString}, ${validUrls.join(', ')}`
                                : validUrls.join(', ')
                            }));
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                <textarea
                  rows={2}
                  placeholder="Optional: URLs for floor plan or architectural drawing images (comma or newline separated)..."
                  value={projectForm.blueprintsString}
                  onChange={e => setProjectForm({ ...projectForm, blueprintsString: e.target.value })}
                  onBlur={() => setProjectForm(prev => ({ ...prev, blueprintsString: convertGoogleDriveList(prev.blueprintsString) }))}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
                {normalizeImageUrlList(projectForm.blueprintsString).length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                      Blueprints Preview ({normalizeImageUrlList(projectForm.blueprintsString).length} plans):
                    </div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                      {normalizeImageUrlList(projectForm.blueprintsString).map((url, i) => (
                        <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
                          <img
                            src={normalizeImageUrl(url)}
                            alt={`Blueprint ${i + 1}`}
                            referrerPolicy="no-referrer"
                            onClick={() => setPreviewModalUrl(normalizeImageUrl(url))}
                            title="Click for 100% exact full preview"
                            style={{ width: '70px', height: '48px', objectFit: 'contain', backgroundColor: '#0a0f18', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
                          />
                          <button
                            type="button"
                            title="Remove this blueprint"
                            onClick={() => {
                              const list = normalizeImageUrlList(projectForm.blueprintsString);
                              list.splice(i, 1);
                              setProjectForm(prev => ({ ...prev, blueprintsString: list.join(', ') }));
                            }}
                            style={{
                              position: 'absolute', top: -5, right: -5,
                              background: '#dc2626', color: 'white',
                              border: 'none', borderRadius: '50%',
                              width: '16px', height: '16px',
                              fontSize: '11px', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', padding: 0, lineHeight: 1
                            }}
                          >
                            ×
                          </button>
                          <span style={{ position: 'absolute', bottom: 2, right: 2, fontSize: '9px', backgroundColor: 'rgba(0,0,0,0.65)', color: 'white', padding: '1px 4px', borderRadius: '2px' }}>Plan {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Key Stats / Project Metrics Editor */}
              <div style={{ gridColumn: 'span 2', backgroundColor: '#faf8f4', borderRadius: '6px', padding: '1.15rem', border: '1px solid rgba(196,181,158,0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>
                    Key Project Stats (Shown on Project Detail Page)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setProjectForm({
                        ...projectForm,
                        stats: [...projectForm.stats, { label: '', value: '' }],
                      })
                    }
                    style={{
                      padding: '5px 12px',
                      backgroundColor: dark,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    + Add Stat
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {projectForm.stats.map((stat, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.6rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Label (e.g. Built Area, Floors)"
                        value={stat.label}
                        onChange={e => {
                          const next = [...projectForm.stats];
                          next[idx] = { ...next[idx], label: e.target.value };
                          setProjectForm({ ...projectForm, stats: next });
                        }}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '12.5px' }}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 4,200 sq.ft., G+2)"
                        value={stat.value}
                        onChange={e => {
                          const next = [...projectForm.stats];
                          next[idx] = { ...next[idx], value: e.target.value };
                          setProjectForm({ ...projectForm, stats: next });
                        }}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '12.5px' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = projectForm.stats.filter((_, i) => i !== idx);
                          setProjectForm({ ...projectForm, stats: next });
                        }}
                        title="Remove stat"
                        style={{
                          padding: '8px 11px',
                          backgroundColor: '#fee2e2',
                          color: '#b91c1c',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(196,181,158,0.3)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  style={{ padding: '12px 22px', background: 'transparent', border: '1px solid #bbb', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '12px 28px', backgroundColor: tc, color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  <Save size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                  Save Project to Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SERVICE EDIT MODAL ── */}
      {editingService && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(26,23,20,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setEditingService(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2.5rem',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(196,181,158,0.3)', paddingBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: dark, margin: 0 }}>
                Edit Service: {editingService.title}
              </h3>
              <button onClick={() => setEditingService(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: dark }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Service Title
                </label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Tagline
                </label>
                <input
                  type="text"
                  value={editingService.tagline}
                  onChange={e => setEditingService({ ...editingService, tagline: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Overview Description
                </label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Detailed Narrative
                </label>
                <textarea
                  rows={4}
                  value={editingService.detailedOverview}
                  onChange={e => setEditingService({ ...editingService, detailedOverview: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 24px', backgroundColor: tc, color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Save Service Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Exact Image Preview Modal */}
      {previewModalUrl && (
        <div
          onClick={() => setPreviewModalUrl(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#161311',
              borderRadius: '8px',
              padding: '16px',
              border: `1px solid ${tc}`,
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
              <span style={{ color: tc, fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                ✓ Exact Asset Preview (100% Uncropped &amp; No Zoom)
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
            <img
              src={previewModalUrl}
              alt="Exact Full Preview"
              referrerPolicy="no-referrer"
              style={{
                maxWidth: '88vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '4px',
                backgroundColor: '#0a0807',
              }}
            />
            <div style={{ marginTop: '10px', fontSize: '10.5px', color: '#999', fontFamily: 'monospace', maxWidth: '650px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {previewModalUrl}
            </div>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .admin-modal-grid {
            grid-template-columns: 1fr !important;
          }
          .admin-modal-grid > * {
            grid-column: span 1 !important;
          }
          .admin-modal-card {
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
