'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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
          autoresponse: {
            subject: 'Welcome to BARAKAH 🌙',
            message: `
Assalamu Alaikum 🌙

Thank you for joining BARAKAH!

We’re building a complete Muslim lifestyle companion bringing together prayer, halal services, community, and learning.

May Allah put barakah in your journey 🤍
— Team BARAKAH
            `,
          },
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

      {/* HERO SECTION */}
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
                <span className="text-orange-700 font-medium text-sm">Coming Soon</span>
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900">
              One Ummah, <span className="text-teal-600">One App</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-slate-600 max-w-xl">
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
                Confirmation email sent successfully!
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle size={20} />
                {error}
              </div>
            )}
          </motion.div>

          {/* RIGHT */}
          <PhoneMockup />
        </div>
      </motion.div>

{/* EVERYTHING YOU NEED */}
<section className="bg-[#ffeaba] py-20">
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: {},
      visible: {
        transition: { staggerChildren: 0.15 },
      },
    }}
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  >
    {/* Header */}
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl sm:text-5xl font-bold text-[#34453a] mb-4">
        Everything You Need
      </h2>
      <p className="text-lg text-[#5f5a4f] max-w-2xl mx-auto">
        BARAKAH brings together the essential tools for your daily Muslim life.
      </p>
    </motion.div>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
  {
    emoji: "🛒",
    title: "Store",
    desc: "Shop for halal products, Islamic books, prayer essentials, and trusted Muslim brands in one place.",
  },
  {
    emoji: "🗣️",
    title: "Guftagu",
    desc: "A safe social space for Muslims to share thoughts, ideas, and discussions — like Twitter, but for the Ummah.",
  },
  {
    emoji: "📍",
    title: "Nearby Halal Places",
    desc: "Find halal restaurants, mosques, and Muslim-friendly places around you with ease.",
  },
  {
    emoji: "📱",
    title: "Halal Scanner",
    desc: "Scan food labels and product ingredients to instantly check halal compliance, powered by AI for deeper insights and explanations.",
  },
].map((item) => (
  <motion.div
    key={item.title}
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    }}
    whileHover={{ y: -8 }}
    className="p-8 rounded-2xl bg-gradient-to-b from-[#34453a] to-[#161d17]
               text-white shadow-lg shadow-black/30 border border-white/10
               transition-transform"
  >
    <div className="w-14 h-14 mb-6 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
      {item.emoji}
    </div>

    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
    <p className="text-white/70 leading-relaxed text-sm">
      {item.desc}
    </p>
  </motion.div>
))}

    </div>
  </motion.div>
</section>


      {/* STATS SECTION */}
      <section className="py-20 bg-gradient-to-b from-[#34453a] to-[#161d17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Stats />
        </div>
      </section>

      {/* ISLAMIC VERSE SECTION */}
<section className="bg-[#ffeaba] py-24">
  <div className="max-w-3xl mx-auto px-4 text-center">

    {/* Icon */}
<div className="flex justify-center mb-6 text-3xl">
  ☪️
</div>


    {/* Verse */}
    <blockquote className="text-2xl sm:text-3xl font-medium text-[#34453a] leading-relaxed mb-6">
      “The believers are but brothers, so make settlement
      between your brothers.”
    </blockquote>

    {/* Reference */}
    <p className="text-[#5f5a4f] italic">
      — Surah Al-Hujurat 49:10
    </p>

  </div>
</section>


    </div>
  );
}

/* ================= STATS COMPONENT ================= */

function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { value: "1.8B+", label: "Muslims Worldwide" },
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
