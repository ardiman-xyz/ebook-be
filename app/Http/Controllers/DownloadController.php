<?php
// app/Http/Controllers/DownloadController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DownloadController extends Controller
{
    /**
     * Display the download page
     */
    public function index(): InertiaResponse
    {
        $downloads = $this->getAvailableDownloads();
        
        return Inertia::render('Downloads/Index', [
            'downloads' => $downloads,
            'stats' => $this->getDownloadStats(),
            'auth' => [
                'user' => Auth::user() // Optional auth info
            ]
        ]);
    }

    /**
     * Handle file download
     */
    public function download(Request $request, string $platform, string $file)
    {
        $downloads = $this->getAvailableDownloads();
        
        // Find the requested download
        $download = collect($downloads)->firstWhere(function ($item) use ($platform, $file) {
            return $item['platform'] === $platform && $item['file'] === $file;
        });

        if (!$download) {
            abort(404, 'File not found');
        }

        // Check if file exists in public/inobel/app/
        $filePath = public_path($download['path']);
        if (!file_exists($filePath)) {
            abort(404, 'File not available');
        }

        // Log download for statistics (optional)
        $this->logDownload($platform, $file, $request->ip());

        // Return file download
        return response()->download($filePath, $download['filename']);
    }

    /**
     * Get available downloads configuration
     */
    private function getAvailableDownloads(): array
    {
        return [
            [
                'id' => 'windows-x64',
                'platform' => 'windows',
                'file' => 'x64',
                'name' => 'Windows (64-bit)',
                'description' => 'Compatible with Windows 10/11 (64-bit)',
                'version' => '1.0.0',
                'size' => '305 MB',
                'filename' => 'windows.zip',
                'icon' => 'windows',
                'requirements' => ['Windows 10 or later', '4GB RAM', '500MB storage'],
                'release_date' => '2025-06-16',
                'download_count' => 0,
                // Corrected Windows file ID
                'google_drive_url' => 'https://drive.google.com/uc?export=download&id=1N_ITxZg8ZeOFTKm65ztyPqgk5u7vTfz6',
                'is_external' => true,
            ],
            [
                'id' => 'linux-x64',
                'platform' => 'linux',
                'file' => 'x64',
                'name' => 'Linux (64-bit)',
                'description' => 'Ubuntu, Debian, CentOS, and other distributions',
                'version' => '1.0.0',
                'size' => '298 MB',
                'filename' => 'linux.zip',
                'icon' => 'linux',
                'requirements' => ['Linux kernel 4.0+', '4GB RAM', '500MB storage'],
                'release_date' => '2025-06-16',
                'download_count' => 0,
                // Previous link yang tadi (untuk Linux)
                'google_drive_url' => 'https://drive.google.com/uc?export=download&id=1pKacbzRbSrjg4IMEKAbU5kUW1C5IBx6i',
                'is_external' => true,
            ],
            [
                'id' => 'android',
                'platform' => 'mobile',
                'file' => 'android',
                'name' => 'Android',
                'description' => 'Compatible with Android 8.0 and later',
                'version' => '1.0.0',
                'size' => '28.5 MB',
                'filename' => 'android.zip',
                'path' => 'inobel/app/android.zip',
                'icon' => 'android',
                'requirements' => ['Android 8.0+', '2GB RAM', '200MB storage'],
                'release_date' => '2025-06-16',
                'download_count' => 0,
               
            ]
        ];
    }

    /**
     * Get download statistics
     */
    private function getDownloadStats(): array
    {
        $downloads = $this->getAvailableDownloads();
        
        $totalDownloads = collect($downloads)->sum('download_count');
        $windowsDownloads = collect($downloads)->where('platform', 'windows')->sum('download_count');
        $linuxDownloads = collect($downloads)->where('platform', 'linux')->sum('download_count');
        $mobileDownloads = collect($downloads)->where('platform', 'mobile')->sum('download_count');

        return [
            'total_downloads' => $totalDownloads,
            'windows_downloads' => $windowsDownloads,
            'linux_downloads' => $linuxDownloads,
            'mobile_downloads' => $mobileDownloads,
            'most_popular' => collect($downloads)->sortByDesc('download_count')->first(),
            'latest_version' => '1.2.3',
            'last_updated' => '2024-01-15'
        ];
    }

    /**
     * Log download for statistics
     */
    private function logDownload(string $platform, string $file, string $ip): void
    {
        // You can implement download logging here
        // For example, store in database or log file
        Log::info('Download logged', [
            'platform' => $platform,
            'file' => $file,
            'ip' => $ip,
            'timestamp' => now()
        ]);
    }

    /**
     * API endpoint for download information
     */
    public function api(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'downloads' => $this->getAvailableDownloads(),
                'stats' => $this->getDownloadStats()
            ],
            'timestamp' => now()->toISOString()
        ]);
    }
}