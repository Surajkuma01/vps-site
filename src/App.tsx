import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import EnquiryForm from './components/EnquiryForm';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import AdminPage from './pages/AdminPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import PageTransition from './components/PageTransition';
import { SiteDataProvider } from './context/SiteDataContext';

/* ── Route-level wrapper: scroll to top + fade transition ── */
function AnimatedRoutes() {
  const location = useLocation();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  // Scroll to top on route change or scroll to anchor if hash is present
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Navbar shown on all public pages */}
      {!isAdminPage && (
        <Navbar 
          onContactClick={() => setEnquiryOpen(true)} 
        />
      )}

      {/* Page transition wrapper keyed to location */}
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
          {/* Catch-all → home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </PageTransition>

      {/* Global enquiry form (available on all public pages) */}
      {!isAdminPage && (
        <EnquiryForm isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteDataProvider>
        <AnimatedRoutes />
      </SiteDataProvider>
    </BrowserRouter>
  );
}
