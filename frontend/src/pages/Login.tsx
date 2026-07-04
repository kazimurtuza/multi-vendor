import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { authService } from "../main";
import toast from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import { useAppData } from "../context/AppContext";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser, setIsAuth } = useAppData();
    const responseGoogle = async (authResult: any) => {
        console.log('authResult = ', authResult)
        setLoading(true)
        try {
            const result = await axios.post(`${authService}/api/auth/login`, {
                code: authResult['code']
            })
            console.log(result)
            localStorage.setItem('token', result.data.token)
            setUser(result.data.user);
            setIsAuth(true);
            toast.success(result.data.message)
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            toast.error('Problem while login');
            setLoading(false)
        }

    }

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: "auth-code"

    })

    return (

        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <div className="flex justify-center mb-5">

                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">

                        L

                    </div>

                </div>

                <h1 className="text-3xl font-bold text-center text-gray-800">

                    Welcome Back

                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">

                    Sign in to continue

                </p>

                <button

                    onClick={() => googleLogin()}

                    className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 font-medium text-gray-700 hover:bg-gray-100 transition duration-200"

                >
                    {loading ? "Signin..." : "Continue with Google"}
                    <FcGoogle size={24} />

                </button>

                <div className="mt-8 text-center text-sm text-gray-400">

                    Secure login powered by Google OAuth

                </div>

            </div>

        </div>

    );
}

export default Login