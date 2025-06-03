import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface LicenseFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    typeFilter: string;
    setTypeFilter: (type: string) => void;
    customerTypeFilter: string;
    setCustomerTypeFilter: (type: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    sortOrder: "asc" | "desc";
    setSortOrder: (order: "asc" | "desc") => void;
    uniqueTypes: string[];
    hasActiveFilters: boolean;
    clearFilters: () => void;
}

export const LicenseFilters: React.FC<LicenseFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    customerTypeFilter,
    setCustomerTypeFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    uniqueTypes,
    hasActiveFilters,
    clearFilters,
}) => {
    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Search licenses, customers, or emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-2 items-center">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="revoked">Revoked</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {uniqueTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={customerTypeFilter}
                    onValueChange={setCustomerTypeFilter}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Customer" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="created_at">Created Date</SelectItem>
                        <SelectItem value="customer_name">Customer</SelectItem>
                        <SelectItem value="license_type">Type</SelectItem>
                        <SelectItem value="expires_at">Expiry Date</SelectItem>
                        <SelectItem value="purchase_price">Price</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="devices_used">
                            Device Usage
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                >
                    {sortOrder === "asc" ? "↑" : "↓"}
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
};
