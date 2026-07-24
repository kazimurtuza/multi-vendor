import { useAppData } from "../context/AppContext";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { IRestaurant } from "../types";
import axios from "axios";
import { restaurantService } from "../main";
import { FaUtensils, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const Home = () => {
  const { location } = useAppData();
  const [searchParams] = useSearchParams();
  const [restaurant, setRestaurant] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const search = searchParams.get("search") || "";

  const getDistanceKm = (lat1: number, log1: number, lat2: number, log2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(log2 - log1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  function degToRad(deg: number) {
    return deg * (Math.PI / 180)
  }

  const fatchRestaurant = async () => {
    if (!location?.longitude || !location?.latitude) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`${restaurantService}/api/restaurant/all`, {
        params: {
          lng: location.longitude,
          lat: location.latitude,
          search,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      const { restaurants } = data;
      console.log("all restaurants", restaurants);
      setRestaurant(restaurants);
    } catch (err) {
      console.error("Error fetching restaurants", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (location || search) {
      fatchRestaurant();
    }
  }, [location, search])

  if (loading || !location?.latitude || !location?.longitude) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-medium">Finding nearest restaurants for you...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-orange-500 font-semibold tracking-wider text-xs uppercase">Local Favorites</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            {search ? 'Search Results' : 'Nearby Restaurants'}
          </h1>
          <p className="mt-2 text-slate-500 font-medium max-w-xl">
            {search 
              ? `Showing results matching "${search}" near your current location.` 
              : 'Taste the best cuisines and find the fastest delivery routes in your city.'}
          </p>
        </div>
        
        {restaurant.length > 0 && (
          <div className="bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-orange-100 self-start md:self-auto">
            {restaurant.length} {restaurant.length === 1 ? 'restaurant' : 'restaurants'} open & nearby
          </div>
        )}
      </div>

      {/* Grid List */}
      {restaurant.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <FaUtensils size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Restaurants Found</h3>
          <p className="text-slate-500 mt-1 max-w-sm">
            We couldn't find any restaurants matching your preferences. Try searching for something else or adjusting your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {restaurant.map((res) => {
            const distance = res.distanceKm !== undefined 
              ? res.distanceKm 
              : getDistanceKm(Number(res.autoLocation.coordinates[1]), Number(res.autoLocation.coordinates[0]), location.latitude, location.longitude);

            return (
              <div 
                key={res._id} 
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={res.image} 
                    alt={res.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Status Badge */}
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-md shadow-sm border ${
                    res.isOpen 
                      ? 'bg-emerald-500/90 text-white border-emerald-400/20 shadow-emerald-500/20' 
                      : 'bg-rose-500/90 text-white border-rose-400/20 shadow-rose-500/20'
                  }`}>
                    {res.isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                  
                  {/* Distance Badge */}
                  {distance !== undefined && (
                    <span className="absolute bottom-4 right-4 px-3 py-1.5 rounded-2xl text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-sm shadow-sm flex items-center gap-1.5 border border-white/10">
                      <FaMapMarkerAlt className="text-orange-400 w-3 h-3" />
                      {distance.toFixed(1)} km away
                    </span>
                  )}
                </div>

                {/* Info Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-500 transition-colors duration-200 line-clamp-1">
                      {res.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                      {res.isOpen ? '⚡ Fast Delivery' : '⏰ Opening Soon'}
                    </p>
                    <p className="text-sm text-slate-500 mt-2.5 line-clamp-2 min-h-[40px]">
                      {res.description || 'Enjoy a wide variety of delicious meals curated just for you.'}
                    </p>
                  </div>
                  
                  {/* Address & Contact Footer */}
                  <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                      <FaMapMarkerAlt className="text-slate-400 mt-0.5 shrink-0" size={13} />
                      <span className="line-clamp-1 text-slate-600">{res.autoLocation.formatedAddress}</span>
                    </div>
                    {res.phone && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <FaPhoneAlt className="text-slate-400 shrink-0" size={12} />
                        <span className="text-slate-600">{res.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default Home;