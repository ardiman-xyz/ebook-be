import { Link } from "@inertiajs/react";
import { PropsWithChildren, ReactNode } from "react";
import {
    Download,
    BookOpen,
    Home,
    LogIn,
    Shield,
    ExternalLink,
    Github,
    Mail,
    Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicLayoutProps extends PropsWithChildren {
    header?: ReactNode;
    showLoginButton?: boolean;
}

export default function PublicLayout({
    header,
    children,
    showLoginButton = false,
}: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                href="/"
                                className="flex items-center space-x-3"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-gray-900">
                                        INOBEL
                                    </span>
                                    <div className="text-xs text-gray-500">
                                        Inovasi Pembelaran
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/"
                                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                <span>Home</span>
                            </Link>

                            <Link
                                href="/downloads"
                                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                <span>Downloads</span>
                            </Link>

                            {showLoginButton && (
                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center space-x-2"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Admin Login</span>
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            {showLoginButton && (
                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center space-x-2"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Login</span>
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            {header && (
                <header className="bg-white/60 backdrop-blur-sm shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-bold">
                                    LicenseApp
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Secure license management solution for modern
                                applications. Protect your software with our
                                reliable licensing system.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                Quick Links
                            </h3>
                            <div className="space-y-2">
                                <Link
                                    href="/"
                                    className="block text-gray-400 hover:text-white transition-colors"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/downloads"
                                    className="block text-gray-400 hover:text-white transition-colors"
                                >
                                    Downloads
                                </Link>
                                <a
                                    href="https://docs.yourapp.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-gray-400 hover:text-white transition-colors"
                                >
                                    Documentation
                                </a>
                                <Link
                                    href="/login"
                                    className="block text-gray-400 hover:text-white transition-colors"
                                >
                                    Admin Panel
                                </Link>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Support</h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Mail className="w-4 h-4" />
                                    <span>support@yourapp.com</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Phone className="w-4 h-4" />
                                    <span>+62 812-3456-7890</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Github className="w-4 h-4" />
                                    <a
                                        href="https://github.com/yourcompany/licenseapp"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-colors"
                                    >
                                        GitHub Repository
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Download Stats */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                Download Stats
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Total Downloads:
                                    </span>
                                    <span className="text-white font-semibold">
                                        12.5K+
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Latest Version:
                                    </span>
                                    <span className="text-white font-semibold">
                                        v1.2.3
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Platforms:
                                    </span>
                                    <span className="text-white font-semibold">
                                        6
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Last Update:
                                    </span>
                                    <span className="text-white font-semibold">
                                        Jan 2024
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            © 2024 LicenseApp. All rights reserved.
                            <span className="mx-2">|</span>
                            <Link
                                href="/privacy"
                                className="hover:text-white transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <span className="mx-2">|</span>
                            <Link
                                href="/terms"
                                className="hover:text-white transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
