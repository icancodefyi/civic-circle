import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Contact Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Professional support for your civic engagement needs. Our team is ready to assist with technical questions and implementation guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-white border-2 border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Send Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <Input placeholder="First name" className="bg-white border-2 border-gray-200 focus:border-blue-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <Input placeholder="Last name" className="bg-white border-2 border-gray-200 focus:border-blue-400 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="your.email@company.com"
                    className="bg-white border-2 border-gray-200 focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <Input
                    placeholder="How can we assist you?"
                    className="bg-white border-2 border-gray-200 focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <Textarea
                    placeholder="Please provide details about your inquiry..."
                    rows={4}
                    className="bg-white border-2 border-gray-200 focus:border-blue-400 transition-colors resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-blue-50 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 p-3 rounded-xl flex-shrink-0 shadow-md">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Support</h3>
                    <p className="text-gray-600 text-sm mb-2">Professional support via email</p>
                    <a href="mailto:support@civicengagement.com" className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                      support@civicengagement.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500 p-3 rounded-xl flex-shrink-0 shadow-md">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Phone Support</h3>
                    <p className="text-gray-600 text-sm mb-2">Direct line to our technical team</p>
                    <a href="tel:+1-555-CIVIC-01" className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
                      +1 (555) 248-4201
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500 p-3 rounded-xl flex-shrink-0 shadow-md">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Office Location</h3>
                    <p className="text-gray-600 text-sm mb-2">Corporate headquarters</p>
                    <address className="text-gray-600 not-italic text-sm">
                      123 Innovation Drive<br />
                      Tech Center, CA 94102
                    </address>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-500 p-3 rounded-xl flex-shrink-0 shadow-md">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Live Support</h3>
                    <p className="text-gray-600 text-sm mb-3">Real-time assistance available</p>
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
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
