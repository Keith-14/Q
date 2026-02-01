import { motion } from 'framer-motion';
import { Heart, Eye, Lightbulb } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Community First', description: 'Building a strong, supportive global Muslim community.' },
  { icon: Eye, title: 'Transparency', description: 'Open and honest communication with our users and partners.' },
  { icon: Lightbulb, title: 'Innovation', description: 'Continuous improvement to serve the Ummah better.' },
  { icon: '🔒', title: 'Privacy & Security', description: 'Protecting your data with enterprise-grade encryption.' },
  { icon: '✨', title: 'Excellence', description: 'Delivering the highest quality experience in everything we do.' },
  { icon: '🌍', title: 'Global Impact', description: 'Creating positive change across Muslim communities worldwide.' },
];

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-[#ffeaba]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        {/* Hero */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            About <span className="text-teal-700">BARAKAH</span>
          </h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto">
            A mission-driven platform dedicated to empowering Muslim communities through technology, spirituality, and meaningful connection.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <motion.div
            variants={itemVariants}
            className="p-10 rounded-2xl bg-[#f7d7ac] border-2 border-[#e6c48f] shadow-lg"
          >
            <h2 className="text-3xl font-bold text-teal-700 mb-4">Our Mission</h2>
            <p className="text-slate-800 text-lg leading-relaxed">
              To create a unified digital space where Muslims can connect with their faith, community, and daily practices.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-10 rounded-2xl bg-[#f7d7ac] border-2 border-[#e6c48f] shadow-lg"
          >
            <h2 className="text-3xl font-bold text-teal-700 mb-4">Our Vision</h2>
            <p className="text-slate-800 text-lg leading-relaxed">
              A world where every Muslim has access to comprehensive tools for spiritual development and community engagement.
            </p>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
          <p className="text-slate-700 text-lg">
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
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl bg-[#f7d7ac] border-2 border-[#e6c48f] hover:shadow-xl transition"
            >
              <div className="w-14 h-14 rounded-xl bg-[#ffeaba] flex items-center justify-center mb-6">
                {typeof value.icon === 'string' ? (
                  <span className="text-2xl">{value.icon}</span>
                ) : (
                  <value.icon className="w-7 h-7 text-teal-700" />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
              <p className="text-slate-700 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Story */}
        <motion.div
          variants={itemVariants}
          className="p-12 rounded-2xl bg-[#f7d7ac] border-2 border-[#e6c48f]"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
          <p className="text-slate-800 text-lg leading-relaxed mb-4">
            BARAKAH was born from a simple idea: Muslims deserve better tools to support their spiritual journey.
          </p>
          <p className="text-slate-800 text-lg leading-relaxed">
            Every feature is guided by our commitment to serve the Ummah with integrity and excellence.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center mt-24">
          <p className="text-slate-700 mb-8 text-lg">Join us in this meaningful journey.</p>
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition"
          >
            Become Part of BARAKAH
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
