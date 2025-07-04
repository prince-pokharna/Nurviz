"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ShoppingBag, Search, Heart, User, LogOut, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { CartDrawer } from "@/components/cart-drawer"
import { SearchDialog } from "@/components/search-dialog"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { state: cartState } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const { wishlistCount } = useWishlist()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleAuthClick = () => {
    if (isAuthenticated) {
      router.push("/account")
    } else {
      router.push("/auth")
    }
  }

  const handleInstagramClick = () => {
    window.open("https://instagram.com/nurvijewel", "_blank", "noopener,noreferrer")
  }

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-luxury-200"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 luxury-gradient rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 sparkle">
                  <span className="text-white font-bold text-lg font-serif">N</span>
                </div>
                <div className="absolute inset-0 w-12 h-12 luxury-gradient rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-all duration-300"></div>
              </div>
              <span className="text-3xl font-bold gradient-text font-serif">Nurvi Jewel</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {[
                { href: "/", label: "Home" },
                { href: "/collections", label: "Collections" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-luxury-800 hover:text-luxury-600 transition-all duration-300 font-medium group py-2"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 luxury-gradient group-hover:w-full transition-all duration-300 rounded-full"></span>
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-luxury-50 text-luxury-700 hover:text-luxury-600 transition-all duration-300 rounded-full"
                onClick={() => setIsSearchOpen(true)}
                title="Search Products"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Instagram */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-rose-50 text-rose-600 hover:text-rose-500 transition-all duration-300 rounded-full"
                onClick={handleInstagramClick}
                title="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-rose-50 text-rose-600 hover:text-rose-500 transition-all duration-300 rounded-full"
                onClick={() => router.push("/wishlist")}
                title="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white text-xs h-4 w-4 flex items-center justify-center p-0 text-[10px] border-2 border-white">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-luxury-50 text-luxury-700 hover:text-luxury-600 transition-all duration-300 rounded-full"
                onClick={() => setIsCartOpen(true)}
                title="Shopping Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartState.itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 luxury-gradient text-white text-xs h-5 w-5 flex items-center justify-center p-0 animate-pulse border-2 border-white">
                    {cartState.itemCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-luxury-50 text-luxury-700 hover:text-luxury-600 transition-all duration-300 rounded-full"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-luxury-200 shadow-xl">
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => router.push("/account")}
                        className="text-luxury-700 hover:bg-luxury-50 hover:text-luxury-600"
                      >
                        <User className="mr-2 h-4 w-4 text-luxury-600" />
                        My Account
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/orders")}
                        className="text-luxury-700 hover:bg-luxury-50 hover:text-luxury-600"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4 text-luxury-600" />
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/wishlist")}
                        className="text-luxury-700 hover:bg-luxury-50 hover:text-luxury-600"
                      >
                        <Heart className="mr-2 h-4 w-4 text-rose-500" />
                        Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-luxury-200" />
                      <DropdownMenuItem
                        onClick={logout}
                        className="text-luxury-700 hover:bg-luxury-50 hover:text-luxury-600"
                      >
                        <LogOut className="mr-2 h-4 w-4 text-luxury-600" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => router.push("/auth")}
                        className="text-luxury-700 hover:bg-luxury-50 hover:text-luxury-600"
                      >
                        <User className="mr-2 h-4 w-4 text-luxury-600" />
                        Sign In
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/auth?tab=register")}
                        className="text-luxury-700 hover:bg-luxury-50 hover:text-luxury-600"
                      >
                        <User className="mr-2 h-4 w-4 text-luxury-600" />
                        Create Account
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-luxury-50 text-luxury-700 hover:text-luxury-600 transition-all duration-300 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-6 border-t border-luxury-200 bg-white/95 backdrop-blur-md">
              <nav className="flex flex-col space-y-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "/collections", label: "Collections" },
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-luxury-700 hover:text-luxury-600 transition-colors font-medium px-2 py-2 rounded-lg hover:bg-luxury-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-luxury-200">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className="hover:bg-luxury-50 text-luxury-600 rounded-full"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleInstagramClick}
                    className="hover:bg-rose-50 text-rose-500 rounded-full"
                  >
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/wishlist")}
                    className="hover:bg-rose-50 text-rose-500 rounded-full relative"
                  >
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs h-4 w-4 flex items-center justify-center p-0">
                        {wishlistCount}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-luxury-50 text-luxury-600 rounded-full"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {cartState.itemCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 luxury-gradient text-white text-xs h-4 w-4 flex items-center justify-center p-0">
                        {cartState.itemCount}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAuthClick}
                    className="hover:bg-luxury-50 text-luxury-600 rounded-full"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}
