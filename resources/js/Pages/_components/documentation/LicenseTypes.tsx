import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Key,
    Clock,
    Users,
    Building,
    GraduationCap,
    Shield,
    Smartphone,
    Monitor,
    Laptop,
    Tablet,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Infinity,
} from "lucide-react";

export const LicenseTypesDocumentation: React.FC = () => {
    const formatRupiah = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            {/* Jenis-jenis Lisensi */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-blue-600" />
                        Jenis-jenis Lisensi
                    </CardTitle>
                    <CardDescription>
                        Berbagai tipe lisensi yang tersedia dan perbedaannya
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* DEMO License */}
                    <div className="border border-purple-200 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                                    DEMO
                                </Badge>
                                <h3 className="font-medium">Demo License</h3>
                            </div>
                            <span className="text-sm font-medium text-green-600">
                                GRATIS
                            </span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-purple-600" />
                                <span>
                                    <strong>Durasi:</strong> 7 hari
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-purple-600" />
                                <span>
                                    <strong>Max Device:</strong> 1 perangkat
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-purple-600" />
                                <span>
                                    <strong>Fitur:</strong> Terbatas + Watermark
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <strong>Digunakan untuk:</strong> Testing
                                software sebelum beli, demo ke calon customer,
                                atau trial untuk developer yang mau integrasi.
                            </p>
                        </div>
                    </div>

                    {/* TRIAL License */}
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                    TRIAL
                                </Badge>
                                <h3 className="font-medium">Trial License</h3>
                            </div>
                            <span className="text-sm font-medium text-green-600">
                                GRATIS
                            </span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span>
                                    <strong>Durasi:</strong> 30 hari
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-blue-600" />
                                <span>
                                    <strong>Max Device:</strong> 1 perangkat
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-600" />
                                <span>
                                    <strong>Fitur:</strong> Hampir semua, ada
                                    limit
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <strong>Digunakan untuk:</strong> Evaluasi
                                lengkap software sebelum membeli lisensi
                                berbayar. Customer bisa test semua fitur dengan
                                beberapa batasan.
                            </p>
                        </div>
                    </div>

                    {/* FULL License */}
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-green-100 text-green-800 border-green-300">
                                    FULL
                                </Badge>
                                <h3 className="font-medium">Full License</h3>
                            </div>
                            <span className="text-sm font-medium text-blue-600">
                                {formatRupiah(750000)}
                            </span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-green-600" />
                                <span>
                                    <strong>Durasi:</strong> 1 tahun
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-green-600" />
                                <span>
                                    <strong>Max Device:</strong> 3 perangkat
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-600" />
                                <span>
                                    <strong>Fitur:</strong> Semua fitur tanpa
                                    batas
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <strong>Digunakan untuk:</strong> User
                                individual atau small business yang butuh akses
                                penuh ke software untuk kebutuhan sehari-hari.
                            </p>
                        </div>
                    </div>

                    {/* ENTERPRISE License */}
                    <div className="border border-orange-200 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                                    ENT
                                </Badge>
                                <h3 className="font-medium">
                                    Enterprise License
                                </h3>
                            </div>
                            <span className="text-sm font-medium text-blue-600">
                                {formatRupiah(3000000)}
                            </span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-600" />
                                <span>
                                    <strong>Durasi:</strong> 3 tahun
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-orange-600" />
                                <span>
                                    <strong>Max Device:</strong> 10 perangkat
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-orange-600" />
                                <span>
                                    <strong>Fitur:</strong> Premium + Admin
                                    Panel
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <strong>Digunakan untuk:</strong> Perusahaan
                                besar yang butuh multiple device access, fitur
                                admin panel, dan priority support.
                            </p>
                        </div>
                    </div>

                    {/* LIFETIME License */}
                    <div className="border border-pink-200 rounded-lg p-4 bg-pink-50 dark:bg-pink-900/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-pink-100 text-pink-800 border-pink-300">
                                    LIFETIME
                                </Badge>
                                <h3 className="font-medium">
                                    Lifetime License
                                </h3>
                            </div>
                            <span className="text-sm font-medium text-blue-600">
                                {formatRupiah(2500000)}
                            </span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Infinity className="h-4 w-4 text-pink-600" />
                                <span>
                                    <strong>Durasi:</strong> Selamanya
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-pink-600" />
                                <span>
                                    <strong>Max Device:</strong> 5 perangkat
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-pink-600" />
                                <span>
                                    <strong>Fitur:</strong> Semua + Premium
                                    Support
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <strong>Digunakan untuk:</strong> Customer yang
                                mau investasi jangka panjang. Bayar sekali,
                                pakai selamanya dengan update gratis.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Customer Type */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Jenis Customer
                    </CardTitle>
                    <CardDescription>
                        Kategori customer dan perbedaan treatment-nya
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Individual */}
                        <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center gap-3 mb-3">
                                <Users className="h-6 w-6 text-blue-600" />
                                <h3 className="font-medium">Individual</h3>
                            </div>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                <li>• Perorangan/freelancer</li>
                                <li>• Untuk kebutuhan personal</li>
                                <li>• Support via email</li>
                                <li>• Invoice personal</li>
                            </ul>
                        </div>

                        {/* Business */}
                        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                            <div className="flex items-center gap-3 mb-3">
                                <Building className="h-6 w-6 text-green-600" />
                                <h3 className="font-medium">Business</h3>
                            </div>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                <li>• Perusahaan/startup</li>
                                <li>• Untuk kebutuhan komersial</li>
                                <li>• Priority support</li>
                                <li>• Invoice + faktur pajak</li>
                            </ul>
                        </div>

                        {/* Education */}
                        <div className="border rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                            <div className="flex items-center gap-3 mb-3">
                                <GraduationCap className="h-6 w-6 text-purple-600" />
                                <h3 className="font-medium">Education</h3>
                            </div>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                <li>• Sekolah/universitas</li>
                                <li>• Untuk kebutuhan edukasi</li>
                                <li>• Harga khusus (discount)</li>
                                <li>• Extended trial period</li>
                            </ul>
                        </div>
                    </div>

                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Penting:</strong> Jenis customer menentukan
                            pricing, support level, dan fitur yang tersedia.
                            Pastikan pilih kategori yang tepat.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            {/* Max Device Concept */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5 text-blue-600" />
                        Konsep Max Device
                    </CardTitle>
                    <CardDescription>
                        Bagaimana sistem menghitung dan membatasi perangkat
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium mb-3">
                            Apa itu Max Device?
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Max Device = batas maksimal perangkat yang bisa
                            menggunakan 1 license key secara bersamaan.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h5 className="text-sm font-medium text-green-600 mb-2">
                                    ✅ Yang Dihitung Sebagai Device:
                                </h5>
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <Laptop className="h-3 w-3" />
                                        Laptop/PC Desktop
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Smartphone className="h-3 w-3" />
                                        Smartphone (jika support)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Tablet className="h-3 w-3" />
                                        Tablet (jika support)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Monitor className="h-3 w-3" />
                                        Virtual Machine
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-sm font-medium text-red-600 mb-2">
                                    ❌ Yang TIDAK Dihitung:
                                </h5>
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <li>
                                        • Browser yang sama di device yang sama
                                    </li>
                                    <li>
                                        • Reinstall software di device yang sama
                                    </li>
                                    <li>• Ganti OS di device yang sama</li>
                                    <li>• Multiple user di 1 device</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Device Management Examples */}
                    <div className="space-y-3">
                        <h4 className="font-medium">Contoh Skenario:</h4>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4">
                                <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">
                                    ✅ Penggunaan Normal
                                </h5>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    John punya license max 3 device. Dia install
                                    di:
                                    <br />• Laptop kantor
                                    <br />• PC rumah
                                    <br />• Laptop pribadi
                                    <br />
                                    <strong>Status:</strong> OK, masih dalam
                                    batas
                                </p>
                            </div>

                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4">
                                <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
                                    ❌ Melebihi Batas
                                </h5>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    John coba install di device ke-4:
                                    <br />• Error: "Device limit exceeded"
                                    <br />• Harus deactivate device lain dulu
                                    <br />• Atau upgrade ke license yang lebih
                                    tinggi
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* License Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Status Lisensi
                    </CardTitle>
                    <CardDescription>
                        Berbagai status lisensi dan artinya
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Active */}
                        <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-green-800 dark:text-green-200">
                                    Active
                                </h4>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    Lisensi berfungsi normal, customer bisa
                                    aktivasi dan menggunakan software.
                                </p>
                            </div>
                        </div>

                        {/* Suspended */}
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                                    Suspended
                                </h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    Lisensi ditangguhkan sementara. Bisa
                                    diaktifkan kembali oleh admin.
                                </p>
                            </div>
                        </div>

                        {/* Revoked */}
                        <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 rounded-lg">
                            <XCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-orange-800 dark:text-orange-200">
                                    Revoked
                                </h4>
                                <p className="text-sm text-orange-700 dark:text-orange-300">
                                    Lisensi dicabut permanen. Tidak bisa
                                    diaktifkan lagi, biasanya karena
                                    pelanggaran.
                                </p>
                            </div>
                        </div>

                        {/* Expired */}
                        <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
                            <Clock className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-red-800 dark:text-red-200">
                                    Expired
                                </h4>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    Lisensi sudah habis masa berlakunya. Perlu
                                    diperpanjang untuk mengaktifkan lagi.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Important Notes */}
            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    <strong>Catatan Penting:</strong>
                    <br />• Lisensi LIFETIME tidak pernah expired tapi bisa
                    di-suspend/revoke jika melanggar terms
                    <br />• Perubahan max device bisa dilakukan via edit, tapi
                    tidak bisa dikurangi jika sudah ada device aktif melebihi
                    batas baru
                    <br />• Customer type mempengaruhi pricing dan support
                    level, pilih dengan hati-hati
                    <br />• Backup license key customer di tempat yang aman,
                    jika hilang akan sulit di-recover
                </AlertDescription>
            </Alert>
        </div>
    );
};
