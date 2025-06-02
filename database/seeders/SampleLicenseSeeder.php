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

        // Get license types
        $demoType = LicenseType::where('code', 'DEMO')->first();
        $trialType = LicenseType::where('code', 'TRIAL')->first();
        $fullType = LicenseType::where('code', 'FULL')->first();

        // Create sample licenses
        $sampleLicenses = [
            [
                'license_key' => 'DEMO-1234-5678-9ABC',
                'customer_id' => $demoCustomer->id,
                'license_type_id' => $demoType->id,
                'expires_at' => now()->addDays(30),
            ],
            [
                'license_key' => 'DEMO-2024-TEST-DEMO',
                'customer_id' => $demoCustomer->id,
                'license_type_id' => $demoType->id,
                'expires_at' => now()->addDays(30),
            ],
            [
                'license_key' => 'TRIAL-2024-TEST-ABCD',
                'customer_id' => $trialCustomer->id,
                'license_type_id' => $trialType->id,
                'expires_at' => now()->addDays(7),
            ],
            [
                'license_key' => 'TRIAL-2024-DEMO-EFGH',
                'customer_id' => $trialCustomer->id,
                'license_type_id' => $trialType->id,
                'expires_at' => now()->addDays(7),
            ],
            [
                'license_key' => 'FULL-2024-SAMPLE-1234',
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
                    'max_devices' => 1,
                    'devices_used' => 0
                ])
            );
        }

        $this->command->info('Sample licenses created successfully!');
        $this->command->info('Demo licenses: DEMO-1234-5678-9ABC, DEMO-2024-TEST-DEMO');
        $this->command->info('Trial licenses: TRIAL-2024-TEST-ABCD, TRIAL-2024-DEMO-EFGH');
        $this->command->info('Full license: FULL-2024-SAMPLE-1234');
    }
}