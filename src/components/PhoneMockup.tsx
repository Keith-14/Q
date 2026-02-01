import { motion } from "framer-motion";
import phoneMockup from "@/assets/phone_mockup.png";

export default function PhoneMockup() {
  return (
    <motion.div
      animate={{ y: -12 }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className="relative flex justify-center"
    >
      {/* Glow */}
      <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full" />

      {/* Phone Image */}
      <img
        src={phoneMockup}
        alt="Barakah app preview"
        className="relative w-[600px] h-auto drop-shadow-[0_45px_90px_rgba(0,0,0,0.4)]"
      />
    </motion.div>
  );
}
