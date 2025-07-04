"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set a timeout to hide the loading screen after 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    // Clean up the timeout if the component unmounts
    return () => clearTimeout(timer)
  }, [])

  // If not loading, don't render anything
  if (!isLoading) return null

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="text-center space-y-8">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg mx-auto"
                style={{
                  background: `linear-gradient(135deg, #B4AFA7 0%, #9E8E80 50%, #8A8786 100%)`,
                }}
              >
                <span className="text-white font-bold text-2xl font-serif">N</span>
              </div>
              <div
                className="absolute inset-0 w-20 h-20 rounded-full opacity-30 blur-lg animate-pulse mx-auto"
                style={{
                  background: `linear-gradient(135deg, #B4AFA7 0%, #9E8E80 50%, #8A8786 100%)`,
                }}
              ></div>
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-4xl font-bold font-serif" style={{ color: "#9E8E80" }}>
                Nurvi Jewel
              </h1>
              <p className="mt-2 font-medium" style={{ color: "#8A8786" }}>
                Exquisite Jewelry Collection
              </p>
            </motion.div>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center space-x-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  style={{ backgroundColor: "#9E8E80" }}
                  className="w-3 h-3 rounded-full"
                  animate={{
                    y: [-5, 0, -5],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="w-64 mx-auto"
            >
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  style={{
                    background: `linear-gradient(to right, #B4AFA7 0%, #9E8E80 50%, #8A8786 100%)`,
                  }}
                  className="h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
