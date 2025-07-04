"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const timelineEvents = [
  {
    year: "2009",
    title: "The Beginning",
    description: "Nurvi Jewel was founded with a vision to create affordable luxury jewelry for young women.",
    milestone: "Founded",
  },
  {
    year: "2012",
    title: "Anti-Tarnish Innovation",
    description: "Introduced revolutionary anti-tarnish coating technology, ensuring lasting beauty.",
    milestone: "Innovation",
  },
  {
    year: "2015",
    title: "Digital Expansion",
    description: "Launched online platform, reaching customers across India.",
    milestone: "Growth",
  },
  {
    year: "2018",
    title: "Influencer Partnerships",
    description: "Partnered with top fashion influencers, becoming the go-to brand for content creators.",
    milestone: "Partnership",
  },
  {
    year: "2020",
    title: "Sustainable Practices",
    description: "Implemented eco-friendly packaging and sustainable manufacturing processes.",
    milestone: "Sustainability",
  },
  {
    year: "2022",
    title: "Virtual Try-On",
    description: "Launched AR-powered virtual try-on technology for enhanced shopping experience.",
    milestone: "Technology",
  },
  {
    year: "2024",
    title: "15 Years of Excellence",
    description: "Celebrating 15 years of crafting beautiful, affordable jewelry for modern women.",
    milestone: "Milestone",
  },
]

export function HeritageTimeline() {
  return (
    <section className="section-padding bg-gradient-to-br from-amber-50 to-yellow-50">
      <div className="container mx-auto mobile-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">Our Heritage</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            15 years of crafting beautiful, affordable jewelry that empowers young women to express their unique style.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-luxury-gradient hidden md:block" />

          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`timeline-item ${index % 2 === 0 ? "md:pr-8" : "md:pl-16"}`}
              >
                <Card className="premium-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-display font-bold text-amber-600 mb-2">{event.year}</h3>
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h4>
                      </div>
                      <Badge variant="secondary" className="luxury-gradient text-white">
                        {event.milestone}
                      </Badge>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
