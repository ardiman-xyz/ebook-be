import { useState } from "react";
import { License } from "@/types/license";

export const useLicenseActions = () => {
    const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
    const [bulkActionLoading, setBulkActionLoading] = useState<boolean>(false);

    const toggleLicenseSelection = (licenseId: string) => {
        setSelectedLicenses((prev) =>
            prev.includes(licenseId)
                ? prev.filter((id) => id !== licenseId)
                : [...prev, licenseId]
        );
    };

    const selectAllLicenses = (licenses: License[]) => {
        setSelectedLicenses(licenses.map((l) => l.id.toString()));
    };

    const clearSelection = () => {
        setSelectedLicenses([]);
    };

    const handleBulkAction = async (action: string, licenses: License[]) => {
        setBulkActionLoading(true);
        try {
            // Implement bulk action logic here
            console.log(
                `Performing bulk action: ${action} on licenses:`,
                selectedLicenses
            );

            // Example: API call for bulk actions
            // await bulkUpdateLicenses(selectedLicenses, action);

            clearSelection();
        } catch (error) {
            console.error("Bulk action failed:", error);
        } finally {
            setBulkActionLoading(false);
        }
    };

    return {
        selectedLicenses,
        bulkActionLoading,
        toggleLicenseSelection,
        selectAllLicenses,
        clearSelection,
        handleBulkAction,
    };
};
