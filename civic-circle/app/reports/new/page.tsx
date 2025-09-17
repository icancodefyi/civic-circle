"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormData = {
  title: string;
  description: string;
  category: string;
  priority: string;
  address: string;
  createdBy: string;
  latitude: number | null;
  longitude: number | null;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

const CATEGORIES = [
  "Road & Infrastructure",
  "Public Safety",
  "Waste Management",
  "Street Lighting",
  "Water & Sewage",
  "Parks & Recreation",
  "Noise Pollution",
  "Air Quality",
  "Traffic & Transportation",
  "Public Health",
  "Other"
];

const PRIORITIES = [
  { value: "LOW", label: "Low", color: "bg-green-50 text-green-600 border-green-200" },
  { value: "MEDIUM", label: "Medium", color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  { value: "HIGH", label: "High", color: "bg-orange-50 text-orange-600 border-orange-200" },
  { value: "URGENT", label: "Urgent", color: "bg-red-50 text-red-600 border-red-200" },
];

export default function NewReportPage() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    address: "",
    createdBy: "",
    latitude: null,
    longitude: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);

  const router = useRouter();

  useEffect(() => {
    // Fetch existing categories from the backend
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/reports/categories");
      if (response.ok) {
        const data = await response.json();
        // Merge with predefined categories and remove duplicates
        const allCategories = [...new Set([...CATEGORIES, ...data])];
        setCategories(allCategories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 255) {
      newErrors.title = "Title cannot exceed 255 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 2000) {
      newErrors.description = "Description cannot exceed 2000 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.createdBy.trim()) {
      newErrors.createdBy = "Reporter name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      setFormData(prev => ({ ...prev, latitude, longitude }));

      // Try to get address from coordinates using reverse geocoding
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
        );
        // For demo purposes, we'll just show coordinates
        setFormData(prev => ({ 
          ...prev, 
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
        }));
      } catch (geoError) {
        setFormData(prev => ({ 
          ...prev, 
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
        }));
      }

    } catch (error) {
      console.error("Error getting location:", error);
      alert("Unable to get your location. Please try again or enter the address manually.");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/api/reports", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/reports?success=true");
      } else {
        const errorData = await response.json();
        if (errorData.validationErrors) {
          setErrors(errorData.validationErrors);
        } else {
          alert(errorData.message || "Failed to submit report. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/reports"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Reports
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Submit New Report</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Report Details</h2>
            <p className="text-sm text-gray-600 mt-1">
              Please provide detailed information about the issue you'd like to report.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief description of the issue"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
                maxLength={255}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/255 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of the issue, including any relevant context or impact"
                rows={5}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                maxLength={2000}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/2000 characters
              </p>
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRIORITIES.map((priority) => (
                    <label
                      key={priority.value}
                      className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors ${
                        formData.priority === priority.value
                          ? priority.color
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={priority.value}
                        checked={formData.priority === priority.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{priority.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Reporter Name */}
            <div>
              <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="createdBy"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.createdBy ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.createdBy && (
                <p className="mt-1 text-sm text-red-600">{errors.createdBy}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter address or location description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleLocationClick}
                    disabled={locationLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {locationLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {locationLoading ? "Getting Location..." : "Use Current Location"}
                  </button>
                  
                  {formData.latitude && formData.longitude && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Location set
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Link
                href="/reports"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
