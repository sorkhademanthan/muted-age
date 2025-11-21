import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('section-01');
  const sectionsRef = useRef({});

  const sections = [
    { id: 'section-01', title: 'Collection of Intelligence', number: '01' },
    { id: 'section-02', title: 'The Usage Protocol', number: '02' },
    { id: 'section-03', title: 'The Vault', number: '03' },
    { id: 'section-04', title: 'Your Sovereignty', number: '04' },
    { id: 'section-05', title: 'Third-Party Entities', number: '05' },
    { id: 'section-06', title: 'Communication Channels', number: '06' },
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
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.3em] text-gray-400 mb-6">LEGAL FRAMEWORK</p>
            <h1 className="text-6xl md:text-7xl font-serif mb-8 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Privacy Policy
            </h1>
            <div className="flex items-center gap-4 text-sm font-mono">
              <span className="text-gray-400">LAST UPDATED:</span>
              <span className="bg-white/10 px-4 py-2 tracking-wider">2024.12.15</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left Sidebar - Table of Contents (Sticky) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xs tracking-[0.3em] text-gray-500 mb-8">TABLE OF CONTENTS</h2>
              <nav className="space-y-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left transition-all duration-300 ${
                      activeSection === section.id
                        ? 'text-black font-semibold'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-sm mt-1">{section.number}</span>
                      <span className="text-lg leading-tight">{section.title}</span>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Contact Info */}
              <div className="mt-16 pt-8 border-t border-gray-200">
                <p className="text-xs tracking-[0.2em] text-gray-500 mb-4">QUESTIONS?</p>
                <a href="mailto:privacy@mutedage.com" className="text-sm text-black hover:underline">
                  privacy@mutedage.com
                </a>
              </div>
            </div>
          </div>

          {/* Right Content - Policy Sections */}
          <div className="lg:col-span-8">
            {/* Section 01: Collection of Intelligence */}
            <section
              id="section-01"
              ref={(el) => (sectionsRef.current['section-01'] = el)}
              className="mb-24 scroll-mt-24"
            >
              <div className="mb-6">
                <span className="font-mono text-sm text-gray-400">SECTION 01</span>
                <h2 className="text-4xl font-serif mt-2 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Collection of Intelligence
                </h2>
              </div>
              <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                <p className="mb-6">
                  In the pursuit of delivering an unparalleled experience, Muted Age collects specific data points that enable us to refine our services and protect the integrity of our platform. This intelligence gathering operates under strict protocols designed to minimize intrusion while maximizing utility.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Personal Identifiers:</strong> When you engage with our platform, we collect your name, email address, shipping and billing addresses, and telephone number. This information is essential for order fulfillment and communication regarding your transactions.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Transaction Data:</strong> Payment information is processed through secure, encrypted channels. We do not store complete credit card numbers; only the last four digits and expiration date are retained for reference purposes.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Behavioral Analytics:</strong> Your interactions with our platform—pages visited, time spent, navigation patterns—are tracked using cookies and similar technologies. This data informs our understanding of user preferences and site optimization.
                </p>
                <p>
                  <strong className="text-black">Device Information:</strong> We collect technical data including IP address, browser type, operating system, and device identifiers to ensure compatibility and security.
                </p>
              </div>
            </section>

            {/* Section 02: The Usage Protocol */}
            <section
              id="section-02"
              ref={(el) => (sectionsRef.current['section-02'] = el)}
              className="mb-24 scroll-mt-24"
            >
              <div className="mb-6">
                <span className="font-mono text-sm text-gray-400">SECTION 02</span>
                <h2 className="text-4xl font-serif mt-2 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                  The Usage Protocol
                </h2>
              </div>
              <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                <p className="mb-6">
                  The intelligence we collect serves multiple strategic purposes, each designed to enhance your experience while maintaining the highest standards of discretion and respect for your privacy.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Order Processing & Fulfillment:</strong> Your personal and transaction data is used to process orders, coordinate shipping logistics, and handle returns or exchanges. This is the primary function of data collection.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Personalization:</strong> Behavioral analytics inform our recommendation algorithms, allowing us to curate product selections tailored to your preferences. This creates a more intuitive browsing experience.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Communication:</strong> We use your contact information to send transactional emails (order confirmations, shipping updates) and, with your consent, promotional materials about new collections and exclusive offerings.
                </p>
                <p>
                  <strong className="text-black">Platform Optimization:</strong> Aggregate, anonymized data is analyzed to improve site performance, identify technical issues, and refine user interface design.
                </p>
              </div>
            </section>

            {/* Section 03: The Vault */}
            <section
              id="section-03"
              ref={(el) => (sectionsRef.current['section-03'] = el)}
              className="mb-24 scroll-mt-24"
            >
              <div className="mb-6">
                <span className="font-mono text-sm text-gray-400">SECTION 03</span>
                <h2 className="text-4xl font-serif mt-2 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                  The Vault
                </h2>
              </div>
              <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                <p className="mb-6">
                  Security is not an afterthought—it is foundational to our operations. Your data is protected by multiple layers of encryption, access controls, and continuous monitoring systems designed to detect and neutralize threats before they materialize.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Encryption Standards:</strong> All data transmission between your device and our servers occurs over SSL/TLS encrypted connections. Stored data is encrypted using AES-256 bit encryption, the industry standard for high-security applications.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Access Control:</strong> Only authorized personnel with a legitimate business need can access personal data. Access logs are maintained and regularly audited. Multi-factor authentication is required for all administrative access.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Regular Audits:</strong> Our security infrastructure undergoes quarterly penetration testing by independent third-party security firms. Vulnerabilities are addressed within 48 hours of discovery.
                </p>
                <p>
                  <strong className="text-black">Data Retention:</strong> Personal data is retained only as long as necessary to fulfill the purposes outlined in this policy, or as required by law. After which, it is securely deleted or anonymized.
                </p>
              </div>
            </section>

            {/* Section 04: Your Sovereignty */}
            <section
              id="section-04"
              ref={(el) => (sectionsRef.current['section-04'] = el)}
              className="mb-24 scroll-mt-24"
            >
              <div className="mb-6">
                <span className="font-mono text-sm text-gray-400">SECTION 04</span>
                <h2 className="text-4xl font-serif mt-2 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Your Sovereignty
                </h2>
              </div>
              <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                <p className="mb-6">
                  You retain full control over your personal data. We recognize and respect your rights under applicable data protection laws, including GDPR, CCPA, and other regional regulations.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Right to Access:</strong> You may request a copy of all personal data we hold about you. We will provide this information in a structured, commonly used format within 30 days.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Right to Correction:</strong> If any information we hold is inaccurate or incomplete, you have the right to request corrections. Updates are processed immediately.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Right to Deletion:</strong> You may request the deletion of your personal data, subject to legal retention requirements. Once verified, deletion is completed within 14 business days.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Right to Opt-Out:</strong> You can unsubscribe from marketing communications at any time via the link in our emails or by contacting our privacy team directly.
                </p>
                <p>
                  <strong className="text-black">Right to Portability:</strong> Upon request, we will transfer your data to another service provider in a machine-readable format.
                </p>
              </div>
            </section>

            {/* Section 05: Third-Party Entities */}
            <section
              id="section-05"
              ref={(el) => (sectionsRef.current['section-05'] = el)}
              className="mb-24 scroll-mt-24"
            >
              <div className="mb-6">
                <span className="font-mono text-sm text-gray-400">SECTION 05</span>
                <h2 className="text-4xl font-serif mt-2 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Third-Party Entities
                </h2>
              </div>
              <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                <p className="mb-6">
                  To deliver our services efficiently, we engage with carefully vetted third-party service providers. These entities operate under strict contractual obligations to protect your data.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Payment Processors:</strong> We use industry-leading payment gateways (e.g., Stripe, PayPal) that comply with PCI-DSS standards. Payment data is never stored on our servers.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Shipping Partners:</strong> Logistics providers receive only the information necessary to complete delivery (name, address, contact number). They are prohibited from using this data for any other purpose.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Analytics Services:</strong> We use Google Analytics and similar tools to understand user behavior. These services collect anonymized data and are configured to respect Do Not Track signals where applicable.
                </p>
                <p>
                  <strong className="text-black">Marketing Platforms:</strong> Email marketing tools (e.g., Mailchimp) are used solely for communicating with subscribers who have explicitly opted in. Unsubscribe mechanisms are provided in every communication.
                </p>
              </div>
            </section>

            {/* Section 06: Communication Channels */}
            <section
              id="section-06"
              ref={(el) => (sectionsRef.current['section-06'] = el)}
              className="mb-24 scroll-mt-24"
            >
              <div className="mb-6">
                <span className="font-mono text-sm text-gray-400">SECTION 06</span>
                <h2 className="text-4xl font-serif mt-2 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Communication Channels
                </h2>
              </div>
              <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                <p className="mb-6">
                  We maintain transparent, open lines of communication regarding your privacy. If you have questions, concerns, or requests related to this policy, we encourage you to reach out.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Privacy Inquiries:</strong> Direct all privacy-related questions to <a href="mailto:privacy@mutedage.com" className="text-black underline">privacy@mutedage.com</a>. Our team responds within 48 hours.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Data Requests:</strong> To exercise your rights (access, deletion, correction), submit a formal request to our privacy team. Verification of identity is required to prevent unauthorized access.
                </p>
                <p className="mb-6">
                  <strong className="text-black">Policy Updates:</strong> This policy is reviewed quarterly. Material changes will be communicated via email and prominently displayed on our website 30 days before taking effect.
                </p>
                <p>
                  <strong className="text-black">Regulatory Compliance:</strong> Muted Age complies with GDPR (EU), CCPA (California), and other applicable data protection regulations. For region-specific information, please contact our legal team.
                </p>
              </div>
            </section>

            {/* Footer Section */}
            <div className="border-t border-gray-200 pt-12 mt-16">
              <p className="text-xs tracking-[0.2em] text-gray-400 mb-4">DOCUMENT REFERENCE</p>
              <p className="font-mono text-sm text-gray-600">PP-2024-V1.3 | EFFECTIVE: 2024.12.15</p>
              <p className="text-sm text-gray-500 mt-6">
                This document constitutes the entire privacy policy of Muted Age. By continuing to use our services, you acknowledge that you have read, understood, and agreed to the terms outlined herein.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
