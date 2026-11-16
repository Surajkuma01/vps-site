import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Send, CheckCircle, AlertCircle, X } from 'lucide-react';
import { sendEnquiryToSpreadsheet, PROJECT_TYPES, BUDGET_RANGES } from '../config/spreadsheet';

interface EnquiryFormProps {
  onClose: () => void;
  isOpen: boolean;
  initialSubject?: string;
  sheetName?: string;
  sourceLabel?: string;
}

const inputStyle = (focused: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '11px 14px',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '13.5px',
  color: '#1a1714',
  backgroundColor: 'white',
  border: `1px solid ${focused ? '#bfa15f' : 'rgba(191, 161, 95, 0.4)'}`,
  borderRadius: '4px',
  outline: 'none',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  boxShadow: focused ? '0 0 0 3px rgba(191, 161, 95, 0.15)' : 'none',
});

const labelStyle: React.CSSProperties = {
  fontFamily: 'Manrope, sans-serif',
  fontSize: '10.5px',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#8a8278',
  marginBottom: '5px',
  display: 'block',
};

export default function EnquiryForm({ onClose, isOpen, initialSubject, sheetName, sourceLabel }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    location: '',
    budget: '',
    message: initialSubject || '',
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSubject) {
      setFormData(prev => ({ ...prev, message: initialSubject }));
    }
  }, [initialSubject]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await sendEnquiryToSpreadsheet({
        ...formData,
        source: sourceLabel || 'Start a Project Modal',
        ...(sheetName ? { sheetName } : {}),
      });
      if (res.success) {
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
          setFormData({ name: '', email: '', phone: '', projectType: '', location: '', budget: '', message: '' });
          onClose();
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(26, 23, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease',
        }}
      />

      {/* Modal */}
      <div
        ref={formRef}
        className="enquiry-modal-box"
        style={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: '#faf8f4',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.45)',
          border: '1px solid rgba(191,161,95,0.28)',
        }}
      >
        {/* Pinned Header */}
        <div
          className="enquiry-modal-header"
          style={{
            padding: '1.35rem 2rem 1.1rem',
            borderBottom: '1px solid rgba(196, 181, 158, 0.3)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexShrink: 0,
            backgroundColor: '#faf8f4',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
              <div style={{ width: '20px', height: '1px', backgroundColor: '#bfa15f' }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.25em', color: '#bfa15f', textTransform: 'uppercase' }}>
                START A PROJECT
              </span>
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 500, color: '#1a1714', lineHeight: 1.1 }}>
              Send Us an Enquiry
            </h2>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12.5px', color: '#8a8278', marginTop: '0.25rem', lineHeight: 1.5 }}>
              Share your vision with us. We&apos;ll get back to you within 24 hours.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close enquiry form"
            onClick={onClose}
            style={{ background: 'white', border: '1px solid rgba(196,181,158,0.45)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <X size={16} color="#1a1714" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="enquiry-modal-form" style={{ padding: '1.35rem 2rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          {status === 'success' ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '3rem 0',
                gap: '1rem',
              }}
            >
              <CheckCircle size={48} color="#bfa15f" />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 400, color: '#1a1714' }}>
                Enquiry Received!
              </h3>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', color: '#8a8278', maxWidth: '340px', lineHeight: 1.65 }}>
                Thank you for reaching out. Our team will contact you within 24 hours to discuss your project.
              </p>
            </div>
          ) : status === 'error' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem', backgroundColor: '#fff5f5', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <AlertCircle size={18} color="#bfa15f" />
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#bfa15f' }}>
                Something went wrong. Please try again or call us directly.
              </p>
            </div>
          ) : (
            <>
              {/* Row 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="form-grid">
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    placeholder="Rajesh Kumar"
                    style={inputStyle(focused === 'name')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused(null)}
                    placeholder="+91 98765 43210"
                    style={inputStyle(focused === 'phone')}
                  />
                </div>
              </div>

              {/* Row 2: Email & Project Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginBottom: '0.9rem' }} className="form-grid">
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    placeholder="your@email.com"
                    style={inputStyle(focused === 'email')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Project Type *</label>
                  <select
                    required
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    onFocus={() => setFocused('projectType')}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle(focused === 'projectType'), cursor: 'pointer' }}
                  >
                    <option value="">Select project type</option>
                    {PROJECT_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Location & Budget */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginBottom: '0.9rem' }} className="form-grid">
                <div>
                  <label style={labelStyle}>Location</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    onFocus={() => setFocused('location')}
                    onBlur={() => setFocused(null)}
                    placeholder="Ludhiana, Punjab"
                    style={inputStyle(focused === 'location')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Approximate Budget</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    onFocus={() => setFocused('budget')}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle(focused === 'budget'), cursor: 'pointer' }}
                  >
                    <option value="">Select budget range</option>
                    {BUDGET_RANGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '1.15rem' }}>
                <label style={labelStyle}>Your Vision / Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  placeholder="Tell us about your project — size, design preferences, timeline, and anything else you'd like us to know..."
                  rows={3}
                  style={{ ...inputStyle(focused === 'message'), resize: 'vertical', minHeight: '76px' }}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '13px',
                  backgroundColor: status === 'submitting' ? '#9a7a38' : '#bfa15f',
                  color: 'white',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 20px rgba(191, 161, 95, 0.3)',
                }}
              >
                {status === 'submitting' ? (
                  <>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                      }}
                    />
                    Sending...
                  </>
                ) : (
                  <><Send size={14} /> Submit Enquiry</>
                )}
              </button>

              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#8a8278', textAlign: 'center', marginTop: '0.75rem', lineHeight: 1.5 }}>
                Or call us directly:{' '}
                <a href="tel:+918427930197" style={{ color: '#bfa15f', textDecoration: 'none', fontWeight: 600 }}>
                  +91 8427930197
                </a>
              </p>
            </>
          )}
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 580px) {
          .form-grid { grid-template-columns: 1fr !important; }
          .enquiry-modal-header { padding: 1.1rem 1.25rem 0.9rem !important; }
          .enquiry-modal-form { padding: 1.1rem 1.25rem 1.25rem !important; }
        }
      `}</style>
    </div>,
    document.body
  );
}
