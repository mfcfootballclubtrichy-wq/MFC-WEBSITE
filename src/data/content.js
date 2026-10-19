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
  address: 'Tamilan Nagar, Mutharasanallur, Trichy-1', // [CONFIRM]
  phone: '8072694818', // [CONFIRM]
  email: 'mfcfootballacademy@gmail.com',
  instagram: 'https://www.instagram.com/mfc_trichy',
  instagramHandle: '@mfc_trichy',
  mapQuery: 'Mutharasanallur+Trichy+Tamil+Nadu',
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
    photo: null,
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
    hasConsent: true,
  },
  {
    id: 'pragadeesh-srm',
    player: 'Pragadeesh D',
    highlight: 'Represented SRM University in the South Zone Inter-University tournament (2023)',
    category: 'University',
    hasConsent: true,
  },
  {
    id: 'pragadeesh-viva',
    player: 'Pragadeesh D',
    highlight: 'Champions, Chennai Senior Division League (2022), with Viva Chennai',
    category: 'Senior League',
    hasConsent: true,
  },
  {
    id: 'rajesh-hindustan',
    player: 'Rajesh S',
    highlight: 'Sports-quota selection, Hindustan University (100% scholarship, MBA Sports Management)',
    category: 'Scholarship',
    hasConsent: true,
  },
  {
    id: 'gnanam-presidency',
    player: 'Gnanam A',
    highlight: 'Sports-quota selection, Presidency College, Chennai (100% scholarship, MSW)',
    category: 'Scholarship',
    hasConsent: true,
  },
  {
    id: 'ajith-bishop-heber',
    player: 'Ajith K',
    highlight: 'Sports-quota selection, Bishop Heber College, Trichy (100% scholarship, MBA)',
    category: 'Scholarship',
    hasConsent: true,
  },
  {
    id: 'bala-arun-jeppiaar',
    player: 'Bala Subramaiyan and Arun Kumar',
    highlight: 'Sports-quota selection, Jeppiaar University (100% scholarship, MBA)',
    category: 'Scholarship',
    hasConsent: true,
  },
  {
    id: 'santhosh-vinayaga',
    player: 'Santhosh',
    highlight: 'Sports-quota selection, Vinayaga University, Salem (70% scholarship, B.P.Ed)',
    category: 'Scholarship',
    hasConsent: true,
  },
  {
    id: 'sukesan-harish',
    player: 'Sukesan and Harish',
    highlight: 'Sukesan: sports-quota selection, Megna College, Chennai (100% scholarship, BBA). Harish: represented Pondicherry state team at the Junior Nationals',
    category: 'Scholarship & State',
    hasConsent: true,
  },
];

/** Age groups */
export const AGE_GROUPS = [
  { id: 'super-seniors', label: 'Super Seniors', years: '2009 – 2011' },
  { id: 'seniors',       label: 'Seniors',       years: '2012 – 2014' },
  { id: 'juniors',       label: 'Juniors',       years: '2015 – 2017' },
  { id: 'kids',          label: 'Kids & Young Lions', years: '2018 – 2021' },
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
  description:
    'Technical, tactical, and physical development through progressive modules.',
  highlights: [
    'Training at school premises',
    'Periodic assessments and match exposure',
    'Inter-school and academy tournaments',
    'Pathways to Tamil Nadu and Karnataka state leagues',
  ],
  schoolBenefits: [
    'Sports reputation',
    'Talent identification',
    'Student health',
    'Discipline and teamwork',
    'Recognition through AIFF and academy events',
  ],
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
  { id: 'about',                   path: '/about',                  labelKey: 'nav.about' },
  { id: 'vision',                  path: '/vision',                 labelKey: 'nav.vision' },
  { id: 'coaches',                 path: '/coaches',                labelKey: 'nav.coaches' },
  { id: 'team-achievements',       path: '/team-achievements',      labelKey: 'nav.teamAchievements' },
  { id: 'individual-achievements', path: '/individual-achievements',labelKey: 'nav.individualAchievements' },
  { id: 'contact',                 path: '/contact',                labelKey: 'nav.contact' },
];
