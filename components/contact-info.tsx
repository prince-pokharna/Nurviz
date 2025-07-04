"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BUSINESS_CONFIG } from "@/lib/constants"

export function ContactInfo() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
        <Card className="premium-card h-full">
          <CardContent className="p-6">
            <h3 className="text-xl font-display font-bold mb-6">Get in Touch</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600 text-sm">{BUSINESS_CONFIG.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a href={`tel:${BUSINESS_CONFIG.phone}`} className="text-amber-600 hover:underline text-sm">
                    {BUSINESS_CONFIG.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href={`mailto:${BUSINESS_CONFIG.email}`} className="text-amber-600 hover:underline text-sm">
                    {BUSINESS_CONFIG.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Instagram className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-medium">Instagram</p>
                  <a
                    href={BUSINESS_CONFIG.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:underline text-sm"
                  >
                    @{BUSINESS_CONFIG.instagram}
                  </a>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-6 luxury-gradient text-white"
              onClick={() => window.open(BUSINESS_CONFIG.social.instagram, "_blank")}
            >
              <Instagram className="w-4 h-4 mr-2" />
              Follow Us on Instagram
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="premium-card h-full">
          <CardContent className="p-6">
            <h3 className="text-xl font-display font-bold mb-6 flex items-center">
              <Clock className="w-5 h-5 text-amber-600 mr-2" />
              Business Hours
            </h3>

            <div className="space-y-3">
              {Object.entries(BUSINESS_CONFIG.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="font-medium capitalize">{day}</span>
                  <span className="text-gray-600 text-sm">{hours}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> We're available for WhatsApp inquiries 24/7. Feel free to message us anytime!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
