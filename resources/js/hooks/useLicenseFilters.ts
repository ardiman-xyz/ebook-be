import { useState, useMemo } from "react";
import { License } from "@/types/license";

export const useLicenseFilters = (licenses: License[]) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [customerTypeFilter, setCustomerTypeFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Memoized filtered and sorted licenses for better performance
    const filteredAndSortedLicenses = useMemo(() => {
        return licenses
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
                const matchesCustomerType =
                    customerTypeFilter === "all" ||
                    license.customer.customer_type === customerTypeFilter;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesType &&
                    matchesCustomerType
                );
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
                    case "status":
                        aValue = a.status;
                        bValue = b.status;
                        break;
                    case "devices_used":
                        aValue = a.devices_used;
                        bValue = b.devices_used;
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
    }, [
        licenses,
        searchTerm,
        statusFilter,
        typeFilter,
        customerTypeFilter,
        sortBy,
        sortOrder,
    ]);

    const uniqueTypes = useMemo(
        () => Array.from(new Set(licenses.map((l) => l.license_type.code))),
        [licenses]
    );

    const hasActiveFilters = Boolean(
        searchTerm ||
            statusFilter !== "all" ||
            typeFilter !== "all" ||
            customerTypeFilter !== "all"
    );

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setTypeFilter("all");
        setCustomerTypeFilter("all");
        setSortBy("created_at");
        setSortOrder("desc");
    };

    return {
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
        uniqueTypes,
        hasActiveFilters,
        clearFilters,
    };
};
