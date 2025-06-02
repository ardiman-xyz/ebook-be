<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LicenseType extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'duration_days',
        'max_devices',
        'price',
        'currency',
        'features',
        'restrictions',
        'is_trial',
        'is_lifetime',
        'requires_online_activation',
        'allows_offline_usage',
        'offline_grace_days',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'features' => 'array',
        'restrictions' => 'array',
        'is_trial' => 'boolean',
        'is_lifetime' => 'boolean',
        'requires_online_activation' => 'boolean',
        'allows_offline_usage' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'decimal:2'
    ];

    // Relationships
    public function licenses(): HasMany
    {
        return $this->hasMany(License::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCode($query, $code)
    {
        return $query->where('code', strtoupper($code));
    }

    public function scopeTrials($query)
    {
        return $query->where('is_trial', true);
    }

    public function scopeLifetime($query)
    {
        return $query->where('is_lifetime', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    // Accessors
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 2) . ' ' . $this->currency;
    }

    public function getDurationTextAttribute(): string
    {
        if ($this->is_lifetime) {
            return 'Lifetime';
        }

        if ($this->duration_days) {
            if ($this->duration_days == 1) {
                return '1 day';
            } elseif ($this->duration_days < 30) {
                return $this->duration_days . ' days';
            } elseif ($this->duration_days < 365) {
                $months = round($this->duration_days / 30);
                return $months . ' month' . ($months > 1 ? 's' : '');
            } else {
                $years = round($this->duration_days / 365);
                return $years . ' year' . ($years > 1 ? 's' : '');
            }
        }

        return 'Unknown';
    }

    // REMOVED: Conflicting getIsLifetimeAttribute() accessor
    // This was causing the error because it conflicts with the database field

    // Methods
    public function hasFeature(string $feature): bool
    {
        return in_array($feature, $this->features ?? []);
    }

    public function getRestriction(string $key, $default = null)
    {
        return $this->restrictions[$key] ?? $default;
    }

    /**
     * Check if this license type is lifetime
     * Use this method instead of the removed accessor
     */
    public function isLifetime(): bool
    {
        return $this->is_lifetime || $this->duration_days === null;
    }
}