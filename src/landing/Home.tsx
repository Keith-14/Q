"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import heroBg from "@assets/hero-bg_1777242380832.png";
import statsBar from "@assets/image_1777244421919.png";
import ctaBanner from "@assets/image_1777288131096.png";

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
              Unlock purposeful living with an all-in-one ecosystem for Muslims.
              <br />
               Get personalized AI guidance, community support, and reliable resources for worship, travel, and daily habits, turning sincerity into everyday barakah.
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
          <div className="relative rounded-[40px] overflow-hidden bg-[#f6e7c8] flex flex-col items-center justify-center py-12 sm:py-16 lg:py-24">
            <img
              src={ctaBanner}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-bottom select-none"
              draggable={false}
            />

            {/* Text + form overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full">
              <h3 className="font-jakarta font-bold text-[#3a1f10] text-[22px] sm:text-3xl lg:text-4xl leading-tight">
                Be the First to{" "}
                <span className="text-[#7a8a3a]">Experience</span>
                <br className="sm:hidden" />
                <span className="inline-block mt-1 sm:mt-0"> BARAKAH</span>
              </h3>
              <p className="mt-3 text-[#5a4a3c] text-sm lg:text-base max-w-md mx-auto">
                Join our exclusive waitlist and be notified when we launch.
              </p>

              <form
                onSubmit={handleCtaSubmit}
                className="mt-6 w-full max-w-md flex items-center bg-white rounded-full p-1 sm:p-1.5 shadow-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={emailCta}
                  onChange={(e) => setEmailCta(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 px-4 py-2 sm:py-2 bg-transparent text-[#3a2a1f] placeholder:text-[#a89a86] text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-[#7a3a1c] hover:bg-[#6a3018] text-white text-sm font-semibold rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap"
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

              <p className="mt-4 text-xs text-[#7a6a5a]">
                🔒 We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
