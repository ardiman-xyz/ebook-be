import React from "react";
import { License } from "@/types/license";

interface LicenseSummaryProps {
    licenses: License[];
}

export const LicenseSummary: React.FC<LicenseSummaryProps> = ({ licenses }) => {
    const formatRupiah = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const isExpiringSoon = (license: License): boolean => {
        if (!license.expires_at) return false;
        const expiryDate = new Date(license.expires_at);
        const now = new Date();
        const daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    const summary = {
        activeCount: licenses.filter((l) => l.status === "active").length,
        expiredCount: licenses.filter((l) => l.status === "expired").length,
        expiringCount: licenses.filter((l) => isExpiringSoon(l)).length,
        totalValue: licenses.reduce((sum, l) => sum + l.purchase_price, 0),
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                    {summary.activeCount}
                </div>
                <div className="text-sm text-gray-500">Active</div>
            </div>
            <div className="text-center">
                <div className="text-lg font-semibold text-red-600">
                    {summary.expiredCount}
                </div>
                <div className="text-sm text-gray-500">Expired</div>
            </div>
            <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600">
                    {summary.expiringCount}
                </div>
                <div className="text-sm text-gray-500">Expiring Soon</div>
            </div>
            <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                    {formatRupiah(summary.totalValue)}
                </div>
                <div className="text-sm text-gray-500">Total Value</div>
            </div>
        </div>
    );
};
