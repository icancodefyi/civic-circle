import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            Contact Our Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Professional support for your civic engagement needs. Our team is ready to assist with technical questions and implementation guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-card border-border professional-shadow">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-card-foreground mb-6">Send Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">First Name</label>
                    <Input placeholder="First name" className="bg-input border-border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">Last Name</label>
                    <Input placeholder="Last name" className="bg-input border-border" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="your.email@company.com"
                    className="bg-input border-border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Subject</label>
                  <Input
                    placeholder="How can we assist you?"
                    className="bg-input border-border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Message</label>
                  <Textarea
                    placeholder="Please provide details about your inquiry..."
                    rows={4}
                    className="bg-input border-border resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-card border-border hover-lift professional-shadow transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-lg flex-shrink-0">
                    <Mail className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">Email Support</h3>
                    <p className="text-muted-foreground text-sm mb-2">Professional support via email</p>
                    <a href="mailto:support@civicengagement.com" className="text-foreground hover:text-primary font-medium text-sm">
                      support@civicengagement.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover-lift professional-shadow transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-lg flex-shrink-0">
                    <Phone className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">Phone Support</h3>
                    <p className="text-muted-foreground text-sm mb-2">Direct line to our technical team</p>
                    <a href="tel:+1-555-CIVIC-01" className="text-foreground hover:text-primary font-medium text-sm">
                      +1 (555) 248-4201
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover-lift professional-shadow transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-lg flex-shrink-0">
                    <MapPin className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">Office Location</h3>
                    <p className="text-muted-foreground text-sm mb-2">Corporate headquarters</p>
                    <address className="text-muted-foreground not-italic text-sm">
                      123 Innovation Drive<br />
                      Tech Center, CA 94102
                    </address>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover-lift professional-shadow transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-lg flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">Live Support</h3>
                    <p className="text-muted-foreground text-sm mb-3">Real-time assistance available</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:bg-secondary"
                    >
                      Start Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
