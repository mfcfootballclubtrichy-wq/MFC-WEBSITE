/**
 * content.js — Single source of truth for all club data.
 * All default text matches the master deck specification.
 * Items marked [CONFIRM] must be verified with the club before going live.
 */

export const CLUB = {
  name: 'Mutharasanallur Football Club',
  shortName: 'MFC',
  tagline: '#OneClubOneDream',
  founded: 2020,
  address: 'Tamilan Nagar, Mutharasanallur, Trichy-1',
  phone: '8072694818',
  email: 'mfcfootballclubtrichy@gmail.com',
  instagram: 'https://www.instagram.com/mfc_trichy/',
  instagramHandle: '@mfc_trichy',
  mapQuery: 'Mutharasanallur+Trichy+Tamil+Nadu',
  mapsUrl: 'https://www.google.com/maps?ftid=0x3baa5f1fbab6b02f:0x640fe554b7a67e15',
  mapsEmbedUrl: 'https://maps.google.com/maps?q=Mutharasanallur%2C%20Trichy%2C%20Tamil%20Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed',
  footerNote: '© MFC Football Club, Mutharasanallur, Trichy. Established 2020.',
};

export const HOME_CONTENT = {
  kicker: 'Mutharasanallur, Trichy',
  headline: 'Mutharasanallur Football Club',
  subheadline: 'Founded 2020. Creating young football talent from our village and across Trichy.',
  ctaPrimary: 'Explore Achievements',
  ctaSecondary: 'Meet the Coaches',
};

export const ABOUT_TEXT =
  'Mutharasanallur Football Club, known as MFC, was founded in 2020 to create young football talent from our village side and across Trichy. We give players a platform to develop their skills while building teamwork, discipline, and sportsmanship.';

export const VISION_TEXT = {
  title: 'Our Vision',
  body: 'To create young football talent from our village and Trichy, with a platform to thrive and strong values of teamwork, discipline, and sportsmanship.', // [CONFIRM]
};

export const ACHIEVEMENTS_INTRO = {
  title: 'Achievements',
  body: 'Over the years, MFC has built a reputation for excellence in local competition. Our greatest pride is the positive impact on our community: inspiring young athletes to chase their dreams and live an active, healthy life.',
};

/**
 * Coaches list from deck.
 * Roles and licences marked [CONFIRM] where unspecified.
 */
export const COACHES = [
  {
    id: 'dhanapal',
    name: 'Dhanapal',
    role: 'Head Coach',
    licence: ['AIFF C Licence', 'AIFF D Licence'],
    photo: '/coaches/sample-coach.png',
    bio: 'Guiding player development and structured technical football training across youth squads.',
  },
  {
    id: 'rajesh',
    name: 'Rajesh',
    role: 'Coach', // [CONFIRM]
    licence: ['AIFF Licenced'],
    photo: null,
    bio: 'Dedicated youth coach focusing on fitness, tactical awareness, and match temperament.',
  },
  {
    id: 'pragadeesh',
    name: 'Pragadeesh',
    role: 'Player-Coach / Technical Trainer', // [CONFIRM - dual role]
    licence: ['AIFF Licenced'],
    photo: null,
    bio: 'Represented Tamil Nadu in the Santosh Trophy; active player mentoring the next generation.',
  },
];

/**
 * Team tournament podiums and honors (2021 to 2023).
 * Listed as runner-up and 3rd place finishes.
 */
export const TEAM_ACHIEVEMENTS = [
  {
    id: 'ta-1',
    season: '2021–2023',
    place: 'Runner-up',
    tournament: 'Chinthamani U15 5s Football Tournament',
    location: 'Trichy',
  },
  {
    id: 'ta-2',
    season: '2021–2023',
    place: 'Runner-up',
    tournament: 'Kajamalai FC U16 5s Football Tournament',
    location: 'Trichy',
  },
  {
    id: 'ta-3',
    season: '2021–2023',
    place: 'Runner-up',
    tournament: 'MFC U13 7s Football Tournament',
    location: 'Trichy',
  },
  {
    id: 'ta-4',
    season: '2021–2023',
    place: 'Runner-up',
    tournament: 'SAI FC 7s Football Tournament',
    location: 'Karur',
  },
  {
    id: 'ta-5',
    season: '2021–2023',
    place: '3rd Place',
    tournament: 'Green Grass Turf U13 5s Football Tournament',
    location: 'Trichy',
  },
  {
    id: 'ta-6',
    season: '2021–2023',
    place: '3rd Place',
    tournament: 'Arena 20 U13 5s Football Tournament',
    location: 'Trichy',
  },
  {
    id: 'ta-7',
    season: '2021–2023',
    place: '3rd Place',
    tournament: 'Decathlon Cup U13 5s Football Tournament',
    location: 'Trichy',
  },
  {
    id: 'ta-8',
    season: '2021–2023',
    place: '3rd Place',
    tournament: 'Shaz FC Cup U13 5s Football Tournament',
    location: 'Trichy',
  },
  {
    id: 'ta-9',
    season: '2021–2023',
    place: '3rd Place',
    tournament: 'MFC U17 7s Football Tournament',
    location: 'Trichy',
  },
];

/**
 * Individual achievements and scholarships from deck.
 * Privacy consent flag: in compliance with youth privacy standards, only records
 * with hasConsent: true will be published on the live public site.
 */
export const INDIVIDUAL_ACHIEVEMENTS = [
  {
    id: 'pragadeesh-santosh',
    player: 'Pragadeesh D',
    highlight: 'Represented Tamil Nadu state team at the Santosh Trophy (2023)',
    category: 'State Representation',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'pragadeesh-srm',
    player: 'Pragadeesh D',
    highlight: 'Represented SRM University in the South Zone Inter-University tournament (2023)',
    category: 'University',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'pragadeesh-viva',
    player: 'Pragadeesh D',
    highlight: 'Champions, Chennai Senior Division League (2022), with Viva Chennai',
    category: 'Senior League',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'rajesh-hindustan',
    player: 'Rajesh S',
    highlight: 'Sports-quota selection, Hindustan University (100% scholarship, MBA Sports Management)',
    category: 'Scholarship',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'gnanam-presidency',
    player: 'Gnanam A',
    highlight: 'Sports-quota selection, Presidency College, Chennai (100% scholarship, MSW)',
    category: 'Scholarship',
    image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'ajith-bishop-heber',
    player: 'Ajith K',
    highlight: 'Sports-quota selection, Bishop Heber College, Trichy (100% scholarship, MBA)',
    category: 'Scholarship',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'bala-arun-jeppiaar',
    player: 'Bala Subramaiyan and Arun Kumar',
    highlight: 'Sports-quota selection, Jeppiaar University (100% scholarship, MBA)',
    category: 'Scholarship',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'santhosh-vinayaga',
    player: 'Santhosh',
    highlight: 'Sports-quota selection, Vinayaga University, Salem (70% scholarship, B.P.Ed)',
    category: 'Scholarship',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sukesan-harish',
    player: 'Sukesan and Harish',
    highlight: 'Sukesan: sports-quota selection, Megna College, Chennai (100% scholarship, BBA). Harish: represented Pondicherry state team at the Junior Nationals',
    category: 'Scholarship & State',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
];

/** Age groups */
export const AGE_GROUPS = [
  { id: 'super_seniors', label: 'Super Seniors', years: '2009 – 2011' },
  { id: 'seniors',       label: 'Seniors',       years: '2012 – 2014' },
  { id: 'juniors',       label: 'Juniors',       years: '2015 – 2017' },
  { id: 'staff',         label: 'Coaches & Staff', years: 'Technical & Medical' },
];

/**
 * Squad Players & Staff (Real Madrid style roster)
 * Categorized by tier (super_seniors, seniors, juniors, staff)
 * and position (Goalkeeper, Defender, Midfielder, Forward, Staff roles).
 */
export const DEFAULT_SQUAD = [
  // ── GOALKEEPERS ──
  {
    id: 'sq-1',
    name: 'Mestre',
    number: '1',
    position: 'Goalkeeper',
    tier: 'super_seniors',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-2',
    name: 'D. Arroyo',
    number: '12',
    position: 'Goalkeeper',
    tier: 'super_seniors',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-3',
    name: 'Javi Navarro',
    number: '13',
    position: 'Goalkeeper',
    tier: 'seniors',
    image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-4',
    name: 'F. Quetglas',
    number: '25',
    position: 'Goalkeeper',
    tier: 'juniors',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },

  // ── DEFENDERS ──
  {
    id: 'sq-5',
    name: 'Fortea',
    number: '2',
    position: 'Defender',
    tier: 'super_seniors',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-6',
    name: 'Diego Aguado',
    number: '3',
    position: 'Defender',
    tier: 'super_seniors',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-7',
    name: 'Mario Rivas',
    number: '4',
    position: 'Defender',
    tier: 'seniors',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-8',
    name: 'Joan',
    number: '5',
    position: 'Defender',
    tier: 'seniors',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-9',
    name: 'K. Rajesh',
    number: '22',
    position: 'Defender',
    tier: 'juniors',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },

  // ── MIDFIELDERS ──
  {
    id: 'sq-10',
    name: 'Pragadeesh D',
    number: '6',
    position: 'Midfielder',
    tier: 'super_seniors',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-11',
    name: 'K. Vignesh',
    number: '8',
    position: 'Midfielder',
    tier: 'super_seniors',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-12',
    name: 'A. Gnanam',
    number: '10',
    position: 'Midfielder',
    tier: 'seniors',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-13',
    name: 'M. Naveen',
    number: '14',
    position: 'Midfielder',
    tier: 'juniors',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },

  // ── FORWARDS ──
  {
    id: 'sq-14',
    name: 'R. Ajith',
    number: '7',
    position: 'Forward',
    tier: 'super_seniors',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-15',
    name: 'S. Santhosh',
    number: '9',
    position: 'Forward',
    tier: 'super_seniors',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-16',
    name: 'S. Harish',
    number: '11',
    position: 'Forward',
    tier: 'seniors',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-17',
    name: 'B. Sukesan',
    number: '17',
    position: 'Forward',
    tier: 'juniors',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },

  // ── TECHNICAL, COACHING & MEDICAL STAFF ──
  {
    id: 'sq-18',
    name: 'Dhanapal',
    number: '',
    position: 'Head Coach',
    tier: 'staff',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-19',
    name: 'Dr. R. Karthik',
    number: '',
    position: 'Lead Physiotherapist',
    tier: 'staff',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-20',
    name: 'Balaji',
    number: '',
    position: 'Assistant Coach',
    tier: 'staff',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
  {
    id: 'sq-21',
    name: 'S. Manivannan',
    number: '',
    position: 'Fitness & Conditioning Coach',
    tier: 'staff',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    hasConsent: true,
  },
];

/** Why partner with MFC */
export const PARTNERSHIP_POINTS = [
  'Certified AIFF "C" and "D" licence coaches',
  'Safe, professional, and age-appropriate training',
  'Customised programs for different age categories',
  'Focus on fitness, discipline, and holistic development',
  'Experience organising school football programs and tournaments',
];

/** School program highlights */
export const SCHOOL_PROGRAM = {
  heroEyebrow: 'Grassroots Development',
  title: 'MFC School Football Partnership Program',
  subtitle: 'Structured progressive coaching and athletic development designed specifically for educational institutions.',
  description:
    'Technical, tactical, and physical development through progressive modules.',
  highlightsTitle: 'Comprehensive Coaching for Educational Institutions',
  highlights: [
    'Training at school premises',
    'Periodic assessments and match exposure',
    'Inter-school and academy tournaments',
    'Pathways to Tamil Nadu and Karnataka state leagues',
  ],
  benefitsTitle: 'Institutional Benefits & Advantages',
  schoolBenefits: [
    'Sports reputation',
    'Talent identification',
    'Student health',
    'Discipline and teamwork',
    'Recognition through AIFF and academy events',
  ],
  ctaTitle: 'Partner Your School with MFC',
  ctaBody: 'Empower your students with professional football coaching, physical discipline, and competitive tournament exposure.',
  image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  maxHeight: 440,
  scale: 1,
  offsetY: 0,
};

/** Stats shown on home page */
export const STATS = [
  { id: 'founded',      value: 2020, suffix: '',  labelKey: 'stats.founded' },
  { id: 'players',      value: 100,  suffix: '+', labelKey: 'stats.players' },
  { id: 'podiums',      value: 9,    suffix: '',  labelKey: 'stats.podiums' },
  { id: 'scholarships', value: 8,    suffix: '+', labelKey: 'stats.scholarships' },
];

/** Navigation menu items */
export const NAV_ITEMS = [
  { id: 'home',                    path: '/',                       labelKey: 'nav.home' },
  { id: 'squad',                   path: '/squad',                  labelKey: 'nav.squad' },
  { id: 'about',                   path: '/about',                  labelKey: 'nav.about' },
  { id: 'vision',                  path: '/vision',                 labelKey: 'nav.vision' },
  { id: 'coaches',                 path: '/coaches',                labelKey: 'nav.coaches' },
  { id: 'school-program',          path: '/school-program',         labelKey: 'nav.schoolProgram' },
  { id: 'team-achievements',       path: '/team-achievements',      labelKey: 'nav.teamAchievements' },
  { id: 'individual-achievements', path: '/individual-achievements',labelKey: 'nav.individualAchievements' },
  { id: 'contact',                 path: '/contact',                labelKey: 'nav.contact' },
];
