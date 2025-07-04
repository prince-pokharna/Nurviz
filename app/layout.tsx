import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { AdminProvider } from "@/contexts/admin-context"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import Footer from "@/components/footer"
import LoadingScreen from "@/components/loading-screen"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Nurvi Jewel - Exquisite Handcrafted Jewelry",
  description:
    "Discover our collection of handcrafted jewelry featuring rings, necklaces, earrings, bracelets, and anklets. Each piece tells a story of elegance and craftsmanship.",
  keywords: "jewelry, handcrafted, rings, necklaces, earrings, bracelets, anklets, gold, silver, diamonds",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AdminProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <LoadingScreen />
                <Header />
                {children}
                <Footer />
                <Toaster />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </AdminProvider>
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
