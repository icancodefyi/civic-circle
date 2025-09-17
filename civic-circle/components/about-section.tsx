import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Target, Lightbulb } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-6 tracking-tight">
              Building Better Communities Through Technology
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We provide professional-grade civic engagement solutions that connect citizens with local government. Our platform facilitates transparent, efficient communication channels for sustainable community development.
            </p>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              Developed by civic technology experts and community advocates, our system is trusted by municipalities and organizations nationwide for its reliability, security, and effectiveness.
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3">
              Learn More
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="bg-background border-border hover-lift professional-shadow transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-lg flex-shrink-0">
                    <Heart className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Community Focused</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Every solution is designed with community needs and real-world implementation in mind.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border-border hover-lift professional-shadow transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-lg flex-shrink-0">
                    <Target className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Outcome Oriented</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Success is measured by tangible improvements in community quality of life.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border-border hover-lift professional-shadow transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-lg flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Technology Excellence</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Modern technology solutions powered by robust infrastructure and security.
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
