# FORM & SPACE BY VPS — Architectural Studio Platform

A web platform built for **FORM & SPACE BY VPS**, a luxury architectural design, turnkey construction, and spatial engineering studio in Punjab, India. The application showcases residential villas, commercial towers, live on-site construction surveillance, and architectural drawings.

---

## 🌟 Core Website Features & Functionality

### 1. Interactive 360° Multi-Angle Viewer
* **Spherical & Multi-Angle Orbit**: Allows clients to view projects from four cardinal angles: 0° Front Elevation, 90° Right Profile, 180° Rear Garden, and 270° Left Profile.
* **Architectural Hotspots**: Interactive inspection pins plotted over coordinates (Curtain Wall Facade, Cantilevered Portico, Natural Travertine Cladding). Clicking a pin reveals technical construction specifications.
* **Daylight & Twilight Simulation**: Real-time lighting mode toggle adjusting hue, contrast, and color grading to preview projects under natural sunlight or warm evening twilight.
* **1:1 Uncropped Exact Fit**: Renders angle views in their true aspect ratio with zoom controls (mouse wheel or HUD slider) and an instant 1:1 reset button.

### 2. Architectural Blueprint & Floor Plan Viewer
* **Multi-Sheet Navigation**: Allows switching between different architectural drawings (Ground Floor Plan, Upper Floors, Section Elevations, and Structural Schematics).
* **High-Precision Scale Canvas**: Dark-matte technical viewer preserving fine drawing lines, dimensions, and statutory details with zero distortion or edge cropping.

### 3. High-Resolution Gallery
* **Uncropped Aspect Ratio Engine**: Configured with `object-fit: contain` by default to display photography in its native resolution and aspect ratio without artificial cropping.
* **Aspect Mode Toggle**: Provides a quick toggle between `✓ Exact Fit (Uncropped)` and `Fill Screen`.
* **Smooth Horizontal Navigation**: Touch-friendly horizontal thumbnail strip for rapid navigation across extensive photo collections.

### 4. Live On-Site Construction Tracker
* **Real-Time Surveillance Badge**: Highlights ongoing builds under active construction.
* **Progress Meter**: Visual progress percentage bar (e.g. 75% complete), current construction phase milestones (e.g. *Superstructure & Façade Glazing*), and target handover ETA.
* **Filter Integration**: Dedicated filter tag in the portfolio archive (`Live Projects`) for quick client inspection of ongoing works.

### 5. In-Browser Studio CMS / Admin Panel (`/admin`)
* **Passcode-Protected Dashboard**: Secure authentication gating the studio management tools.
* **Full Project Data Customization**: Ability to add, edit, or remove project titles, categories, locations, completion years, square footage, scopes of work, and materials.
* **Live Media Cloud Normalizer**: Automatically detects and normalizes raw Google Drive URLs (`drive.google.com/file/d/...`, `drive.google.com/open?id=...`, `lh3.googleusercontent.com/d/...`) into embeddable URLs with `no-referrer` protection.
* **Live Thumbnail Previews & Lightbox**: Interactive visual strips for Cover, Gallery, 360° Views, and Blueprints with single-click delete (`✕`) and full-screen inspection modal.
* **Data Persistence & Cloud Sync**: Automatically persists studio changes in browser `localStorage` and synchronizes with global React context.

### 6. Automated Google Sheets & Excel Webhook System
* **Consultation & Project Enquiry Modals**: Captures project inquiries, requested project types, locations, budget ranges, and client vision notes.
* **Multi-Tab Routing**: Automatically routes inquiries into designated Google Sheet tabs (e.g., General Enquiries vs. `Projects` tab).
* **Non-Blocking Protocol**: Implements `mode: 'no-cors'` with plain-text JSON payload encoding, guaranteeing data delivery to Google Apps Script webhooks.

---

## 🏗️ Code Architecture & Directory Structure

```
Suraj_site/
├── public/
│   ├── vps-logo.png             # Studio brand logo
│   ├── favicon.svg              # Browser tab icon
│   ├── _redirects               # SPA rewrite rule for Netlify
│   └── robots.txt               # Search engine crawler policies
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Responsive header with scroll-reactive styling & mobile drawer
│   │   ├── Hero.tsx             # Editorial landing hero with ambient particle engine
│   │   ├── FeaturedProject.tsx  # Editorial showcase for flagship studio works
│   │   ├── ProjectsPortfolio.tsx# Interactive project grid with category filtering
│   │   ├── ProjectDetail.tsx    # Modal containing the 360° viewer, blueprints & narrative
│   │   ├── EnquiryForm.tsx      # Multi-field project consultation modal
│   │   ├── Footer.tsx           # Studio branding, social links & legal navigation
│   │   └── PageTransition.tsx   # Smooth route change transition wrapper
│   ├── pages/
│   │   ├── HomePage.tsx         # Studio overview, featured works, process & statistics
│   │   ├── ProjectsPage.tsx     # Full architectural archive & live active builds
│   │   ├── AboutPage.tsx        # Studio philosophy, team credentials & craftsmanship values
│   │   ├── ServicesPage.tsx     # Architectural design, turnkey execution & consultation scopes
│   │   ├── AdminPage.tsx        # Complete studio CMS & project editor
│   │   ├── PrivacyPolicyPage.tsx# Client confidentiality & site privacy dossier
│   │   └── TermsOfUsePage.tsx   # Studio architectural copyright & usage terms
│   ├── context/
│   │   └── SiteDataContext.tsx  # Global state provider managing projects, services & CMS data
│   ├── data/
│   │   ├── projects.ts          # Default portfolio catalog, specs & fallback assets
│   │   └── services.ts          # Architectural service tiers & deliverables
│   ├── utils/
│   │   └── imageUrl.ts          # Google Drive CDN link normalizer & multi-link parsers
│   ├── config/
│   │   └── spreadsheet.ts       # Google Apps Script webhook integration & options
│   ├── App.tsx                  # Client router declaration & route scroll management
│   ├── main.tsx                 # React application mounting point
│   └── index.css                # Global design tokens, typography & keyframe animations
├── vercel.json                  # SPA rewrite configuration for Vercel deployment
├── vite.config.ts               # Vite configuration with chunk splitting & Tailwind plugin
└── package.json                 # Project dependencies & build scripts
```

---

## 💻 Tech Stack & Design System

* **Frontend Engine**: React 19 with TypeScript
* **Build Tooling**: Vite with optimized vendor chunking (`vendor-react`, `vendor-icons`)
* **Styling**: Tailwind CSS & scoped CSS with design token variables:
  * Brand Gold / Terracotta: `#bfa15f`
  * Studio Charcoal: `#131211` / `#1a1714`
  * Architectural Cream: `#faf8f5`
* **Typography**:
  * Headlines & Display: *Cormorant Garamond* (Editorial Serif)
  * Interface & Technical Specs: *Manrope* (Clean Sans-Serif)
* **Icons**: Lucide React
