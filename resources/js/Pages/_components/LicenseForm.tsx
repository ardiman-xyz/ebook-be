// components/LicenseForm.tsx

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Key,
    Upload,
    FileText,
    Image,
    X,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";

interface LicenseType {
    id: number;
    code: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    formatted_price?: string;
    max_devices: number;
    duration_text?: string;
    is_trial: boolean;
    is_lifetime: boolean;
    features?: string[];
    restrictions?: Record<string, any>;
}

interface FormData {
    customer_name: string;
    customer_email: string;
    customer_type: string;
    license_type: string;
    max_devices: number;
    purchase_price: number;
    purchase_currency: string;
    order_id: string;
    payment_method: string;
    admin_notes: string;
    payment_receipt: File | null;
}

interface LicenseFormProps {
    licenseTypes: LicenseType[];
    onSubmit?: (data: FormData) => void;
    isLoading?: boolean;
    onSuccess?: boolean; // Reset trigger
}

const LicenseForm: React.FC<LicenseFormProps> = ({
    licenseTypes = [],
    onSubmit,
    isLoading = false,
    onSuccess = false,
}) => {
    const [formData, setFormData] = useState<FormData>({
        customer_name: "",
        customer_email: "",
        customer_type: "individual",
        license_type: "",
        max_devices: 1,
        purchase_price: 0,
        purchase_currency: "IDR",
        order_id: "",
        payment_method: "",
        admin_notes: "",
        payment_receipt: null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Format Rupiah helper function
    const formatRupiah = (value: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Helper function to get formatted price
    const getFormattedPrice = (type: LicenseType): string => {
        if (type.formatted_price) {
            return type.formatted_price;
        }
        return formatRupiah(type.price);
    };

    // Helper function to get duration text
    const getDurationText = (type: LicenseType): string => {
        if (type.duration_text) {
            return type.duration_text;
        }
        if (type.is_lifetime) return "Lifetime";
        return "N/A";
    };

    // Reset form function
    const resetForm = () => {
        setFormData({
            customer_name: "",
            customer_email: "",
            customer_type: "individual",
            license_type: "",
            max_devices: 1,
            purchase_price: 0,
            purchase_currency: "IDR",
            order_id: "",
            payment_method: "",
            admin_notes: "",
            payment_receipt: null,
        });
        setPreview(null);
        setErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Reset when success flag changes
    useEffect(() => {
        if (onSuccess) {
            resetForm();
        }
    }, [onSuccess]);

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

        if (!formData.license_type) {
            newErrors.license_type = "License type is required";
        }

        if (formData.max_devices < 1 || formData.max_devices > 100) {
            newErrors.max_devices = "Max devices must be between 1 and 100";
        }

        if (formData.purchase_price < 0) {
            newErrors.purchase_price = "Price must be a positive number";
        }

        // Validate file if uploaded
        if (formData.payment_receipt) {
            const file = formData.payment_receipt;
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = [
                "application/pdf",
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif",
                "image/webp",
            ];

            if (file.size > maxSize) {
                newErrors.payment_receipt = "File size must be less than 5MB";
            } else if (!allowedTypes.includes(file.type)) {
                newErrors.payment_receipt =
                    "File must be PDF or image (JPEG, PNG, GIF, WebP)";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange =
        (field: keyof FormData) =>
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

    const handleSelectChange = (field: keyof FormData) => (value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Auto-update price and max devices when license type changes
        if (field === "license_type") {
            const selectedType = licenseTypes.find((t) => t.code === value);
            if (selectedType) {
                setFormData((prev) => ({
                    ...prev,
                    license_type: value,
                    max_devices: selectedType.max_devices,
                    purchase_price: selectedType.price,
                    purchase_currency: selectedType.currency,
                }));
            }
        }

        // Clear error
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const handleFileSelect = (file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            payment_receipt: file,
        }));

        if (file) {
            // Generate preview for images
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
        } else {
            setPreview(null);
        }

        // Clear file error
        if (errors.payment_receipt) {
            setErrors((prev) => ({
                ...prev,
                payment_receipt: "",
            }));
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const removeFile = () => {
        handleFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (file: File) => {
        if (file.type === "application/pdf") {
            return <FileText className="h-8 w-8 text-red-500" />;
        } else if (file.type.startsWith("image/")) {
            return <Image className="h-8 w-8 text-blue-500" />;
        }
        return <FileText className="h-8 w-8 text-gray-500" />;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        if (onSubmit) {
            onSubmit(formData);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-blue-600" />
                    Generate New License
                </CardTitle>
                <CardDescription>
                    Create a new license for a customer. The license key will be
                    generated automatically.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            Customer Information
                        </h4>

                        <div className="space-y-2">
                            <Label htmlFor="customerName">
                                Customer Name *
                            </Label>
                            <Input
                                id="customerName"
                                value={formData.customer_name}
                                onChange={handleInputChange("customer_name")}
                                placeholder="Enter customer name"
                                className={
                                    errors.customer_name ? "border-red-500" : ""
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
                                onChange={handleInputChange("customer_email")}
                                placeholder="customer@example.com"
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

                        <div className="space-y-2">
                            <Label htmlFor="customerType">Customer Type</Label>
                            <Select
                                value={formData.customer_type}
                                onValueChange={handleSelectChange(
                                    "customer_type"
                                )}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select customer type" />
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
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            License Configuration
                        </h4>

                        <div className="space-y-2">
                            <Label htmlFor="licenseType">License Type *</Label>
                            <Select
                                value={formData.license_type}
                                onValueChange={handleSelectChange(
                                    "license_type"
                                )}
                            >
                                <SelectTrigger
                                    className={
                                        errors.license_type
                                            ? "border-red-500"
                                            : ""
                                    }
                                >
                                    <SelectValue placeholder="Select license type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {licenseTypes.map((type) => (
                                        <SelectItem
                                            key={type.code}
                                            value={type.code}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {type.name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {getFormattedPrice(type)} •{" "}
                                                    {getDurationText(type)} •{" "}
                                                    {type.max_devices} devices
                                                    {type.is_trial &&
                                                        " • Trial"}
                                                    {type.is_lifetime &&
                                                        " • Lifetime"}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.license_type && (
                                <p className="text-sm text-red-600">
                                    {errors.license_type}
                                </p>
                            )}
                        </div>

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
                                    errors.max_devices ? "border-red-500" : ""
                                }
                            />
                            <p className="text-xs text-gray-500">
                                Default value is set based on license type, but
                                can be customized
                            </p>
                            {errors.max_devices && (
                                <p className="text-sm text-red-600">
                                    {errors.max_devices}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purchasePrice">
                                Purchase Price
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="purchasePrice"
                                    type="text"
                                    value={formatRupiah(
                                        formData.purchase_price
                                    )}
                                    className="flex-1 bg-gray-100 dark:bg-gray-700"
                                    disabled
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                Price is automatically set based on selected
                                license type
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Payment Information
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="orderId">Order ID</Label>
                            <Input
                                id="orderId"
                                value={formData.order_id}
                                onChange={handleInputChange("order_id")}
                                placeholder="Optional order reference"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod">
                                Payment Method
                            </Label>
                            <Input
                                id="paymentMethod"
                                value={formData.payment_method}
                                onChange={handleInputChange("payment_method")}
                                placeholder="e.g., Credit Card, PayPal"
                            />
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label>Payment Receipt (Optional)</Label>

                        {/* Upload Area */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={openFileDialog}
                            className={`
                relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
                ${
                    dragActive
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                }
                ${
                    errors.payment_receipt
                        ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                        : "hover:border-gray-400 dark:hover:border-gray-500"
                }
                dark:bg-gray-700
              `}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />

                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                        Click to upload
                                    </span>
                                    {" or drag and drop"}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    Upload payment slip or receipt
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                    PDF, JPEG, PNG, GIF, WebP up to 5MB
                                </p>
                            </div>
                        </div>

                        {/* File Preview */}
                        {formData.payment_receipt && (
                            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {getFileIcon(formData.payment_receipt)}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {formData.payment_receipt.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatFileSize(
                                                    formData.payment_receipt
                                                        .size
                                                )}
                                            </p>
                                        </div>
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeFile}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Image Preview */}
                                {preview && (
                                    <div className="mt-3">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="max-w-full h-32 object-cover rounded border"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {errors.payment_receipt && (
                            <div className="flex items-center gap-2 text-sm text-red-600">
                                <AlertTriangle className="h-4 w-4" />
                                {errors.payment_receipt}
                            </div>
                        )}
                    </div>
                </div>

                {/* Admin Notes */}
                <div className="space-y-2">
                    <Label htmlFor="adminNotes">Admin Notes</Label>
                    <Textarea
                        id="adminNotes"
                        value={formData.admin_notes}
                        onChange={handleInputChange("admin_notes")}
                        placeholder="Optional notes about this license..."
                        rows={3}
                    />
                </div>

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full md:w-auto"
                >
                    <Key className="w-4 h-4 mr-2" />
                    {isLoading ? "Generating..." : "Generate License"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default LicenseForm;
