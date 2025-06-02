<?php
// app/Models/LicenseActivation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LicenseActivation extends Model
{
    use HasFactory;

    protected $fillable = [
        'license_id',
        'device_id',
        'device_name',
        'device_platform',
        'device_arch',
        'hostname',
        'username',
        'device_details',
        'status',
        'activated_at',
        'last_used_at',
        'deactivated_at',
        'deactivation_reason',
        'app_version',
        'app_build',
        'ip_address',
        'user_agent',
        'usage_count',
        'first_seen_at',
        'location_data',
        'is_suspicious',
        'suspicious_reason'
    ];

    protected $casts = [
        'activated_at' => 'datetime',
        'last_used_at' => 'datetime',
        'deactivated_at' => 'datetime',
        'first_seen_at' => 'datetime',
        'device_details' => 'array',
        'location_data' => 'array',
        'is_suspicious' => 'boolean'
    ];

    // ========== RELATIONSHIPS ==========

    public function license(): BelongsTo
    {
        return $this->belongsTo(License::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class)->through('license');
    }

    public function licenseType(): BelongsTo
    {
        return $this->belongsTo(LicenseType::class)->through('license');
    }

    public function usageLogs(): HasMany
    {
        return $this->hasMany(LicenseUsageLog::class, 'activation_id');
    }

    // ========== SCOPES ==========

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    public function scopeSuspended($query)
    {
        return $query->where('status', 'suspended');
    }

    public function scopeByDevice($query, $deviceId)
    {
        return $query->where('device_id', $deviceId);
    }

    public function scopeByPlatform($query, $platform)
    {
        return $query->where('device_platform', $platform);
    }

    public function scopeRecentlyUsed($query, $days = 30)
    {
        return $query->where('last_used_at', '>=', now()->subDays($days));
    }

    public function scopeSuspicious($query)
    {
        return $query->where('is_suspicious', true);
    }

    public function scopeOnline($query, $minutes = 5)
    {
        return $query->where('last_used_at', '>=', now()->subMinutes($minutes));
    }

    // ========== ACCESSORS ==========

    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active';
    }

    public function getIsOnlineAttribute(): bool
    {
        // Consider device online if used within last 5 minutes
        return $this->last_used_at && $this->last_used_at->diffInMinutes(now()) <= 5;
    }

    public function getLastSeenHumanAttribute(): string
    {
        if (!$this->last_used_at) {
            return 'Never';
        }

        return $this->last_used_at->diffForHumans();
    }

    public function getDaysActiveSinceAttribute(): int
    {
        if (!$this->activated_at) {
            return 0;
        }

        return $this->activated_at->diffInDays(now());
    }

    public function getFormattedDeviceNameAttribute(): string
    {
        if ($this->device_name) {
            return $this->device_name;
        }

        $platform = ucfirst($this->device_platform ?? 'Unknown');
        $hostname = $this->hostname ?? 'Device';
        
        return "{$platform} - {$hostname}";
    }

    public function getLocationStringAttribute(): string
    {
        if (!$this->location_data) {
            return 'Unknown';
        }

        $location = $this->location_data;
        $parts = [];

        if (isset($location['city'])) {
            $parts[] = $location['city'];
        }

        if (isset($location['country'])) {
            $parts[] = $location['country'];
        }

        return implode(', ', $parts) ?: 'Unknown';
    }

    public function getStatusBadgeAttribute(): string
    {
        return match ($this->status) {
            'active' => '<span class="badge badge-success">Active</span>',
            'inactive' => '<span class="badge badge-secondary">Inactive</span>',
            'suspended' => '<span class="badge badge-warning">Suspended</span>',
            default => '<span class="badge badge-light">Unknown</span>'
        };
    }

    public function getPlatformIconAttribute(): string
    {
        return match ($this->device_platform) {
            'win32' => '🪟',
            'darwin' => '🍎',
            'linux' => '🐧',
            default => '💻'
        };
    }

    // ========== MUTATORS ==========

    public function setDeviceDetailsAttribute($value)
    {
        // Automatically set first_seen_at if not set
        if (!$this->first_seen_at && !$this->exists) {
            $this->attributes['first_seen_at'] = now();
        }

        $this->attributes['device_details'] = json_encode($value);
    }

    // ========== METHODS ==========

    public function updateLastUsed(): void
    {
        $this->update([
            'last_used_at' => now(),
            'usage_count' => $this->usage_count + 1
        ]);
    }

    public function deactivate(string $reason = null): bool
    {
        return $this->update([
            'status' => 'inactive',
            'deactivated_at' => now(),
            'deactivation_reason' => $reason
        ]);
    }

    public function suspend(string $reason = null): bool
    {
        return $this->update([
            'status' => 'suspended',
            'deactivated_at' => now(),
            'deactivation_reason' => $reason
        ]);
    }

    public function reactivate(): bool
    {
        return $this->update([
            'status' => 'active',
            'deactivated_at' => null,
            'deactivation_reason' => null
        ]);
    }

    public function markSuspicious(string $reason): void
    {
        $this->update([
            'is_suspicious' => true,
            'suspicious_reason' => $reason
        ]);
    }

    public function clearSuspicious(): void
    {
        $this->update([
            'is_suspicious' => false,
            'suspicious_reason' => null
        ]);
    }

    public function logUsage(array $usageData): LicenseUsageLog
    {
        return $this->usageLogs()->create([
            'license_id' => $this->license_id,
            'session_id' => $usageData['session_id'] ?? uniqid(),
            'session_start' => $usageData['session_start'] ?? now(),
            'session_end' => $usageData['session_end'] ?? null,
            'session_duration' => $usageData['session_duration'] ?? null,
            'action' => $usageData['action'] ?? 'app_start',
            'feature_used' => $usageData['feature_used'] ?? null,
            'action_data' => $usageData['action_data'] ?? null,
            'pages_viewed' => $usageData['pages_viewed'] ?? 0,
            'pages_printed' => $usageData['pages_printed'] ?? 0,
            'pages_exported' => $usageData['pages_exported'] ?? 0,
            'search_queries' => $usageData['search_queries'] ?? 0,
            'bookmarks_created' => $usageData['bookmarks_created'] ?? 0,
            'notes_created' => $usageData['notes_created'] ?? 0,
            'app_version' => $usageData['app_version'] ?? $this->app_version,
            'ip_address' => $usageData['ip_address'] ?? $this->ip_address,
            'user_agent' => $usageData['user_agent'] ?? $this->user_agent,
            'system_info' => $usageData['system_info'] ?? null,
            'load_time_ms' => $usageData['load_time_ms'] ?? null,
            'errors' => $usageData['errors'] ?? null,
            'crashed' => $usageData['crashed'] ?? false
        ]);
    }

    public function getTotalUsageTime(): int
    {
        return $this->usageLogs()
            ->whereNotNull('session_duration')
            ->sum('session_duration');
    }

    public function getTotalPagesViewed(): int
    {
        return $this->usageLogs()->sum('pages_viewed');
    }

    public function getTotalPagesPrinted(): int
    {
        return $this->usageLogs()->sum('pages_printed');
    }

    public function getTotalPagesExported(): int
    {
        return $this->usageLogs()->sum('pages_exported');
    }

    public function getUsageStats(): array
    {
        return [
            'total_sessions' => $this->usageLogs()->count(),
            'total_usage_time' => $this->getTotalUsageTime(),
            'total_pages_viewed' => $this->getTotalPagesViewed(),
            'total_pages_printed' => $this->getTotalPagesPrinted(),
            'total_pages_exported' => $this->getTotalPagesExported(),
            'last_session' => $this->usageLogs()->latest('session_start')->first(),
            'most_used_feature' => $this->getMostUsedFeature(),
            'average_session_duration' => $this->getAverageSessionDuration()
        ];
    }

    public function getMostUsedFeature(): ?string
    {
        return $this->usageLogs()
            ->whereNotNull('feature_used')
            ->selectRaw('feature_used, COUNT(*) as usage_count')
            ->groupBy('feature_used')
            ->orderBy('usage_count', 'desc')
            ->first()
            ?->feature_used;
    }

    public function getAverageSessionDuration(): float
    {
        return $this->usageLogs()
            ->whereNotNull('session_duration')
            ->avg('session_duration') ?: 0;
    }

    public function hasFeature(string $feature): bool
    {
        return $this->license->hasFeature($feature);
    }

    public function canUseFeature(string $feature): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if (!$this->license->is_active) {
            return false;
        }

        return $this->license->hasFeature($feature);
    }

    public function isWithinUsageLimit(string $feature, int $currentUsage): bool
    {
        $restrictions = $this->license->restrictions;
        
        $limitKey = $feature . '_limit';
        
        if (!isset($restrictions[$limitKey])) {
            return true; // No limit set
        }

        $limit = $restrictions[$limitKey];
        
        if ($limit === null) {
            return true; // Unlimited
        }

        return $currentUsage < $limit;
    }

    // ========== STATIC METHODS ==========

    public static function findByDeviceId(string $deviceId): ?self
    {
        return static::where('device_id', $deviceId)
            ->where('status', 'active')
            ->first();
    }

    public static function getActiveDevicesCount(): int
    {
        return static::active()->distinct('device_id')->count();
    }

    public static function getOnlineDevicesCount(): int
    {
        return static::online()->count();
    }

    public static function getPlatformStats(): array
    {
        return static::active()
            ->selectRaw('device_platform, COUNT(*) as count')
            ->groupBy('device_platform')
            ->pluck('count', 'device_platform')
            ->toArray();
    }
}