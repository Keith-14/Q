"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowRight, Plus, Minus } from "lucide-react";
import ctaBanner from "@assets/image_1777288131096.png";

const values = [
  {
    title: "Community First",
    description: "Building a strong, supportive global Muslim community.",
  },
  {
    title: "Transparency",
    description: "Open and honest communication with our users and partners.",
  },
  {
    title: "Innovation",
    description: "Continuous improvement to serve the Ummah better.",
  },
  {
    title: "Privacy & Security",
    description: "Protecting your data with enterprise-grade encryption.",
  },
  {
    title: "Excellence",
    description: "Delivering the highest quality experience in everything we do.",
  },
  {
    title: "Global Impact",
    description:
      "Creating positive change across Muslim communities worldwide.",
  },
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
    q: "Is my data secure?",
    a: "Yes. We use enterprise-grade encryption and privacy-first design principles.",
  },
];

export default function About() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [emailCta, setEmailCta] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsSubmitted] = useState(false);
  const [, setError] = useState("");

  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, []);

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
      setEmailCta("");
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailCta) submitEmail(emailCta);
  };

  return (
    <div className="min-h-screen bg-[#fdeed7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        {/* HEADER */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="font-jakarta font-bold text-4xl sm:text-5xl lg:text-6xl">
            <span className="text-[#3a1f10]">About </span>
            <span className="text-[#7a3a1c]">BARAKAH</span>
          </h1>
          <p className="mt-3 text-[#7a6a5a] text-sm sm:text-base">
            Built by Muslims, for Muslims.
          </p>
        </div>

        {/* MISSION & VISION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-20 sm:mb-24">
          {[
            {
              title: "Our Mission",
              body: "To create a unified digital space where Muslims can connect with their faith, community, and daily practices.",
            },
            {
              title: "Our Vision",
              body: "A world where every Muslim has access to comprehensive tools for spiritual development and community engagement.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-[#ffe8ca] border border-[#e8d5c4] p-8 sm:p-10"
            >
              <h2 className="font-jakarta font-bold text-[#3a1f10] text-xl sm:text-2xl mb-3">
                {card.title}
              </h2>
              <p className="text-[#7a6a5a] text-sm sm:text-base leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* CORE VALUES */}
        <div className="text-center mb-12">
          <h2 className="font-jakarta font-bold text-[#3a1f10] text-3xl sm:text-4xl">
            Our Core <span className="text-[#7a8a3a]">Values</span>
          </h2>
          <p className="mt-3 text-[#7a6a5a] text-sm sm:text-base">
            Built on principles that guide every decision we make.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-20 sm:mb-24">
          {values.map((value, idx) => (
            <div
              key={value.title}
              className="rounded-2xl bg-[#ffe8ca] border border-[#e8d5c4] p-6 sm:p-7"
            >
              <div className="w-9 h-9 rounded-full bg-[#7a8a3a] text-white flex items-center justify-center font-jakarta font-bold text-sm mb-5">
                {idx + 1}
              </div>
              <h3 className="font-jakarta font-bold text-[#3a1f10] text-lg mb-2">
                {value.title}
              </h3>
              <p className="text-[#7a6a5a] text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="text-center mb-10">
          <h2 className="font-jakarta font-bold text-[#3a1f10] text-3xl sm:text-4xl">
            Frequently Asked{" "}
            <span className="text-[#7a8a3a]">Questions</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-xl bg-[#ffe8ca] border border-[#e8d5c4] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left"
                >
                  <span className="font-jakarta font-semibold text-[#3a1f10] text-sm sm:text-base">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <Minus
                      size={18}
                      className="shrink-0 text-[#7a6a5a]"
                    />
                  ) : (
                    <Plus
                      size={18}
                      className="shrink-0 text-[#7a6a5a]"
                    />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 text-[#7a6a5a] text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div id="waitlist" className="mt-20 sm:mt-24 scroll-mt-24 max-w-5xl mx-auto">
          <div className="relative rounded-[40px] overflow-hidden bg-[#fdeed7] flex flex-col items-center justify-center py-12 sm:py-16 lg:py-24">
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
      </div>
    </div>
  );
}
