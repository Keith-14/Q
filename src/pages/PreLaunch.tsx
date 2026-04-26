import { motion } from "framer-motion";

export default function PreLaunch() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[140px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-2xl"
        >
          {/* Brand */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-[Reem_Kufi] text-4xl sm:text-5xl md:text-6xl tracking-wide"
          >
            Barakah
          </motion.h1>

          {/* Divider */}
          <div className="mx-auto my-6 h-px w-24 bg-emerald-500/40" />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="font-[Amiri] text-lg sm:text-xl text-white/80 leading-relaxed"
          >
            A complete Islamic lifestyle experience —
            <br className="hidden sm:block" />
            prayer, growth, community, and purpose.
          </motion.p>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="mt-10 text-sm tracking-widest uppercase text-emerald-400/70"
          >
            Launching Soon
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 h-32 w-full bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
