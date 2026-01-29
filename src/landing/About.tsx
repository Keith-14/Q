import { motion } from 'framer-motion';
import { Heart, Eye, Lightbulb } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Community First',
    description: 'Building a strong, supportive global Muslim community.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'Open and honest communication with our users and partners.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Continuous improvement to serve the Ummah better.',
  },
  {
    icon: '🔒',
    title: 'Privacy & Security',
    description: 'Protecting your data with enterprise-grade encryption.',
  },
  {
    icon: '✨',
    title: 'Excellence',
    description: 'Delivering the highest quality experience in everything we do.',
  },
  {
    icon: '🌍',
    title: 'Global Impact',
    description: 'Creating positive change across Muslim communities worldwide.',
  },
];

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            About <span className="text-teal-600">BARAKAH</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            A mission-driven platform dedicated to empowering Muslim communities through technology, spirituality, and meaningful connection.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {/* Mission */}
          <motion.div
            variants={itemVariants}
            className="p-10 rounded-2xl bg-white border-2 border-teal-100 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-teal-600 mb-4">Our Mission</h2>
            <p className="text-slate-700 text-lg leading-relaxed">
              To create a unified digital space where Muslims can connect with their faith, community, and daily practices. We believe technology should enhance spiritual growth and strengthen the global Ummah through accessible, inclusive, and respectful platforms.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            variants={itemVariants}
            className="p-10 rounded-2xl bg-white border-2 border-purple-100 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-purple-600 mb-4">Our Vision</h2>
            <p className="text-slate-700 text-lg leading-relaxed">
              A world where every Muslim has access to comprehensive tools for spiritual development, community engagement, and halal services. We envision BARAKAH becoming the trusted companion in the lives of millions, fostering unity and positive change across the Islamic world.
            </p>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
          <p className="text-slate-600 text-lg">
            Built on principles that guide every decision we make.
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
        >
          {values.map((value) => {
            const Icon = typeof value.icon === 'string' ? null : value.icon;
            return (
              <motion.div
                key={value.title}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="p-8 rounded-2xl bg-white border-2 border-slate-100 hover:border-teal-300 hover:shadow-xl transition"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center mb-6">
                  {Icon ? (
                    <Icon className="w-7 h-7 text-teal-600" />
                  ) : typeof value.icon === 'string' ? (
                    <span className="text-2xl">{value.icon}</span>
                  ) : null}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Story Section */}
        <motion.div
          variants={itemVariants}
          className="p-12 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
          <p className="text-slate-700 text-lg leading-relaxed mb-4">
            BARAKAH was born from a simple idea: Muslims deserve better tools to support their spiritual journey and connect with their community. Our founders recognized a gap in the market for a comprehensive, culturally-sensitive platform that respects Islamic values while leveraging modern technology.
          </p>
          <p className="text-slate-700 text-lg leading-relaxed">
            Today, we're committed to building not just an app, but a movement that brings the global Muslim community closer together. Every feature, every design decision, and every update is guided by our unwavering commitment to serve the Ummah with integrity and excellence.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <p className="text-slate-600 mb-8 text-lg">Join us in this meaningful journey.</p>
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
          >
            Become Part of BARAKAH
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
