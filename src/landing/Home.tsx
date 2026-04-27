"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import heroBg from "@assets/hero-bg_1777242380832.png";
import statsBar from "@assets/image_1777244421919.png";

export default function Home() {
  /* ================= STATE ================= */
  const [email, setEmail] = useState("");
  const [emailCta, setEmailCta] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= HANDLE HASH SCROLL ================= */
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  /* ================= SUBMIT (logic unchanged) ================= */
  const submitEmail = async (value: string) => {
    setError("");
    setIsLoading(true);

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const waitlistSupabaseUrl = import.meta.env.VITE_WAITLIST_SUPABASE_URL;
      const waitlistSupabaseKey = import.meta.env
        .VITE_WAITLIST_SUPABASE_ANON_KEY;

      if (
        !waitlistSupabaseUrl ||
        !waitlistSupabaseKey ||
        waitlistSupabaseKey === "YOUR_WAITLIST_ANON_KEY_HERE"
      ) {
        throw new Error(
          "Waitlist database not configured. Please add the anon key to your .env file.",
        );
      }

      const waitlistSupabase = createClient(
        waitlistSupabaseUrl,
        waitlistSupabaseKey,
      );

      const { error: supabaseError } = await waitlistSupabase
        .from("waitlist")
        .insert([{ email: value }]);

      if (supabaseError) {
        if (supabaseError.code === "23505") {
          throw new Error("This email is already on the waitlist.");
        }
        throw new Error(supabaseError.message);
      }

      setIsSubmitted(true);
      setEmail("");
      setEmailCta("");
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEmail(email);
  };

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEmail(emailCta);
  };

  return (
    <div className="min-h-screen bg-[#f6e7c8] overflow-hidden">
      {/* ================= HERO ================= */}
      <section
        className="relative pt-[120px] pb-16 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[560px]">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-bold leading-[1.05] text-[#1a1a1a] tracking-tight">
              One Ummah,
              <br />
              <span className="text-[#b74628]">One App</span>
            </h1>

            <p className="mt-6 text-[15px] text-[#5a4a3c] max-w-md leading-relaxed">
              Unlock purposeful living with an all-in-one
              <br />
              unlock purposeful living with an all-
            </p>

            {/* Inline waitlist form */}
            <form
              onSubmit={handleHeroSubmit}
              className="mt-8 max-w-md flex items-center bg-white rounded-full p-1.5 shadow-sm border border-[#e6cfa2]"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-2 bg-transparent text-[#3a2a1f] placeholder:text-[#a89a86] text-sm focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-[#b74628] hover:bg-[#a23e22] text-white text-sm font-medium rounded-full flex items-center gap-1.5 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Joining
                  </>
                ) : (
                  <>Join Waitlist</>
                )}
              </button>
            </form>

            {/* Avatars + social proof */}
            <div className="mt-5 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3a2a1f] to-[#1a1a1a] border-2 border-[#f6e7c8]" />
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7a5a3a] to-[#3a2a1f] border-2 border-[#f6e7c8]" />
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#b74628] to-[#7a3a1a] border-2 border-[#f6e7c8]" />
              </div>
              <p className="text-xs text-[#5a4a3c]">
                <span className="font-semibold text-[#3a2a1f]">10+ users</span>{" "}
                have already joined
              </p>
            </div>

            {isSubmitted && (
              <div className="mt-4 flex items-center gap-2 text-emerald-700 text-sm">
                <CheckCircle2 size={16} />
                You're on the list!
              </div>
            )}
            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </motion.div>

          {/* RIGHT column intentionally empty — phone & mosque are part of background image */}
          <div aria-hidden="true" />
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative z-30 -mt-[40px] sm:-mt-[60px]">
        <div className="w-full">
          <img
            src={statsBar}
            alt="The numbers behind our purpose. 2B+ Muslims worldwide, 5 daily prayers, 1 Ummah United."
            className="block w-full h-auto"
          />
        </div>
      </section>

      {/* ================= QUOTE ================= */}
      <section className="bg-[#f6e7c8] py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <blockquote className="text-2xl sm:text-[28px] italic font-medium text-[#3a2a1f] leading-snug">
            <span className="text-[#3a2a1f]">"The believers are but </span>
            <span className="text-[#b74628]">brothers</span>
            <span className="text-[#3a2a1f]">, so make</span>
            <br />
            <span className="text-[#3a2a1f]">settlement between your </span>
            <span className="text-[#7a8a3a]">brothers.</span>
            <span className="text-[#3a2a1f]">"</span>
          </blockquote>
          <p className="mt-5 text-[#5a4a3c] text-sm">
            — Surah Al-Hujurat 49:10
          </p>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section id="waitlist" className="bg-[#f6e7c8] pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div
            className="relative rounded-[28px] overflow-hidden px-6 sm:px-10 pt-12 pb-20"
            style={{
              background: "linear-gradient(180deg, #f4d8a8 0%, #ecc88a 100%)",
            }}
          >
            {/* Subtle dot pattern */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(183,70,40,0.15) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />

            {/* Sand dune */}
            <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none">
              <svg
                viewBox="0 0 1000 120"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path
                  d="M0,120 L0,80 Q250,30 500,60 T1000,70 L1000,120 Z"
                  fill="#c8783a"
                />
                <path
                  d="M0,120 L0,100 Q300,70 600,90 T1000,95 L1000,120 Z"
                  fill="#b86628"
                />
              </svg>
            </div>

            {/* Palm trees */}
            <PalmTree className="absolute left-3 sm:left-6 bottom-6 w-16 sm:w-20 h-auto z-10" />
            <PalmTree
              className="absolute right-3 sm:right-6 bottom-6 w-16 sm:w-20 h-auto z-10"
              flip
            />

            {/* Content */}
            <div className="relative z-20 text-center">
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#3a2a1f]">
                Be the First to{" "}
                <span className="text-[#7a8a3a]">Experience</span> BARAKAH
              </h3>
              <p className="mt-3 text-sm text-[#5a4a3c]">
                Join our exclusive waitlist and be notified when we launch.
              </p>

              <form
                onSubmit={handleCtaSubmit}
                className="mt-7 mx-auto max-w-md flex items-center bg-white rounded-full p-1.5 shadow-sm border border-[#e6cfa2]"
              >
                <input
                  type="email"
                  required
                  value={emailCta}
                  onChange={(e) => setEmailCta(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-2 bg-transparent text-[#3a2a1f] placeholder:text-[#a89a86] text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-[#b74628] hover:bg-[#a23e22] text-white text-sm font-medium rounded-full flex items-center gap-1.5 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      Joining
                    </>
                  ) : (
                    <>
                      Join Waitlist <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-4 text-[11px] text-[#7a6a5a]">
                🔒 We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================= PALM TREE ================= */
function PalmTree({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 160"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      {/* Trunk */}
      <path
        d="M48,160 Q46,120 50,80 Q54,50 50,30"
        stroke="#6b3a1a"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Trunk segments */}
      {Array.from({ length: 6 }).map((_, i) => (
        <ellipse
          key={i}
          cx={49 + (i % 2 === 0 ? -1 : 1)}
          cy={140 - i * 18}
          rx="3"
          ry="1.5"
          fill="#5a2f15"
        />
      ))}
      {/* Leaves */}
      <g fill="#3d6b2c">
        <path d="M50,30 Q20,20 5,35 Q25,30 50,40 Z" />
        <path d="M50,30 Q80,20 95,35 Q75,30 50,40 Z" />
        <path d="M50,30 Q15,40 5,65 Q30,50 50,40 Z" />
        <path d="M50,30 Q85,40 95,65 Q70,50 50,40 Z" />
        <path d="M50,30 Q40,5 25,2 Q42,20 50,32 Z" />
        <path d="M50,30 Q60,5 75,2 Q58,20 50,32 Z" />
      </g>
      {/* Coconuts */}
      <circle cx="46" cy="34" r="2.5" fill="#5a2f15" />
      <circle cx="52" cy="36" r="2.5" fill="#5a2f15" />
    </svg>
  );
}
