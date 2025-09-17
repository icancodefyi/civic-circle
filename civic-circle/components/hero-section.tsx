import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Users, Building, CheckCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Enhanced geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fillOpacity='0.4'%3E%3Cpath d='m0 60l60-60h-60v60zm15 0l45-45v-15h-45v60zm30 0l30-30v-30h-30v60z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Subtle accent elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-32 bg-primary/10 rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-1 h-24 bg-primary/10 rounded-full"></div>
        <div className="absolute top-1/3 right-8 w-px h-40 bg-primary/5"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center fade-in">
          {/* Enhanced status badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary/20 text-primary px-6 py-3 rounded-full text-sm font-medium mb-8 enhanced-shadow">
            <CheckCircle className="h-4 w-4" />
            Trusted by 50+ Communities Nationwide
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight leading-tight">
            Empowering Citizens,
            <br />
            <span className="text-primary">Building Communities</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            A professional platform for civic engagement. Report issues, track progress, and collaborate with local government to create positive change in your community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg rounded-lg transition-all duration-200 hover-lift primary-glow"
            >
              <a href="/reports/new" className="flex items-center">
              Submit a Report
              <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/5 px-8 py-6 text-lg rounded-lg backdrop-blur-sm"
            >
              <a href="/reports">
              View All Reports
              </a>
            </Button>
          </div>

          {/* Enhanced trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl enhanced-shadow hover-lift accent-border">
              <div className="bg-primary/10 p-4 rounded-xl mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">Your data is protected with enterprise-grade security</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl enhanced-shadow hover-lift accent-border">
              <div className="bg-primary/10 p-4 rounded-xl mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Community Driven</h3>
              <p className="text-muted-foreground text-sm">Connect with neighbors and local officials</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl enhanced-shadow hover-lift accent-border">
              <div className="bg-primary/10 p-4 rounded-xl mb-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Government Integration</h3>
              <p className="text-muted-foreground text-sm">Direct connection to local government systems</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
