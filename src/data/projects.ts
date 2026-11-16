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
    slug: 'modern-villa-exterior',
    title: 'Modern Villa Exterior',
    category: 'Residential',
    location: 'Ludhiana, Punjab',
    year: '2024',
    description: 'A luxury villa featuring bespoke architectural design, premium finishes, and a refined modern facade.',
    longDescription:
      'This luxury villa in Ludhiana represents modern residential architecture at its finest. Characterized by clean geometric lines, extensive use of natural stone cladding, and expansive glazing, the project blends indoor and outdoor living seamlessly. Every material was specified by our studio for quality, durability, and visual harmony (construction executed by an independent third-party contractor).',
    scope: ['Architectural Design', 'Structural Engineering', 'Interior Finishing', 'Landscape Architecture', 'Third-Party Turnkey Referral'],
    status: 'Completed',
    area: '4,200 sq.ft.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    ],
    views360: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    ],
    blueprints: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
    ],
    featured: true,
    materials: ['Italian Marble', 'Teak Wood', 'Aluminium Glazing', 'Natural Stone Cladding', 'Anti-skid Tiles'],
    stats: [
      { label: 'Built Area', value: '4,200 sq.ft.' },
      { label: 'Duration', value: '18 Months' },
      { label: 'Floors', value: '2' },
      { label: 'Year', value: '2024' },
    ],
  },
  {
    id: 2,
    slug: 'lumina-corporate-tower',
    title: 'Lumina Corporate Tower',
    category: 'Office',
    location: 'Aerocity, Mohali',
    year: '2024',
    description: 'A 7-story Grade-A sustainable commercial office building with high-performance glass facade.',
    longDescription:
      'Engineered for next-generation tech enterprises, Lumina Corporate Tower features column-free floor plates, integrated solar louvers, and expansive collaborative atriums. The design balances acoustical comfort with flood-lit biophilic work zones.',
    scope: ['Commercial Architecture', 'Structural Steel Design', 'HVAC & MEP Engineering', 'Smart BMS', 'Bespoke Facade'],
    status: 'Completed',
    area: '42,000 sq.ft.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    ],
    views360: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    ],
    featured: true,
    materials: ['Curtain Wall Glass', 'Anodized Bronze Aluminium', 'Engineered Quartz', 'Acoustic Slat Wood'],
    stats: [
      { label: 'Built Area', value: '42,000 sq.ft.' },
      { label: 'Floors', value: '7 Floors' },
      { label: 'Occupancy', value: '650+' },
      { label: 'Green Rating', value: 'GRIHA 4-Star' },
    ],
  },
  {
    id: 3,
    slug: 'the-atelier-luxury-boutique',
    title: 'The Atelier Luxury Boutique',
    category: 'Retail',
    location: 'Sector 17, Chandigarh',
    year: '2024',
    description: 'An haute-couture retail boutique combining micro-cement, warm brass accents, and dynamic spotlighting.',
    longDescription:
      'Designed to elevate high-end apparel shopping into an experiential gallery, The Atelier showcases curved fluted plaster walls, floating brass display racks, and sculpted travertine plinths. Every angle was formulated to optimize customer foot-traffic flow and product prominence.',
    scope: ['Retail Interior Architecture', 'Custom Lighting Layout', 'Bespoke Display Fixtures', 'Contractor Advisory'],
    status: 'Completed',
    area: '3,800 sq.ft.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80',
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80',
    ],
    views360: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80',
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80',
    ],
    featured: true,
    materials: ['Roman Travertine', 'Brushed Champagne Brass', 'Venetian Plaster', 'Smoked Glass'],
    stats: [
      { label: 'Retail Area', value: '3,800 sq.ft.' },
      { label: 'Timeline', value: '4 Months' },
      { label: 'Levels', value: '2' },
      { label: 'Year', value: '2024' },
    ],
  },
  {
    id: 4,
    slug: 'serene-minimalist-penthouse',
    title: 'Serene Minimalist Penthouse',
    category: 'Interior Design',
    location: 'Ludhiana, Punjab',
    year: '2024',
    description: 'An open-concept penthouse interior blending Japandi elegance with warm timber joinery.',
    longDescription:
      'A complete architectural interior transformation overlooking the city skyline. Features custom walnut cabinetry, seamless micro-concrete flooring, recessed ambient illumination, and a sculptural fluted marble kitchen island.',
    scope: ['Full Interior Architecture', 'Custom Millwork & Joinery', 'Furniture Curation', 'Smart Lighting Controls'],
    status: 'Completed',
    area: '4,600 sq.ft.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    ],
    views360: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80',
    ],
    materials: ['American Walnut', 'Micro-cement', 'Statuario Marble', 'Linen Upholstery', 'Brushed Nickel'],
    stats: [
      { label: 'Floor Space', value: '4,600 sq.ft.' },
      { label: 'Bedrooms', value: '4 Suites' },
      { label: 'Ceiling Height', value: '11.5 ft' },
      { label: 'Year', value: '2024' },
    ],
  },
  {
    id: 5,
    slug: 'grand-estate-residence-live',
    title: 'The Grand Estate Villa',
    category: 'Residential',
    location: 'Civil Lines, Jalandhar',
    year: '2025',
    description: 'A 6,500 sq.ft. neo-classical private estate currently in the active facade and finishing stage.',
    longDescription:
      'A magnum-opus private residence featuring soaring double-height porticos, sweeping helical stairs, and subterranean entertainment suites. Currently ongoing with structural shell 100% complete and facade cladding in active progress.',
    scope: ['Architectural Blueprinting', 'RCC Superstructure Design', 'Limestone Facade', 'Third-Party Turnkey Referral'],
    status: 'Under Construction',
    isLive: true,
    progress: 78,
    currentPhase: 'Façade Cladding & High-Performance Glazing',
    estimatedHandover: 'October 2025',
    area: '6,500 sq.ft.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    ],
    views360: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    ],
    featured: true,
    materials: ['Portuguese Limestone', 'Double Glazed Low-E Glass', 'Structural Steel', 'Burma Teak'],
    stats: [
      { label: 'Built Area', value: '6,500 sq.ft.' },
      { label: 'Current Progress', value: '78%' },
      { label: 'Target Handover', value: 'Oct 2025' },
      { label: 'Site Status', value: 'Live Active' },
    ],
  },
  {
    id: 6,
    slug: 'apex-commercial-plaza-live',
    title: 'Apex Business Center',
    category: 'Commercial',
    location: 'South City, Ludhiana',
    year: '2025',
    description: 'A 5-story premier retail and corporate complex currently undergoing structural framing.',
    longDescription:
      'Apex Business Center represents our largest ongoing commercial venture. The design prioritizes energy conservation with ventilated terracotta facades and double-height retail anchor stores on ground and mezzanine levels.',
    scope: ['Commercial Architecture', 'Deep Foundation Engineering', 'Third-Party Contractor Advisory', 'MEP Design'],
    status: 'Under Construction',
    isLive: true,
    progress: 55,
    currentPhase: 'RCC Floor Slab Castings & Structural Core (Level 4)',
    estimatedHandover: 'January 2026',
    area: '34,000 sq.ft.',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    ],
    views360: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    ],
    featured: true,
    materials: ['High Strength RCC', 'Terracotta Rainscreen', 'Toughened Glass', 'Structural Steel Trusses'],
    stats: [
      { label: 'Total Footprint', value: '34,000 sq.ft.' },
      { label: 'Current Progress', value: '55%' },
      { label: 'Floors', value: 'G + 4 Floors' },
      { label: 'Site Status', value: 'Live Active' },
    ],
  },
  {
    id: 7,
    slug: 'contemporary-dual-story',
    title: 'Contemporary Dual-Story',
    category: 'Residential',
    location: 'Mohali, Punjab',
    year: '2023',
    description: 'A contemporary custom-built residence featuring expansive glazing and modern spatial planning.',
    longDescription:
      'Built across two stories in Mohali, this contemporary residence showcases thoughtful spatial planning with an emphasis on natural light. Floor-to-ceiling glazing connects the living areas to a private garden, while the structured facade in off-white plaster and dark accents gives it a bold yet refined look.',
    scope: ['Custom Design', 'Structural Work', 'MEP Services', 'Interior Works', 'Finishing'],
    status: 'Completed',
    area: '3,600 sq.ft.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    ],
    views360: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    ],
    materials: ['Polished Concrete', 'Tempered Glass', 'Aluminium Frames', 'Veneer Panels', 'Quartz Countertops'],
    stats: [
      { label: 'Built Area', value: '3,600 sq.ft.' },
      { label: 'Duration', value: '15 Months' },
      { label: 'Floors', value: '2' },
      { label: 'Year', value: '2023' },
    ],
  },
  {
    id: 8,
    slug: 'luxury-custom-residence',
    title: 'Heritage Courtyard Residence',
    category: 'Residential',
    location: 'Patiala, Punjab',
    year: '2024',
    description: 'A sprawling luxury custom residence with bespoke architectural details and landscaped central courtyard.',
    longDescription:
      'Situated in Patiala, this luxury custom residence was designed around the vision of refined living with a passive cooling central courtyard. The home features bespoke architectural millwork, a double-height entrance lobby, and an infinity reflecting pool.',
    scope: ['Bespoke Architecture', 'Landscape Design', 'Interior Design', 'Smart Home Integration', 'Third-Party Turnkey Referral'],
    status: 'Completed',
    area: '5,800 sq.ft.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80',
    ],
    views360: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80',
    ],
    materials: ['Imported Marble', 'Walnut Veneer', 'Bronze Fixtures', 'Handcrafted Tiles', 'Oak Flooring'],
    stats: [
      { label: 'Built Area', value: '5,800 sq.ft.' },
      { label: 'Duration', value: '22 Months' },
      { label: 'Floors', value: '3' },
      { label: 'Year', value: '2024' },
    ],
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
