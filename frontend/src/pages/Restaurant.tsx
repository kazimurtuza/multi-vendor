import axios from "axios";
import type { IRestaurant } from "../types";
import { useEffect, useState } from "react";
import { restaurantService } from "../main";
import AddRestaurant from "./AddRestaurant";
import { 
  FaUtensils, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaSignOutAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppContext";

const Restaurant = () => {
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { setUser, setIsAuth } = useAppData();

    const fetchRestaurant = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${restaurantService}/api/restaurant/my`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            console.log('response.data==', response.data);
            setRestaurant(response.data.restaurant);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
        } catch (error: any) {
            console.error("Error fetching restaurant:", error);
            if (error.response?.status === 404) {
                setRestaurant(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuth(false);
    };

    useEffect(() => {
        fetchRestaurant();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-500 font-semibold">Loading Dashboard...</span>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return <AddRestaurant onSuccess={fetchRestaurant} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <FaUtensils size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Partner Dashboard</h1>
                            <p className="text-xs text-slate-400">Manage your business profile</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-600 text-sm font-semibold rounded-xl transition duration-300"
                    >
                        <FaSignOutAlt />
                        Log Out
                    </button>
                </div>

                {/* Banner & Cover */}
                <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-slate-100">
                    <div className="h-64 md:h-80 w-full relative bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img 
                            src={restaurant.image} 
                            alt={restaurant.name} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                        
                        {/* Overlay Details */}
                        <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-3xl font-extrabold tracking-tight">{restaurant.name}</h2>
                                    {restaurant.isVerified ? (
                                        <span className="flex items-center gap-1 bg-green-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                            <FaCheckCircle /> Verified
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 bg-amber-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                            <FaExclamationCircle /> Verification Pending
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-200 mt-2 text-sm max-w-xl line-clamp-2">
                                    {restaurant.description || "No description provided."}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                                <span className={`w-2.5 h-2.5 rounded-full ${restaurant.isOpen ? "bg-green-400" : "bg-red-400"}`}></span>
                                <span className="text-sm font-bold capitalize">
                                    {restaurant.isOpen ? "Accepting Orders" : "Closed"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Details Panel */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
                        {/* Info details */}
                        <div className="space-y-5">
                            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Contact Details</h3>
                            
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                    <FaPhoneAlt size={15} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Phone Number</p>
                                    <p className="text-sm font-semibold">{restaurant.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                    <FaClock size={15} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Registered On</p>
                                    <p className="text-sm font-semibold">
                                        {new Date(restaurant.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="space-y-5">
                            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Location Details</h3>
                            
                            <div className="flex items-start gap-3 text-slate-600">
                                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 mt-0.5">
                                    <FaMapMarkerAlt size={15} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Address</p>
                                    <p className="text-sm font-semibold leading-relaxed">
                                        {restaurant.autoLocation?.formatedAddress || "No address details available."}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Latitude</p>
                                    <p className="text-sm font-bold text-slate-700 mt-0.5">
                                        {restaurant.autoLocation?.coordinates?.[1] || "N/A"}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Longitude</p>
                                    <p className="text-sm font-bold text-slate-700 mt-0.5">
                                        {restaurant.autoLocation?.coordinates?.[0] || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Actions Placeholder */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div 
                        onClick={() => navigate('/menu-items')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition cursor-pointer group"
                    >
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold mb-4">
                                🍳
                            </div>
                            <h4 className="font-bold text-slate-800">Menu Items</h4>
                            <p className="text-xs text-slate-400 mt-1">Manage and add food items to your menu</p>
                        </div>
                        <span className="text-xs font-bold text-orange-500 group-hover:translate-x-1 transition duration-300 mt-4 inline-block">Manage Menu →</span>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition cursor-pointer group">
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center font-bold mb-4">
                                📦
                            </div>
                            <h4 className="font-bold text-slate-800">Active Orders</h4>
                            <p className="text-xs text-slate-400 mt-1">Track incoming orders and delivery status</p>
                        </div>
                        <span className="text-xs font-bold text-blue-500 group-hover:translate-x-1 transition duration-300 mt-4 inline-block">View Orders →</span>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition cursor-pointer group">
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center font-bold mb-4">
                                📈
                            </div>
                            <h4 className="font-bold text-slate-800">Sales Reports</h4>
                            <p className="text-xs text-slate-400 mt-1">View earnings, payouts, and customer reviews</p>
                        </div>
                        <span className="text-xs font-bold text-green-500 group-hover:translate-x-1 transition duration-300 mt-4 inline-block">Analytics →</span>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Restaurant;