import { useState, useMemo, useEffect } from "react";

export const usePagination = <T>(items: T[], itemsPerPage: number = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to page 1 when items change (e.g., after filtering)
    useEffect(() => {
        setCurrentPage(1);
    }, [items.length]);

    const paginationData = useMemo(() => {
        const totalPages = Math.ceil(items.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = items.slice(startIndex, endIndex);

        return {
            totalPages,
            startIndex,
            endIndex,
            paginatedItems,
        };
    }, [items, currentPage, itemsPerPage]);

    const goToPage = (page: number) => {
        const clampedPage = Math.max(
            1,
            Math.min(page, paginationData.totalPages)
        );
        setCurrentPage(clampedPage);
    };

    const goToNextPage = () => {
        goToPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        goToPage(currentPage - 1);
    };

    const goToFirstPage = () => {
        goToPage(1);
    };

    const goToLastPage = () => {
        goToPage(paginationData.totalPages);
    };

    return {
        currentPage,
        setCurrentPage: goToPage,
        totalPages: paginationData.totalPages,
        startIndex: paginationData.startIndex,
        endIndex: paginationData.endIndex,
        paginatedItems: paginationData.paginatedItems,
        goToNextPage,
        goToPreviousPage,
        goToFirstPage,
        goToLastPage,
        hasNextPage: currentPage < paginationData.totalPages,
        hasPreviousPage: currentPage > 1,
        isFirstPage: currentPage === 1,
        isLastPage: currentPage === paginationData.totalPages,
    };
};
