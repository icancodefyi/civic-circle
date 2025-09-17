import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Users, Megaphone, Calendar } from "lucide-react"

const actions = [
  {
    icon: FileText,
    title: "Submit Reports",
    description: "Report community issues through our secure platform with detailed tracking.",
    buttonText: "Start Reporting",
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-500",
  },
  {
    icon: Users,
    title: "Join Community",
    description: "Connect with local residents and collaborate on neighborhood improvements.",
    buttonText: "Join Network", 
    color: "purple",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    iconBg: "bg-purple-500",
  },
  {
    icon: Megaphone,
    title: "Advocate",
    description: "Support community initiatives and advocate for positive local changes.",
    buttonText: "Get Involved",
    color: "emerald",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconBg: "bg-emerald-500",
  },
  {
    icon: Calendar,
    title: "Attend Meetings",
    description: "Participate in town halls and community planning sessions.",
    buttonText: "View Schedule",
    color: "amber",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200", 
    iconBg: "bg-amber-500",
  },
]

export function GetInvolvedSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Civic Participation Opportunities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Multiple pathways for meaningful community engagement. Choose your level of involvement and make a lasting impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <Card
              key={index}
              className={`${action.bgColor} ${action.borderColor} border-2 hover:border-opacity-80 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
            >
              <CardContent className="p-8 text-center">
                <div className={`${action.iconBg} p-4 rounded-xl w-fit mx-auto mb-6 shadow-md`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">{action.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{action.description}</p>

                <Button
                  className={`w-full bg-${action.color}-500 hover:bg-${action.color}-600 text-white transition-colors duration-300 shadow-md hover:shadow-lg`}
                >
                  {action.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Card className="max-w-4xl mx-auto bg-white border-2 border-gray-200 shadow-lg">
            <CardContent className="p-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Ready to Make a Difference?
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Join our network of engaged citizens working together to build stronger, more responsive communities through technology-enabled civic participation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-md hover:shadow-lg transition-all duration-300">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-8 transition-all duration-300"
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