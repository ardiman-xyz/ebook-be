import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import {
    BookOpen,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Shield,
    ArrowLeft,
} from "lucide-react";

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Masuk - EduBook" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
                {/* Background Pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 left-10 opacity-10">
                        <BookOpen className="w-16 h-16 text-green-500 animate-pulse" />
                    </div>
                    <div className="absolute top-32 right-20 opacity-10">
                        <BookOpen
                            className="w-12 h-12 text-blue-500 animate-pulse"
                            style={{ animationDelay: "1s" }}
                        />
                    </div>
                    <div className="absolute bottom-20 left-32 opacity-10">
                        <BookOpen
                            className="w-20 h-20 text-purple-500 animate-pulse"
                            style={{ animationDelay: "2s" }}
                        />
                    </div>
                    <div className="absolute bottom-32 right-16 opacity-10">
                        <BookOpen
                            className="w-14 h-14 text-green-500 animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                        />
                    </div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-white/50 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Beranda
                        </Link>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-lg overflow-hidden">
                        {/* Header */}
                        <div className="text-center space-y-4 p-8 pb-6">
                            {/* Logo */}
                            <div className="flex justify-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                    <BookOpen className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Masuk ke EduBook
                                </h1>
                                <p className="text-gray-600">
                                    Akses dan atur lisensi edubook anda
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-8 pb-8 space-y-6">
                            {/* Status Message */}
                            {status && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-600 font-medium">
                                        {status}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-700 block"
                                    >
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-all"
                                            placeholder="Masukkan email Anda"
                                            autoComplete="username"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700 block"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-all"
                                            placeholder="Masukkan password Anda"
                                            autoComplete="current-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium text-base rounded-lg flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    ) : (
                                        <Shield className="w-5 h-5 mr-2" />
                                    )}
                                    {processing ? "Memproses..." : "Masuk"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Dengan masuk, Anda menyetujui{" "}
                            <Link
                                href="#"
                                className="text-blue-600 hover:underline"
                            >
                                Syarat & Ketentuan
                            </Link>{" "}
                            dan{" "}
                            <Link
                                href="#"
                                className="text-blue-600 hover:underline"
                            >
                                Kebijakan Privasi
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
