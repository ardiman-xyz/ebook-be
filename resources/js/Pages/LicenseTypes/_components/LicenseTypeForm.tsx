// components/LicenseTypeForm.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Save, Percent, DollarSign, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import RupiahInput from "./RupiahInput";
import PercentageInput from "./PercentageInput";

// TypeScript interfaces - Updated to match backend schema
interface LicenseType {
    id: number;
    code?: string;
    name: string;
    price: number;
    original_price: number;
    duration?: string;
    duration_text?: string;
    max_devices: number;
    type: "Trial" | "Standard" | "Lifetime" | "Enterprise";
    has_discount: boolean;
    discount_percentage: number;
    is_active: boolean;
    description?: string;
    formatted_price?: string;
    formatted_original_price?: string;
    savings_amount?: number;
    is_discounted?: boolean;
    currency?: string;
}

// Zod validation schema - Updated field names
const licenseTypeSchema = z.object({
    name: z
        .string()
        .min(1, "Nama lisensi wajib diisi")
        .min(3, "Nama lisensi minimal 3 karakter")
        .max(50, "Nama lisensi maksimal 50 karakter"),
    original_price: z.number().min(0, "Harga asli tidak boleh negatif"),
    has_discount: z.boolean(),
    discount_percentage: z
        .number()
        .min(0, "Diskon tidak boleh negatif")
        .max(100, "Diskon tidak boleh lebih dari 100%"),
    duration: z
        .string()
        .min(1, "Durasi wajib diisi")
        .max(20, "Durasi maksimal 20 karakter"),
    max_devices: z
        .number()
        .min(1, "Minimal 1 perangkat")
        .max(100, "Maksimal 100 perangkat"),
    type: z.enum(["Trial", "Standard", "Lifetime", "Enterprise"], {
        required_error: "Silakan pilih jenis lisensi",
    }),
});

type FormData = z.infer<typeof licenseTypeSchema>;

interface LicenseTypeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: LicenseType) => Promise<void>;
    editingLicenseType?: LicenseType | null;
    isLoading?: boolean;
}

const LicenseTypeForm: React.FC<LicenseTypeFormProps> = ({
    isOpen,
    onClose,
    onSave,
    editingLicenseType = null,
    isLoading = false,
}) => {
    const form = useForm<FormData>({
        resolver: zodResolver(licenseTypeSchema),
        defaultValues: {
            name: "",
            original_price: 0,
            has_discount: false,
            discount_percentage: 0,
            duration: "",
            max_devices: 1,
            type: "Standard",
        },
    });

    const { watch, setValue, reset } = form;
    const watchedValues = watch();

    // Calculate final price based on discount
    const finalPrice = watchedValues.has_discount
        ? watchedValues.original_price *
          (1 - watchedValues.discount_percentage / 100)
        : watchedValues.original_price;

    const discountAmount = watchedValues.original_price - finalPrice;

    // Format currency
    const formatRupiah = (amount: number): string => {
        if (amount === 0) return "Free";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Reset form when modal opens/closes or editing different license type
    useEffect(() => {
        if (isOpen) {
            if (editingLicenseType) {
                reset({
                    name: editingLicenseType.name,
                    original_price: editingLicenseType.original_price,
                    has_discount: editingLicenseType.has_discount,
                    discount_percentage: editingLicenseType.discount_percentage,
                    duration:
                        editingLicenseType.duration ||
                        editingLicenseType.duration_text ||
                        "",
                    max_devices: editingLicenseType.max_devices,
                    type: editingLicenseType.type,
                });
            } else {
                reset({
                    name: "",
                    original_price: 0,
                    has_discount: false,
                    discount_percentage: 0,
                    duration: "",
                    max_devices: 1,
                    type: "Standard",
                });
            }
        }
    }, [isOpen, editingLicenseType, reset]);

    // Handle discount toggle
    const handleDiscountToggle = (checked: boolean) => {
        setValue("has_discount", checked);
        if (!checked) {
            setValue("discount_percentage", 0);
        }
    };

    const onSubmit = async (data: FormData) => {
        const licenseTypeData: LicenseType = {
            id: editingLicenseType?.id || 0,
            name: data.name,
            price: finalPrice,
            original_price: data.original_price,
            duration: data.duration,
            max_devices: data.max_devices,
            type: data.type,
            has_discount: data.has_discount,
            discount_percentage: data.discount_percentage,
            is_active: true,
            description: "",
        };

        await onSave(licenseTypeData);
    };

    const getTypeColor = (type: string): string => {
        switch (type) {
            case "Trial":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
            case "Lifetime":
                return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
            case "Enterprise":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
            default:
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {editingLicenseType
                            ? "Edit Tipe Lisensi"
                            : "Buat Tipe Lisensi Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingLicenseType
                            ? "Ubah detail tipe lisensi di bawah ini."
                            : "Isi detail untuk membuat tipe lisensi baru."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Lisensi *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="contoh: Lisensi Basic"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jenis Lisensi</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={isLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih jenis lisensi" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Trial">
                                                    Trial
                                                </SelectItem>
                                                <SelectItem value="Standard">
                                                    Standard
                                                </SelectItem>
                                                <SelectItem value="Lifetime">
                                                    Seumur Hidup
                                                </SelectItem>
                                                <SelectItem value="Enterprise">
                                                    Enterprise
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Pricing Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <DollarSign className="h-5 w-5" />
                                    Pricing Configuration
                                </CardTitle>
                                <CardDescription>
                                    Set the pricing and discount options for
                                    this license type.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="original_price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Original Price (IDR)
                                            </FormLabel>
                                            <FormControl>
                                                <RupiahInput
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Enter price (e.g., 1.000.000)"
                                                    disabled={isLoading}
                                                    showCurrency={true}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter 0 for free license.
                                                Format: 1.000.000 for one
                                                million
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator />

                                {/* Discount Section */}
                                <FormField
                                    control={form.control}
                                    name="has_discount"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base flex items-center gap-2">
                                                    <Percent className="h-4 w-4" />
                                                    Enable Discount
                                                </FormLabel>
                                                <FormDescription>
                                                    Apply a percentage discount
                                                    to the original price
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        field.onChange(checked);
                                                        handleDiscountToggle(
                                                            checked
                                                        );
                                                    }}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {watchedValues.has_discount && (
                                    <FormField
                                        control={form.control}
                                        name="discount_percentage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Discount Percentage
                                                </FormLabel>
                                                <FormControl>
                                                    <PercentageInput
                                                        value={field.value}
                                                        onChange={
                                                            field.onChange
                                                        }
                                                        placeholder="Enter discount (e.g., 25)"
                                                        disabled={isLoading}
                                                        min={0}
                                                        max={100}
                                                        showIcon={true}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Enter discount percentage
                                                    (0-100). Format: 25 for 25%
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {/* Price Summary */}
                                {watchedValues.original_price > 0 && (
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-3">
                                            💰 Price Summary
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Original Price:
                                                </span>
                                                <span
                                                    className={
                                                        watchedValues.has_discount &&
                                                        watchedValues.discount_percentage >
                                                            0
                                                            ? "line-through text-gray-500"
                                                            : "font-medium text-gray-900 dark:text-white"
                                                    }
                                                >
                                                    {formatRupiah(
                                                        watchedValues.original_price
                                                    )}
                                                </span>
                                            </div>
                                            {watchedValues.has_discount &&
                                                watchedValues.discount_percentage >
                                                    0 && (
                                                    <>
                                                        <div className="flex justify-between text-red-600">
                                                            <span>
                                                                Discount (
                                                                {
                                                                    watchedValues.discount_percentage
                                                                }
                                                                %):
                                                            </span>
                                                            <span>
                                                                -
                                                                {formatRupiah(
                                                                    discountAmount
                                                                )}
                                                            </span>
                                                        </div>
                                                        <Separator />
                                                        <div className="flex justify-between font-medium text-green-600">
                                                            <span>
                                                                Final Price:
                                                            </span>
                                                            <span className="text-lg">
                                                                {formatRupiah(
                                                                    finalPrice
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-green-600 text-center mt-2 p-2 bg-green-50 dark:bg-green-900/30 rounded">
                                                            🎉 Customers save{" "}
                                                            {formatRupiah(
                                                                discountAmount
                                                            )}
                                                            !
                                                        </div>
                                                    </>
                                                )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Configuration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Durasi *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="contoh: 1 tahun, Seumur hidup, 30 hari"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="max_devices"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Maksimal Perangkat *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="100"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Preview */}
                        {watchedValues.name && (
                            <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Eye className="h-5 w-5" />
                                        Pratinjau
                                    </CardTitle>
                                    <CardDescription>
                                        Ini adalah tampilan tipe lisensi Anda
                                        untuk pelanggan.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                                        {watchedValues.name}
                                                    </h3>
                                                    {watchedValues.has_discount &&
                                                        watchedValues.discount_percentage >
                                                            0 && (
                                                            <Badge
                                                                variant="destructive"
                                                                className="text-xs"
                                                            >
                                                                <Percent className="h-3 w-3 mr-1" />
                                                                {
                                                                    watchedValues.discount_percentage
                                                                }
                                                                % OFF
                                                            </Badge>
                                                        )}
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {formatRupiah(
                                                                finalPrice
                                                            )}
                                                        </span>
                                                        {watchedValues.has_discount &&
                                                            watchedValues.discount_percentage >
                                                                0 && (
                                                                <span className="line-through text-gray-400 text-xs">
                                                                    {formatRupiah(
                                                                        watchedValues.original_price
                                                                    )}
                                                                </span>
                                                            )}
                                                    </div>
                                                    <span>•</span>
                                                    <span>
                                                        {watchedValues.duration}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {
                                                            watchedValues.max_devices
                                                        }{" "}
                                                        perangkat
                                                    </span>
                                                    <span>•</span>
                                                    <Badge
                                                        className={`text-xs ${getTypeColor(
                                                            watchedValues.type
                                                        )}`}
                                                    >
                                                        {watchedValues.type ===
                                                        "Lifetime"
                                                            ? "Seumur Hidup"
                                                            : watchedValues.type}
                                                    </Badge>
                                                </div>
                                                {watchedValues.has_discount &&
                                                    watchedValues.discount_percentage >
                                                        0 && (
                                                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                            💰 Hemat{" "}
                                                            {formatRupiah(
                                                                discountAmount
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {isLoading
                                    ? "Menyimpan..."
                                    : editingLicenseType
                                    ? "Perbarui Tipe Lisensi"
                                    : "Buat Tipe Lisensi"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default LicenseTypeForm;
