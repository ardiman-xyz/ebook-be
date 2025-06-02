<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'service' => 'E-book License API',
        'version' => '1.0.0',
        'status' => 'operational',
        // 'documentation' => url('/api/docs'),
        // 'endpoints' => [
        //     'health' => url('/api/health'),
        //     'activate' => url('/api/license/activate'),
        //     'verify' => url('/api/license/verify'),
        //     'deactivate' => url('/api/license/deactivate'),
        //     'status' => url('/api/license/status'),
        //     'usage' => url('/api/license/usage'),
        // ],
        // 'admin_endpoints' => [
        //     'generate' => url('/api/admin/license/generate'),
        //     'analytics' => url('/api/admin/analytics'),
        // ],
        // 'server_time' => now()->toISOString(),
        // 'timezone' => config('app.timezone'),
        // 'environment' => app()->environment(),
        // 'contact' => [
        //     'support' => 'support@ebook-launcher.com',
        //     'documentation' => 'https://docs.ebook-launcher.com'
        // ]
    ], 200, [], JSON_PRETTY_PRINT);
});