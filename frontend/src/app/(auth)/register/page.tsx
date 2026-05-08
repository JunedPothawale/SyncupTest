"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/shared/services/axios.service";

type Role = "recruiter" | "candidate";

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "candidate" as Role,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!form.name) return "Name is required";
        if (!form.email) return "Email is required";
        if (form.password.length < 6) return "Password must be at least 6 characters";
        if (form.password !== form.confirmPassword)
            return "Passwords do not match";
        return "";
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError("");

        try {
            await API.post("/auth/register", {
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
            });

            router.push("/login");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">Create account</h1>
                    <p className="text-sm text-gray-500">Choose your role</p>
                </div>

                {/* Role Selection */}
                <div className="flex gap-2 mb-6">
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, role: "candidate" })}
                        className={`flex-1 py-2 rounded-lg border ${form.role === "candidate"
                            ? "bg-black text-white"
                            : "bg-white"
                            }`}
                    >
                        Candidate
                    </button>

                    <button
                        type="button"
                        onClick={() => setForm({ ...form, role: "recruiter" })}
                        className={`flex-1 py-2 rounded-lg border ${form.role === "recruiter"
                            ? "bg-black text-white"
                            : "bg-white"
                            }`}
                    >
                        Recruiter
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        name="name"
                        placeholder="Full Name"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded-lg"
                    >
                        {loading ? "Creating..." : "Sign up"}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-sm text-center text-gray-500 mt-6">
                    Already have an account?{" "}
                    <span
                        onClick={() => router.push("/login")}
                        className="text-black cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}