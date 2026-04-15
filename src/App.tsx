/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Menu,
  X,
  ArrowUpRight,
  Flame,
  Calendar
} from "lucide-react";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  User,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { db, auth, googleProvider, signInWithPopup, handleFirestoreError, OperationType } from './firebase';

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

const FieryButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.15, rotate: [-2, 2, -2] }}
      whileTap={{ scale: 0.95 }}
      className="relative group mx-auto block"
    >
      {/* Extreme Atmospheric Glow */}
      <div className="absolute -inset-16 bg-orange-600/20 rounded-full blur-[100px] group-hover:bg-orange-600/40 transition-colors duration-700" />
      <div className="absolute -inset-12 bg-red-600/20 rounded-full blur-[80px] group-hover:bg-red-600/40 transition-colors duration-700 delay-100" />
      
      {/* Intense Outer Glow Layers */}
      <div className="absolute -inset-8 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-500 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
      <div className="absolute -inset-4 bg-gradient-to-t from-red-600 via-orange-500 to-transparent rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
      
      {/* The Button */}
      <div className="relative bg-black border-2 border-orange-500/50 px-16 py-8 rounded-full overflow-hidden shadow-[0_0_60px_rgba(234,88,12,0.4)]">
        {/* Lava Pulse Effect */}
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-t from-orange-900/60 via-red-900/20 to-transparent"
        />

        {/* Dynamic Fire Particles - Increased count and variety */}
        {[...Array(12)].map((_, i) => (
          <motion.div 
            key={i}
            animate={{ 
              y: [0, -150 - Math.random() * 100],
              x: [0, (Math.random() - 0.5) * 60],
              opacity: [0, 1, 0],
              scale: [0.5, 2.5, 0.5],
              rotate: [0, Math.random() * 360]
            }}
            transition={{ 
              duration: 1 + Math.random() * 1.5, 
              repeat: Infinity, 
              delay: Math.random() * 2,
              ease: "easeOut" 
            }}
            className={`absolute bottom-0 blur-lg rounded-full ${
              i % 4 === 0 ? 'bg-orange-500 w-6 h-6' : 
              i % 4 === 1 ? 'bg-red-600 w-4 h-4' : 
              i % 4 === 2 ? 'bg-yellow-400 w-3 h-3' :
              'bg-white w-2 h-2' // Sparks
            }`}
            style={{ left: `${10 + Math.random() * 80}%` }}
          />
        ))}

        {/* Heat Haze Distortion (Simulated) */}
        <motion.div 
          animate={{ 
            skewX: [-1, 1, -1],
            skewY: [-0.5, 0.5, -0.5]
          }}
          transition={{ duration: 0.1, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none opacity-20 bg-white/5"
        />
        
        <div className="relative z-10 flex items-center gap-6">
          <span className="text-white font-black italic uppercase tracking-[0.5em] text-xl drop-shadow-[0_2px_15px_rgba(0,0,0,1)]">
            IGNITE GROWTH
          </span>
          <motion.div
            animate={{ 
              scale: [1, 1.4, 1],
              filter: ["brightness(1) drop-shadow(0 0 0px orange)", "brightness(1.8) drop-shadow(0 0 15px orange)", "brightness(1) drop-shadow(0 0 0px orange)"]
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <Flame className="text-orange-500 group-hover:text-red-500 transition-colors duration-300" size={36} fill="currentColor" />
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
};

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

const Navbar = ({ user, onLogin, onLogout }: { user: User | null, onLogin: () => void, onLogout: () => void }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] py-12 px-12 flex items-center justify-between pointer-events-none">
      <div className="text-[10px] font-serif tracking-[1em] text-archive-white uppercase opacity-40">
        ASHI
      </div>
      <div className="hidden md:flex items-center gap-16 pointer-events-auto">
        {["System", "Case-Study", "Audit", "Booking"].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`} 
            className="text-[8px] font-medium uppercase tracking-[0.6em] text-archive-white/20 hover:text-archive-white transition-all duration-1000"
          >
            {item.replace('-', ' ')}
          </a>
        ))}
        {!user ? (
          <button 
            onClick={onLogin}
            className="text-[8px] font-medium uppercase tracking-[0.6em] text-orange-500/50 hover:text-orange-500 transition-all duration-1000"
          >
            Login
          </button>
        ) : (
          <button 
            onClick={onLogout}
            className="text-[8px] font-medium uppercase tracking-[0.6em] text-archive-white/20 hover:text-archive-white transition-all duration-1000"
          >
            Logout
          </button>
        )}
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

const TrustBar = () => {
  return (
    <div className="bg-archive-white/5 border-y border-archive-white/5 py-12">
      <div className="container mx-auto px-8">
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">H</div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">B</div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">BAA Available</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">S</div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Secure Hosting</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">L</div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Legal & SLAs</span>
          </div>
        </div>
      </div>
    </div>
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

const Booking = () => {
  const handleBook = () => {
    if ((window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: "https://calendly.com/anmolaujla2702/new-meeting-1"
      });
    }
  };

  return (
    <Section id="booking" className="bg-[#0F0F0F] border-t border-archive-white/5 flex flex-col items-center">
      <div className="text-center mb-32">
        <span className="text-[10px] font-sans tracking-[0.4em] text-archive-white/30 uppercase block mb-10">04 / The Connection</span>
        <h2 className="text-5xl md:text-[100px] font-serif italic tracking-tighter text-archive-white leading-none">
          Secure your <span className="not-italic opacity-10">Slot.</span>
        </h2>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
        className="py-12"
      >
        <FieryButton onClick={handleBook} />
      </motion.div>
    </Section>
  );
};

const CaseStudy = () => {
  return (
    <Section id="case-study" className="bg-[#0F0F0F] border-t border-archive-white/5 py-32">
      <div className="container mx-auto px-8">
        <div className="max-w-6xl mx-auto">
          {/* 1. Hero Section (Hook) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="mb-32 text-center"
          >
            <span className="text-[10px] font-sans tracking-[0.4em] text-orange-500 uppercase block mb-10">Case Study / 01</span>
            <h2 className="text-5xl md:text-8xl font-serif italic tracking-tighter text-archive-white leading-tight mb-12 max-w-4xl mx-auto">
              How We Increased Patient Retention by <span className="text-orange-500">38%</span> for a Local Clinic
            </h2>
            <p className="text-xl md:text-2xl text-archive-white/40 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
              Turning existing patients into consistent monthly revenue—without spending more on ads.
            </p>
            <motion.a 
              href="#booking"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-archive-white text-archive-black px-12 py-6 rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-orange-500 hover:text-white transition-all duration-500"
            >
              Book a Free Strategy Call
            </motion.a>
          </motion.div>

          {/* 2. Snapshot (Quick Proof Block) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-48">
            {[
              { label: "Patient Retention", value: "+38%", icon: "📈" },
              { label: "Repeat Visits", value: "+52%", icon: "🔁" },
              { label: "Revenue Growth", value: "+31%", icon: "💰" },
              { label: "Staff Workload", value: "-40%", icon: "⚡" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="bg-archive-white/5 border border-archive-white/10 p-10 rounded-3xl text-center group hover:border-orange-500/50 transition-colors"
              >
                <div className="text-4xl mb-6">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-serif italic text-archive-white mb-2">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-archive-white/30">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* 3. The Problem & 4. The Strategy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-48">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            >
              <h3 className="text-3xl font-serif italic text-archive-white mb-12">The Challenge</h3>
              <p className="text-lg text-archive-white/60 mb-12 leading-relaxed">
                The clinic was generating a steady flow of new patients—but most of them never returned. Revenue was inconsistent and heavily dependent on new patient acquisition.
              </p>
              <ul className="space-y-6">
                {[
                  "No structured follow-ups",
                  "Missed rebooking opportunities",
                  "Zero reactivation of old patients",
                  "Staff overwhelmed with manual tasks"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-6 text-archive-white/40 font-medium">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            >
              <h3 className="text-3xl font-serif italic text-archive-white mb-12">What We Implemented</h3>
              <div className="grid grid-cols-1 gap-8">
                {[
                  { title: "Automated Follow-Ups", desc: "WhatsApp & SMS reminders for post-treatment care and missed appointments." },
                  { title: "Patient Segmentation", desc: "Categorized patients into New, Active, Inactive, and High-value for personalized comms." },
                  { title: "Reactivation Campaigns", desc: "Re-engaged old patients with limited-time offers and easy booking links." },
                  { title: "Smart Booking System", desc: "Simplified scheduling with one-click booking to reduce friction." }
                ].map((item, i) => (
                  <div key={i} className="bg-archive-white/5 p-8 rounded-2xl border-l-2 border-orange-500">
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-archive-white mb-2">{item.title}</h4>
                    <p className="text-sm text-archive-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 5. The Results */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="bg-archive-white text-archive-black p-16 md:p-24 rounded-[40px] mb-48"
          >
            <h3 className="text-4xl font-serif italic mb-16 text-center">The Outcome (Within 90 Days)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30">Before</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-black/10 pb-4">
                    <span className="font-medium">Retention</span>
                    <span className="text-3xl font-serif italic">27%</span>
                  </div>
                  <p className="text-sm opacity-60 italic">Manual follow-ups & lost patients</p>
                </div>
              </div>
              <div className="space-y-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-600">After</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-orange-500 pb-4">
                    <span className="font-bold">Retention</span>
                    <span className="text-5xl font-serif italic text-orange-600">65%</span>
                  </div>
                  <p className="text-sm font-bold text-orange-600 italic">Fully automated system & consistent repeat visits</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 6. Key Insight & 7. Testimonial */}
          <div className="text-center mb-48">
            <h3 className="text-3xl font-serif italic text-archive-white mb-8">What Most Clinics Miss</h3>
            <p className="text-xl text-archive-white/60 max-w-3xl mx-auto leading-relaxed mb-16">
              Most clinics focus only on getting new patients. But the real growth comes from <span className="text-archive-white font-bold underline decoration-orange-500 underline-offset-8">retaining and reactivating existing ones</span>. We simply built a system that makes that happen automatically.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="text-5xl text-orange-500 mb-8">“</div>
              <blockquote className="text-2xl md:text-3xl font-serif italic text-archive-white leading-relaxed mb-8">
                We didn’t realize how many patients we were losing. Now they come back automatically—and our schedule stays full.
              </blockquote>
              <cite className="text-[10px] font-bold uppercase tracking-[0.4em] text-archive-white/30">— Clinic Director</cite>
            </div>
          </div>

          {/* 8. CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-orange-600 to-red-700 p-16 md:p-32 rounded-[60px] text-center text-white"
          >
            <h3 className="text-4xl md:text-7xl font-serif italic tracking-tighter mb-8">Want Similar Results for Your Clinic?</h3>
            <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto mb-16 font-medium">
              We’ll analyze your current system and show you exactly where you’re losing patients—and how to fix it.
            </p>
            <motion.a 
              href="#audit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-archive-black px-16 py-8 rounded-full text-sm font-bold uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all duration-500"
            >
              Book Your Free Audit
            </motion.a>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

const RevenueAudit = () => {
  const [formData, setFormData] = useState({
    practiceName: '',
    location: '',
    numProviders: '',
    avgTicket: '',
    activePatients: '1500',
    ltv: '1200',
    attritionRate: '30',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activePatients = parseFloat(formData.activePatients) || 0;
  const ltv = parseFloat(formData.ltv) || 0;
  const attritionRate = parseFloat(formData.attritionRate) || 0;
  const recoverableLoss = activePatients * (attritionRate / 100) * ltv;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const auditData = {
        ...formData,
        numProviders: parseFloat(formData.numProviders) || 0,
        avgTicket: parseFloat(formData.avgTicket) || 0,
        activePatients: activePatients,
        ltv: ltv,
        attritionRate: attritionRate,
        recoverableLoss: recoverableLoss,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'revenueAudits'), auditData);
      setIsSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'revenueAudits');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="audit" className="bg-[#0F0F0F] border-t border-archive-white/5">
      <div className="container mx-auto px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            {/* Left Side: Copy & Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            >
              <span className="text-[10px] font-sans tracking-[0.4em] text-archive-white/30 uppercase block mb-10">05 / The Audit</span>
              <h2 className="text-5xl md:text-7xl font-serif italic tracking-tighter text-archive-white leading-tight mb-12">
                Find the <span className="text-orange-500">${recoverableLoss.toLocaleString()}</span> <br />
                you're losing in 30 seconds.
              </h2>
              <p className="text-xl font-serif italic text-archive-white/60 mb-16 leading-relaxed">
                Most clinics leak 30% of their revenue through attrition. <br />
                Our infrastructure plugs the holes.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans tracking-[0.2em] uppercase text-archive-white/40">Practice Name</label>
                    <input 
                      required
                      name="practiceName"
                      value={formData.practiceName}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-archive-white/10 py-4 text-archive-white focus:border-orange-500 transition-colors outline-none font-serif italic text-lg" 
                      placeholder="The Clinic Archive"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans tracking-[0.2em] uppercase text-archive-white/40">Location</label>
                    <input 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-archive-white/10 py-4 text-archive-white focus:border-orange-500 transition-colors outline-none font-serif italic text-lg" 
                      placeholder="Milan, IT"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans tracking-[0.2em] uppercase text-archive-white/40"># Providers</label>
                    <input 
                      type="number"
                      name="numProviders"
                      value={formData.numProviders}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-archive-white/10 py-4 text-archive-white focus:border-orange-500 transition-colors outline-none font-serif italic text-lg" 
                      placeholder="4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans tracking-[0.2em] uppercase text-archive-white/40">Avg Ticket ($)</label>
                    <input 
                      type="number"
                      name="avgTicket"
                      value={formData.avgTicket}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-archive-white/10 py-4 text-archive-white focus:border-orange-500 transition-colors outline-none font-serif italic text-lg" 
                      placeholder="450"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-8">
                  <label className="text-[10px] font-sans tracking-[0.2em] uppercase text-archive-white/40">Email for Detailed Audit</label>
                  <input 
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-archive-white/10 py-4 text-archive-white focus:border-orange-500 transition-colors outline-none font-serif italic text-lg" 
                    placeholder="director@clinic.com"
                  />
                </div>

                <button 
                  disabled={isSubmitting || isSubmitted}
                  className="group relative inline-flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.6em] text-archive-white py-8 px-16 border border-archive-white/10 hover:bg-orange-600 hover:border-orange-600 transition-all duration-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : isSubmitted ? 'Audit Sent' : 'Get Detailed Audit'}
                  <ArrowRight size={16} className="group-hover:translate-x-4 transition-transform" />
                </button>
              </form>
            </motion.div>

            {/* Right Side: Calculator Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-archive-white/[0.02] border border-archive-white/5 p-12 rounded-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-16 border-b border-archive-white/5 pb-8">
                  <span className="text-[10px] font-mono tracking-widest text-archive-white/20 uppercase">Revenue Leakage Calculator v1.0</span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500/40 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-archive-white/10" />
                  </div>
                </div>

                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[11px] font-serif italic text-archive-white/40">Active Patients (A)</span>
                      <span className="text-2xl font-mono text-archive-white">{activePatients.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      name="activePatients"
                      min="100" 
                      max="10000" 
                      step="100"
                      value={formData.activePatients}
                      onChange={handleInputChange}
                      className="w-full accent-orange-500 opacity-50 hover:opacity-100 transition-opacity"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[11px] font-serif italic text-archive-white/40">Annual Attrition (Attr %)</span>
                      <span className="text-2xl font-mono text-archive-white">{attritionRate}%</span>
                    </div>
                    <input 
                      type="range" 
                      name="attritionRate"
                      min="5" 
                      max="60" 
                      step="1"
                      value={formData.attritionRate}
                      onChange={handleInputChange}
                      className="w-full accent-orange-500 opacity-50 hover:opacity-100 transition-opacity"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[11px] font-serif italic text-archive-white/40">Lifetime Value (LTV)</span>
                      <span className="text-2xl font-mono text-archive-white">${ltv.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      name="ltv"
                      min="100" 
                      max="5000" 
                      step="50"
                      value={formData.ltv}
                      onChange={handleInputChange}
                      className="w-full accent-orange-500 opacity-50 hover:opacity-100 transition-opacity"
                    />
                  </div>

                  <div className="pt-12 border-t border-archive-white/5 mt-12">
                    <span className="text-[10px] font-mono tracking-widest text-archive-white/20 uppercase block mb-4">Estimated Annual Recoverable Loss</span>
                    <div className="text-6xl md:text-8xl font-serif italic text-orange-500 tracking-tighter">
                      ${recoverableLoss.toLocaleString()}
                    </div>
                    <div className="mt-8 flex items-center gap-4 text-[9px] font-mono text-archive-white/20 uppercase tracking-widest">
                      <span>Formula: A * Attr% * LTV</span>
                      <div className="h-[1px] flex-grow bg-archive-white/5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Accents */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-orange-500/20 pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-orange-500/20 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
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

const AdminDashboard = () => {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'revenueAudits'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const auditData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAudits(auditData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'revenueAudits');
    });

    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="py-24 text-center font-mono text-[10px] uppercase tracking-widest opacity-20">
      Loading Archive Data...
    </div>
  );

  return (
    <Section id="admin" className="bg-[#0F0F0F] border-t border-archive-white/10">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between mb-24">
          <div>
            <span className="text-[10px] font-sans tracking-[0.4em] text-orange-500 uppercase block mb-4">Admin Access</span>
            <h2 className="text-4xl md:text-6xl font-serif italic tracking-tighter text-archive-white">Captured Leads.</h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono tracking-widest text-archive-white/20 uppercase block">Total Entries</span>
            <span className="text-4xl font-mono text-archive-white">{audits.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {audits.map((audit) => (
            <div key={audit.id} className="group bg-archive-white/[0.02] border border-archive-white/5 p-8 hover:border-orange-500/30 transition-all duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-archive-white/20 uppercase tracking-widest">Practice</span>
                  <p className="font-serif italic text-lg text-archive-white">{audit.practiceName}</p>
                  <p className="text-[10px] font-sans text-archive-white/40 uppercase tracking-wider">{audit.location || 'No Location'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-archive-white/20 uppercase tracking-widest">Contact</span>
                  <p className="font-serif italic text-lg text-archive-white">{audit.email}</p>
                  <p className="text-[10px] font-sans text-archive-white/40 uppercase tracking-wider">
                    {audit.createdAt?.toDate ? new Date(audit.createdAt.toDate()).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-archive-white/20 uppercase tracking-widest">Metrics</span>
                  <p className="text-[11px] font-sans text-archive-white/60 uppercase tracking-wider">
                    {audit.numProviders} Providers • ${audit.avgTicket} Ticket
                  </p>
                  <p className="text-[11px] font-sans text-archive-white/60 uppercase tracking-wider">
                    {audit.activePatients} Patients • {audit.attritionRate}% Attrition
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-archive-white/20 uppercase tracking-widest block mb-1">Recoverable Loss</span>
                  <span className="text-3xl font-serif italic text-orange-500">${audit.recoverableLoss?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const Footer = ({ user, onLogin, onLogout, onPrivacyClick }: { user: User | null, onLogin: () => void, onLogout: () => void, onPrivacyClick: () => void }) => (
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
          
          <div className="mt-12">
            {!user ? (
              <button 
                onClick={onLogin}
                className="text-[9px] font-bold uppercase tracking-[0.4em] text-archive-white/20 hover:text-orange-500 transition-colors"
              >
                Admin Login
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-orange-500">
                  Logged in as {user.email}
                </span>
                <button 
                  onClick={onLogout}
                  className="text-[9px] font-bold uppercase tracking-[0.4em] text-archive-white/20 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-32">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-archive-white/20 mb-10">Navigation</h4>
            <ul className="space-y-6 text-[10px] font-medium uppercase tracking-[0.3em] text-archive-white/40">
              <li><a href="#system" className="hover:text-archive-white transition-colors">System</a></li>
              <li><a href="#case-study" className="hover:text-archive-white transition-colors">Case Study</a></li>
              <li><a href="#audit" className="hover:text-archive-white transition-colors">Revenue Audit</a></li>
              <li><a href="#booking" className="hover:text-archive-white transition-colors">Booking</a></li>
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
          <button onClick={onPrivacyClick} className="hover:text-archive-white transition-colors">Privacy Policy</button>
          <a href="#" className="hover:text-archive-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

const PrivacyModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-[#0F0F0F] border border-archive-white/10 w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-[40px] p-12 md:p-24 shadow-2xl custom-scrollbar"
      >
        <button onClick={onClose} className="absolute top-12 right-12 text-archive-white/40 hover:text-white transition-colors">
          <X size={32} />
        </button>
        <div className="text-archive-white/60 font-sans text-sm leading-relaxed space-y-8">
          <h1 className="text-4xl font-serif italic text-archive-white mb-12">Privacy Policy</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Last updated April 12, 2026</p>
          
          <section className="space-y-4">
            <p>This Privacy Notice for ASHI ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you visit our website at <a href="https://ashi-os.vercel.app/" className="text-orange-500">https://ashi-os.vercel.app/</a> or engage with us in other related ways.</p>
            <p><strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:ashypyi@gmail.com" className="text-orange-500">ashypyi@gmail.com</a>.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">1. WHAT INFORMATION DO WE COLLECT?</h2>
            <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
            <p>The personal information we collect may include: names, email addresses, phone numbers, business/company name, and usage data / IP address.</p>
            <p><strong>Social Media Login Data:</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
            <p>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</p>
            <ul className="list-disc pl-8 space-y-2">
              <li>To provide our services: communicate with them with the data and provide services</li>
              <li>To respond to inquiries</li>
              <li>To fulfill contractual obligations</li>
              <li>To improve our services</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
            <p>We may share information in specific situations described in this section and/or with the following third parties: Business Transfers (merger, sale of company assets, financing, or acquisition).</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
            <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h2>
            <p>If you choose to register or log in to our Services using a social media account, we may have access to certain information about you (name, email, profile picture, etc.). We recommend that you review their privacy notice to understand how they collect, use, and share your personal information.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">6. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
            <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law.</p>
            <p>For client business data (contacts, emails): as long as the business relationship is active, plus 12 months after contract termination. For patient data processed on behalf of clients: only for the duration of the service contract. All patient data is deleted or returned within 30 days of contract termination, per our BAA obligations.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">7. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
            <p>We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">8. DO WE COLLECT INFORMATION FROM MINORS?</h2>
            <p>We do not knowingly collect, solicit data from, or market to children under 18 years of age. By using the Services, you represent that you are at least 18.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">9. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
            <p>You may review, change, or terminate your account at any time, depending on your country, province, or state of residence. You have the right to withdraw your consent at any time.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">10. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
            <p>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature. We do not currently respond to DNT browser signals.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
            <p>If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have specific rights regarding access, correction, and deletion of your personal data.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">12. CLIENT PATIENT DATABASES</h2>
            <p className="bg-orange-500/10 border-l-2 border-orange-500 p-8 text-archive-white italic">
              This data is processed solely on behalf of our healthcare provider clients under a signed Business Associate Agreement (BAA) in accordance with HIPAA regulations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">13. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
            <p>Yes, we will update this notice as necessary to stay compliant with relevant laws. The updated version will be indicated by an updated "Revised" date.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">14. HOW CAN YOU CONTACT US?</h2>
            <p>If you have questions or comments about this notice, you may email us at <a href="mailto:ashypyi@gmail.com" className="text-orange-500">ashypyi@gmail.com</a> or contact us by post at:</p>
            <p className="opacity-60">
              ASHI <br />
              kothe akalgarh bhikhiroad dhanaula <br />
              barnala, Punjab 148105 <br />
              India
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-archive-white pt-8">15. HOW CAN YOU REVIEW, UPDATE, OR DELETE YOUR DATA?</h2>
            <p>Based on the applicable laws of your country or state of residence, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information.</p>
          </section>
          
          <div className="pt-16 opacity-20 text-[10px] uppercase tracking-widest">
            PracticeOS Infrastructure Archive v2.6
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FloatingCTA = () => {
  const handleBook = () => {
    if ((window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: "https://calendly.com/anmolaujla2702/new-meeting-1"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2, duration: 1, ease: "circOut" }}
      className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-[150]"
    >
      <motion.button
        onClick={handleBook}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center gap-4 md:gap-6 bg-orange-500 text-white px-8 py-4 md:px-10 md:py-6 rounded-full shadow-[0_20px_50px_rgba(249,115,22,0.3)] hover:shadow-[0_20px_60px_rgba(249,115,22,0.5)] transition-all duration-500 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        <Calendar className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em]">Book Strategy Call</span>
      </motion.button>
    </motion.div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    // Load Calendly Script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    // Load Calendly CSS
    const link = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Handle redirect result
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect login failed:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (document.body.contains(script)) document.body.removeChild(script);
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  const handleLogin = async () => {
    try {
      console.log("Initiating Google Sign-In...");
      // Try popup first
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login failed detail:", error);
      
      // If popup is blocked or closed, or if we are on a mobile device, try redirect
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || isMobile) {
        console.log("Switching to Redirect login...");
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          alert(`Login failed: ${redirectError.message}`);
        }
      } else if (error.code === 'auth/unauthorized-domain') {
        alert("This domain (ashi-os.vercel.app) is not authorized in Firebase. Please add it to 'Authorized Domains' in your Firebase Console > Authentication > Settings.");
      } else {
        alert(`Login failed: ${error.message}`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isAdmin = user?.email === 'anmolaujla2702@gmail.com';

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

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
          <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
          <Hero />
          <RevenueAudit />
          
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

          {/* PracticeOS Narratives Section */}
          <Section id="narratives" className="bg-[#0F0F0F] border-t border-archive-white/5">
            <div className="max-w-4xl mx-auto text-center mb-32">
              <span className="text-[10px] font-sans tracking-[0.4em] text-orange-500 uppercase block mb-10">The Evolution</span>
              <h2 className="text-4xl md:text-7xl font-serif italic tracking-tighter text-archive-white leading-tight mb-12">
                PracticeOS — Your patient revenue, running on autopilot.
              </h2>
              <p className="text-xl text-archive-white/40 font-medium leading-relaxed">
                We are your embedded revenue team, not another agency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {[
                { title: "Infrastructure not campaigns", desc: "We build systems that convert and retain — we measure dollars recovered, not impressions." },
                { title: "Embedded team", desc: "White‑labeled under your brand — no extra staff required." },
                { title: "Data-first outcomes", desc: "30‑day audit and a Month‑1 playbook with measurable KPIs." },
                { title: "Compliance and security", desc: "HIPAA-compliant; BAA available." }
              ].map((pillar, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-12 bg-archive-white/5 rounded-[40px] border border-archive-white/10 hover:border-orange-500/30 transition-colors group"
                >
                  <h3 className="text-2xl font-serif italic mb-6 text-archive-white group-hover:text-orange-500 transition-colors">{pillar.title}</h3>
                  <p className="text-archive-white/40 leading-relaxed">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>

          <TrustBar />
          
          <CaseStudy />
          <Metrics />
          
          {isAdmin && <AdminDashboard />}

          <FinalCTA />
          <Booking />
          <Footer user={user} onLogin={handleLogin} onLogout={handleLogout} onPrivacyClick={() => setIsPrivacyOpen(true)} />
          
          <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
          <FloatingCTA />

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
