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
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            Measurable Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Quantifiable results demonstrating the effectiveness of community-driven civic engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-card border-border hover-lift professional-shadow transition-all duration-200"
            >
              <CardContent className="p-8 text-center">
                <div className="bg-secondary p-3 rounded-lg w-fit mx-auto mb-6">
                  <stat.icon className="h-6 w-6 text-secondary-foreground" />
                </div>

                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">{stat.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
