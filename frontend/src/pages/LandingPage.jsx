import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import SplashScreen from "../components/SplashScreen";
import toast from "react-hot-toast";

export default function LandingPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const timeBasedGreeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    }, []);

    const handleLogout = async () => {
        try {
            const username = user.displayName;

            await signOut(auth);

            const goodbyeMessages = [
                `See you soon, ${username}!`,
                `Goodbye, ${username}! Come back anytime!`,
                `Thanks for using Explain My Bills, ${username}!`,
                `Have a great day, ${username}!`,
            ];
            const randomMessage =
                goodbyeMessages[
                    Math.floor(Math.random() * goodbyeMessages.length)
                ];

            toast.success(randomMessage, {
                style: { fontSize: "16px" },
                icon: "👋",
            });
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
            toast.error("Error signing out. Please try again.", {
                style: {
                    fontSize: "16px",
                },
            });
        }
    };

    if (loading) {
        return <SplashScreen />;
    }

    return (
        <div className="relative min-h-screen w-screen flex flex-col items-center justify-center bg-[#1B1C21] text-white overflow-hidden px-4">
            <div className="absolute right-1/5 top-1/6 w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full bg-gray-100 opacity-10 blur-3xl pointer-events-none z-0"></div>

            <div className="z-10">
                <p className="text-lg md:text-2xl mb-2 font-semibold">
                    <span className="text-yellow-300">
                        {user ? timeBasedGreeting : "Welcome"}
                    </span>
                    {user && (
                        <span className="text-white">{`, ${
                            user.displayName || user.email.split("@")[0]
                        }!`}</span>
                    )}
                    {!user && <span className="text-white">!</span>}
                </p>
                <h1 className="text-4xl md:text-7xl font-bold mb-10 md:mb-14">
                    Explain My Bills!
                </h1>
            </div>

            <div className="z-10 w-full flex flex-col gap-4 items-center md:flex-row md:justify-center md:gap-10 md:w-auto px-9">
                {user ? (
                    <>
                        <Link
                            to="/dashboard"
                            className="rounded-xl py-3 text-lg border-2 border-white text-white font-semibold w-full md:w-auto px-12 hover:bg-gray-100 text-center hover:text-black transition"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="rounded-xl text-center py-3 text-lg border-2 border-white text-white font-semibold w-full md:w-auto px-12 hover:bg-gray-100 hover:text-black transition hover:cursor-pointer"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/signup"
                            className="rounded-xl py-3 text-lg border-2 border-white text-white font-semibold w-full md:w-auto px-12 hover:bg-gray-100 hover:text-black transition text-center"
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/signin"
                            className="rounded-xl py-3 text-lg border-2 border-white text-white font-semibold w-full md:w-auto px-12 hover:bg-gray-100 hover:text-black transition text-center"
                        >
                            Sign In
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
