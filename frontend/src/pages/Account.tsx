import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppContext'
import toast from 'react-hot-toast';
import {
    FcBusinessman,
    FcHome,
    FcOpenedFolder,
    FcKey,
} from "react-icons/fc";

function Account() {
    const { user, setUser, setIsAuth } = useAppData();
    const firstLetter = user?.name.charAt(0).toUpperCase();
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.setItem('token', "");
        setUser(null);
        setIsAuth(false);
        navigate('/login');
        toast.success('logout successfully ')

    }
    return (

        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

                {/* Header */}

                <div className="bg-green-600 h-28 flex justify-center items-end">

                    <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl font-bold text-green-600 translate-y-10">

                        {firstLetter}

                    </div>

                </div>

                {/* User Info */}
                <div className="pt-14 pb-6 text-center px-6">
                    <h2 className="text-2xl font-bold">
                        {user?.name || "Guest User"}
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {user?.email || "Please login to continue"}
                    </p>
                </div>

                {/* Menu */}

                <div className="px-5 pb-6 space-y-3">
                    {user && (
                        <>

                            <button
                                onClick={() => navigate("/address")}
                                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 transition"
                            >
                                <FcHome size={28} />
                                <span className="font-medium">Your Address</span>
                            </button>

                            <button
                                onClick={() => navigate("/orders")}
                                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 transition"
                            >

                                <FcOpenedFolder size={28} />
                                <span className="font-medium">Your Orders</span>
                            </button>

                            <button
                                onClick={logoutHandler}
                                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 transition"
                            >

                                <FcBusinessman size={28} />
                                <span className="font-medium text-red-500">
                                    Logout
                                </span>
                            </button>
                        </>

                    )}

                    {!user && (

                        <button
                            onClick={() => navigate("/login")}
                            className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
                        >
                            <FcKey size={25} />
                            Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Account