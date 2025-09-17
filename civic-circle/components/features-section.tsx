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
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            Professional-grade Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Built with enterprise standards to deliver reliable, secure, and efficient civic engagement solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group bg-card border-border hover-lift professional-shadow transition-all duration-200"
            >
              <CardContent className="p-8">
                <div className="bg-secondary p-3 rounded-lg w-fit mb-6">
                  <feature.icon className="h-6 w-6 text-secondary-foreground" />
                </div>

                <h3 className="text-lg font-semibold text-card-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
