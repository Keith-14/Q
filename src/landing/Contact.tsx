"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";
import contactBanner from "@assets/image_1777295962056.png";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdeed7]">
      {/* HERO BANNER */}
      <section className="w-full">
        <img
          src={contactBanner}
          alt="Get in Touch - Have a question or feedback? We'd love to hear from you"
          className="block w-full h-auto select-none"
          draggable={false}
        />
      </section>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT — FORM */}
          <div className="rounded-2xl bg-[#ffe8ca] border border-[#e8d5c4] p-6 sm:p-8">
            <h2 className="font-jakarta font-bold text-[#3a1f10] text-2xl mb-6">
              Send us a message
            </h2>

            {isSubmitted ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-14 h-14 text-[#7a8a3a] mx-auto mb-5" />
                <h3 className="font-jakarta font-bold text-[#3a1f10] text-xl mb-2">
                  Message Sent!
                </h3>
                <p className="text-[#7a6a5a] text-sm">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#3a1f10] mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-full bg-white text-[#3a1f10] placeholder:text-[#a89a86] text-sm border border-[#e8d5c4] focus:border-[#7a8a3a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#3a1f10] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 rounded-full bg-white text-[#3a1f10] placeholder:text-[#a89a86] text-sm border border-[#e8d5c4] focus:border-[#7a8a3a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#3a1f10] mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-2xl bg-white text-[#3a1f10] placeholder:text-[#a89a86] text-sm border border-[#e8d5c4] focus:border-[#7a8a3a] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#b74628] hover:bg-[#a23e22] text-white font-jakarta font-semibold text-sm sm:text-base rounded-full transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* RIGHT — OTHER WAYS */}
          <div>
            <h3 className="font-jakarta font-bold text-[#3a1f10] text-xl sm:text-2xl mb-5">
              Other ways to reach us
            </h3>

            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  value: "info@barakah.services",
                },
                {
                  icon: Phone,
                  title: "Phone",
                  value: "+44 07448371436",
                },
                {
                  icon: MapPin,
                  title: "Location",
                  value: "Serving Muslims Worldwide 🌍",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl bg-[#ffe8ca] border border-[#e8d5c4] p-5 flex gap-4 items-center"
                  >
                    <Icon className="w-5 h-5 text-[#b8923a] shrink-0" />
                    <div>
                      <p className="font-jakarta font-semibold text-[#3a1f10] text-sm">
                        {item.title}
                      </p>
                      <p className="text-[#7a6a5a] text-sm mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-xl bg-[#ffe8ca] border border-[#e8d5c4] p-5 text-center">
                <Clock className="w-5 h-5 text-[#b8923a] mx-auto mb-2" />
                <p className="font-jakarta font-semibold text-[#3a1f10] text-sm mb-1">
                  Response Time
                </p>
                <p className="text-[#7a6a5a] text-sm leading-relaxed">
                  We typically respond within 24–48 hours during business days.
                  For urgent matters, please reach out via social media.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
