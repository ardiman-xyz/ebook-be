<?php
// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Services\LicenseTypeService;
use App\Services\LicenseService;
use App\Models\License;
use App\Models\LicenseActivation;
use App\Models\Customer;
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

    /**
     * Show all licenses
     */
    public function showLicenses(Request $request): Response
    {
        $licenses = License::with(['customer', 'licenseType', 'activations'])
            ->when($request->search, function ($query, $search) {
                return $query->where('license_key', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->appends($request->query());

        return Inertia::render('Licenses/Index', [
            'licenses' => $licenses,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Show license details
     */
    public function showLicense(License $license): Response
    {
        $license->load(['customer', 'licenseType', 'activations', 'usageLogs']);

        return Inertia::render('Licenses/Show', [
            'license' => $license
        ]);
    }
}