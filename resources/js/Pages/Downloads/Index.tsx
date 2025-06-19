import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Download,
    Monitor,
    Smartphone,
    HardDrive,
    Calendar,
    Users,
    CheckCircle,
    ExternalLink,
    Shield,
    Zap,
    Heart,
    Star,
    Clock,
    ArrowRight,
    FileText,
    AlertTriangle,
    Cloud,
} from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

// Type definitions
interface DownloadItem {
    id: string;
    platform: string;
    file: string;
    name: string;
    description: string;
    version: string;
    size: string;
    filename: string | null;
    path: string | null;
    icon: string;
    requirements: string[];
    release_date: string;
    download_count: number;
    changelog?: string[];
    external_url?: string;
    google_drive_url?: string;
    is_external?: boolean;
}

interface DownloadStats {
    total_downloads: number;
    windows_downloads: number;
    linux_downloads: number;
    mobile_downloads: number;
    most_popular: DownloadItem;
    latest_version: string;
    last_updated: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface DownloadPageProps {
    auth?: {
        user?: User;
    };
    downloads: DownloadItem[];
    stats: DownloadStats;
}

// Platform Icon Component
const PlatformIcon: React.FC<{ icon: string; className?: string }> = ({
    icon,
    className = "w-6 h-6",
}) => {
    switch (icon) {
        case "windows":
            return (
                <div
                    className={`${className} bg-blue-500 text-white rounded flex items-center justify-center`}
                >
                    <Monitor className="w-4 h-4" />
                </div>
            );
        case "linux":
            return (
                <div
                    className={`${className} bg-orange-500 text-white rounded flex items-center justify-center`}
                >
                    <Monitor className="w-4 h-4" />
                </div>
            );
        case "android":
            return (
                <div
                    className={`${className} bg-green-500 text-white rounded flex items-center justify-center`}
                >
                    <Smartphone className="w-4 h-4" />
                </div>
            );
        case "apple":
            return (
                <div
                    className={`${className} bg-gray-800 text-white rounded flex items-center justify-center`}
                >
                    <Smartphone className="w-4 h-4" />
                </div>
            );
        default:
            return (
                <div
                    className={`${className} bg-gray-500 text-white rounded flex items-center justify-center`}
                >
                    <HardDrive className="w-4 h-4" />
                </div>
            );
    }
};

// Download Card Component
const DownloadCard: React.FC<{
    download: DownloadItem;
    onDownload: (download: DownloadItem) => void;
}> = ({ download, onDownload }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await onDownload(download);
        } finally {
            // Reset after delay to show feedback
            setTimeout(() => setIsDownloading(false), 2000);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDownloadCount = (count: number) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return count.toString();
    };

    const isGoogleDriveHosted =
        download.google_drive_url || download.is_external;

    return (
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <PlatformIcon
                            icon={download.icon}
                            className="w-12 h-12"
                        />
                        <div>
                            <CardTitle className="text-lg">
                                {download.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                                {download.description}
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                        <Badge variant="secondary" className="text-xs">
                            v{download.version}
                        </Badge>
                        {isGoogleDriveHosted && (
                            <Badge
                                variant="outline"
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                                <Cloud className="w-3 h-3 mr-1" />
                                Fast
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-600">
                            Size
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                            {download.size}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-600">
                            Downloads
                        </div>
                        <div className="text-lg font-bold text-green-600">
                            {formatDownloadCount(download.download_count)}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-600">
                            Updated
                        </div>
                        <div className="text-xs font-medium text-gray-500">
                            {formatDate(download.release_date)}
                        </div>
                    </div>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                        Requirements:
                    </h4>
                    <ul className="space-y-1">
                        {download.requirements.map((req, index) => (
                            <li
                                key={index}
                                className="flex items-center space-x-2 text-xs text-gray-600"
                            >
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                <span>{req}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Download Speed Notice */}
                {isGoogleDriveHosted && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                            <Cloud className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-blue-800 font-medium">
                                Hosted on Google Drive for faster download
                                speeds
                            </span>
                        </div>
                    </div>
                )}

                {/* Download Button */}
                <div className="pt-4">
                    {download.external_url ? (
                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={handleDownload}
                            disabled={isDownloading}
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {isDownloading ? "Opening..." : "Open TestFlight"}
                        </Button>
                    ) : (
                        <Button
                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                            onClick={handleDownload}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <>
                                    <svg
                                        className="animate-spin w-4 h-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Starting Download...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// Security Notice Component
const SecurityNotice: React.FC = () => {
    return (
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                            Fast & Secure Downloads
                        </h3>
                        <div className="space-y-2 text-sm text-green-700">
                            <p>
                                Files are hosted on Google Drive for maximum
                                speed and reliability. All downloads are
                                digitally signed and scanned for malware.
                            </p>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>Google Drive CDN</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>Code Signed</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>Malware Scanned</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>SSL Encrypted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Main Download Page Component
export default function DownloadPage({
    auth,
    downloads,
    stats,
}: DownloadPageProps) {
    const [activeTab, setActiveTab] = useState("all");

    const handleDownload = async (download: DownloadItem) => {
        // Handle external links (TestFlight, etc.)
        if (download.external_url) {
            window.open(download.external_url, "_blank");
            return;
        }

        // Handle Google Drive hosted files
        if (download.google_drive_url) {
            window.open(download.google_drive_url, "_blank");
            return;
        }

        // Fallback to server-hosted files
        try {
            window.location.href = `/downloads/${download.platform}/${download.file}`;
        } catch (error) {
            console.error("Download error:", error);

            // Show user-friendly error message
            alert("Download failed. Please try again or contact support.");
        }
    };

    const filterDownloads = (platform: string) => {
        if (platform === "all") return downloads;
        return downloads.filter((d) => d.platform === platform);
    };

    const getTabCount = (platform: string) => {
        if (platform === "all") return downloads.length;
        return downloads.filter((d) => d.platform === platform).length;
    };

    return (
        <PublicLayout>
            <Head title="Downloads - INOBEL" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Security Notice */}
                    <SecurityNotice />

                    {/* Downloads Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Download className="w-6 h-6 text-blue-600" />
                                <span>Available Downloads</span>
                            </CardTitle>
                            <CardDescription>
                                Choose the version that matches your operating
                                system and architecture. All versions include
                                the latest features and security updates.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger
                                        value="all"
                                        className="flex items-center gap-2"
                                    >
                                        <HardDrive className="w-4 h-4" />
                                        All ({getTabCount("all")})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="windows"
                                        className="flex items-center gap-2"
                                    >
                                        <Monitor className="w-4 h-4" />
                                        Windows ({getTabCount("windows")})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="linux"
                                        className="flex items-center gap-2"
                                    >
                                        <HardDrive className="w-4 h-4" />
                                        Linux ({getTabCount("linux")})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="mobile"
                                        className="flex items-center gap-2"
                                    >
                                        <Smartphone className="w-4 h-4" />
                                        Android ({getTabCount("mobile")})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="all" className="mt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {downloads.map((download) => (
                                            <DownloadCard
                                                key={download.id}
                                                download={download}
                                                onDownload={handleDownload}
                                            />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="windows" className="mt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filterDownloads("windows").map(
                                            (download) => (
                                                <DownloadCard
                                                    key={download.id}
                                                    download={download}
                                                    onDownload={handleDownload}
                                                />
                                            )
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="linux" className="mt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filterDownloads("linux").map(
                                            (download) => (
                                                <DownloadCard
                                                    key={download.id}
                                                    download={download}
                                                    onDownload={handleDownload}
                                                />
                                            )
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="mobile" className="mt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filterDownloads("mobile").map(
                                            (download) => (
                                                <DownloadCard
                                                    key={download.id}
                                                    download={download}
                                                    onDownload={handleDownload}
                                                />
                                            )
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <span>Installation Notes</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-blue-600 flex items-center space-x-2">
                                        <Monitor className="w-4 h-4" />
                                        <span>Windows</span>
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Extract ZIP file and run
                                                setup.exe as administrator
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Windows Defender may show
                                                warning - click "More info" →
                                                "Run anyway"
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Compatible with Windows 10/11
                                                (64-bit)
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-orange-600 flex items-center space-x-2">
                                        <HardDrive className="w-4 h-4" />
                                        <span>Linux</span>
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Extract ZIP and make executable:{" "}
                                                <code className="bg-gray-100 px-1 rounded text-xs">
                                                    chmod +x INOBEL.AppImage
                                                </code>
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                No installation required -
                                                portable application
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Works on Ubuntu, Debian, CentOS,
                                                and other distributions
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-green-600 flex items-center space-x-2">
                                        <Smartphone className="w-4 h-4" />
                                        <span>Android</span>
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Enable "Unknown sources" in
                                                Settings → Security
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Extract ZIP and install APK file
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Compatible with Android 8.0 and
                                                later
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-6">
                                <div className="flex items-start space-x-3">
                                    <Cloud className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium text-gray-800 mb-1">
                                            Fast Downloads via Google Drive:
                                        </p>
                                        <ul className="space-y-1">
                                            <li>
                                                • Files are hosted on Google
                                                Drive for maximum speed and
                                                reliability
                                            </li>
                                            <li>
                                                • Downloads are served from
                                                global CDN for faster speeds
                                                worldwide
                                            </li>
                                            <li>
                                                • Resume capability built-in if
                                                download is interrupted
                                            </li>
                                            <li>
                                                • All files are scanned and
                                                verified before hosting
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-6">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium text-gray-800 mb-1">
                                            Important Notes:
                                        </p>
                                        <ul className="space-y-1">
                                            <li>
                                                • Always download from this
                                                official source to ensure
                                                security
                                            </li>
                                            <li>
                                                • Keep your license key safe -
                                                you'll need it for activation
                                            </li>
                                            <li>
                                                • Contact support if you
                                                encounter installation issues
                                            </li>
                                            <li>
                                                • Check system requirements
                                                before downloading
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}
