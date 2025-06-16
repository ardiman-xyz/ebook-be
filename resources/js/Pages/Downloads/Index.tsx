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
    changelog: string[];
    external_url?: string;
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
            setIsDownloading(false);
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
                    <Badge variant="secondary" className="text-xs">
                        v{download.version}
                    </Badge>
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

                {/* Download Button */}
                <div className="pt-4">
                    {download.external_url ? (
                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={() =>
                                window.open(download.external_url, "_blank")
                            }
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open TestFlight
                        </Button>
                    ) : (
                        <Button
                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                            onClick={handleDownload}
                            disabled={isDownloading}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {isDownloading ? "Downloading..." : "Download"}
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
        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Shield className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                            Security & Authenticity
                        </h3>
                        <div className="space-y-2 text-sm text-yellow-700">
                            <p>
                                All downloads are digitally signed and scanned
                                for malware. Only download from this official
                                source.
                            </p>
                            <div className="flex items-center space-x-4">
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
        if (download.external_url) {
            window.open(download.external_url, "_blank");
            return;
        }

        try {
            const response = await fetch(
                `/downloads/${download.platform}/${download.file}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error("Download failed");
            }

            // Create download link
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download =
                download.filename || `${download.name}-${download.version}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
            // You can add toast notification here
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
        <PublicLayout
            showLoginButton={!auth?.user}
            header={
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                            <Download className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Download LicenseApp
                            </h1>
                            <p className="text-gray-600">
                                Get the latest version for your platform
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                            <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                            >
                                <Zap className="w-3 h-3 mr-1" />
                                Latest: v{stats.latest_version}
                            </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                                <Heart className="w-3 h-3 mr-1" />
                                {stats.total_downloads.toLocaleString()}{" "}
                                downloads
                            </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200"
                            >
                                <Shield className="w-3 h-3 mr-1" />
                                Secure & Verified
                            </Badge>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Downloads" />

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
                                                Run as administrator for
                                                system-wide installation
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Windows Defender may show
                                                warning - this is normal
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Requires .NET Framework 4.8 or
                                                later
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
                                                Make executable:{" "}
                                                <code className="bg-gray-100 px-1 rounded">
                                                    chmod +x filename.AppImage
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
                                                Works on most Linux
                                                distributions
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-purple-600 flex items-center space-x-2">
                                        <Smartphone className="w-4 h-4" />
                                        <span>Mobile</span>
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Android: Enable "Unknown
                                                sources" in settings
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                iOS: Join TestFlight beta
                                                program
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Mobile versions may have limited
                                                features
                                            </span>
                                        </li>
                                    </ul>
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
                                                • Verify file integrity using
                                                checksums if needed
                                            </li>
                                            <li>
                                                • Contact support if you
                                                encounter installation issues
                                            </li>
                                            <li>
                                                • Keep your license key safe -
                                                you'll need it for activation
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
