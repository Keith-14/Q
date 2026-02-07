import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffeaba]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-[#34453a] mb-6">
            Get in <span className="text-teal-600">Touch</span>
          </h1>
          <p className="text-xl text-[#5f5a4f] max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you 💬
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — CONTACT FORM */}
          <div className="p-12 rounded-2xl bg-gradient-to-b from-[#34453a] to-[#161d17] text-white shadow-xl shadow-black/40 border border-white/10">
            <h2 className="text-3xl font-bold mb-8">
              Send us a message
            </h2>

            {isSubmitted ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-teal-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-2">
                  Message Sent!
                </h3>
                <p className="text-white/70">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg bg-[#fff2d6] text-[#34453a]
                               border border-[#e6cfa2] focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg bg-[#fff2d6] text-[#34453a]
                               border border-[#e6cfa2] focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-lg bg-[#fff2d6] text-[#34453a]
                               border border-[#e6cfa2] focus:border-teal-500 focus:outline-none resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700
                             text-white font-semibold rounded-lg transition"
                >
                  Send Message
                </motion.button>
              </form>
            )}
          </div>

          {/* RIGHT — OTHER WAYS */}
          <div className="space-y-6">

            <h3 className="text-2xl font-bold text-[#34453a] mb-4">
              Other ways to reach us
            </h3>

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
                  className="p-6 rounded-xl bg-gradient-to-b from-[#34453a] to-[#161d17]
                             text-white shadow-lg shadow-black/30 border border-white/10
                             flex gap-4 items-center"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon className="text-teal-400" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-white/70 text-sm">{item.value}</p>
                  </div>
                </div>
              );
            })}

            {/* RESPONSE TIME */}
            <div className="p-6 rounded-xl bg-gradient-to-b from-[#34453a] to-[#161d17]
                            text-white shadow-lg shadow-black/30 border border-white/10 text-center">
              <Clock className="mx-auto mb-3 text-teal-400" />
              <p className="font-semibold mb-1">
                Response Time
              </p>
              <p className="text-white/70 text-sm">
                We typically respond within 24–48 hours during business days.
                For urgent matters, please reach out via social media.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
