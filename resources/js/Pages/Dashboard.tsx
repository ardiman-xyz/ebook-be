// pages/Dashboard.tsx

import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Plus,
    Eye,
    CheckCircle,
    XCircle,
    RefreshCw,
    BookOpen,
} from "lucide-react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

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
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
            setCopiedKey(text);
            console.log("Copied to clipboard:", text);

            // Show success feedback
            setTimeout(() => {
                setCopiedKey(null);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                setCopiedKey(text);
                setTimeout(() => setCopiedKey(null), 2000);
            } catch (fallbackError) {
                console.error("Fallback copy failed:", fallbackError);
            }
            document.body.removeChild(textArea);
        }
    };

    const handleViewLicenseDetails = (license: License): void => {
        // Navigate to license details page
        router.visit(`/admin/licenses/${license.id}`);
    };

    const handleRefreshData = (): void => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
            },
        });
    };

    const handleBulkActions = (
        selectedLicenses: string[],
        action: string
    ): void => {
        // Handle bulk actions like suspend, activate, etc.
        console.log("Bulk action:", action, "on licenses:", selectedLicenses);
        // You can implement this based on your needs
    };

    const handleExportLicenses = (): void => {
        // Handle export functionality
        console.log("Exporting licenses...");
        // You can implement CSV/Excel export here
    };

    const getActiveTabCount = (): number => {
        return licenses.filter((l) => l.status === "active").length;
    };

    const getExpiringCount = (): number => {
        const now = new Date();
        return licenses.filter((l) => {
            if (!l.expires_at) return false;
            const expiryDate = new Date(l.expires_at);
            const daysUntilExpiry = Math.ceil(
                (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );
            return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        }).length;
    };

    const handleOpenDocumentation = () => {
        router.visit("/documentation");
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        License Management Dashboard
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenDocumentation}
                            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                        >
                            <BookOpen className="h-4 w-4" />
                            Dokumentasi
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefreshData}
                            disabled={isRefreshing}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${
                                    isRefreshing ? "animate-spin" : ""
                                }`}
                            />
                            {isRefreshing ? "Refreshing..." : "Refresh"}
                        </Button>
                    </div>
                </div>
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
                                {copiedKey && (
                                    <span className="ml-2 text-sm text-green-600">
                                        (License key copied to clipboard!)
                                    </span>
                                )}
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

                    {/* Copy Success Message */}
                    {copiedKey && !flash?.success && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <p className="text-blue-800 dark:text-blue-200">
                                    License key copied to clipboard: {copiedKey}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Stats Cards Component */}
                    <StatsCards licenses={licenses} stats={stats} />

                    {/* Warning for expiring licenses */}
                    {getExpiringCount() > 0 && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-yellow-600" />
                                <p className="text-yellow-800 dark:text-yellow-200">
                                    {getExpiringCount()} license(s) will expire
                                    within 30 days. Please review and renew if
                                    needed.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <Tabs defaultValue="licenses" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger
                                        value="licenses"
                                        className="flex items-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        License List ({licenses.length})
                                        {getActiveTabCount() > 0 && (
                                            <span className="ml-1 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                                {getActiveTabCount()} active
                                            </span>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="generate"
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Generate License
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
                                        copiedKey={copiedKey}
                                        licenseTypes={licenseTypes}
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
