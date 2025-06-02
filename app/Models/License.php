<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class License extends Model
{
    use HasFactory;

    protected $fillable = [
        'license_key',
        'customer_id',
        'license_type_id',
        'status',
        'status_reason',
        'issued_at',
        'activated_at',
        'expires_at',
        'last_verified_at',
        'max_devices',
        'devices_used',
        'custom_features',
        'custom_restrictions',
        'order_id',
        'purchase_price',
        'purchase_currency',
        'payment_method',
        'created_by',
        'admin_notes',
        'metadata'
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'activated_at' => 'datetime',
        'expires_at' => 'datetime',
        'last_verified_at' => 'datetime',
        'custom_features' => 'array',
        'custom_restrictions' => 'array',
        'metadata' => 'array',
        'purchase_price' => 'decimal:2'
    ];

    // Relationships
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function licenseType(): BelongsTo
    {
        return $this->belongsTo(LicenseType::class);
    }

    public function activations(): HasMany
    {
        return $this->hasMany(LicenseActivation::class);
    }

    public function activeActivations(): HasMany
    {
        return $this->hasMany(LicenseActivation::class)->where('status', 'active');
    }

    public function usageLogs(): HasMany
    {
        return $this->hasMany(LicenseUsageLog::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now())
                    ->orWhere('status', 'expired');
    }

    public function scopeExpiringSoon($query, $days = 7)
    {
        return $query->where('expires_at', '<=', now()->addDays($days))
                    ->where('expires_at', '>', now());
    }

    public function scopeByKey($query, $key)
    {
        return $query->where('license_key', $key);
    }

    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    // Accessors
    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active' && !$this->is_expired;
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function getIsLifetimeAttribute(): bool
    {
        return $this->expires_at === null || $this->licenseType->is_lifetime;
    }

    public function getDaysRemainingAttribute(): ?int
    {
        if ($this->is_lifetime) {
            return null;
        }

        if ($this->expires_at) {
            $days = now()->diffInDays($this->expires_at, false);
            return $days > 0 ? $days : 0;
        }

        return 0;
    }

    public function getCanActivateAttribute(): bool
    {
        return $this->is_active && 
               $this->devices_used < $this->max_devices;
    }

    public function getFeaturesAttribute(): array
    {
        // Merge license type features with custom features
        $typeFeatures = $this->licenseType->features ?? [];
        $customFeatures = $this->custom_features ?? [];
        
        return array_unique(array_merge($typeFeatures, $customFeatures));
    }

    public function getRestrictionsAttribute(): array
    {
        // Merge license type restrictions with custom restrictions
        $typeRestrictions = $this->licenseType->restrictions ?? [];
        $customRestrictions = $this->custom_restrictions ?? [];
        
        return array_merge($typeRestrictions, $customRestrictions);
    }

    public function getMaskedKeyAttribute(): string
    {
        if (strlen($this->license_key) > 10) {
            return substr($this->license_key, 0, 9) . '****';
        }
        return $this->license_key;
    }

    // Methods
    public function activate(string $deviceId, array $deviceInfo = []): bool
    {
        if (!$this->can_activate) {
            return false;
        }

        // Create or update activation
        $activation = $this->activations()->updateOrCreate(
            ['device_id' => $deviceId],
            [
                'device_name' => $deviceInfo['device_name'] ?? null,
                'device_platform' => $deviceInfo['platform'] ?? null,
                'device_arch' => $deviceInfo['arch'] ?? null,
                'hostname' => $deviceInfo['hostname'] ?? null,
                'username' => $deviceInfo['username'] ?? null,
                'device_details' => $deviceInfo,
                'status' => 'active',
                'last_used_at' => now(),
                'app_version' => $deviceInfo['app_version'] ?? null,
                'ip_address' => $deviceInfo['ip_address'] ?? null,
                'user_agent' => $deviceInfo['user_agent'] ?? null
            ]
        );

        // Update license
        $this->update([
            'activated_at' => $this->activated_at ?? now(),
            'last_verified_at' => now(),
            'devices_used' => $this->activeActivations()->count()
        ]);

        return true;
    }

    public function deactivate(string $deviceId, string $reason = null): bool
    {
        $activation = $this->activations()
            ->where('device_id', $deviceId)
            ->first();

        if ($activation) {
            $activation->update([
                'status' => 'inactive',
                'deactivated_at' => now(),
                'deactivation_reason' => $reason
            ]);

            // Update devices count
            $this->update([
                'devices_used' => $this->activeActivations()->count()
            ]);

            return true;
        }

        return false;
    }

    public function suspend(string $reason = null): bool
    {
        $this->update([
            'status' => 'suspended',
            'status_reason' => $reason
        ]);

        // Deactivate all devices
        $this->activations()->update([
            'status' => 'suspended',
            'deactivated_at' => now(),
            'deactivation_reason' => 'License suspended: ' . $reason
        ]);

        return true;
    }

    public function revoke(string $reason = null): bool
    {
        $this->update([
            'status' => 'revoked',
            'status_reason' => $reason
        ]);

        // Deactivate all devices
        $this->activations()->update([
            'status' => 'inactive',
            'deactivated_at' => now(),
            'deactivation_reason' => 'License revoked: ' . $reason
        ]);

        return true;
    }

    public function hasFeature(string $feature): bool
    {
        return in_array($feature, $this->features);
    }

    public function getRestriction(string $key, $default = null)
    {
        return $this->restrictions[$key] ?? $default;
    }

    public function isDeviceActivated(string $deviceId): bool
    {
        return $this->activeActivations()
            ->where('device_id', $deviceId)
            ->exists();
    }

    public function updateLastVerified(): void
    {
        $this->update(['last_verified_at' => now()]);
    }

    public static function generateKey(string $type): string
    {
        $type = strtoupper($type);
        $year = date('Y');
        $serial1 = strtoupper(substr(bin2hex(random_bytes(2)), 0, 4));
        $serial2 = strtoupper(substr(bin2hex(random_bytes(2)), 0, 4));
        
        return "{$type}-{$year}-{$serial1}-{$serial2}";
    }
}