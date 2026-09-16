export interface Project {
  id: string;
  name: string;
  location: string;
  type: string;
  status: 'Ongoing' | 'Completed' | 'Ready to Move' | 'Upcoming';
  reraNumber?: string;
  category: 'residential' | 'apartments' | 'plotting' | 'villas';
  description: string;
  fullDescription: string;
  gallery: string[];
  amenities: string[];
  mainImage: string;
}

export const PROJECTS: Project[] = [
  // --- ONGOING PROJECTS ---
  {
    id: 'chalamaji-signature',
    name: 'Chalamaji Signature',
    location: 'Pandurangapuram, Visakhapatnam',
    type: 'Premium Apartments',
    status: 'Ongoing',
    category: 'apartments',
    description: 'A premium residential project featuring world-class amenities, modern architecture, and thoughtful design in the heart of Visakhapatnam.',
    fullDescription: 'Chalamaji Signature redefines luxury living in Visakhapatnam. Located in the prestigious neighborhood of Pandurangapuram, this project offers an unparalleled lifestyle with breathtaking coastal views, meticulously designed interiors, and top-tier amenities.',
    gallery: [
      'assets/images/projects/signature-1.jpg',
      'assets/images/projects/signature-2.jpg',
      'assets/images/projects/signature-3.jpg'
    ],
    amenities: ['Swimming Pool', 'Gymnasium', 'Clubhouse', '24/7 Security', 'Landscaped Gardens', 'Power Backup'],
    mainImage: 'https://res.cloudinary.com/djha4r2ys/image/upload/v1789407538/69e8968e-b89c-469d-b52b-0548a47d65f9.png'
  },
  {
    id: 'ayodhara-plotting',
    name: 'Ayodhara',
    location: 'Opp. Ramanarayanam Temple, Vizianagaram',
    type: 'Divine Plotted Layout',
    status: 'Ongoing',
    category: 'plotting',
    reraNumber: '83/2026/1167/VMRDA/DPMS',
    description: '36 Divine residential plots across 2.6 acres situated opposite the sacred Ramanarayanam Temple in Vizianagaram.',
    fullDescription: 'Ayodhara represents a sacred way of living — rooted in Dharma, enriched by heritage, and inspired by peace. Developed in collaboration with SVN Shivajyothi Group, featuring Shanti Vanam park, tennis court, avenue trees, 100% Vaastu compliance, and immediate registration.',
    gallery: [
      'assets/images/ayodhara/entrance-gate.jpg',
      'assets/images/ayodhara/shanti-vanam.jpg',
      'assets/images/ayodhara/master-plan.jpg',
      'assets/images/ayodhara/lifestyle-collage.jpg'
    ],
    amenities: ['Grand Entrance Arch', 'Shanti Vanam Park', 'Tennis Court', 'Children\'s Play Park', 'Avenue Plantation', '100% Vaastu Compliant', 'Street Lighting'],
    mainImage: 'assets/images/ayodhara/entrance-gate.jpg'
  },
  {
    id: 'avenue-21',
    name: 'Avenue 21',
    location: 'Vizianagaram',
    type: 'Gated Plotted Layout',
    status: 'Ongoing',
    category: 'plotting',
    description: 'Strategically located open plots in Vizianagaram with world-class infrastructure and high-appreciation investment potential.',
    fullDescription: 'Avenue 21 is a meticulously planned plotted development in the booming growth corridor of Vizianagaram. Offering fully approved layouts with immediate registration, clear legal titles, and modern gated community amenities.',
    gallery: [
      'assets/images/projects/plots-2.jpg',
      'assets/images/projects/plots-1.jpg'
    ],
    amenities: ['Gated Community', 'All-Round Compound Wall', 'Overhead Water Tank', 'Street Lighting', 'Curated Parks'],
    mainImage: 'assets/images/projects/plots-main.jpg'
  },
  {
    id: 'chalamaji-urban',
    name: 'Chalamaji Urban',
    location: 'Chinnamushidiwada, Visakhapatnam',
    type: 'Plotted Community',
    status: 'Ongoing',
    category: 'plotting',
    description: 'An exclusive plotted enclave in Chinnamushidiwada, combining natural serenity with rapid city connectivity.',
    fullDescription: 'Chalamaji Urban offers thoughtfully demarcated residential plots in Chinnamushidiwada. Built with high-grade road networks, stormwater management, and dedicated green reserves to ensure a tranquil and organized neighborhood.',
    gallery: [
      'assets/images/projects/plots-1.jpg',
      'assets/images/projects/plots-2.jpg'
    ],
    amenities: ['Wide CC Roads', 'Water Supply Lines', 'Rainwater Harvesting', 'Landscaped Buffer Zones', '24/7 CCTV Monitoring'],
    mainImage: 'assets/images/projects/plots-main.jpg'
  },
  {
    id: 'chalamaji-prestige',
    name: 'Chalamaji Prestige',
    location: 'Chinnamushidiwada, Visakhapatnam',
    type: 'Luxury Plotted Enclave',
    status: 'Ongoing',
    category: 'plotting',
    description: 'A distinguished plotted project offering premium residential land for elevated, independent living in Chinnamushidiwada.',
    fullDescription: 'Chalamaji Prestige is crafted for discerning homeowners who desire independent living in a fully secured, master-planned environment. Located in close proximity to premier educational institutions and transport hubs.',
    gallery: [
      'assets/images/projects/plots-2.jpg',
      'assets/images/projects/plots-1.jpg'
    ],
    amenities: ['Entrance Plaza', 'Solar Street Lighting', 'Jogging Track', 'Underground Cabling', 'Designer Landscaping'],
    mainImage: 'assets/images/projects/plots-main.jpg'
  },
  {
    id: 'chalamaji-the-orchid',
    name: 'Chalamaji The Orchid',
    location: 'Yendada, Visakhapatnam',
    type: 'Premium Apartments',
    status: 'Ongoing',
    reraNumber: 'P03280056829',
    category: 'apartments',
    description: 'A stunning new development in Yendada offering premium apartments with state-of-the-art facilities.',
    fullDescription: 'Nestled in the rapidly growing corridor of Yendada, The Orchid by Chalamaji Infra brings you a lifestyle of unparalleled luxury. With thoughtfully planned spaces that maximize natural light and ventilation, The Orchid is designed to be your perfect sanctuary.',
    gallery: [
      'https://res.cloudinary.com/tney5nvf/image/upload/v1787496276/9d54cde0-6c7f-415a-9c4b-d291735fe504.png',
      'assets/images/projects/orchid-2.jpg',
      'assets/images/projects/orchid-3.jpg'
    ],
    amenities: ['Infinity Pool', 'Yoga Deck', 'Multi-purpose Court', 'Indoor Games Room', 'Lounge Area'],
    mainImage: 'https://res.cloudinary.com/tney5nvf/image/upload/v1787496600/993fadb3-0cb8-49d9-b58d-dc045763dbae.png'
  },

  // --- UPCOMING PROJECTS ---
  {
    id: 'fortune-city',
    name: 'Fortune City',
    location: 'Tagarapuvalasa, Visakhapatnam',
    type: 'Mega Plotted Township',
    status: 'Upcoming',
    category: 'plotting',
    description: 'An expansive upcoming integrated plotted township in the fast-emerging investment corridor of Tagarapuvalasa.',
    fullDescription: 'Fortune City by Chalamaji Infra is a visionary mega-township in Tagarapuvalasa. Set along the primary growth axis of Visakhapatnam, offering world-class infrastructure, commercial hubs, sports amenities, and peaceful green living.',
    gallery: [
      'assets/images/projects/plots-1.jpg',
      'assets/images/projects/plots-2.jpg'
    ],
    amenities: ['Clubhouse & Pool', 'Commercial Retail Zone', 'Sports Arena', 'Lush Central Parks', 'Wide Arterial Roads'],
    mainImage: 'assets/images/projects/plots-main.jpg'
  },

  // --- COMPLETED PROJECTS ---
  {
    id: 'chalamajis-landmark',
    name: "Chalamaji's Landmark",
    location: 'Madhurawada, Visakhapatnam',
    type: 'Luxury Villas',
    status: 'Completed',
    reraNumber: 'P03280020629',
    category: 'villas',
    description: 'Exclusive completed luxury villas with spacious layouts, private gardens, and premium architectural finishes in Madhurawada.',
    fullDescription: "Chalamaji's Landmark offers a tranquil escape from the city bustle while keeping you connected to essential conveniences. These luxury villas boast expansive living spaces, private outdoor areas, and sophisticated architectural elements.",
    gallery: [
      'assets/images/projects/landmark-1.jpg',
      'assets/images/projects/landmark-2.jpg',
      'assets/images/projects/landmark-3.jpg'
    ],
    amenities: ['Private Garden', 'Gated Community', 'Swimming Pool', 'Children\'s Play Area', 'Jogging Track'],
    mainImage: 'assets/images/projects/landmark-main.jpg'
  },
  {
    id: 'chalamaji-alliance',
    name: 'Chalamaji Alliance',
    location: 'Chinnamushidiwada / Sujatha Nagar, Visakhapatnam',
    type: 'Residential Apartments',
    status: 'Completed',
    reraNumber: 'P03240100314',
    category: 'apartments',
    description: 'A completed residential project that has become a thriving community. Modern apartments with excellent connectivity and amenities.',
    fullDescription: 'Chalamaji Alliance stands as a testament to quality construction and timely delivery. Now a vibrant community, it offers residents a harmonious blend of modern living and natural surroundings.',
    gallery: [
      'assets/images/projects/alliance-1.jpg',
      'assets/images/projects/alliance-2.jpg',
      'assets/images/projects/alliance-3.jpg'
    ],
    amenities: ['Community Hall', 'Gymnasium', 'Walking Track', 'CCTV Surveillance', 'Rainwater Harvesting'],
    mainImage: 'assets/images/projects/alliance-main.jpg'
  },
  {
    id: 'chalamaji-one',
    name: 'Chalamaji One',
    location: 'Visakhapatnam',
    type: 'Contemporary Residences',
    status: 'Completed',
    category: 'apartments',
    description: 'A flagship completed residential tower delivering modern architecture, seamless layouts, and prime urban accessibility.',
    fullDescription: 'Chalamaji One represents architectural sophistication in the heart of Visakhapatnam. A completed landmark with boutique apartments, premium construction standards, and enduring family living spaces.',
    gallery: [
      'assets/images/projects/alliance-1.jpg',
      'assets/images/projects/signature-2.jpg'
    ],
    amenities: ['Grand Lobby', 'Rooftop Terrace', 'Fitness Center', 'High-Speed Elevators', 'Power Backup'],
    mainImage: 'assets/images/projects/signature-main.jpg'
  },
  {
    id: 'chalamaji-the-collective',
    name: 'Chalamaji The Collective',
    location: 'Yendada, Visakhapatnam',
    type: 'Luxury Residences',
    status: 'Completed',
    reraNumber: 'P03280052306',
    category: 'apartments',
    description: 'A collection of bespoke luxury residences that offer an elevated standard of living in Yendada.',
    fullDescription: 'The Collective represents the pinnacle of modern luxury. Located in the serene environment of Yendada, it features bespoke design elements, premium fittings, and an array of lifestyle amenities.',
    gallery: [
      'assets/images/projects/collective-1.jpg',
      'assets/images/projects/collective-2.jpg',
      'assets/images/projects/collective-3.jpg'
    ],
    amenities: ['Private Elevator Access', 'Concierge Service', 'Spa & Wellness Center', 'Rooftop Lounge', 'Smart Home Features'],
    mainImage: 'assets/images/projects/collective-main.jpg'
  },
  {
    id: 'chalamaji-the-address',
    name: 'Chalamaji The Address',
    location: 'Visakhapatnam',
    type: 'Bespoke Residences',
    status: 'Completed',
    category: 'apartments',
    description: 'A prestigious completed residential address in Visakhapatnam, known for its elegant elevation and luxury finishes.',
    fullDescription: 'Chalamaji The Address was conceived to offer discerning families an iconic residence. Featuring spacious 3 BHK and 4 BHK layouts, uncompromised structural quality, and peaceful coastal surroundings.',
    gallery: [
      'assets/images/projects/signature-1.jpg',
      'assets/images/projects/landmark-2.jpg'
    ],
    amenities: ['Landscaped Atrium', 'Residents Lounge', 'Automated Security', 'Covered Parking', 'Solar Water Heating'],
    mainImage: 'assets/images/projects/collective-main.jpg'
  }
];
