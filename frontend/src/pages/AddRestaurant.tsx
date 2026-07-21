import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppData } from "../context/AppContext";
import { restaurantService } from "../main";
import {
    FaUtensils,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaCloudUploadAlt,
    FaSpinner,
    FaTimes,
    FaGlobe
} from "react-icons/fa";

interface AddRestaurantProps {
    onSuccess: () => void;
}

const AddRestaurant: React.FC<AddRestaurantProps> = ({ onSuccess }) => {
    const { location, loadingLocation } = useAppData();



    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");

    // Location States
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");
    const [formattedAddress, setFormattedAddress] = useState("");



    // Image States
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-populate location details when geolocation data changes
    useEffect(() => {
        if (location) {
            setLatitude(location.latitude.toString());
            setLongitude(location.longitude.toString());
            setFormattedAddress(location.formattedAddress || "");
        }
    }, [location]);

    const handleUseCurrentLocation = () => {
        if (location) {
            setLatitude(location.latitude.toString());
            setLongitude(location.longitude.toString());
            setFormattedAddress(location.formattedAddress || "");
            toast.success("Location auto-filled!");
        } else {
            toast.error("Location not detected yet. Please ensure GPS is enabled.");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image file is too large. Max size is 5MB.");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return toast.error("Restaurant name is required");
        if (!phone.trim()) return toast.error("Phone number is required");
        if (!latitude || !longitude) return toast.error("Location coordinates are required");
        if (!imageFile) return toast.error("Please upload a restaurant banner image");

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("phone", phone);
            formData.append("latitude", latitude);
            formData.append("longitude", longitude);
            formData.append("formatedAddress", formattedAddress);
            formData.append("file", imageFile);

            const response = await axios.post(
                `${restaurantService}/api/restaurant/new`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 201) {
                toast.success(response.data.message || "Restaurant registered successfully!");
                onSuccess();
            }
        } catch (error: any) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Failed to create restaurant";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-2xl">

                {/* Banner Section */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-10 text-white relative">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold tracking-tight">Register Your Restaurant</h2>
                        <p className="mt-2 text-orange-50 text-sm md:text-base">
                            Fill out the details below to set up your restaurant and start selling.
                        </p>
                    </div>
                    <div className="absolute right-8 bottom-0 translate-y-4 opacity-15 hidden md:block">
                        <FaUtensils size={150} />
                    </div>
                </div>

                {/* Form Container */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {/* General Information */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Restaurant Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Restaurant Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                        <FaUtensils />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Pizza Paradise"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                        <FaPhoneAlt />
                                    </span>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="e.g. 9876543210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Tell customers about your kitchen, specialties, or standard delivery times..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Location Information */}
                    <div>
                        <div className="flex items-center justify-between border-b pb-2 mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Location Details</h3>
                            <button
                                type="button"
                                onClick={handleUseCurrentLocation}
                                disabled={loadingLocation}
                                className="flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-full transition"
                            >
                                {loadingLocation ? (
                                    <>
                                        <FaSpinner className="animate-spin" /> Fetching...
                                    </>
                                ) : (
                                    <>
                                        <FaMapMarkerAlt /> Use Current Location
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Formatted Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                        <FaGlobe />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Enter restaurant full address"
                                        value={formattedAddress}
                                        onChange={(e) => setFormattedAddress(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* Latitude */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Latitude <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    required
                                    placeholder="Latitude coordinates"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Longitude */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Longitude <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    required
                                    placeholder="Longitude coordinates"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Restaurant Banner Image */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Restaurant Banner Image</h3>

                        {imagePreview ? (
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-60 flex justify-center items-center bg-slate-100">
                                <img src={imagePreview} alt="Preview" className="max-h-60 object-contain w-full" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition shadow-md"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>
                        ) : (
                            <label htmlFor="banner-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-orange-500 hover:bg-orange-50/20 transition-all duration-300 group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FaCloudUploadAlt className="w-12 h-12 text-slate-400 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-300 mb-3" />
                                    <p className="mb-2 text-sm text-slate-600 font-semibold">
                                        <span className="text-orange-600">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-slate-400">PNG, JPG or JPEG (Max 5MB)</p>
                                </div>
                                <input
                                    id="banner-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full md:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg transition duration-300 flex items-center justify-center gap-2 
                ${isSubmitting
                                    ? "opacity-75 cursor-not-allowed"
                                    : "hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0"
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin text-lg" />
                                    Registering...
                                </>
                            ) : (
                                "Create Restaurant"
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddRestaurant;
