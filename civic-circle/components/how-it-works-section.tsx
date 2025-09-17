import { Card, CardContent } from "@/components/ui/card"
import { FileText, Search, CheckCircle, MessageSquare } from "lucide-react"

const steps = [
  {
    icon: FileText,
    title: "Report",
    description: "Submit detailed reports with precise location data and supporting documentation.",
    color: "blue",
    accent: "bg-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    icon: Search,
    title: "Monitor",
    description: "Track progress through our transparent status system with real-time updates.",
    color: "purple",
    accent: "bg-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    icon: CheckCircle,
    title: "Resolution",
    description: "Issues are addressed by relevant authorities following established protocols.",
    color: "emerald",
    accent: "bg-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    icon: MessageSquare,
    title: "Communication",
    description: "Maintain dialogue with stakeholders throughout the resolution process.",
    color: "amber",
    accent: "bg-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Simple Four-Step Process
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our streamlined approach ensures efficient handling of community issues from initial report to final resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-8">
                <div className={`${step.accent} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm`}>
                  {index + 1}
                </div>
              </div>

              {/* Icon */}
              <div className={`${step.bgColor} ${step.borderColor} border-2 rounded-xl p-4 w-fit mb-6 mt-4`}>
                <step.icon className={`h-6 w-6 text-${step.color}-600`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Process Flow */}
        <div className="hidden lg:flex items-center justify-center mt-12 space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-12 h-0.5 bg-slate-300"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <div className="w-12 h-0.5 bg-slate-300"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-12 h-0.5 bg-slate-300"></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
