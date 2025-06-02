<?php
// app/Services/LicenseService.php

namespace App\Services;

use App\Models\License;
use App\Models\LicenseType;
use App\Models\Customer;
use App\Models\LicenseActivation;
use Carbon\Carbon;
use Illuminate\Support\Str;

class LicenseService
{
    /**
     * Activate license key
     */
    public function activateLicense(string $licenseKey, array $deviceData): array
    {
        try {
            // 1. Find license
            $license = License::byKey($licenseKey)->active()->first();
            
            if (!$license) {
                return $this->errorResponse('Invalid or inactive license key');
            }

            // 2. Check if expired
            if ($license->is_expired) {
                return $this->errorResponse('License has expired');
            }

            // 3. Check device limit
            if (!$license->can_activate) {
                // Check if this device already activated
                $existingActivation = $license->activations()
                    ->where('device_id', $deviceData['device_id'])
                    ->first();
                    
                if (!$existingActivation) {
                    return $this->errorResponse('Device limit exceeded. Maximum ' . $license->max_devices . ' devices allowed.');
                }
            }

            // 4. Activate license
            $activated = $license->activate($deviceData['device_id'], $deviceData);
            
            if (!$activated) {
                return $this->errorResponse('Failed to activate license');
            }

            // 5. Return success response
            return $this->successResponse([
                'type' => $license->licenseType->code,
                'expires_at' => $license->expires_at?->toISOString(),
                'features' => $license->features,
                'restrictions' => $license->restrictions,
                'max_devices' => $license->max_devices,
                'devices_used' => $license->devices_used,
                'is_lifetime' => $license->is_lifetime
            ], 'License activated successfully');

        } catch (\Exception $e) {
            return $this->errorResponse('Activation failed: ' . $e->getMessage());
        }
    }

    /**
     * Verify license status
     */
    public function verifyLicense(string $licenseKey, string $deviceId): array
    {
        try {
            $license = License::byKey($licenseKey)->first();
            
            if (!$license) {
                return $this->errorResponse('License not found');
            }

            // Check if device is activated
            $activation = $license->activations()
                ->where('device_id', $deviceId)
                ->where('status', 'active')
                ->first();

            if (!$activation) {
                return $this->errorResponse('Device not activated for this license');
            }

            // Update last verified
            $license->updateLastVerified();
            $activation->updateLastUsed();

            return $this->successResponse([
                'is_valid' => $license->is_active,
                'type' => $license->licenseType->code,
                'expires_at' => $license->expires_at?->toISOString(),
                'days_remaining' => $license->days_remaining,
                'features' => $license->features,
                'restrictions' => $license->restrictions,
                'device_status' => $activation->status,
                'last_verified' => now()->toISOString()
            ], 'License verified');

        } catch (\Exception $e) {
            return $this->errorResponse('Verification failed: ' . $e->getMessage());
        }
    }

    /**
     * Deactivate license from device
     */
    public function deactivateLicense(string $licenseKey, string $deviceId): array
    {
        try {
            $license = License::byKey($licenseKey)->first();
            
            if (!$license) {
                return $this->errorResponse('License not found');
            }

            $deactivated = $license->deactivate($deviceId, 'User requested deactivation');

            if ($deactivated) {
                return $this->successResponse([], 'License deactivated successfully');
            } else {
                return $this->errorResponse('Device not found or already inactive');
            }

        } catch (\Exception $e) {
            return $this->errorResponse('Deactivation failed: ' . $e->getMessage());
        }
    }

    /**
     * Get license status
     */
    public function getLicenseStatus(string $licenseKey): array
    {
        try {
            $license = License::with(['licenseType', 'customer', 'activations'])->byKey($licenseKey)->first();
            
            if (!$license) {
                return $this->errorResponse('License not found');
            }

            return $this->successResponse([
                'license_key' => $license->masked_key,
                'type' => $license->licenseType->code,
                'status' => $license->status,
                'customer' => [
                    'name' => $license->customer->name,
                    'email' => $license->customer->email
                ],
                'issued_at' => $license->issued_at->toISOString(),
                'activated_at' => $license->activated_at?->toISOString(),
                'expires_at' => $license->expires_at?->toISOString(),
                'days_remaining' => $license->days_remaining,
                'is_active' => $license->is_active,
                'is_lifetime' => $license->is_lifetime,
                'max_devices' => $license->max_devices,
                'devices_used' => $license->devices_used,
                'features' => $license->features,
                'restrictions' => $license->restrictions,
                'activations' => $license->activations->map(function($activation) {
                    return [
                        'device_name' => $activation->formatted_device_name,
                        'platform' => $activation->device_platform,
                        'status' => $activation->status,
                        'activated_at' => $activation->activated_at->toISOString(),
                        'last_used_at' => $activation->last_used_at?->toISOString(),
                        'is_online' => $activation->is_online
                    ];
                })
            ]);

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to get license status: ' . $e->getMessage());
        }
    }

    /**
     * Log license usage
     */
    public function logUsage(string $licenseKey, string $deviceId, array $usageData): array
    {
        try {
            $license = License::byKey($licenseKey)->first();
            
            if (!$license) {
                return $this->errorResponse('License not found');
            }

            $activation = $license->activations()
                ->where('device_id', $deviceId)
                ->where('status', 'active')
                ->first();

            if (!$activation) {
                return $this->errorResponse('Device not activated');
            }

            // Log usage
            $usageLog = $activation->logUsage($usageData);

            // Update activation last used
            $activation->updateLastUsed();

            return $this->successResponse([
                'usage_log_id' => $usageLog->id,
                'session_id' => $usageLog->session_id
            ], 'Usage logged successfully');

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to log usage: ' . $e->getMessage());
        }
    }

    /**
     * Generate new license
     */
    public function generateLicense(array $data): array
    {
        try {
            // 1. Get or create customer
            $customer = Customer::firstOrCreate(
                ['email' => $data['customer_email']],
                [
                    'name' => $data['customer_name'] ?? 'Customer',
                    'customer_type' => $data['customer_type'] ?? 'individual'
                ]
            );

            // 2. Get license type
            $licenseType = LicenseType::byCode($data['license_type'])->active()->first();
            
            if (!$licenseType) {
                return $this->errorResponse('Invalid license type');
            }

            // 3. Generate unique license key
            do {
                $licenseKey = License::generateKey($licenseType->code);
            } while (License::where('license_key', $licenseKey)->exists());

            // 4. Calculate expiry date
            $expiresAt = null;
            if (!$licenseType->is_lifetime && $licenseType->duration_days) {
                $expiresAt = now()->addDays($licenseType->duration_days);
            }

            // 5. Create license
            $license = License::create([
                'license_key' => $licenseKey,
                'customer_id' => $customer->id,
                'license_type_id' => $licenseType->id,
                'status' => 'active',
                'issued_at' => now(),
                'expires_at' => $expiresAt,
                'max_devices' => $data['max_devices'] ?? $licenseType->max_devices,
                'purchase_price' => $data['purchase_price'] ?? $licenseType->price,
                'purchase_currency' => $data['purchase_currency'] ?? $licenseType->currency,
                'order_id' => $data['order_id'] ?? null,
                'payment_method' => $data['payment_method'] ?? null,
                'admin_notes' => $data['admin_notes'] ?? null,
                'created_by' => $data['created_by'] ?? null
            ]);

            return $this->successResponse([
                'license_key' => $license->license_key,
                'customer' => [
                    'name' => $customer->name,
                    'email' => $customer->email
                ],
                'type' => $licenseType->code,
                'expires_at' => $license->expires_at?->toISOString(),
                'is_lifetime' => $license->is_lifetime,
                'max_devices' => $license->max_devices,
                'features' => $license->features
            ], 'License generated successfully');

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to generate license: ' . $e->getMessage());
        }
    }

    /**
     * Get license analytics
     */
    public function getLicenseAnalytics(): array
    {
        try {
            $totalLicenses = License::count();
            $activeLicenses = License::active()->count();
            $expiredLicenses = License::expired()->count();
            $totalActivations = LicenseActivation::active()->count();
            $onlineDevices = LicenseActivation::online()->count();

            // License types distribution
            $typeDistribution = License::join('license_types', 'licenses.license_type_id', '=', 'license_types.id')
                ->selectRaw('license_types.code, license_types.name, COUNT(*) as count')
                ->groupBy('license_types.code', 'license_types.name')
                ->get();

            // Platform distribution
            $platformStats = LicenseActivation::getPlatformStats();

            // Recent activations (last 30 days)
            $recentActivations = LicenseActivation::where('activated_at', '>=', now()->subDays(30))->count();

            return $this->successResponse([
                'overview' => [
                    'total_licenses' => $totalLicenses,
                    'active_licenses' => $activeLicenses,
                    'expired_licenses' => $expiredLicenses,
                    'total_activations' => $totalActivations,
                    'online_devices' => $onlineDevices,
                    'recent_activations' => $recentActivations
                ],
                'license_types' => $typeDistribution,
                'platforms' => $platformStats,
                'generated_at' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to get analytics: ' . $e->getMessage());
        }
    }

    /**
     * Success response format
     */
    private function successResponse(array $data = [], string $message = 'Success'): array
    {
        return [
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => now()->toISOString()
        ];
    }

    /**
     * Error response format
     */
    private function errorResponse(string $message): array
    {
        return [
            'success' => false,
            'message' => $message,
            'data' => null,
            'timestamp' => now()->toISOString()
        ];
    }
}