import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    BookOpen,
    Menu,
    X,
    Download,
    Shield,
    Users,
    Phone,
    Mail,
    MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicLayoutProps {
    children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu when clicking outside
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Navigation items
    const navigationItems = [
        { name: "Beranda", href: "/" },
        { name: "Download", href: "/downloads" },
        { name: "Tentang", href: "#about" },
        { name: "Kontak", href: "#contact" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            {/* Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200"
                        : "bg-white/80 backdrop-blur-sm border-b border-gray-200"
                }`}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                INOBEL
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop CTA Button */}
                        <div className="hidden md:flex">
                            <Link href="/downloads">
                                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Overlay */}
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
                            onClick={closeMenu}
                            style={{ top: "64px" }} // Start below header
                        />

                        {/* Mobile Menu */}
                        <div
                            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-200 md:hidden"
                            style={{ zIndex: 40 }}
                        >
                            <nav className="px-4 py-6 space-y-4">
                                {navigationItems.map((item, index) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={closeMenu}
                                        className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                        style={{
                                            animationDelay: `${index * 50}ms`,
                                            animation:
                                                "slideInFromTop 0.3s ease-out forwards",
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                {/* Mobile CTA Button */}
                                <div className="pt-4 border-t border-gray-200">
                                    <Link href="/downloads" onClick={closeMenu}>
                                        <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Aplikasi
                                        </Button>
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </>
                )}
            </header>

            {/* Main Content */}
            <main className="pt-16">{children}</main>
        </div>
    );
};

export default PublicLayout;
