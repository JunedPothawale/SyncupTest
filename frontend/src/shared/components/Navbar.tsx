"use client";

import { useEffect, useState } from "react";

import { Bell, User, BriefcaseBusiness, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { PostJobModal } from "./JobPostModel";
import { useAuthStore } from "../store/auth.store";
import { logoutUser } from "../services/auth.service";
import NotificationDrawer from "./NotificationDrawer";
import { sendRegister, socket } from "../lib/socket";


export default function Navbar() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();

    const handleLogout = async () => {
        await logoutUser()
        logout()
    }
    const [open, setOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;
        if (!socket.connected) {
            socket.connect();
        }
        sendRegister(user.id)
        // RECEIVE NOTIFICATION
        socket.on("notification", (payload) => {
            console.log(payload);
            // UPDATE STATE
            setNotifications((prev) => [payload, ...prev,]);
        });

        return () => { socket.off("notification"); };
    }, [user, isAuthenticated])



    return (
        <>
            <header className="w-full h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-10">

                    {/* LOGO */}
                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl border-2 border-blue-600 flex items-center justify-center text-blue-600">

                            <BriefcaseBusiness className="w-5 h-5" />
                        </div>

                        <span className="text-[18px] font-bold text-gray-900">
                            JobPortal
                        </span>
                    </div>

                    {/* NAV */}
                    <nav className="hidden md:flex items-center gap-8">

                        <a className="text-[15px] font-medium text-gray-800 cursor-pointer">
                            Find Jobs
                        </a>

                        <a className="text-[15px] font-medium text-gray-600 cursor-pointer hover:text-black transition">
                            Companies
                        </a>

                        <a className="text-[15px] font-medium text-gray-600 cursor-pointer hover:text-black transition">
                            Resources
                        </a>
                    </nav>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-5">

                    {/* IF LOGGED IN */}
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={() =>
                                    setNotificationOpen(true)
                                } className="relative text-gray-600 hover:text-black transition">

                                <Bell className="w-5 h-5" />

                                {notifications.length > 0 && (

                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">

                                        {notifications.length}

                                    </span>
                                )}
                            </button>

                            <button onClick={handleLogout} className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-black transition">
                                <LogOut className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => {
                                    if (user?.user?.role !== "recruiter") {
                                        alert("Only recruiters can post jobs");
                                        return;
                                    }
                                    setOpen(true);
                                }}
                                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold transition">
                                Post a Job
                            </button>
                        </>
                    ) : (

                        /* IF NOT LOGGED IN */
                        <button
                            onClick={() =>
                                router.push("/login")
                            }
                            className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold transition"
                        >
                            Login
                        </button>
                    )}
                </div>
            </header>

            {/* MODAL */}
            {open && (
                <PostJobModal
                    onClose={() =>
                        setOpen(false)
                    }
                />
            )}

            <NotificationDrawer
                open={notificationOpen}
                onClose={() =>
                    setNotificationOpen(false)
                }
                notifications={notifications}
            />
        </>
    );
}