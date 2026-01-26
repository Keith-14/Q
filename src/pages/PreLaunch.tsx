import { Button } from "@/components/ui/button";
import {
  Home,
  ShoppingBag,
  Users,
  MapPin,
  User,
  Heart,
  BarChart,
  BookOpen,
  Compass
} from "lucide-react";


export default function PreLaunch() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f0e] via-[#0f1a17] to-[#0b0f0e] text-white">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-6">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="w-9 h-9 rounded-full bg-[#2F4A3C] flex items-center justify-center text-black font-extrabold">
             <img
                    src="/favicon.ico"
                    alt="Barakah Logo"
                    className="w-5 h-5 object-contain"
                />
          </div>
          Barakah
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-14 text-lg text-gray-300">
          <a className="hover:text-white cursor-pointer">Features</a>
          <a className="hover:text-white cursor-pointer">About</a>
          <a className="hover:text-white cursor-pointer">Download</a>
          <a className="hover:text-white cursor-pointer">Pricing</a>
          <a className="hover:text-white cursor-pointer">Contact</a>
        </div>

        {/* CTA */}
        <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full px-6">
          Get Started
        </Button>
      </nav>

      {/* HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-8 lg:px-20 py-20 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Your Spiritual <br /> Companion
          </h1>

          <p className="text-gray-300 max-w-xl mb-8 leading-relaxed">
            Track your spiritual progress, get AI-powered guidance,
            and connect with a supportive community on your journey
            towards spiritual growth and recovery.
          </p>

          <div className="flex gap-4">
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl px-8 py-6">
              Download Now
            </Button>

            <Button
              variant="outline"
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded-xl px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* RIGHT MOCKUPS */}
        <div className="relative flex justify-center gap-6">
          {/* Phone 1 */}
          {/* Phone 1 – Splash Screen */}
            <div className="w-[240px] h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-[#2F4A3C] via-[#22382E] to-[#141E19] flex flex-col items-center justify-center text-center px-4">
            
            {/* Logo with glow */}
                <div className="mb-6 group relative w-24 mx-auto">
                {/* Glow layer */}
                <div
                    className="
                    absolute inset-0 rounded-full
                    bg-[#8FAE9A]
                    blur-xl
                    opacity-0
                    transition-all duration-300 ease-out
                    group-hover:opacity-40
                    group-hover:scale-125
                    "
                />

                {/* Logo */}
                <img
                    src="/favicon.ico"
                    alt="Barakah Logo"
                    className="
                    relative z-10
                    w-24 h-auto max-h-24 mx-auto
                    transition-transform duration-300 ease-out
                    group-hover:scale-110
                    "
                />
                </div>

            {/* App Name */}
            <h2 className="text-[#F5E6CC] text-2xl font-serif tracking-widest mb-2">
                BARAKAH
            </h2>

            {/* Tagline */}
            <p className="text-[#D6CBB5] text-[10px] tracking-[0.3em]">
                FAITH · LIFESTYLE · COMMUNITY
            </p>

            {/* Dots indicator */}
            <div className="flex gap-2 mt-10">
                <span className="w-2 h-2 rounded-full bg-[#8FAE9A]" />
                <span className="w-2 h-2 rounded-full bg-[#6F8F7B] opacity-60" />
                <span className="w-2 h-2 rounded-full bg-[#6F8F7B] opacity-40" />
            </div>
            </div>



          {/* Phone 2 */}
         {/* Phone 2 – Home UI (Refined) */}
<div className="w-[240px] h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-[#2F4A3C] via-[#1A2A23] to-[#0E1512] text-[#EAF5EF] relative">

  {/* Header */}
  <div className="px-4 pt-4">
    <p className="text-[9px] opacity-70">As-Salaam-Alaikum</p>
    <h2 className="text-lg font-semibold mt-1">Barakah Home</h2>
    <p className="opacity-60 text-[8px] mt-1">
      Thane, India · Mon, Shaban 8
    </p>
  </div>

  {/* Next Prayer Card */}
  <div className="mx-3 mt-4 rounded-2xl relative overflow-hidden">
    {/* Glow */}
    <div className="absolute inset-0 bg-green-400/20 blur-xl" />

    <div className="relative bg-black/60 border border-green-400/30 p-3 rounded-2xl">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-green-400 uppercase text-[8px] tracking-widest">
            Next Prayer
          </p>
          <p className="text-green-300 text-base font-semibold mt-1">
            Asr
          </p>
          <p className="opacity-60 text-[8px]">
            Next prayer at 18:00
          </p>
        </div>

        <div className="text-green-400 text-lg font-mono">
          17:18
        </div>
      </div>

{/* Subtle curved prayer progress */}
<div className="relative mt-4 h-8">
  <svg
    viewBox="0 0 100 30"
    className="w-full h-full"
    preserveAspectRatio="none"
  >
    {/* Slightly increased curve */}
    <path
      d="M 5 20 Q 50 2 95 20"
      fill="none"
      stroke="rgba(34,197,94,0.35)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Dot EXACTLY on the curve (t = 0.5) */}
    <circle
      cx="50"
      cy="12"
      r="3.2"
      fill="#22c55e"
    />
  </svg>
</div>


      <div className="flex justify-between text-[8px] opacity-60 mt-1 px-1">
        <span>Fajr</span>
        <span>Dhuhr</span>
        <span className="text-green-400">Asr</span>
        <span>Maghrib</span>
        <span>Isha</span>
      </div>
    </div>
  </div>

{/* Feature Tiles */}
<div className="grid grid-cols-2 gap-3 px-3 mt-4">
  {[
    { label: "Makkah Live", icon: Heart },
    { label: "Mood", icon: BarChart },
    { label: "Quran", icon: BookOpen },
    { label: "Qibla", icon: Compass }
  ].map(({ label, icon: Icon }) => (
    <div
      key={label}
      className="relative rounded-2xl bg-black/50 border border-green-400/25 p-3 flex flex-col items-center gap-2"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-green-400/10 blur-lg" />

      {/* Icon */}
      <div className="relative w-9 h-9 rounded-xl bg-green-400/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-green-400" />
      </div>

      {/* Label */}
      <span className="relative text-[8px] opacity-80">
        {label}
      </span>
    </div>
  ))}
</div>

{/* Bottom Navigation */}
<div className="absolute bottom-3 left-3 right-3 h-14 rounded-2xl bg-black/60 backdrop-blur-md border border-green-400/30 flex items-center justify-between px-4">
  
  <Home className="w-4 h-4 opacity-60" />
  <ShoppingBag className="w-4 h-4 opacity-60" />

  {/* Center highlight */}
  <div className="w-11 h-11 rounded-full bg-green-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.8)]">
    <Users className="w-5 h-5 text-black" />
  </div>

  <MapPin className="w-4 h-4 opacity-60" />
  <User className="w-4 h-4 opacity-60" />
</div>
</div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm py-8">
        © {new Date().getFullYear()} Barakah. All rights reserved.
      </footer>
    </div>
  );
}
