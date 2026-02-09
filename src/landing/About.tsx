import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Lightbulb, ChevronDown } from "lucide-react";

const values = [
  { icon: "💚", title: "Community First", description: "Building a strong, supportive global Muslim community." },
  { icon: Eye, title: "Transparency", description: "Open and honest communication with our users and partners." },
  { icon: Lightbulb, title: "Innovation", description: "Continuous improvement to serve the Ummah better." },
  { icon: "🔒", title: "Privacy & Security", description: "Protecting your data with enterprise-grade encryption." },
  { icon: "✨", title: "Excellence", description: "Delivering the highest quality experience in everything we do." },
  { icon: "🌍", title: "Global Impact", description: "Creating positive change across Muslim communities worldwide." },
];

const faqs = [
  {
    q: "When will BARAKAH be available?",
    a: "We are currently targeting an initial launch in early 2026. Join the waitlist to stay updated.",
  },
  {
    q: "Will BARAKAH be free to use?",
    a: "Yes. BARAKAH will be free to use with optional premium features for advanced tools.",
  },
  {
    q: "Which platforms will BARAKAH support?",
    a: "BARAKAH will be available on iOS, Android, and the web.",
  },
  {
    q: "How are prayer times calculated?",
    a: "Prayer times are calculated using globally accepted calculation methods with location-based accuracy.",
  },
  {
    q: "How can I contribute or provide feedback?",
    a: "You can reach out via the Contact page or social media. Community feedback is highly valued.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use enterprise-grade encryption and privacy-first design principles.",
  },
];

export default function About() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
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
        {/* HERO */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <span className="text-2xl">💚</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-[#34453a] mb-6">
            About <span className="text-teal-700">BARAKAH</span>
          </h1>

          <p className="text-xl text-[#5f5a4f] max-w-3xl mx-auto">
            Built by Muslims, for Muslims.
          </p>
        </motion.div>

        {/* MISSION & VISION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {["Our Mission", "Our Vision"].map((title, idx) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="p-10 rounded-2xl bg-gradient-to-b from-[#34453a] to-[#161d17]
                         text-white shadow-lg shadow-black/30 border border-white/10"
            >
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                {idx === 0
                  ? "To create a unified digital space where Muslims can connect with their faith, community, and daily practices."
                  : "A world where every Muslim has access to comprehensive tools for spiritual development and community engagement."}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CORE VALUES */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#34453a] mb-4">Our Core Values</h2>
          <p className="text-[#5f5a4f] text-lg">
            Built on principles that guide every decision we make.
          </p>
        </motion.div>

        {/* VALUES GRID */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl bg-gradient-to-b from-[#34453a] to-[#161d17]
                         text-white shadow-lg shadow-black/30 border border-white/10"
            >
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                {typeof value.icon === "string" ? (
                  <span className="text-2xl">{value.icon}</span>
                ) : (
                  <value.icon className="w-7 h-7 text-teal-400" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-white/70 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* STORY */}
        <motion.div
          variants={itemVariants}
          className="p-12 rounded-2xl bg-gradient-to-b from-[#34453a] to-[#161d17]
                     text-white shadow-lg shadow-black/30 border border-white/10 mb-24"
        >
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-4">
            BARAKAH was born from a simple idea: Muslims deserve better tools to support their spiritual journey.
          </p>
          <p className="text-white/80 text-lg leading-relaxed">
            Every feature is guided by our commitment to serve the Ummah with integrity and excellence.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <p className="uppercase tracking-widest text-teal-700 text-sm mb-2">FAQ</p>
          <h2 className="text-4xl font-bold text-[#34453a]">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={faq.q}
              whileHover={{ y: -2 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-[#34453a] to-[#161d17]
                         text-white shadow-lg shadow-black/30 border border-white/10 cursor-pointer"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{faq.q}</h3>
                <ChevronDown
                  className={`transition-transform ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </div>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/70 mt-4 leading-relaxed"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center mt-24">
          <p className="text-[#5f5a4f] mb-8 text-lg">
            Join us in this meaningful journey.
          </p>
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-teal-700 hover:bg-teal-800
                       text-white font-semibold rounded-lg transition"
          >
            Become Part of BARAKAH
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
