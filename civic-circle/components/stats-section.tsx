import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, CheckCircle, Clock } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Citizens",
    description: "Engaged community members",
  },
  {
    icon: CheckCircle,
    value: "12,847",
    label: "Issues Resolved",
    description: "Successfully addressed reports",
  },
  {
    icon: Clock,
    value: "3.2 days",
    label: "Response Time",
    description: "Average resolution period",
  },
  {
    icon: TrendingUp,
    value: "94%",
    label: "Success Rate",
    description: "Positive outcomes achieved",
  },
]

export function StatsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <div className="inline-block bg-white/80 backdrop-blur-sm border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            Impact Metrics
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Measurable Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Quantifiable outcomes demonstrating the effectiveness of community-driven civic engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm border border-primary/10 rounded-xl p-8 text-center hover-lift enhanced-shadow transition-all duration-200"
            >
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl w-fit mx-auto mb-6">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>

              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{stat.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{stat.description}</p>
              
              <div className="mt-6 pt-4 border-t border-primary/10">
                <div className="w-full bg-primary/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full" style={{width: `${85 + index * 5}%`}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
