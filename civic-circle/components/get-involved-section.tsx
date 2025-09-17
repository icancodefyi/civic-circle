import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Users, Megaphone, Calendar } from "lucide-react"

const actions = [
  {
    icon: FileText,
    title: "Submit Reports",
    description: "Report community issues through our secure platform with detailed tracking.",
    buttonText: "Start Reporting",
  },
  {
    icon: Users,
    title: "Join Community",
    description: "Connect with local residents and collaborate on neighborhood improvements.",
    buttonText: "Join Network",
  },
  {
    icon: Megaphone,
    title: "Advocate",
    description: "Support community initiatives and advocate for positive local changes.",
    buttonText: "Get Involved",
  },
  {
    icon: Calendar,
    title: "Attend Meetings",
    description: "Participate in town halls and community planning sessions.",
    buttonText: "View Schedule",
  },
]

export function GetInvolvedSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            Civic Participation Opportunities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Multiple pathways for meaningful community engagement. Choose your level of involvement and make a lasting impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <Card
              key={index}
              className="bg-card border-border hover-lift professional-shadow transition-all duration-200"
            >
              <CardContent className="p-8 text-center">
                <div className="bg-secondary p-3 rounded-lg w-fit mx-auto mb-6">
                  <action.icon className="h-6 w-6 text-secondary-foreground" />
                </div>

                <h3 className="text-lg font-semibold text-card-foreground mb-3">{action.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">{action.description}</p>

                <Button
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-secondary"
                >
                  {action.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Card className="max-w-4xl mx-auto bg-card border-border professional-shadow-lg">
            <CardContent className="p-12">
              <h3 className="text-2xl font-semibold text-card-foreground mb-4">
                Ready to Make a Difference?
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Join our network of engaged citizens working together to build stronger, more responsive communities through technology-enabled civic participation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border text-foreground hover:bg-secondary px-8"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
