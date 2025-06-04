// components/LicenseList/LicenseActionsWithHandlers.tsx

import React, { useState } from "react";
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
    Copy,
    Ban,
    ShieldX,
    Trash2,
    Shield,
    Edit,
} from "lucide-react";
import { License, LicenseType } from "@/types/license";
import axios from "axios";
import { EditLicenseModal } from "./EditLicenseModal";

interface LicenseActionsWithHandlersProps {
    license: License;
    onViewDetails?: (license: License) => void;
    onCopyKey?: (license: License) => void;
    licenseTypes?: LicenseType[];
}

export const LicenseActionsWithHandlers: React.FC<
    LicenseActionsWithHandlersProps
> = ({ license, onViewDetails, licenseTypes }) => {
    const { toast } = useToast();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);
    const [showRevokeDialog, setShowRevokeDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSuspending, setIsSuspending] = useState(false);
    const [isRevoking, setIsRevoking] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Determine available actions based on license status
    const canReactivate =
        license.status === "suspended" || license.status === "expired";
    const canSuspend = license.status === "active";
    const canRevoke =
        license.status === "active" || license.status === "suspended";
    const canEdit = license.status !== "revoked";

    // ===== ACTION HANDLERS =====

    const handleCopyKey = () => {
        navigator.clipboard.writeText(license.license_key);
        toast({
            title: "Copied!",
            description: `License key ${license.license_key} copied to clipboard.`,
        });
    };

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleSuspend = async () => {
        setIsSuspending(true);
        try {
            const response = await axios.post(
                `/admin/licenses/${license.id}/suspend`,
                {
                    reason: `Suspended by admin`,
                }
            );

            if (response.data.success) {
                toast({
                    title: "License Suspended",
                    description: response.data.message,
                });
                setShowSuspendDialog(false);
                router.reload();
            } else {
                toast({
                    title: "Suspension Failed",
                    description: response.data.message,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("Suspend error:", error);

            let errorMessage = "Unable to suspend license. Please try again.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast({
                title: "Suspension Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSuspending(false);
        }
    };

    // const handleRevoke = async () => {
    //     setIsRevoking(true);
    //     try {
    //         const response = await axios.post<ApiResponse>(
    //             `/admin/licenses/${license.id}/revoke`,
    //             {
    //                 reason: `Revoked by admin`
    //             }
    //         );

    //         if (response.data.success) {
    //             toast({
    //                 title: "License Revoked",
    //                 description: response.data.message,
    //             });
    //             setShowRevokeDialog(false);
    //             onLicenseUpdated?.();
    //         } else {
    //             toast({
    //                 title: "Revocation Failed",
    //                 description: response.data.message,
    //                 variant: "destructive",
    //             });
    //         }
    //     } catch (error: any) {
    //         console.error("Revoke error:", error);

    //         let errorMessage = "Unable to revoke license. Please try again.";
    //         if (error.response?.data?.message) {
    //             errorMessage = error.response.data.message;
    //         }

    //         toast({
    //             title: "Revocation Failed",
    //             description: errorMessage,
    //             variant: "destructive",
    //         });
    //     } finally {
    //         setIsRevoking(false);
    //     }
    // };

    // const handleReactivate = async () => {
    //     try {
    //         const response = await axios.post<ApiResponse>(
    //             `/admin/licenses/${license.id}/reactivate`,
    //             {
    //                 reason: `Reactivated by admin`
    //             }
    //         );

    //         if (response.data.success) {
    //             toast({
    //                 title: "License Reactivated",
    //                 description: response.data.message,
    //             });
    //             onLicenseUpdated?.();
    //         } else {
    //             toast({
    //                 title: "Reactivation Failed",
    //                 description: response.data.message,
    //                 variant: "destructive",
    //             });
    //         }
    //     } catch (error: any) {
    //         console.error("Reactivate error:", error);

    //         let errorMessage = "Unable to reactivate license. Please try again.";
    //         if (error.response?.data?.message) {
    //             errorMessage = error.response.data.message;
    //         }

    //         toast({
    //             title: "Reactivation Failed",
    //             description: errorMessage,
    //             variant: "destructive",
    //         });
    //     }
    // };
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await axios.delete(
                `/admin/licenses/${license.id}`
            );

            if (response.data.success) {
                toast({
                    title: "License Deleted",
                    description: `License ${license.license_key} has been deleted permanently.`,
                });

                setShowDeleteDialog(false);
                router.reload();
            } else {
                toast({
                    title: "Deletion Failed",
                    description: response.data.message,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("Delete error:", error);

            let errorMessage = "Unable to delete license. Please try again.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast({
                title: "Deletion Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRevoke = async () => {
        setIsRevoking(true);
        try {
            const response = await axios.post(
                `/admin/licenses/${license.id}/revoke`,
                {
                    reason: `Revoked by admin`,
                }
            );
            if (response.data.success) {
                toast({
                    title: "License Revoked",
                    description: response.data.message,
                });
                setShowRevokeDialog(false);
                router.reload();
            } else {
                toast({
                    title: "Revocation Failed",
                    description: response.data.message,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("Revoke error:", error);
            let errorMessage = "Unable to revoke license. Please try again.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast({
                title: "Revocation Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsRevoking(false);
        }
    };

    const handleReactivate = async () => {
        try {
            const response = await axios.post(
                `/admin/licenses/${license.id}/reactivate`,
                {
                    reason: `Reactivated by admin`,
                }
            );
            if (response.data.success) {
                toast({
                    title: "License Reactivated",
                    description: response.data.message,
                });
                router.reload();
            } else {
                toast({
                    title: "Reactivation Failed",
                    description: response.data.message,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("Reactivate error:", error);
            let errorMessage =
                "Unable to reactivate license. Please try again.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast({
                title: "Reactivation Failed",
                description: errorMessage,
                variant: "destructive",
            });
        }
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
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>License Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* View Details */}
                    {onViewDetails && (
                        <DropdownMenuItem
                            onClick={() => onViewDetails(license)}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                        </DropdownMenuItem>
                    )}

                    {/* Copy License Key */}
                    <DropdownMenuItem onClick={handleCopyKey}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy License Key
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Edit (if not revoked) */}
                    {canEdit && (
                        <DropdownMenuItem onClick={handleEdit}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit License
                        </DropdownMenuItem>
                    )}

                    {/* Reactivate (if suspended or expired) */}
                    {canReactivate && (
                        <DropdownMenuItem
                            onClick={handleReactivate}
                            className="text-green-600 focus:text-green-600 dark:text-green-400"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            Reactivate License
                        </DropdownMenuItem>
                    )}

                    {/* Suspend (if active) */}
                    {canSuspend && (
                        <DropdownMenuItem
                            onClick={() => setShowSuspendDialog(true)}
                            className="text-yellow-600 focus:text-yellow-600 dark:text-yellow-400"
                        >
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend License
                        </DropdownMenuItem>
                    )}

                    {/* Revoke (if active or suspended) */}
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

                    {/* Delete */}
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600 focus:text-red-600 dark:text-red-400"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete License
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit License Modal */}
            <EditLicenseModal
                license={license}
                licenseTypes={licenseTypes || []} // Pass license types dari props
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
            />

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
                            This will immediately:
                            <ul className="list-disc ml-4 mt-2 space-y-1">
                                <li>
                                    Deactivate all devices (
                                    {license.devices_used} active)
                                </li>
                                <li>Prevent the license from being used</li>
                                <li>Block new activations</li>
                                <li>
                                    Keep data intact for future reactivation
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
