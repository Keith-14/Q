'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function Home() {
  /* ================= STATE ================= */
  const [email, setEmail] = useState('');
  const [emailCta, setEmailCta] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /* ================= HANDLE HASH SCROLL ================= */
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  /* ================= SUBMIT (logic unchanged) ================= */
  const submitEmail = async (value: string) => {
    setError('');
    setIsLoading(true);

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const waitlistSupabaseUrl = import.meta.env.VITE_WAITLIST_SUPABASE_URL;
      const waitlistSupabaseKey = import.meta.env.VITE_WAITLIST_SUPABASE_ANON_KEY;

      if (!waitlistSupabaseUrl || !waitlistSupabaseKey || waitlistSupabaseKey === "YOUR_WAITLIST_ANON_KEY_HERE") {
        throw new Error('Waitlist database not configured. Please add the anon key to your .env file.');
      }

      const waitlistSupabase = createClient(waitlistSupabaseUrl, waitlistSupabaseKey);

      const { error: supabaseError } = await waitlistSupabase
        .from('waitlist')
        .insert([{ email: value }]);

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          throw new Error('This email is already on the waitlist.');
        }
        throw new Error(supabaseError.message);
      }

      setIsSubmitted(true);
      setEmail('');
      setEmailCta('');
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setTimeout(() => setError(''), 5000);
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
      <section className="relative pt-[120px] pb-16">
        {/* Crowd silhouette backdrop */}
        <div
          className="absolute inset-x-0 bottom-0 h-[70%] opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 100%, rgba(120,80,40,0.5), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[55%] opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200' preserveAspectRatio='none'><g fill='%23824a25'><circle cx='40' cy='180' r='14'/><circle cx='80' cy='180' r='14'/><circle cx='120' cy='180' r='14'/><circle cx='160' cy='180' r='14'/><circle cx='200' cy='180' r='14'/><circle cx='240' cy='180' r='14'/><circle cx='280' cy='180' r='14'/><circle cx='320' cy='180' r='14'/><circle cx='360' cy='180' r='14'/><circle cx='400' cy='180' r='14'/><circle cx='440' cy='180' r='14'/><circle cx='480' cy='180' r='14'/><circle cx='520' cy='180' r='14'/><circle cx='560' cy='180' r='14'/><circle cx='600' cy='180' r='14'/><circle cx='640' cy='180' r='14'/><circle cx='680' cy='180' r='14'/><circle cx='720' cy='180' r='14'/><circle cx='760' cy='180' r='14'/><circle cx='800' cy='180' r='14'/><circle cx='840' cy='180' r='14'/><circle cx='880' cy='180' r='14'/><circle cx='920' cy='180' r='14'/><circle cx='960' cy='180' r='14'/><circle cx='1000' cy='180' r='14'/><circle cx='1040' cy='180' r='14'/><circle cx='1080' cy='180' r='14'/><circle cx='1120' cy='180' r='14'/><circle cx='1160' cy='180' r='14'/><rect x='28' y='180' width='24' height='40'/><rect x='68' y='180' width='24' height='40'/><rect x='108' y='180' width='24' height='40'/><rect x='148' y='180' width='24' height='40'/><rect x='188' y='180' width='24' height='40'/><rect x='228' y='180' width='24' height='40'/><rect x='268' y='180' width='24' height='40'/><rect x='308' y='180' width='24' height='40'/><rect x='348' y='180' width='24' height='40'/><rect x='388' y='180' width='24' height='40'/><rect x='428' y='180' width='24' height='40'/><rect x='468' y='180' width='24' height='40'/><rect x='508' y='180' width='24' height='40'/><rect x='548' y='180' width='24' height='40'/><rect x='588' y='180' width='24' height='40'/><rect x='628' y='180' width='24' height='40'/><rect x='668' y='180' width='24' height='40'/><rect x='708' y='180' width='24' height='40'/><rect x='748' y='180' width='24' height='40'/><rect x='788' y='180' width='24' height='40'/><rect x='828' y='180' width='24' height='40'/><rect x='868' y='180' width='24' height='40'/><rect x='908' y='180' width='24' height='40'/><rect x='948' y='180' width='24' height='40'/><rect x='988' y='180' width='24' height='40'/><rect x='1028' y='180' width='24' height='40'/><rect x='1068' y='180' width='24' height='40'/><rect x='1108' y='180' width='24' height='40'/><rect x='1148' y='180' width='24' height='40'/></g></svg>\")",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "bottom",
            backgroundSize: "auto 100%",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
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
                <span className="font-semibold text-[#3a2a1f]">10+ users</span>{' '}
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

          {/* RIGHT - Phone with mosque arch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative flex justify-center items-center min-h-[500px]"
          >
            <MosquePhoneScene />
          </motion.div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-[#b74628] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">
            The numbers behind
            <br />
            our purpose.
          </h2>
          <Stats />
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
              background:
                "linear-gradient(180deg, #f4d8a8 0%, #ecc88a 100%)",
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
                Be the First to{' '}
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

/* ================= STATS ================= */
function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { value: "2B+", label: "Muslim", sub: "World Wide" },
    { value: "5", label: "Daily", sub: "Prayers" },
    { value: "1", label: "Ummah", sub: "United" },
  ];

  return (
    <div ref={ref} className="grid grid-cols-3 gap-6 text-center text-white">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.15 }}
        >
          <div className="text-4xl sm:text-5xl font-semibold mb-2">
            {stat.value}
          </div>
          <div className="text-white/85 text-xs sm:text-sm leading-tight">
            <div>{stat.label}</div>
            <div>{stat.sub}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ================= MOSQUE + PHONE SCENE ================= */
function MosquePhoneScene() {
  return (
    <div className="relative w-full max-w-[460px] aspect-[3/4]">
      {/* Mosque arch background */}
      <svg
        viewBox="0 0 400 540"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="archGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d8a06a" />
            <stop offset="100%" stopColor="#b87a48" />
          </linearGradient>
          <linearGradient id="archGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c89060" />
            <stop offset="100%" stopColor="#a86838" />
          </linearGradient>
        </defs>

        {/* Outer arch */}
        <path
          d="M200,30
             C 130,30 80,90 80,170
             L 80,500
             L 320,500
             L 320,170
             C 320,90 270,30 200,30 Z"
          fill="url(#archGrad)"
          opacity="0.55"
        />
        {/* Inner arch */}
        <path
          d="M200,70
             C 145,70 105,118 105,180
             L 105,490
             L 295,490
             L 295,180
             C 295,118 255,70 200,70 Z"
          fill="url(#archGrad2)"
          opacity="0.7"
        />
        {/* Top finial */}
        <circle cx="200" cy="20" r="8" fill="#b87a48" opacity="0.7" />
        <rect x="197" y="20" width="6" height="14" fill="#b87a48" opacity="0.7" />

        {/* Pattern lines on arch */}
        <g stroke="#8a5828" strokeWidth="1" opacity="0.35" fill="none">
          <path d="M180,90 Q200,80 220,90" />
          <path d="M170,110 Q200,95 230,110" />
          <path d="M160,130 Q200,110 240,130" />
        </g>
      </svg>

      {/* Side card LEFT */}
      <div
        className="absolute left-[-2%] top-[28%] w-[36%] aspect-[9/16] rounded-[22px] bg-gradient-to-br from-[#f8e1b8] to-[#e8c688] shadow-2xl rotate-[-12deg] border-[3px] border-white flex items-center justify-center"
      >
        <span className="text-[#b74628] text-3xl font-bold italic">B</span>
      </div>

      {/* Side card RIGHT */}
      <div
        className="absolute right-[-2%] top-[32%] w-[36%] aspect-[9/16] rounded-[22px] bg-gradient-to-br from-[#f8e1b8] to-[#e8c688] shadow-2xl rotate-[12deg] border-[3px] border-white flex items-center justify-center"
      >
        <span className="text-[#b74628] text-3xl font-bold italic">B</span>
      </div>

      {/* Center phone */}
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-[12%] -translate-x-1/2 w-[52%] aspect-[9/19] rounded-[32px] bg-[#1a1a1a] shadow-2xl border-[3px] border-[#2a2a2a] overflow-hidden"
      >
        <PhoneScreen />
      </motion.div>
    </div>
  );
}

function PhoneScreen() {
  return (
    <div className="absolute inset-[3px] rounded-[28px] overflow-hidden bg-[#f6e7c8] flex flex-col">
      {/* Status bar */}
      <div className="h-5 bg-[#b74628] flex items-center justify-between px-3">
        <span className="text-white text-[8px] font-semibold">Barakah</span>
        <span className="text-white text-[7px]">●●●</span>
      </div>

      {/* Prayer card */}
      <div className="bg-[#b74628] px-3 pb-3 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-semibold">Maghrib</p>
            <p className="text-[6px] opacity-80">Mecca, Saudi Arabia</p>
          </div>
          <div className="text-right">
            <p className="text-[14px] font-bold leading-none">7:00<span className="text-[8px]">PM</span></p>
            <p className="text-[6px] opacity-80">in 2h 14m</p>
          </div>
        </div>

        {/* Prayer pills */}
        <div className="mt-2 bg-white/15 rounded-full p-1 flex gap-1">
          {['Fajr', 'Dhuhr', 'Asr', 'Magh.', 'Isha'].map((p, i) => (
            <div
              key={p}
              className={`flex-1 text-center text-[6px] py-1 rounded-full ${
                i === 3 ? 'bg-[#f6c878] text-[#3a2a1f] font-semibold' : ''
              }`}
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* News section */}
      <div className="flex-1 bg-white p-2">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] font-semibold text-[#3a2a1f]">News</p>
          <span className="text-[#b74628] text-[8px]">⌕</span>
        </div>
        <div className="rounded-md overflow-hidden bg-gradient-to-br from-[#3a4a2a] to-[#1a2a1a] aspect-[16/9] relative">
          <div className="absolute inset-0 opacity-60"
               style={{
                 backgroundImage: 'linear-gradient(135deg, #6a8a4a 0%, #2a3a1a 100%)',
               }}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= PALM TREE ================= */
function PalmTree({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 160"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
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
