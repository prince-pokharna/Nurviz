"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Instagram, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Store",
    details: ["123 Jewelry Street, Zaveri Bazaar", "Mumbai, Maharashtra 400002"],
    color: "from-luxury-500 to-luxury-600",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+91 98765 43210", "+91 87654 32109"],
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@nurvijewel.com", "support@nurvijewel.com"],
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon - Sat: 9:00 AM - 8:00 PM", "Sunday: 10:00 AM - 6:00 PM"],
    color: "from-purple-500 to-purple-600",
  },
]

export default function Contact() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text font-serif mb-6">Get in Touch</h2>
          <p className="text-xl text-luxury-700 max-w-3xl mx-auto leading-relaxed">
            Have questions about our jewelry or need assistance? We're here to help! Reach out to us through any of the
            channels below.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="premium-card p-6 space-y-4 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center`}
                  >
                    <info.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-900 mb-2">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-luxury-700">
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="premium-card p-8 space-y-6"
            >
              <h3 className="text-2xl font-semibold text-luxury-900">Follow Us</h3>
              <p className="text-luxury-700">
                Stay connected with us on social media for the latest updates, new arrivals, and styling tips.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-rose-300 text-rose-600 hover:bg-rose-50"
                  onClick={() => window.open("https://instagram.com/nurvijewel", "_blank")}
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => window.open("https://wa.me/919876543210", "_blank")}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form / CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Quick Actions */}
            <div className="premium-card p-8 space-y-6">
              <h3 className="text-2xl font-semibold text-luxury-900">Quick Actions</h3>

              <div className="space-y-4">
                <Link href="/contact" className="block">
                  <Button className="w-full luxury-gradient text-white justify-start h-14">
                    <Mail className="h-5 w-5 mr-3" />
                    Send us a Message
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 justify-start h-14"
                  onClick={() => window.open("https://wa.me/919876543210", "_blank")}
                >
                  <MessageCircle className="h-5 w-5 mr-3" />
                  WhatsApp Us
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 justify-start h-14"
                  onClick={() => window.open("tel:+919876543210", "_blank")}
                >
                  <Phone className="h-5 w-5 mr-3" />
                  Call Now
                </Button>
              </div>
            </div>

            {/* FAQ */}
            <div className="premium-card p-8 space-y-6">
              <h3 className="text-2xl font-semibold text-luxury-900">Frequently Asked</h3>

              <div className="space-y-4">
                <div className="border-b border-luxury-200 pb-4">
                  <h4 className="font-medium text-luxury-900 mb-2">Do you offer custom designs?</h4>
                  <p className="text-luxury-700 text-sm">
                    Yes! We create custom jewelry pieces. Contact us with your requirements.
                  </p>
                </div>

                <div className="border-b border-luxury-200 pb-4">
                  <h4 className="font-medium text-luxury-900 mb-2">What is your return policy?</h4>
                  <p className="text-luxury-700 text-sm">We offer a 7-day hassle-free return and exchange policy.</p>
                </div>

                <div>
                  <h4 className="font-medium text-luxury-900 mb-2">Do you ship internationally?</h4>
                  <p className="text-luxury-700 text-sm">
                    Currently, we ship within India. International shipping coming soon!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
