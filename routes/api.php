<?php

use App\Http\Controllers\Api\LicenseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/health', [LicenseController::class, 'health']);

// License API endpoints - public (untuk Electron app)
Route::prefix('license')->group(function () {
    Route::post('/activate', [LicenseController::class, 'activate']);
    Route::post('/verify', [LicenseController::class, 'verify']);
    Route::post('/deactivate', [LicenseController::class, 'deactivate']);
    Route::post('/status', [LicenseController::class, 'status']);
    Route::post('/usage', [LicenseController::class, 'logUsage']);
});

// Admin endpoints - protected (uncomment when adding auth)
Route::prefix('admin')->group(function () {
    Route::post('/license/generate', [LicenseController::class, 'generate']);
    Route::get('/analytics', [LicenseController::class, 'analytics']);
});
