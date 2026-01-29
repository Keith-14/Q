import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Twitter, Youtube, Mail } from "lucide-react";
import barakahLogo from "@/assets/barakah-logo.png";


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
  { name: "Instagram", icon: Instagram, url: "https://instagram.com/barakahapp" },
  { name: "Twitter", icon: Twitter, url: "https://twitter.com/barakahapp" },
  { name: "YouTube", icon: Youtube, url: "https://youtube.com/@barakahapp" },
  { name: "Email", icon: Mail, url: "mailto:support@barakah.app" },
];

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="islamic-pattern w-full h-full" />
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <motion.div
  whileHover={{ rotate: 10 }}
  className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
>
  <img
    src={barakahLogo}
    alt="Barakah logo"
    className="w-6 h-6 object-contain"
  />
</motion.div>
              <span className="font-display font-bold text-2xl">BARAKAH</span>
            </Link>
            <p className="text-primary-foreground/80 max-w-md mb-6">
              One Ummah, One App. Your complete Muslim lifestyle companion for
              prayer times, community, halal services, and Islamic learning.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Navigate</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App Store Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Coming Soon</h4>
            <div className="flex flex-col gap-3">
              {/* App Store Icon */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-foreground/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
                <div>
                  <p className="text-xs opacity-60">Download on the</p>
                  <p className="font-semibold">App Store</p>
                </div>
              </div>

              {/* Play Store Icon */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-foreground/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
                  <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z"/>
                </svg>
                <div>
                  <p className="text-xs opacity-60">Get it on</p>
                  <p className="font-semibold">Google Play</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2026 BARAKAH. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-accent via-secondary to-accent" />
    </footer>
  );
};
export default Footer;