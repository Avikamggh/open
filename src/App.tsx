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
  // Parallax effects
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030014] text-white overflow-x-hidden">
      {/* Animated Background */}
      <StarBackground />

      {/* Navigation */}
      <Navbar onStartChat={() => setShowChat(true)} />

      {/* Hero Section with 3D Phone */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-32 pb-20 overflow-hidden">
        {/* God Ray / Hero Glow */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-blue-600/10 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-slow" />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center gap-16">

          {/* Text Content (Centered) */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30 mb-8 hover:scale-105 transition-transform cursor-default">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
                <span className="text-sm font-medium text-cyan-100 tracking-wide uppercase">System Online v2.0</span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tight">
                <span className="block text-white">Cut the noise.</span>
                <span className="gradient-text">Chase the signal.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
                OpenStars - the fastest way to fundraise in 2026! Helping 10,000 founders raise from 15,000+ investors helping grow economy by 20 trillion USD.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <button
                  onClick={() => document.getElementById('phone-demo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary w-full sm:w-auto group min-w-[200px]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Matching
                    <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </span>
                </button>
                <button className="px-8 py-3.5 rounded-full font-semibold text-white border border-white/10 hover:bg-white/5 transition-all w-full sm:w-auto min-w-[200px]">
                  View Documentation
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Phone Demo (Centered Below) */}
          <motion.div
            id="phone-demo"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-full flex justify-center relative perspective-2000"
          >
            {/* Background Glow for Phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-20 transform hover:scale-[1.01] transition-transform duration-700">
              <PhoneChat onComplete={() => setShowChat(false)} />
            </div>
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
