"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import heroBg from "@assets/hero-bg_1777242380832.png";
import statsBar from "@assets/image_1777244421919.png";
import ctaBanner from "@assets/image_1777287361116.png";

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
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="font-jakarta italic font-bold text-[26px] sm:text-[36px] leading-[1.35] text-[#3a1f10]">
            <span>&ldquo;The believers are but </span>
            <span className="text-[#7a8a3a]">brothers</span>
            <span>, so make</span>
            <br />
            <span>settlement between your brothers.&rdquo;</span>
          </blockquote>
          <p className="mt-8 font-cormorant not-italic text-[#5a4a3c] text-xl sm:text-2xl">
            — Surah Al-Hujurat 49:10
          </p>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section id="waitlist" className="bg-[#f6e7c8] pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative">
            <img
              src={ctaBanner}
              alt="Be the first to experience Barakah. Join our exclusive waitlist and be notified when we launch."
              className="block w-full h-auto rounded-[28px] select-none"
              draggable={false}
            />

            {/* Working form overlaid on top of the form drawn into the banner */}
            <form
              onSubmit={handleCtaSubmit}
              className="absolute left-[12%] right-[12%] top-[56%] -translate-y-1/2 flex items-center bg-white rounded-full p-[0.9%] shadow-md"
            >
              <input
                type="email"
                required
                value={emailCta}
                onChange={(e) => setEmailCta(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-3 sm:px-5 py-2 sm:py-3 bg-transparent text-[#3a2a1f] placeholder:text-[#a89a86] text-[11px] sm:text-sm focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-3 sm:px-6 py-2 sm:py-3 bg-[#7a3a1c] hover:bg-[#6a3018] text-white text-[11px] sm:text-sm font-medium rounded-full flex items-center gap-1 sm:gap-1.5 transition-colors whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={12} />
                    Joining
                  </>
                ) : (
                  <>
                    Join Waitlist <ArrowRight size={12} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
