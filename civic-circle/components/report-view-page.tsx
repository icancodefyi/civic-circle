"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, User, AlertCircle, CheckCircle2, Clock, Trash2 } from "lucide-react"

const mockReport = {
  id: "1",
  title: "Broken streetlight on Main Street",
  description:
    "The streetlight at the intersection of Main Street and Oak Avenue has been out for several days, creating a safety hazard for pedestrians and drivers.",
  category: "infrastructure",
  priority: "high",
  status: "in-progress",
  address: "123 Main Street, Downtown",
  latitude: 40.7128,
  longitude: -74.006,
  createdBy: "John Doe",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-16T14:20:00Z",
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  { value: "in-progress", label: "In Progress", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
]

const categoryIcons: Record<string, string> = {
  infrastructure: "🏗️",
  safety: "🚨",
  environment: "🌱",
  transportation: "🚗",
  utilities: "⚡",
  other: "📝",
}

export function ReportViewPage() {
  const [report, setReport] = useState(mockReport)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      // Simulate API call to PUT http://localhost:8080/api/reports/{id}/status
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setReport((prev) => ({
        ...prev,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      }))

      console.log("Status updated:", { status: newStatus })
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this report?")) {
      try {
        // Simulate API call to DELETE http://localhost:8080/api/reports/{id}
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Report deleted")
        // Would redirect to reports list
      } catch (error) {
        console.error("Error deleting report:", error)
      }
    }
  }

  const currentStatus = statusOptions.find((s) => s.value === report.status)
  const StatusIcon = currentStatus?.icon || Clock

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" className="mb-4 bg-transparent">
            ← Back to Reports
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Report Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border border-slate-200 bg-white">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-slate-900 mb-2">{report.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {report.createdBy}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={currentStatus?.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {currentStatus?.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-600 leading-relaxed">{report.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">Category</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{categoryIcons[report.category]}</span>
                      <span className="text-slate-600 capitalize">{report.category}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">Priority</h3>
                    <Badge
                      className={
                        report.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : report.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }
                    >
                      {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Location</h3>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    {report.address}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Update Status</label>
                  <Select value={report.status} onValueChange={handleStatusUpdate} disabled={isUpdating}>
                    <SelectTrigger className="border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <span className="flex items-center gap-2">
                            <status.icon className="h-4 w-4" />
                            {status.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="destructive" onClick={handleDelete} className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Report
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-slate-900 font-medium">Report Created</p>
                      <p className="text-slate-600">{new Date(report.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-slate-900 font-medium">Status Updated</p>
                      <p className="text-slate-600">{new Date(report.updatedAt).toLocaleString()}</p>
                    </div>
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
