// components/LicenseList.tsx

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { License } from "@/types/license";
import { LicenseFilters } from "./LicenseList/LicenseFilters";
import { LicenseSummary } from "./LicenseList/LicenseSummary";
import { LicenseCard } from "./LicenseList/LicenseCard";
import { EmptyState } from "./LicenseList/EmptyState";
import { ActiveFilters } from "./LicenseList/ActiveFilters";
import { useLicenseFilters } from "@/hooks/useLicenseFilters";
import { usePagination } from "@/hooks/usePagination";

interface LicenseListProps {
    licenses: License[];
    onCopy: (text: string) => void;
    onViewDetails?: (license: License) => void;
    copiedKey?: string | null;
    itemsPerPage?: number;
}

const LicenseList: React.FC<LicenseListProps> = ({
    licenses,
    onCopy,
    onViewDetails,
    copiedKey,
    itemsPerPage = 10,
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

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems,
        startIndex,
        endIndex,
    } = usePagination(filteredAndSortedLicenses, itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of list when page changes
        const listElement = document.getElementById("license-list-container");
        if (listElement) {
            listElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is small
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => handlePageChange(i)}
                            isActive={currentPage === i}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            // Show ellipsis for large number of pages
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);

            if (startPage > 1) {
                items.push(
                    <PaginationItem key={1}>
                        <PaginationLink
                            onClick={() => handlePageChange(1)}
                            className="cursor-pointer"
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>
                );
                if (startPage > 2) {
                    items.push(
                        <PaginationItem key="ellipsis-start">
                            <PaginationEllipsis />
                        </PaginationItem>
                    );
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => handlePageChange(i)}
                            isActive={currentPage === i}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    items.push(
                        <PaginationItem key="ellipsis-end">
                            <PaginationEllipsis />
                        </PaginationItem>
                    );
                }
                items.push(
                    <PaginationItem key={totalPages}>
                        <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                            className="cursor-pointer"
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return items;
    };

    return (
        <div className="space-y-6" id="license-list-container">
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
                                {filteredAndSortedLicenses.length > 0 && (
                                    <span className="ml-2 text-sm">
                                        • Showing {startIndex + 1}-
                                        {Math.min(
                                            endIndex,
                                            filteredAndSortedLicenses.length
                                        )}{" "}
                                        of {filteredAndSortedLicenses.length}{" "}
                                        results
                                    </span>
                                )}
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

                    {/* Results Info */}
                    {filteredAndSortedLicenses.length > 0 && (
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-4 mb-4">
                            <div>
                                Showing {startIndex + 1} to{" "}
                                {Math.min(
                                    endIndex,
                                    filteredAndSortedLicenses.length
                                )}{" "}
                                of {filteredAndSortedLicenses.length} results
                            </div>
                            <div>
                                Page {currentPage} of {totalPages}
                            </div>
                        </div>
                    )}

                    {/* License Cards */}
                    <div className="space-y-4 mt-6">
                        {paginatedItems.map((license) => (
                            <LicenseCard
                                key={license.id}
                                license={license}
                                onCopy={onCopy}
                                onViewDetails={onViewDetails}
                                copiedKey={copiedKey}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                handlePageChange(
                                                    Math.max(1, currentPage - 1)
                                                )
                                            }
                                            className={`cursor-pointer ${
                                                currentPage === 1
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }`}
                                        />
                                    </PaginationItem>

                                    {renderPaginationItems()}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                handlePageChange(
                                                    Math.min(
                                                        totalPages,
                                                        currentPage + 1
                                                    )
                                                )
                                            }
                                            className={`cursor-pointer ${
                                                currentPage === totalPages
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }`}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}

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
