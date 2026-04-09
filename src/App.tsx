/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Menu,
  X,
  ArrowUpRight
} from "lucide-react";
import { useState, useEffect, useRef, ReactNode } from "react";

// --- Constants ---

// Images removed as per user request

// --- Animation Variants ---

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

// --- Components ---

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#0F0F0F] flex flex-col items-center justify-center text-archive-white"
    >
      <div className="text-center">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-serif italic tracking-[0.5em] mb-8 opacity-40 uppercase"
        >
          L'archivio è un organismo vivente
        </motion.p>
        <div className="text-6xl md:text-8xl font-serif italic tabular-nums tracking-tighter">
          {Math.min(progress, 100)}%
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] py-12 px-12 flex items-center justify-between pointer-events-none">
      <div className="text-[10px] font-serif tracking-[1em] text-archive-white uppercase opacity-40">
        ASHI
      </div>
      <div className="hidden md:flex items-center gap-16 pointer-events-auto">
        {["System", "Archive", "Metrics"].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`} 
            className="text-[8px] font-medium uppercase tracking-[0.6em] text-archive-white/20 hover:text-archive-white transition-all duration-1000"
          >
            {item}
          </a>
        ))}
        <a 
          href="mailto:ashypyi@gmail.com" 
          className="text-[8px] font-medium uppercase tracking-[0.6em] text-archive-white/20 hover:text-archive-white transition-all duration-1000"
        >
          Contact
        </a>
      </div>
    </nav>
  );
};

const Section = ({ children, className = "", id = "", bg = "bg-[#0F0F0F]" }: { children: ReactNode, className?: string, id?: string, bg?: string }) => (
  <section id={id} className={`py-32 md:py-64 px-8 ${bg} ${className}`}>
    <div className="container mx-auto max-w-7xl">
      {children}
    </div>
  </section>
);

// ImageBreak removed as per user request

// --- Sections ---

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0F0F0F] overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 5, ease: [0.215, 0.61, 0.355, 1] }}
        className="text-center"
      >
        <h1 className="text-[12px] md:text-[14px] font-serif tracking-[3em] text-archive-white uppercase font-bold">
          ASHI
        </h1>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 0.2, scaleY: 1 }}
        transition={{ delay: 3, duration: 3 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-archive-white origin-top"
      />
    </section>
  );
};

const ArchiveSpread = ({ title, subtitle, description, id = "", color = "from-[#0F0F0F] to-[#1A1A1A]", textColor = "text-archive-white", accentColor = "bg-archive-white/10" }: any) => {
  return (
    <section id={id} className={`relative min-h-screen flex items-center justify-center overflow-hidden border-b border-archive-white/5 bg-gradient-to-br ${color} ${textColor}`}>
      {/* Atmospheric Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] flex items-center justify-center pointer-events-none"
        >
          <span className="text-[50vw] font-serif italic leading-none select-none blur-sm">
            {subtitle.split(' / ')[0]}
          </span>
        </motion.div>
        
        {/* Technical Accents */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-full h-[1px] bg-current absolute top-1/4" />
          <div className="w-full h-[1px] bg-current absolute bottom-1/4" />
          <div className="h-full w-[1px] bg-current absolute left-1/4" />
          <div className="h-full w-[1px] bg-current absolute right-1/4" />
        </div>
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.215, 0.61, 0.355, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-6 mb-12">
              <span className={`w-12 h-[1px] ${accentColor}`} />
              <span className="text-[10px] font-sans tracking-[1em] uppercase font-bold opacity-50">{subtitle}</span>
            </div>
            <h2 className="text-6xl md:text-[120px] font-serif italic leading-[0.8] mb-12 tracking-tighter font-light">
              {title}
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
            className="text-right hidden md:block"
          >
            <span className="text-[120px] font-serif italic opacity-5 leading-none">{subtitle.split(' / ')[0]}</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
          className="max-w-2xl ml-auto md:mr-24"
        >
          <p className="text-2xl md:text-3xl font-serif leading-relaxed italic opacity-80 border-l border-current pl-12 py-4">
            {description}
          </p>
          <div className="mt-16 flex items-center gap-8">
            <span className="text-[9px] font-sans tracking-[0.5em] uppercase opacity-30">Infrastructure Archive v2.6</span>
            <div className={`flex-grow h-[1px] ${accentColor}`} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Metrics = () => (
  <Section id="metrics" className="relative overflow-hidden bg-[#0F0F0F]">
    <div className="text-center mb-48">
      <span className="text-[10px] font-sans tracking-[0.4em] text-archive-white/30 uppercase block mb-10">03 / The Yield</span>
      <h2 className="text-6xl md:text-[140px] font-serif italic tracking-tighter text-archive-white leading-none">
        Pure <span className="not-italic opacity-10">Results.</span>
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-24 relative z-10">
      {[
        { val: "30%", label: "Reactivation Rate" },
        { val: "4.2x", label: "Average ROI" },
        { val: "12h", label: "Weekly Time Saved" },
        { val: "∞", label: "Scalability" }
      ].map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center border border-archive-white/5 py-16 px-8 hover:bg-archive-white/[0.02] transition-colors duration-700"
        >
          <div className="text-7xl font-serif italic text-archive-white mb-6">{item.val}</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-archive-white/30">{item.label}</div>
        </motion.div>
      ))}
    </div>
  </Section>
);

const FinalCTA = () => (
  <Section className="text-center bg-[#0F0F0F] border-t border-archive-white/5">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 2.5 }}
    >
      <h2 className="text-5xl md:text-[120px] font-serif leading-[0.9] text-archive-white tracking-tighter italic mb-24">
        Join the <br />
        <span className="not-italic opacity-10">Archive.</span>
      </h2>
      <button className="group relative inline-flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.6em] text-archive-white py-8 px-16 border border-archive-white/10 hover:bg-archive-white hover:text-archive-black transition-all duration-1000">
        Request Access
        <ArrowRight size={16} className="group-hover:translate-x-4 transition-transform" />
      </button>
    </motion.div>
  </Section>
);

const Footer = () => (
  <footer className="py-32 border-t border-archive-white/5 bg-[#0F0F0F] text-archive-white">
    <div className="container mx-auto px-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-24 mb-32">
        <div className="max-w-md">
          <div className="flex items-center gap-6 mb-10">
            <span className="text-3xl font-serif tracking-[0.2em] uppercase">ASHI</span>
          </div>
          <p className="text-lg font-serif italic text-archive-white/40 leading-relaxed">
            L'archivio è un organismo vivente. <br />
            A minimalist revenue infrastructure for modern healthcare practices.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-32">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-archive-white/20 mb-10">Navigation</h4>
            <ul className="space-y-6 text-[10px] font-medium uppercase tracking-[0.3em] text-archive-white/40">
              <li><a href="#" className="hover:text-archive-white transition-colors">System</a></li>
              <li><a href="#" className="hover:text-archive-white transition-colors">Archive</a></li>
              <li><a href="#" className="hover:text-archive-white transition-colors">Metrics</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-archive-white/20 mb-10">Contact</h4>
            <ul className="space-y-6 text-[10px] font-medium uppercase tracking-[0.3em] text-archive-white/40">
              <li><a href="mailto:ashypyi@gmail.com" className="hover:text-archive-white transition-colors lowercase">ashypyi@gmail.com</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-16 border-t border-archive-white/5 text-[10px] font-bold uppercase tracking-[0.4em] text-archive-white/10">
        <p>© 2026 ASHI ARCHIVE. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-16">
          <a href="#" className="hover:text-archive-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-archive-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-archive-white font-sans selection:bg-archive-white selection:text-archive-black">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <Navbar />
          <Hero />
          
          <ArchiveSpread 
            id="system"
            subtitle="01 / The Organism"
            title={<>Growth is <br /> algorithmic.</>}
            description="A living organism of revenue recovery. Minimalist architecture for the modern clinic."
            color="from-[#451a03] to-[#78350f]" // Warm Ochre Gradient
            textColor="text-archive-white"
            accentColor="bg-white/20"
          />

          <ArchiveSpread 
            subtitle="02 / The Architecture"
            title={<>Precision in <br /> every detail.</>}
            description="We build the infrastructure that keeps your practice full, your patients returning, and your revenue growing."
            color="from-[#064e3b] to-[#065f46]" // Emerald Deep Gradient
            textColor="text-archive-white"
            accentColor="bg-white/20"
          />

          <ArchiveSpread 
            subtitle="03 / The Foundation"
            title={<>Scale without <br /> friction.</>}
            description="Autonomous systems designed for the modern healthcare landscape. No marketing. Just infrastructure."
            color="from-[#450a0a] to-[#7f1d1d]" // Burgundy Deep Gradient
            textColor="text-archive-white"
            accentColor="bg-white/20"
          />

          <ArchiveSpread 
            subtitle="04 / The Yield"
            title={<>Revenue as <br /> a byproduct.</>}
            description="When the system is correct, growth is inevitable. We don't chase patients; we build the gravity that pulls them in."
            color="from-[#172554] to-[#1e3a8a]" // Midnight Blue Gradient
            textColor="text-archive-white"
            accentColor="bg-white/20"
          />
          
          <Metrics />
          <FinalCTA />
          <Footer />
          
          {/* Smooth Scroll Progress */}
          <motion.div 
            className="fixed top-0 left-0 right-0 h-[1px] bg-archive-white z-[100] origin-left"
            style={{ scaleX }}
          />
        </motion.div>
      )}
    </div>
  );
}
