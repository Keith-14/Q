import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import emojiImg from "@/assets/emoji.png";

const features = [
  {
    icon: <span className="text-3xl">🕌</span>,
    title: "Prayer Times & Qibla",
    description:
      "Accurate prayer times based on your location with alerts, reminders, and precise Qibla direction anywhere in the world.",
  },
  {
    icon: <span className="text-3xl">⚡</span>,
    title: "Prayer Tracking",
    description:
      "Monitor your daily prayers and build consistent spiritual habits with progress tracking.",
  },
  {
    icon: <span className="text-3xl">👥</span>,
    title: "Community Connection",
    description:
      "Connect with Muslims worldwide, share experiences, and build meaningful relationships.",
  },
  {
    icon: <span className="text-3xl">❤️</span>,
    title: "Halal Finder",
    description:
      "Discover halal restaurants, certified products, and trusted services near you.",
  },
  {
    icon: <span className="text-3xl">📖</span>,
    title: "Islamic Learning",
    description:
      "Access Quran, Hadith collections, and structured Islamic education resources.",
  },
  {
    icon: (
      <img
        src={emojiImg}
        alt="Mood Analytics"
        className="w-8 h-8 object-contain"
      />
    ),
    title: "Mood Analytics",
    description:
      "Visual insights into your spiritual journey with detailed Mood Analytics",
  },
  {
    icon: <span className="text-3xl">🛒</span>,
    title: "Islamic Ecommerce",
    description:
      "Shop for halal products, Islamic books, prayer essentials, and more from trusted sellers.",
  },
  {
    icon: <span className="text-3xl">🤖</span>,
    title: "AI Islamic Assistant",
    description:
      "Ask questions about Islam, prayer guidance, and daily practices with an AI-powered chatbot.",
  },
  {
    icon: <span className="text-3xl">🧮</span>,
    title: "Zakat Calculator",
    description:
      "Easily calculate your Zakat accurately based on Islamic guidelines and current values.",
  },
  {
    icon: <span className="text-3xl">🕋</span>,
    title: "Hajj & Umrah Packages",
    description:
      "Explore trusted Hajj and Umrah travel packages with guidance, planning, and support.",
  },
  {
    icon: <span className="text-3xl">📰</span>,
    title: "Muslim News",
    description:
      "Stay updated with trusted global and local news relevant to the Muslim Ummah.",
  },
  {
    icon: <span className="text-3xl">📱</span>,
    title: "Halal Scanner",
    description:
      "Scan food labels and product ingredients to instantly verify halal compliance with AI-powered insights.",
  },
];

export default function Features() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToWaitlist = () => {
    const el = document.getElementById("waitlist");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById("waitlist");
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
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
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <span className="text-2xl">✨</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-[#34453a] mb-6">
            Powerful Features for Your
            <span className="text-teal-700"> Spiritual Journey</span>
          </h1>

          <p className="text-xl text-[#5f5a4f] max-w-2xl mx-auto">
            Everything you need to enhance your Muslim lifestyle — worship,
            learning, commerce, and travel ✨
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group p-8 rounded-2xl bg-gradient-to-b from-[#34453a] to-[#161d17] text-white shadow-lg shadow-black/30 border border-white/10 transition"
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.4 }}
                className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-6"
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <p className="text-[#5f5a4f] mb-8 text-lg">
            Ready to transform your spiritual life?
          </p>
          <motion.button
            onClick={scrollToWaitlist}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition cursor-pointer"
          >
            Join the Waitlist
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
