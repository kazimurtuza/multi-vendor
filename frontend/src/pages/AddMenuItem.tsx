import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { restaurantService } from "../main";
import {
    FaArrowLeft,
    FaCloudUploadAlt,
    FaSpinner,
    FaTimes,
    FaUtensils,
    FaTag,
    FaDollarSign
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const AddMenuItem = () => {
    const navigate = useNavigate();

    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        "Main Course",
        "Fast Food",
        "Beverages",
        "Desserts",
        "Starters",
        "Snacks",
        "Combo Offers"
    ];

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

        if (!description.trim()) return toast.error("Please enter a name or description for the item");
        if (!price || Number(price) <= 0) return toast.error("Please enter a valid price");
        if (!imageFile) return toast.error("Please upload an item image");

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append("description", description);
            formData.append("price", price);
            formData.append("name", name);
            formData.append("file", imageFile);

            const response = await axios.post(
                `${restaurantService}/api/item/new`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success(response.data.message || "Menu item added successfully!");
            navigate("/menu-items");
        } catch (error: any) {
            console.error("Error adding menu item:", error);
            toast.error(error.response?.data?.message || "Failed to add menu item");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/menu-items")}
                            className="w-10 h-10 rounded-xl hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 transition"
                        >
                            <FaArrowLeft size={16} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                <FaUtensils size={22} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">Add New Menu Item</h1>
                                <p className="text-xs text-slate-400">Fill in details to add food to your menu</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Item Name / Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                <FaUtensils className="text-orange-500" />
                                Item Title / Description
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. Spicy Chicken Burger with Cheese"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm font-medium"
                                required
                            />
                        </div>

                        {/* Price & Category Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                    <FaDollarSign className="text-orange-500" />
                                    Price (৳)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="e.g. 250"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm font-medium"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                    <FaTag className="text-orange-500" />
                                    Name
                                </label>
                                <input
                                    type="text"
                                    min="0"
                                    step="any"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Chicken Burger"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm font-medium"
                                    required
                                />

                            </div>
                        </div>

                        {/* Image Upload Area */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                <FaCloudUploadAlt className="text-orange-500" />
                                Food Photo
                            </label>

                            {imagePreview ? (
                                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 group h-64 bg-slate-50">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-9 h-9 rounded-xl flex items-center justify-center transition shadow-lg"
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-orange-500 hover:bg-orange-50/20 transition-all duration-300 group bg-slate-50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FaCloudUploadAlt className="w-12 h-12 text-slate-400 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-300 mb-3" />
                                        <p className="mb-2 text-sm text-slate-600 font-semibold">
                                            <span className="text-orange-600">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-slate-400">PNG, JPG or JPEG (Max 5MB)</p>
                                    </div>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/menu-items")}
                                className="px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition duration-300 shadow-md shadow-orange-500/20 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Menu Item"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMenuItem;