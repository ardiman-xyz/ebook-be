// components/Documentation/GettingStarted.tsx

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Play,
    Users,
    Key,
    Mail,
    CreditCard,
    Copy,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    Lightbulb,
    Monitor,
    Settings,
    Eye,
    Clock,
    DollarSign,
    Building,
    GraduationCap,
    UserCheck,
    Send,
    Shield,
} from "lucide-react";

export const GettingStarted: React.FC = () => {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), 2000);
    };

    const sampleLicenseKey = "FULL2024ABC12345";

    return (
        <div className="space-y-8">
            {/* Quick Start Guide */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Play className="h-5 w-5 text-green-600" />
                        Panduan Cepat - 5 Langkah Pertama
                    </CardTitle>
                    <CardDescription>
                        Follow langkah ini untuk membuat license pertama Anda
                        dalam 5 menit
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                                1
                            </span>
                        </div>
                        <div className="space-y-3 flex-1">
                            <h3 className="font-medium">
                                Buka Tab "Generate License"
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Di dashboard utama, klik tab "Generate License"
                                untuk membuat lisensi baru.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                        Pro Tips:
                                    </span>
                                </div>
                                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>
                                        • Siapkan data customer sebelum mulai
                                    </li>
                                    <li>
                                        • Pastikan sudah ada konfirmasi
                                        pembayaran
                                    </li>
                                    <li>
                                        • Pilih license type yang sesuai dengan
                                        kebutuhan
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600">
                                2
                            </span>
                        </div>
                        <div className="space-y-3 flex-1">
                            <h3 className="font-medium">Isi Data Customer</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Masukkan informasi customer yang akan
                                menggunakan lisensi.
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium flex items-center gap-2">
                                            <Users className="h-4 w-4 text-blue-600" />
                                            Informasi Dasar
                                        </h4>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                            <div>
                                                • <strong>Nama:</strong> John
                                                Doe
                                            </div>
                                            <div>
                                                • <strong>Email:</strong>{" "}
                                                john@example.com
                                            </div>
                                            <div>
                                                • <strong>Perusahaan:</strong>{" "}
                                                PT. Example (opsional)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium flex items-center gap-2">
                                            <Settings className="h-4 w-4 text-purple-600" />
                                            Pengaturan License
                                        </h4>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                            <div>
                                                • <strong>Max Device:</strong> 3
                                                perangkat
                                            </div>
                                            <div>
                                                •{" "}
                                                <strong>Tipe Customer:</strong>{" "}
                                                Business
                                            </div>
                                            <div>
                                                • <strong>Notes:</strong>{" "}
                                                Customer VIP
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">
                                3
                            </span>
                        </div>
                        <div className="space-y-3 flex-1">
                            <h3 className="font-medium">Pilih Tipe Lisensi</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Tentukan jenis lisensi sesuai kebutuhan dan
                                budget customer.
                            </p>
                            <div className="grid md:grid-cols-3 gap-3">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-3">
                                    <Badge className="bg-green-100 text-green-800 mb-2">
                                        DEMO
                                    </Badge>
                                    <div className="text-xs space-y-1">
                                        <div>📅 7 hari</div>
                                        <div>💻 1 device</div>
                                        <div>💰 Gratis</div>
                                        <div>⚡ Fitur terbatas</div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-3">
                                    <Badge className="bg-blue-100 text-blue-800 mb-2">
                                        FULL
                                    </Badge>
                                    <div className="text-xs space-y-1">
                                        <div>📅 1 tahun</div>
                                        <div>💻 3 devices</div>
                                        <div>💰 Rp 750.000</div>
                                        <div>⚡ Semua fitur</div>
                                    </div>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 rounded-lg p-3">
                                    <Badge className="bg-purple-100 text-purple-800 mb-2">
                                        LIFETIME
                                    </Badge>
                                    <div className="text-xs space-y-1">
                                        <div>📅 Selamanya</div>
                                        <div>💻 5 devices</div>
                                        <div>💰 Rp 2.500.000</div>
                                        <div>⚡ Premium</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-orange-600">
                                4
                            </span>
                        </div>
                        <div className="space-y-3 flex-1">
                            <h3 className="font-medium">
                                Generate License Key
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Klik tombol "Generate License" untuk membuat
                                license key unik secara otomatis.
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                            Contoh License Key yang di-generate:
                                        </p>
                                        <code className="bg-white dark:bg-gray-700 px-3 py-2 rounded border text-sm font-mono">
                                            {sampleLicenseKey}
                                        </code>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            copyToClipboard(sampleLicenseKey)
                                        }
                                        className={
                                            copiedText === sampleLicenseKey
                                                ? "bg-green-50 border-green-300"
                                                : ""
                                        }
                                    >
                                        {copiedText === sampleLicenseKey ? (
                                            <>
                                                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3 w-3 mr-1" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <div className="text-xs text-gray-500 bg-white dark:bg-gray-700 rounded p-2">
                                    <strong>Format:</strong>{" "}
                                    [TYPE][YEAR][RANDOM] - FULL2024ABC12345
                                    <br />
                                    <strong>Keunikan:</strong> Setiap key
                                    dijamin unik dan tidak bisa duplikat
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="space-y-3 flex-1">
                            <h3 className="font-medium">Kirim ke Customer</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Berikan license key kepada customer melalui
                                channel yang aman.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-3">
                                    <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                                        <Send className="h-4 w-4" />
                                        Cara Kirim yang Aman
                                    </h4>
                                    <ul className="text-sm text-green-600 dark:text-green-300 space-y-1">
                                        <li>• Email private ke customer</li>
                                        <li>• WhatsApp/Telegram personal</li>
                                        <li>
                                            • Member area/dashboard customer
                                        </li>
                                        <li>• SMS untuk license key pendek</li>
                                    </ul>
                                </div>

                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-3">
                                    <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Jangan Kirim Via
                                    </h4>
                                    <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
                                        <li>
                                            • Media sosial (Instagram, Facebook)
                                        </li>
                                        <li>• Forum atau grup public</li>
                                        <li>• Comment section website</li>
                                        <li>• Platform review (Google, dll)</li>
                                    </ul>
                                </div>
                            </div>

                            <Alert>
                                <Shield className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Security Note:</strong> License key
                                    adalah aset berharga. Treat seperti password
                                    - jangan share di tempat public atau
                                    screenshot yang bisa diakses orang lain.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Customer Types Explanation */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Memahami Tipe Customer
                    </CardTitle>
                    <CardDescription>
                        Perbedaan kategori customer dan implikasinya
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Individual */}
                        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center gap-3 mb-3">
                                <UserCheck className="h-6 w-6 text-blue-600" />
                                <h3 className="font-medium">Individual</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="text-gray-600 dark:text-gray-300">
                                    <strong>Untuk:</strong> Freelancer,
                                    mahasiswa, personal use
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    <strong>Support:</strong> Email standard
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    <strong>Invoice:</strong> Personal receipt
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    <strong>Payment:</strong> Personal account
                                </div>
                            </div>
                        </div>

                        {/* Business */}
                        <div className="border border-green-200 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                            <div className="flex items-center gap-3 mb-3">
                                <Building className="h-6 w-6 text-green-600" />
                                <h3 className="font-medium">Business</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="text-gray-600 dark:text-gray-300">
                                    <strong>Untuk:</strong> Perusahaan, startup,
                                    komersial
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    <strong>Support:</strong> Priority support
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    <strong>Invoice:</strong> Company invoice +
                                    tax
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    <strong>Payment:</strong> Corporate account
                                </div>
                            </div>
                        </div>

                        {/* Education */}
                        <div className="border border-purple-200 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                            <div className="flex items-center gap-3 mb-3">
                                <GraduationCap className="h-6 w-6 text-purple-600" />
                                <h3 className="font-medium">Education</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="text-gray-600 dark:text-gray-300">
                                    <strong>Untuk:</strong> Sekolah,
                                    universitas, lembaga
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    <strong>Support:</strong> Educational
                                    support
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    <strong>Invoice:</strong> Educational
                                    discount
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    <strong>Payment:</strong> Institution
                                    account
                                </div>
                            </div>
                        </div>
                    </div>

                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Penting:</strong> Kategori customer
                            mempengaruhi pricing, level support, dan terms &
                            conditions. Pastikan pilih kategori yang tepat
                            sesuai penggunaan actual customer.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            {/* Best Practices for Beginners */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-600" />
                        Tips untuk Pemula
                    </CardTitle>
                    <CardDescription>
                        Best practices yang perlu diketahui saat pertama kali
                        menggunakan sistem
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Do's */}
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />✅ Yang
                                Sebaiknya Dilakukan
                            </h4>
                            <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
                                <li>
                                    • <strong>Test dengan DEMO license</strong>{" "}
                                    dulu sebelum jual
                                </li>
                                <li>
                                    • <strong>Backup license keys</strong> di
                                    spreadsheet atau notes
                                </li>
                                <li>
                                    •{" "}
                                    <strong>Catat customer info lengkap</strong>{" "}
                                    untuk follow-up
                                </li>
                                <li>
                                    • <strong>Set reminder</strong> untuk
                                    expired licenses
                                </li>
                                <li>
                                    • <strong>Gunakan admin notes</strong> untuk
                                    tracking
                                </li>
                                <li>
                                    •{" "}
                                    <strong>Double-check email customer</strong>{" "}
                                    sebelum generate
                                </li>
                                <li>
                                    • <strong>Konfirmasi pembayaran</strong>{" "}
                                    sebelum generate
                                </li>
                            </ul>
                        </div>

                        {/* Don'ts */}
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4">
                            <h4 className="font-medium text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />❌ Yang
                                Sebaiknya Dihindari
                            </h4>
                            <ul className="text-sm text-red-700 dark:text-red-300 space-y-2">
                                <li>
                                    •{" "}
                                    <strong>
                                        Generate tanpa konfirmasi bayar
                                    </strong>{" "}
                                    dari customer
                                </li>
                                <li>
                                    •{" "}
                                    <strong>
                                        Share license key di grup public
                                    </strong>{" "}
                                    atau medsos
                                </li>
                                <li>
                                    • <strong>Lupa set max devices</strong>{" "}
                                    sesuai agreement
                                </li>
                                <li>
                                    • <strong>Salah pilih license type</strong>{" "}
                                    (baca requirement)
                                </li>
                                <li>
                                    •{" "}
                                    <strong>
                                        Delete license yang masih aktif
                                    </strong>{" "}
                                    tanpa notice
                                </li>
                                <li>
                                    •{" "}
                                    <strong>
                                        Ignore expired notifications
                                    </strong>{" "}
                                    dari system
                                </li>
                                <li>
                                    •{" "}
                                    <strong>
                                        Mix personal & business customer
                                    </strong>{" "}
                                    categories
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Common First-Time Scenarios */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-blue-600" />
                        Skenario Pertama Kali
                    </CardTitle>
                    <CardDescription>
                        Situasi yang sering dialami pemula dan cara mengatasinya
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        {/* Scenario 1 */}
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                Customer Komplain: "License Tidak Bisa Aktivasi"
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                Customer bilang error saat input license key di
                                software.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded p-3">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    <strong>Troubleshooting Steps:</strong>
                                    <br />
                                    1. Cek license status di dashboard (active?)
                                    <br />
                                    2. Pastikan customer copy-paste key dengan
                                    benar (no typo)
                                    <br />
                                    3. Cek max devices limit (sudah penuh?)
                                    <br />
                                    4. Verify customer punya internet connection
                                    <br />
                                    5. Check app version compatibility
                                </p>
                            </div>
                        </div>

                        {/* Scenario 2 */}
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-600" />
                                Salah Generate License Type
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                Sudah generate FULL license tapi ternyata
                                customer mau TRIAL dulu.
                            </p>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded p-3">
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    <strong>Solution:</strong>
                                    <br />
                                    1. Suspend license FULL yang sudah dibuat
                                    <br />
                                    2. Generate license TRIAL baru untuk
                                    customer
                                    <br />
                                    3. Kirim trial key ke customer
                                    <br />
                                    4. Set reminder untuk follow-up setelah
                                    trial expired
                                    <br />
                                    5. Reactivate FULL license jika customer
                                    decide to buy
                                </p>
                            </div>
                        </div>

                        {/* Scenario 3 */}
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                Customer Request Refund
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                Customer baru beli kemarin, tapi software tidak
                                sesuai ekspektasi.
                            </p>
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded p-3">
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    <strong>Process:</strong>
                                    <br />
                                    1. Cek refund policy company (biasanya 7-30
                                    hari)
                                    <br />
                                    2. Revoke license untuk prevent future use
                                    <br />
                                    3. Update admin notes dengan reason refund
                                    <br />
                                    4. Process refund sesuai payment method
                                    <br />
                                    5. Send confirmation email ke customer
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
                <CardHeader>
                    <CardTitle>Langkah Selanjutnya</CardTitle>
                    <CardDescription>
                        Setelah berhasil membuat license pertama, pelajari lebih
                        lanjut
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Button
                            className="h-auto p-4 justify-start"
                            variant="outline"
                            onClick={() =>
                                (window.location.href = "/dashboard")
                            }
                        >
                            <div className="flex items-start gap-3">
                                <Key className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div className="text-left">
                                    <div className="font-medium">
                                        Praktik Buat License
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Coba generate license pertama Anda
                                    </div>
                                </div>
                            </div>
                        </Button>

                        <Button
                            className="h-auto p-4 justify-start"
                            variant="outline"
                        >
                            <div className="flex items-start gap-3">
                                <Monitor className="h-5 w-5 text-purple-600 mt-0.5" />
                                <div className="text-left">
                                    <div className="font-medium">
                                        Tonton Video Tutorial
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Visual guide step-by-step
                                    </div>
                                </div>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
