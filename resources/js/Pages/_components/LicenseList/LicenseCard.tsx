// components/LicenseList/LicenseCard.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Copy,
    Check,
    Eye,
    MoreVertical,
    Building,
    Mail,
    Users,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from "lucide-react";
import { License, LicenseType } from "@/types/license";
import { LicenseActionsWithHandlers } from "./LicenseActionsWithHandlers";

interface LicenseCardProps {
    license: License;
    onCopy: (text: string) => void;
    onViewDetails?: (license: License) => void;
    copiedKey?: string | null;
    licenseTypes: LicenseType[];
}

export const LicenseCard: React.FC<LicenseCardProps> = ({
    license,
    onCopy,
    onViewDetails,
    copiedKey,
    licenseTypes,
}) => {
    const formatRupiah = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (status: License["status"]) => {
        const statusConfig = {
            active: {
                color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
                icon: CheckCircle,
                label: "Active",
            },
            expired: {
                color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400",
                icon: XCircle,
                label: "Expired",
            },
            suspended: {
                color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
                icon: AlertTriangle,
                label: "Suspended",
            },
            revoked: {
                color: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 hover:bg-gray-700 dark:text-gray-300",
                icon: XCircle,
                label: "Revoked",
            },
        };

        const config = statusConfig[status];
        const IconComponent = config.icon;

        return (
            <Badge className={`${config.color} border`}>
                <IconComponent className="w-3 h-3 mr-1" />
                {config.label}
            </Badge>
        );
    };

    const getTypeBadge = (type: License["license_type"]) => {
        const getTypeColor = (typeCode: string): string => {
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

        const getTypeLabel = (): string => {
            let label = type.code;
            if (type.is_lifetime) label += " (Lifetime)";
            if (type.is_trial) label += " (Trial)";
            return label;
        };

        return (
            <Badge className={`${getTypeColor(type.code)} border`}>
                {getTypeLabel()}
            </Badge>
        );
    };

    const isExpiringSoon = (): boolean => {
        if (!license.expires_at) return false;
        const expiryDate = new Date(license.expires_at);
        const now = new Date();
        const daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    const getDaysUntilExpiry = (): number | null => {
        if (!license.expires_at) return null;
        const expiryDate = new Date(license.expires_at);
        const now = new Date();
        return Math.ceil(
            (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
    };

    const isCopied = copiedKey === license.license_key;

    const handleCopyKey = () => {
        //
    };

    return (
        <div
            className={`p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 transition-colors ${
                isExpiringSoon()
                    ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20"
                    : ""
            }`}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                    {/* License Key and Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                            {license.license_key}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCopy(license.license_key)}
                            className={`h-6 w-6 p-0 ${
                                isCopied ? "text-green-600" : ""
                            }`}
                            title={isCopied ? "Copied!" : "Copy license key"}
                        >
                            {isCopied ? (
                                <Check className="w-3 h-3" />
                            ) : (
                                <Copy className="w-3 h-3" />
                            )}
                        </Button>
                        {getTypeBadge(license.license_type)}
                        {getStatusBadge(license.status)}
                        {isExpiringSoon() && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border dark:bg-yellow-900/20 dark:text-yellow-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {getDaysUntilExpiry()} days left
                            </Badge>
                        )}
                    </div>

                    {/* Customer Information */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {license.customer.name}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                                ({license.customer.customer_type})
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Mail className="w-3 h-3" />
                            {license.customer.email}
                        </div>
                    </div>

                    {/* License Details */}
                    <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>
                                {license.devices_used}/{license.max_devices}{" "}
                                devices
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Issued: {formatDate(license.issued_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                                Expires:{" "}
                                {license.expires_at
                                    ? formatDate(license.expires_at)
                                    : "Never"}
                            </span>
                        </div>
                        <div>
                            <span>
                                Price: {formatRupiah(license.purchase_price)}
                            </span>
                        </div>
                        {license.order_id && (
                            <div>
                                <span>Order: {license.order_id}</span>
                            </div>
                        )}
                        {license.activations.length > 0 && (
                            <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>
                                    {license.activations.length} activations
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {onViewDetails && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(license)}
                        >
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                        </Button>
                    )}

                    <LicenseActionsWithHandlers
                        license={license}
                        onViewDetails={onViewDetails}
                        onCopyKey={handleCopyKey}
                        licenseTypes={licenseTypes}
                    />
                </div>
            </div>

            {/* Activation Details */}
            {license.activations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Active Devices (
                        {
                            license.activations.filter(
                                (a) => a.status === "active"
                            ).length
                        }
                        )
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {license.activations
                            .slice(0, 3)
                            .map((activation, index) => (
                                <Badge
                                    key={activation.id}
                                    variant="outline"
                                    className={`text-xs ${
                                        activation.status === "active"
                                            ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                                            : "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    {activation.device_name ||
                                        activation.device_platform ||
                                        `Device ${index + 1}`}
                                    {activation.status === "active" &&
                                        activation.last_used_at && (
                                            <span className="ml-1 text-xs opacity-75">
                                                •{" "}
                                                {formatDate(
                                                    activation.last_used_at
                                                )}
                                            </span>
                                        )}
                                </Badge>
                            ))}
                        {license.activations.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{license.activations.length - 3} more
                            </Badge>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
