import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-luxury-900 to-luxury-800 text-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 luxury-gradient rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-2xl font-bold font-serif text-cream-50">Nurvi Jewel</span>
            </div>
            <p className="text-cream-200 leading-relaxed">
              Crafting exquisite jewelry pieces that celebrate India's rich heritage while embracing contemporary
              elegance. Quality, beauty, and craftsmanship in every piece.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-cream-300 hover:text-luxury-400 transition-colors p-2 rounded-full hover:bg-luxury-700"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-cream-300 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-luxury-700"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-cream-300 hover:text-luxury-400 transition-colors p-2 rounded-full hover:bg-luxury-700"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-cream-300 hover:text-luxury-400 transition-colors p-2 rounded-full hover:bg-luxury-700"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cream-50">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-cream-300 hover:text-luxury-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-cream-300 hover:text-luxury-400 transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-cream-300 hover:text-luxury-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-cream-300 hover:text-luxury-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/virtual-try-on" className="text-cream-300 hover:text-luxury-400 transition-colors">
                  Virtual Try-On
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cream-50">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rings" className="text-cream-300 hover:text-luxury-400 transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/necklaces" className="text-cream-300 hover:text-luxury-400 transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/earrings" className="text-cream-300 hover:text-luxury-400 transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/bracelets" className="text-cream-300 hover:text-luxury-400 transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/anklets" className="text-cream-300 hover:text-luxury-400 transition-colors">
                  Anklets
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cream-50">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-luxury-400 mt-0.5 flex-shrink-0" />
                <div className="text-cream-300 text-sm">
                  123 Jewelry Street, Zaveri Bazaar
                  <br />
                  Mumbai, Maharashtra 400002
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-luxury-400 flex-shrink-0" />
                <span className="text-cream-300 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-luxury-400 flex-shrink-0" />
                <span className="text-cream-300 text-sm">info@nurvijewel.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-luxury-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-cream-400 text-sm">© 2024 Nurvi Jewel. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-cream-400 hover:text-luxury-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-cream-400 hover:text-luxury-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/shipping" className="text-cream-400 hover:text-luxury-400 text-sm transition-colors">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
