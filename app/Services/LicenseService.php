<?php
// app/Services/LicenseService.php

namespace App\Services;

use App\Models\License;
use App\Models\LicenseType;
use App\Models\Customer;
use App\Models\LicenseActivation;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
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

     /**
     * Delete a license permanently
     */
    public function deleteLicense(License $license, int $deletedBy): array
    {
        try {
            // Check if license can be deleted
            $deletabilityStatus = $this->checkDeletability($license);
            
            if (!$deletabilityStatus['can_delete']) {
                return $this->errorResponse(
                    'Cannot delete license: ' . implode(', ', $deletabilityStatus['blocking_reasons']),
                    ['reasons' => $deletabilityStatus['blocking_reasons']]
                );
            }

            // Get license info before deletion for logging and response
            $licenseInfo = [
                'license_key' => $license->license_key,
                'customer_name' => $license->customer->name,
                'customer_email' => $license->customer->email,
                'purchase_price' => $license->purchase_price,
                'activations_count' => $license->activations()->count(),
                'usage_logs_count' => $license->usageLogs()->count(),
                'devices_used' => $license->devices_used
            ];

            // Perform deletion in transaction
            DB::transaction(function () use ($license, $deletedBy, $licenseInfo) {
                Log::info('License deletion initiated', [
                    'license_id' => $license->id,
                    'license_info' => $licenseInfo,
                    'deleted_by' => $deletedBy,
                    'timestamp' => now()
                ]);

                // Delete related records (cascade should handle this, but being explicit)
                $license->usageLogs()->delete();
                $license->activations()->delete();
                
                // Delete the license
                $license->delete();
            });

            Log::info('License deleted successfully', [
                'license_key' => $licenseInfo['license_key'],
                'customer' => $licenseInfo['customer_name'],
                'impact' => $licenseInfo,
                'deleted_by' => $deletedBy
            ]);

            return $this->successResponse([
                'license_key' => $licenseInfo['license_key'],
                'customer_name' => $licenseInfo['customer_name'],
                'impact' => [
                    'activations_deleted' => $licenseInfo['activations_count'],
                    'usage_logs_deleted' => $licenseInfo['usage_logs_count'],
                    'revenue_lost' => $licenseInfo['purchase_price']
                ]
            ], "License {$licenseInfo['license_key']} deleted successfully");

        } catch (Exception $e) {
            Log::error('License deletion failed', [
                'license_id' => $license->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'deleted_by' => $deletedBy
            ]);

            return $this->errorResponse(
                'Failed to delete license: ' . $e->getMessage()
            );
        }
    }

    /**
     * Check if license can be deleted
     */
    public function checkDeletability(License $license): array
    {
        $canDelete = true;
        $reasons = [];
        $warnings = [];

        // Business rules for deletion
        if ($license->status === 'active' && $license->devices_used > 0) {
            $canDelete = false;
            $reasons[] = 'Cannot delete active license with connected devices';
            $reasons[] = 'Please suspend or revoke the license first';
        }

        // Warnings (not blocking)
        if ($license->purchase_price > 0) {
            $warnings[] = "Revenue loss: " . number_format($license->purchase_price, 0) . " {$license->purchase_currency}";
        }

        $activationsCount = $license->activations()->count();
        if ($activationsCount > 0) {
            $warnings[] = "{$activationsCount} activation records will be deleted";
        }

        $usageLogsCount = $license->usageLogs()->count();
        if ($usageLogsCount > 0) {
            $warnings[] = "{$usageLogsCount} usage logs will be deleted";
        }

        if ($license->customer->licenses()->count() === 1) {
            $warnings[] = "This is the customer's only license";
        }

        return [
            'can_delete' => $canDelete,
            'blocking_reasons' => $reasons,
            'warnings' => $warnings,
            'impact' => [
                'activations_count' => $activationsCount,
                'usage_logs_count' => $usageLogsCount,
                'revenue_lost' => $license->purchase_price,
                'customer_name' => $license->customer->name,
                'customer_email' => $license->customer->email
            ]
        ];
    }

    /**
     * Suspend a license
     */
    public function suspendLicense(License $license, int $suspendedBy): array
    {
        try {
            if ($license->status !== 'active') {
                return $this->errorResponse('Only active licenses can be suspended');
            }

            $defaultReason = $reason ?? 'Suspended by admin';
            $activeDevicesCount = $license->activations()->where('status', 'active')->count();

            DB::transaction(function () use ($license, $defaultReason, $suspendedBy) {
                // Update license status
                $license->update([
                    'status' => 'suspended',
                    'status_reason' => $defaultReason
                ]);

                // Deactivate all active devices
                $license->activations()
                    ->where('status', 'active')
                    ->update([
                        'status' => 'suspended',
                        'deactivated_at' => now(),
                        'deactivation_reason' => 'License suspended: ' . $defaultReason
                    ]);
                
                // Reset devices count
                $license->update(['devices_used' => 0]);
            });

            Log::info('License suspended successfully', [
                'license_id' => $license->id,
                'license_key' => $license->license_key,
                'reason' => $defaultReason,
                'suspended_by' => $suspendedBy,
                'devices_deactivated' => $activeDevicesCount
            ]);

            return $this->successResponse([
                'license_key' => $license->license_key,
                'status' => 'suspended',
                'devices_deactivated' => $activeDevicesCount
            ], "License suspended successfully. {$activeDevicesCount} devices deactivated.");

        } catch (\Exception $e) {
            Log::error('License suspension failed', [
                'license_id' => $license->id,
                'error' => $e->getMessage(),
                'suspended_by' => $suspendedBy
            ]);

            return $this->errorResponse('Failed to suspend license: ' . $e->getMessage());
        }
    }

    /**
     * Revoke a license permanently
     */
    public function revokeLicense(License $license, int $revokedBy): array
    {
        try {
            if (!in_array($license->status, ['active', 'suspended'])) {
                return $this->errorResponse('Only active or suspended licenses can be revoked');
            }

            $defaultReason = $reason ?? 'Revoked by admin';
            $activeDevicesCount = $license->activations()
                ->whereIn('status', ['active', 'suspended'])
                ->count();

            DB::transaction(function () use ($license, $defaultReason, $revokedBy) {
                // Update license status
                $license->update([
                    'status' => 'revoked',
                    'status_reason' => $defaultReason
                ]);

                // Deactivate all devices
                $license->activations()
                    ->whereIn('status', ['active', 'suspended'])
                    ->update([
                        'status' => 'inactive',
                        'deactivated_at' => now(),
                        'deactivation_reason' => 'License revoked: ' . $defaultReason
                    ]);
                
                // Reset devices count
                $license->update(['devices_used' => 0]);
            });

            Log::info('License revoked successfully', [
                'license_id' => $license->id,
                'license_key' => $license->license_key,
                'reason' => $defaultReason,
                'revoked_by' => $revokedBy,
                'devices_deactivated' => $activeDevicesCount
            ]);

            return $this->successResponse([
                'license_key' => $license->license_key,
                'status' => 'revoked',
                'devices_deactivated' => $activeDevicesCount
            ], "License revoked permanently. {$activeDevicesCount} devices deactivated.");

        } catch (\Exception $e) {
            Log::error('License revocation failed', [
                'license_id' => $license->id,
                'error' => $e->getMessage(),
                'revoked_by' => $revokedBy
            ]);

            return $this->errorResponse('Failed to revoke license: ' . $e->getMessage());
        }
    }

    /**
     * Reactivate a suspended or expired license
     */
    public function reactivateLicense(License $license, int $reactivatedBy): array
    {
        try {
            if (!in_array($license->status, ['suspended', 'expired'])) {
                return $this->errorResponse('Only suspended or expired licenses can be reactivated');
            }

            // Check if license is not expired
            if ($license->expires_at && $license->expires_at->isPast()) {
                return $this->errorResponse(
                    'Cannot reactivate expired license. Please extend the expiry date first.',
                    ['expires_at' => $license->expires_at->toISOString()]
                );
            }

            $defaultReason = $reason ?? 'Reactivated by admin';

            $license->update([
                'status' => 'active',
                'status_reason' => $defaultReason,
                'last_verified_at' => now()
            ]);

            Log::info('License reactivated successfully', [
                'license_id' => $license->id,
                'license_key' => $license->license_key,
                'reason' => $defaultReason,
                'reactivated_by' => $reactivatedBy
            ]);

            return $this->successResponse([
                'license_key' => $license->license_key,
                'status' => 'active',
                'reactivated_at' => now()->toISOString()
            ], "License reactivated successfully");

        } catch (\Exception $e) {
            Log::error('License reactivation failed', [
                'license_id' => $license->id,
                'error' => $e->getMessage(),
                'reactivated_by' => $reactivatedBy
            ]);

            return $this->errorResponse('Failed to reactivate license: ' . $e->getMessage());
        }
    }

    /**
     * Update license details
     */
    public function updateLicense(License $license, array $data, int $updatedBy): array
    {
        try {
            Log::info('License update initiated', [
                'license_id' => $license->id,
                'license_key' => $license->license_key,
                'updated_by' => $updatedBy,
                'changes' => $data
            ]);

            DB::transaction(function () use ($license, $data, $updatedBy) {
                // Update customer information
                $license->customer->update([
                    'name' => $data['customer_name'],
                    'email' => $data['customer_email'],
                    'customer_type' => $data['customer_type']
                ]);

                // Prepare license update data
                $licenseUpdateData = [
                    'max_devices' => $data['max_devices'],
                    'purchase_price' => $data['purchase_price'],
                    'purchase_currency' => $data['purchase_currency'],
                    'order_id' => $data['order_id'],
                    'payment_method' => $data['payment_method'],
                    'admin_notes' => $data['admin_notes'],
                ];

                // Handle expiry date update
                if (isset($data['expires_at'])) {
                    if ($data['expires_at']) {
                        $licenseUpdateData['expires_at'] = Carbon::parse($data['expires_at']);
                    } else {
                        // Setting to null for lifetime
                        $licenseUpdateData['expires_at'] = null;
                    }
                }

                // Check if max_devices is being reduced
                if ($data['max_devices'] < $license->max_devices) {
                    $activeDevices = $license->activations()->where('status', 'active')->count();
                    
                    if ($activeDevices > $data['max_devices']) {
                        throw new \Exception(
                            "Cannot reduce max devices to {$data['max_devices']}. " .
                            "Currently {$activeDevices} devices are active. " .
                            "Please deactivate some devices first."
                        );
                    }
                }

                // Update license
                $license->update($licenseUpdateData);

                Log::info('License updated successfully', [
                    'license_id' => $license->id,
                    'license_key' => $license->license_key,
                    'updated_by' => $updatedBy
                ]);
            });

            // Reload relationships for response
            $license->load(['customer', 'licenseType']);

            return $this->successResponse([
                'license' => [
                    'id' => $license->id,
                    'license_key' => $license->license_key,
                    'customer' => [
                        'name' => $license->customer->name,
                        'email' => $license->customer->email,
                        'customer_type' => $license->customer->customer_type
                    ],
                    'max_devices' => $license->max_devices,
                    'purchase_price' => $license->purchase_price,
                    'purchase_currency' => $license->purchase_currency,
                    'expires_at' => $license->expires_at?->toISOString(),
                    'updated_at' => $license->updated_at->toISOString()
                ]
            ], "License {$license->license_key} updated successfully");

        } catch (\Exception $e) {
            Log::error('License update failed', [
                'license_id' => $license->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'updated_by' => $updatedBy
            ]);

            return $this->errorResponse('Failed to update license: ' . $e->getMessage());
        }
    }


}