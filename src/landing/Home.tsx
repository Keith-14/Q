'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import PhoneMockup from "@/components/PhoneMockup";

export default function Home() {
  /* ================= STATE ================= */
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /* ================= ANIMATIONS ================= */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  /* ================= SUBMIT ================= */
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
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message);

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

      {/* ================= HERO ================= */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div className="space-y-8">
            <motion.div variants={badgeVariants} className="w-fit">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-orange-100 border border-orange-200">
                <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
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

            {/* UPDATED SPACING HERE */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed"
            >
              Unlock purposeful living with an all-in-one ecosystem for Muslims. 
            Get personalized AI guidance, community support, and reliable resources for 
            worship, travel, and daily habits, turning sincerity into everyday barakah.
            </motion.p>
          </motion.div>

          <PhoneMockup />
        </div>
      </motion.div>

      {/* ================= STATS ================= */}
      <section className="py-20 bg-gradient-to-b from-[#34453a] to-[#161d17]">
        <div className="max-w-7xl mx-auto px-4">
          <Stats />
        </div>
      </section>

      {/* ================= ISLAMIC VERSE ================= */}
      <section className="bg-[#ffeaba] py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6 text-3xl">☪️</div>

          <blockquote className="text-2xl sm:text-3xl font-medium text-[#34453a] leading-relaxed mb-6">
            “The believers are but brothers, so make settlement between your brothers.”
          </blockquote>

          <p className="text-[#5f5a4f] italic">
            — Surah Al-Hujurat 49:10
          </p>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section id="waitlist" className="bg-[#ffeaba] pb-28">
        <div className="max-w-3xl mx-auto px-4">
          <div className="p-12 rounded-2xl bg-gradient-to-b from-[#34453a] to-[#161d17]
                          text-white text-center shadow-xl shadow-black/40 border border-white/10">

            <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-white/10 flex items-center justify-center">
              📩
            </div>

            <h3 className="text-3xl font-bold mb-3">
              Be the First to Experience BARAKAH
            </h3>

            <p className="text-white/70 mb-8">
              Join our exclusive waitlist and be notified when we launch.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-4 rounded-lg bg-[#fff2d6] text-[#34453a]
                           border border-[#e6cfa2] focus:border-teal-500 focus:outline-none"
              />

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-8 py-4 bg-teal-600 hover:bg-teal-700
                           text-white font-semibold rounded-lg flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Joining...
                  </>
                ) : (
                  <>Join Waitlist →</>
                )}
              </motion.button>
            </form>

            {isSubmitted && (
              <div className="mt-6 flex items-center justify-center gap-2 text-green-400">
                <CheckCircle2 size={18} />
                You’re on the list!
              </div>
            )}

            {error && (
              <div className="mt-6 flex items-center justify-center gap-2 text-red-400">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <p className="text-xs text-white/50 mt-6">
              🔒 We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================= STATS ================= */

function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { value: "2B+", label: "Muslims Worldwide" },
    { value: "5", label: "Daily Prayers" },
    { value: "∞", label: "Blessings" },
    { value: "1", label: "Ummah United" },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-center text-white">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: index * 0.2 }}
        >
          <div className="text-4xl sm:text-5xl font-bold mb-2">
            {stat.value}
          </div>
          <div className="text-white/70 text-sm sm:text-base">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
