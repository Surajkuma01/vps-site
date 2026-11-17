export type ProjectCategory = 
  | 'Residential' 
  | 'Commercial' 
  | 'Office' 
  | 'Retail' 
  | 'Interior Design' 
  | 'Turnkey';

export interface ProjectStat {
  label: string;
  value: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: ProjectCategory;
  location: string;
  year: string;
  description: string;
  longDescription: string;
  scope: string[];
  status: 'Completed' | 'Under Construction' | 'Planning Phase' | 'Finishing Stage';
  area: string;
  image: string;
  gallery: string[];
  featured?: boolean;
  materials: string[];
  stats: ProjectStat[];
  
  // Live / Ongoing Project Features
  isLive?: boolean;
  progress?: number; // e.g. 75 for 75%
  currentPhase?: string; // e.g. "Façade Cladding & Interior MEP"
  estimatedHandover?: string; // e.g. "November 2025"

  // 360° / Multi-angle Panoramic Views
  views360?: string[]; // Array of angles or perspectives (0°, 90°, 180°, 270°)
  blueprints?: string[]; // Architectural plans / schematics
}

export const initialProjects: Project[] = [
  {
    id: 1,
    slug: 'neo-classical-villa',
    title: 'Neo Classical Villa',
    category: 'Residential',
    location: 'Ludhiana, Punjab',
    year: '2027',
    description: 'A luxury villa featuring bespoke architectural design, premium finishes, and a refined neo classical facade.',
    longDescription:
      'This luxury villa in Ludhiana represents modern residential architecture at its finest. Characterized by clean geometric lines, extensive use of natural stone cladding, and expansive glazing, the project blends indoor and outdoor living seamlessly. Every material was specified by our studio for quality, durability, and visual harmony (construction executed by an independent third-party contractor).',
    scope: [
      'Architectural Design',
      'Structural Engineering',
      'Interior Finishing',
      'Landscape Architecture',
      'Third-Party Turnkey Referral',
    ],
    status: 'Finishing Stage',
    area: '5200 sq.ft.',
    image: 'https://lh3.googleusercontent.com/d/1Y2hjShxMlUxEGs_geRjDQ0AluZSQfU_H',
    gallery: [
      'https://lh3.googleusercontent.com/d/1Y2hjShxMlUxEGs_geRjDQ0AluZSQfU_H',
      'https://lh3.googleusercontent.com/d/1TtK8bpViYgm7Oofxi84hzZBq9401R56M',
      'https://lh3.googleusercontent.com/d/166LLv0fub-TsAsmZeTg1N-YJn4kOEVQd',
    ],
    views360: [
      'https://lh3.googleusercontent.com/d/1Y2hjShxMlUxEGs_geRjDQ0AluZSQfU_H',
      'https://lh3.googleusercontent.com/d/1TtK8bpViYgm7Oofxi84hzZBq9401R56M',
      'https://lh3.googleusercontent.com/d/166LLv0fub-TsAsmZeTg1N-YJn4kOEVQd',
    ],
    blueprints: [],
    featured: true,
    materials: [
      'Teak Wood',
      'Aluminium Glazing',
      'Natural Stone Cladding',
      'Anti-skid Tiles',
      'Italian Tiles',
      'Granite Flooring',
      'Textured Paint',
    ],
    stats: [
      { label: 'Built Area', value: '5,200 sq.ft.' },
      { label: 'Duration', value: '30 Months' },
      { label: 'Floors', value: '2.5' },
      { label: 'Year', value: '2027' },
    ],
    isLive: true,
    progress: 80,
    currentPhase: 'Flooring and Pop Ceiling',
    estimatedHandover: ' Dec 2027',
  },
  {
    id: 2,
    slug: 'cafe-classic',
    title: 'Cafe Classic',
    category: 'Commercial',
    location: 'Mullanpur Dakha, Ludhiana',
    year: '2027',
    description: 'Crafting Spaces, Creating Experiences',
    longDescription:
      'Cafe Classic is an architectural design project focused on creating an elegant, comfortable, and inviting café environment. The design emphasizes a perfect balance of aesthetics, functionality, and customer experience.',
    scope: ['Architectural Design', 'Third-Party Turnkey Referral'],
    status: 'Under Construction',
    area: '1200 sq.ft.',
    image: 'https://lh3.googleusercontent.com/d/1qIeKT3lihpHUEb_vKrOgsbobq7yPUEHm',
    gallery: [
      'https://lh3.googleusercontent.com/d/1qIeKT3lihpHUEb_vKrOgsbobq7yPUEHm',
      'https://lh3.googleusercontent.com/d/1Uow2XU60dedd89rGYkp9kSetPG6f9jRI',
      'https://lh3.googleusercontent.com/d/1z78VACLDrxZM2_QI0QW4yqbyFNCAw1OX',
    ],
    views360: [
      'https://lh3.googleusercontent.com/d/1qIeKT3lihpHUEb_vKrOgsbobq7yPUEHm',
      'https://lh3.googleusercontent.com/d/1Uow2XU60dedd89rGYkp9kSetPG6f9jRI',
      'https://lh3.googleusercontent.com/d/1z78VACLDrxZM2_QI0QW4yqbyFNCAw1OX',
    ],
    featured: true,
    materials: ['WPC louver', 'GRC Molding', 'VItrified Tiles', 'Textured Paint', 'Elegant Interior'],
    stats: [
      { label: 'Built Area', value: '1200 sq.ft.' },
      { label: 'Floors', value: '2 Floors' },
      { label: 'Occupancy', value: '35' },
    ],
    isLive: true,
    progress: 5,
    currentPhase: 'excavation',
    estimatedHandover: 'July 2027',
    blueprints: [],
  },
  {
    id: 3,
    slug: 'aarambh-villa',
    title: 'Aarambh Villa',
    category: 'Residential',
    location: 'Haryana',
    year: '2026',
    description: 'Where Elegance Meets Eternity',
    longDescription:
      'Aarambh Villa is a perfect blend of contemporary architecture and classical elegance. Featuring graceful arches, refined facade detailing, warm beige tones and luxurious lighting, the residence creates a timeless expression of sophistication, comfort and modern living.',
    scope: ['Architectural Design', 'Third-Party Turnkey Referral'],
    status: 'Completed',
    area: '7000 sq.ft.',
    image: 'https://lh3.googleusercontent.com/d/14eJuccu7iOr37WdwzvWijmVmTsbmfIEu',
    gallery: [
      'https://lh3.googleusercontent.com/d/14eJuccu7iOr37WdwzvWijmVmTsbmfIEu',
      'https://lh3.googleusercontent.com/d/1iUjauicoA0w7gHKDXWAR4wHj5B2qAygF',
      'https://lh3.googleusercontent.com/d/1XRvaosvLdxjAClQyOR24QlqSSCrlFBj_',
      'https://lh3.googleusercontent.com/d/1Bg2q8b4s8oo6tJOVZwrVEvwv-T9JTzE2',
    ],
    views360: [
      'https://lh3.googleusercontent.com/d/14eJuccu7iOr37WdwzvWijmVmTsbmfIEu',
      'https://lh3.googleusercontent.com/d/1iUjauicoA0w7gHKDXWAR4wHj5B2qAygF',
      'https://lh3.googleusercontent.com/d/1XRvaosvLdxjAClQyOR24QlqSSCrlFBj_',
      'https://lh3.googleusercontent.com/d/1Bg2q8b4s8oo6tJOVZwrVEvwv-T9JTzE2',
    ],
    featured: true,
    materials: [
      'natural Stone',
      'Textured Paint',
      'GRC Molding',
      'M/S Railing',
      'Italian Tiles',
      'Granite Outdoor Flooring',
    ],
    stats: [
      { label: 'Built up Area', value: '7000 sq.ft.' },
      { label: 'Timeline', value: '24 Months' },
      { label: 'Levels', value: '2.5' },
      { label: 'Year', value: '2026' },
    ],
    isLive: false,
    progress: 75,
    currentPhase: '',
    estimatedHandover: '',
    blueprints: [],
  },
  {
    id: 4,
    slug: 'modern-villa',
    title: 'Modern Villa ',
    category: 'Residential',
    location: 'Dugri,Ludhiana, Punjab',
    year: '2027',
    description: 'Where Contemporary Architecture Meets Luxury, Comfort & Elegance',
    longDescription:
      'The Modern Villa is a thoughtfully designed residential architectural project that brings together contemporary aesthetics, luxury, comfort, and functionality. The design aims to create a refined living experience through modern architectural elements, spacious layouts, elegant detailing, and a strong connection with the surrounding environment.',
    scope: ['Architectural Design', 'Third-Party Turnkey Referral'],
    status: 'Finishing Stage',
    area: '5400 sq.ft.',
    image: 'https://lh3.googleusercontent.com/d/1h1I183UA4XXJ1id5BDvGfh4RbqRBatDG',
    gallery: [
      'https://lh3.googleusercontent.com/d/1iFFEi0RXb6UwfOEHHKe0hvXboq2bp-xl',
      'https://lh3.googleusercontent.com/d/1zmDVD_coDpe62pgjJjn48SNhiMCSSFem',
      'https://lh3.googleusercontent.com/d/1O4hqSkUrC_ee9jAI2_jOhV_uBWXxLZWl',
      'https://lh3.googleusercontent.com/d/1h1I183UA4XXJ1id5BDvGfh4RbqRBatDG',
      'https://lh3.googleusercontent.com/d/1W2uohxSkZbTQZUGNTzGmt1fW-4V0ZX2i',
      'https://lh3.googleusercontent.com/d/1qOq6dzqk3jxPaMB4t0LoQ0VEydTJyNMw',
    ],
    views360: [
      'https://lh3.googleusercontent.com/d/1iFFEi0RXb6UwfOEHHKe0hvXboq2bp-xl',
      'https://lh3.googleusercontent.com/d/1zmDVD_coDpe62pgjJjn48SNhiMCSSFem',
      'https://lh3.googleusercontent.com/d/1O4hqSkUrC_ee9jAI2_jOhV_uBWXxLZWl',
      'https://lh3.googleusercontent.com/d/1h1I183UA4XXJ1id5BDvGfh4RbqRBatDG',
      'https://lh3.googleusercontent.com/d/1W2uohxSkZbTQZUGNTzGmt1fW-4V0ZX2i',
      'https://lh3.googleusercontent.com/d/1qOq6dzqk3jxPaMB4t0LoQ0VEydTJyNMw',
    ],
    materials: [
      'WPC Louver',
      'Tagan Glass Railing',
      'Natural Stone',
      'Vertical Gardening',
      'Textured Paint',
      'Italian Tile',
      'Granite Flooring',
    ],
    stats: [
      { label: 'Built up Space', value: '5400 sq.ft.' },
      { label: 'Floors', value: '2' },
      { label: 'Year', value: '2027' },
    ],
    featured: false,
    isLive: true,
    progress: 86,
    currentPhase: '',
    estimatedHandover: 'September 2027',
    blueprints: [],
  },
  {
    id: 5,
    slug: 'the-mobile-studio',
    title: 'The Mobile Studio',
    category: 'Commercial',
    location: 'Dhandari Kalan, Ludhiana, Punjab',
    year: '2026',
    description: 'Where Innovation Meets Experience – A Modern Destination for Technology, Style, and Smart Living',
    longDescription:
      'The Mobile Studio is a contemporary commercial showroom design project envisioned to create an engaging, premium, and customer-friendly retail environment. The design focuses on combining modern aesthetics with functional space planning to deliver a seamless shopping experience.',
    scope: ['Architectural Design', 'Third-Party Turnkey Referral'],
    status: 'Completed',
    isLive: false,
    progress: 78,
    currentPhase: 'Façade Cladding & High-Performance Glazing',
    estimatedHandover: 'October 2025',
    area: '420 sq.ft.',
    image: 'https://lh3.googleusercontent.com/d/1AM1mbLbx9aA7RpmROJqKnbq311XEUFTP',
    gallery: [
      'https://lh3.googleusercontent.com/d/1AM1mbLbx9aA7RpmROJqKnbq311XEUFTP',
      'https://lh3.googleusercontent.com/d/1t0P6YN2A99SCTIuGq284uQA1X5fK1Sjm',
      'https://lh3.googleusercontent.com/d/1r4wDCt7-qX44m-YwWitcajqnlsqfbfnW',
      'https://lh3.googleusercontent.com/d/1mrCRqPE1G4qP8hEQcXCcKKnf0V7WKmXy',
      'https://lh3.googleusercontent.com/d/1_mN_-p0hLS8miA1CtaCfZKA1Uk8EZHep',
    ],
    views360: [
      'https://lh3.googleusercontent.com/d/1AM1mbLbx9aA7RpmROJqKnbq311XEUFTP',
      'https://lh3.googleusercontent.com/d/1t0P6YN2A99SCTIuGq284uQA1X5fK1Sjm',
      'https://lh3.googleusercontent.com/d/1r4wDCt7-qX44m-YwWitcajqnlsqfbfnW',
      'https://lh3.googleusercontent.com/d/1mrCRqPE1G4qP8hEQcXCcKKnf0V7WKmXy',
      'https://lh3.googleusercontent.com/d/1_mN_-p0hLS8miA1CtaCfZKA1Uk8EZHep',
    ],
    featured: true,
    materials: ['ACP Sheet', 'MS Frame', 'Illuminated Strips', 'Pop ceiling', 'VPC louver', 'Vitrified  Tile'],
    stats: [
      { label: 'Built Area', value: '420 sq.ft.' },
      { label: 'Floor', value: '2' },
      { label: 'Site Status', value: 'Completed' },
    ],
    blueprints: [],
  },
  {
    id: 6,
    slug: 'sukhmani-villa',
    title: 'Sukhmani Villa',
    category: 'Residential',
    location: 'Subhash Colony, Mullanpur Dakha,Ludhiana',
    year: '2028',
    description: 'An Expression of Modern Elegance, Where Contemporary Architecture, Natural Beauty, and Luxurious Living Come Together in Perfect Harmony',
    longDescription:
      'Sukhmani Villa is a contemporary residential architectural project designed to reflect elegance, sophistication, and modern living. The architectural concept combines clean geometric forms, balanced proportions, premium natural textures, and thoughtfully integrated lighting to create a distinctive residential identity',
    scope: ['Architectural Design', 'Third-Party Turnkey Referral'],
    status: 'Under Construction',
    isLive: true,
    progress: 40,
    currentPhase: 'Ground Floor Slab Casting',
    estimatedHandover: 'Jan 2028',
    area: '3375 sq.ft.',
    image: 'https://lh3.googleusercontent.com/d/1FfQlp-F0tTP0QKDhKQwPFDbusHRT1pq1',
    gallery: [
      'https://lh3.googleusercontent.com/d/1ybs9H8MGbia9FDqgu4DTUbGWh1TuKPkH',
      'https://lh3.googleusercontent.com/d/1R8HyodPLXwvDeJP0-qKOBOr9E65uLpOn',
      'https://lh3.googleusercontent.com/d/1ZApPWmrta6Zv2KtrSrEyh719gR4mJ-u3',
      'https://lh3.googleusercontent.com/d/1TtsPc9F2058R90PP9O6-X7fyIl0W1suC',
    ],
    views360: [
      'https://lh3.googleusercontent.com/d/1ybs9H8MGbia9FDqgu4DTUbGWh1TuKPkH',
      'https://lh3.googleusercontent.com/d/1R8HyodPLXwvDeJP0-qKOBOr9E65uLpOn',
      'https://lh3.googleusercontent.com/d/1ZApPWmrta6Zv2KtrSrEyh719gR4mJ-u3',
      'https://lh3.googleusercontent.com/d/1TtsPc9F2058R90PP9O6-X7fyIl0W1suC',
    ],
    featured: true,
    materials: ['Textured Paint', 'Natural Stone', 'MS Parabola', 'Tafan Glass Railing', 'Sofit Panel'],
    stats: [
      { label: 'Total Footprint', value: '3375 sq.ft.' },
      { label: 'Current Progress', value: '40%' },
      { label: 'Floors', value: '2.5  Floors' },
      { label: 'Site Status', value: 'Live Active' },
    ],
    blueprints: [],
  },
  {
    id: 7,
    slug: 'punjabi-classical-villa',
    title: 'Punjabi Classical Villa',
    category: 'Residential',
    location: 'Mullanpur Link Road,Ludhiana',
    year: '2028',
    description: 'Celebrating the Rich Heritage of Punjabi Architecture Through Timeless Elegance, Traditional Craftsmanship, and Contemporary Luxury',
    longDescription:
      'The Punjabi Classical Villa is a residential architectural project inspired by the richness of traditional Punjabi aesthetics, blended with classical architectural elements and modern-day comfort. The design reflects a strong cultural identity through its elegant façade, traditional detailing, and warm, welcoming character',
    scope: ['Architectural Design', 'Third-Party Turnkey Referral'],
    status: 'Under Construction',
    area: '5500 sq.ft.',
    image: 'https://lh3.googleusercontent.com/d/1XL4Pd2ZDKobx5k53T1oMj_UquytzZYCp',
    gallery: [
      'https://lh3.googleusercontent.com/d/1XL4Pd2ZDKobx5k53T1oMj_UquytzZYCp',
      'https://lh3.googleusercontent.com/d/151jPLx0RBOpupprHSut77zrPP5DUbxpP',
      'https://lh3.googleusercontent.com/d/1rEE0VvUXWroXgAvtMRalYy-0afrh3l2U',
      'https://lh3.googleusercontent.com/d/1YcsYGnxEp8rkGvoWwcvidFdE3KKb6XtN',
      'https://lh3.googleusercontent.com/d/1SZasXdUlDgyqDiWHSpJZY0vYy7mSySRT',
    ],
    views360: [
      'https://lh3.googleusercontent.com/d/1XL4Pd2ZDKobx5k53T1oMj_UquytzZYCp',
      'https://lh3.googleusercontent.com/d/151jPLx0RBOpupprHSut77zrPP5DUbxpP',
      'https://lh3.googleusercontent.com/d/1rEE0VvUXWroXgAvtMRalYy-0afrh3l2U',
      'https://lh3.googleusercontent.com/d/1YcsYGnxEp8rkGvoWwcvidFdE3KKb6XtN',
      'https://lh3.googleusercontent.com/d/1SZasXdUlDgyqDiWHSpJZY0vYy7mSySRT',
    ],
    materials: [
      'Polished Concrete',
      'Tempered Glass',
      'MS Railing',
      'Blusters Railing',
      'Textured Paint',
      'Natural Stone',
    ],
    stats: [
      { label: 'Built Area', value: '5500 sq.ft.' },
      { label: 'Duration', value: '36 Months' },
      { label: 'Floors', value: '2.5' },
      { label: 'Year', value: '2028' },
    ],
    featured: false,
    isLive: true,
    progress: 70,
    currentPhase: '',
    estimatedHandover: 'April 2028',
    blueprints: [],
  },
  {
    id: 8,
    slug: 'modern-tropical-villa',
    title: 'Modern Tropical Villa',
    category: 'Residential',
    location: 'Mullanpur Dakha, Punjab',
    year: '2028',
    description: 'Where Tropical Serenity Meets Modern Luxury – A Perfect Harmony of Nature, Architecture, and Contemporary Living',
    longDescription:
      'The Modern Tropical Villa is a contemporary residential architectural project inspired by the beauty of tropical surroundings and the simplicity of modern design. The concept focuses on creating a peaceful, refreshing, and elegant living environment by blending natural elements with clean architectural forms and functional spaces.',
    scope: ['Architectural Design', 'Third-Party Turnkey Referral'],
    status: 'Planning Phase',
    area: '3600 sq.ft.',
    image: 'https://lh3.googleusercontent.com/d/1eF9R03u5HKaGxIByxI20kcmvr8TDSTlO',
    gallery: [
      'https://lh3.googleusercontent.com/d/1eF9R03u5HKaGxIByxI20kcmvr8TDSTlO',
      'https://lh3.googleusercontent.com/d/1sUGTbBtgqtET9MAOo3046vSxnfF_E35V',
      'https://lh3.googleusercontent.com/d/1unm_KKkk51rplpLksKOs_A_76V_nSyvz',
    ],
    views360: [
      'https://lh3.googleusercontent.com/d/1eF9R03u5HKaGxIByxI20kcmvr8TDSTlO',
      'https://lh3.googleusercontent.com/d/1sUGTbBtgqtET9MAOo3046vSxnfF_E35V',
      'https://lh3.googleusercontent.com/d/1unm_KKkk51rplpLksKOs_A_76V_nSyvz',
    ],
    materials: ['Sofit Panel', 'Tafan Glass', 'Natural Stone Cladding', 'Textured Paint', 'Veneer Door'],
    stats: [
      { label: 'Built Area', value: '3600 sq.ft.' },
      { label: 'Duration', value: '24 Months' },
      { label: 'Floors', value: '2.5' },
      { label: 'Year', value: '2028' },
    ],
    featured: false,
    isLive: false,
    progress: 75,
    currentPhase: '',
    estimatedHandover: '',
    blueprints: [],
  },
];

// For backward compatibility
export const projects = initialProjects;

export type FilterCategory = 'ALL' | 'Residential' | 'Commercial' | 'Office' | 'Retail' | 'Interior Design' | 'Live Projects';

export const filterCategories: FilterCategory[] = [
  'ALL',
  'Residential',
  'Commercial',
  'Office',
  'Retail',
  'Interior Design',
  'Live Projects',
];
