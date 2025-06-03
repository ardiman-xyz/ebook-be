// components/LicenseList.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Eye,
    Search,
    Copy,
    Calendar,
    Users,
    Key,
    Building,
    Mail,
    Filter,
    Download,
    MoreVertical,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
} from "lucide-react";

interface License {
    id: number;
    license_key: string;
    customer_id: number;
    license_type_id: number;
    status: "active" | "expired" | "suspended" | "revoked";
    issued_at: string;
    activated_at: string | null;
    expires_at: string | null;
    max_devices: number;
    devices_used: number;
    purchase_price: number;
    purchase_currency: string;
    order_id: string | null;
    payment_method: string | null;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
    customer: {
        id: number;
        name: string;
        email: string;
        customer_type: "individual" | "business" | "education";
        status: "active" | "inactive";
    };
    license_type: {
        id: number;
        code: string;
        name: string;
        description: string;
        is_trial: boolean;
        is_lifetime: boolean;
    };
    activations: Array<{
        id: number;
        device_id: string;
        device_name: string | null;
        device_platform: string | null;
        status: "active" | "inactive" | "suspended";
        activated_at: string;
        last_used_at: string | null;
    }>;
}

interface LicenseListProps {
    licenses: License[];
    onCopy: (text: string) => void;
    onViewDetails?: (license: License) => void;
}

const LicenseList: React.FC<LicenseListProps> = ({
    licenses,
    onCopy,
    onViewDetails,
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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
                color: "bg-green-100 text-green-800 border-green-200",
                icon: CheckCircle,
                label: "Active",
            },
            expired: {
                color: "bg-red-100 text-red-800 border-red-200",
                icon: XCircle,
                label: "Expired",
            },
            suspended: {
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: AlertTriangle,
                label: "Suspended",
            },
            revoked: {
                color: "bg-gray-100 text-gray-800 border-gray-200",
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
                DEMO: "bg-purple-100 text-purple-800 border-purple-200",
                TRIAL: "bg-blue-100 text-blue-800 border-blue-200",
                FULL: "bg-green-100 text-green-800 border-green-200",
                ENT: "bg-orange-100 text-orange-800 border-orange-200",
                EDU: "bg-teal-100 text-teal-800 border-teal-200",
                LIFE: "bg-pink-100 text-pink-800 border-pink-200",
            };
            return (
                colors[typeCode] || "bg-gray-100 text-gray-800 border-gray-200"
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

    const isExpiringSoon = (license: License): boolean => {
        if (!license.expires_at) return false;
        const expiryDate = new Date(license.expires_at);
        const now = new Date();
        const daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    const filteredAndSortedLicenses = licenses
        .filter((license) => {
            const matchesSearch =
                license.license_key
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                license.customer.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                license.customer.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                license.license_type.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || license.status === statusFilter;
            const matchesType =
                typeFilter === "all" ||
                license.license_type.code === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        })
        .sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case "customer_name":
                    aValue = a.customer.name;
                    bValue = b.customer.name;
                    break;
                case "license_type":
                    aValue = a.license_type.name;
                    bValue = b.license_type.name;
                    break;
                case "expires_at":
                    aValue = a.expires_at
                        ? new Date(a.expires_at).getTime()
                        : 0;
                    bValue = b.expires_at
                        ? new Date(b.expires_at).getTime()
                        : 0;
                    break;
                case "purchase_price":
                    aValue = a.purchase_price;
                    bValue = b.purchase_price;
                    break;
                default:
                    aValue = new Date(a.created_at).getTime();
                    bValue = new Date(b.created_at).getTime();
            }

            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

    const uniqueTypes = Array.from(
        new Set(licenses.map((l) => l.license_type.code))
    );

    return (
        <div className="space-y-6">
            {/* Header with Search and Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-blue-600" />
                                License Management
                            </CardTitle>
                            <CardDescription>
                                View and manage all generated licenses (
                                {filteredAndSortedLicenses.length} of{" "}
                                {licenses.length})
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filter Controls */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search licenses, customers, or emails..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="expired">
                                        Expired
                                    </SelectItem>
                                    <SelectItem value="suspended">
                                        Suspended
                                    </SelectItem>
                                    <SelectItem value="revoked">
                                        Revoked
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={typeFilter}
                                onValueChange={setTypeFilter}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Types
                                    </SelectItem>
                                    {uniqueTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at">
                                        Created Date
                                    </SelectItem>
                                    <SelectItem value="customer_name">
                                        Customer
                                    </SelectItem>
                                    <SelectItem value="license_type">
                                        Type
                                    </SelectItem>
                                    <SelectItem value="expires_at">
                                        Expiry Date
                                    </SelectItem>
                                    <SelectItem value="purchase_price">
                                        Price
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setSortOrder(
                                        sortOrder === "asc" ? "desc" : "asc"
                                    )
                                }
                            >
                                {sortOrder === "asc" ? "↑" : "↓"}
                            </Button>
                        </div>
                    </div>

                    {/* License Cards */}
                    <div className="space-y-4">
                        {filteredAndSortedLicenses.map((license) => (
                            <LicenseCard
                                key={license.id}
                                license={license}
                                onCopy={onCopy}
                                onViewDetails={onViewDetails}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredAndSortedLicenses.length === 0 && (
                        <div className="text-center py-12">
                            <Key className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No licenses found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchTerm ||
                                statusFilter !== "all" ||
                                typeFilter !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "No licenses have been generated yet"}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

interface LicenseCardProps {
    license: License;
    onCopy: (text: string) => void;
    onViewDetails?: (license: License) => void;
}

const LicenseCard: React.FC<LicenseCardProps> = ({
    license,
    onCopy,
    onViewDetails,
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
                color: "bg-green-100 text-green-800 border-green-200",
                icon: CheckCircle,
                label: "Active",
            },
            expired: {
                color: "bg-red-100 text-red-800 border-red-200",
                icon: XCircle,
                label: "Expired",
            },
            suspended: {
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: AlertTriangle,
                label: "Suspended",
            },
            revoked: {
                color: "bg-gray-100 text-gray-800 border-gray-200",
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
                DEMO: "bg-purple-100 text-purple-800 border-purple-200",
                TRIAL: "bg-blue-100 text-blue-800 border-blue-200",
                FULL: "bg-green-100 text-green-800 border-green-200",
                ENT: "bg-orange-100 text-orange-800 border-orange-200",
                EDU: "bg-teal-100 text-teal-800 border-teal-200",
                LIFE: "bg-pink-100 text-pink-800 border-pink-200",
            };
            return (
                colors[typeCode] || "bg-gray-100 text-gray-800 border-gray-200"
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
                            className="h-6 w-6 p-0"
                            title="Copy license key"
                        >
                            <Copy className="w-3 h-3" />
                        </Button>
                        {getTypeBadge(license.license_type)}
                        {getStatusBadge(license.status)}
                        {isExpiringSoon() && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border">
                                <Clock className="w-3 h-3 mr-1" />
                                Expiring Soon
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
                            <span className="text-gray-500">
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
                    <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LicenseList;
