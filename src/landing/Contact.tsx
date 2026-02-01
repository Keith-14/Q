import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, CheckCircle2 } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "info@barakah.services",
    description: "We will respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 88791 33172",
    description: "Mon-Fri, 9AM-6PM IST",
  },
];

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
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={info.title}
                whileHover={{ y: -6 }}
                className="p-8 rounded-2xl bg-[#f7d7ac] shadow-md text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-[#ffeaba] flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-[#34453a] mb-2">
                  {info.title}
                </h3>
                <p className="text-teal-700 font-semibold mb-2">
                  {info.value}
                </p>
                <p className="text-[#6b665b] text-sm">
                  {info.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto p-12 rounded-2xl bg-[#f7d7ac] shadow-lg">
          <h2 className="text-3xl font-bold text-[#34453a] mb-8">
            Send Us a Message
          </h2>

          {isSubmitted ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-teal-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#34453a] mb-2">
                Message Sent!
              </h3>
              <p className="text-[#6b665b]">
                Thank you for reaching out. We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { label: "Full Name", name: "name", required: true },
                { label: "Email Address", name: "email", required: true },
                { label: "Subject", name: "subject", required: false },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-[#34453a] mb-2">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-3 rounded-lg bg-[#fff2d6] border border-[#e6cfa2] focus:border-teal-500 focus:outline-none transition"
                  />
                </div>
              ))}

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-[#34453a] mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-[#fff2d6] border border-[#e6cfa2] focus:border-teal-500 focus:outline-none transition resize-none"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
              >
                Send Message
              </motion.button>
            </form>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 p-12 rounded-2xl bg-[#f7d7ac] shadow-md">
          <h2 className="text-3xl font-bold text-[#34453a] mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "When will BARAKAH launch?",
                a: "We are targeting Q1 2026.",
              },
              {
                q: "Is BARAKAH free to use?",
                a: "Yes, with optional premium features.",
              },
              {
                q: "How is my data protected?",
                a: "We use enterprise-grade encryption.",
              },
              {
                q: "Can I suggest features?",
                a: "Absolutely! We value community feedback.",
              },
            ].map((faq) => (
              <motion.div
                key={faq.q}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl bg-[#ffeaba] border border-[#e6cfa2]"
              >
                <h3 className="font-bold text-[#34453a] mb-3">{faq.q}</h3>
                <p className="text-[#6b665b]">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
