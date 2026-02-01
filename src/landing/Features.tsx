import { motion } from 'framer-motion';
import { Zap, Users, Heart, Book, MapPin, Shield, TrendingUp, Bell } from 'lucide-react';

const features = [
  { icon: Bell, title: 'Prayer Times & Alerts', description: 'Accurate prayer times for your location with customizable alerts and reminders.' },
  { icon: Zap, title: 'Prayer Tracking', description: 'Monitor your daily prayers and build consistent spiritual habits with progress tracking.' },
  { icon: Users, title: 'Community Connection', description: 'Connect with Muslims worldwide, share experiences, and build meaningful relationships.' },
  { icon: Heart, title: 'Halal Finder', description: 'Discover halal restaurants, certified products, and trusted services near you.' },
  { icon: Book, title: 'Islamic Learning', description: 'Access comprehensive Quran, Hadith collections, and structured Islamic education.' },
  { icon: MapPin, title: 'Qibla Direction', description: 'Precise Qibla direction with real-time compass guidance for prayer anywhere.' },
  { icon: TrendingUp, title: 'Progress Analytics', description: 'Visual insights into your spiritual journey with detailed progress statistics.' },
  { icon: Shield, title: 'Privacy First', description: 'Your data is encrypted and protected with enterprise-grade security standards.' },
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-[#ffeaba]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Powerful Features for Your
            <span className="text-teal-700"> Spiritual Journey</span>
          </h1>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto">
            Everything you need to enhance your Muslim lifestyle, from daily prayers to community connection.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group p-8 rounded-2xl bg-[#f7d7ac] border-2 border-[#e6c48f] hover:shadow-xl transition"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 rounded-xl bg-[#ffeaba] flex items-center justify-center mb-6 group-hover:shadow-md transition"
                >
                  <Icon className="w-8 h-8 text-teal-700" />
                </motion.div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <p className="text-slate-700 mb-8 text-lg">
            Ready to transform your spiritual life?
          </p>
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition"
          >
            Join the Waitlist
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
