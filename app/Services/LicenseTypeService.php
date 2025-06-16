<?php
// app/Services/LicenseTypeService.php

namespace App\Services;

use App\Models\LicenseType;
use App\Models\License;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class LicenseTypeService
{
    /**
     * Get all license types dengan optional filtering
     */
    public function getAllLicenseTypes(bool $activeOnly = false): array
    {
        $query = LicenseType::query();

        if ($activeOnly) {
            $query->where('is_active', true);
        }

        return $query->orderBy('sort_order')
                    ->orderBy('name')
                    ->get()
                    ->map(function ($licenseType) {
                        return $this->formatLicenseType($licenseType);
                    })
                    ->toArray();
    }

    /**
     * Create license type baru
     */
    public function createLicenseType(array $data): LicenseType
    {
        try {
            DB::beginTransaction();

            // Calculate final price dari original price dan discount
            $finalPrice = $this->calculateFinalPrice(
                $data['original_price'], 
                $data['has_discount'] ?? false, 
                $data['discount_percentage'] ?? 0
            );

            // Generate unique code jika tidak ada
            if (!isset($data['code'])) {
                $data['code'] = $this->generateUniqueCode($data['name']);
            }

            // Set sort order jika tidak ada
            if (!isset($data['sort_order'])) {
                $data['sort_order'] = $this->getNextSortOrder();
            }

            $licenseType = LicenseType::create([
                'name' => $data['name'],
                'code' => $data['code'],
                'description' => $data['description'] ?? null,
                'price' => $finalPrice,
                'original_price' => $data['original_price'],
                'currency' => 'IDR',
                'has_discount' => $data['has_discount'] ?? false,
                'discount_percentage' => $data['discount_percentage'] ?? 0,
                'duration' => $data['duration'],
                'duration_days' => $this->convertDurationToDays($data['duration']),
                'max_devices' => $data['max_devices'],
                'type' => $data['type'],
                'features' => $data['features'] ?? [],
                'restrictions' => $data['restrictions'] ?? [],
                'is_trial' => $data['type'] === 'Trial',
                'is_lifetime' => $data['type'] === 'Lifetime',
                'is_active' => $data['is_active'] ?? true,
                'sort_order' => $data['sort_order'],
                'created_by' => $data['created_by'] ?? null,
            ]);

            DB::commit();

            Log::info('License type created successfully', [
                'license_type_id' => $licenseType->id,
                'code' => $licenseType->code,
                'name' => $licenseType->name
            ]);

            return $licenseType;

        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to create license type', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            throw $e;
        }
    }

    /**
     * Update license type
     */
    public function updateLicenseType(LicenseType $licenseType, array $data): LicenseType
    {
        try {
            DB::beginTransaction();

            // Calculate final price dari original price dan discount
            $finalPrice = $this->calculateFinalPrice(
                $data['original_price'], 
                $data['has_discount'] ?? false, 
                $data['discount_percentage'] ?? 0
            );

            $licenseType->update([
                'name' => $data['name'],
                'code' => $data['code'],
                'description' => $data['description'] ?? $licenseType->description,
                'price' => $finalPrice,
                'original_price' => $data['original_price'],
                'has_discount' => $data['has_discount'] ?? false,
                'discount_percentage' => $data['discount_percentage'] ?? 0,
                'duration' => $data['duration'],
                'duration_days' => $this->convertDurationToDays($data['duration']),
                'max_devices' => $data['max_devices'],
                'type' => $data['type'],
                'features' => $data['features'] ?? $licenseType->features,
                'restrictions' => $data['restrictions'] ?? $licenseType->restrictions,
                'is_trial' => $data['type'] === 'Trial',
                'is_lifetime' => $data['type'] === 'Lifetime',
                'is_active' => $data['is_active'] ?? $licenseType->is_active,
                'updated_by' => $data['updated_by'] ?? null,
            ]);

            DB::commit();

            Log::info('License type updated successfully', [
                'license_type_id' => $licenseType->id,
                'code' => $licenseType->code,
                'name' => $licenseType->name
            ]);

            return $licenseType->fresh();

        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to update license type', [
                'license_type_id' => $licenseType->id,
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            throw $e;
        }
    }

    /**
     * Delete license type
     */
    public function deleteLicenseType(LicenseType $licenseType): bool
    {
        try {
            DB::beginTransaction();

            // Cek apakah license type sedang digunakan
            if ($this->isLicenseTypeInUse($licenseType)) {
                throw new Exception('Tidak dapat menghapus tipe lisensi yang sedang digunakan');
            }

            $licenseType->delete();

            DB::commit();

            Log::info('License type deleted successfully', [
                'license_type_id' => $licenseType->id,
                'code' => $licenseType->code,
                'name' => $licenseType->name
            ]);

            return true;

        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to delete license type', [
                'license_type_id' => $licenseType->id,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Toggle status license type
     */
    public function toggleStatus(LicenseType $licenseType, bool $newStatus): LicenseType
    {
        $licenseType->update(['is_active' => $newStatus]);

        Log::info('License type status toggled', [
            'license_type_id' => $licenseType->id,
            'new_status' => $newStatus
        ]);

        return $licenseType->fresh();
    }

    /**
     * Cek apakah license type sedang digunakan
     */
    public function isLicenseTypeInUse(LicenseType $licenseType): bool
    {
        return License::where('license_type_id', $licenseType->id)->exists();
    }

    /**
     * Get formatted license types untuk dropdown/form
     */
    public function getFormattedLicenseTypes(): array
    {
        return LicenseType::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(function ($licenseType) {
                return [
                    'id' => $licenseType->id,
                    'code' => $licenseType->code,
                    'name' => $licenseType->name,
                    'description' => $licenseType->description,
                    'price' => $licenseType->price,
                    'original_price' => $licenseType->original_price,
                    'formatted_price' => $this->formatPrice($licenseType->price),
                    'formatted_original_price' => $this->formatPrice($licenseType->original_price),
                    'has_discount' => $licenseType->has_discount,
                    'discount_percentage' => $licenseType->discount_percentage,
                    'max_devices' => $licenseType->max_devices,
                    'duration' => $licenseType->duration,
                    'duration_text' => $this->getDurationText($licenseType),
                    'type' => $licenseType->type,
                    'is_trial' => $licenseType->is_trial,
                    'is_lifetime' => $licenseType->is_lifetime,
                    'features' => $licenseType->features ?? [],
                    'restrictions' => $licenseType->restrictions ?? [],
                    'savings_amount' => $licenseType->has_discount ? 
                        $licenseType->original_price - $licenseType->price : 0,
                    'is_discounted' => $licenseType->has_discount && $licenseType->discount_percentage > 0,
                ];
            })
            ->toArray();
    }

    /**
     * Get statistics untuk dashboard
     */
    public function getStats(): array
    {
        $licenseTypes = LicenseType::all();
        
        $totalTypes = $licenseTypes->count();
        $activeTypes = $licenseTypes->where('is_active', true)->count();
        $withDiscount = $licenseTypes->where('has_discount', true)->where('discount_percentage', '>', 0)->count();
        $avgPrice = $licenseTypes->avg('price');
        
        // Calculate total savings dari semua discount
        $totalSavings = $licenseTypes->where('has_discount', true)->sum(function ($licenseType) {
            return $licenseType->original_price - $licenseType->price;
        });

        return [
            'total_types' => $totalTypes,
            'active_types' => $activeTypes,
            'with_discount' => $withDiscount,
            'avg_price' => $avgPrice,
            'total_savings' => $totalSavings,
            'by_type' => [
                'trial' => $licenseTypes->where('type', 'Trial')->count(),
                'standard' => $licenseTypes->where('type', 'Standard')->count(),
                'lifetime' => $licenseTypes->where('type', 'Lifetime')->count(),
                'enterprise' => $licenseTypes->where('type', 'Enterprise')->count(),
            ]
        ];
    }

    // ========== EXISTING METHODS (updated) ==========

    /**
     * Get all active license types
     */
    public function getActiveLicenseTypes(): array
    {
        return $this->getAllLicenseTypes(true);
    }

    /**
     * Get license types for form dropdown
     */
    public function getLicenseTypesForForm(): Collection
    {
        return LicenseType::where('is_active', true)
            ->select([
                'id', 'code', 'name', 'description', 'price', 'original_price',
                'currency', 'max_devices', 'is_trial', 'is_lifetime', 'duration',
                'duration_days', 'has_discount', 'discount_percentage', 'type'
            ])
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get();
    }

    /**
     * Get license type by code
     */
    public function getLicenseTypeByCode(string $code): ?LicenseType
    {
        return LicenseType::where('code', strtoupper($code))
            ->where('is_active', true)
            ->first();
    }

    /**
     * Get license type by ID
     */
    public function getLicenseTypeById(int $id): ?LicenseType
    {
        return LicenseType::where('id', $id)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Check if license type exists and is active
     */
    public function isValidLicenseType(string $code): bool
    {
        return LicenseType::where('code', strtoupper($code))
            ->where('is_active', true)
            ->exists();
    }

    /**
     * Get trial license types only
     */
    public function getTrialLicenseTypes(): Collection
    {
        return LicenseType::where('is_active', true)
            ->where('type', 'Trial')
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Get paid license types only
     */
    public function getPaidLicenseTypes(): Collection
    {
        return LicenseType::where('is_active', true)
            ->where('price', '>', 0)
            ->orderBy('price')
            ->get();
    }

    // ========== HELPER METHODS ==========

    /**
     * Calculate final price setelah discount
     */
    private function calculateFinalPrice(float $originalPrice, bool $hasDiscount, float $discountPercentage): float
    {
        if (!$hasDiscount || $discountPercentage <= 0) {
            return $originalPrice;
        }

        $discountAmount = $originalPrice * ($discountPercentage / 100);
        return max(0, $originalPrice - $discountAmount);
    }

    /**
     * Format price untuk display
     */
    private function formatPrice(float $price): string
    {
        if ($price == 0) {
            return 'Gratis';
        }

        return 'Rp ' . number_format($price, 0, ',', '.');
    }

    /**
     * Get duration text untuk license type
     */
    private function getDurationText(LicenseType $type): string
    {
        // Prioritas: gunakan field 'duration' string dulu
        if (!empty($type->duration)) {
            return $type->duration;
        }

        // Fallback ke duration_days
        if ($type->is_lifetime) {
            return 'Seumur Hidup';
        }

        if ($type->duration_days) {
            if ($type->duration_days == 1) {
                return '1 hari';
            } elseif ($type->duration_days < 30) {
                return $type->duration_days . ' hari';
            } elseif ($type->duration_days < 365) {
                $months = round($type->duration_days / 30);
                return $months . ' bulan';
            } else {
                $years = round($type->duration_days / 365);
                return $years . ' tahun';
            }
        }

        return 'Tidak diketahui';
    }

    /**
     * Convert duration string to days (untuk backward compatibility)
     */
    private function convertDurationToDays(string $duration): ?int
    {
        $duration = strtolower(trim($duration));
        
        if (str_contains($duration, 'seumur hidup') || str_contains($duration, 'lifetime')) {
            return null; // lifetime
        }

        // Extract number dari string
        preg_match('/(\d+)/', $duration, $matches);
        if (!isset($matches[1])) {
            return null;
        }

        $number = (int) $matches[1];

        if (str_contains($duration, 'hari') || str_contains($duration, 'day')) {
            return $number;
        } elseif (str_contains($duration, 'minggu') || str_contains($duration, 'week')) {
            return $number * 7;
        } elseif (str_contains($duration, 'bulan') || str_contains($duration, 'month')) {
            return $number * 30;
        } elseif (str_contains($duration, 'tahun') || str_contains($duration, 'year')) {
            return $number * 365;
        }

        return $number; // default as days
    }

    /**
     * Generate unique code dari name
     */
    private function generateUniqueCode(string $name): string
    {
        $baseCode = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $name), 0, 8));
        
        $counter = 1;
        $code = $baseCode;
        
        while (LicenseType::where('code', $code)->exists()) {
            $code = $baseCode . $counter;
            $counter++;
        }
        
        return $code;
    }

    /**
     * Get next sort order
     */
    private function getNextSortOrder(): int
    {
        return LicenseType::max('sort_order') + 1;
    }

    /**
     * Format license type untuk API response
     */
    private function formatLicenseType(LicenseType $licenseType): array
    {
        return [
            'id' => $licenseType->id,
            'code' => $licenseType->code,
            'name' => $licenseType->name,
            'description' => $licenseType->description,
            'price' => $licenseType->price,
            'original_price' => $licenseType->original_price,
            'currency' => $licenseType->currency,
            'has_discount' => $licenseType->has_discount,
            'discount_percentage' => $licenseType->discount_percentage,
            'duration' => $licenseType->duration,
            'duration_days' => $licenseType->duration_days,
            'max_devices' => $licenseType->max_devices,
            'type' => $licenseType->type,
            'features' => $licenseType->features,
            'restrictions' => $licenseType->restrictions,
            'is_trial' => $licenseType->is_trial,
            'is_lifetime' => $licenseType->is_lifetime,
            'is_active' => $licenseType->is_active,
            'sort_order' => $licenseType->sort_order,
            'created_by' => $licenseType->created_by,
            'updated_by' => $licenseType->updated_by,
            'created_at' => $licenseType->created_at,
            'updated_at' => $licenseType->updated_at,
            
            // Calculated fields
            'formatted_price' => $this->formatPrice($licenseType->price),
            'formatted_original_price' => $this->formatPrice($licenseType->original_price),
            'savings_amount' => $licenseType->has_discount ? 
                $licenseType->original_price - $licenseType->price : 0,
            'duration_text' => $this->getDurationText($licenseType),
            'is_discounted' => $licenseType->has_discount && $licenseType->discount_percentage > 0,
        ];
    }
}