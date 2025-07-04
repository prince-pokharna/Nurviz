"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Instagram, Heart, MessageCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock Instagram posts data
const instagramPosts = [
  {
    id: "1",
    image: "/placeholder.svg?height=300&width=300",
    caption: "Stunning kundan necklace perfect for your next photoshoot ✨ #NurviJewel #KundanJewelry",
    likes: 1234,
    comments: 89,
    url: "https://instagram.com/p/example1",
  },
  {
    id: "2",
    image: "/placeholder.svg?height=300&width=300",
    caption: "New arrival: Delicate pearl earrings that never go out of style 💎 #PearlEarrings #Timeless",
    likes: 987,
    comments: 56,
    url: "https://instagram.com/p/example2",
  },
  {
    id: "3",
    image: "/placeholder.svg?height=300&width=300",
    caption: "Behind the scenes: Crafting your favorite pieces with love ❤️ #Handmade #Craftsmanship",
    likes: 2156,
    comments: 134,
    url: "https://instagram.com/p/example3",
  },
  {
    id: "4",
    image: "/placeholder.svg?height=300&width=300",
    caption: "Stack them up! Mix and match our beautiful rings 💍 #StackableRings #MixAndMatch",
    likes: 1567,
    comments: 78,
    url: "https://instagram.com/p/example4",
  },
  {
    id: "5",
    image: "/placeholder.svg?height=300&width=300",
    caption: "Customer love! @priya_style looking gorgeous in our statement necklace 🌟",
    likes: 3421,
    comments: 201,
    url: "https://instagram.com/p/example5",
  },
  {
    id: "6",
    image: "/placeholder.svg?height=300&width=300",
    caption: "Anti-tarnish technology keeps your jewelry looking brand new ✨ #AntiTarnish #Quality",
    likes: 892,
    comments: 45,
    url: "https://instagram.com/p/example6",
  },
]

export default function InstagramFeed() {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)

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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-medium mb-4">
            <Instagram className="h-4 w-4 mr-2" />
            @nurvijewel
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text font-serif mb-6">Follow Our Journey</h2>
          <p className="text-xl text-luxury-700 max-w-3xl mx-auto leading-relaxed mb-8">
            Get inspired by our latest designs, customer stories, and behind-the-scenes moments. Join our community of
            jewelry lovers on Instagram.
          </p>
          <Button
            className="luxury-gradient text-white hover:shadow-xl transition-all duration-300"
            onClick={() => window.open("https://instagram.com/nurvijewel", "_blank")}
          >
            <Instagram className="h-5 w-5 mr-2" />
            Follow @nurvijewel
          </Button>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
              onClick={() => window.open(post.url, "_blank")}
            >
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt="Instagram post"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredPost === post.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="text-white text-center space-y-2">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">{post.comments}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-5 w-5 mx-auto" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 rounded-2xl luxury-bg border border-luxury-200">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-luxury-900 mb-2">Share Your Style</h3>
              <p className="text-luxury-700">
                Tag us @nurvijewel in your posts and get featured on our page! Use #NurviJewel to join our community.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="rose-gold-gradient text-white"
                onClick={() => window.open("https://instagram.com/nurvijewel", "_blank")}
              >
                <Instagram className="h-4 w-4 mr-2" />
                Follow Us
              </Button>
              <Button
                variant="outline"
                className="border-luxury-400 text-luxury-700 hover:bg-luxury-50"
                onClick={() => window.open("https://instagram.com/nurvijewel", "_blank")}
              >
                View All Posts
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
