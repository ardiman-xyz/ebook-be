// components/Documentation/VideoTutorials.tsx

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Play,
    Clock,
    Eye,
    Star,
    Monitor,
    Smartphone,
    Users,
    Settings,
    Shield,
    TrendingUp,
    BookOpen,
    Download,
    ExternalLink,
    PlayCircle,
    Pause,
    Volume2,
    Maximize,
    RotateCcw,
} from "lucide-react";

interface VideoTutorial {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    category:
        | "Getting Started"
        | "License Management"
        | "Troubleshooting"
        | "Advanced Features";
    thumbnail: string;
    videoUrl?: string;
    isComingSoon?: boolean;
    views: number;
    rating: number;
}

export const VideoTutorials: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(
        null
    );

    const tutorials: VideoTutorial[] = [
        {
            id: "1",
            title: "Membuat License Pertama Anda",
            description:
                "Panduan step-by-step lengkap untuk membuat license pertama dari awal sampai customer bisa aktivasi.",
            duration: "8:30",
            level: "Beginner",
            category: "Getting Started",
            thumbnail: "/video-thumbnails/create-first-license.jpg",
            views: 1250,
            rating: 4.8,
        },
        {
            id: "2",
            title: "Memahami Jenis-jenis License",
            description:
                "Penjelasan detail perbedaan DEMO, TRIAL, FULL, ENTERPRISE, dan LIFETIME license beserta use case-nya.",
            duration: "12:15",
            level: "Beginner",
            category: "Getting Started",
            thumbnail: "/video-thumbnails/license-types.jpg",
            views: 980,
            rating: 4.9,
        },
        {
            id: "3",
            title: "Mengelola Device & Max Device Limit",
            description:
                'Cara kerja sistem device limitation, troubleshooting "device limit exceeded", dan best practices.',
            duration: "10:45",
            level: "Intermediate",
            category: "License Management",
            thumbnail: "/video-thumbnails/device-management.jpg",
            views: 750,
            rating: 4.7,
        },
        {
            id: "4",
            title: "Suspend vs Revoke: Kapan dan Bagaimana",
            description:
                "Perbedaan suspend dan revoke, scenarios penggunaan, dan cara reactivate license yang di-suspend.",
            duration: "9:20",
            level: "Intermediate",
            category: "License Management",
            thumbnail: "/video-thumbnails/suspend-revoke.jpg",
            views: 620,
            rating: 4.6,
        },
        {
            id: "5",
            title: "Troubleshooting License Activation",
            description:
                "Solusi untuk masalah aktivasi yang gagal, error messages, dan cara membantu customer.",
            duration: "15:30",
            level: "Intermediate",
            category: "Troubleshooting",
            thumbnail: "/video-thumbnails/troubleshooting.jpg",
            views: 890,
            rating: 4.8,
        },
        {
            id: "6",
            title: "Monitoring & Analytics Dashboard",
            description:
                "Cara membaca analytics, tracking penggunaan customer, dan identify patterns untuk business insights.",
            duration: "18:45",
            level: "Advanced",
            category: "Advanced Features",
            thumbnail: "/video-thumbnails/analytics.jpg",
            views: 420,
            rating: 4.9,
        },
        {
            id: "7",
            title: "Customer Support Best Practices",
            description:
                "Tips menangani pertanyaan customer, SOP untuk berbagai kasus, dan komunikasi yang efektif.",
            duration: "14:20",
            level: "Intermediate",
            category: "Advanced Features",
            thumbnail: "/video-thumbnails/customer-support.jpg",
            views: 340,
            rating: 4.7,
        },
        {
            id: "8",
            title: "API Integration untuk Developer",
            description:
                "Tutorial integrasi license system ke aplikasi Anda menggunakan REST API yang tersedia.",
            duration: "25:10",
            level: "Advanced",
            category: "Advanced Features",
            thumbnail: "/video-thumbnails/api-integration.jpg",
            isComingSoon: true,
            views: 0,
            rating: 0,
        },
    ];

    const categories = [
        "all",
        "Getting Started",
        "License Management",
        "Troubleshooting",
        "Advanced Features",
    ];

    const filteredTutorials =
        selectedCategory === "all"
            ? tutorials
            : tutorials.filter((t) => t.category === selectedCategory);

    const getLevelColor = (level: string) => {
        switch (level) {
            case "Beginner":
                return "bg-green-100 text-green-800 border-green-200";
            case "Intermediate":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Advanced":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getTotalDuration = () => {
        const totalMinutes = tutorials.reduce((total, tutorial) => {
            const [minutes, seconds] = tutorial.duration.split(":").map(Number);
            return total + minutes + seconds / 60;
        }, 0);
        return Math.round(totalMinutes);
    };

    const openVideoModal = (tutorial: VideoTutorial) => {
        if (!tutorial.isComingSoon) {
            setSelectedVideo(tutorial);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Stats */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Play className="h-6 w-6 text-purple-600" />
                        </div>
                        Video Tutorial Library
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Panduan video lengkap untuk menguasai sistem manajemen
                        lisensi
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                            <div className="flex items-center gap-2 mb-1">
                                <PlayCircle className="h-4 w-4 text-purple-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    Total Videos
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                                {tutorials.length}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    Total Duration
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                                {getTotalDuration()}m
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                            <div className="flex items-center gap-2 mb-1">
                                <Eye className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    Total Views
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                                {tutorials
                                    .reduce((sum, t) => sum + t.views, 0)
                                    .toLocaleString()}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    Avg Rating
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-600">
                                {(
                                    tutorials
                                        .filter((t) => t.rating > 0)
                                        .reduce((sum, t) => sum + t.rating, 0) /
                                    tutorials.filter((t) => t.rating > 0).length
                                ).toFixed(1)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Category Filter */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        Browse by Category
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={
                                    selectedCategory === category
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                                className="capitalize"
                            >
                                {category === "all" ? "All Videos" : category}
                                <Badge variant="secondary" className="ml-2">
                                    {category === "all"
                                        ? tutorials.length
                                        : tutorials.filter(
                                              (t) => t.category === category
                                          ).length}
                                </Badge>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Learning Path Recommendations */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Recommended Learning Path
                    </CardTitle>
                    <CardDescription>
                        Urutan belajar yang disarankan untuk pemula
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-green-600">
                                    1
                                </span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium">
                                    Membuat License Pertama Anda
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Start here untuk memahami basic workflow
                                </p>
                            </div>
                            <Badge className={getLevelColor("Beginner")}>
                                Beginner
                            </Badge>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                    2
                                </span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium">
                                    Memahami Jenis-jenis License
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Pelajari perbedaan tiap tipe license
                                </p>
                            </div>
                            <Badge className={getLevelColor("Beginner")}>
                                Beginner
                            </Badge>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg">
                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-yellow-600">
                                    3
                                </span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium">
                                    Mengelola Device & Max Device Limit
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Deep dive ke device management
                                </p>
                            </div>
                            <Badge className={getLevelColor("Intermediate")}>
                                Intermediate
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Video Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {selectedCategory === "all"
                            ? "All Videos"
                            : selectedCategory}
                    </CardTitle>
                    <CardDescription>
                        {filteredTutorials.length} video
                        {filteredTutorials.length !== 1 ? "s" : ""} available
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTutorials.map((tutorial) => (
                            <div
                                key={tutorial.id}
                                className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                                    tutorial.isComingSoon
                                        ? "opacity-60"
                                        : "cursor-pointer"
                                }`}
                                onClick={() => openVideoModal(tutorial)}
                            >
                                {/* Thumbnail */}
                                <div className="relative bg-gray-200 dark:bg-gray-700 h-40 flex items-center justify-center">
                                    {tutorial.isComingSoon ? (
                                        <div className="text-center">
                                            <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">
                                                Coming Soon
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Play className="h-12 w-12 text-white bg-black bg-opacity-50 rounded-full p-3" />
                                        </div>
                                    )}

                                    {/* Duration Badge */}
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                        {tutorial.duration}
                                    </div>

                                    {/* Level Badge */}
                                    <div className="absolute top-2 left-2">
                                        <Badge
                                            className={getLevelColor(
                                                tutorial.level
                                            )}
                                        >
                                            {tutorial.level}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-medium mb-2 line-clamp-2">
                                        {tutorial.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                        {tutorial.description}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {tutorial.views.toLocaleString()}
                                            </div>
                                            {tutorial.rating > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-yellow-500" />
                                                    {tutorial.rating}
                                                </div>
                                            )}
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {tutorial.category}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Video Player Modal Placeholder */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">
                                    {selectedVideo.title}
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedVideo(null)}
                                >
                                    ✕
                                </Button>
                            </div>

                            {/* Video Player Placeholder */}
                            <div className="bg-gray-900 aspect-video rounded-lg flex items-center justify-center mb-4">
                                <div className="text-center text-white">
                                    <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">Video Player</p>
                                    <p className="text-sm opacity-75">
                                        Duration: {selectedVideo.duration}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Badge
                                        className={getLevelColor(
                                            selectedVideo.level
                                        )}
                                    >
                                        {selectedVideo.level}
                                    </Badge>
                                    <Badge variant="outline">
                                        {selectedVideo.category}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Eye className="h-4 w-4" />
                                        {selectedVideo.views.toLocaleString()}{" "}
                                        views
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        {selectedVideo.rating}/5
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300">
                                    {selectedVideo.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Additional Resources */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5 text-blue-600" />
                        Additional Resources
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-blue-600" />
                                Quick Reference Guide
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                PDF cheat sheet dengan shortcuts dan common
                                commands.
                            </p>
                            <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-2" />
                                Download PDF
                            </Button>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                <ExternalLink className="h-4 w-4 text-green-600" />
                                API Documentation
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                Technical documentation untuk developer
                                integration.
                            </p>
                            <Button size="sm" variant="outline">
                                <ExternalLink className="h-3 w-3 mr-2" />
                                View Docs
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Help & Support */}
            <Alert>
                <Monitor className="h-4 w-4" />
                <AlertDescription>
                    <strong>Need Help?</strong> Jika ada video tutorial yang
                    ingin Anda request atau butuh bantuan lebih lanjut, silakan
                    contact support team. Kami akan dengan senang hati membantu!
                </AlertDescription>
            </Alert>
        </div>
    );
};
