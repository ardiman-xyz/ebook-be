<?php
// app/Http/Controllers/Api/LicenseController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LicenseService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class LicenseController extends Controller
{
    public function __construct(
        private LicenseService $licenseService
    ) {}

    /**
     * Activate license
     */
    public function activate(Request $request): JsonResponse
    {


        $validator = Validator::make($request->all(), [
            // FIXED: Simple regex untuk format tanpa hyphens (DEMO12345678ABC)
            'license_key' => 'required|string|regex:/^[A-Z0-9]{8,20}$/|min:8|max:20',
            'device_id' => 'required|string|max:255',
            'device_name' => 'nullable|string|max:255',
            'platform' => 'nullable|string|max:50',
            'arch' => 'nullable|string|max:50',
            'hostname' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255',
            'app_version' => 'nullable|string|max:50',
            'ip_address' => 'nullable|ip',
            'user_agent' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'timestamp' => now()->toISOString()
            ], 422);
        }

        $deviceData = [
            'device_id' => $request->device_id,
            'device_name' => $request->device_name,
            'platform' => $request->platform,
            'arch' => $request->arch,
            'hostname' => $request->hostname,
            'username' => $request->username,
            'app_version' => $request->app_version,
            'ip_address' => $this->getClientIp($request),
            'user_agent' => $this->getUserAgent($request)
        ];

        $result = $this->licenseService->activateLicense($request->license_key, $deviceData);

        return response()->json($result, $result['success'] ? 200 : 400);
    }

     /**
     * Get client IP address safely
     */
    private function getClientIp(Request $request): ?string
    {
        // Try multiple methods to get IP
        return $request->ip() 
            ?? $request->ip_address 
            ?? $request->server('HTTP_X_FORWARDED_FOR')
            ?? $request->server('HTTP_X_REAL_IP')
            ?? $request->server('REMOTE_ADDR')
            ?? null;
    }

    /**
     * Get user agent safely
     */
    private function getUserAgent(Request $request): ?string
    {
        return $request->userAgent() 
            ?? $request->user_agent 
            ?? $request->server('HTTP_USER_AGENT')
            ?? null;
    }

    /**
     * Verify license
     */
    public function verify(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'license_key' => 'required|string',
            'device_id' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'timestamp' => now()->toISOString()
            ], 422);
        }

        $result = $this->licenseService->verifyLicense(
            $request->license_key,
            $request->device_id
        );

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Deactivate license
     */
    public function deactivate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'license_key' => 'required|string',
            'device_id' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'timestamp' => now()->toISOString()
            ], 422);
        }

        $result = $this->licenseService->deactivateLicense(
            $request->license_key,
            $request->device_id
        );

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Get license status
     */
    public function status(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'license_key' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'timestamp' => now()->toISOString()
            ], 422);
        }

        $result = $this->licenseService->getLicenseStatus($request->license_key);

        return response()->json($result, $result['success'] ? 200 : 404);
    }

    /**
     * Log usage
     */
    public function logUsage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'license_key' => 'required|string',
            'device_id' => 'required|string',
            'session_id' => 'required|string',
            'action' => 'required|string|max:100',
            'feature_used' => 'nullable|string|max:100',
            'session_start' => 'nullable|date',
            'session_end' => 'nullable|date',
            'session_duration' => 'nullable|integer|min:0',
            'pages_viewed' => 'nullable|integer|min:0',
            'pages_printed' => 'nullable|integer|min:0',
            'pages_exported' => 'nullable|integer|min:0',
            'search_queries' => 'nullable|integer|min:0',
            'bookmarks_created' => 'nullable|integer|min:0',
            'notes_created' => 'nullable|integer|min:0',
            'app_version' => 'nullable|string|max:50',
            'load_time_ms' => 'nullable|integer|min:0',
            'crashed' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'timestamp' => now()->toISOString()
            ], 422);
        }

        $usageData = $request->only([
            'session_id', 'action', 'feature_used', 'session_start', 'session_end',
            'session_duration', 'pages_viewed', 'pages_printed', 'pages_exported',
            'search_queries', 'bookmarks_created', 'notes_created', 'app_version',
            'load_time_ms', 'crashed'
        ]);

        // Add IP and user agent
        $usageData['ip_address'] = $request->ip();
        $usageData['user_agent'] = $request->userAgent();

        $result = $this->licenseService->logUsage(
            $request->license_key,
            $request->device_id,
            $usageData
        );

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Generate new license (Admin only)
     */
    public function generate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'license_type' => 'required|string|exists:license_types,code',
            'customer_email' => 'required|email',
            'customer_name' => 'nullable|string|max:255',
            'customer_type' => 'nullable|string|in:individual,business,education',
            'max_devices' => 'nullable|integer|min:1|max:100',
            'purchase_price' => 'nullable|numeric|min:0',
            'purchase_currency' => 'nullable|string|size:3',
            'order_id' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|max:100',
            'admin_notes' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'timestamp' => now()->toISOString()
            ], 422);
        }

        $data = $request->all();
        $data['created_by'] = auth()->id(); // If using authentication

        $result = $this->licenseService->generateLicense($data);

        return response()->json($result, $result['success'] ? 201 : 400);
    }

    /**
     * Get analytics
     */
    public function analytics(): JsonResponse
    {
        $result = $this->licenseService->getLicenseAnalytics();

        return response()->json($result, 200);
    }

    /**
     * Health check
     */
    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'service' => 'License API',
            'version' => '1.0.0',
            'server_time' => now()->toISOString(),
            'uptime' => now()->diffInMinutes(now()->startOfDay()) . ' minutes'
        ]);
    }
}