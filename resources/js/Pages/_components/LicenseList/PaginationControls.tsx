import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    showItemsPerPageSelector?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    showItemsPerPageSelector = true,
}) => {
    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is small
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => onPageChange(i)}
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
                            onClick={() => onPageChange(1)}
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
                            onClick={() => onPageChange(i)}
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
                            onClick={() => onPageChange(totalPages)}
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

    if (totalPages <= 1) {
        return showItemsPerPageSelector && onItemsPerPageChange ? (
            <div className="flex justify-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Items per page:
                    </span>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) =>
                            onItemsPerPageChange(parseInt(value))
                        }
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        ) : null;
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Items per page selector */}
            {showItemsPerPageSelector && onItemsPerPageChange && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Items per page:
                    </span>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) =>
                            onItemsPerPageChange(parseInt(value))
                        }
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Pagination */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() =>
                                onPageChange(Math.max(1, currentPage - 1))
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
                                onPageChange(
                                    Math.min(totalPages, currentPage + 1)
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
    );
};
