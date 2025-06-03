import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    typeFilter: string;
    setTypeFilter: (type: string) => void;
    customerTypeFilter: string;
    setCustomerTypeFilter: (type: string) => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    customerTypeFilter,
    setCustomerTypeFilter,
}) => {
    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                    Search: "{searchTerm}"
                    <button
                        onClick={() => setSearchTerm("")}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </Badge>
            )}
            {statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter}
                    <button
                        onClick={() => setStatusFilter("all")}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </Badge>
            )}
            {typeFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                    Type: {typeFilter}
                    <button
                        onClick={() => setTypeFilter("all")}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </Badge>
            )}
            {customerTypeFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                    Customer: {customerTypeFilter}
                    <button
                        onClick={() => setCustomerTypeFilter("all")}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </Badge>
            )}
        </div>
    );
};
