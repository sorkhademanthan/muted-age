import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('clause-01');
  const sectionsRef = useRef({});

  const clauses = [
    { id: 'clause-01', title: 'Acceptance of Terms', number: '01' },
    { id: 'clause-02', title: 'Intellectual Property', number: '02' },
    { id: 'clause-03', title: 'User Obligations', number: '03' },
    { id: 'clause-04', title: 'Returns & Refunds', number: '04' },
    { id: 'clause-05', title: 'Limitation of Liability', number: '05' },
    { id: 'clause-06', title: 'Termination', number: '06' },
  ];

  // Intersection Observer to detect active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    sectionsRef.current[sectionId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#0A0A0A] text-white py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.3em] text-gray-400 mb-6">LEGAL BINDING</p>
            <h1 className="text-6xl md:text-7xl font-serif mb-8 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Conditions of the<br />Muted Age
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm font-mono">
              <span className="text-gray-400">EFFECTIVE DATE:</span>
              <span className="bg-white/10 px-4 py-2 tracking-wider">2024.12.15</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left Sidebar - Navigation (Sticky) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xs tracking-[0.3em] text-gray-500 mb-8">CLAUSES</h2>
              <nav className="space-y-4">
                {clauses.map((clause) => (
                  <button
                    key={clause.id}
                    onClick={() => scrollToSection(clause.id)}
                    className={`w-full text-left transition-all duration-300 ${
                      activeSection === clause.id
                        ? 'text-black font-semibold'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-sm mt-1">{clause.number}</span>
                      <span className="text-lg leading-tight">{clause.title}</span>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Contact Info */}
              <div className="mt-16 pt-8 border-t border-gray-200">
                <p className="text-xs tracking-[0.2em] text-gray-500 mb-4">LEGAL INQUIRIES</p>
                <a href="mailto:legal@mutedage.com" className="text-sm text-black hover:underline">
                  legal@mutedage.com
                </a>
              </div>
            </div>
          </div>

          {/* Right Content - Clauses */}
          <div className="lg:col-span-8">
            {/* Clause 01: Acceptance of Terms */}
            <motion.section
              id="clause-01"
              ref={(el) => (sectionsRef.current['clause-01'] = el)}
              className="mb-24 scroll-mt-24 group relative"
              whileHover={{ opacity: 1 }}
            >
              <div className="absolute left-0 top-0 text-9xl font-serif text-gray-100 -z-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                01.
              </div>
              <div className="pl-24 border-l-2 border-gray-200 group-hover:border-black transition-colors duration-300 opacity-80 group-hover:opacity-100">
                <h2 className="text-3xl font-serif mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Acceptance of Terms
                </h2>
                <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                  <p className="mb-6">
                    By accessing, browsing, or making a purchase from Muted Age, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, all applicable laws, and regulations.
                  </p>
                  <p className="mb-6">
                    If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
                  </p>
                  <p>
                    Your continued use of this platform constitutes acceptance of any amendments or modifications to these terms, which may be updated at our sole discretion.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Clause 02: Intellectual Property */}
            <motion.section
              id="clause-02"
              ref={(el) => (sectionsRef.current['clause-02'] = el)}
              className="mb-24 scroll-mt-24 group relative"
            >
              <div className="absolute left-0 top-0 text-9xl font-serif text-gray-100 -z-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                02.
              </div>
              <div className="pl-24 border-l-2 border-gray-200 group-hover:border-black transition-colors duration-300 opacity-80 group-hover:opacity-100">
                <h2 className="text-3xl font-serif mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Intellectual Property
                </h2>
                <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                  <p className="mb-6">
                    All content on this website, including but not limited to text, graphics, logos, images, product designs, and software, is the exclusive property of Muted Age or its licensors and is protected by international copyright laws.
                  </p>
                  <p className="mb-6">
                    <strong className="text-black">Prohibited Actions:</strong> You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any material from our website without prior written consent.
                  </p>
                  <p>
                    <strong className="text-black">Trademark Protection:</strong> "Muted Age" and all associated marks are registered trademarks. Unauthorized use of these marks is strictly prohibited and may constitute trademark infringement.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Clause 03: User Obligations */}
            <motion.section
              id="clause-03"
              ref={(el) => (sectionsRef.current['clause-03'] = el)}
              className="mb-24 scroll-mt-24 group relative"
            >
              <div className="absolute left-0 top-0 text-9xl font-serif text-gray-100 -z-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                03.
              </div>
              <div className="pl-24 border-l-2 border-gray-200 group-hover:border-black transition-colors duration-300 opacity-80 group-hover:opacity-100">
                <h2 className="text-3xl font-serif mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  User Obligations
                </h2>
                <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                  <p className="mb-6">
                    You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of this site by any third party.
                  </p>
                  <p className="mb-6">
                    <strong className="text-black">Account Security:</strong> If you create an account, you are responsible for maintaining the confidentiality of your account credentials. You must immediately notify us of any unauthorized use.
                  </p>
                  <p>
                    <strong className="text-black">Accurate Information:</strong> You warrant that all information provided during the registration or checkout process is accurate, current, and complete.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Clause 04: Returns & Refunds */}
            <motion.section
              id="clause-04"
              ref={(el) => (sectionsRef.current['clause-04'] = el)}
              className="mb-24 scroll-mt-24 group relative"
            >
              <div className="absolute left-0 top-0 text-9xl font-serif text-gray-100 -z-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                04.
              </div>
              <div className="pl-24 border-l-2 border-gray-200 group-hover:border-black transition-colors duration-300 opacity-80 group-hover:opacity-100">
                <h2 className="text-3xl font-serif mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Returns & Refunds
                </h2>
                <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                  <p className="mb-6">
                    We offer a 30-day return window from the date of delivery. Items must be unworn, unwashed, unaltered, and in their original packaging with all tags attached.
                  </p>
                  <p className="mb-6">
                    <strong className="text-black">Exceptions:</strong> Final sale items, customized products, and intimate apparel cannot be returned for hygienic reasons.
                  </p>
                  <p className="mb-6">
                    <strong className="text-black">Refund Processing:</strong> Once your return is received and inspected, we will process your refund to the original payment method within 7-10 business days.
                  </p>
                  <p>
                    <strong className="text-black">Exchanges:</strong> We do not offer direct exchanges. Please return the item for a refund and place a new order.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Clause 05: Limitation of Liability */}
            <motion.section
              id="clause-05"
              ref={(el) => (sectionsRef.current['clause-05'] = el)}
              className="mb-24 scroll-mt-24 group relative"
            >
              <div className="absolute left-0 top-0 text-9xl font-serif text-gray-100 -z-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                05.
              </div>
              <div className="pl-24 border-l-2 border-gray-200 group-hover:border-black transition-colors duration-300 opacity-80 group-hover:opacity-100">
                <h2 className="text-3xl font-serif mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Limitation of Liability
                </h2>
                <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                  <p className="mb-6">
                    In no event shall Muted Age, its directors, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of this website.
                  </p>
                  <p className="mb-6">
                    <strong className="text-black">Maximum Liability:</strong> Our total liability to you for all damages, losses, or causes of action shall not exceed the amount paid by you for the product or service in question.
                  </p>
                  <p>
                    <strong className="text-black">Force Majeure:</strong> We are not responsible for delays or failures in performance resulting from acts beyond our reasonable control, including but not limited to natural disasters, war, or supply chain disruptions.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Clause 06: Termination */}
            <motion.section
              id="clause-06"
              ref={(el) => (sectionsRef.current['clause-06'] = el)}
              className="mb-24 scroll-mt-24 group relative"
            >
              <div className="absolute left-0 top-0 text-9xl font-serif text-gray-100 -z-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                06.
              </div>
              <div className="pl-24 border-l-2 border-gray-200 group-hover:border-black transition-colors duration-300 opacity-80 group-hover:opacity-100">
                <h2 className="text-3xl font-serif mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Termination
                </h2>
                <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                  <p className="mb-6">
                    We reserve the right to terminate or suspend your access to our website immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms.
                  </p>
                  <p className="mb-6">
                    <strong className="text-black">User-Initiated Termination:</strong> You may terminate your account at any time by contacting our customer service team. Upon termination, your right to use the website will cease immediately.
                  </p>
                  <p>
                    <strong className="text-black">Survival:</strong> All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Digital Seal Footer */}
            <div className="border-t border-gray-200 pt-12 mt-16">
              <div className="text-center">
                <div className="inline-block border-2 border-black px-12 py-8">
                  <p className="text-xs tracking-[0.3em] text-gray-500 mb-4">DIGITAL SEAL</p>
                  <p className="font-mono text-sm text-gray-600 mb-6">TOS-2024-V1.2 | EFFECTIVE: 2024.12.15</p>
                  <div className="w-16 h-16 border-2 border-black rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-2xl">©</span>
                  </div>
                  <p className="text-sm text-gray-700 italic max-w-md mx-auto" style={{ fontFamily: 'Playfair Display, serif' }}>
                    By navigating this site, you acknowledge and accept these terms as a binding agreement between you and Muted Age.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  );
};

export default TermsOfService;
