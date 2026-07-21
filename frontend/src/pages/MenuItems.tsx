import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { restaurantService } from "../main";
import { FaArrowLeft, FaPlus, FaTrashAlt, FaUtensils, FaToggleOn, FaToggleOff, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";
import type { IMenuItem, IRestaurant } from "../types";

const MenuItems = () => {
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    const [items, setItems] = useState<IMenuItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            // Fetch restaurant details first
            const resRest = await axios.get(`${restaurantService}/api/restaurant/my`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            const rest = resRest.data.restaurant;
            setRestaurant(rest);

            if (rest) {
                // Fetch menu items for this restaurant
                const resItems = await axios.get(`${restaurantService}/api/item/all/${rest._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                setItems(resItems.data.items || []);
            }
        } catch (error: any) {
            console.error("Error fetching data:", error);
            toast.error(error.response?.data?.message || "Failed to load menu items");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleAvailability = async (itemId: string) => {
        try {
            setActionLoading(itemId);
            const response = await axios.put(
                `${restaurantService}/api/item/status/${itemId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                }
            );
            toast.success(response.data.message || "Status updated successfully");
            // Update local state
            setItems(prev => prev.map(item =>
                item._id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
            ));
        } catch (error: any) {
            console.error("Error toggling status:", error);
            toast.error(error.response?.data?.message || "Failed to update item status");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (itemId: string) => {
        if (!window.confirm("Are you sure you want to delete this menu item?")) return;

        try {
            setActionLoading(itemId);
            const response = await axios.delete(`${restaurantService}/api/item/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            toast.success(response.data.message || "Menu item deleted");
            setItems(prev => prev.filter(item => item._id !== itemId));
        } catch (error: any) {
            console.error("Error deleting item:", error);
            toast.error(error.response?.data?.message || "Failed to delete item");
        } finally {
            setActionLoading(null);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-500 font-semibold">Loading Menu Items...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="w-10 h-10 rounded-xl hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 transition"
                        >
                            <FaArrowLeft size={16} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                <FaUtensils size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">Menu Management</h1>
                                <p className="text-xs text-slate-400">
                                    {restaurant ? restaurant.name : "Your Restaurant"}'s menu list
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/add-menu-item")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition duration-300 shadow-sm shadow-orange-500/20"
                    >
                        <FaPlus size={14} />
                        Add New Item
                    </button>
                </div>

                {/* Items List */}
                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                            🍳
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No items found</h3>
                        <p className="text-sm text-slate-400 max-w-sm mt-1">
                            Your menu is currently empty. Get started by adding delicious items to attract customers!
                        </p>
                        <button
                            onClick={() => navigate("/add-menu-item")}
                            className="mt-6 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition"
                        >
                            Create First Menu Item
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col group relative"
                            >
                                <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.description}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    {item.category && (
                                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-slate-200/50">
                                            {item.category}
                                        </span>
                                    )}
                                    <span className="absolute bottom-3 right-3 bg-orange-500 text-white text-sm font-extrabold px-3 py-1 rounded-xl shadow-md border border-orange-400/20">
                                        ৳{item.price}
                                    </span>
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-800 line-clamp-1">
                                            {item.description || "Unnamed Item"}
                                        </h4>
                                        <p className="text-xs text-slate-400 leading-relaxed min-h-[32px] line-clamp-2">
                                            Delicious food prepared with the freshest ingredients.
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={actionLoading === item._id}
                                                onClick={() => handleToggleAvailability(item._id)}
                                                className={`text-2xl transition duration-300 focus:outline-none ${item.isAvailable
                                                        ? "text-green-500 hover:text-green-600"
                                                        : "text-slate-300 hover:text-slate-400"
                                                    }`}
                                            >
                                                {actionLoading === item._id ? (
                                                    <FaSpinner className="animate-spin text-lg text-slate-400" />
                                                ) : item.isAvailable ? (
                                                    <FaToggleOn />
                                                ) : (
                                                    <FaToggleOff />
                                                )}
                                            </button>
                                            <span className="text-xs font-semibold text-slate-500">
                                                {item.isAvailable ? "Available" : "Unavailable"}
                                            </span>
                                        </div>

                                        <button
                                            disabled={actionLoading === item._id}
                                            onClick={() => handleDelete(item._id)}
                                            className="w-8 h-8 rounded-lg border border-slate-100 hover:border-red-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition"
                                        >
                                            {actionLoading === item._id ? (
                                                <FaSpinner className="animate-spin text-sm" />
                                            ) : (
                                                <FaTrashAlt size={13} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuItems;