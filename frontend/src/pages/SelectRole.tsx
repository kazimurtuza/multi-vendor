import { useState } from "react";
import { useAppData } from "../context/AppContext";
import axios from "axios";
import { authService } from "../main";
import { useNavigate } from "react-router-dom";
import { FcBusinessman } from "react-icons/fc";

import { FcShipped } from "react-icons/fc";

import { FcShop } from "react-icons/fc";


type Role = "customer" | "rider" | "seller" | null;

const SelectRole = () => {
    const [role, setRole] = useState<Role>(null);
    const { setUser } = useAppData();
    const navigate = useNavigate();

    const roles = [

        {
            name: "customer" as Role,
            icon: <FcBusinessman size={50} />,
            title: "Customer",
            description: "Order products from different sellers.",

        },

        {

            name: "rider" as Role,
            icon: <FcShipped size={50} />,
            title: "Rider",
            description: "Deliver orders and earn money.",

        },

        {
            name: "seller" as Role,
            icon: <FcShop size={50} />,
            title: "Seller",
            description: "Sell your products online.",

        },

    ];

    const addRole = async () => {
        if (!role) return;

        try {
            const { data } = await axios.put(
                `${authService}/api/auth/add/role`,
                { role },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            localStorage.setItem("token", data.token);
            setUser(data.user);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Select Your Role
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Choose how you want to use the platform.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {roles.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setRole(item.name)}
                            className={`rounded-2xl border-2 p-6 transition-all duration-300 text-left
                ${role === item.name
                                    ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
                                    : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                                }`}
                        >
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center mb-5
                  ${role === item.name
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-700"
                                    }`}
                            >
                                {item.icon}
                            </div>

                            <h2 className="text-xl font-semibold capitalize">
                                {item.title}
                            </h2>

                            <p className="text-slate-500 mt-2">{item.description}</p>
                        </button>
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <button
                        onClick={addRole}
                        disabled={!role}
                        className={`px-10 py-3 rounded-xl font-semibold text-white transition
              ${role
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectRole;