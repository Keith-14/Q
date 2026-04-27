import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Facebook, Mail, Linkedin } from "lucide-react";
import logo from "@assets/image_1777286071491.png";
import footerBg from "@assets/image_1777287972017.png";

const footerLinks = {
  navigation: [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, url: "https://instagram.com/barakahh.app" },
  { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/company/getbarakah/about/" },
  { name: "Email", icon: Mail, url: "mailto:info@barakah.services" },
  { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/share/19Y3vkop3x/?mibextid=wwXIfr" },
];

export const Footer = () => {
  return (
    <footer
      className="text-[#f0d9a8] bg-[#2a190d] bg-cover bg-center"
      style={{ backgroundImage: `url(${footerBg})` }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 max-w-sm">
            <Link to="/" className="inline-flex items-center mb-4" aria-label="Barakah home">
              <img
                src={logo}
                alt="Barakah"
                className="h-8 w-auto select-none brightness-0 invert opacity-90"
                draggable={false}
              />
            </Link>
            <p className="text-[13px] leading-relaxed text-[#f0d9a8]/85">
              Your everyday companion for faithful life that gives you a
              <br />
              righteous feeling.
            </p>
            <p className="text-[13px] leading-relaxed text-[#f0d9a8]/85 mt-3">
              Carry your faith everywhere. Carry Barakah.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-[#f0d9a8]"
                  aria-label={social.name}
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-[15px] mb-4 text-[#f0d9a8]">
              Navigate
            </h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[13px] text-[#f0d9a8]/75 hover:text-[#f0d9a8] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App Store Links */}
          <div>
            <h4 className="font-semibold text-[15px] mb-4 text-[#f0d9a8]">
              Coming Soon
            </h4>
            <div className="flex flex-col gap-3">
              {/* App Store */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/5 border border-white/5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-[#f0d9a8]">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
                <div className="leading-tight">
                  <p className="text-[9px] text-[#f0d9a8]/70">Download on the</p>
                  <p className="text-[13px] font-semibold">App Store</p>
                </div>
              </div>

              {/* Play Store */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/5 border border-white/5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-[#f0d9a8]">
                  <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" />
                </svg>
                <div className="leading-tight">
                  <p className="text-[9px] text-[#f0d9a8]/70">Get it on</p>
                  <p className="text-[13px] font-semibold">Google Play</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[12px] text-[#f0d9a8]/70">
            © 2026 BARAKAH. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[12px] text-[#f0d9a8]/70 hover:text-[#f0d9a8] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
