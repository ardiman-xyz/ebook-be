<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'phone',
        'address',
        'company',
        'customer_type',
        'status',
        'notes'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'notes' => 'array'
    ];

    // Relationships
    public function licenses(): HasMany
    {
        return $this->hasMany(License::class);
    }

    public function activeLicenses(): HasMany
    {
        return $this->hasMany(License::class)->where('status', 'active');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('customer_type', $type);
    }

    // Accessors & Mutators
    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active';
    }

    public function getTotalLicensesAttribute(): int
    {
        return $this->licenses()->count();
    }

    public function getActiveLicensesCountAttribute(): int
    {
        return $this->activeLicenses()->count();
    }
}