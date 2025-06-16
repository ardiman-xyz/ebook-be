// pages/LicenseTypes/Index.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { BookOpen, Edit, Plus, Trash2, Percent, Package } from "lucide-react";
import React, { useState } from "react";
import LicenseTypeForm from "./_components/LicenseTypeForm";
import axios from "axios";

// Setup CSRF token
axios.defaults.headers.common["X-CSRF-TOKEN"] =
    document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content") || "";

// TypeScript interfaces
interface LicenseType {
    id: number;
    code?: string;
    name: string;
    price: number;
    original_price: number;
    duration?: string;
    duration_text?: string;
    max_devices: number;
    type: "Trial" | "Standard" | "Lifetime" | "Enterprise";
    has_discount: boolean;
    discount_percentage: number;
    is_active: boolean;
    description?: string;
    formatted_price?: string;
    formatted_original_price?: string;
    savings_amount?: number;
    is_discounted?: boolean;
    currency?: string;
}

interface Stats {
    total_types: number;
    active_types: number;
    with_discount: number;
    avg_price: number;
    total_savings: number;
}

interface IndexProps {
    licenseTypes: LicenseType[];
    stats: Stats;
    flash?: {
        success?: string;
        error?: string;
    };
}

const Index: React.FC<IndexProps> = ({
    licenseTypes: initialLicenseTypes = [],
    stats: initialStats,
    flash,
}) => {
    const [licenseTypes, setLicenseTypes] =
        useState<LicenseType[]>(initialLicenseTypes);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingLicenseType, setEditingLicenseType] =
        useState<LicenseType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleOpenDocumentation = (): void => {
        router.visit("/documentation");
    };

    const formatRupiah = (amount: number): string => {
        if (amount === 0) return "Free";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleAdd = (): void => {
        setEditingLicenseType(null);
        setShowForm(true);
    };

    const handleEdit = (licenseType: LicenseType): void => {
        setEditingLicenseType(licenseType);
        setShowForm(true);
    };

    const handleFormSave = async (formData: LicenseType): Promise<void> => {
        setIsLoading(true);

        try {
            // Prepare data untuk backend
            const requestData = {
                name: formData.name,
                original_price: formData.original_price,
                has_discount: formData.has_discount,
                discount_percentage: formData.discount_percentage,
                duration: formData.duration,
                max_devices: formData.max_devices,
                type: formData.type,
                description: formData.description || "",
                features: [],
                restrictions: [],
                is_active: true,
            };

            let response;

            if (editingLicenseType) {
                // Update existing
                response = await axios.put(
                    `/admin/${editingLicenseType.id}`,
                    requestData
                );
            } else {
                // Create new
                response = await axios.post("/admin/", requestData);
            }

            // Update state dengan data dari backend
            if (editingLicenseType) {
                setLicenseTypes((prev) =>
                    prev.map((lt) =>
                        lt.id === editingLicenseType.id
                            ? {
                                  ...response.data.data,
                                  price: parseFloat(response.data.data.price),
                                  original_price: parseFloat(
                                      response.data.data.original_price
                                  ),
                                  discount_percentage: parseFloat(
                                      response.data.data.discount_percentage
                                  ),
                                  has_discount:
                                      !!response.data.data.has_discount,
                                  duration:
                                      response.data.data.duration_text ||
                                      response.data.data.duration,
                              }
                            : lt
                    )
                );
            } else {
                const newLicenseType = {
                    ...response.data.data,
                    price: parseFloat(response.data.data.price),
                    original_price: parseFloat(
                        response.data.data.original_price
                    ),
                    discount_percentage: parseFloat(
                        response.data.data.discount_percentage
                    ),
                    has_discount: !!response.data.data.has_discount,
                    duration:
                        response.data.data.duration_text ||
                        response.data.data.duration,
                };
                setLicenseTypes((prev) => [...prev, newLicenseType]);
            }

            handleFormClose();
            alert("License type saved successfully!");
        } catch (error: any) {
            console.error("Error saving license type:", error);

            if (error.response?.status === 422) {
                // Validation errors
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(", ");
                alert(`Validation errors: ${errorMessages}`);
            } else {
                alert("Failed to save license type. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormClose = (): void => {
        setShowForm(false);
        setEditingLicenseType(null);
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!confirm("Are you sure you want to delete this license type?")) {
            return;
        }

        try {
            await axios.delete(`/admin/${id}`);
            setLicenseTypes((prev) => prev.filter((lt) => lt.id !== id));
            alert("License type deleted successfully!");
        } catch (error: any) {
            console.error("Error deleting license type:", error);

            if (error.response?.status === 400) {
                alert(
                    error.response.data.message ||
                        "Cannot delete this license type"
                );
            } else {
                alert("Failed to delete license type. Please try again.");
            }
        }
    };

    const getTypeColor = (type: string): string => {
        switch (type) {
            case "Trial":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
            case "Lifetime":
                return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
            case "Enterprise":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
            default:
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        }
    };

    const calculateSavings = (
        originalPrice: number,
        finalPrice: number
    ): number => {
        return originalPrice - finalPrice;
    };

    return (
        <Authenticated
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        License Type Management
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleOpenDocumentation}
                            size="sm"
                            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                        >
                            <BookOpen className="h-4 w-4" />
                            Dokumentasi
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Atur tipe lisensi" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Header Section */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between h-16">
                                    <div>
                                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            License Type Management
                                        </h1>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Manage pricing, discounts, and
                                            license configurations
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleAdd}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add License Type
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                            {flash.error}
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Types
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {licenseTypes.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <Percent className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        With Discount
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {
                                            licenseTypes.filter(
                                                (lt) =>
                                                    lt.has_discount &&
                                                    lt.discount_percentage > 0
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                                        Rp
                                    </span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Avg. Price
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {licenseTypes.length > 0
                                            ? formatRupiah(
                                                  licenseTypes.reduce(
                                                      (sum, lt) =>
                                                          sum + lt.price,
                                                      0
                                                  ) / licenseTypes.length
                                              )
                                            : "Rp 0"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <span className="text-yellow-600 dark:text-yellow-400 font-bold text-lg">
                                        💰
                                    </span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Savings
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatRupiah(
                                            licenseTypes.reduce(
                                                (sum, lt) =>
                                                    sum +
                                                    (lt.has_discount
                                                        ? calculateSavings(
                                                              lt.original_price,
                                                              lt.price
                                                          )
                                                        : 0),
                                                0
                                            )
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* License Types List */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                                License Types ({licenseTypes.length})
                            </h2>

                            {licenseTypes.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">
                                        📦
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No License Types
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        Get started by creating your first
                                        license type.
                                    </p>
                                    <Button
                                        onClick={handleAdd}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add License Type
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {licenseTypes.map((licenseType) => (
                                        <div
                                            key={licenseType.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                                {
                                                                    licenseType.name
                                                                }
                                                            </h3>
                                                            {licenseType.has_discount &&
                                                                licenseType.discount_percentage >
                                                                    0 && (
                                                                    <Badge
                                                                        variant="destructive"
                                                                        className="text-xs"
                                                                    >
                                                                        <Percent className="h-3 w-3 mr-1" />
                                                                        {
                                                                            licenseType.discount_percentage
                                                                        }
                                                                        % OFF
                                                                    </Badge>
                                                                )}
                                                        </div>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-gray-900 dark:text-white">
                                                                    {formatRupiah(
                                                                        licenseType.price
                                                                    )}
                                                                </span>
                                                                {licenseType.has_discount &&
                                                                    licenseType.discount_percentage >
                                                                        0 && (
                                                                        <span className="line-through text-gray-400 text-xs">
                                                                            {formatRupiah(
                                                                                licenseType.original_price
                                                                            )}
                                                                        </span>
                                                                    )}
                                                            </div>
                                                            <span>•</span>
                                                            <span>
                                                                {licenseType.duration ||
                                                                    licenseType.duration_text ||
                                                                    "No duration"}
                                                            </span>
                                                            <span>•</span>
                                                            <span>
                                                                {
                                                                    licenseType.max_devices
                                                                }{" "}
                                                                devices
                                                            </span>
                                                            <span>•</span>
                                                            <Badge
                                                                className={`text-xs ${getTypeColor(
                                                                    licenseType.type
                                                                )}`}
                                                            >
                                                                {
                                                                    licenseType.type
                                                                }
                                                            </Badge>
                                                        </div>
                                                        {licenseType.has_discount &&
                                                            licenseType.discount_percentage >
                                                                0 && (
                                                                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                                    💰 Save{" "}
                                                                    {formatRupiah(
                                                                        calculateSavings(
                                                                            licenseType.original_price,
                                                                            licenseType.price
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEdit(licenseType)
                                                    }
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(
                                                            licenseType.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* License Type Form Modal */}
            <LicenseTypeForm
                isOpen={showForm}
                onClose={handleFormClose}
                onSave={handleFormSave}
                editingLicenseType={editingLicenseType}
                isLoading={isLoading}
            />
        </Authenticated>
    );
};

export default Index;
