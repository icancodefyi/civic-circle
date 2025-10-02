"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AuthHeader } from "@/components/auth-header";

type FormData = {
  title: string;
  description: string;
  category: string;
  priority: string;
  address: string;
  createdBy: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  image?: string | null;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

const CATEGORIES = [
  { value: "Road & Infrastructure", icon: "🛣️" },
  { value: "Public Safety", icon: "🚨" },
  { value: "Waste Management", icon: "♻️" },
  { value: "Street Lighting", icon: "💡" },
  { value: "Water & Sewage", icon: "💧" },
  { value: "Parks & Recreation", icon: "🌳" },
  { value: "Noise Pollution", icon: "🔊" },
  { value: "Air Quality", icon: "🌫️" },
  { value: "Traffic & Transportation", icon: "🚦" },
  { value: "Public Health", icon: "🏥" },
  { value: "Other", icon: "📋" }
];

const PRIORITIES = [
  { value: "LOW", label: "Low", icon: "○" },
  { value: "MEDIUM", label: "Medium", icon: "◐" },
  { value: "HIGH", label: "High", icon: "◕" },
  { value: "URGENT", label: "Urgent", icon: "●" },
];

export default function NewReportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    address: "",
    createdBy: "",
    email: "",
    latitude: null,
    longitude: null,
    image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Auto-populate user name from session
  useEffect(() => {
    if (status === "authenticated" && session?.user?.name) {
      setFormData(prev => ({ 
        ...prev, 
        createdBy: session.user?.name || "",
        email: session.user?.email || ""
      }));
    }
  }, [status, session]);

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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
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

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-12 rounded-2xl shadow-lg border border-slate-200">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Loading</h3>
            <p className="text-slate-600">Verifying your session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <AuthHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/reports" className="p-2 hover:bg-white/50 rounded-xl transition-all">
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Submit New Report</h1>
              <p className="text-sm text-slate-600">Quick and easy civic issue reporting</p>
            </div>
          </div>
        </div>

        {/* Single Card Container */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden">
            {/* 3-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-8">
              
              {/* Left Column - Main Info */}
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Report Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Brief description of the issue"
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors.title ? "border-rose-300 bg-rose-50" : "border-transparent hover:border-slate-200"
                    }`}
                    maxLength={255}
                  />
                  {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide detailed information about the issue..."
                    rows={5}
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                      errors.description ? "border-rose-300 bg-rose-50" : "border-transparent hover:border-slate-200"
                    }`}
                    maxLength={2000}
                  />
                  {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="createdBy"
                    value={formData.createdBy}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={!!session?.user?.name}
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors.createdBy ? "border-rose-300 bg-rose-50" : session?.user?.name ? "border-transparent bg-slate-100 cursor-not-allowed" : "border-transparent hover:border-slate-200"
                    }`}
                  />
                  {errors.createdBy && <p className="text-xs text-rose-600 mt-1">{errors.createdBy}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    disabled={!!session?.user?.email}
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors.email ? "border-rose-300 bg-rose-50" : session?.user?.email ? "border-transparent bg-slate-100 cursor-not-allowed" : "border-transparent hover:border-slate-200"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter address or use GPS"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent hover:border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all mb-2"
                  />
                  <button
                    type="button"
                    onClick={handleLocationClick}
                    disabled={locationLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-slate-400 transition-all text-sm font-semibold"
                  >
                    {locationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                        Detecting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        Use Current Location
                      </>
                    )}
                  </button>
                  {formData.latitude && formData.longitude && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Location captured
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Column - Category & Priority */}
              <div className="lg:col-span-4 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <label
                        key={cat.value}
                        className={`flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.category === cat.value
                            ? "border-indigo-500 bg-indigo-50 shadow-sm"
                            : "border-slate-200 hover:border-indigo-300 bg-white hover:shadow-sm"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat.value}
                          checked={formData.category === cat.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="text-xl">{cat.icon}</span>
                        <span className={`text-xs font-semibold ${
                          formData.category === cat.value ? "text-indigo-900" : "text-slate-700"
                        }`}>
                          {cat.value.split(" ")[0]}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.category && <p className="text-xs text-rose-600 mt-2">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRIORITIES.map((priority) => (
                      <label
                        key={priority.value}
                        className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.priority === priority.value
                            ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm"
                            : "border-slate-200 hover:border-indigo-300 bg-white text-slate-700 hover:shadow-sm"
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
                        <span className="text-sm">{priority.icon}</span>
                        <span className="text-xs font-semibold">{priority.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Photo Upload */}
              <div className="lg:col-span-3 space-y-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Photo Evidence
                </label>
                
                {!formData.image ? (
                  <div className="space-y-3">
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all bg-indigo-50/30">
                        <svg className="w-10 h-10 text-indigo-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        </svg>
                        <span className="text-sm font-bold text-indigo-700">Take Photo</span>
                        <span className="text-xs text-slate-500 mt-1">Use camera</span>
                      </div>
                    </label>
                    
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-400 hover:bg-slate-50 transition-all">
                        <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-bold text-slate-700">Upload Image</span>
                        <span className="text-xs text-slate-500 mt-1">From gallery</span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border-2 border-indigo-200">
                    <img 
                      src={formData.image} 
                      alt="Evidence" 
                      className="w-full h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                      className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-lg hover:bg-rose-50 transition-colors"
                    >
                      <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-lg">
                  <p className="text-xs text-amber-800">
                    <strong>Tip:</strong> Photos help authorities prioritize and resolve issues faster.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex items-center justify-between">
              <Link
                href="/reports"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed font-bold transition-all shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}