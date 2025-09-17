import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Community Organizer",
    location: "San Francisco, CA",
    content:
      "This platform transformed how our neighborhood addresses issues. We've seen a 300% increase in problem resolution since we started using it.",
    rating: 5,
    avatar: "/professional-woman-smiling.png",
  },
  {
    name: "Marcus Johnson",
    role: "City Council Member",
    location: "Austin, TX",
    content:
      "Finally, a tool that bridges the gap between citizens and government. The transparency and efficiency gains have been remarkable.",
    rating: 5,
    avatar: "/professional-man-suit.png",
  },
  {
    name: "Elena Rodriguez",
    role: "Local Business Owner",
    location: "Miami, FL",
    content:
      "As a business owner, I love how this platform helps improve our neighborhood. Better communities mean better business for everyone.",
    rating: 5,
    avatar: "/placeholder-c1bqf.png",
  },
  {
    name: "David Kim",
    role: "Resident",
    location: "Seattle, WA",
    content:
      "I reported a broken streetlight and it was fixed within 48 hours. The real-time updates kept me informed throughout the process.",
    rating: 5,
    avatar: "/placeholder-02pf7.png",
  },
  {
    name: "Jennifer Walsh",
    role: "Volunteer Coordinator",
    location: "Denver, CO",
    content: "The volunteer matching feature is incredible. We've mobilized more community helpers than ever before.",
    rating: 5,
    avatar: "/placeholder-vhr2n.png",
  },
  {
    name: "Robert Thompson",
    role: "Retired Teacher",
    location: "Portland, OR",
    content:
      "At 68, I thought civic engagement was too complicated. This platform made it simple and rewarding to contribute to my community.",
    rating: 5,
    avatar: "/placeholder-mbguh.png",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Community{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Voices</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {"Hear from real people making real change in their communities every day."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>

                <Quote className="h-8 w-8 text-primary/30 mb-4" />

                <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>

              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
