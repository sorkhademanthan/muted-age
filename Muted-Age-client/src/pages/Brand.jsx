import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Brand = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Parallax transforms for different sections
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const manifestoY = useTransform(scrollYProgress, [0.3, 0.6], [100, -100]);
  const logoScale = useTransform(scrollYProgress, [0.7, 1], [1.5, 0.8]);
  const logoOpacity = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 1, 0.3]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080808] text-[#888888] overflow-hidden">
      {/* Section 1: The Declaration - Sticky Pin */}
      <section className="h-screen flex items-center justify-center sticky top-0 overflow-hidden">
        {/* Background texture with parallax */}
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0 opacity-20"
        >
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=1920&q=80')] bg-cover bg-center grayscale"></div>
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-[#080808]/60 to-[#080808]"></div>

        {/* Animated text reveals */}
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.2 }}
            viewport={{ once: false }}
            className="text-7xl md:text-9xl font-black tracking-tighter mb-8 text-white"
            style={{ fontFamily: 'Inter Tight, sans-serif' }}
          >
            LOUD IS CHEAP.
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.8 }}
            viewport={{ once: false }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-[#888888]"
            style={{ fontFamily: 'Inter Tight, sans-serif' }}
          >
            SILENCE IS EXPENSIVE.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            viewport={{ once: false }}
            className="mt-12 text-xl md:text-2xl font-light tracking-wide text-[#666666]"
          >
            Welcome to the Muted Age.
          </motion.p>
        </div>
      </section>

      {/* Section 2: The Origin - Split Layout */}
      <section className="min-h-screen relative flex items-center py-24 px-6 md:px-12">
        <motion.div 
          style={{ y: manifestoY }}
          className="absolute inset-0 opacity-10"
        >
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea1a3d17?w=1920&q=80')] bg-cover bg-center grayscale"></div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Video/Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-none"
          >
            <div className="aspect-[4/5] bg-[#111111] relative overflow-hidden">
              <motion.img
                src="https://images.unsplash.com/photo-1558769132-cb1aea1a3d17?w=800&q=90"
                alt="Muted Age Aesthetic"
                className="w-full h-full object-cover grayscale opacity-60"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent"></div>
            </div>
          </motion.div>

          {/* Right: Manifesto Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-xs tracking-[0.3em] text-[#666666] mb-4">THE MANIFESTO</p>
              <h2 className="text-5xl md:text-6xl font-serif mb-8 text-white leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                In an era of noise,<br />silence is the<br />ultimate luxury.
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              viewport={{ once: true }}
              className="text-lg leading-relaxed text-[#888888] font-light"
            >
              We design for the ones who stand in the back of the room but control the energy. 
              Raw textures. Boxy silhouettes. No logos needed.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              viewport={{ once: true }}
              className="text-lg leading-relaxed text-[#888888] font-light"
            >
              We do not shout. We arrive. This is not a trend. This is a movement. 
              A rejection of the loud, the cheap, the fast. We are the antidote.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              viewport={{ once: true }}
              className="pt-6"
            >
              <p className="text-2xl font-light tracking-wider text-white">CHAOS CONTROLLED.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Core Values - Minimal Cards */}
      <section className="min-h-screen py-24 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-xs tracking-[0.3em] text-[#666666] mb-4">CORE PRINCIPLES</p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
              THE CODE
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              { title: 'QUALITY OVER QUANTITY', desc: 'Every piece is intentional. Crafted to last, designed to transcend seasons.' },
              { title: 'SUBSTANCE OVER STATUS', desc: 'We don\'t chase hype. We build legacy. Your presence speaks louder than any logo.' },
              { title: 'SILENCE OVER NOISE', desc: 'In a world screaming for attention, we whisper. And they lean in closer.' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ backgroundColor: '#111111' }}
                className="bg-[#0A0A0A] p-12 border border-[#1A1A1A] transition-colors duration-500"
              >
                <h3 className="text-xl font-bold tracking-wider mb-6 text-white">{item.title}</h3>
                <p className="text-[#888888] leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: The Seal - Logo Reveal */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div
          style={{ scale: logoScale, opacity: logoOpacity }}
          className="text-center"
        >
          <h1 className="text-[15vw] font-black tracking-tighter text-white" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
            MUTED<br />AGE
          </h1>
          <p className="text-xl tracking-[0.5em] text-[#666666] mt-8">EST. 2024</p>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="text-center px-6">
          <motion.h2
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-12 text-white"
            style={{ fontFamily: 'Inter Tight, sans-serif' }}
          >
            DEFINE YOUR ERA
          </motion.h2>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ backgroundColor: '#FFFFFF', color: '#080808' }}
            className="border border-white text-white px-12 py-4 tracking-[0.3em] text-sm font-light transition-all duration-300"
          >
            ENTER THE AGE
          </motion.button>
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;700;900&family=Playfair+Display:wght@400;700&display=swap');
      `}</style>
    </div>
  );
};

export default Brand;