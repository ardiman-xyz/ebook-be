// resources/js/Pages/Documentation.tsx

import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
    BookOpen,
    Shield,
    Users,
    Key,
    CheckCircle,
    Zap,
    DollarSign,
    Clock,
    Target,
    Play,
    Settings,
    AlertTriangle,
} from "lucide-react";
import { LicenseTypesDocumentation } from "./_components/documentation/LicenseTypes";
import { VideoTutorials } from "./_components/documentation/VideoTutorials";
import { GettingStarted } from "./_components/documentation/GettingStarted";
import { LicenseManagementGuide } from "./_components/documentation/LicenseManagement";

interface User {
    id: number;
    name: string;
    email: string;
}

interface DocumentationProps {
    auth: {
        user: User;
    };
}

export default function Documentation({ auth }: DocumentationProps) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Dokumentasi Sistem Lisensi
                    </h2>
                    <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                        <BookOpen className="w-3 h-3 mr-1" />
                        Panduan Lengkap
                    </Badge>
                </div>
            }
        >
            <Head title="Dokumentasi" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-8">
                    {/* Hero Section */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                </div>
                                Sistem Manajemen Lisensi
                            </CardTitle>
                            <CardDescription className="text-lg max-w-2xl mx-auto">
                                Platform untuk mengelola lisensi software dengan
                                kontrol akses yang aman, tracking penggunaan
                                real-time, dan manajemen customer yang efisien.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Tabs for Documentation Sections */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger
                                value="overview"
                                className="flex items-center gap-2"
                            >
                                <Target className="w-4 h-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="getting-started"
                                className="flex items-center gap-2"
                            >
                                <Play className="w-4 h-4" />
                                Memulai
                            </TabsTrigger>
                            <TabsTrigger
                                value="license-types"
                                className="flex items-center gap-2"
                            >
                                <Key className="w-4 h-4" />
                                Jenis Lisensi
                            </TabsTrigger>
                            <TabsTrigger
                                value="management"
                                className="flex items-center gap-2"
                            >
                                <Settings className="w-4 h-4" />
                                Pengelolaan
                            </TabsTrigger>
                            {/* <TabsTrigger
                                value="videos"
                                className="flex items-center gap-2"
                            >
                                <Play className="w-4 h-4" />
                                Video Tutorial
                            </TabsTrigger> */}
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            {/* Apa itu Sistem Lisensi */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-blue-600" />
                                        Apa itu Sistem Lisensi?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Sistem ini mengontrol siapa yang bisa
                                        menggunakan software Anda, di perangkat
                                        mana, dan fitur apa saja yang bisa
                                        diakses. Seperti "kunci digital" untuk
                                        software.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="font-medium flex items-center gap-2">
                                                <Users className="h-4 w-4 text-green-600" />
                                                Untuk Customer
                                            </h4>
                                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                                    Masukkan license key di
                                                    software
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                                    Software aktif dan bisa
                                                    digunakan
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                                    Fitur sesuai dengan jenis
                                                    lisensi
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="font-medium flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-blue-600" />
                                                Untuk Admin/Developer
                                            </h4>
                                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                                                    Kontrol akses software
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                                                    Tracking penggunaan
                                                    real-time
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                                                    Kelola customer dan
                                                    pembayaran
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        {/* Getting Started Tab */}
                        <TabsContent
                            value="getting-started"
                            className="space-y-6"
                        >
                            <GettingStarted />
                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mulai Sekarang</CardTitle>
                                    <CardDescription>
                                        Pilih aksi yang ingin Anda lakukan
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Button
                                            className="h-auto p-4 justify-start"
                                            variant="outline"
                                            onClick={() =>
                                                (window.location.href =
                                                    "/dashboard")
                                            }
                                        >
                                            <div className="flex items-start gap-3">
                                                <Key className="h-5 w-5 text-blue-600 mt-0.5" />
                                                <div className="text-left">
                                                    <div className="font-medium">
                                                        Buat Lisensi Pertama
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Generate license key
                                                        untuk customer baru
                                                    </div>
                                                </div>
                                            </div>
                                        </Button>

                                        <Button
                                            className="h-auto p-4 justify-start"
                                            variant="outline"
                                            onClick={() =>
                                                (window.location.href =
                                                    "/dashboard")
                                            }
                                        >
                                            <div className="flex items-start gap-3">
                                                <Users className="h-5 w-5 text-green-600 mt-0.5" />
                                                <div className="text-left">
                                                    <div className="font-medium">
                                                        Kelola Lisensi
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Lihat dan edit lisensi
                                                        yang sudah ada
                                                    </div>
                                                </div>
                                            </div>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent
                            value="license-types"
                            className="space-y-6"
                        >
                            <LicenseTypesDocumentation />
                        </TabsContent>

                        {/* License Types Tab */}
                        <TabsContent value="management" className="space-y-6">
                            <LicenseManagementGuide />
                        </TabsContent>

                        {/* Video Tutorials Tab */}
                        <TabsContent value="videos" className="space-y-6">
                            <VideoTutorials />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
