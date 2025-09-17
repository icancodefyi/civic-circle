"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Report = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  priority?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
};

const statusOptions = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "IN_PROGRESS", label: "In Progress", color: "bg-blue-100 text-blue-800" },
  { value: "RESOLVED", label: "Resolved", color: "bg-green-100 text-green-800" },
  { value: "REJECTED", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "CLOSED", label: "Closed", color: "bg-gray-100 text-gray-800" },
];

const priorityColors = {
  LOW: "bg-green-50 text-green-600 border-green-200",
  MEDIUM: "bg-yellow-50 text-yellow-600 border-yellow-200",
  HIGH: "bg-orange-50 text-orange-600 border-orange-200",
  URGENT: "bg-red-50 text-red-600 border-red-200",
};

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const router = useRouter();

useEffect(() => {
    if (!params?.id) return;
    fetchReport();
}, [params.id]);


  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/reports/${params.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setReport(data);
        setNewStatus(data.status);
      } else if (response.status === 404) {
        setError("Report not found");
      } else {
        setError("Failed to load report");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!report || newStatus === report.status) return;

    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`http://localhost:8080/api/reports/${report.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedReport = await response.json();
        setReport(updatedReport);
      } else {
        alert("Failed to update status");
        setNewStatus(report.status); // Reset to original status
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Network error. Please try again.");
      setNewStatus(report.status); // Reset to original status
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!report) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/reports/${report.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/reports?deleted=true");
      } else {
        alert("Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Network error. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority?: string) => {
    if (!priority) return "bg-gray-50 text-gray-600 border-gray-200";
    return priorityColors[priority as keyof typeof priorityColors] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Report</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchReport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/reports"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors inline-block"
            >
              Back to Reports
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/reports"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Reports
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 px-3 py-2 text-sm font-medium"
              >
                Delete Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Info */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{report.title}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                      {report.priority && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(report.priority)}`}>
                          {report.priority} Priority
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                        {report.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{report.description}</p>
                </div>
              </div>
            </div>

            {/* Location Info */}
            {(report.latitude && report.longitude) || report.address ? (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </h3>
                  
                  {report.address && (
                    <p className="text-gray-700 mb-3">{report.address}</p>
                  )}
                  
                  {report.latitude && report.longitude && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Coordinates: {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View on Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Status</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Status
                    </label>
                    <select
                      id="status"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {newStatus !== report.status && (
                    <button
                      onClick={handleStatusUpdate}
                      disabled={isUpdatingStatus}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {isUpdatingStatus ? "Updating..." : "Update Status"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Report Metadata */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Information</h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Report ID:</span>
                    <p className="text-gray-600">#{report.id}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>
                    <p className="text-gray-600">{formatDate(report.createdAt)}</p>
                  </div>
                  
                  {report.updatedAt && report.updatedAt !== report.createdAt && (
                    <div>
                      <span className="font-medium text-gray-700">Last Updated:</span>
                      <p className="text-gray-600">{formatDate(report.updatedAt)}</p>
                    </div>
                  )}
                  
                  {report.createdBy && (
                    <div>
                      <span className="font-medium text-gray-700">Reported By:</span>
                      <p className="text-gray-600">{report.createdBy}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <p className="text-gray-600">{report.category}</p>
                  </div>
                  
                  {report.priority && (
                    <div>
                      <span className="font-medium text-gray-700">Priority:</span>
                      <p className="text-gray-600">{report.priority}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}