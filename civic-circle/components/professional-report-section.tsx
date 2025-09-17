"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, FileText, Plus, Search, Filter, Calendar, User } from "lucide-react"

const categories = [
  { value: "infrastructure", label: "Infrastructure" },
  { value: "safety", label: "Safety" },
  { value: "environment", label: "Environment" },
  { value: "transportation", label: "Transportation" },
  { value: "utilities", label: "Utilities" },
  { value: "other", label: "Other" },
]

const priorities = [
  { value: "low", label: "Low", color: "bg-secondary text-secondary-foreground" },
  { value: "medium", label: "Medium", color: "bg-accent text-accent-foreground" },
  { value: "high", label: "High", color: "bg-destructive text-destructive-foreground" },
]

const mockReports = [
  {
    id: "R001",
    title: "Broken streetlight on Main Street",
    category: "infrastructure",
    priority: "high",
    status: "In Progress",
    date: "2024-01-15",
    author: "Anonymous",
    description: "The streetlight at the intersection of Main and Oak has been out for several days.",
  },
  {
    id: "R002", 
    title: "Pothole near City Park entrance",
    category: "infrastructure",
    priority: "medium",
    status: "Pending Review",
    date: "2024-01-14",
    author: "Sarah Chen",
    description: "Large pothole causing traffic issues and potential vehicle damage.",
  },
  {
    id: "R003",
    title: "Illegal dumping in vacant lot",
    category: "environment",
    priority: "low",
    status: "Resolved",
    date: "2024-01-10",
    author: "Mike Johnson",
    description: "Construction debris dumped illegally, creating environmental concerns.",
  },
]

export function ProfessionalReportSection() {
  const [activeTab, setActiveTab] = useState<"submit" | "view">("submit")
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
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          title: "",
          description: "",
          category: "",
          priority: "",
          address: "",
          createdBy: "",
        })
      }, 3000)
    } catch (error) {
      console.error("Error submitting report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-secondary text-secondary-foreground"
      case "In Progress": return "bg-accent text-accent-foreground"
      case "Pending Review": return "bg-muted text-muted-foreground"
      default: return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            Community Reports Center
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Submit new reports or browse existing community issues. Your voice matters in building a better neighborhood.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-secondary p-1 rounded-lg flex">
            <button
              onClick={() => setActiveTab("submit")}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === "submit"
                  ? "bg-primary text-primary-foreground professional-shadow"
                  : "text-secondary-foreground hover:bg-background/50"
              }`}
            >
              <Plus className="h-4 w-4 mr-2 inline" />
              Submit Report
            </button>
            <button
              onClick={() => setActiveTab("view")}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === "view"
                  ? "bg-primary text-primary-foreground professional-shadow"
                  : "text-secondary-foreground hover:bg-background/50"
              }`}
            >
              <Search className="h-4 w-4 mr-2 inline" />
              View Reports
            </button>
          </div>
        </div>

        {/* Submit Report Tab */}
        {activeTab === "submit" && (
          <div className="max-w-3xl mx-auto">
            {submitted ? (
              <Card className="border-secondary bg-secondary/30 professional-shadow">
                <CardContent className="p-8 text-center">
                  <div className="bg-secondary p-3 rounded-lg w-fit mx-auto mb-6">
                    <FileText className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Report Submitted Successfully</h3>
                  <p className="text-muted-foreground">
                    Thank you for contributing to community improvement. Your report has been forwarded to the appropriate department.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border professional-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <FileText className="h-5 w-5" />
                    Submit New Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-card-foreground mb-2">Issue Title *</label>
                        <Input
                          required
                          placeholder="Brief description of the issue"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">Category *</label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger className="bg-input border-border">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">Priority *</label>
                        <div className="flex gap-2">
                          {priorities.map((priority) => (
                            <button
                              key={priority.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, priority: priority.value })}
                              className={`px-4 py-2 rounded-md border transition-colors text-sm ${
                                formData.priority === priority.value
                                  ? priority.color + " border-current"
                                  : "border-border text-muted-foreground hover:bg-secondary"
                              }`}
                            >
                              {priority.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-card-foreground mb-2">Description *</label>
                        <Textarea
                          required
                          placeholder="Provide detailed information about the issue..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="bg-input border-border min-h-[100px]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-card-foreground mb-2">Location</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter address or location"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="bg-input border-border flex-1"
                          />
                          <Button type="button" variant="outline" className="border-border">
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">Your Name (Optional)</label>
                        <Input
                          placeholder="Your name"
                          value={formData.createdBy}
                          onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-border">
                      <Button
                        type="submit"
                        disabled={
                          isSubmitting || !formData.title || !formData.description || !formData.category || !formData.priority
                        }
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* View Reports Tab */}
        {activeTab === "view" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <Input
                  placeholder="Search reports..."
                  className="bg-input border-border"
                />
              </div>
              <Button variant="outline" className="border-border">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid gap-6">
              {mockReports.map((report) => (
                <Card key={report.id} className="bg-card border-border professional-shadow hover-lift">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-card-foreground">{report.title}</h3>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                          {report.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {report.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(report.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {report.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="border-border">
                          {report.id}
                        </Badge>
                        <Badge className={priorities.find(p => p.value === report.priority)?.color || "bg-secondary text-secondary-foreground"}>
                          {priorities.find(p => p.value === report.priority)?.label || "Unknown"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}