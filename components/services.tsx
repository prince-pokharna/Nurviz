"use client"

import { motion } from "framer-motion"
import { Truck, RotateCcw, Shield, Headphones, Gift, Sparkles } from "lucide-react"

const services = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on orders above ₹2000 across India",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day hassle-free return and exchange policy",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout with multiple payment options",
    color: "from-luxury-500 to-luxury-600",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your queries",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Gift,
    title: "Gift Wrapping",
    description: "Complimentary elegant gift wrapping for special occasions",
    color: "from-rose-500 to-rose-600",
  },
  {
    icon: Sparkles,
    title: "Quality Assurance",
    description: "Premium anti-tarnish coating on all jewelry pieces",
    color: "from-gold-500 to-gold-600",
  },
]

export default function Services() {
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
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text font-serif mb-6">Why Choose Nurvi Jewel?</h2>
          <p className="text-xl text-luxury-700 max-w-3xl mx-auto leading-relaxed">
            We're committed to providing you with the best jewelry shopping experience, from purchase to delivery and
            beyond.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="premium-card p-8 text-center space-y-6 h-full hover:shadow-xl transition-all duration-300">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className="h-8 w-8 text-white" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-luxury-900 group-hover:text-luxury-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-luxury-700 leading-relaxed">{service.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
