import { useEffect, useState } from 'react'
import { useAppData } from '../context/AppContext'
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
    FcShop,
    FcBusinessman,
    FcSearch,
    FcShipped,
} from "react-icons/fc";

const Navbar = () => {
    const { isAuth } = useAppData();
    const currentLocation = useLocation();
    const isHomePage = currentLocation.pathname === '/';
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search) {
                setSearchParams({ search })
            } else {
                setSearchParams({})
            }
        }, 400)

        return clearTimeout(timer)
    }, [search])

    return (
        <nav className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto h-16 px-5 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <FcShop size={36} />
                    <Link to="/">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Food<span className="text-orange-500">Hub</span>
                        </h1>
                    </Link>
                </div>

                {/* Search */}

                {isHomePage && (

                    <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-10">

                        <div className="flex items-center w-full border rounded-full px-4 py-2 bg-gray-50">

                            <FcSearch size={22} />

                            <input
                                type="text"
                                placeholder="Search food..."
                                className="w-full bg-transparent outline-none px-2"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}

                            />

                        </div>

                        {/* City */}

                        <div className="whitespace-nowrap font-medium text-gray-700">

                            📍 Dhaka

                        </div>

                    </div>

                )}

                {/* Right Side */}

                <div className="flex items-center gap-5">

                    <button className="relative cursor-pointer">

                        <FcShipped size={32} />

                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            2
                        </span>

                    </button>

                    <Link to="/account" className="cursor-pointer">

                        <FcBusinessman size={34} />

                    </Link>

                    {!isAuth && (

                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full transition">

                            Login

                        </button>

                    )}

                </div>

            </div>

        </nav>

    );
}

export default Navbar