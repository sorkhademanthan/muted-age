import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const BrandStory = () => {
  const navigate = useNavigate();
  const [showHero, setShowHero] = useState(false);
  const { scrollYProgress } = useScroll();

  // Parallax values
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const originY = useTransform(scrollYProgress, [0.1, 0.3], [0, -50]);

  useEffect(() => {
    // Initial black screen, then fade to white
    const timer = setTimeout(() => setShowHero(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Staggered text reveal component
  const StaggeredText = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ 
          duration: 1.2, 
          delay, 
          ease: [0.22, 1, 0.36, 1] 
        }}
      >
        {children}
      </motion.div>
    );
  };

  // Line-by-line reveal for manifesto
  const ManifestoLine = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
      <motion.p
        ref={ref}
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ 
          duration: 0.9, 
          delay, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight mb-6"
      >
        {children}
      </motion.p>
    );
  };

  // Principle Card with hover
  const PrincipleCard = ({ title, description, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ 
          scale: 1.02, 
          y: -4,
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }}
        className="bg-white/60 backdrop-blur-sm p-12 border border-gray-200/50 group cursor-default"
        style={{ borderRadius: '2px' }}
      >
        <h3 
          className="text-xs tracking-[0.3em] font-light mb-6 text-gray-900"
          style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
        >
          {title}
        </h3>
        <p 
          className="text-base font-light leading-relaxed text-gray-700 group-hover:text-gray-900 transition-colors duration-700"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {description}
        </p>
      </motion.div>
    );
  };

  return (
    <div className="bg-[#FFFEF9] min-h-screen">
      {/* Initial black screen fade */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showHero ? 0 : 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="fixed inset-0 bg-black z-50 pointer-events-none"
      />

      <Header />

      {/* 1. HERO SECTION - Cinematic Entry */}
      <motion.section 
        style={{ opacity: heroOpacity }}
        className="relative min-h-screen flex flex-col items-center justify-center px-8 overflow-hidden"
      >
        {/* Subtle grain texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.0, delay: 0.5, ease: 'easeOut' }}
          className="text-center max-w-5xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8"
            style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
          >
            LOUD IS CHEAP.
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-16"
            style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
          >
            SILENCE IS EXPENSIVE.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 2.4, ease: 'easeOut' }}
            className="text-xl md:text-2xl font-light tracking-wide text-gray-700"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Welcome to the Muted Age.
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 3.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-16 bg-gradient-to-b from-transparent via-gray-400 to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* 2. ORIGIN STORY SECTION */}
      <motion.section 
        style={{ y: originY }}
        className="relative py-32 md:py-48 px-8 md:px-16"
      >
        {/* Parallax background texture */}
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0.15, 0.35], [0, -80])
          }}
          className="absolute inset-0 opacity-[0.03]"
        >
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <StaggeredText delay={0}>
            <p 
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-12 text-gray-800"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              The world became loud. Clothing became advertising.
            </p>
          </StaggeredText>

          <StaggeredText delay={0.3}>
            <p 
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-12 text-gray-800"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              People started performing instead of existing.
            </p>
          </StaggeredText>

          <div className="h-24" />

          <StaggeredText delay={0.6}>
            <p 
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-12 text-gray-800"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              We noticed something different — something rare.
            </p>
          </StaggeredText>

          <StaggeredText delay={0.9}>
            <p 
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-12 text-gray-800"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Power was silent.
            </p>
          </StaggeredText>

          <div className="h-24" />

          <StaggeredText delay={1.2}>
            <p 
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-gray-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              We created a brand for the ones who don't chase attention.
            </p>
          </StaggeredText>

          <StaggeredText delay={1.5}>
            <p 
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-gray-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              They attract it — without trying.
            </p>
          </StaggeredText>
        </div>
      </motion.section>

      {/* 3. MANIFESTO SECTION */}
      <section className="py-32 md:py-48 px-8 md:px-16 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto">
          <ManifestoLine delay={0}>
            Muted Age Aesthetic.
          </ManifestoLine>

          <div className="h-16" />

          <ManifestoLine delay={0.2}>Raw.</ManifestoLine>
          <ManifestoLine delay={0.4}>Clean.</ManifestoLine>
          <ManifestoLine delay={0.6}>Unapologetic.</ManifestoLine>

          <div className="h-24" />

          <ManifestoLine delay={0.8}>Boxy silhouettes.</ManifestoLine>
          <ManifestoLine delay={1.0}>Neutral tones.</ManifestoLine>
          <ManifestoLine delay={1.2}>Textures that tell the truth.</ManifestoLine>

          <div className="h-24" />

          <ManifestoLine delay={1.4}>No logos.</ManifestoLine>
          <ManifestoLine delay={1.6}>No noise.</ManifestoLine>
          <ManifestoLine delay={1.8}>No clutter.</ManifestoLine>

          <div className="h-24" />

          <ManifestoLine delay={2.0}>We do not shout.</ManifestoLine>
          <ManifestoLine delay={2.2}>We arrive.</ManifestoLine>
        </div>
      </section>

      {/* 4. CORE PRINCIPLES SECTION */}
      <section className="py-32 md:py-48 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <StaggeredText>
            <h2 
              className="text-xs tracking-[0.3em] font-light mb-20 text-center text-gray-600"
              style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
            >
              CORE PRINCIPLES
            </h2>
          </StaggeredText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <PrincipleCard
              title="QUALITY OVER QUANTITY"
              description="Every stitch is intentional. Built to last beyond seasons."
              delay={0}
            />
            <PrincipleCard
              title="SUBSTANCE OVER STATUS"
              description="We don't chase hype. We build legacy."
              delay={0.2}
            />
            <PrincipleCard
              title="SILENCE OVER NOISE"
              description="In a world screaming for attention, we whisper — and they lean in."
              delay={0.4}
            />
            <PrincipleCard
              title="TIMELESSNESS OVER TRENDS"
              description="Fashion fades. Purpose endures."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* 5. ETHOS SECTION */}
      <section className="py-32 md:py-48 px-8 md:px-16 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-7">
              <StaggeredText delay={0}>
                <p 
                  className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-8 text-gray-900"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  This is not just fashion.
                </p>
              </StaggeredText>
              <StaggeredText delay={0.3}>
                <p 
                  className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-8 text-gray-900"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  This is a way of existing.
                </p>
              </StaggeredText>
              <StaggeredText delay={0.6}>
                <p 
                  className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-gray-900"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  A return to intention.
                </p>
              </StaggeredText>
            </div>

            <div className="md:col-span-5 flex items-end">
              <StaggeredText delay={0.9}>
                <p 
                  className="text-xl md:text-2xl font-light leading-relaxed text-gray-700"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Confidence does not demand attention.
                  <br />
                  <br />
                  It commands presence.
                </p>
              </StaggeredText>
            </div>
          </div>
        </div>
      </section>

      {/* 6. THE MOVEMENT SECTION */}
      <section className="py-32 md:py-48 px-8 md:px-16 bg-[#F5F5F3]">
        <div className="max-w-4xl mx-auto text-center">
          <StaggeredText delay={0}>
            <p 
              className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-8 text-gray-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              We are the Muted Age.
            </p>
          </StaggeredText>

          <StaggeredText delay={0.3}>
            <p 
              className="text-2xl md:text-3xl font-light leading-relaxed mb-6 text-gray-800"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              A shift in design.
            </p>
          </StaggeredText>

          <StaggeredText delay={0.6}>
            <p 
              className="text-2xl md:text-3xl font-light leading-relaxed mb-6 text-gray-800"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              A rebellion against noise.
            </p>
          </StaggeredText>

          <div className="h-16" />

          <StaggeredText delay={0.9}>
            <p 
              className="text-xl md:text-2xl font-light leading-relaxed text-gray-700"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Not everyone will understand.
            </p>
          </StaggeredText>

          <StaggeredText delay={1.2}>
            <p 
              className="text-xl md:text-2xl font-light leading-relaxed text-gray-700"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              It was never meant for everyone.
            </p>
          </StaggeredText>
        </div>
      </section>

      {/* 7. FINAL CTA SECTION */}
      <section className="py-32 md:py-48 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <StaggeredText delay={0}>
            <motion.button
              onClick={() => navigate('/shop')}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-block"
            >
              <span 
                className="block px-16 py-5 border border-gray-900 text-xs tracking-[0.3em] font-light text-gray-900 transition-all duration-700 hover:bg-gray-900 hover:text-white"
                style={{ 
                  fontFamily: 'Helvetica Neue, sans-serif',
                  borderRadius: '2px'
                }}
              >
                ENTER THE SILENT REVOLUTION
              </span>
            </motion.button>
          </StaggeredText>

          <StaggeredText delay={0.3}>
            <motion.button
              onClick={() => navigate('/shop')}
              whileHover={{ x: 4 }}
              className="group mt-12 inline-flex items-center gap-3 text-sm tracking-[0.2em] text-gray-600 font-light hover:text-gray-900 transition-colors duration-700"
              style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
            >
              <span className="relative">
                SHOP THE COLLECTION
                <span className="absolute left-0 -bottom-1 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-700" />
              </span>
              <span className="group-hover:translate-x-1 transition-transform duration-700">→</span>
            </motion.button>
          </StaggeredText>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-24" />
    </div>
  );
};

export default BrandStory;
