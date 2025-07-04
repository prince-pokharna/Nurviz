"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Fashion Influencer",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "Nurvi Jewel has been my go-to for all my content creation needs. The anti-tarnish quality is amazing - my jewelry still looks brand new after countless photoshoots!",
    instagram: "@priyasharma_style",
  },
  {
    id: 2,
    name: "Anita Gupta",
    role: "Content Creator",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "The quality and design of Nurvi Jewel pieces are outstanding. I've recommended them to all my friends. Perfect for everyday wear and special occasions.",
    instagram: "@anita_creates",
  },
  {
    id: 3,
    name: "Kavya Patel",
    role: "Lifestyle Blogger",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "I love how affordable yet elegant their jewelry is. The customer service is exceptional, and the packaging is so beautiful. Highly recommended!",
    instagram: "@kavya_lifestyle",
  },
  {
    id: 4,
    name: "Riya Singh",
    role: "Fashion Enthusiast",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "Nurvi Jewel understands what young women want. Their designs are trendy, quality is top-notch, and prices are very reasonable. Love shopping here!",
    instagram: "@riya_fashion",
  },
  {
    id: 5,
    name: "Meera Joshi",
    role: "Beauty Influencer",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "The anti-tarnish coating really works! I've been wearing their pieces for months and they still look as good as new. Perfect for my beauty content.",
    instagram: "@meera_beauty",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-20 luxury-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text font-serif mb-6">What Our Customers Say</h2>
          <p className="text-xl text-luxury-700 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our amazing customers and influencers have to say about their
            Nurvi Jewel experience.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="premium-card p-8 md:p-12 text-center"
          >
            {/* Quote Icon */}
            <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-8">
              <Quote className="h-8 w-8 text-white" />
            </div>

            {/* Rating */}
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-gold-500 fill-current" />
              ))}
            </div>

            {/* Content */}
            <blockquote className="text-xl md:text-2xl text-luxury-800 leading-relaxed mb-8 font-medium">
              "{testimonials[currentIndex].content}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-center space-x-4">
              <img
                src={testimonials[currentIndex].image || "/placeholder.svg"}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover border-4 border-luxury-200"
              />
              <div className="text-left">
                <div className="font-semibold text-luxury-900 text-lg">{testimonials[currentIndex].name}</div>
                <div className="text-luxury-600">{testimonials[currentIndex].role}</div>
                <div className="text-luxury-500 text-sm">{testimonials[currentIndex].instagram}</div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border-luxury-300 text-luxury-600 hover:bg-luxury-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border-luxury-300 text-luxury-600 hover:bg-luxury-50"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "luxury-gradient scale-125" : "bg-luxury-300 hover:bg-luxury-400"
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-luxury-800 mb-2">4.9/5</div>
            <div className="text-luxury-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-luxury-800 mb-2">10K+</div>
            <div className="text-luxury-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-luxury-800 mb-2">500+</div>
            <div className="text-luxury-600">5-Star Reviews</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
