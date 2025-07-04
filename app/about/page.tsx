import { Award, Shield, Sparkles, Users, Clock, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-50 to-yellow-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold gradient-text font-playfair mb-6">About Nurvi Jewel</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Crafting exquisite jewelry pieces that celebrate India's rich heritage while embracing contemporary
              elegance. Since 2008, we have been creating timeless treasures for life's most precious moments.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold text-gray-900 font-playfair">Our Story</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Founded in 2008 in the heart of Mumbai, Nurvi Jewel began as a small family business with a passion
                    for creating beautiful jewelry that honors India's rich cultural heritage. What started as a dream
                    to bring traditional Indian craftsmanship to modern jewelry lovers has grown into a trusted name in
                    the industry.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Our founder, inspired by the intricate temple jewelry of South India and the royal traditions of
                    Rajasthan, set out to create pieces that would not just be accessories, but heirlooms to be
                    treasured for generations. Today, we continue this legacy with the same dedication to quality and
                    artistry.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Every piece in our collection tells a story - of skilled artisans who have perfected their craft
                    over decades, of precious metals and gemstones sourced ethically, and of designs that bridge the gap
                    between tradition and modernity.
                  </p>
                </div>
              </div>

              <div className="relative">
                <img
                  src="/placeholder.svg?height=600&width=500"
                  alt="Jewelry craftsmanship"
                  className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-500 rounded-lg opacity-20"></div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-lg opacity-30"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">Our Values</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do, from design to delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="premium-card text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium Quality</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We use only the finest materials - 22K and 18K gold, sterling silver, and carefully selected
                    gemstones to ensure every piece meets our exacting standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="premium-card text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Craftsmanship</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our master artisans bring decades of experience, combining traditional techniques with modern
                    precision to create jewelry that is both beautiful and durable.
                  </p>
                </CardContent>
              </Card>

              <Card className="premium-card text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Lifetime Warranty</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We stand behind our craftsmanship with a comprehensive lifetime warranty, ensuring your jewelry
                    remains beautiful for years to come.
                  </p>
                </CardContent>
              </Card>

              <Card className="premium-card text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer First</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your satisfaction is our priority. From personalized consultations to after-sales service, we're
                    committed to exceeding your expectations.
                  </p>
                </CardContent>
              </Card>

              <Card className="premium-card text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Timeless Design</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our designs transcend trends, creating pieces that remain elegant and relevant through changing
                    times, becoming treasured heirlooms.
                  </p>
                </CardContent>
              </Card>

              <Card className="premium-card text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ethical Sourcing</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We are committed to responsible sourcing of all our materials, ensuring our jewelry is created with
                    respect for both people and the environment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">Meet Our Team</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The passionate individuals behind every beautiful piece of jewelry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="premium-card text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Founder"
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Rajesh Sharma</h3>
                  <p className="text-amber-600 font-medium mb-4">Founder & CEO</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    With over 25 years in the jewelry industry, Rajesh founded Nurvi Jewel with a vision to make
                    traditional Indian jewelry accessible to modern customers.
                  </p>
                </CardContent>
              </Card>

              <Card className="premium-card text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Head Designer"
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Priya Mehta</h3>
                  <p className="text-amber-600 font-medium mb-4">Head Designer</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    A graduate from NIFT, Priya brings contemporary aesthetics to traditional designs, creating pieces
                    that appeal to modern sensibilities.
                  </p>
                </CardContent>
              </Card>

              <Card className="premium-card text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Master Craftsman"
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mohan Kumar</h3>
                  <p className="text-amber-600 font-medium mb-4">Master Craftsman</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    A third-generation goldsmith, Mohan's expertise in traditional techniques ensures every piece meets
                    the highest standards of craftsmanship.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-20 bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold gradient-text font-playfair">15+</div>
                <div className="text-gray-600 font-medium">Years of Excellence</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold gradient-text font-playfair">10,000+</div>
                <div className="text-gray-600 font-medium">Happy Customers</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold gradient-text font-playfair">500+</div>
                <div className="text-gray-600 font-medium">Unique Designs</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold gradient-text font-playfair">50+</div>
                <div className="text-gray-600 font-medium">Master Artisans</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
