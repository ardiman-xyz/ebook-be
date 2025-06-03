import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { License } from "@/types/license";

export const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const isExpiringSoon = (
    license: License,
    daysThreshold: number = 30
): boolean => {
    if (!license.expires_at) return false;
    const expiryDate = new Date(license.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= daysThreshold && daysUntilExpiry > 0;
};

export const getDaysUntilExpiry = (license: License): number | null => {
    if (!license.expires_at) return null;
    const expiryDate = new Date(license.expires_at);
    const now = new Date();
    return Math.ceil(
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
};

export const getStatusIcon = (status: License["status"]) => {
    const statusIcons = {
        active: "CheckCircle",
        expired: "XCircle",
        suspended: "AlertTriangle",
        revoked: "XCircle",
    };
    return statusIcons[status];
};

export const getStatusColor = (status: License["status"]) => {
    const statusColors = {
        active: "text-green-600",
        expired: "text-red-600",
        suspended: "text-yellow-600",
        revoked: "text-gray-600",
    };
    return statusColors[status];
};

export const getLicenseTypeColor = (typeCode: string): string => {
    const colors: Record<string, string> = {
        DEMO: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400",
        TRIAL: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
        FULL: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
        ENT: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
        EDU: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400",
        LIFE: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400",
    };
    return (
        colors[typeCode] ||
        "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300"
    );
};

export const calculateLicenseStats = (licenses: License[]) => {
    const activeCount = licenses.filter((l) => l.status === "active").length;
    const expiredCount = licenses.filter((l) => l.status === "expired").length;
    const expiringCount = licenses.filter((l) => isExpiringSoon(l)).length;
    const totalValue = licenses.reduce((sum, l) => sum + l.purchase_price, 0);
    const totalDevices = licenses.reduce((sum, l) => sum + l.devices_used, 0);
    const totalActivations = licenses.reduce(
        (sum, l) => sum + l.activations.length,
        0
    );

    return {
        activeCount,
        expiredCount,
        expiringCount,
        totalValue,
        totalDevices,
        totalActivations,
    };
};
