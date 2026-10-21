/**
 * App.jsx — Root component.
 * Sets up routes, page transition, and global layout (Header + Footer).
 * Route change: red wipe animation (~500 ms).
 */
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ChatbotWidget from './components/ChatbotWidget.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ContentProvider } from './context/ContentContext.jsx';

// Pages
import Home                   from './pages/Home.jsx';
import Squad                  from './pages/Squad.jsx';
import About                  from './pages/About.jsx';
import Vision                 from './pages/Vision.jsx';
import Coaches                from './pages/Coaches.jsx';
import TeamAchievements       from './pages/TeamAchievements.jsx';
import IndividualAchievements from './pages/IndividualAchievements.jsx';
import PlayerProfile          from './pages/PlayerProfile.jsx';
import NewsDetail             from './pages/NewsDetail.jsx';
import SchoolProgram          from './pages/SchoolProgram.jsx';
import Contact                from './pages/Contact.jsx';
import NotFound               from './pages/NotFound.jsx';
import PrivacyPolicy          from './pages/PrivacyPolicy.jsx';
import TermsOfUse             from './pages/TermsOfUse.jsx';
import Login                  from './pages/admin/Login.jsx';
import Dashboard              from './pages/admin/Dashboard.jsx';

// RedWipe overlay: slides left → right on exit, right → left on enter.
const pageVariants = {
  initial:  { scaleX: 0, originX: 0 },
  animate:  { scaleX: 0, originX: 1 },
  exit:     { scaleX: 1, originX: 0 },
};

const PAGE_TRANSITION_DURATION = 0.25; // seconds (500 ms total)

function RedWipe() {
  return (
    <motion.div
      className="page-transition-overlay"
      initial="exit"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: PAGE_TRANSITION_DURATION, ease: 'easeInOut' }}
      aria-hidden="true"
    />
  );
}

/** Updates <html lang> attribute and document title on route change */
function RouteMetaUpdater() {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language, location]);

  return null;
}


export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <ContentProvider>
        <ScrollToTop />
        <ScrollProgress />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <RouteMetaUpdater />
        <Header />

        <main id="main-content">
          {/* RedWipe sits above routes; key changes on route */}
          <RedWipe key={`wipe-${location.pathname}`} />

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/"                         element={<Home />} />
              <Route path="/squad"                    element={<Squad />} />
              <Route path="/about"                    element={<About />} />
              <Route path="/vision"                   element={<Vision />} />
              <Route path="/coaches"                  element={<Coaches />} />
              <Route path="/team-achievements"        element={<TeamAchievements />} />
              <Route path="/individual-achievements"  element={<IndividualAchievements />} />
              <Route path="/player-profile/:id"       element={<PlayerProfile />} />
              <Route path="/news/:id"                 element={<NewsDetail />} />
              <Route path="/school-program"           element={<SchoolProgram />} />
              <Route path="/contact"                  element={<Contact />} />
              <Route path="/privacy-policy"           element={<PrivacyPolicy />} />
              <Route path="/terms"                    element={<TermsOfUse />} />
              <Route path="/login"                    element={<Login defaultMode="login" />} />
              <Route path="/register"                 element={<Login defaultMode="register" />} />
              <Route path="/admin/login"              element={<Login defaultMode="login" />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin', 'coach', 'editor', 'content_editor', 'volunteer', 'member']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal"
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin', 'coach', 'editor', 'content_editor', 'volunteer', 'member']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*"                         element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <ChatbotWidget />
      </ContentProvider>
    </AuthProvider>
  );
}
