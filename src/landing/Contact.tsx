import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: ' info@barakah.services',
    description: 'We will respond within 24 hours',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+91 88791 33172',
    description: 'Mon-Fri, 9AM-6PM IST',
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Get in <span className="text-teal-600">Touch</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Our team is always ready to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Contact Info Cards */}
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={info.title}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="p-8 rounded-2xl bg-white border-2 border-slate-100 hover:border-teal-200 hover:shadow-xl transition text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{info.title}</h3>
                <p className="text-teal-600 font-semibold mb-2">{info.value}</p>
                <p className="text-slate-500 text-sm">{info.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Form */}
        <motion.div
          variants={itemVariants}
          className="max-w-2xl mx-auto p-12 rounded-2xl bg-white border-2 border-slate-100 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Send Us a Message</h2>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="flex justify-center mb-6"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
              <p className="text-slate-600">
                Thank you for reaching out. We'll get back to you as soon as possible.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
              >
                Send Message
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 p-12 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: 'When will BARAKAH launch?',
                a: 'We are targeting Q1 2026. Join our waitlist to be notified.',
              },
              {
                q: 'Is BARAKAH free to use?',
                a: 'Yes, BARAKAH will be free with optional premium features.',
              },
              {
                q: 'How is my data protected?',
                a: 'We use enterprise-grade encryption and follow Islamic privacy principles.',
              },
              {
                q: 'Can I suggest features?',
                a: 'Absolutely! We value community feedback. Contact us anytime.',
              },
            ].map((faq) => (
              <motion.div
                key={faq.q}
                whileHover={{ y: -4 }}
                className="p-6 bg-white rounded-xl border border-teal-200"
              >
                <h3 className="font-bold text-slate-900 mb-3">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
