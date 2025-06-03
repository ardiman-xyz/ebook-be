import React from "react";
import { Button } from "@/components/ui/button";
import { Key, X } from "lucide-react";

interface EmptyStateProps {
    hasActiveFilters: boolean;
    clearFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    hasActiveFilters,
    clearFilters,
}) => {
    return (
        <div className="text-center py-12">
            <Key className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No licenses found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
                {hasActiveFilters
                    ? "Try adjusting your search or filters"
                    : "No licenses have been generated yet"}
            </p>
            {hasActiveFilters && (
                <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-2"
                >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                </Button>
            )}
        </div>
    );
};
