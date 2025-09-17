import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Bell, Users, BarChart3, Shield, Smartphone } from "lucide-react"

const features = [
  {
    icon: MapPin,
    title: "Precise Location Mapping",
    description: "Advanced geolocation technology for accurate issue reporting and tracking.",
  },
  {
    icon: Bell,
    title: "Real-time Updates",
    description: "Instant notifications on report status changes and community developments.",
  },
  {
    icon: Users,
    title: "Collaborative Platform",
    description: "Connect with residents, officials, and organizations for collective impact.",
  },
  {
    icon: BarChart3,
    title: "Data-driven Insights",
    description: "Comprehensive analytics to measure community improvement progress.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Military-grade encryption and privacy protection for all user data.",
  },
  {
    icon: Smartphone,
    title: "Cross-platform Access",
    description: "Seamless experience across all devices with responsive design.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            Platform Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Professional-grade Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Built with enterprise standards to deliver reliable, secure, and efficient civic engagement solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-border rounded-xl p-8 hover-lift enhanced-shadow transition-all duration-200"
            >
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl w-fit mb-6 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-200">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              
              <div className="mt-6 pt-4 border-t border-border/50">
                <div className="text-xs text-primary font-medium">Learn more →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
