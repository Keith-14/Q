import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@assets/image_1777286071491.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollToWaitlist = () => {
    const el = document.getElementById("waitlist");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (location.pathname !== "/") {
      window.location.href = "/#waitlist";
    }
  };

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      <div className="relative z-[60] bg-[#5e6b35] text-[#f5e7c5] text-[11px] tracking-[0.2em] uppercase font-medium py-2">
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f5e7c5]" />
          <span>We're Launching Soon</span>
        </div>
      </div>

      {/* HEADER */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-50 bg-[#fdeed7]"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center" aria-label="Barakah home">
            <img
              src={logo}
              alt="Barakah"
              className="h-9 sm:h-10 w-auto select-none"
              draggable={false}
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-[15px] transition-colors ${
                    active
                      ? "text-[#b74628] font-medium"
                      : "text-[#3a2a1f] hover:text-[#b74628]"
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#b74628] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA BUTTONS */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              className="px-5 py-2 rounded-full border border-[#b74628] text-[#b74628] text-sm font-medium hover:bg-[#b74628]/5 transition-colors"
            >
              Our Vision
            </button>
            <button
              type="button"
              onClick={scrollToWaitlist}
              className="px-5 py-2 rounded-full bg-[#b74628] hover:bg-[#a23e22] text-white text-sm font-medium transition-colors shadow-sm"
            >
              Join Waitlist
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 text-[#3a2a1f] hover:text-[#b74628] transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[96px] z-40 md:hidden px-4"
          >
            <div className="p-5 rounded-2xl bg-[#f6e7c8] shadow-xl border border-[#e6cfa2]">
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => {
                  const active = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block py-2 text-base ${
                        active ? "text-[#b74628] font-medium" : "text-[#3a2a1f]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <div className="flex flex-col gap-2 mt-3">
                  <button
                    type="button"
                    className="w-full px-5 py-2.5 rounded-full border border-[#b74628] text-[#b74628] text-sm font-medium"
                  >
                    Our Vision
                  </button>
                  <button
                    type="button"
                    onClick={scrollToWaitlist}
                    className="w-full px-5 py-2.5 rounded-full bg-[#b74628] text-white text-sm font-medium"
                  >
                    Join Waitlist
                  </button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
