"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Crown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Exquisite Jewelry Collection",
      subtitle: "Anti-Tarnish Imitation Jewelry for Modern Influencers",
      description: "Discover our handcrafted pieces that blend traditional artistry with contemporary design",
      image: "/placeholder.svg?height=600&width=800",
      cta: "Shop Collection",
      link: "/collections",
    },
    {
      title: "Trending Designs",
      subtitle: "Perfect for Content Creation & Photoshoots",
      description: "Jewelry that maintains its shine and beauty, ideal for influencers and content creators",
      image: "/placeholder.svg?height=600&width=800",
      cta: "Explore Trends",
      link: "/collections?category=trending",
    },
    {
      title: "Luxury Redefined",
      subtitle: "Premium Quality at Affordable Prices",
      description: "Experience the elegance of fine jewelry without compromising on quality or budget",
      image: "/placeholder.svg?height=600&width=800",
      cta: "Discover Luxury",
      link: "/collections?category=luxury",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden luxury-bg">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f4a855' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-luxury-400"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          <Sparkles className="h-8 w-8" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-gold-400"
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        >
          <Crown className="h-6 w-6" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 text-rose-400"
          animate={{ y: [-5, 15, -5] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
        >
          <Star className="h-7 w-7" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-luxury-100 text-luxury-700 text-sm font-medium"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {slides[currentSlide].subtitle}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text font-serif leading-tight"
              >
                {slides[currentSlide].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-luxury-700 leading-relaxed max-w-lg"
              >
                {slides[currentSlide].description}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href={slides[currentSlide].link}>
                <Button
                  size="lg"
                  className="luxury-gradient text-white hover:shadow-xl transition-all duration-300 group"
                >
                  {slides[currentSlide].cta}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-luxury-400 text-luxury-700 hover:bg-luxury-50"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-luxury-200"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-luxury-800">15+</div>
                <div className="text-sm text-luxury-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-luxury-800">10K+</div>
                <div className="text-sm text-luxury-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-luxury-800">500+</div>
                <div className="text-sm text-luxury-600">Unique Designs</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            key={`image-${currentSlide}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src={slides[currentSlide].image || "/placeholder.svg"}
                alt={slides[currentSlide].title}
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-900/20 to-transparent rounded-2xl" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 luxury-gradient rounded-full opacity-20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 gold-gradient rounded-full opacity-20 blur-xl" />
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-12 space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "luxury-gradient scale-125" : "bg-luxury-300 hover:bg-luxury-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
