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
  image?: string | null;
};

const statusOptions = [
  { value: "PENDING", label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "IN_PROGRESS", label: "In Progress", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "RESOLVED", label: "Resolved", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { value: "REJECTED", label: "Rejected", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "CLOSED", label: "Closed", color: "bg-slate-100 text-slate-800 border-slate-200" },
];

const priorityColors = {
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  URGENT: "bg-red-50 text-red-700 border-red-200",
};

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownloadReport = async () => {
    if (!report) return;

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/generate-report?reportId=${report.id}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${report.id}-summary.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to generate report summary");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsDownloading(false);
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
    return statusOption?.color || "bg-slate-100 text-slate-800 border-slate-200";
  };

  const getPriorityColor = (priority?: string) => {
    if (!priority) return "bg-slate-50 text-slate-600 border-slate-200";
    return priorityColors[priority as keyof typeof priorityColors] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Report</h3>
            <p className="text-gray-600">Please wait while we fetch the report details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Report</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={fetchReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
            <Link
              href="/reports"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block text-center"
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
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                CivicCircle
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/reports" className="text-gray-600 hover:text-gray-900 transition-colors">
                  All Reports
                </Link>
                <Link href="/reports/new" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Submit Report
                </Link>
                <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Admin Panel
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/reports"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Reports
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Report Details</h1>
              <p className="text-gray-600">Report #{params.id}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Report Content - Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Report Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{report.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Report #{report.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{report.createdAt ? formatDate(report.createdAt) : 'Date not available'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(report.status)}`}>
                      {report.status?.replace('_', ' ') || 'Unknown'}
                    </span>
                    {report.priority && (
                      <span className={`px-4 py-2 rounded-xl text-sm font-medium ${getPriorityColor(report.priority)}`}>
                        {report.priority} Priority
                      </span>
                    )}
                  </div>
                </div>

                <div className="prose prose-gray max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <div className="bg-gray-50 rounded-xl p-6 border">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {report.description || 'No description provided.'}
                    </p>
                    {report.image && (
                      <div className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h4 className="text-md font-medium text-gray-800">Attached Photo</h4>
                        </div>
                        <div className="relative group">
                          <img 
                            src={report.image} 
                            alt="Report Image" 
                            className="rounded-xl border border-gray-200 max-h-80 w-full object-cover shadow-lg cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                            onClick={() => report.image && window.open(report.image, '_blank')}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="bg-white bg-opacity-90 rounded-full p-2">
                              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">📱 Tap to view full size</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Info */}
            {(report.latitude && report.longitude) || report.address ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Location Details</h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 border">
                      {report.address && (
                        <div className="mb-4">
                          <p className="text-gray-700 font-medium mb-2">Address:</p>
                          <p className="text-gray-600">{report.address}</p>
                        </div>
                      )}
                      {report.latitude && report.longitude && (
                        <div className="space-y-3">
                          <p className="text-gray-700 font-medium mb-2">Live Map:</p>
                          <iframe
                            title="Live Location Map"
                            width="100%"
                            height="300"
                            style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${report.latitude},${report.longitude}&hl=en&z=16&output=embed`}
                          />
                          <p className="text-gray-600 mt-2 text-xs">Latitude: {report.latitude.toFixed(6)}, Longitude: {report.longitude.toFixed(6)}</p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Report Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                AI Report Summary
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                Generate a comprehensive PDF report with AI-powered analysis using Google Gemini Flash 2.5. 
                Includes executive summary, impact analysis, and actionable recommendations.
              </p>
              
              <button
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generate AI Report
                  </>
                )}
              </button>
            </div>

            {/* Report Metadata */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Report Information
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border">
                  <span className="font-medium text-gray-700 text-sm">Report ID:</span>
                  <p className="text-gray-600 mt-1">#{report.id}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl border">
                  <span className="font-medium text-gray-700 text-sm">Created:</span>
                  <p className="text-gray-600 mt-1">{formatDate(report.createdAt)}</p>
                </div>
                
                {report.updatedAt && report.updatedAt !== report.createdAt && (
                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <span className="font-medium text-gray-700 text-sm">Last Updated:</span>
                    <p className="text-gray-600 mt-1">{formatDate(report.updatedAt)}</p>
                  </div>
                )}
                
                {report.createdBy && (
                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <span className="font-medium text-gray-700 text-sm">Reported By:</span>
                    <p className="text-gray-600 mt-1">{report.createdBy}</p>
                  </div>
                )}
                
                <div className="p-4 bg-gray-50 rounded-xl border">
                  <span className="font-medium text-gray-700 text-sm">Category:</span>
                  <p className="text-gray-600 mt-1">{report.category}</p>
                </div>
                
                {report.priority && (
                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <span className="font-medium text-gray-700 text-sm">Priority Level:</span>
                    <p className="text-gray-600 mt-1">{report.priority}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}