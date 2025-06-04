// components/LicenseList/LicenseActionsWithHandlers.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { router } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Ban,
    Shield,
    ShieldX,
    Download,
    RefreshCw,
    Copy,
    QrCode,
    FileText,
    Send,
    History,
    User,
    Calendar,
    Settings,
} from "lucide-react";
import { License } from "@/types/license";

interface LicenseActionsWithHandlersProps {
    license: License;
    onViewDetails?: (license: License) => void;
    onCopyKey?: (license: License) => void;
}

export const LicenseActionsWithHandlers: React.FC<
    LicenseActionsWithHandlersProps
> = ({ license, onViewDetails, onCopyKey }) => {
    const { toast } = useToast();
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [showSuspendDialog, setShowSuspendDialog] = React.useState(false);
    const [showRevokeDialog, setShowRevokeDialog] = React.useState(false);

    // Determine available actions based on license status
    const canReactivate =
        license.status === "suspended" || license.status === "expired";
    const canSuspend = license.status === "active";
    const canRevoke =
        license.status === "active" || license.status === "suspended";
    const canEdit = license.status !== "revoked";

    // ===== BUILT-IN ACTION HANDLERS =====

    const handleEdit = () => {
        router.visit(`/admin/licenses/${license.id}/edit`);
    };

    const handleSuspend = async () => {
        try {
            await router.post(
                `/admin/licenses/${license.id}/suspend`,
                {},
                {
                    onSuccess: () => {
                        toast({
                            title: "License Suspended",
                            description: `License ${license.license_key} has been suspended successfully.`,
                        });
                    },
                    onError: (errors) => {
                        toast({
                            title: "Suspension Failed",
                            description:
                                "Unable to suspend license. Please try again.",
                            variant: "destructive",
                        });
                    },
                }
            );
        } catch (error) {
            console.error("Error suspending license:", error);
            toast({
                title: "Error",
                description:
                    "An unexpected error occurred while suspending the license.",
                variant: "destructive",
            });
        }
    };

    const handleRevoke = async () => {
        try {
            await router.post(
                `/admin/licenses/${license.id}/revoke`,
                {},
                {
                    onSuccess: () => {
                        toast({
                            title: "License Revoked",
                            description: `License ${license.license_key} has been revoked permanently.`,
                        });
                    },
                    onError: (errors) => {
                        toast({
                            title: "Revocation Failed",
                            description:
                                "Unable to revoke license. Please try again.",
                            variant: "destructive",
                        });
                    },
                }
            );
        } catch (error) {
            console.error("Error revoking license:", error);
            toast({
                title: "Error",
                description:
                    "An unexpected error occurred while revoking the license.",
                variant: "destructive",
            });
        }
    };

    const handleReactivate = async () => {
        try {
            await router.post(
                `/admin/licenses/${license.id}/reactivate`,
                {},
                {
                    onSuccess: () => {
                        toast({
                            title: "License Reactivated",
                            description: `License ${license.license_key} has been reactivated successfully.`,
                        });
                    },
                    onError: (errors) => {
                        toast({
                            title: "Reactivation Failed",
                            description:
                                "Unable to reactivate license. Please try again.",
                            variant: "destructive",
                        });
                    },
                }
            );
        } catch (error) {
            console.error("Error reactivating license:", error);
            toast({
                title: "Error",
                description:
                    "An unexpected error occurred while reactivating the license.",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async () => {
        try {
            await router.delete(`/admin/licenses/${license.id}`, {
                onSuccess: () => {
                    toast({
                        title: "License Deleted",
                        description: `License ${license.license_key} has been deleted permanently.`,
                    });
                },
                onError: (errors) => {
                    toast({
                        title: "Deletion Failed",
                        description:
                            "Unable to delete license. Please try again.",
                        variant: "destructive",
                    });
                },
            });
        } catch (error) {
            console.error("Error deleting license:", error);
            toast({
                title: "Error",
                description:
                    "An unexpected error occurred while deleting the license.",
                variant: "destructive",
            });
        }
    };

    const handleDownloadQR = () => {
        router.get(
            `/admin/licenses/${license.id}/qr-code`,
            {},
            {
                onSuccess: () => {
                    toast({
                        title: "QR Code Downloaded",
                        description:
                            "QR code has been generated and downloaded.",
                    });
                },
                onError: () => {
                    toast({
                        title: "Download Failed",
                        description:
                            "Unable to generate QR code. Please try again.",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    const handleRefresh = async () => {
        try {
            await router.post(
                `/admin/licenses/${license.id}/refresh`,
                {},
                {
                    onSuccess: () => {
                        toast({
                            title: "Status Refreshed",
                            description: `License ${license.license_key} status has been updated.`,
                        });
                    },
                    onError: (errors) => {
                        toast({
                            title: "Refresh Failed",
                            description:
                                "Unable to refresh license status. Please try again.",
                            variant: "destructive",
                        });
                    },
                }
            );
        } catch (error) {
            console.error("Error refreshing license:", error);
            toast({
                title: "Error",
                description:
                    "An unexpected error occurred while refreshing the license.",
                variant: "destructive",
            });
        }
    };

    const handleSendEmail = () => {
        router.visit(`/admin/licenses/${license.id}/send-email`);
    };

    const handleViewHistory = () => {
        router.visit(`/admin/licenses/${license.id}/history`);
    };

    const handleDownloadReport = () => {
        router.get(
            `/admin/licenses/${license.id}/report`,
            {},
            {
                onSuccess: () => {
                    toast({
                        title: "Report Downloaded",
                        description:
                            "License report has been generated and downloaded.",
                    });
                },
                onError: () => {
                    toast({
                        title: "Download Failed",
                        description:
                            "Unable to generate report. Please try again.",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    const handleViewCustomer = () => {
        router.visit(`/admin/customers/${license.customer.id}`);
    };

    const handleManageActivations = () => {
        router.visit(`/admin/licenses/${license.id}/activations`);
    };

    const handleExtendExpiry = () => {
        router.visit(`/admin/licenses/${license.id}/extend`);
    };

    // Confirmation handlers
    const handleConfirmDelete = () => {
        handleDelete();
        setShowDeleteDialog(false);
    };

    const handleConfirmSuspend = () => {
        handleSuspend();
        setShowSuspendDialog(false);
    };

    const handleConfirmRevoke = () => {
        handleRevoke();
        setShowRevokeDialog(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                        <span className="sr-only">
                            Open license actions menu
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>License Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* View & Information Actions */}
                    {onViewDetails && (
                        <DropdownMenuItem
                            onClick={() => onViewDetails(license)}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                        </DropdownMenuItem>
                    )}

                    {onCopyKey && (
                        <DropdownMenuItem onClick={() => onCopyKey(license)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy License Key
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={handleViewHistory}>
                        <History className="w-4 h-4 mr-2" />
                        View Usage History
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleViewCustomer}>
                        <User className="w-4 h-4 mr-2" />
                        View Customer
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Management Actions */}
                    {canEdit && (
                        <DropdownMenuItem onClick={handleEdit}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit License
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={handleManageActivations}>
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Activations
                    </DropdownMenuItem>

                    {!license.license_type.is_lifetime && (
                        <DropdownMenuItem onClick={handleExtendExpiry}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Extend Expiry
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={handleRefresh}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Status
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Download & Export Actions */}
                    <DropdownMenuItem onClick={handleDownloadQR}>
                        <QrCode className="w-4 h-4 mr-2" />
                        Download QR Code
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleDownloadReport}>
                        <FileText className="w-4 h-4 mr-2" />
                        Download Report
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleSendEmail}>
                        <Send className="w-4 h-4 mr-2" />
                        Send to Customer
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Status Change Actions */}
                    {canReactivate && (
                        <DropdownMenuItem
                            onClick={handleReactivate}
                            className="text-green-600 focus:text-green-600 dark:text-green-400"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            Reactivate License
                        </DropdownMenuItem>
                    )}

                    {canSuspend && (
                        <DropdownMenuItem
                            onClick={() => setShowSuspendDialog(true)}
                            className="text-yellow-600 focus:text-yellow-600 dark:text-yellow-400"
                        >
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend License
                        </DropdownMenuItem>
                    )}

                    {canRevoke && (
                        <DropdownMenuItem
                            onClick={() => setShowRevokeDialog(true)}
                            className="text-orange-600 focus:text-orange-600 dark:text-orange-400"
                        >
                            <ShieldX className="w-4 h-4 mr-2" />
                            Revoke License
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    {/* Danger Zone */}
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600 focus:text-red-600 dark:text-red-400"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete License
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Trash2 className="w-5 h-5 text-red-600" />
                            Delete License
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete license{" "}
                            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm">
                                {license.license_key}
                            </code>
                            ?
                            <br />
                            <br />
                            <strong>This action cannot be undone</strong> and
                            will permanently remove:
                            <ul className="list-disc ml-4 mt-2 space-y-1">
                                <li>The license and all its data</li>
                                <li>
                                    All device activations (
                                    {license.devices_used} active devices)
                                </li>
                                <li>Usage history and logs</li>
                                <li>Customer access to this license</li>
                            </ul>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete License
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Suspend Confirmation Dialog */}
            <AlertDialog
                open={showSuspendDialog}
                onOpenChange={setShowSuspendDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Ban className="w-5 h-5 text-yellow-600" />
                            Suspend License
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to suspend license{" "}
                            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm">
                                {license.license_key}
                            </code>
                            ?
                            <br />
                            <br />
                            This will:
                            <ul className="list-disc ml-4 mt-2 space-y-1">
                                <li>
                                    Immediately deactivate all devices (
                                    {license.devices_used} active)
                                </li>
                                <li>Prevent the license from being used</li>
                                <li>Block new activations</li>
                                <li>
                                    Keep the license data intact for future
                                    reactivation
                                </li>
                            </ul>
                            <br />
                            <strong>Customer:</strong> {license.customer.name} (
                            {license.customer.email})
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmSuspend}
                            className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600"
                        >
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend License
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Revoke Confirmation Dialog */}
            <AlertDialog
                open={showRevokeDialog}
                onOpenChange={setShowRevokeDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <ShieldX className="w-5 h-5 text-orange-600" />
                            Revoke License
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to revoke license{" "}
                            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm">
                                {license.license_key}
                            </code>
                            ?
                            <br />
                            <br />
                            <strong>This action cannot be undone</strong> and
                            will:
                            <ul className="list-disc ml-4 mt-2 space-y-1">
                                <li>Permanently invalidate the license</li>
                                <li>
                                    Deactivate all devices immediately (
                                    {license.devices_used} active)
                                </li>
                                <li>Prevent any future use of this license</li>
                                <li>Mark the license as permanently revoked</li>
                            </ul>
                            <br />
                            <strong>Customer:</strong> {license.customer.name} (
                            {license.customer.email})
                            <br />
                            <strong>Value:</strong>{" "}
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                            }).format(license.purchase_price)}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmRevoke}
                            className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-600"
                        >
                            <ShieldX className="w-4 h-4 mr-2" />
                            Revoke License
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
