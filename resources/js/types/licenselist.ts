export interface LicenseFilterState {
    searchTerm: string;
    statusFilter: string;
    typeFilter: string;
    customerTypeFilter: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
}

export interface LicenseActionState {
    selectedLicenses: string[];
    bulkActionLoading: boolean;
}

export type BulkActionType =
    | "activate"
    | "suspend"
    | "revoke"
    | "delete"
    | "export";

export interface LicenseStatistics {
    activeCount: number;
    expiredCount: number;
    expiringCount: number;
    totalValue: number;
    totalDevices: number;
    totalActivations: number;
}
