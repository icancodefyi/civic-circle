"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Upload, AlertCircle, CheckCircle2 } from "lucide-react"

const categories = [
  { value: "infrastructure", label: "Infrastructure", icon: "🏗️" },
  { value: "safety", label: "Safety", icon: "🚨" },
  { value: "environment", label: "Environment", icon: "🌱" },
  { value: "transportation", label: "Transportation", icon: "🚗" },
  { value: "utilities", label: "Utilities", icon: "⚡" },
  { value: "other", label: "Other", icon: "📝" },
]

const priorities = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
]

export function ReportSubmissionPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    address: "",
    createdBy: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call to POST http://localhost:8080/api/reports
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const reportData = {
        ...formData,
        latitude: 0, // Would get from geolocation
        longitude: 0, // Would get from geolocation
      }

      console.log("Submitting report:", reportData)
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-900 mb-2">Report Submitted Successfully!</h2>
              <p className="text-green-700 mb-6">
                Thank you for helping improve our community. We'll review your report and provide updates soon.
              </p>
              <Button onClick={() => setSubmitted(false)} className="bg-green-600 hover:bg-green-700">
                Submit Another Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Submit a Report</h2>
          <p className="text-xl text-slate-600">Help improve your community by reporting issues that need attention.</p>
        </div>

        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Report Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Report Title *</label>
                  <Input
                    required
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            {cat.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority *</label>
                  <div className="flex gap-2">
                    {priorities.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: priority.value })}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.priority === priority.value
                            ? priority.color + " border-current"
                            : "border-slate-300 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                  <Textarea
                    required
                    placeholder="Provide detailed information about the issue..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border-slate-300 min-h-[120px]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter address or location"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="border-slate-300 flex-1"
                    />
                    <Button type="button" variant="outline" className="border-slate-300 bg-transparent">
                      <MapPin className="h-4 w-4 mr-2" />
                      Use My Location
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Name (Optional)</label>
                  <Input
                    placeholder="Your name"
                    value={formData.createdBy}
                    onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                    className="border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Attachments (Optional)</label>
                  <Button type="button" variant="outline" className="w-full border-slate-300 bg-transparent">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-200">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting || !formData.title || !formData.description || !formData.category || !formData.priority
                  }
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
