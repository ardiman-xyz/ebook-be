<?php
// database/seeders/LicenseTypeSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LicenseType;

class LicenseTypeSeeder extends Seeder
{
    public function run(): void
    {
        $licenseTypes = [
            [
                'code' => 'DEMO',
                'name' => 'Demo License',
                'description' => '30-day demo with limited features and watermark',
                'duration_days' => 30,
                'max_devices' => 1,
                'price' => 0.00,
                'currency' => 'USD',
                'features' => ['read', 'basic_navigation'],
                'restrictions' => [
                    'watermark' => true,
                    'print_limit' => 0,
                    'export_limit' => 0,
                    'session_time_limit' => 60
                ],
                'is_trial' => true,
                'is_lifetime' => false,
                'requires_online_activation' => false,
                'allows_offline_usage' => true,
                'offline_grace_days' => 30,
                'is_active' => true,
                'sort_order' => 1
            ],
            [
                'code' => 'TRIAL',
                'name' => 'Trial License',
                'description' => '7-day full-featured trial',
                'duration_days' => 7,
                'max_devices' => 1,
                'price' => 0.00,
                'currency' => 'USD',
                'features' => ['read', 'print', 'notes', 'bookmark', 'search'],
                'restrictions' => [
                    'watermark' => false,
                    'print_limit' => 10,
                    'export_limit' => 5,
                    'session_time_limit' => null
                ],
                'is_trial' => true,
                'is_lifetime' => false,
                'requires_online_activation' => false,
                'allows_offline_usage' => true,
                'offline_grace_days' => 7,
                'is_active' => true,
                'sort_order' => 2
            ],
            [
                'code' => 'FULL',
                'name' => 'Full License',
                'description' => '1-year full license for single device',
                'duration_days' => 365,
                'max_devices' => 1,
                'price' => 49.99,
                'currency' => 'USD',
                'features' => ['read', 'print', 'export', 'notes', 'bookmark', 'search', 'highlight'],
                'restrictions' => [
                    'watermark' => false,
                    'print_limit' => null,
                    'export_limit' => null,
                    'session_time_limit' => null
                ],
                'is_trial' => false,
                'is_lifetime' => false,
                'requires_online_activation' => true,
                'allows_offline_usage' => true,
                'offline_grace_days' => 30,
                'is_active' => true,
                'sort_order' => 3
            ],
            [
                'code' => 'ENT',
                'name' => 'Enterprise License',
                'description' => '3-year enterprise license for up to 5 devices',
                'duration_days' => 1095, // 3 years
                'max_devices' => 5,
                'price' => 199.99,
                'currency' => 'USD',
                'features' => ['read', 'print', 'export', 'notes', 'bookmark', 'search', 'highlight', 'admin_panel'],
                'restrictions' => [
                    'watermark' => false,
                    'print_limit' => null,
                    'export_limit' => null,
                    'session_time_limit' => null
                ],
                'is_trial' => false,
                'is_lifetime' => false,
                'requires_online_activation' => true,
                'allows_offline_usage' => true,
                'offline_grace_days' => 90,
                'is_active' => true,
                'sort_order' => 4
            ],
            [
                'code' => 'EDU',
                'name' => 'Education License',
                'description' => '1-year education license for students',
                'duration_days' => 365,
                'max_devices' => 2,
                'price' => 19.99,
                'currency' => 'USD',
                'features' => ['read', 'print', 'notes', 'bookmark', 'search', 'highlight'],
                'restrictions' => [
                    'watermark' => true,
                    'print_limit' => 50,
                    'export_limit' => 20,
                    'session_time_limit' => null
                ],
                'is_trial' => false,
                'is_lifetime' => false,
                'requires_online_activation' => true,
                'allows_offline_usage' => true,
                'offline_grace_days' => 14,
                'is_active' => true,
                'sort_order' => 5
            ],
            [
                'code' => 'LIFE',
                'name' => 'Lifetime License',
                'description' => 'Lifetime license with premium features',
                'duration_days' => null, // Lifetime
                'max_devices' => 3,
                'price' => 149.99,
                'currency' => 'USD',
                'features' => ['read', 'print', 'export', 'notes', 'bookmark', 'search', 'highlight', 'premium_support'],
                'restrictions' => [
                    'watermark' => false,
                    'print_limit' => null,
                    'export_limit' => null,
                    'session_time_limit' => null
                ],
                'is_trial' => false,
                'is_lifetime' => true,
                'requires_online_activation' => true,
                'allows_offline_usage' => true,
                'offline_grace_days' => 365,
                'is_active' => true,
                'sort_order' => 6
            ]
        ];

        foreach ($licenseTypes as $type) {
            LicenseType::updateOrCreate(
                ['code' => $type['code']], 
                $type
            );
        }

        $this->command->info('License types seeded successfully!');
        $this->command->info('Created license types: DEMO, TRIAL, FULL, ENT, EDU, LIFE');
    }
}