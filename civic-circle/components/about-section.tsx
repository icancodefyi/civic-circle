import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Target, Lightbulb } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              About Our Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Building Better Communities Through Technology
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              We provide professional-grade civic engagement solutions that connect citizens with local government. Our platform facilitates transparent, efficient communication channels for sustainable community development.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Developed by civic technology experts and community advocates, our system is trusted by municipalities and organizations nationwide for its reliability, security, and effectiveness.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">10K+</div>
                <div className="text-sm text-slate-600">Reports Filed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">95%</div>
                <div className="text-sm text-slate-600">Resolution Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-slate-600">Cities Using</div>
              </div>
            </div>

            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3">
              Learn More About Us
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            <Card className="bg-rose-50 border-rose-200 border-2 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-rose-500 p-3 rounded-lg flex-shrink-0">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Community Focused</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Every solution is designed with community needs and real-world implementation in mind.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50 border-emerald-200 border-2 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-500 p-3 rounded-lg flex-shrink-0">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Results Driven</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Success is measured by tangible improvements in community quality of life and engagement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200 border-2 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 p-3 rounded-lg flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Innovation First</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Modern technology solutions powered by robust infrastructure and enterprise security.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
