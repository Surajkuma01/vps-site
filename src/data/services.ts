export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  category: 'Design' | 'Engineering' | 'Construction' | 'Consulting';
  description: string;
  detailedOverview: string;
  deliverables: string[];
  workflowSteps: { step: string; detail: string }[];
  idealFor: string;
  image: string;
  iconName: string;
  featured?: boolean;
}

export interface ConsultationPackage {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  idealFor: string;
  features: string[];
  deliverable: string;
  isPopular?: boolean;
}

export const initialServices: ServiceItem[] = [
  {
    id: 'architectural-design',
    number: '01',
    title: 'Architectural Design & Masterplanning',
    tagline: 'Sculpting timeless structural forms driven by site context, natural light, and modern function.',
    category: 'Design',
    description:
      'From private luxury villas to expansive corporate landmarks, we synthesize spatial poetry with rigid structural logic.',
    detailedOverview:
      'Our architectural design practice begins with an intimate dialogue with the site’s topography, solar trajectory, and climatic microclimate. We avoid templated aesthetics, instead creating singular, bespoke architectural statements where form seamlessly follows purpose.',
    deliverables: [
      'Comprehensive Concept Schemes & 3D Spatial Renders',
      'Detailed Architectural Master Plans & Elevations',
      'Municipal & Development Authority Sanction Drawings',
      'Door/Window Schedules & Material Specifications',
      'BIM & High-Definition Sun Path & Ventilation Studies',
    ],
    workflowSteps: [
      { step: 'Site Analysis & Brief', detail: 'Orientation, zoning bylaws, contour assessment, and lifestyle study.' },
      { step: 'Schematic Design', detail: 'Massing models, volumetric sketches, and preliminary floorplate iterations.' },
      { step: 'Design Development', detail: 'Material palette curation, facade articulation, and engineering integration.' },
      { step: 'Statutory Approvals', detail: 'Sanction blueprints and compliance liaison with local authorities.' },
    ],
    idealFor: 'Custom Luxury Villas, High-End Commercial Complexes, Residential Bungalows',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    iconName: 'Building2',
    featured: true,
  },
  {
    id: 'consultation-service',
    number: '02',
    title: 'Architectural Advisory & Site Consultation',
    tagline: 'Expert 1-on-1 strategic guidance before you invest, acquire land, or commence construction.',
    category: 'Consulting',
    description:
      'In-depth feasibility, zoning bylaws, Vastu compliance, cost modeling, and layout audits directly with our principal architects.',
    detailedOverview:
      'Starting a project without professional architectural counsel often leads to expensive site remediation, planning rejections, and structural compromises. Our consultation service delivers structured clarity across land feasibility, bylaws potential, financial budgeting, and spatial optimization before a single rupee is committed to excavation.',
    deliverables: [
      'Site Feasibility & Topographical Potential Report',
      'Zoning & FAR (Floor Area Ratio) Legal Capacity Audit',
      'Vastu & Solar Orientation Spatial Analysis',
      'Realistic Cost Estimation & Phased Budget Matrix',
      'Conceptual Hand-Drafted Zoning/Layout Sketch',
    ],
    workflowSteps: [
      { step: 'Site Inspection & Intake', detail: 'Physical or virtual review of site dimensions, road width, and orientation.' },
      { step: 'Regulatory Due Diligence', detail: 'Scrutiny of setback limits, permissible heights, and utility tie-ins.' },
      { step: 'Strategy Session (1-on-1)', detail: 'Direct 90-minute design exploration with Principal Architect.' },
      { step: 'Deliverable Blueprint Memo', detail: 'Actionable PDF blueprint covering next steps, budget, and timeline.' },
    ],
    idealFor: 'Land Buyers, Real Estate Investors, Homeowners Planning Future Construction',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    iconName: 'MessageSquare',
    featured: true,
  },
  {
    id: 'interior-architecture',
    number: '03',
    title: 'Interior Architecture & Bespoke Styling',
    tagline: 'Tactile luxury, acoustic warmth, and customized joinery that elevate daily living into art.',
    category: 'Design',
    description:
      'Harmonious interior ecosystems curated with rare marbles, custom walnut millwork, tailored lighting, and acoustic comfort.',
    detailedOverview:
      'We treat interiors as a natural continuation of the exterior architecture. Every partition, niche, shadow-line, and lighting fixture is engineered to evoke intimacy and tactile joy, combining natural materials with intelligent ambient automation.',
    deliverables: [
      'Comprehensive Reflected Ceiling Plans (RCP) & Lighting Layouts',
      'Custom Millwork, Cabinetry & Joinery Technical Details',
      'Curated Stone, Timber, Fabric & Metallic Swatch Palettes',
      'Sanitary, Hardware & High-End Appliance Specifications',
      'Custom Furniture Design & Third-Party Vendor Sourcing',
    ],
    workflowSteps: [
      { step: 'Mood & Texture Palette', detail: 'Establishing emotional tone, materiality, and finish tactile standards.' },
      { step: 'Space Layout & Millwork', detail: 'Ergonomic optimization, circulation paths, and custom storage engineering.' },
      { step: 'Detailed Shop Drawings', detail: '1:10 scale fabrication blueprints for artisans and carpenters.' },
      { step: 'On-Site Curation', detail: 'Supervision of stone laying, veneer matching, and art installation.' },
    ],
    idealFor: 'Penthouses, Boutique Stores, Executive Offices, High-End Residences',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
    iconName: 'Home',
    featured: true,
  },
  {
    id: 'commercial-retail-design',
    number: '04',
    title: 'Commercial & Retail Space Planning',
    tagline: 'High-impact brand environments designed to maximize customer conversion, dwell time, and utility.',
    category: 'Design',
    description:
      'Storefront facades, flagship luxury boutiques, showroom spatial strategies, and high-footfall corporate environments.',
    detailedOverview:
      'Commercial architecture demands an acute balance between customer psychology and structural ergonomics. We architect retail spaces that draw pedestrians in, choreograph product sightlines, and establish unforgettable brand presence.',
    deliverables: [
      'High-Impact Storefront & Entrance Facade Architecture',
      'Foot-Traffic Circulation & Customer Dwell Heatmapping',
      'Modular Display Fixture & Merchandising Schematics',
      'HVAC, Smoke Evacuation & Emergency Egress Engineering',
      'Integrated Digital Signage & Experiential Display Portals',
    ],
    workflowSteps: [
      { step: 'Brand Identity Mapping', detail: 'Translating brand language into physical spatial narratives.' },
      { step: 'Traffic Choreography', detail: 'Designing paths of motion, display focal points, and checkout zones.' },
      { step: 'Fabrication Specs', detail: 'High-durability commercial materials, fixtures, and anti-glare lighting.' },
      { step: 'Fit-out Delivery', detail: 'Rapid-turnaround execution minimizing commercial rent downtime.' },
    ],
    idealFor: 'Fashion Flagships, Auto Showrooms, Multi-Brand Outlets, Corporate HQs',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    iconName: 'ShoppingBag',
    featured: true,
  },
  {
    id: 'structural-mep-engineering',
    number: '05',
    title: 'Structural Engineering & MEP Consulting',
    tagline: 'Robust, earthquake-resilient structures paired with whisper-quiet, energy-optimized mechanical systems.',
    category: 'Engineering',
    description:
      'Rigorous finite-element structural modeling, seismic zone compliance, and intelligent electrical/plumbing engineering.',
    detailedOverview:
      'The silent backbone of exceptional architecture is infallible structural integrity and seamless MEP integration. Our structural engineers optimize steel reinforcement and concrete grades to produce slender, soaring spans without unsightly bulkheads.',
    deliverables: [
      'Complete RCC & Structural Steel Analysis & Calculations',
      'Earthquake Resistance Certification & Soil Capacity Adaptation',
      'Electrical Load Profiling, Phase Balancing & Smart Home Schematics',
      'Plumbing Riser Diagrams, Rainwater Harvesting & Water Treatment',
      'HVAC Chiller / VRF Thermal Calculations & Duct Routing Plans',
    ],
    workflowSteps: [
      { step: 'Geotechnical Soil Testing', detail: 'Assessment of bearing capacity and foundation strategy.' },
      { step: 'Structural Modeling (ETABS/STAAD)', detail: 'Simulating wind and seismic shock loads.' },
      { step: 'MEP Clash Detection', detail: 'BIM 3D modeling preventing pipe and beam intersections.' },
      { step: 'Steel & Concrete Auditing', detail: 'Strict quality control testing on batching plants and reinforcement bars.' },
    ],
    idealFor: 'Multi-Story Buildings, Commercial Plazas, Expansive Cantilever Villas',
    image: 'https://lh3.googleusercontent.com/d/15pzdfChNTJQh06F8g4bMatfbd6qYyo5k',
    iconName: 'Layers',
  },
  {
    id: 'turnkey-construction',
    number: '06',
    title: 'Third-Party Turnkey Best Offers',
    tagline: 'We do not perform turnkey construction ourselves — we only provide third-party best offers from reliable contractors.',
    category: 'Consulting',
    description:
      'Need turnkey construction? We do not execute turnkey work directly — we only provide third-party best offers so you can choose the right independent contractor for your budget.',
    detailedOverview:
      'FORM & SPACE BY VPS focuses on architectural design and planning and does not undertake turnkey construction directly. Instead, we help you compare and access the best third-party turnkey offers from independent contractors, while all construction contracts and execution remain directly with the third-party contractor.',
    deliverables: [
      'Curated Third-Party Best Offers from Independent Turnkey Contractors',
      'Architectural Working Drawings & BOQ Reference for Accurate Quotes',
      'Side-by-Side Offer & Scope Comparison Support',
      'Optional Design Clarification Support During Execution',
    ],
    workflowSteps: [
      { step: 'Design & Drawing Completion', detail: 'We prepare architectural and structural drawings ready for contractor quotes.' },
      { step: 'Third-Party Best Offers', detail: 'We arrange and share competitive third-party turnkey offers suited to your project and budget.' },
      { step: 'Direct Client-Contractor Agreement', detail: 'All turnkey construction contracts, billing, and execution are done directly by the third-party contractor, not by us.' },
      { step: 'Design Support', detail: 'We remain available for architectural clarifications as needed.' },
    ],
    idealFor: 'Clients Seeking Architectural Design + Best Third-Party Turnkey Offers',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    iconName: 'Wrench',
    featured: true,
  },
  {
    id: 'renovation-restoration',
    number: '07',
    title: 'Renovation, Expansion & Adaptive Reuse',
    tagline: 'Reinvigorating existing structures with contemporary spatial openness and modern efficiency.',
    category: 'Construction',
    description:
      'Structural retrofitting, facade modernization, vertical floor additions, and heritage building restorations.',
    detailedOverview:
      'Older properties frequently suffer from cramped layouts, poor daylighting, and outdated electrical systems. We surgically alter existing load-bearing frameworks using carbon-fiber wraps and steel flitch beams to inject open-concept luxury into legacy properties.',
    deliverables: [
      'Structural Soundness & Non-Destructive Strength Testing',
      'Facade Overhaul & Cladding Modernization Plans',
      'Floor Plan Reconfiguration & Wall Removal Engineering',
      'Complete Plumbing & Electrical Wire Replacement Scheme',
      'Energy Efficiency Upgrades & Insulation Integration',
    ],
    workflowSteps: [
      { step: 'Structural Diagnostics', detail: 'Assessing cracks, dampness, foundation settlement, and reinforcement health.' },
      { step: 'Retrofitting Architecture', detail: 'Engineering steel beams and props for safe wall removals.' },
      { step: 'Selective Demolition', detail: 'Dust-contained, precision dismantlement preserving structural cores.' },
      { step: 'Modern Re-Engineering', detail: 'Installing new glazing, facades, and premium interior treatments.' },
    ],
    idealFor: 'Older Residences, Legacy Commercial Properties, Heritage Havens',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    iconName: 'Sparkles',
  },
  {
    id: '3d-visualization-bim',
    number: '08',
    title: '3D Visualization & Virtual Walkthroughs',
    tagline: 'Experience your project in photorealistic 4K and 360° virtual reality months before construction starts.',
    category: 'Design',
    description:
      'Hyper-realistic CGI renders, cinematographic drone video simulations, and 360-degree interactive virtual tours.',
    detailedOverview:
      'Eliminate guesswork with photorealistic 4K visual simulations. We build high-fidelity digital twins of your building to test lighting, finishes, and spatial proportions before breaking ground.',
    deliverables: [
      '4K Ultra-HD Photorealistic Exterior & Interior Renders',
      'Daylight vs. Twilight Architectural Atmosphere Studies',
      'Interactive 360-Degree Panoramic Virtual Tour Links',
      'Kinematic Video Walkthrough with Curated Soundtrack',
      'Cutaway 3D Floor Plans for Space Visualization',
    ],
    workflowSteps: [
      { step: '3D Volumetric Modeling', detail: 'Faithful translation of 2D CAD drawings into millimeter-accurate 3D meshes.' },
      { step: 'Material Texturing', detail: 'Applying authentic specular, roughness, and displacement maps.' },
      { step: 'Photometric Lighting', detail: 'Simulating geographical sunlight and exact photometric IES fixtures.' },
      { step: 'Post-Production & 4K Render', detail: 'Color grading and atmospheric depth simulation.' },
    ],
    idealFor: 'Pre-Construction Approvals, Investor Pitch Decks, Exact Client Preview',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    iconName: 'Eye',
  },
];

export const consultationPackages: ConsultationPackage[] = [
  {
    id: 'site-audit',
    name: 'Plot & Site Feasibility Audit',
    tagline: 'Ideal prior to purchasing land or starting initial architectural sketches.',
    duration: '60 Minutes',
    idealFor: 'Land Buyers & Plot Owners',
    features: [
      'Comprehensive plot orientation & sun-path analysis',
      'Municipal setback & permissible FAR calculations',
      'Initial height limitation & basement feasibility',
      'Road access & drainage connectivity assessment',
      'High-level construction cost ballpark estimate',
    ],
    deliverable: 'Written 4-Page Site Evaluation Matrix & Zoning Clearance Checklist',
  },
  {
    id: 'master-concept',
    name: 'VIP Architectural Strategy Session',
    tagline: 'Comprehensive 1-on-1 design blueprinting with our Principal Architect.',
    duration: '90 - 120 Minutes',
    idealFor: 'Luxury Villa Owners & Commercial Developers',
    isPopular: true,
    features: [
      'Everything in the Site Feasibility Audit',
      'Live conceptual hand-drafted spatial layout sketch',
      'Vastu Shastra alignment and energy balancing study',
      'Detailed itemized budget breakdown (civil, finishes, MEP)',
      'Material recommendation palette (stones, glazing, woods)',
      'Timeline roadmap from sanction to final handover',
    ],
    deliverable: 'Custom Strategic Design Brief + Hand-Drawn Preliminary Floorplate Concept',
  },
  {
    id: 'renovation-audit',
    name: 'Structural Renovation & Expansion Review',
    tagline: 'Expert diagnostic for remodeling, adding floors, or facade modernization.',
    duration: '75 Minutes',
    idealFor: 'Existing Homeowners & Commercial Tenants',
    features: [
      'Visual structural assessment of load-bearing elements',
      'Analysis for adding additional floors / rooftop terraces',
      'Space reorganization options (open-concept feasibility)',
      'Dampness, thermal loss & insulation diagnostic',
      'Cost-benefit assessment: renovate vs. rebuild',
    ],
    deliverable: 'Renovation Feasibility Report with Structural Upgrade Recommendations',
  },
];
