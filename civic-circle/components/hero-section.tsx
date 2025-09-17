import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Users, Building, CheckCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background">
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fillOpacity='0.4'%3E%3Cpath d='m0 40l40-40h-40v40zm10 0l30-30v-10h-30v40zm20 0l20-20v-20h-20v40z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center fade-in">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-8">
            <CheckCircle className="h-4 w-4" />
            Trusted by 50+ Communities
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Empowering Citizens,
            <br />
            <span className="text-accent">Building Communities</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            A professional platform for civic engagement. Report issues, track progress, and collaborate with local government to create positive change in your community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg rounded-lg transition-all duration-200 hover-lift"
            >
              Submit a Report
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-secondary px-8 py-6 text-lg rounded-lg"
            >
              View All Reports
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl professional-shadow hover-lift">
              <div className="bg-secondary p-3 rounded-lg mb-4">
                <Shield className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">Your data is protected with enterprise-grade security</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl professional-shadow hover-lift">
              <div className="bg-secondary p-3 rounded-lg mb-4">
                <Users className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Community Driven</h3>
              <p className="text-muted-foreground text-sm">Connect with neighbors and local officials</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl professional-shadow hover-lift">
              <div className="bg-secondary p-3 rounded-lg mb-4">
                <Building className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Government Integration</h3>
              <p className="text-muted-foreground text-sm">Direct connection to local government systems</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center opacity-50">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  )
}
