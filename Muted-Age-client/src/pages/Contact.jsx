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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitMessage('Thank you for reaching out. We will respond within 12-48 hours.');
      setFormData({ fullName: '', email: '', phone: '', inquiryType: '', message: '' });
    } catch (error) {
      setSubmitMessage('We apologize for the inconvenience. Please try again.');
    }
    setIsSubmitting(false);
    setTimeout(() => setSubmitMessage(''), 6000);
  };

  const inquiryTypes = [
    'Order Support',
    'Returns & Exchange',
    'Sizing & Fit',
    'Shipping',
    'Press/Collaboration',
    'General Inquiry'
  ];

  const faqCategories = [
    {
      title: 'Shipping & Delivery',
      questions: [
        {
          q: 'How long does delivery take?',
          a: 'Standard delivery arrives within 3-5 business days domestically. International orders typically take 7-12 business days. Express shipping options are available at checkout for faster delivery.'
        },
        {
          q: 'Do you offer international shipping?',
          a: 'Yes, we ship worldwide to over 100 countries. Shipping costs and delivery times vary by destination. Customs duties and import taxes may apply and are the responsibility of the recipient.'
        }
      ]
    },
    {
      title: 'Sizing & Fit',
      questions: [
        {
          q: 'How do I find my perfect size?',
          a: 'Each product page includes a detailed size guide with measurements. For personalized sizing assistance, our team is available via email or live chat. We recommend measuring a similar garment you own for the best fit.'
        },
        {
          q: 'What if the item doesn\'t fit?',
          a: 'We offer complimentary size exchanges within 30 days. Simply contact us to initiate an exchange, and we\'ll arrange for the new size to be sent to you with a prepaid return label for the original item.'
        }
      ]
    },
    {
      title: 'Returns & Exchanges',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition with all tags attached. Returns are complimentary for domestic orders. Original packaging is preferred.'
        },
        {
          q: 'How do I initiate a return?',
          a: 'Contact our support team via email or the contact form with your order number. We\'ll provide a prepaid return label and guide you through the simple return process. Refunds are processed within 5-7 business days of receiving the return.'
        }
      ]
    },
    {
      title: 'Order Tracking',
      questions: [
        {
          q: 'How can I track my order?',
          a: 'Once your order ships, you\'ll receive a tracking number via email and SMS. You can also track your order anytime by visiting the Order Tracking page and entering your order number and email address.'
        },
        {
          q: 'My tracking hasn\'t updated. What should I do?',
          a: 'Tracking information can take 24-48 hours to update after shipping. If your tracking hasn\'t updated after this period, or if you have concerns, please contact our support team with your order number.'
        }
      ]
    },
    {
      title: 'Payments & Discounts',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are encrypted and secure. We do not store credit card information.'
        },
        {
          q: 'Do you offer student or military discounts?',
          a: 'Yes, we offer a 15% discount for students and military personnel. Verification is required through our partner service. Once verified, you\'ll receive a unique discount code via email.'
        }
      ]
    },
    {
      title: 'Care Instructions',
      questions: [
        {
          q: 'How should I care for my garments?',
          a: 'Each piece includes specific care instructions on the label. Generally, we recommend dry cleaning for tailored items, gentle hand washing for knits, and cold machine wash for casual pieces. Avoid bleach and tumble drying. Store in a cool, dry place.'
        },
        {
          q: 'Can I iron or steam my items?',
          a: 'Yes, most items can be steamed or ironed on low heat. Always check the care label first. For delicate fabrics like silk or cashmere, we recommend professional steaming or using a protective cloth when ironing.'
        }
      ]
    },
    {
      title: 'International Orders',
      questions: [
        {
          q: 'Are there additional costs for international orders?',
          a: 'International orders may be subject to customs duties, import taxes, and handling fees determined by your country\'s customs office. These charges are separate from shipping fees and are the responsibility of the recipient.'
        },
        {
          q: 'Can I return international orders?',
          a: 'Yes, we accept international returns within 30 days. Please contact us to arrange the return. Note that return shipping costs are the responsibility of the customer for international orders, and we cannot refund customs duties or import taxes.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFEF9]">
      <Header />
      
      {/* Centered Minimal Header */}
      <div className="relative min-h-[65vh] flex flex-col items-center justify-center px-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl"
        >
          <h1 
            className="text-7xl md:text-8xl lg:text-9xl font-light mb-8 tracking-tight"
            style={{ 
              fontFamily: 'Bodoni Moda, Playfair Display, serif',
              letterSpacing: '0.02em'
            }}
          >
            Contact Us
          </h1>

          <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed max-w-2xl mx-auto mb-10 tracking-wide">
            WE'RE HERE TO ASSIST AND ENSURE A SEAMLESS EXPERIENCE.
          </p>

          {/* Ultra-thin divider */}
          <div className="w-32 mx-auto border-t border-gray-300" style={{ opacity: 0.25, borderWidth: '0.5px' }} />
        </motion.div>
      </div>

      {/* Contact Form */}
      <div className="max-w-3xl mx-auto px-8 md:px-12 py-24">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full px-6 py-4 bg-white border border-gray-300 text-gray-900 text-base font-light focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-300"
              style={{ borderRadius: '3px' }}
            />
          </div>

          {/* Email Address */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email Address"
              className="w-full px-6 py-4 bg-white border border-gray-300 text-gray-900 text-base font-light focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-300"
              style={{ borderRadius: '3px' }}
            />
          </div>

          {/* Phone Number (Optional) */}
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number (Optional)"
              className="w-full px-6 py-4 bg-white border border-gray-300 text-gray-900 text-base font-light focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-300"
              style={{ borderRadius: '3px' }}
            />
          </div>

          {/* Inquiry Type Dropdown */}
          <div className="relative">
            <select
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 bg-white border border-gray-300 text-gray-900 text-base font-light focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-300 appearance-none cursor-pointer"
              style={{ borderRadius: '3px' }}
            >
              <option value="">Select Inquiry Type</option>
              {inquiryTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" 
              size={20} 
            />
          </div>

          {/* Message Box */}
          <div className="relative">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Your Message"
              rows="6"
              className="w-full px-6 py-4 bg-white border border-gray-300 text-gray-900 text-base font-light focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-500 resize-none"
              style={{ 
                borderRadius: '3px',
                transition: 'height 0.5s ease-out, border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.height = '200px';
              }}
              onBlur={(e) => {
                if (!e.target.value) {
                  e.target.style.height = 'auto';
                }
              }}
            />
          </div>

          {/* Submission Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex-1 bg-gray-900 text-white py-4 px-8 text-sm tracking-[0.2em] font-light hover:bg-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ borderRadius: '3px' }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  SENDING...
                </>
              ) : (
                'SEND MESSAGE'
              )}
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex-1 bg-white text-gray-900 border border-gray-900 py-4 px-8 text-sm tracking-[0.2em] font-light hover:bg-gray-900 hover:text-white transition-all duration-500 flex items-center justify-center gap-2"
              style={{ borderRadius: '3px' }}
            >
              <MessageCircle size={16} />
              LIVE CUSTOMER SUPPORT
            </motion.button>
          </div>

          {/* Response Time */}
          <p className="text-center text-xs text-gray-500 font-light tracking-wide">
            Response time: 12–48 hours
          </p>

          {/* Submit Message */}
          <AnimatePresence>
            {submitMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="p-4 bg-green-50 border border-green-200 text-green-800 text-center text-sm font-light rounded"
                style={{ borderRadius: '3px' }}
              >
                {submitMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>

      {/* Contact Information Block */}
      <div className="max-w-5xl mx-auto px-8 md:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16"
        >
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <p className="text-xs tracking-[0.25em] text-gray-500 font-light mb-3">OPERATING HOURS</p>
              <p className="text-base text-gray-900 font-light leading-relaxed">
                Monday – Friday: 9:00 AM – 6:00 PM EST<br />
                Saturday: 10:00 AM – 4:00 PM EST<br />
                Sunday: Closed
              </p>
            </div>

            <div>
              <p className="text-xs tracking-[0.25em] text-gray-500 font-light mb-3">CUSTOMER SERVICE</p>
              <p className="text-base text-gray-900 font-light">
                support@mutedage.com
              </p>
            </div>

            <div>
              <p className="text-xs tracking-[0.25em] text-gray-500 font-light mb-3">SUPPORT NUMBER</p>
              <p className="text-base text-gray-900 font-light">
                +1 (555) 123-4567
              </p>
            </div>

            <div>
              <p className="text-xs tracking-[0.25em] text-gray-500 font-light mb-3">STUDIO ADDRESS</p>
              <p className="text-base text-gray-900 font-light leading-relaxed">
                125 West 25th Street<br />
                Suite 400<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>
          </div>

          {/* Map Preview */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] bg-gray-200 overflow-hidden group cursor-pointer"
            style={{ borderRadius: '4px' }}
          >
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=90"
              alt="Studio location"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-700" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="bg-white/95 px-6 py-3 text-sm tracking-[0.2em] text-gray-900 font-light" style={{ borderRadius: '3px' }}>
                VIEW ON MAP
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-8 md:px-12 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 
            className="text-5xl md:text-6xl font-light mb-6 tracking-tight"
            style={{ fontFamily: 'Bodoni Moda, Playfair Display, serif' }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-600 font-light tracking-wide">
            Find quick answers to common questions.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.7, 
                delay: categoryIndex * 0.1,
                ease: [0.22, 1, 0.36, 1] 
              }}
            >
              <h3 className="text-xs tracking-[0.25em] text-gray-500 font-light mb-6">
                {category.title.toUpperCase()}
              </h3>
              <div className="space-y-3">
                {category.questions.map((faq, faqIndex) => {
                  const faqId = `${categoryIndex}-${faqIndex}`;
                  const isExpanded = expandedFaq === faqId;

                  return (
                    <motion.div
                      key={faqId}
                      className="border border-gray-200 bg-white overflow-hidden"
                      style={{ borderRadius: '3px' }}
                    >
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                        className="w-full px-8 py-5 text-left flex justify-between items-center group hover:bg-gray-50 transition-all duration-300"
                      >
                        <span className="text-base text-gray-900 font-light pr-8">
                          {faq.q}
                        </span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown size={20} className="text-gray-400" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
                              <p className="text-sm text-gray-600 font-light leading-relaxed">
                                {faq.a}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16 pt-16 border-t border-gray-200"
          style={{ borderWidth: '0.5px' }}
        >
          <p className="text-sm text-gray-600 font-light mb-6">
            Didn't find your answer? Reach out — we're here.
          </p>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ x: 4 }}
            className="group inline-flex items-center gap-3 text-sm tracking-[0.2em] text-gray-900 font-light"
          >
            <span className="relative">
              MESSAGE SUPPORT
              <span className="absolute left-0 -bottom-1 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-500" />
            </span>
            <span className="group-hover:translate-x-1 transition-transform duration-500">→</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
