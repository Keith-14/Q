import React from 'react';
import { motion } from 'framer-motion';

export default function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ y: -10 }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className="relative hidden lg:flex justify-center"
    >
      {/* Glow */}
      <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full" />

      {/* Phone Frame */}
      <div className="relative w-[280px] h-[560px] rounded-[40px] bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600 p-[10px] shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
        
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-full z-20" />

        {/* Screen */}
        <div className="relative w-full h-full rounded-[30px] bg-[#2d4a44] overflow-hidden">
          
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-3 pb-2 z-10">
            <button className="text-white/80">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="text-white/80">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>

          {/* Header with Tasbih */}
          <div className="pt-14 px-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/60 text-xs mb-1">As-Salaam-Alaikum,</p>
                <h1 className="text-white text-3xl font-bold mb-1">Barakah Home</h1>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Thane, India</span>
                </div>
                <p className="text-white/60 text-xs mt-0.5">Thu, Sha'ban 11, 1447 AH</p>
              </div>
              <div className="text-emerald-300">
                <svg className="w-12 h-12 opacity-60" fill="currentColor" viewBox="0 0 100 100">
                  <circle cx="50" cy="20" r="8" />
                  {[...Array(32)].map((_, i) => (
                    <circle 
                      key={i} 
                      cx={50 + 30 * Math.cos((i * Math.PI * 2) / 33 - Math.PI / 2)} 
                      cy={50 + 30 * Math.sin((i * Math.PI * 2) / 33 - Math.PI / 2)} 
                      r="2" 
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Prayer Card */}
            <div className="bg-[#1a2e2a] rounded-2xl p-4 mb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-emerald-400 text-xs uppercase tracking-wider mb-1">Next Prayer</p>
                  <h2 className="text-emerald-400 text-2xl font-bold">Isha</h2>
                  <p className="text-white/60 text-sm">Next prayer at 23:00</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <div className="text-right">
                    <div className="text-emerald-400 text-xl font-bold tabular-nums">22:34:28</div>
                  </div>
                </div>
              </div>

              {/* Prayer Timeline */}
              <div className="relative pt-4">
                <div className="flex justify-between items-end mb-2 relative">
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800" />
                  <div className="absolute bottom-0 left-0 h-0.5 bg-emerald-400" style={{ width: '85%' }} />
                  
                  {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer, idx) => (
                    <div key={prayer} className="relative z-10 flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mb-1 ${
                        idx < 4 ? 'bg-emerald-400' : 'bg-emerald-400 ring-4 ring-emerald-400/30 w-4 h-4'
                      }`} />
                      <span className={`text-xs ${
                        idx === 4 ? 'text-emerald-400 font-semibold' : 'text-white/60'
                      }`}>{prayer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: '❤️', label: 'MAKKAH LIVE' },
                { icon: '📊', label: 'MOOD' },
                { icon: '📖', label: 'QURAN' },
                { icon: '🧭', label: 'QIBLA' }
              ].map((item, idx) => (
                <button 
                  key={idx}
                  className="bg-[#1a2e2a]/60 backdrop-blur rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-[#1a2e2a] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg border border-emerald-700/30 flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  <span className="text-emerald-400 text-[9px] font-semibold uppercase tracking-wide">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#1a2e2a]/90 backdrop-blur border-t border-emerald-900/30">
            <div className="flex justify-around items-center px-6 py-3 relative">
              {[
                { icon: '🏠', label: 'Home', active: true },
                { icon: '🛍️', label: 'Store' },
                { icon: '👥', label: 'Guftagu', center: true },
                { icon: '📍', label: 'Places' },
                { icon: '👤', label: 'Account' }
              ].map((item, idx) => (
                <button 
                  key={idx}
                  className={`flex flex-col items-center gap-1 ${
                    item.center ? 'absolute left-1/2 -translate-x-1/2 -top-6' : ''
                  }`}
                >
                  {item.center ? (
                    <div className="w-14 h-14 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-[#1a2e2a]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                  ) : (
                    <>
                      <span className="text-xl">{item.icon}</span>
                      <span className={`text-[9px] ${
                        item.active ? 'text-emerald-400' : 'text-white/60'
                      }`}>{item.label}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}