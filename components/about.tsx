"use client"

import { motion } from "framer-motion"
import { Award, Heart, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  {
    icon: Sparkles,
    title: "Anti-Tarnish Technology",
    description: "Our jewelry maintains its shine and beauty, perfect for content creators and daily wear.",
  },
  {
    icon: Award,
    title: "15+ Years Experience",
    description: "Decades of expertise in crafting beautiful, high-quality imitation jewelry.",
  },
  {
    icon: Heart,
    title: "Made for Influencers",
    description: "Designed specifically for young women, influencers, and content creators.",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "Premium materials and craftsmanship ensure lasting beauty and durability.",
  },
]

export default function About() {
  return (
    <section className="py-20 luxury-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-luxury-100 text-luxury-700 text-sm font-medium">
                <Heart className="h-4 w-4 mr-2" />
                About Nurvi Jewel
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold gradient-text font-serif leading-tight">
                Crafting Dreams into Reality
              </h2>

              <div className="space-y-4 text-lg text-luxury-700 leading-relaxed">
                <p>
                  Since 2009, Nurvi Jewel has been at the forefront of creating stunning anti-tarnish imitation jewelry
                  specifically designed for the modern woman, influencer, and content creator.
                </p>
                <p>
                  Our passion lies in blending traditional Indian craftsmanship with contemporary designs, ensuring
                  every piece tells a story of elegance, quality, and affordability.
                </p>
                <p>
                  We understand the needs of today's digital generation - jewelry that not only looks beautiful but
                  maintains its shine through countless photoshoots, videos, and everyday wear.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <Button size="lg" className="luxury-gradient text-white">
                  Our Story
                </Button>
              </Link>
              <Link href="/collections">
                <Button variant="outline" size="lg" className="border-luxury-400 text-luxury-700 hover:bg-luxury-50">
                  Shop Collection
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Nurvi Jewel Craftsmanship"
                className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-900/20 to-transparent rounded-2xl" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 luxury-gradient rounded-full opacity-20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 gold-gradient rounded-full opacity-20 blur-xl" />

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl border border-luxury-200"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-luxury-800">10K+</div>
                  <div className="text-sm text-luxury-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-luxury-800">500+</div>
                  <div className="text-sm text-luxury-600">Unique Designs</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 luxury-gradient rounded-2xl flex items-center justify-center mx-auto">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-luxury-900">{feature.title}</h3>
                <p className="text-luxury-700 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
