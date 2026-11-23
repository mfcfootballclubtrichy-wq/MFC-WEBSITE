/**
 * ChatbotWidget.jsx — Floating AI Assistant & Botpress Integration.
 * Positioned fixed at the bottom-right of the screen on all pages.
 * Integrates directly with official Botpress WebChat v5, with instant in-app fallback.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_PROMPTS = [
  'What is MFC?',
  'Academy Admissions & Trials',
  'Training Timetable',
  'Coaches & Certification',
  'Ground Location & Contact',
];

const KNOWLEDGE_BASE = {
  about: "Mutharasanallur Football Club (MFC) is Trichy's premier grassroots football academy. We develop young athletes from ages 6 to 19 through AIFF-certified coaching, modern training methodologies, and district/state tournament participation.",
  admissions: "Admissions and trial sessions are open year-round for all age groups (U10, U14, U17, and Senior Squad). You can register directly via the 'Register' button on our website or call +91 8072694818.",
  timing: "Training Timings at Mutharasanallur Ground:\n• Grassroots / U10: Mon–Fri, 6:00 AM – 7:30 AM\n• Youth (U14 & U17): Mon–Sat, 4:30 PM – 6:30 PM\n• Tactical Matchday Sessions: Sunday, 7:00 AM – 10:00 AM",
  coaches: "MFC coaches hold official AIFF credentials, including Head Coach P. Santhosh (AIFF D-License), Coach R. Rajesh (Youth Specialist), and fitness trainers dedicated to technical drills and physical conditioning.",
  contact: "MFC Football Ground, Mutharasanallur, Trichy - 620101, Tamil Nadu.\n📞 Phone / WhatsApp: +91 8072694818\n✉️ Email: mfcfootballacademy@gmail.com",
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Vanakkam! Welcome to Mutharasanallur Football Club (MFC). How can I assist you with academy admissions, training schedules, or club information today?',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isBotpressReady, setIsBotpressReady] = useState(false);
  const messagesEndRef = useRef(null);

  // Check for official Botpress WebChat availability
  useEffect(() => {
    const checkBotpress = () => {
      if (typeof window !== 'undefined' && window.botpress) {
        setIsBotpressReady(true);
      }
    };

    checkBotpress();
    const interval = setInterval(checkBotpress, 1500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleOpenBot = () => {
    // If official Botpress WebChat is ready and active, trigger it
    if (window.botpress && typeof window.botpress.open === 'function') {
      try {
        window.botpress.open();
        return;
      } catch (err) {
        console.warn('Botpress open call notice:', err);
      }
    }
    // Otherwise open the native in-app assistant
    setIsOpen((prev) => !prev);
  };

  const getBotReply = (query) => {
    const q = query.toLowerCase();
    if (q.includes('what is') || q.includes('about') || q.includes('who') || q.includes('mfc')) {
      return KNOWLEDGE_BASE.about;
    }
    if (q.includes('admission') || q.includes('join') || q.includes('trial') || q.includes('fee') || q.includes('register')) {
      return KNOWLEDGE_BASE.admissions;
    }
    if (q.includes('time') || q.includes('timing') || q.includes('schedule') || q.includes('practice') || q.includes('when')) {
      return KNOWLEDGE_BASE.timing;
    }
    if (q.includes('coach') || q.includes('trainer') || q.includes('staff') || q.includes('santhosh')) {
      return KNOWLEDGE_BASE.coaches;
    }
    if (q.includes('contact') || q.includes('phone') || q.includes('where') || q.includes('location') || q.includes('ground') || q.includes('address')) {
      return KNOWLEDGE_BASE.contact;
    }
    return `Thank you for your question! For specific enquiries regarding "${query}", please call Coach Helpline at +91 8072694818 or submit your query on our Contact page.`;
  };

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate quick intelligent AI response
    setTimeout(() => {
      const botResponse = getBotReply(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 450);
  };

  return (
    <>
      {/* Floating Chatbot Launcher Button (Right Bottom) */}
      <div
        id="mfc-chatbot-launcher"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99998,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
        }}
      >
        {/* Floating Bubble Pill for first-time visitors */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            onClick={handleOpenBot}
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            <span>Chat with MFC AI</span>
          </motion.div>
        )}

        {/* Primary Circular Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleOpenBot}
          aria-label="Open MFC Club Chatbot"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--accent)',
            color: '#FFFFFF',
            border: '2px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 10px 28px rgba(210, 4, 45, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            outline: 'none',
            position: 'relative',
          }}
        >
          {isOpen ? (
            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>✕</span>
          ) : (
            <img
              src="/mfc-logo.png"
              alt="MFC Crest"
              style={{
                width: '38px',
                height: '38px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            />
          )}

          {/* Online status indicator dot */}
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid var(--accent)',
              boxShadow: '0 0 6px rgba(210, 4, 45, 0.5)',
            }}
          />
        </motion.button>
      </div>

      {/* Floating In-App Interactive Chat Dialog Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.92 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              bottom: '96px',
              right: '24px',
              width: 'min(380px, calc(100vw - 32px))',
              height: 'min(540px, calc(100vh - 120px))',
              background: 'var(--surface)',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.25)',
              zIndex: 99998,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                background: '#0A0A0A',
                borderBottom: '2px solid var(--accent)',
                color: '#FFFFFF',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src="/mfc-logo.png"
                  alt="MFC Logo"
                  style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                    MFC Football Club
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', opacity: 0.9 }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)' }} />
                    <span>AI Assistant Online</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                ✕
              </button>
            </div>

            {/* Quick Chips Bar */}
            <div
              style={{
                padding: '8px 12px',
                background: 'var(--surface-2)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    flexShrink: 0,
                    fontWeight: 500,
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div
              style={{
                flex: 1,
                padding: '14px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: 'var(--bg)',
              }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      background: m.sender === 'user' ? 'var(--accent-dark)' : 'var(--surface)',
                      color: m.sender === 'user' ? '#FFFFFF' : 'var(--text)',
                      fontSize: '0.86rem',
                      lineHeight: 1.5,
                      boxShadow: 'var(--shadow-sm)',
                      border: m.sender === 'user' ? 'none' : '1px solid var(--border)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {m.text}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '2px', paddingInline: '4px' }}>
                    {m.time}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{
                padding: '10px 12px',
                background: 'var(--surface)',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about MFC programs, trials..."
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: '999px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  flexShrink: 0,
                }}
              >
                ➔
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
