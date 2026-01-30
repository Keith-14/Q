import { motion } from "framer-motion";
import appScreenshot from "@/assets/app.jpeg";

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
      className="relative hidden lg:flex justify-center"
    >
      {/* Soft Glow */}
      <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full" />

      {/* Phone Frame */}
      <div className="relative w-[280px] h-[560px] rounded-[42px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 p-[10px] shadow-[0_45px_90px_rgba(0,0,0,0.4)]">
        
        {/* Screen */}
        <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-black">
          
          {/* App Screenshot */}
          <img
            src={appScreenshot}
            alt="Barakah app preview"
            className="w-full h-full object-cover"
          />

        </div>
      </div>
    </motion.div>
  );
}
