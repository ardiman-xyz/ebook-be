<?php
// app/Services/LicenseTypeService.php

namespace App\Services;

use App\Models\LicenseType;
use Illuminate\Database\Eloquent\Collection;

class LicenseTypeService
{
    /**
     * Get all active license types
     */
    public function getActiveLicenseTypes(): Collection
    {
        return LicenseType::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    /**
     * Get license types for form dropdown
     */
    public function getLicenseTypesForForm(): Collection
    {
        return LicenseType::where('is_active', true)
            ->select([
                'id',
                'code', 
                'name',
                'description',
                'price',
                'currency',
                'max_devices',
                'is_trial',
                'is_lifetime',
                'duration_days'
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
     * Get formatted license types for API response
     */
    public function getFormattedLicenseTypes(): array
    {
        return $this->getLicenseTypesForForm()->map(function ($type) {
            return [
                'id' => $type->id,
                'code' => $type->code,
                'name' => $type->name,
                'description' => $type->description,
                'price' => $type->price,
                'currency' => $type->currency,
                'formatted_price' => $this->formatPrice($type->price, $type->currency),
                'max_devices' => $type->max_devices,
                'duration_text' => $this->getDurationText($type),
                'is_trial' => $type->is_trial,
                'is_lifetime' => $type->is_lifetime,
                'features' => $type->features ?? [],
                'restrictions' => $type->restrictions ?? []
            ];
        })->toArray();
    }

    /**
     * Format price based on currency
     */
    private function formatPrice(float $price, string $currency): string
    {
        if ($price == 0) {
            return 'Free';
        }

        switch ($currency) {
            case 'IDR':
                return 'Rp ' . number_format($price, 0, ',', '.');
            case 'USD':
                return '$' . number_format($price, 2);
            default:
                return $currency . ' ' . number_format($price, 2);
        }
    }

    /**
     * Get duration text for license type
     */
    private function getDurationText(LicenseType $type): string
    {
        if ($type->is_lifetime) {
            return 'Lifetime';
        }

        if ($type->duration_days) {
            if ($type->duration_days == 1) {
                return '1 day';
            } elseif ($type->duration_days < 30) {
                return $type->duration_days . ' days';
            } elseif ($type->duration_days < 365) {
                $months = round($type->duration_days / 30);
                return $months . ' month' . ($months > 1 ? 's' : '');
            } else {
                $years = round($type->duration_days / 365);
                return $years . ' year' . ($years > 1 ? 's' : '');
            }
        }

        return 'Unknown';
    }

    /**
     * Get trial license types only
     */
    public function getTrialLicenseTypes(): Collection
    {
        return LicenseType::where('is_active', true)
            ->where('is_trial', true)
            ->orderBy('duration_days')
            ->get();
    }

    /**
     * Get paid license types only
     */
    public function getPaidLicenseTypes(): Collection
    {
        return LicenseType::where('is_active', true)
            ->where('is_trial', false)
            ->where('price', '>', 0)
            ->orderBy('price')
            ->get();
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
}