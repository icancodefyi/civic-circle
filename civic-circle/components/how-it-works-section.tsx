import { Card, CardContent } from "@/components/ui/card"
import { FileText, Search, CheckCircle, MessageSquare } from "lucide-react"

const steps = [
  {
    icon: FileText,
    title: "Report",
    description: "Submit detailed reports with precise location data and supporting documentation.",
  },
  {
    icon: Search,
    title: "Monitor",
    description: "Track progress through our transparent status system with real-time updates.",
  },
  {
    icon: CheckCircle,
    title: "Resolution",
    description: "Issues are addressed by relevant authorities following established protocols.",
  },
  {
    icon: MessageSquare,
    title: "Communication",
    description: "Maintain dialogue with stakeholders throughout the resolution process.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-6 tracking-tight">
            Streamlined Process
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our systematic approach ensures efficient handling of community issues from initial report to final resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative bg-background border-border hover-lift professional-shadow transition-all duration-200"
            >
              <CardContent className="p-8 text-center">
                <div className="bg-secondary p-3 rounded-lg w-fit mx-auto mb-6">
                  <step.icon className="h-6 w-6 text-secondary-foreground" />
                </div>

                <div className="absolute -top-3 -right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {index + 1}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process flow connector lines */}
        <div className="hidden lg:block relative -mt-16 mb-8">
          <div className="absolute top-1/2 left-1/4 w-1/6 h-px bg-border"></div>
          <div className="absolute top-1/2 left-5/12 w-1/6 h-px bg-border"></div>
          <div className="absolute top-1/2 left-7/12 w-1/6 h-px bg-border"></div>
        </div>
      </div>
    </section>
  )
}
