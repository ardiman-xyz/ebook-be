// pages/Dashboard.tsx

import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye, CheckCircle, XCircle } from "lucide-react";
import { router } from "@inertiajs/react";

// Import komponen-komponen terpisah
import StatsCards from "./_components/StatsCards";
import LicenseForm from "./_components/LicenseForm";
import LicenseList from "./_components/LicenseList";
import { License, LicenseType, DashboardStats, User } from "../types/license";

interface DashboardProps {
    auth: {
        user: User;
    };
    licenses: License[];
    licenseTypes: LicenseType[];
    stats: DashboardStats;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Dashboard({
    auth,
    licenses = [],
    licenseTypes = [],
    stats,
    flash,
}: DashboardProps) {
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [shouldResetForm, setShouldResetForm] = useState<boolean>(false);

    const handleGenerateLicense = async (data: any): Promise<void> => {
        setIsGenerating(true);

        try {
            // Create FormData to handle file upload
            const formData = new FormData();

            // Add all form fields to FormData
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === "payment_receipt" && value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            await router.post("/admin/licenses/generate", formData, {
                forceFormData: true,
                onSuccess: () => {
                    // License generated successfully - trigger form reset
                    setShouldResetForm(true);
                    setTimeout(() => setShouldResetForm(false), 100);
                },
                onError: (errors) => {
                    console.error("Failed to generate license:", errors);
                    // Errors will be handled by flash messages from backend
                },
                onFinish: () => {
                    setIsGenerating(false);
                },
            });
        } catch (error) {
            console.error("Error generating license:", error);
            setIsGenerating(false);
        }
    };

    const copyToClipboard = async (text: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text);
            console.log("Copied to clipboard:", text);
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
        }
    };

    const handleViewLicenseDetails = (license: License): void => {
        // Navigate to license details page
        router.visit(`/admin/licenses/${license.id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    License Management Dashboard
                </h2>
            }
        >
            <Head title="License Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <p className="text-green-800 dark:text-green-200">
                                    {flash.success}
                                </p>
                            </div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-red-600" />
                                <p className="text-red-800 dark:text-red-200">
                                    {flash.error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Stats Cards Component */}
                    <StatsCards licenses={licenses} stats={stats} />

                    {/* Main Content */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <Tabs defaultValue="generate" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger
                                        value="generate"
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Generate License
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="licenses"
                                        className="flex items-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        License List ({licenses.length})
                                    </TabsTrigger>
                                </TabsList>

                                {/* Generate License Tab */}
                                <TabsContent
                                    value="generate"
                                    className="space-y-6 mt-6"
                                >
                                    <LicenseForm
                                        licenseTypes={licenseTypes}
                                        onSubmit={handleGenerateLicense}
                                        isLoading={isGenerating}
                                        onSuccess={shouldResetForm}
                                    />
                                </TabsContent>

                                {/* License List Tab */}
                                <TabsContent
                                    value="licenses"
                                    className="space-y-6 mt-6"
                                >
                                    <LicenseList
                                        licenses={licenses}
                                        onCopy={copyToClipboard}
                                        onViewDetails={handleViewLicenseDetails}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
