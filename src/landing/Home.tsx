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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '782be68b-b4d4-422b-9ae6-2f3d161f8922',

          email,
          subject: 'New BARAKAH Waitlist Signup',
          message: `New user joined the waitlist:\n\nEmail: ${email}`,

          // ✅ THIS is what sends mail to the USER
          autoresponse: {
            subject: 'Welcome to BARAKAH 🌙',
            message: `
Assalamu Alaikum 🌙

Thank you for joining BARAKAH!

We’re building a complete Muslim lifestyle companion that brings together:
• Prayer times & reminders
• Halal services
• Community connections
• Islamic learning resources

You’ll hear from us as we get closer to launch.

May Allah put barakah in your journey 🤍

— Team BARAKAH
            `,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Submission failed');
      }

      setIsSubmitted(true);
      setEmail('');

      setTimeout(() => setIsSubmitted(false), 5000);

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setTimeout(() => setError(''), 5000);
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

          {/* LEFT */}
          <motion.div className="space-y-8">

            <motion.div variants={badgeVariants} className="w-fit">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-orange-100 border border-orange-200">
                <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-orange-700 font-medium text-sm">
                  Coming Soon
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900"
            >
              One Ummah, <span className="text-teal-600">One App</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-slate-600 max-w-xl"
            >
              BARAKAH is your complete Muslim lifestyle companion — prayer times,
              halal services, community & learning in one place.
            </motion.p>

            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <input
                type="email"
                required
                value={email}
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-4 rounded-lg border-2 border-slate-200 focus:border-teal-500 outline-none"
              />

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Joining...
                  </>
                ) : (
                  <>Join →</>
                )}
              </motion.button>
            </motion.form>

            {isSubmitted && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle2 size={20} />
                <span>Confirmation email sent successfully!</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

          </motion.div>

          {/* RIGHT */}
          <PhoneMockup />

        </div>
      </motion.div>
    </div>
  );
}
