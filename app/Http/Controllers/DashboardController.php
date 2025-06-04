<?php
// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Services\LicenseTypeService;
use App\Services\LicenseService;
use App\Models\License;
use App\Models\LicenseActivation;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private LicenseTypeService $licenseTypeService,
        private LicenseService $licenseService
    ) {}

    /**
     * Display the dashboard
     */
    public function index(Request $request): Response
    {
        // Get dashboard statistics
        $stats = $this->getDashboardStats();

        // Get recent licenses with relationships
        $recentLicenses = License::with(['customer', 'licenseType', 'activations'])
            ->latest()
            ->limit(10)
            ->get();

        // Get active license types for form
        $licenseTypes = $this->licenseTypeService->getFormattedLicenseTypes();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'licenses' => $recentLicenses,
            'licenseTypes' => $licenseTypes,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Get dashboard statistics
     */
    private function getDashboardStats(): array
    {
        $totalLicenses = License::count();
        $activeLicenses = License::where('status', 'active')->count();
        $expiredLicenses = License::where('status', 'expired')->count();
        $totalCustomers = Customer::count();
        $totalActivations = LicenseActivation::where('status', 'active')->count();
        
        // Online devices (used within last 5 minutes)
        $onlineDevices = LicenseActivation::where('status', 'active')
            ->where('last_used_at', '>=', now()->subMinutes(5))
            ->count();

        // Today's activations
        $todayActivations = LicenseActivation::whereDate('activated_at', today())->count();

        // This month's revenue
        $thisMonthRevenue = License::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('purchase_price');

        return [
            'total_licenses' => $totalLicenses,
            'active_licenses' => $activeLicenses,
            'expired_licenses' => $expiredLicenses,
            'total_customers' => $totalCustomers,
            'total_activations' => $totalActivations,
            'online_devices' => $onlineDevices,
            'today_activations' => $todayActivations,
            'this_month_revenue' => $thisMonthRevenue
        ];
    }

    /**
     * Get license types for API
     */
    public function getLicenseTypes(Request $request)
    {
        $licenseTypes = $this->licenseTypeService->getFormattedLicenseTypes();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $licenseTypes,
                'timestamp' => now()->toISOString()
            ]);
        }

        return $licenseTypes;
    }

    /**
     * Generate new license using existing LicenseService
     */
    public function generateLicense(Request $request)
    {
        $validated = $request->validate([
            'license_type' => 'required|string|exists:license_types,code',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_type' => 'nullable|string|in:individual,business,education',
            'max_devices' => 'nullable|integer|min:1|max:100',
            'purchase_price' => 'nullable|numeric|min:0',
            'purchase_currency' => 'nullable|string|size:3',
            'order_id' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|max:100',
            'admin_notes' => 'nullable|string|max:1000',
            'payment_receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png,gif,webp|max:5120' // 5MB
        ]);

        try {
            // Handle file upload if present
            $paymentReceiptPath = null;
            if ($request->hasFile('payment_receipt')) {
                $file = $request->file('payment_receipt');
                $paymentReceiptPath = $file->store('payment-receipts', 'public');
            }

            // Prepare data for LicenseService
            $licenseData = [
                'license_type' => $validated['license_type'],
                'customer_email' => $validated['customer_email'],
                'customer_name' => $validated['customer_name'],
                'customer_type' => $validated['customer_type'] ?? 'individual',
                'max_devices' => $validated['max_devices'],
                'purchase_price' => $validated['purchase_price'],
                'purchase_currency' => $validated['purchase_currency'] ?? 'IDR',
                'order_id' => $validated['order_id'],
                'payment_method' => $validated['payment_method'],
                'admin_notes' => $validated['admin_notes'],
                'created_by' => Auth::id(),
                'payment_receipt_path' => $paymentReceiptPath // Add file path if uploaded
            ];

            // Use existing LicenseService to generate license
            $result = $this->licenseService->generateLicense($licenseData);

            if ($result['success']) {
                // Create success message with license key
                $licenseKey = $result['data']['license_key'];
                $customerName = $result['data']['customer']['name'];
                
                return redirect()->back()->with('success', 
                    "License generated successfully for {$customerName}! License key: {$licenseKey}"
                );
            } else {
                return redirect()->back()->with('error', $result['message']);
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();

        } catch (\Exception $e) {
            // Log error for debugging
            Log::error('License generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $validated,
                'user_id' => Auth::id()
            ]);

            // Clean up uploaded file if license generation failed
            if (isset($paymentReceiptPath)) {
                Storage::disk('public')->delete($paymentReceiptPath);
            }

            return redirect()->back()->with('error', 
                'Failed to generate license. Please try again. If the problem persists, contact administrator.'
            );
        }
    }

    public function suspend(Request $request, License $license): JsonResponse
    {
        try {
            $reason = $request->input('reason', 'Suspended by admin: ' . Auth::user()->name);
            
            $result = $this->licenseService->suspendLicense(
                $license,
                Auth::id(),
                $reason
            );

            $statusCode = $result['success'] ? 200 : 400;
            return response()->json($result, $statusCode);

        } catch (\Exception $e) {
            Log::error('License suspension controller error', [
                'license_id' => $license->id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred',
                'data' => [],
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    /**
     * Revoke a license
     */
    public function revoke(Request $request, License $license): JsonResponse
    {
        try {
            $reason = $request->input('reason', 'Revoked by admin: ' . Auth::user()->name);
            
            $result = $this->licenseService->revokeLicense(
                $license,
                Auth::id(),
                $reason
            );

            $statusCode = $result['success'] ? 200 : 400;
            return response()->json($result, $statusCode);

        } catch (\Exception $e) {
            Log::error('License revocation controller error', [
                'license_id' => $license->id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred',
                'data' => [],
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    /**
     * Reactivate a license
     */
    public function reactivate(Request $request, License $license): JsonResponse
    {
        try {
            $reason = $request->input('reason', 'Reactivated by admin: ' . Auth::user()->name);
            
            $result = $this->licenseService->reactivateLicense(
                $license,
                Auth::id(),
                $reason
            );

            $statusCode = $result['success'] ? 200 : 400;
            return response()->json($result, $statusCode);

        } catch (\Exception $e) {
            Log::error('License reactivation controller error', [
                'license_id' => $license->id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred',
                'data' => [],
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }


    /**
     * Update a license
     */
    public function updateLicense(Request $request, License $license): JsonResponse
    {
        try {
            $validated = $request->validate([
                'customer_name' => 'required|string|max:255',
                'customer_email' => 'required|email|max:255',
                'customer_type' => 'required|in:individual,business,education',
                'max_devices' => 'required|integer|min:1|max:100',
                'purchase_price' => 'required|numeric|min:0',
                'purchase_currency' => 'required|string|size:3',
                'order_id' => 'nullable|string|max:255',
                'payment_method' => 'nullable|string|max:100',
                'admin_notes' => 'nullable|string|max:1000',
                'expires_at' => 'nullable|date|after:today',
            ]);

            $result = $this->licenseService->updateLicense($license, $validated, Auth::id());

            $statusCode = $result['success'] ? 200 : 400;
            return response()->json($result, $statusCode);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => [
                    'errors' => $e->errors()
                ],
                'timestamp' => now()->toISOString()
            ], 422);

        } catch (\Exception $e) {
            Log::error('License update controller error', [
                'license_id' => $license->id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred',
                'data' => [],
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }



    public function deleteLicense(License $license): JsonResponse
    {
        try {
            Log::info('Delete license request received', [
                'license_id' => $license->id,
                'license_key' => $license->license_key,
                'user_id' => Auth::id(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent()
            ]);

            // Call service to handle deletion logic
            $result = $this->licenseService->deleteLicense(
                $license,
                Auth::id()
            );

            // Log the result
            if ($result['success']) {
                Log::info('License deletion successful', [
                    'license_key' => $result['data']['license_key'] ?? 'unknown',
                    'user_id' => Auth::id()
                ]);
            } else {
                Log::warning('License deletion failed', [
                    'license_id' => $license->id,
                    'reason' => $result['message'],
                    'user_id' => Auth::id()
                ]);
            }

            // Return appropriate HTTP status code
            $statusCode = $result['success'] ? 200 : 400;
            return response()->json($result, $statusCode);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('License not found for deletion', [
                'license_id' => $license->id ?? 'unknown',
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'License not found',
                'data' => [],
                'timestamp' => now()->toISOString()
            ], 404);

        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            Log::warning('Unauthorized license deletion attempt', [
                'license_id' => $license->id,
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to delete this license',
                'data' => [],
                'timestamp' => now()->toISOString()
            ], 403);

        } catch (\Exception $e) {
            Log::error('License deletion controller error', [
                'license_id' => $license->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred while deleting the license',
                'data' => [
                    'error_code' => 'DELETION_ERROR',
                    'error_id' => uniqid('del_error_')
                ],
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }


   
}