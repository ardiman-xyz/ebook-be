// components/Documentation/LicenseManagement.tsx

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
    Settings,
    Edit,
    Ban,
    ShieldX,
    Trash2,
    Shield,
    Copy,
    Eye,
    Users,
    AlertTriangle,
    CheckCircle,
    Clock,
    Monitor,
    Activity,
    TrendingUp,
    Search,
    Download,
    XCircle,
} from "lucide-react";

export const LicenseManagementGuide: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* License Actions Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-blue-600" />
                        Actions yang Bisa Dilakukan
                    </CardTitle>
                    <CardDescription>
                        Berbagai aksi pengelolaan lisensi dan kapan
                        menggunakannya
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* View & Basic Actions */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/20">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-600" />
                            Basic Actions
                        </h3>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded border p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-sm">
                                        View Details
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                    Melihat informasi lengkap lisensi, device
                                    yang terdaftar, dan history penggunaan.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded border p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Copy className="h-4 w-4 text-green-600" />
                                    <span className="font-medium text-sm">
                                        Copy License Key
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                    Copy license key ke clipboard untuk dikirim
                                    ke customer atau backup.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded border p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Search className="h-4 w-4 text-purple-600" />
                                    <span className="font-medium text-sm">
                                        Search & Filter
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                    Cari lisensi berdasarkan customer, email,
                                    atau license key dengan filter status.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Edit License */}
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex items-center gap-3 mb-3">
                            <Edit className="h-5 w-5 text-blue-600" />
                            <h3 className="font-medium">Edit License</h3>
                            <Badge
                                variant="outline"
                                className="bg-blue-100 text-blue-800"
                            >
                                Safe Action
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Mengubah detail lisensi tanpa mengganggu
                                aktivasi yang sudah ada.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-green-600 mb-2">
                                        ✅ Yang Bisa Diubah:
                                    </h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                        <li>• Nama & email customer</li>
                                        <li>
                                            • Tipe customer
                                            (individual/business)
                                        </li>
                                        <li>• Max devices (naik saja)</li>
                                        <li>• Tanggal expired</li>
                                        <li>• Harga & info pembayaran</li>
                                        <li>• Admin notes</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-red-600 mb-2">
                                        ❌ Yang Tidak Bisa:
                                    </h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                        <li>
                                            • License key (generated otomatis)
                                        </li>
                                        <li>• Tipe lisensi (DEMO/FULL/etc)</li>
                                        <li>
                                            • Kurangi max devices jika ada
                                            device aktif
                                        </li>
                                        <li>• Status (pakai suspend/revoke)</li>
                                    </ul>
                                </div>
                            </div>

                            <Alert>
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Kapan digunakan:</strong> Customer
                                    ganti email, extend masa berlaku, update
                                    info pembayaran, atau adjust max devices.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>

                    {/* Suspend License */}
                    <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                        <div className="flex items-center gap-3 mb-3">
                            <Ban className="h-5 w-5 text-yellow-600" />
                            <h3 className="font-medium">Suspend License</h3>
                            <Badge
                                variant="outline"
                                className="bg-yellow-100 text-yellow-800"
                            >
                                Reversible
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Menonaktifkan lisensi sementara. Semua device
                                ter-disconnect, tapi data tetap aman.
                            </p>

                            <div className="bg-white dark:bg-gray-800 rounded border p-3">
                                <h4 className="text-sm font-medium mb-2">
                                    Yang Terjadi Saat Suspend:
                                </h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <li>
                                        • Status berubah: Active → Suspended
                                    </li>
                                    <li>
                                        • Semua device langsung ter-disconnect
                                    </li>
                                    <li>
                                        • Customer tidak bisa aktivasi device
                                        baru
                                    </li>
                                    <li>• Data & history tetap tersimpan</li>
                                    <li>• Bisa di-reactivate kapan saja</li>
                                </ul>
                            </div>

                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Kapan digunakan:</strong> Customer
                                    telat bayar, melanggar terms ringan,
                                    maintenance system, atau investigasi
                                    masalah.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>

                    {/* Revoke License */}
                    <div className="border border-orange-200 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                        <div className="flex items-center gap-3 mb-3">
                            <ShieldX className="h-5 w-5 text-orange-600" />
                            <h3 className="font-medium">Revoke License</h3>
                            <Badge
                                variant="outline"
                                className="bg-orange-100 text-orange-800"
                            >
                                Permanent
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Mencabut lisensi secara permanen. Tidak bisa
                                diaktifkan lagi.
                            </p>

                            <div className="bg-white dark:bg-gray-800 rounded border p-3">
                                <h4 className="text-sm font-medium mb-2">
                                    Yang Terjadi Saat Revoke:
                                </h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <li>
                                        • Status berubah: Active/Suspended →
                                        Revoked
                                    </li>
                                    <li>
                                        • Semua device langsung ter-disconnect
                                    </li>
                                    <li>• License mati selamanya</li>
                                    <li>• Data tetap ada untuk audit</li>
                                    <li>• TIDAK bisa di-reactivate</li>
                                </ul>
                            </div>

                            <Alert>
                                <XCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Kapan digunakan:</strong>{" "}
                                    Pelanggaran berat, fraud, chargeback, atau
                                    customer request permanent cancellation.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>

                    {/* Reactivate License */}
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center gap-3 mb-3">
                            <Shield className="h-5 w-5 text-green-600" />
                            <h3 className="font-medium">Reactivate License</h3>
                            <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800"
                            >
                                Recovery
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Mengaktifkan kembali lisensi yang di-suspend
                                atau expired.
                            </p>

                            <div className="bg-white dark:bg-gray-800 rounded border p-3">
                                <h4 className="text-sm font-medium mb-2">
                                    Syarat Reactivate:
                                </h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <li>
                                        • Status harus Suspended atau Expired
                                    </li>
                                    <li>
                                        • Tidak bisa reactivate license yang
                                        Revoked
                                    </li>
                                    <li>
                                        • Untuk expired: extend masa berlaku
                                        dulu
                                    </li>
                                    <li>
                                        • Customer bisa langsung aktivasi device
                                        lagi
                                    </li>
                                </ul>
                            </div>

                            <Alert>
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Kapan digunakan:</strong> Customer
                                    sudah bayar, masalah sudah resolved, atau
                                    maintenance selesai.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>

                    {/* Delete License */}
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                        <div className="flex items-center gap-3 mb-3">
                            <Trash2 className="h-5 w-5 text-red-600" />
                            <h3 className="font-medium">Delete License</h3>
                            <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800"
                            >
                                Destructive
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Menghapus lisensi secara permanen dari database.{" "}
                                <strong>HATI-HATI!</strong>
                            </p>

                            <div className="bg-white dark:bg-gray-800 rounded border p-3">
                                <h4 className="text-sm font-medium mb-2">
                                    Yang Terjadi Saat Delete:
                                </h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <li>
                                        • License dihapus total dari database
                                    </li>
                                    <li>• Semua activation records hilang</li>
                                    <li>• Usage history hilang</li>
                                    <li>• Customer tidak bisa recover</li>
                                    <li>• Data revenue hilang</li>
                                </ul>
                            </div>

                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>PERINGATAN:</strong> Hanya hapus
                                    jika benar-benar yakin! Biasanya lebih baik
                                    pakai Revoke untuk audit trail. Delete hanya
                                    untuk test license atau data yang salah
                                    input.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Monitoring & Analytics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Monitoring & Analytics
                    </CardTitle>
                    <CardDescription>
                        Cara memantau dan menganalisis penggunaan lisensi
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Real-time Monitoring */}
                        <div className="space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-green-600" />
                                Real-time Monitoring
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded border p-3">
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span>
                                            <strong>Online Devices:</strong>{" "}
                                            Device yang aktif dalam 5 menit
                                            terakhir
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span>
                                            <strong>Usage Tracking:</strong>{" "}
                                            Kapan customer terakhir pakai
                                            software
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span>
                                            <strong>Device Info:</strong>{" "}
                                            Platform, hostname, IP address
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span>
                                            <strong>Aktivitas:</strong> Login,
                                            logout, feature usage
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Analytics & Reports */}
                        <div className="space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                Analytics & Reports
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded border p-3">
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-blue-600" />
                                        <span>
                                            <strong>License Stats:</strong>{" "}
                                            Total active, expired, suspended
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-blue-600" />
                                        <span>
                                            <strong>Revenue Tracking:</strong>{" "}
                                            Income per license type
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-blue-600" />
                                        <span>
                                            <strong>Customer Insights:</strong>{" "}
                                            Usage patterns, retention
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-blue-600" />
                                        <span>
                                            <strong>Export Data:</strong> CSV
                                            untuk analysis lanjutan
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Best Practices */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Best Practices
                    </CardTitle>
                    <CardDescription>
                        Tips untuk mengelola lisensi dengan efektif
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Do's */}
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">
                                ✅ Yang Sebaiknya Dilakukan
                            </h4>
                            <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
                                <li>
                                    • <strong>Backup license keys</strong> di
                                    tempat yang aman
                                </li>
                                <li>
                                    • <strong>Monitor expired licenses</strong>{" "}
                                    dan remind customer
                                </li>
                                <li>
                                    • <strong>Gunakan notes</strong> untuk
                                    tracking komunikasi
                                </li>
                                <li>
                                    • <strong>Regular cleanup</strong> untuk
                                    test licenses
                                </li>
                                <li>
                                    • <strong>Set reminder</strong> untuk
                                    renewal 30 hari sebelum expired
                                </li>
                                <li>
                                    • <strong>Track suspicious activity</strong>{" "}
                                    seperti device sharing
                                </li>
                                <li>
                                    • <strong>Document policy</strong>{" "}
                                    suspend/revoke yang jelas
                                </li>
                            </ul>
                        </div>

                        {/* Don'ts */}
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4">
                            <h4 className="font-medium text-red-800 dark:text-red-200 mb-3">
                                ❌ Yang Sebaiknya Dihindari
                            </h4>
                            <ul className="text-sm text-red-700 dark:text-red-300 space-y-2">
                                <li>
                                    • <strong>Delete aktif licenses</strong>{" "}
                                    tanpa konfirmasi customer
                                </li>
                                <li>
                                    • <strong>Share license keys</strong> di
                                    channel public
                                </li>
                                <li>
                                    • <strong>Revoke</strong> tanpa warning
                                    untuk pelanggaran ringan
                                </li>
                                <li>
                                    • <strong>Edit email customer</strong> tanpa
                                    konfirmasi
                                </li>
                                <li>
                                    • <strong>Reduce max devices</strong> saat
                                    masih ada device aktif
                                </li>
                                <li>
                                    •{" "}
                                    <strong>Ignore suspicious patterns</strong>{" "}
                                    dalam usage
                                </li>
                                <li>
                                    • <strong>Batch operations</strong> tanpa
                                    double-check data
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Common Scenarios */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Skenario Umum
                    </CardTitle>
                    <CardDescription>
                        Situasi yang sering terjadi dan cara menanganinya
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        {/* Scenario 1 */}
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">
                                🔄 Customer Ganti Device
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                Customer beli laptop baru, mau pindahkan license
                                dari laptop lama.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded p-3">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    <strong>Solusi:</strong> Customer deactivate
                                    di device lama, lalu aktivasi di device
                                    baru. Atau admin bisa suspend lisensi
                                    sebentar, tunggu customer aktivasi di device
                                    baru.
                                </p>
                            </div>
                        </div>

                        {/* Scenario 2 */}
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">
                                💳 Customer Telat Bayar
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                License expired tapi customer belum perpanjang,
                                masih mau nego.
                            </p>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded p-3">
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    <strong>Solusi:</strong> Suspend license
                                    (jangan revoke). Kasih grace period 7-14
                                    hari. Setelah bayar, reactivate dan extend
                                    masa berlaku.
                                </p>
                            </div>
                        </div>

                        {/* Scenario 3 */}
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">
                                🚨 Detect License Sharing
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                1 license dipakai di 5 device berbeda dalam
                                waktu bersamaan.
                            </p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 rounded p-3">
                                <p className="text-sm text-orange-700 dark:text-orange-300">
                                    <strong>Solusi:</strong> Contact customer
                                    untuk klarifikasi. Jika terbukti sharing,
                                    suspend license dan minta upgrade ke
                                    enterprise. Jika menolak, revoke license.
                                </p>
                            </div>
                        </div>

                        {/* Scenario 4 */}
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">
                                🔧 Customer Request Refund
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                Customer tidak puas dengan software, minta
                                refund dalam 30 hari.
                            </p>
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded p-3">
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    <strong>Solusi:</strong> Revoke license
                                    (untuk prevent future use), process refund
                                    sesuai policy, update admin notes dengan
                                    alasan refund.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
