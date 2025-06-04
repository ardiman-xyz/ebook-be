import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
    Edit,
    Loader2,
    Save,
    X,
    Calendar,
    User,
    CreditCard,
    Settings,
} from "lucide-react";
import { License, LicenseType } from "@/types/license";
import { router } from "@inertiajs/react";

interface EditLicenseModalProps {
    license: License;
    licenseTypes: LicenseType[];
    isOpen: boolean;
    onClose: () => void;
    onLicenseUpdated?: () => void;
}

interface EditFormData {
    customer_name: string;
    customer_email: string;
    customer_type: string;
    max_devices: number;
    purchase_price: number;
    purchase_currency: string;
    order_id: string;
    payment_method: string;
    admin_notes: string;
    expires_at: string; // ISO date string
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: any;
    timestamp: string;
}

export const EditLicenseModal: React.FC<EditLicenseModalProps> = ({
    license,
    licenseTypes,
    isOpen,
    onClose,
    onLicenseUpdated,
}) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<EditFormData>({
        customer_name: "",
        customer_email: "",
        customer_type: "individual",
        max_devices: 1,
        purchase_price: 0,
        purchase_currency: "IDR",
        order_id: "",
        payment_method: "",
        admin_notes: "",
        expires_at: "",
    });

    // Initialize form data when license changes
    useEffect(() => {
        if (license && isOpen) {
            setFormData({
                customer_name: license.customer.name || "",
                customer_email: license.customer.email || "",
                customer_type: license.customer.customer_type || "individual",
                max_devices: license.max_devices || 1,
                purchase_price: license.purchase_price || 0,
                purchase_currency: license.purchase_currency || "IDR",
                order_id: license.order_id || "",
                payment_method: license.payment_method || "",
                admin_notes: license.admin_notes || "",
                expires_at: license.expires_at
                    ? license.expires_at.split("T")[0]
                    : "", // Convert to YYYY-MM-DD
            });
            setErrors({});
        }
    }, [license, isOpen]);

    const handleInputChange =
        (field: keyof EditFormData) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value =
                e.target.type === "number"
                    ? Number(e.target.value)
                    : e.target.value;
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));

            // Clear error when user starts typing
            if (errors[field]) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: "",
                }));
            }
        };

    const handleSelectChange =
        (field: keyof EditFormData) => (value: string) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));

            if (errors[field]) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: "",
                }));
            }
        };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.customer_name.trim()) {
            newErrors.customer_name = "Customer name is required";
        }

        if (!formData.customer_email.trim()) {
            newErrors.customer_email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)
        ) {
            newErrors.customer_email = "Please enter a valid email address";
        }

        if (formData.max_devices < 1 || formData.max_devices > 100) {
            newErrors.max_devices = "Max devices must be between 1 and 100";
        }

        if (formData.purchase_price < 0) {
            newErrors.purchase_price = "Price must be a positive number";
        }

        // Validate expiry date if provided
        if (formData.expires_at && !license.license_type.is_lifetime) {
            const expiryDate = new Date(formData.expires_at);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (expiryDate < today) {
                newErrors.expires_at = "Expiry date cannot be in the past";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                expires_at: formData.expires_at || null, // Send null for lifetime licenses
            };

            const response = await axios.put<ApiResponse>(
                `/admin/licenses/${license.id}`,
                payload
            );

            if (response.data.success) {
                toast({
                    title: "License Updated",
                    description: `License ${license.license_key} has been updated successfully.`,
                });

                onClose();
                // onLicenseUpdated?.();
                router.reload();
            } else {
                toast({
                    title: "Update Failed",
                    description: response.data.message,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("Edit error:", error);

            let errorMessage = "Unable to update license. Please try again.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast({
                title: "Update Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5 text-blue-600" />
                        Edit License
                    </DialogTitle>
                    <DialogDescription>
                        Update license details for{" "}
                        <span className="font-mono font-medium">
                            {license.license_key}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Customer Information */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <User className="h-4 w-4" />
                            Customer Information
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerName">
                                    Customer Name *
                                </Label>
                                <Input
                                    id="customerName"
                                    value={formData.customer_name}
                                    onChange={handleInputChange(
                                        "customer_name"
                                    )}
                                    className={
                                        errors.customer_name
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {errors.customer_name && (
                                    <p className="text-sm text-red-600">
                                        {errors.customer_name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customerEmail">
                                    Email Address *
                                </Label>
                                <Input
                                    id="customerEmail"
                                    type="email"
                                    value={formData.customer_email}
                                    onChange={handleInputChange(
                                        "customer_email"
                                    )}
                                    className={
                                        errors.customer_email
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {errors.customer_email && (
                                    <p className="text-sm text-red-600">
                                        {errors.customer_email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Customer Type</Label>
                            <Select
                                value={formData.customer_type}
                                onValueChange={handleSelectChange(
                                    "customer_type"
                                )}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="individual">
                                        Individual
                                    </SelectItem>
                                    <SelectItem value="business">
                                        Business
                                    </SelectItem>
                                    <SelectItem value="education">
                                        Education
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* License Configuration */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Settings className="h-4 w-4" />
                            License Configuration
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="maxDevices">Max Devices</Label>
                                <Input
                                    id="maxDevices"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formData.max_devices}
                                    onChange={handleInputChange("max_devices")}
                                    className={
                                        errors.max_devices
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {errors.max_devices && (
                                    <p className="text-sm text-red-600">
                                        {errors.max_devices}
                                    </p>
                                )}
                            </div>

                            {!license.license_type.is_lifetime && (
                                <div className="space-y-2">
                                    <Label htmlFor="expiresAt">
                                        Expiry Date
                                    </Label>
                                    <Input
                                        id="expiresAt"
                                        type="date"
                                        value={formData.expires_at}
                                        onChange={handleInputChange(
                                            "expires_at"
                                        )}
                                        className={
                                            errors.expires_at
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.expires_at && (
                                        <p className="text-sm text-red-600">
                                            {errors.expires_at}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <CreditCard className="h-4 w-4" />
                            Payment Information
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="purchasePrice">
                                    Purchase Price
                                </Label>
                                <Input
                                    id="purchasePrice"
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={formData.purchase_price}
                                    onChange={handleInputChange(
                                        "purchase_price"
                                    )}
                                    className={
                                        errors.purchase_price
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                <p className="text-xs text-gray-500">
                                    Current:{" "}
                                    {formatCurrency(formData.purchase_price)}
                                </p>
                                {errors.purchase_price && (
                                    <p className="text-sm text-red-600">
                                        {errors.purchase_price}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="orderId">Order ID</Label>
                                <Input
                                    id="orderId"
                                    value={formData.order_id}
                                    onChange={handleInputChange("order_id")}
                                    placeholder="Optional order reference"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod">
                                Payment Method
                            </Label>
                            <Input
                                id="paymentMethod"
                                value={formData.payment_method}
                                onChange={handleInputChange("payment_method")}
                                placeholder="e.g., Credit Card, Bank Transfer"
                            />
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="adminNotes">Admin Notes</Label>
                        <Textarea
                            id="adminNotes"
                            value={formData.admin_notes}
                            onChange={handleInputChange("admin_notes")}
                            placeholder="Internal notes about this license..."
                            rows={3}
                        />
                    </div>

                    {/* License Info Display */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            License Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">
                                    License Key:
                                </span>
                                <br />
                                <code className="font-mono">
                                    {license.license_key}
                                </code>
                            </div>
                            <div>
                                <span className="text-gray-500">Type:</span>
                                <br />
                                <span>{license.license_type.name}</span>
                                {license.license_type.is_lifetime && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                        Lifetime
                                    </span>
                                )}
                            </div>
                            <div>
                                <span className="text-gray-500">Status:</span>
                                <br />
                                <span className="capitalize">
                                    {license.status}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">
                                    Devices Used:
                                </span>
                                <br />
                                <span>
                                    {license.devices_used} /{" "}
                                    {license.max_devices}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
