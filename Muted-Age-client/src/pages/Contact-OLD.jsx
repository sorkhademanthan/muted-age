import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import Header from '../components/Header';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isFocused, setIsFocused] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitMessage('Thank you for reaching out. Our concierge team will respond within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitMessage('We apologize for the inconvenience. Please try again.');
    }
    setIsSubmitting(false);
    setTimeout(() => setSubmitMessage(''), 5000);
  };

  const faqs = [
    {
      category: 'Orders & Shipping',
      question: 'How long does delivery take?',
      answer: 'Standard delivery typically arrives within 3-5 business days. For international orders, please allow 7-14 business days. Express options are available at checkout.',
    },
    {
      category: 'Orders & Shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we deliver worldwide. Customs duties and taxes may apply based on your location. These charges are the responsibility of the recipient.',
    },
    {
      category: 'Product Care',
      question: 'How should I care for my garments?',
      answer: 'Each piece comes with specific care instructions on the label. Generally, we recommend dry cleaning for structured items and gentle hand-washing for knits. Store in a cool, dry place.',
    },
    {
      category: 'Product Care',
      question: 'Are your materials sustainable?',
      answer: 'We are committed to sustainability. Our collections feature organic cotton, recycled fabrics, and responsibly sourced materials. Each product page details its composition.',
    },
    {
      category: 'Returns',
      question: 'What is your return policy?',
      answer: 'We offer complimentary returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging with all tags attached.',
    },
    {
      category: 'Returns',
      question: 'How do I initiate a return?',
      answer: 'Contact our concierge team via email or phone. We will provide a prepaid return label and guide you through the process.',
    },
    {
      category: 'Sizing Guidance',
      question: 'How do I find my size?',
      answer: 'Refer to our detailed sizing guide available on each product page. For personalized assistance, our concierge team can provide tailored recommendations.',
    },
    {
      category: 'Sizing Guidance',
      question: 'Do you offer alterations?',
      answer: 'Yes, we offer complimentary alterations for select items purchased at our ateliers. Please inquire with our team for details.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#1A1A1A] text-white py-32 px-6 relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-black opacity-50"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs tracking-[0.3em] text-gray-400 mb-6 font-light">CONCIERGE SERVICE</p>
            <h1 className="text-6xl md:text-7xl font-serif mb-8 tracking-tight leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Your Direct Line<br />to Our Atelier
            </h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
              Personal assistance awaits. Our dedicated concierge team is here to provide you with<br className="hidden md:block" />
              unparalleled service through your preferred channel.
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-1 h-32 bg-gradient-to-b from-transparent via-gray-700 to-transparent opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-1 h-32 bg-gradient-to-b from-transparent via-gray-700 to-transparent opacity-30"></div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <motion.div 
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a href="mailto:concierge@mutedage.com" className="group">
            <div className="bg-white border border-gray-200 rounded-none p-10 hover:border-[#3A5F40] hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A5F40]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <Mail className="w-10 h-10 mb-6 mx-auto text-gray-400 group-hover:text-[#3A5F40] transition-colors duration-300" strokeWidth={1} />
                <p className="text-xs text-gray-500 mb-3 tracking-[0.25em] font-light">EMAIL</p>
                <p className="text-[#1A1A1A] font-light text-sm">concierge@mutedage.com</p>
              </div>
            </div>
          </a>

          <a href="tel:+15551234567" className="group">
            <div className="bg-white border border-gray-200 rounded-none p-10 hover:border-[#3A5F40] hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A5F40]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <Phone className="w-10 h-10 mb-6 mx-auto text-gray-400 group-hover:text-[#3A5F40] transition-colors duration-300" strokeWidth={1} />
                <p className="text-xs text-gray-500 mb-3 tracking-[0.25em] font-light">PHONE</p>
                <p className="text-[#1A1A1A] font-light text-sm">+1 (555) 123-4567</p>
              </div>
            </div>
          </a>

          <div className="group cursor-pointer">
            <div className="bg-white border border-gray-200 rounded-none p-10 hover:border-[#3A5F40] hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A5F40]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <MapPin className="w-10 h-10 mb-6 mx-auto text-gray-400 group-hover:text-[#3A5F40] transition-colors duration-300" strokeWidth={1} />
                <p className="text-xs text-gray-500 mb-3 tracking-[0.25em] font-light">ATELIER</p>
                <p className="text-[#1A1A1A] font-light text-sm">New York, NY 10001</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-[#1A1A1A] mb-4">Anticipatory Assistance</h2>
            <p className="text-lg text-gray-600 font-light">Answers to your most common inquiries</p>
          </div>

          {/* FAQ Cards */}
          <div className="space-y-3">
            <AnimatePresence>
              {faqs.map((faq, index) => (
                <motion.div
                  key={`${faq.category}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#3A5F40] transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-8 py-5 text-left flex justify-between items-center group"
                  >
                    <div className="flex-1">
                      <p className="text-xs text-[#3A5F40] mb-1 font-light tracking-wider">{faq.category}</p>
                      <p className="text-base text-[#1A1A1A] font-light group-hover:text-[#3A5F40] transition-colors">
                        {faq.question}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-4 flex-shrink-0"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50">
                          <p className="text-gray-600 font-light leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-[#1A1A1A] mb-4">Bespoke Inquiry</h2>
            <p className="text-lg text-gray-600 font-light">For personalized assistance, please share your details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="peer w-full px-6 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3A5F40] transition-all duration-300 text-[#1A1A1A]"
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  className="absolute left-6 top-4 text-gray-400 font-light transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-4 peer-focus:text-xs peer-focus:text-[#3A5F40] peer-focus:bg-gray-50 peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-gray-50 peer-[:not(:placeholder-shown)]:px-2"
                >
                  Your Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="peer w-full px-6 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3A5F40] transition-all duration-300 text-[#1A1A1A]"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute left-6 top-4 text-gray-400 font-light transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-4 peer-focus:text-xs peer-focus:text-[#3A5F40] peer-focus:bg-gray-50 peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-gray-50 peer-[:not(:placeholder-shown)]:px-2"
                >
                  Email Address
                </label>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="peer w-full px-6 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3A5F40] transition-all duration-300 text-[#1A1A1A]"
                placeholder=" "
              />
              <label
                htmlFor="subject"
                className="absolute left-6 top-4 text-gray-400 font-light transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-4 peer-focus:text-xs peer-focus:text-[#3A5F40] peer-focus:bg-gray-50 peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-gray-50 peer-[:not(:placeholder-shown)]:px-2"
              >
                Subject
              </label>
            </div>

            <div className="relative">
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
                className="peer w-full px-6 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3A5F40] transition-all duration-300 text-[#1A1A1A] resize-none"
                placeholder=" "
              />
              <label
                htmlFor="message"
                className="absolute left-6 top-4 text-gray-400 font-light transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-4 peer-focus:text-xs peer-focus:text-[#3A5F40] peer-focus:bg-gray-50 peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-gray-50 peer-[:not(:placeholder-shown)]:px-2"
              >
                Your Message
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#3A5F40] text-white py-4 px-8 rounded-lg font-light tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  SENDING...
                </>
              ) : (
                <>
                  SEND MESSAGE
                  <Send className="w-4 h-4" />
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-[#3A5F40]/10 border border-[#3A5F40]/20 rounded-lg text-[#3A5F40] text-center font-light"
                >
                  {submitMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-400 font-light mb-4">Follow Our Journey</p>
          <div className="flex justify-center gap-8 mb-6">
            {['Instagram', 'Twitter', 'Facebook'].map((social) => (
              <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                {social}
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-500">© 2024 Muted Age. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;