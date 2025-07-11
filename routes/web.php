<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\LicenseTypeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::prefix('downloads')->name('downloads.')->group(function () {
    Route::get('/', [DownloadController::class, 'index'])->name('index');
    Route::get('/{platform}/{file}', [DownloadController::class, 'download'])->name('file');
    Route::get('/api/info', [DownloadController::class, 'api'])->name('api');
});


Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/generate-license', [DashboardController::class, 'generateLicense'])->name('dashboard.generate-license');
    
    // License management routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::post('/licenses/generate', [DashboardController::class, 'generateLicense'])->name('licenses.generate');
        Route::get('/license-types', [DashboardController::class, 'getLicenseTypes'])->name('license-types.index');
        Route::put('/licenses/{license}', [DashboardController::class, 'updateLicense'])->name('update');

        Route::delete('/licenses/{license}', [DashboardController::class, 'deleteLicense'])->name('licenses.delete');
        Route::post('/licenses/{license}/suspend', [DashboardController::class, 'suspend'])->name('suspend');
        Route::post('/licenses/{license}/revoke', [DashboardController::class, 'revoke'])->name('revoke');
        Route::post('/licenses/{license}/reactivate', [DashboardController::class, 'reactivate'])->name('reactivate');

        Route::get('/', [LicenseTypeController::class, 'index'])->name('type.index');
        
        // API routes (untuk AJAX)
        Route::post('/', [LicenseTypeController::class, 'store'])->name('type.store');
        Route::put('/{licenseType}', [LicenseTypeController::class, 'update'])->name('type.update'); 
        Route::delete('/{licenseType}', [LicenseTypeController::class, 'destroy'])->name('type.destroy');
        Route::patch('/{licenseType}/toggle-status', [LicenseTypeController::class, 'toggleStatus'])->name('type.toggle-status');

        
    });

    Route::get('/documentation', function () {
        return Inertia::render('Documentation');
    })->name('documentation');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
