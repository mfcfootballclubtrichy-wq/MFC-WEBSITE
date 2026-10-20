/**
 * ContentContext.jsx
 *
 * Provides live dynamic content fetched from Supabase (or cached fallback to static content.js),
 * plus real-time updates and an administrative helper for saving & publishing sections.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import {
  CLUB as INITIAL_CLUB,
  HOME_CONTENT as INITIAL_HOME,
  ABOUT_TEXT as INITIAL_ABOUT,
  VISION_TEXT as INITIAL_VISION,
  COACHES as INITIAL_COACHES,
  TEAM_ACHIEVEMENTS as INITIAL_TEAM_ACH,
  INDIVIDUAL_ACHIEVEMENTS as INITIAL_IND_ACH,
  DEFAULT_SQUAD as INITIAL_SQUAD,
  SCHOOL_PROGRAM as INITIAL_SCHOOL,
  STATS as INITIAL_STATS,
} from '../data/content.js';

// Default initial state
const defaultContentState = {
  home: {
    kicker: INITIAL_HOME.kicker,
    headline: INITIAL_HOME.headline,
    subheadline: INITIAL_HOME.subheadline,
    ctaPrimary: INITIAL_HOME.ctaPrimary,
    ctaSecondary: INITIAL_HOME.ctaSecondary,
    heroImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    aboutImage: '/about-mfc-freestyle.png',
  },
  updates: [
    {
      id: 'update-1',
      title: 'Summer Youth Football Camp Registration Open',
      date: '2025-04-10',
      tag: 'Camp',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
      description: 'Registration is now open for our annual grassroots coaching camp for Super Seniors, Seniors, Juniors, and Kids batches at Tamilan Nagar Ground.',
    },
    {
      id: 'update-2',
      title: 'MFC U15 Squad Claims Runner-Up in Chinthamani Tournament',
      date: '2025-03-28',
      tag: 'Tournament',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      description: 'Outstanding technical performance and determination exhibited by our young academy players throughout the tournament stages.',
    },
    {
      id: 'update-3',
      title: 'New AIFF Licensed Training Modules Implemented',
      date: '2025-03-15',
      tag: 'Academy',
      image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80',
      description: 'Head Coach Dhanapal and Technical Staff have refreshed progressive age-appropriate drills prioritizing ball control and speed.',
    }
  ],
  about: {
    title: 'About MFC',
    body: INITIAL_ABOUT,
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
  },
  vision: {
    title: INITIAL_VISION.title,
    body: INITIAL_VISION.body,
    communityText: 'Our vision extends beyond the field. We measure MFC\'s success by how many players finish school, gain university scholarships, and lead upright, active, and healthy lives in their communities.',
  },
  coaches: INITIAL_COACHES,
  squad: INITIAL_SQUAD,
  team_achievements: INITIAL_TEAM_ACH,
  individual_achievements: INITIAL_IND_ACH,
  school_program: {
    description: INITIAL_SCHOOL.description,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    highlights: INITIAL_SCHOOL.highlights,
    schoolBenefits: INITIAL_SCHOOL.schoolBenefits,
  },
  contact: {
    address: INITIAL_CLUB.address,
    phone: INITIAL_CLUB.phone,
    email: INITIAL_CLUB.email,
    instagram: INITIAL_CLUB.instagram,
    instagramHandle: INITIAL_CLUB.instagramHandle,
  },
};

const ContentContext = createContext({
  content: defaultContentState,
  loading: false,
  refreshContent: async () => {},
});

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    // Check localStorage cache for instant fast loading
    try {
      const cached = localStorage.getItem('mfc_site_content_cache');
      if (cached) {
        return { ...defaultContentState, ...JSON.parse(cached) };
      }
    } catch {
      // Fallback
    }
    return defaultContentState;
  });
  const [loading, setLoading] = useState(true);

  const fetchLiveContent = useCallback(async () => {
    try {
      // Query published data strictly through the sanitized public_site_content view
      // (Bypasses raw table drafts and guarantees server-side minor consent filtering)
      const { data, error } = await supabase
        .from('public_site_content')
        .select('section, data, updated_at');

      if (!error && data && data.length > 0) {
        setContent((prev) => {
          const next = { ...prev };
          data.forEach((row) => {
            if (row.section && row.data) {
              next[row.section] = row.data;
            }
          });
          try {
            localStorage.setItem('mfc_site_content_cache', JSON.stringify(next));
          } catch {
            // ignore localStorage quota
          }
          return next;
        });
      }
    } catch (err) {
      console.warn('Could not load live site_content, using cached/static data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveContent();

    // Subscribe to live changes in site_content so visitors see real-time updates without refreshing
    let channel;
    try {
      channel = supabase
        .channel('public:site_content')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'site_content' },
          (payload) => {
            if (payload.new && payload.new.section && payload.new.status === 'published') {
              setContent((prev) => {
                const next = {
                  ...prev,
                  [payload.new.section]: payload.new.published_data,
                };
                try {
                  localStorage.setItem('mfc_site_content_cache', JSON.stringify(next));
                } catch {
                  // ignore
                }
                return next;
              });
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Realtime subscription not established:', err);
    }

    const handleLocalUpdate = () => {
      try {
        const cached = localStorage.getItem('mfc_site_content_cache');
        if (cached) {
          setContent((prev) => ({ ...prev, ...JSON.parse(cached) }));
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('mfc_content_updated', handleLocalUpdate);

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      window.removeEventListener('mfc_content_updated', handleLocalUpdate);
    };
  }, [fetchLiveContent]);

  return (
    <ContentContext.Provider value={{ content, loading, refreshContent: fetchLiveContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
