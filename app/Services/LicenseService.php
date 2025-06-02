<?php
// app/Services/LicenseService.php

namespace App\Services;

use App\Models\License;
use App\Models\LicenseType;
use App\Models\Customer;
use App\Models\LicenseActivation;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LicenseService
{
    /**
     * Activate license key
     */
    public function activateLicense(string $licenseKey, array $deviceData)
    {
        try {
            Log::info('License activation attempt', [
                'license_key' => $licenseKey,
                'device_id' => $deviceData['device_id'] ?? 'unknown'
            ]);

            // 1. Find license
            $license = License::where('license_key', $licenseKey)->first();
            
            if (!$license) {
                Log::warning('License not found', ['license_key' => $licenseKey]);
                return $this->errorResponse('License key not found in database');
            }

            Log::info('License found', [
                'license_id' => $license->id,
                'status' => $license->status,
                'customer_id' => $license->customer_id
            ]);

            // Check if license is active
            if ($license->status !== 'active') {
                Log::warning('License not active', [
                    'license_key' => $licenseKey,
                    'status' => $license->status
                ]);
                return $this->errorResponse('License is not active. Status: ' . $license->status);
            }

            // 2. Check if expired
            if ($license->expires_at && $license->expires_at->isPast()) {
                Log::warning('License expired', [
                    'license_key' => $licenseKey,
                    'expires_at' => $license->expires_at
                ]);
                return $this->errorResponse('License has expired on ' . $license->expires_at);
            }

            // 3. Check device limit
            $currentActivations = $license->activations()->where('status', 'active')->count();
            Log::info('Device limit check', [
                'current_activations' => $currentActivations,
                'max_devices' => $license->max_devices
            ]);

            if ($currentActivations >= $license->max_devices) {
                // Check if this device already activated
                $existingActivation = $license->activations()
                    ->where('device_id', $deviceData['device_id'])
                    ->where('status', 'active')
                    ->first();
                    
                if (!$existingActivation) {
                    Log::warning('Device limit exceeded', [
                        'license_key' => $licenseKey,
                        'current_activations' => $currentActivations,
                        'max_devices' => $license->max_devices
                    ]);
                    return $this->errorResponse('Device limit exceeded. Maximum ' . $license->max_devices . ' devices allowed. Currently ' . $currentActivations . ' devices active.');
                }

                Log::info('Device already activated, updating existing activation');
            }

            // 4. Activate license
            Log::info('Attempting to activate license');
            $activated = $license->activate($deviceData['device_id'], $deviceData);
            
            if (!$activated) {
                Log::error('License activation failed in model method');
                return $this->errorResponse('Failed to activate license - activation method returned false');
            }

            Log::info('License activated successfully');

            // 5. Return success response
            return $this->successResponse([
                'type' => $license->licenseType->code,
                'expires_at' => $license->expires_at?->toISOString(),
                'features' => $license->features,
                'restrictions' => $license->restrictions,
                'max_devices' => $license->max_devices,
                'devices_used' => $license->fresh()->devices_used, // Fresh to get updated count
                'is_lifetime' => $license->expires_at === null
            ], 'License activated successfully');

        } catch (\Exception $e) {
            Log::error('License activation exception', [
                'license_key' => $licenseKey,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Activation failed: ' . $e->getMessage());
        }
    }

    /**
     * Verify license status
     */
    public function verifyLicense(string $licenseKey, string $deviceId): array
    {
        try {
            $license = License::where('license_key', $licenseKey)->first();
            
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
            $license->update(['last_verified_at' => now()]);
            $activation->update(['last_used_at' => now()]);

            return $this->successResponse([
                'is_valid' => $license->status === 'active',
                'type' => $license->licenseType->code,
                'expires_at' => $license->expires_at?->toISOString(),
                'days_remaining' => $license->expires_at ? now()->diffInDays($license->expires_at, false) : null,
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
            $license = License::where('license_key', $licenseKey)->first();
            
            if (!$license) {
                return $this->errorResponse('License not found');
            }

            $activation = $license->activations()
                ->where('device_id', $deviceId)
                ->first();

            if ($activation) {
                $activation->update([
                    'status' => 'inactive',
                    'deactivated_at' => now(),
                    'deactivation_reason' => 'User requested deactivation'
                ]);

                // Update devices count
                $activeCount = $license->activations()->where('status', 'active')->count();
                $license->update(['devices_used' => $activeCount]);

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
            $license = License::with(['licenseType', 'customer', 'activations'])->where('license_key', $licenseKey)->first();
            
            if (!$license) {
                return $this->errorResponse('License not found');
            }

            return $this->successResponse([
                'license_key' => $this->maskKey($license->license_key),
                'type' => $license->licenseType->code,
                'status' => $license->status,
                'customer' => [
                    'name' => $license->customer->name,
                    'email' => $license->customer->email
                ],
                'issued_at' => $license->issued_at->toISOString(),
                'activated_at' => $license->activated_at?->toISOString(),
                'expires_at' => $license->expires_at?->toISOString(),
                'days_remaining' => $license->expires_at ? now()->diffInDays($license->expires_at, false) : null,
                'is_active' => $license->status === 'active',
                'is_lifetime' => $license->expires_at === null,
                'max_devices' => $license->max_devices,
                'devices_used' => $license->devices_used,
                'features' => $license->features,
                'restrictions' => $license->restrictions,
                'activations' => $license->activations->map(function($activation) {
                    return [
                        'device_name' => $activation->device_name ?: ($activation->hostname . ' (' . $activation->username . ')'),
                        'platform' => $activation->device_platform,
                        'status' => $activation->status,
                        'activated_at' => $activation->activated_at?->toISOString(),
                        'last_used_at' => $activation->last_used_at?->toISOString(),
                        'is_online' => $activation->last_used_at && $activation->last_used_at->diffInMinutes(now()) <= 5
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
            $license = License::where('license_key', $licenseKey)->first();
            
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

            // Log usage - simplified
            $activation->update(['last_used_at' => now(), 'usage_count' => ($activation->usage_count ?? 0) + 1]);

            return $this->successResponse([
                'usage_logged' => true
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
                    'customer_type' => $data['customer_type'] ?? 'individual',
                    'status' => 'active'
                ]
            );

            // 2. Get license type
            $licenseType = LicenseType::where('code', $data['license_type'])->where('is_active', true)->first();
            
            if (!$licenseType) {
                return $this->errorResponse('Invalid license type');
            }

            // 3. Generate unique license key
            do {
                $licenseKey = $this->generateLicenseKey($licenseType->code);
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
                'devices_used' => 0,
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
                'is_lifetime' => $license->expires_at === null,
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
            $activeLicenses = License::where('status', 'active')->count();
            $expiredLicenses = License::where('expires_at', '<', now())->count();
            $totalActivations = LicenseActivation::where('status', 'active')->count();

            return $this->successResponse([
                'overview' => [
                    'total_licenses' => $totalLicenses,
                    'active_licenses' => $activeLicenses,
                    'expired_licenses' => $expiredLicenses,
                    'total_activations' => $totalActivations,
                ],
                'generated_at' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to get analytics: ' . $e->getMessage());
        }
    }

    /**
     * Helper methods
     */
    private function maskKey(string $key): string
    {
        if (strlen($key) > 10) {
            return substr($key, 0, 9) . '****';
        }
        return $key;
    }

    private function generateLicenseKey(string $type): string
    {
        $type = strtoupper($type);
        $year = date('Y');
        $serial = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
        
        return "{$type}{$year}{$serial}";
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