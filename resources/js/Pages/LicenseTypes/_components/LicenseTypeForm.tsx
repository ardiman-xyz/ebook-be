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

// TypeScript interfaces
interface LicenseType {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    duration: string;
    devices: number;
    type: "Trial" | "Standard" | "Lifetime" | "Enterprise";
    hasDiscount: boolean;
    discountPercentage: number;
}

// Zod validation schema
const licenseTypeSchema = z.object({
    name: z
        .string()
        .min(1, "Nama lisensi wajib diisi")
        .min(3, "Nama lisensi minimal 3 karakter")
        .max(50, "Nama lisensi maksimal 50 karakter"),
    originalPrice: z.number().min(0, "Harga asli tidak boleh negatif"),
    hasDiscount: z.boolean(),
    discountPercentage: z
        .number()
        .min(0, "Diskon tidak boleh negatif")
        .max(100, "Diskon tidak boleh lebih dari 100%"),
    duration: z
        .string()
        .min(1, "Durasi wajib diisi")
        .max(20, "Durasi maksimal 20 karakter"),
    devices: z
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
    onSave: (data: LicenseType) => void;
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
            originalPrice: 0,
            hasDiscount: false,
            discountPercentage: 0,
            duration: "",
            devices: 1,
            type: "Standard",
        },
    });

    const { watch, setValue, reset } = form;
    const watchedValues = watch();

    // Calculate final price based on discount
    const finalPrice = watchedValues.hasDiscount
        ? watchedValues.originalPrice *
          (1 - watchedValues.discountPercentage / 100)
        : watchedValues.originalPrice;

    const discountAmount = watchedValues.originalPrice - finalPrice;

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

    // Format number only (without currency symbol)
    const formatNumber = (amount: number): string => {
        if (amount === 0) return "0";
        return amount.toLocaleString("id-ID");
    };

    // Reset form when modal opens/closes or editing different license type
    useEffect(() => {
        if (isOpen) {
            if (editingLicenseType) {
                reset({
                    name: editingLicenseType.name,
                    originalPrice: editingLicenseType.originalPrice,
                    hasDiscount: editingLicenseType.hasDiscount,
                    discountPercentage: editingLicenseType.discountPercentage,
                    duration: editingLicenseType.duration,
                    devices: editingLicenseType.devices,
                    type: editingLicenseType.type,
                });
            } else {
                reset({
                    name: "",
                    originalPrice: 0,
                    hasDiscount: false,
                    discountPercentage: 0,
                    duration: "",
                    devices: 1,
                    type: "Standard",
                });
            }
        }
    }, [isOpen, editingLicenseType, reset]);

    // Handle discount toggle
    const handleDiscountToggle = (checked: boolean) => {
        setValue("hasDiscount", checked);
        if (!checked) {
            setValue("discountPercentage", 0);
        }
    };

    const onSubmit = (data: FormData) => {
        const licenseTypeData: LicenseType = {
            id: editingLicenseType?.id || 0,
            name: data.name,
            price: finalPrice,
            originalPrice: data.originalPrice,
            duration: data.duration,
            devices: data.devices,
            type: data.type,
            hasDiscount: data.hasDiscount,
            discountPercentage: data.discountPercentage,
        };

        onSave(licenseTypeData);
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
                                            defaultValue={field.value}
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
                                    name="originalPrice"
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
                                    name="hasDiscount"
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

                                {watchedValues.hasDiscount && (
                                    <FormField
                                        control={form.control}
                                        name="discountPercentage"
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
                                {watchedValues.originalPrice > 0 && (
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
                                                        watchedValues.hasDiscount &&
                                                        watchedValues.discountPercentage >
                                                            0
                                                            ? "line-through text-gray-500"
                                                            : "font-medium text-gray-900 dark:text-white"
                                                    }
                                                >
                                                    {formatRupiah(
                                                        watchedValues.originalPrice
                                                    )}
                                                </span>
                                            </div>
                                            {watchedValues.hasDiscount &&
                                                watchedValues.discountPercentage >
                                                    0 && (
                                                    <>
                                                        <div className="flex justify-between text-red-600">
                                                            <span>
                                                                Discount (
                                                                {
                                                                    watchedValues.discountPercentage
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
                                name="devices"
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
                                                    {watchedValues.hasDiscount &&
                                                        watchedValues.discountPercentage >
                                                            0 && (
                                                            <Badge
                                                                variant="destructive"
                                                                className="text-xs"
                                                            >
                                                                <Percent className="h-3 w-3 mr-1" />
                                                                {
                                                                    watchedValues.discountPercentage
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
                                                        {watchedValues.hasDiscount &&
                                                            watchedValues.discountPercentage >
                                                                0 && (
                                                                <span className="line-through text-gray-400 text-xs">
                                                                    {formatRupiah(
                                                                        watchedValues.originalPrice
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
                                                        {watchedValues.devices}{" "}
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
                                                {watchedValues.hasDiscount &&
                                                    watchedValues.discountPercentage >
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
