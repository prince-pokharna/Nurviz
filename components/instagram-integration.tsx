"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Instagram, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getInstagramFeed, INSTAGRAM_CONFIG } from "@/lib/instagram"

export function InstagramIntegration() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const instagramPosts = await getInstagramFeed()
        setPosts(instagramPosts.slice(0, 6)) // Show only 6 posts
      } catch (error) {
        console.error("Error fetching Instagram posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto mobile-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold gradient-text mb-4">Follow Us on Instagram</h2>
            <div className="loading-shimmer h-4 w-48 mx-auto rounded" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="loading-shimmer aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto mobile-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-4">Follow Us on Instagram</h2>
          <p className="text-gray-600 mb-6">Stay updated with our latest collections and behind-the-scenes content</p>
          <Button
            className="luxury-gradient text-white hover:scale-105 transition-transform"
            onClick={() => window.open(INSTAGRAM_CONFIG.profileUrl, "_blank")}
          >
            <Instagram className="w-5 h-5 mr-2" />@{INSTAGRAM_CONFIG.username}
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer"
              onClick={() => window.open(post.permalink, "_blank")}
            >
              <Card className="overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={post.media_url || "/placeholder.svg"}
                    alt={post.caption?.substring(0, 50) || "Instagram post"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white"
            onClick={() => window.open(INSTAGRAM_CONFIG.profileUrl, "_blank")}
          >
            View More on Instagram
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
