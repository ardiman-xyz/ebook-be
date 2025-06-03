import React, { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download, X } from "lucide-react";

import { License } from "@/types/license";
import { useLicenseFilters } from "@/hooks/useLicenseFilters";
import { LicenseSummary } from "./LicenseList/LicenseSummary";
import { LicenseFilters } from "./LicenseList/LicenseFilters";
import { ActiveFilters } from "./LicenseList/ActiveFilters";
import { EmptyState } from "./LicenseList/EmptyState";
import { LicenseCard } from "./LicenseList/LicenseCard";

interface LicenseListProps {
    licenses: License[];
    onCopy: (text: string) => void;
    onViewDetails?: (license: License) => void;
    copiedKey?: string | null;
}

const LicenseList: React.FC<LicenseListProps> = ({
    licenses,
    onCopy,
    onViewDetails,
    copiedKey,
}) => {
    const {
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
        filteredAndSortedLicenses,
        hasActiveFilters,
        clearFilters,
        uniqueTypes,
    } = useLicenseFilters(licenses);

    return (
        <div className="space-y-6">
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
                    {/* Quick Summary */}
                    {/* <LicenseSummary licenses={filteredAndSortedLicenses} /> */}

                    {/* Search and Filter Controls */}
                    <LicenseFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        typeFilter={typeFilter}
                        setTypeFilter={setTypeFilter}
                        customerTypeFilter={customerTypeFilter}
                        setCustomerTypeFilter={setCustomerTypeFilter}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        uniqueTypes={uniqueTypes}
                        hasActiveFilters={hasActiveFilters}
                        clearFilters={clearFilters}
                    />

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <ActiveFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            typeFilter={typeFilter}
                            setTypeFilter={setTypeFilter}
                            customerTypeFilter={customerTypeFilter}
                            setCustomerTypeFilter={setCustomerTypeFilter}
                        />
                    )}

                    {/* License Cards */}
                    <div className="space-y-4 mt-6">
                        {filteredAndSortedLicenses.map((license) => (
                            <LicenseCard
                                key={license.id}
                                license={license}
                                onCopy={onCopy}
                                onViewDetails={onViewDetails}
                                copiedKey={copiedKey}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredAndSortedLicenses.length === 0 && (
                        <EmptyState
                            hasActiveFilters={hasActiveFilters}
                            clearFilters={clearFilters}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default LicenseList;
