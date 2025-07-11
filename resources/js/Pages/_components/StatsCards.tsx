// components/StatsCards.tsx

import React from "react";
import { CheckCircle, Clock, Users, Shield, DollarSign } from "lucide-react";
import { DashboardStats, License } from "@/types/license";

interface StatsCardsProps {
    licenses?: License[];
    stats?: DashboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ licenses = [], stats }) => {
    // Helper function to format currency
    const formatRupiah = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Use provided stats or calculate from licenses
    const statsData = stats || {
        total_licenses: licenses.length,
        active_licenses: licenses.filter((l) => l.status === "active").length,
        expired_licenses: licenses.filter((l) => l.status === "expired").length,
        total_customers: new Set(licenses.map((l) => l.customer_id)).size,
        total_activations: licenses.reduce((sum, l) => sum + l.devices_used, 0),
        online_devices: 0, // Would need real-time data
        today_activations: 0, // Would need today's data
        this_month_revenue: licenses.reduce(
            (sum, l) => sum + l.purchase_price,
            0
        ),
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Total Licenses */}
            <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Total Licenses
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {statsData.total_licenses}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    All time licenses
                </div>
            </div>

            {/* Active Licenses */}
            <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Active
                </div>
                <div className="text-2xl font-bold text-green-600">
                    {statsData.active_licenses}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Currently active
                </div>
            </div>

            {/* Expired Licenses */}
            <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-600" />
                    Expired
                </div>
                <div className="text-2xl font-bold text-red-600">
                    {statsData.expired_licenses}
                </div>
                <div className="text-xs text-gray-500 mt-1">Need renewal</div>
            </div>

            {/* Total Customers */}
            <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Customers
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {statsData.total_customers}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Unique customers
                </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    Revenue
                </div>
                <div className="text-2xl font-bold text-blue-600">
                    {formatRupiah(statsData.this_month_revenue)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Total revenue</div>
            </div>
        </div>
    );
};

export default StatsCards;
