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

        // Get or create license types
        $demoType = LicenseType::firstOrCreate(
            ['code' => 'DEMO'],
            [
                'name' => 'Demo License',
                'description' => '7-day demo license',
                'duration_days' => 7,
                'max_devices' => 1,
                'price' => 0.00,
                'currency' => 'USD',
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
                'price' => 0.00,
                'currency' => 'USD',
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
                'price' => 99.99,
                'currency' => 'USD',
                'features' => ['read', 'print', 'notes', 'bookmark', 'search', 'export', 'offline', 'sync'],
                'restrictions' => [],
                'is_trial' => false,
                'is_lifetime' => false,
                'is_active' => true
            ]
        );

        // Create sample licenses with simple format
        $sampleLicenses = [
            [
                'license_key' => 'DEMO12345678ABC',
                'customer_id' => $demoCustomer->id,
                'license_type_id' => $demoType->id,
                'expires_at' => now()->addDays(7),
            ],
            [
                'license_key' => 'DEMO2024TESTDEMO',
                'customer_id' => $demoCustomer->id,
                'license_type_id' => $demoType->id,
                'expires_at' => now()->addDays(7),
            ],
            [
                'license_key' => 'TRIAL2024TESTABC',
                'customer_id' => $trialCustomer->id,
                'license_type_id' => $trialType->id,
                'expires_at' => now()->addDays(30),
            ],
            [
                'license_key' => 'TRIAL2024DEMODEF',
                'customer_id' => $trialCustomer->id,
                'license_type_id' => $trialType->id,
                'expires_at' => now()->addDays(30),
            ],
            [
                'license_key' => 'FULL2024SAMPLE123',
                'customer_id' => $demoCustomer->id,
                'license_type_id' => $fullType->id,
                'expires_at' => now()->addYear(),
            ]
        ];

        foreach ($sampleLicenses as $licenseData) {
            License::updateOrCreate(
                ['license_key' => $licenseData['license_key']],
                array_merge($licenseData, [
                    'status' => 'active',
                    'issued_at' => now(),
                    'max_devices' => $licenseData['license_key'][0] === 'D' ? 1 : ($licenseData['license_key'][0] === 'T' ? 1 : 3),
                    'devices_used' => 0,
                    'purchase_price' => $licenseData['license_key'][0] === 'F' ? 99.99 : 0.00,
                    'purchase_currency' => 'USD'
                ])
            );
        }

        $this->command->info('✅ Sample licenses created successfully!');
        $this->command->info('');
        $this->command->info('📋 Available test licenses:');
        $this->command->info('🔹 Demo (7 days): DEMO12345678ABC, DEMO2024TESTDEMO');
        $this->command->info('🔹 Trial (30 days): TRIAL2024TESTABC, TRIAL2024DEMODEF');
        $this->command->info('🔹 Full (1 year): FULL2024SAMPLE123');
        $this->command->info('');
        $this->command->info('💡 Use any of these keys in the activation form!');
    }
}