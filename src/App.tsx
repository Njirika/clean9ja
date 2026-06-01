import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Booking } from './pages/Booking';
import { CleanerPortal } from './pages/CleanerPortal';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { Careers } from './pages/Careers';
import { Pricing } from './pages/Pricing';
import { FAQPage } from './pages/FAQ';
import { Legal } from './pages/Legal';
import { ServiceDetail } from './pages/ServiceDetail';
import { Safety } from './pages/Safety';
import { UserProvider, useUser } from './context/UserContext';
import { Onboarding } from './components/auth/Onboarding';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminPanel } from './pages/AdminPanel';
import { Auth } from './pages/Auth';
import { LiveChat } from './components/ui/LiveChat';
import { initSentry } from './lib/integrations';

function AppContent() {
  const { isOnboarded } = useUser();
  const location = useLocation();

  useEffect(() => {
    initSentry();
  }, []);

  const isDashboardRoute = ['/dashboard', '/admin', '/cleaner'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence mode="wait">
        {!isOnboarded && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Onboarding />
          </motion.div>
        )}
      </AnimatePresence>

      {!isDashboardRoute && <Header />}
      <motion.div 
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/cleaner" element={<CleanerPortal />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/help" element={<FAQPage />} />
          <Route path="/privacy" element={<Legal title="Privacy Policy" />} />
          <Route path="/terms" element={<Legal title="Terms of Service" />} />
          <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/contact" element={<Home />} />
          <Route path="/gallery" element={<Home />} />
        </Routes>
      </motion.div>
      {!isDashboardRoute && <Footer />}
      
      {!isDashboardRoute && <LiveChat />}
      
      {!isDashboardRoute && (
        <a 
          href="https://wa.me/2348000000000" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-8 right-4 sm:right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
          title="Chat with us on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.5 8.5 0 0 1 8.5 7.9M12 8l4 4-4 4"></path>
          </svg>
        </a>
      )}
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}
