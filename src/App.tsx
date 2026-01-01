import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Lenis from 'lenis';
import StarBackground from './components/StarBackground';
import PhoneChat from './components/PhoneChat';
import Navbar from './components/Navbar';
import Features from './components/Features';
import CommunitySection from './components/CommunitySection';
import Footer from './components/Footer';

function App() {
  const [showChat, setShowChat] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll();

  // Parallax effects
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const phoneY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030014] text-white overflow-x-hidden">
      {/* Animated Background */}
      <StarBackground />

      {/* Navigation */}
      <Navbar onStartChat={() => setShowChat(true)} />

      {/* Hero Section with 3D Phone */}
      <section className="relative min-h-[200vh]">
        {/* Sticky Hero Container */}
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 flex flex-col items-center justify-center z-10">
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center mb-8 px-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-gradient mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                <span className="text-sm font-medium text-gray-300">Star is online</span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="block">Meet</span>
                <span className="gradient-text text-shadow-glow">Star ✦</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
                Your <span className="text-white font-semibold">AI Superconnector</span> to investors, VCs, and growth
              </p>
            </motion.div>
          </motion.div>

          {/* 3D Phone */}
          <motion.div
            style={{ scale: phoneScale, y: phoneY }}
            className="relative z-20"
          >
            <PhoneChat onComplete={() => setShowChat(false)} />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-gray-500 font-mono tracking-widest">SCROLL</span>
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Community Section */}
      <CommunitySection />

      {/* Footer */}
      <Footer />

      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-2xl shadow-violet-600/40 flex items-center justify-center z-50 hover:scale-110 transition-transform glow-md"
      >
        <span className="text-2xl">✦</span>
      </motion.button>

      {/* Full Screen Chat Overlay */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
            onClick={() => setShowChat(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <PhoneChat onComplete={() => setShowChat(false)} isOverlay />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
