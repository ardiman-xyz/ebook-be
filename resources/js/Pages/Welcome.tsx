import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Download,
    Star,
    Shield,
    Clock,
    Check,
    Eye,
    Users,
    Award,
    FileText,
    Heart,
    LucideIcon,
    MessageCircle,
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
} from "lucide-react";
import { Head } from "@inertiajs/react";
import PublicLayout from "@/components/PublicLayout";

// Type Definitions
interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface FeatureCardProps {
    feature: Feature;
}

interface Stat {
    value: string;
    label: string;
    color: string;
}

// Ebook Preview Modal Component
const EbookPreviewModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
    isOpen,
    onClose,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(1);

    // Sample pages - ganti dengan URL gambar yang sebenarnya
    const previewPages = [
        {
            id: 1,
            title: "Cover - Kepala Sekolah Sebagai Pemimpin Pembelajaran Inovatif",
            image: "/images/book1.png",
            description: "Cover ebook yang menampilkan judul dan penulis",
        },
        {
            id: 2,
            title: "Daftar Isi",
            image: "/images/book2.png",
            description: "Daftar isi lengkap dengan 4 bab utama dan sub-bab",
        },
        {
            id: 3,
            title: "Bab I - Pendahuluan",
            image: "/images/book3.png",
            description: "Pendahuluan tentang inovasi dalam dunia pendidikan",
        },
        {
            id: 4,
            title: "Pengembangan Diri Pemimpin Inovatif",
            image: "/images/book4.png",
            description: "Strategi pengembangan kepemimpinan transformasional",
        },
    ];

    const totalPages = previewPages.length;

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const zoomIn = () => {
        if (zoom < 2) {
            setZoom(zoom + 0.2);
        }
    };

    const zoomOut = () => {
        if (zoom > 0.6) {
            setZoom(zoom - 0.2);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[10000] p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h3 className="text-lg font-semibold">Preview Ebook</h3>
                        <p className="text-sm text-gray-600">
                            Halaman {currentPage} dari {totalPages} -{" "}
                            {previewPages[currentPage - 1]?.title}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={zoomOut}
                            disabled={zoom <= 0.6}
                        >
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-sm px-2">
                            {Math.round(zoom * 100)}%
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={zoomIn}
                            disabled={zoom >= 2}
                        >
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="relative bg-gray-100 h-[600px] overflow-auto">
                    <div className="flex items-center justify-center h-full p-8">
                        <div
                            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-200"
                            style={{ transform: `scale(${zoom})` }}
                        >
                            <img
                                src={previewPages[currentPage - 1]?.image}
                                alt={previewPages[currentPage - 1]?.title}
                                className="w-full h-auto max-w-md"
                                style={{ maxHeight: "600px" }}
                            />
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-400 rounded-full p-2 shadow-lg transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-400 rounded-full p-2 shadow-lg transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {previewPages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        currentPage === index + 1
                                            ? "bg-blue-600"
                                            : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                                />
                            ))}
                        </div>

                        <div className="flex items-center space-x-3">
                            <p className="text-sm text-gray-600">
                                {previewPages[currentPage - 1]?.description}
                            </p>
                            <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                                <Download className="w-4 h-4 mr-2" />
                                Beli Sekarang
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// WhatsApp Floating Button Component
const WhatsAppFloat: React.FC = () => {
    const whatsappNumber = "6281344406998"; // Nomor WhatsApp tanpa tanda +
    const message =
        "Halo! Saya ingin membeli ebook 'Kepala Sekolah Sebagai Pemimpin Pembelajaran Inovatif' seharga Rp 149.000. Bagaimana cara pembayarannya?";

    const handleWhatsAppClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            message
        )}`;
        window.open(url, "_blank", "noopener,noreferrer");
        console.log("WhatsApp clicked!", url); // Debug log
    };

    return (
        <div
            className="fixed bottom-6 right-6 z-[9999]"
            style={{ zIndex: 9999 }}
        >
            {/* Floating Button */}
            <div className="relative">
                <button
                    onClick={handleWhatsAppClick}
                    className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer"
                    style={{ cursor: "pointer" }}
                    type="button"
                    title="Beli via WhatsApp"
                >
                    <MessageCircle className="w-7 h-7" />
                </button>

                {/* Notification Dot */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center pointer-events-none">
                    <span className="text-xs text-white font-bold">1</span>
                </div>

                {/* Ripple Effect */}
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-green-400 animate-ping opacity-20 pointer-events-none"></div>
            </div>
        </div>
    );
};

// Header Component
const Header: React.FC = () => {
    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            EduBook
                        </span>
                    </div>
                    <nav className="flex items-center space-x-6">
                        <a
                            href="#preview"
                            className="text-sm font-medium hover:text-blue-600 transition-colors"
                        >
                            Preview
                        </a>
                        <a
                            href="#features"
                            className="text-sm font-medium hover:text-blue-600 transition-colors"
                        >
                            Fitur
                        </a>
                        <a
                            href="#pricing"
                            className="text-sm font-medium hover:text-blue-600 transition-colors"
                        >
                            Harga
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

// Hero Section Component
const HeroSection: React.FC = () => {
    const [likes, setLikes] = useState(1247);
    const [isLiked, setIsLiked] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleLike = () => {
        if (isLiked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setIsLiked(!isLiked);
    };

    return (
        <>
            <section className="py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                🔥 Bestseller Pendidikan
                            </Badge>
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                Kepala Sekolah Sebagai
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                                    {" "}
                                    Pemimpin Pembelajaran Inovatif
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Panduan lengkap untuk kepala sekolah dalam
                                mengembangkan kepemimpinan pembelajaran yang
                                inovatif dan transformatif di era modern.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/downloads"
                                className="flex items-center rounded bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8"
                            >
                                <Download className="mr-2 h-5 w-5" />
                                Download Sekarang
                            </a>
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8"
                                onClick={() => setIsPreviewOpen(true)}
                            >
                                <Eye className="mr-2 h-5 w-5" />
                                Preview Gratis
                            </Button>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <Shield className="w-4 h-4 text-green-600" />
                                <span>Garansi 30 hari</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span>Akses seumur hidup</span>
                            </div>
                        </div>
                    </div>

                    <BookCover onPreviewClick={() => setIsPreviewOpen(true)} />
                </div>
            </section>

            {/* Preview Modal */}
            <EbookPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
            />
        </>
    );
};

// Book Cover Component
const BookCover: React.FC<{ onPreviewClick?: () => void }> = ({
    onPreviewClick,
}) => {
    return (
        <div className="flex justify-center lg:justify-end">
            <div className="relative">
                <div
                    className="w-80 h-96 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300 cursor-pointer"
                    onClick={onPreviewClick}
                >
                    <div className="h-full bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                        <div className="text-center space-y-4">
                            <BookOpen className="w-16 h-16 mx-auto" />
                            <h3 className="text-xl font-bold">
                                Kepala Sekolah Sebagai Pemimpin Pembelajaran
                                Inovatif
                            </h3>
                            <p className="text-sm opacity-90">
                                275+ Halaman Panduan Lengkap
                            </p>
                            {onPreviewClick && (
                                <div className="mt-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
                                        <Eye className="w-4 h-4 inline mr-1" />
                                        Klik untuk preview
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold transform rotate-12">
                    BESTSELLER
                </div>
                <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold transform -rotate-12">
                    4.9★ Rating
                </div>
            </div>
        </div>
    );
};

// Features Section Component
const FeaturesSection: React.FC = () => {
    const features: Feature[] = [
        {
            icon: Shield,
            title: "Akses Seumur Hidup",
            description: "Beli sekali, akses selamanya tanpa biaya tambahan",
        },
        {
            icon: Download,
            title: "Download Instan",
            description: "Langsung dapat diunduh setelah pembelian",
        },
        {
            icon: FileText,
            title: "Format Lengkap",
            description: "Tersedia dalam format PDF dan EPUB",
        },
    ];

    return (
        <section id="features" className="py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Mengapa Memilih Ebook Ini?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Investasi terbaik untuk mengembangkan kemampuan mengajar
                    dengan teknologi digital
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
                {features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} />
                ))}
            </div>
        </section>
    );
};

// Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
    const IconComponent = feature.icon;

    return (
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">
                    {feature.description}
                </CardDescription>
            </CardHeader>
        </Card>
    );
};

// Pricing Section Component
const PricingSection: React.FC = () => {
    return (
        <section id="pricing" className="py-16">
            <Card className="border-0 bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <CardContent className="p-12 text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl font-bold">
                            Dapatkan Akses Sekarang
                        </h2>
                        <p className="text-xl text-green-100">
                            Investasi sekali untuk pembelajaran seumur hidup
                        </p>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-6">
                            <div className="space-y-2">
                                <div className="text-5xl font-bold">
                                    Rp 149.000
                                </div>
                                <div className="text-green-200 line-through text-xl">
                                    Rp 299.000
                                </div>
                                <div className="text-yellow-300 font-semibold text-lg">
                                    Hemat 50%!
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full bg-white text-blue-600 hover:bg-gray-100 text-lg py-6"
                            >
                                <Download className="mr-2 h-6 w-6" />
                                Beli Sekarang & Download Instan
                            </Button>

                            <p className="text-sm text-green-200">
                                ✓ Pembayaran aman ✓ Download langsung ✓ Garansi
                                30 hari
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

// Stats Section Component
const StatsSection: React.FC = () => {
    const stats: Stat[] = [
        { value: "12,350+", label: "Download", color: "text-green-600" },
        { value: "4.9/5", label: "Rating", color: "text-blue-600" },
        { value: "2,847", label: "Ulasan", color: "text-purple-600" },
        { value: "300+", label: "Halaman", color: "text-orange-600" },
    ];

    return (
        <section className="py-16">
            <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="space-y-2">
                                <div
                                    className={`text-3xl font-bold ${stat.color}`}
                                >
                                    {stat.value}
                                </div>
                                <div className="text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

// Footer Component
const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">EduBook</span>
                    </div>
                    <p className="text-gray-400">
                        © 2024 EduBook. Semua hak cipta dilindungi.
                    </p>
                    <div className="flex justify-center space-x-6 text-sm">
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Syarat & Ketentuan
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Kebijakan Privasi
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Bantuan
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Main Landing Page Component
// Main Landing Page Component
const EbookLandingPage: React.FC = () => {
    return (
        <>
            <Head title="Home" />
            <PublicLayout>
                <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                    {/* <Header /> */}

                    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <HeroSection />
                        <FeaturesSection />
                        <PricingSection />
                        {/* <StatsSection /> */}
                    </main>

                    <Footer />

                    {/* WhatsApp Floating Button */}
                    <WhatsAppFloat />
                </div>
            </PublicLayout>
        </>
    );
};

export default EbookLandingPage;
