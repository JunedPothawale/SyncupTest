"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/shared/services/auth.service";
import { useAuthStore } from "@/shared/store/auth.store";
import { sendRegister, socket } from "@/shared/lib/socket";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAuth } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 🔥 get redirect param
    const redirect = searchParams.get("redirect");

    const handleLogin =
        async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            try {
                const res = await loginUser({ email, password });
                console.log(res)
                const userEmail = res.data.email
                const userRole = res.data.role
                const data = { email: userEmail, role: userRole }
                setAuth({ id: res.data._id, user: data, isAuthenticated: true });
                socket.connect()
                if (!socket.connected) {
                    socket.connect();
                    console.log("Socket connected");
                    sendRegister(res.data._id)
                }
                router.push(redirect || "/");

            } catch (err: any) {
                setError(err?.response?.data?.message || "Login failed");
            } finally {
                setLoading(false);
            }
        };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Login to your account
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black/20 outline-none"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black/20 outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <button
                            type="button"
                            className="text-gray-500 hover:text-black"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-2 text-sm text-gray-400">
                    <div className="flex-1 h-px bg-gray-200" />
                    OR
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Social Login (UI only) */}
                <button className="w-full border py-2 rounded-lg hover:bg-gray-50">
                    Continue with Google
                </button>

                {/* Footer */}
                <p className="text-sm text-center text-gray-500 mt-6">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => router.push("/register")}
                        className="text-black cursor-pointer"
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}