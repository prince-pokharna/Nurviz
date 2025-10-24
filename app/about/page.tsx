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
            Inspired by India’s heritage and today’s trends, 
            we’ve been curating elegant imitation jewellery since 2023—crafted to adorn life’s finest moments.
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
                  Since 2023, Nurvi Jewel has carried forward a family vision—to create elegant imitation jewellery
                  inspired by India’s heritage and reimagined for today. What began as a small passion project
                  has evolved into a name synonymous with style and sophistication.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                  Inspired by the majestic jewellery traditions of Rajasthan—where every piece tells a story of royalty 
                  and grace—we set out to craft creations meant to be cherished for generations.
                  Today, our commitment to quality and artistry remains unchanged.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                  Every design reflects a story — of Rajasthani artisans who have mastered their craft,
                  of artistry rooted in heritage, and of modern elegance woven into every detail.
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
                  Using advanced anti-tarnish technology and finely plated finishes,
                  we create jewellery that radiates the richness of gold and silver while staying beautiful wear after wear.
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
                    Your satisfaction is our priority. From personalized consultations to after-sales issues, we're
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
                <div className="text-4xl lg:text-5xl font-bold gradient-text font-playfair">2+</div>
                <div className="text-gray-600 font-medium">Years of Excellence</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold gradient-text font-playfair">1,000+</div>
                <div className="text-gray-600 font-medium">Happy Customers</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold gradient-text font-playfair">500+</div>
                <div className="text-gray-600 font-medium">Unique Designs</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold gradient-text font-playfair">10+</div>
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
