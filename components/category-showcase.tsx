"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const categories = [
  {
    id: "rings",
    name: "Rings",
    description: "Statement pieces for every occasion",
    image: "/placeholder.svg?height=400&width=400",
    count: "150+ Designs",
    color: "from-slate-900 via-gray-900 to-black",
  },
  {
    id: "necklaces",
    name: "Necklaces",
    description: "Elegant chains and pendants",
    image: "/placeholder.svg?height=400&width=400",
    count: "200+ Designs",
    color: "from-purple-900 via-indigo-900 to-slate-900",
  },
  {
    id: "earrings",
    name: "Earrings",
    description: "From studs to chandeliers",
    image: "/placeholder.svg?height=400&width=400",
    count: "180+ Designs",
    color: "from-emerald-900 via-teal-900 to-cyan-900",
  },
  {
    id: "bracelets",
    name: "Bracelets",
    description: "Delicate to bold designs",
    image: "/placeholder.svg?height=400&width=400",
    count: "120+ Designs",
    color: "from-rose-900 via-pink-900 to-purple-900",
  },
  {
    id: "anklets",
    name: "Anklets",
    description: "Graceful ankle accessories",
    image: "/placeholder.svg?height=400&width=400",
    count: "80+ Designs",
    color: "from-amber-900 via-orange-900 to-red-900",
  },
]

export default function CategoryShowcase() {
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
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text font-serif mb-6">Shop by Category</h2>
          <p className="text-xl text-luxury-700 max-w-3xl mx-auto leading-relaxed">
            Explore our diverse collection of jewelry categories, each crafted with precision and designed to complement
            your unique style.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Category - Rings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 lg:col-span-1 lg:row-span-2"
          >
            <Link href="/collections?category=Rings" className="group block h-full">
              <div className="relative h-full min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden premium-card">
                <img
                  src={categories[0].image || "/placeholder.svg"}
                  alt={categories[0].name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${categories[0].color} opacity-80`} />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                      {categories[0].count}
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold font-serif">{categories[0].name}</h3>
                    <p className="text-lg opacity-90">{categories[0].description}</p>
                    <Button
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm group-hover:translate-x-1 transition-transform"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Other Categories */}
          {categories.slice(1).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
            >
              <Link href={`/collections?category=${category.name}`} className="group block">
                <div className="relative h-64 rounded-2xl overflow-hidden premium-card">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`} />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <div className="space-y-2">
                      <div className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                        {category.count}
                      </div>
                      <h3 className="text-xl font-bold font-serif">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-2xl luxury-bg border border-luxury-200">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-luxury-900 mb-2">Can't find what you're looking for?</h3>
              <p className="text-luxury-700">Browse our complete collection or contact us for custom designs.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/collections">
                <Button className="luxury-gradient text-white">View All Products</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-luxury-400 text-luxury-700 hover:bg-luxury-50">
                  Custom Design
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
