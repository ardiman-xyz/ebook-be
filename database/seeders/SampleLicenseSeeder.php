<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\License;
use App\Models\LicenseType;

class SampleLicenseSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo customer
        $demoCustomer = Customer::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo User',
                'customer_type' => 'individual',
                'status' => 'active'
            ]
        );

        // Create trial customer
        $trialCustomer = Customer::firstOrCreate(
            ['email' => 'trial@example.com'],
            [
                'name' => 'Trial User',
                'customer_type' => 'individual',
                'status' => 'active'
            ]
        );

        // Create business customer
        $businessCustomer = Customer::firstOrCreate(
            ['email' => 'business@example.com'],
            [
                'name' => 'PT Example Indonesia',
                'customer_type' => 'business',
                'status' => 'active'
            ]
        );

        // Get or create license types with IDR currency
        $demoType = LicenseType::firstOrCreate(
            ['code' => 'DEMO'],
            [
                'name' => 'Demo License',
                'description' => '7-day demo license',
                'duration_days' => 7,
                'max_devices' => 1,
                'price' => 0,
                'currency' => 'IDR',
                'features' => ['read', 'notes'],
                'restrictions' => ['watermark' => true, 'print_limit' => 3],
                'is_trial' => true,
                'is_lifetime' => false,
                'is_active' => true
            ]
        );

        $trialType = LicenseType::firstOrCreate(
            ['code' => 'TRIAL'],
            [
                'name' => 'Trial License',
                'description' => '30-day trial license',
                'duration_days' => 30,
                'max_devices' => 1,
                'price' => 0,
                'currency' => 'IDR',
                'features' => ['read', 'print', 'notes', 'bookmark', 'search'],
                'restrictions' => ['watermark' => false, 'print_limit' => 10, 'export_limit' => 5],
                'is_trial' => true,
                'is_lifetime' => false,
                'is_active' => true
            ]
        );

        $fullType = LicenseType::firstOrCreate(
            ['code' => 'FULL'],
            [
                'name' => 'Full License',
                'description' => '1-year full license',
                'duration_days' => 365,
                'max_devices' => 3,
                'price' => 750000, // Rp 750.000
                'currency' => 'IDR',
                'features' => ['read', 'print', 'notes', 'bookmark', 'search', 'export', 'offline', 'sync'],
                'restrictions' => [],
                'is_trial' => false,
                'is_lifetime' => false,
                'is_active' => true
            ]
        );

        $enterpriseType = LicenseType::firstOrCreate(
            ['code' => 'ENT'],
            [
                'name' => 'Enterprise License',
                'description' => '3-year enterprise license',
                'duration_days' => 1095, // 3 years
                'max_devices' => 10,
                'price' => 3000000, // Rp 3.000.000
                'currency' => 'IDR',
                'features' => ['read', 'print', 'notes', 'bookmark', 'search', 'export', 'offline', 'sync', 'admin_panel', 'priority_support'],
                'restrictions' => [],
                'is_trial' => false,
                'is_lifetime' => false,
                'is_active' => true
            ]
        );

        $lifetimeType = LicenseType::firstOrCreate(
            ['code' => 'LIFE'],
            [
                'name' => 'Lifetime License',
                'description' => 'Lifetime license with all features',
                'duration_days' => null, // Lifetime
                'max_devices' => 5,
                'price' => 2500000, // Rp 2.500.000
                'currency' => 'IDR',
                'features' => ['read', 'print', 'notes', 'bookmark', 'search', 'export', 'offline', 'sync', 'premium_support'],
                'restrictions' => [],
                'is_trial' => false,
                'is_lifetime' => true,
                'is_active' => true
            ]
        );

        // Create sample licenses with IDR currency
        $sampleLicenses = [
            [
                'license_key' => 'DEMO12345678ABC',
                'customer_id' => $demoCustomer->id,
                'license_type_id' => $demoType->id,
                'expires_at' => now()->addDays(7),
                'max_devices' => 1,
                'purchase_price' => 0,
                'purchase_currency' => 'IDR'
            ],
            [
                'license_key' => 'DEMO2024TESTDEMO',
                'customer_id' => $demoCustomer->id,
                'license_type_id' => $demoType->id,
                'expires_at' => now()->addDays(7),
                'max_devices' => 1,
                'purchase_price' => 0,
                'purchase_currency' => 'IDR'
            ],
            [
                'license_key' => 'TRIAL2024TESTABC',
                'customer_id' => $trialCustomer->id,
                'license_type_id' => $trialType->id,
                'expires_at' => now()->addDays(30),
                'max_devices' => 1,
                'purchase_price' => 0,
                'purchase_currency' => 'IDR'
            ],
            [
                'license_key' => 'TRIAL2024DEMODEF',
                'customer_id' => $trialCustomer->id,
                'license_type_id' => $trialType->id,
                'expires_at' => now()->addDays(30),
                'max_devices' => 1,
                'purchase_price' => 0,
                'purchase_currency' => 'IDR'
            ],
            [
                'license_key' => 'FULL2024SAMPLE123',
                'customer_id' => $demoCustomer->id,
                'license_type_id' => $fullType->id,
                'expires_at' => now()->addYear(),
                'max_devices' => 3,
                'purchase_price' => 750000,
                'purchase_currency' => 'IDR'
            ],
            [
                'license_key' => 'ENT2024BUSINESS456',
                'customer_id' => $businessCustomer->id,
                'license_type_id' => $enterpriseType->id,
                'expires_at' => now()->addYears(3),
                'max_devices' => 10,
                'purchase_price' => 3000000,
                'purchase_currency' => 'IDR'
            ],
            [
                'license_key' => 'LIFE2024PREMIUM789',
                'customer_id' => $businessCustomer->id,
                'license_type_id' => $lifetimeType->id,
                'expires_at' => null, // Lifetime
                'max_devices' => 5,
                'purchase_price' => 2500000,
                'purchase_currency' => 'IDR'
            ]
        ];

        foreach ($sampleLicenses as $licenseData) {
            License::updateOrCreate(
                ['license_key' => $licenseData['license_key']],
                array_merge($licenseData, [
                    'status' => 'active',
                    'issued_at' => now(),
                    'devices_used' => rand(0, $licenseData['max_devices']), // Random usage for demo
                    'order_id' => 'ORDER-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8)),
                    'payment_method' => $licenseData['purchase_price'] > 0 ? 'Credit Card' : null,
                    'admin_notes' => 'Sample license created by seeder'
                ])
            );
        }

        $this->command->info('✅ Sample licenses created successfully with IDR currency!');
        $this->command->info('');
        $this->command->info('📋 Available test licenses:');
        $this->command->info('🔹 Demo (7 days): DEMO12345678ABC, DEMO2024TESTDEMO');
        $this->command->info('🔹 Trial (30 days): TRIAL2024TESTABC, TRIAL2024DEMODEF');
        $this->command->info('🔹 Full (1 year): FULL2024SAMPLE123 - Rp 750.000');
        $this->command->info('🔹 Enterprise (3 years): ENT2024BUSINESS456 - Rp 3.000.000');
        $this->command->info('🔹 Lifetime: LIFE2024PREMIUM789 - Rp 2.500.000');
        $this->command->info('');
        $this->command->info('💡 Use any of these keys in the activation form!');
        $this->command->info('💰 All prices now in Indonesian Rupiah (IDR)');
    }
}