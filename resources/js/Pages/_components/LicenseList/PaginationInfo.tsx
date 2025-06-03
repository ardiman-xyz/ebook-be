import React from "react";

interface PaginationInfoProps {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    totalItems: number;
    itemsPerPage: number;
}

export const PaginationInfo: React.FC<PaginationInfoProps> = ({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    itemsPerPage,
}) => {
    if (totalItems === 0) {
        return null;
    }

    const displayedCount = Math.min(endIndex, totalItems);

    return (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 px-1">
            <div>
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{displayedCount}</span> of{" "}
                <span className="font-medium">{totalItems}</span> results
            </div>
            <div>
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
            </div>
        </div>
    );
};
