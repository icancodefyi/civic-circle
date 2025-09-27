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
  image?: string | null;
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
  { value: "LOW", label: "Low", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "MEDIUM", label: "Medium", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "HIGH", label: "High", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "URGENT", label: "Urgent", color: "bg-red-50 text-red-700 border-red-200" },
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
    image: null,
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

  // Handle image upload/capture with compression
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB. Please choose a smaller image or use camera compression.');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to compress image if needed
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set maximum dimensions
        const maxWidth = 1200;
        const maxHeight = 1200;
        let { width, height } = img;
        
        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        
        setFormData(prev => ({ ...prev, image: compressedBase64 }));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
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
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Link
              href="/reports"
              className="flex items-center text-gray-600 hover:text-blue-600 mr-6 transition-all duration-200 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Reports
            </Link>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 p-3 rounded-xl shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Report</h1>
                <p className="text-gray-600">Help improve your community by reporting issues</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Report Details</h2>
                <p className="text-gray-600">
                  Please provide detailed information about the issue you'd like to report.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Report Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief description of the issue"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.title ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-400"
                }`}
                maxLength={255}
              />
              {errors.title && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.title}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {formData.title.length}/255 characters
              </p>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of the issue, including any relevant context or impact"
                rows={6}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none ${
                  errors.description ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-400"
                }`}
                maxLength={2000}
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.description}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {formData.description.length}/2000 characters
              </p>
            </div>

            {/* Image Upload/Capture */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Attach Photo (optional)
              </label>
              
              <div className="space-y-3">
                {/* Camera Capture Button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="relative cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:border-blue-400">
                      <div className="text-center">
                        <svg className="mx-auto h-8 w-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium text-blue-600">Take Photo</span>
                        <p className="text-xs text-blue-500 mt-1">Use Camera</p>
                      </div>
                    </div>
                  </label>

                  {/* File Upload Button */}
                  <label className="relative cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:border-gray-400">
                      <div className="text-center">
                        <svg className="mx-auto h-8 w-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm font-medium text-gray-600">Choose File</span>
                        <p className="text-xs text-gray-500 mt-1">From Gallery</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Multiple Camera Options for Mobile */}
                <div className="sm:hidden">
                  <p className="text-xs text-gray-600 mb-2">Camera Options:</p>
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-center py-2 px-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all duration-200">
                        <span className="text-xs font-medium text-green-700">📱 Front Camera</span>
                      </div>
                    </label>
                    
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-center py-2 px-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all duration-200">
                        <span className="text-xs font-medium text-purple-700">📷 Back Camera</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Photo Attached
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <img 
                    src={formData.image} 
                    alt="Report preview" 
                    className="rounded-lg border border-gray-200 max-h-64 w-full object-cover shadow-sm"
                  />
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <strong>📱 Mobile Tips:</strong> Use "Take Photo" to capture directly with your camera, or "Choose File" to select from your gallery. Photos are automatically compressed to ensure fast upload. The image helps authorities better understand and prioritize your report.
                  </span>
                </p>
              </div>
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.category ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-400"
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
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.category}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Priority Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PRIORITIES.map((priority) => (
                    <label
                      key={priority.value}
                      className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                        formData.priority === priority.value
                          ? `${priority.color} border-current shadow-md`
                          : "border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:bg-blue-50"
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
            <div className="space-y-3">
              <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="createdBy"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.createdBy ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-400"
                }`}
              />
              {errors.createdBy && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.createdBy}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Location Information
              </label>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter address or location description"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleLocationClick}
                    disabled={locationLoading}
                    className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md font-medium"
                  >
                    {locationLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {locationLoading ? "Getting Location..." : "Use Current Location"}
                  </button>
                  
                  {formData.latitude && formData.longitude && (
                    <span className="text-sm text-green-600 flex items-center gap-2 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Location captured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <Link
                href="/reports"
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
