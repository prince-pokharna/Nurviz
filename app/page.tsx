import Header from "@/components/header"
import Hero from "@/components/hero"
import FeaturedProducts from "@/components/featured-products"
import CategoryShowcase from "@/components/category-showcase"
import About from "@/components/about"
import Testimonials from "@/components/testimonials"
import InstagramFeed from "@/components/instagram-feed"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import LoadingScreen from "@/components/loading-screen"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <LoadingScreen />
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <CategoryShowcase />
        <About />
        <Testimonials />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
