// pages/LicenseTypes/Index.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { BookOpen, Edit, Plus, Trash2, Percent, Package } from "lucide-react";
import React, { useState } from "react";
import LicenseTypeForm from "./_components/LicenseTypeForm";

// TypeScript interfaces
interface LicenseType {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    duration: string;
    devices: number;
    type: "Trial" | "Standard" | "Lifetime" | "Enterprise";
    hasDiscount: boolean;
    discountPercentage: number;
}

// Mock data dengan discount
const mockLicenseTypes: LicenseType[] = [
    {
        id: 1,
        name: "Demo License",
        price: 0,
        originalPrice: 299000,
        duration: "7 days",
        devices: 1,
        type: "Trial",
        hasDiscount: true,
        discountPercentage: 100,
    },
    {
        id: 2,
        name: "Trial License",
        price: 0,
        originalPrice: 0,
        duration: "1 month",
        devices: 1,
        type: "Trial",
        hasDiscount: false,
        discountPercentage: 0,
    },
    {
        id: 3,
        name: "Full License",
        price: 562500, // 25% discount from 750000
        originalPrice: 750000,
        duration: "1 year",
        devices: 3,
        type: "Standard",
        hasDiscount: true,
        discountPercentage: 25,
    },
    {
        id: 4,
        name: "Lifetime License",
        price: 2500000,
        originalPrice: 2500000,
        duration: "Lifetime",
        devices: 5,
        type: "Lifetime",
        hasDiscount: false,
        discountPercentage: 0,
    },
    {
        id: 5,
        name: "Enterprise License",
        price: 2400000, // 20% discount from 3000000
        originalPrice: 3000000,
        duration: "3 years",
        devices: 10,
        type: "Enterprise",
        hasDiscount: true,
        discountPercentage: 20,
    },
];

const Index: React.FC = () => {
    const [licenseTypes, setLicenseTypes] =
        useState<LicenseType[]>(mockLicenseTypes);
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

        // console.info(formData);

        // try {
        //     // Simulate API call delay
        //     await new Promise((resolve) => setTimeout(resolve, 1000));

        //     if (editingLicenseType) {
        //         // Edit existing
        //         setLicenseTypes((prev) =>
        //             prev.map((lt) =>
        //                 lt.id === editingLicenseType.id
        //                     ? { ...formData, id: editingLicenseType.id }
        //                     : lt
        //             )
        //         );
        //     } else {
        //         // Add new
        //         const newId = Math.max(...licenseTypes.map((lt) => lt.id)) + 1;
        //         setLicenseTypes((prev) => [
        //             ...prev,
        //             { ...formData, id: newId },
        //         ]);
        //     }

        //     handleFormClose();
        // } catch (error) {
        //     console.error("Error saving license type:", error);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    const handleFormClose = (): void => {
        setShowForm(false);
        setEditingLicenseType(null);
    };

    const handleDelete = (id: number): void => {
        if (confirm("Are you sure you want to delete this license type?")) {
            setLicenseTypes((prev) => prev.filter((lt) => lt.id !== id));
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
                                                    lt.hasDiscount &&
                                                    lt.discountPercentage > 0
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
                                        {formatRupiah(
                                            licenseTypes.reduce(
                                                (sum, lt) => sum + lt.price,
                                                0
                                            ) / licenseTypes.length
                                        )}
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
                                                    (lt.hasDiscount
                                                        ? calculateSavings(
                                                              lt.originalPrice,
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
                                                            {licenseType.hasDiscount &&
                                                                licenseType.discountPercentage >
                                                                    0 && (
                                                                    <Badge
                                                                        variant="destructive"
                                                                        className="text-xs"
                                                                    >
                                                                        <Percent className="h-3 w-3 mr-1" />
                                                                        {
                                                                            licenseType.discountPercentage
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
                                                                {licenseType.hasDiscount &&
                                                                    licenseType.discountPercentage >
                                                                        0 && (
                                                                        <span className="line-through text-gray-400 text-xs">
                                                                            {formatRupiah(
                                                                                licenseType.originalPrice
                                                                            )}
                                                                        </span>
                                                                    )}
                                                            </div>
                                                            <span>•</span>
                                                            <span>
                                                                {
                                                                    licenseType.duration
                                                                }
                                                            </span>
                                                            <span>•</span>
                                                            <span>
                                                                {
                                                                    licenseType.devices
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
                                                        {licenseType.hasDiscount &&
                                                            licenseType.discountPercentage >
                                                                0 && (
                                                                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                                    💰 Save{" "}
                                                                    {formatRupiah(
                                                                        calculateSavings(
                                                                            licenseType.originalPrice,
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
