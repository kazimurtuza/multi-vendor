import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../main";
import type { AppContextType, LocationData, User } from "../types";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [city, setCity] = useState("Fecthing Location....");

    async function fetchUser() {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${authService}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(data);
            setIsAuth(true);
            setLoading(false);

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Your browser does not support Geolocation.");
            return;
        }
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {

                const { latitude, longitude } = position.coords;
                console.log("Latitude:", latitude);
                console.log("Longitude:", longitude);
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    console.log("location data ", res)

                    if (!res.ok) {
                        throw new Error(`HTTP Error: ${res.status}`);
                    }

                    const data = await res.json();


                    setLocation({
                        latitude,
                        longitude,
                        formattedAddress: data.display_name || "Current location"
                    });
                    setCity(
                        data.address.city || data.address.town || data.address.village || "your location"
                    );

                    console.log("Location:", data);
                    console.log("Address:", data.display_name);
                } catch (error) {
                    setLocation({
                        latitude,
                        longitude,
                        formattedAddress: "Current location"
                    });
                    setCity("Faild to load")
                    console.error("Fetch Error:", error);
                } finally {
                    setLoadingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation Error:", error);
                setLoadingLocation(false);
            }
        );
    }, []);

    return (<AppContext.Provider value={{ isAuth, user, loading, setUser, setIsAuth, setLoading, loadingLocation, location, city }}>{children}</AppContext.Provider>
    )
};

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("userAppData must be used within appProvider");
    }
    return context;


}
