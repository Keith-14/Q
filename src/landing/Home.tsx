'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import PhoneMockup from "@/components/PhoneMockup";

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  const phoneVariants = {
    hidden: { opacity: 0, scale: 0.9, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 1 },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setIsSubmitted(true);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffeaba] overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div className="space-y-8">
            {/* Coming Soon Badge */}
            <motion.div variants={badgeVariants} className="w-fit">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-orange-100 border border-orange-200">
                <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-orange-700 font-medium text-sm">Coming Soon</span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                One Ummah,{' '}
                <span className="text-teal-600">One App</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl"
            >
              BARAKAH is your complete Muslim lifestyle companion. Prayer times, community, halal services, and Islamic learning – all in one beautiful app.
            </motion.p>

            {/* Email Form */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="flex-1 px-4 py-3 sm:py-4 text-base rounded-lg bg-white border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    Join
                    <span>→</span>
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: isSubmitted ? 1 : 0, y: isSubmitted ? 0 : -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
            >
              <CheckCircle2 size={20} />
              <span className="font-medium">Thanks for joining! Check your email for confirmation.</span>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: error ? 1 : 0, y: error ? 0 : -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              <AlertCircle size={20} />
              <span className="font-medium">{error}</span>
            </motion.div>

            {/* Download Links */}
            <motion.div variants={itemVariants} className="flex gap-6 pt-4">
              <a
                href="#"
                className="flex items-center gap-2 text-slate-700 hover:text-teal-600 transition font-medium"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 opacity-80"
                >
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
                <span>iOS</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-slate-700 hover:text-teal-600 transition font-medium"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 opacity-80"
                >
                  <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" />
                </svg>
                <span>Android</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column – Phone */}
          <PhoneMockup />
        </div>
      </motion.div>
    </div>
  );
}