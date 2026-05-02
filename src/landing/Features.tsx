"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import emojiImg from "@/assets/emoji.png";
import ctaBanner from "@assets/image_1777288131096.png";

const features = [
  {
    icon: <span className="text-2xl">📰</span>,
    title: "Muslim News",
    description:
      "Stay updated with trusted global and local news relevant to the Muslim Ummah.",
  },
  {
    icon: <span className="text-2xl">🕌</span>,
    title: "Prayer Times & Qibla",
    description:
      "Accurate prayer times based on your location with alerts, reminders, and precise Qibla direction anywhere in the world.",
  },
  {
    icon: <span className="text-2xl">🛒</span>,
    title: "Islamic Ecommerce",
    description:
      "Shop for halal products, Islamic books, prayer essentials, and more from trusted sellers.",
  },
  {
    icon: <span className="text-2xl">🤖</span>,
    title: "AI Islamic Assistant",
    description:
      "Ask questions about Islam, prayer guidance, and daily practices with an AI-powered chatbot.",
  },
  {
    icon: <span className="text-2xl">⚡</span>,
    title: "Prayer Tracking",
    description:
      "Monitor your daily prayers and build consistent spiritual habits with progress tracking.",
  },
  {
    icon: <span className="text-2xl">❤️</span>,
    title: "Halal Finder",
    description:
      "Discover halal restaurants, certified products, and trusted services near you.",
  },
  {
    icon: <span className="text-2xl">📖</span>,
    title: "Islamic Learning",
    description:
      "Access Quran, Hadith collections, and structured Islamic education resources.",
  },
  {
    icon: (
      <img
        src={emojiImg}
        alt=""
        className="w-6 h-6 object-contain"
      />
    ),
    title: "Mood Analytics",
    description:
      "Visual insights into your spiritual journey with detailed Mood Analytics",
  },
  {
    icon: <span className="text-2xl">🧮</span>,
    title: "Zakat Calculator",
    description:
      "Easily calculate your Zakat accurately based on Islamic guidelines and current values.",
  },
  {
    icon: <span className="text-2xl">🕋</span>,
    title: "Hajj & Umrah Packages",
    description:
      "Explore trusted Hajj and Umrah travel packages with guidance, planning, and support.",
  },
  {
    icon: <span className="text-2xl">📱</span>,
    title: "Halal Scanner",
    description:
      "Scan food labels and product ingredients to instantly verify halal compliance with AI-powered insights.",
  },
  {
    icon: <span className="text-2xl">💬</span>,
    title: "Guftagu",
    description:
      "Chat with users in real time to get guidance, share insights, and stay connected within your spiritual journey.",
  },
];

export default function Features() {
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
        {/* Header */}
        <div className="text-center mb-14 sm:mb-16">
          <h1 className="font-jakarta font-bold text-[#3a1f10] text-4xl sm:text-5xl lg:text-[56px] leading-tight">
            Powerful Features for
            <br />
            <span className="text-[#b74628]">Your Spiritual Journey</span>
          </h1>

          <p className="mt-6 text-[#7a6a5a] text-base sm:text-lg max-w-2xl mx-auto">
            Everything you need to enhance your Muslim lifestyle — worship,
            learning, commerce, and travel ✨
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-[#ffe8ca] border border-[#e8d5c4] p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-md bg-[#fdeed7] flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="font-jakarta font-bold text-[#3a1f10] text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-[#7a6a5a] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
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
