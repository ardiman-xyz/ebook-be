<?php
// app/Http/Controllers/LicenseTypeController.php

namespace App\Http\Controllers;

use App\Http\Requests\LicenseTypeRequest;
use App\Models\LicenseType;
use App\Services\LicenseTypeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class LicenseTypeController extends Controller
{
    public function __construct(
        private LicenseTypeService $licenseTypeService
    ) {}

    /**
     * Display license types page
     */
    public function index(): Response
    {
        try {
            $licenseTypes = $this->licenseTypeService->getAllLicenseTypes();
            $stats = $this->licenseTypeService->getStats();

            return Inertia::render('LicenseTypes/Index', [
                'licenseTypes' => $licenseTypes,
                'stats' => $stats,
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error')
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to load license types page', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return Inertia::render('LicenseTypes/Index', [
                'licenseTypes' => [],
                'stats' => [
                    'total_types' => 0,
                    'active_types' => 0,
                    'with_discount' => 0,
                    'avg_price' => 0,
                    'total_savings' => 0
                ],
                'flash' => [
                    'error' => 'Gagal memuat data tipe lisensi'
                ]
            ]);
        }
    }

    /**
     * Store a new license type
     */
    public function store(Request $request): JsonResponse
    {
        // try {
            // Manual validation untuk sekarang (bisa dibuat LicenseTypeRequest nanti)
            $validated = $request->validate([
                'name' => 'required|string|min:3|max:100|unique:license_types,name',
                'original_price' => 'required|numeric|min:0',
                'has_discount' => 'required|boolean',
                'discount_percentage' => 'required_if:has_discount,true|numeric|min:0|max:100',
                'duration' => 'required|string|max:50',
                'max_devices' => 'required|integer|min:1|max:1000',
                'type' => 'required|in:Trial,Standard,Lifetime,Enterprise',
                'description' => 'nullable|string|max:500',
                'features' => 'nullable|array',
                'restrictions' => 'nullable|array',
            ], [
                // Custom error messages dalam bahasa Indonesia
                'name.required' => 'Nama tipe lisensi wajib diisi',
                'name.unique' => 'Nama tipe lisensi sudah digunakan',
                'original_price.required' => 'Harga asli wajib diisi',
                'original_price.numeric' => 'Harga asli harus berupa angka',
                'original_price.min' => 'Harga asli tidak boleh negatif',
                'has_discount.required' => 'Status diskon wajib ditentukan',
                'discount_percentage.required_if' => 'Persentase diskon wajib diisi jika diskon diaktifkan',
                'discount_percentage.max' => 'Persentase diskon tidak boleh lebih dari 100%',
                'duration.required' => 'Durasi wajib diisi',
                'max_devices.required' => 'Jumlah maksimal perangkat wajib diisi',
                'max_devices.min' => 'Minimal 1 perangkat',
                'max_devices.max' => 'Maksimal 1000 perangkat',
                'type.required' => 'Jenis tipe lisensi wajib dipilih',
                'type.in' => 'Jenis tipe lisensi tidak valid',
            ]);

            // Tambahkan created_by
            $validated['created_by'] = Auth::id();

            // Generate code otomatis jika tidak ada
            if (!isset($validated['code'])) {
                $validated['code'] = $this->generateCodeFromName($validated['name']);
            }

            $licenseType = $this->licenseTypeService->createLicenseType($validated);

         

            // Format response data
            $responseData = [
                'id' => $licenseType->id,
                'code' => $licenseType->code,
                'name' => $licenseType->name,
                'description' => $licenseType->description,
                'price' => $licenseType->price,
                'original_price' => $licenseType->original_price,
                'has_discount' => $licenseType->has_discount,
                'discount_percentage' => $licenseType->discount_percentage,
                'duration' => $licenseType->duration,
                'max_devices' => $licenseType->max_devices,
                'type' => $licenseType->type,
                'is_active' => $licenseType->is_active,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Tipe lisensi berhasil dibuat',
                'data' => $responseData,
                'timestamp' => now()->toISOString()
            ], 201);

    }

    /**
     * Update license type
     */
    public function update(Request $request, LicenseType $licenseType): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|min:3|max:100|unique:license_types,name,' . $licenseType->id,
                'original_price' => 'required|numeric|min:0',
                'has_discount' => 'required|boolean',
                'discount_percentage' => 'required_if:has_discount,true|numeric|min:0|max:100',
                'duration' => 'required|string|max:50',
                'max_devices' => 'required|integer|min:1|max:1000',
                'type' => 'required|in:Trial,Standard,Lifetime,Enterprise',
                'description' => 'nullable|string|max:500',
                'features' => 'nullable|array',
                'restrictions' => 'nullable|array',
            ], [
                'name.required' => 'Nama tipe lisensi wajib diisi',
                'name.unique' => 'Nama tipe lisensi sudah digunakan',
                'original_price.required' => 'Harga asli wajib diisi',
                'original_price.numeric' => 'Harga asli harus berupa angka',
                'original_price.min' => 'Harga asli tidak boleh negatif',
                'has_discount.required' => 'Status diskon wajib ditentukan',
                'discount_percentage.required_if' => 'Persentase diskon wajib diisi jika diskon diaktifkan',
                'discount_percentage.max' => 'Persentase diskon tidak boleh lebih dari 100%',
                'duration.required' => 'Durasi wajib diisi',
                'max_devices.required' => 'Jumlah maksimal perangkat wajib diisi',
                'max_devices.min' => 'Minimal 1 perangkat',
                'max_devices.max' => 'Maksimal 1000 perangkat',
                'type.required' => 'Jenis tipe lisensi wajib dipilih',
                'type.in' => 'Jenis tipe lisensi tidak valid',
            ]);

            // Tambahkan updated_by
            $validated['updated_by'] = Auth::id();

            $updatedLicenseType = $this->licenseTypeService->updateLicenseType($licenseType, $validated);

            Log::info('License type updated successfully via API', [
                'license_type_id' => $licenseType->id,
                'code' => $licenseType->code,
                'name' => $licenseType->name,
                'updated_by' => Auth::id()
            ]);

            // Format response data
            $responseData = [
                'id' => $updatedLicenseType->id,
                'code' => $updatedLicenseType->code,
                'name' => $updatedLicenseType->name,
                'description' => $updatedLicenseType->description,
                'price' => $updatedLicenseType->price,
                'original_price' => $updatedLicenseType->original_price,
                'has_discount' => $updatedLicenseType->has_discount,
                'discount_percentage' => $updatedLicenseType->discount_percentage,
                'duration' => $updatedLicenseType->duration,
                'max_devices' => $updatedLicenseType->max_devices,
                'type' => $updatedLicenseType->type,
                'is_active' => $updatedLicenseType->is_active,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Tipe lisensi berhasil diperbarui',
                'data' => $responseData,
                'timestamp' => now()->toISOString()
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid',
                'errors' => $e->errors(),
                'timestamp' => now()->toISOString()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Failed to update license type', [
                'license_type_id' => $licenseType->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui tipe lisensi. Silakan coba lagi.',
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    /**
     * Delete license type
     */
    public function destroy(LicenseType $licenseType): JsonResponse
    {
        try {
            // Cek apakah license type sedang digunakan
            if ($this->licenseTypeService->isLicenseTypeInUse($licenseType)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak dapat menghapus tipe lisensi yang sedang digunakan oleh lisensi aktif',
                    'timestamp' => now()->toISOString()
                ], 400);
            }

            $this->licenseTypeService->deleteLicenseType($licenseType);

            Log::info('License type deleted successfully via API', [
                'license_type_id' => $licenseType->id,
                'code' => $licenseType->code,
                'name' => $licenseType->name,
                'deleted_by' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tipe lisensi berhasil dihapus',
                'timestamp' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to delete license type', [
                'license_type_id' => $licenseType->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus tipe lisensi. Silakan coba lagi.',
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    /**
     * Toggle license type status (active/inactive)
     */
    public function toggleStatus(LicenseType $licenseType): JsonResponse
    {
        try {
            $newStatus = !$licenseType->is_active;
            $updatedLicenseType = $this->licenseTypeService->toggleStatus($licenseType, $newStatus);

            $statusText = $newStatus ? 'diaktifkan' : 'dinonaktifkan';

            Log::info('License type status toggled via API', [
                'license_type_id' => $licenseType->id,
                'old_status' => !$newStatus,
                'new_status' => $newStatus,
                'updated_by' => Auth::id()
            ]);

            // Format response data
            $responseData = [
                'id' => $updatedLicenseType->id,
                'code' => $updatedLicenseType->code,
                'name' => $updatedLicenseType->name,
                'is_active' => $updatedLicenseType->is_active,
            ];

            return response()->json([
                'success' => true,
                'message' => "Tipe lisensi berhasil {$statusText}",
                'data' => $responseData,
                'timestamp' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to toggle license type status', [
                'license_type_id' => $licenseType->id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah status tipe lisensi',
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    /**
     * API endpoint untuk AJAX calls
     */
    public function apiIndex(Request $request): JsonResponse
    {
        try {
            $activeOnly = $request->boolean('active_only', false);
            $licenseTypes = $this->licenseTypeService->getAllLicenseTypes($activeOnly);

            return response()->json([
                'success' => true,
                'data' => $licenseTypes,
                'meta' => [
                    'total' => count($licenseTypes),
                    'active_only' => $activeOnly
                ],
                'timestamp' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch license types via API', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data tipe lisensi',
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    /**
     * Get license types untuk dropdown/select options
     */
    public function getDropdownData(): JsonResponse
    {
        try {
            $licenseTypes = $this->licenseTypeService->getFormattedLicenseTypes();

            return response()->json([
                'success' => true,
                'data' => $licenseTypes,
                'timestamp' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch license types dropdown data', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data dropdown',
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    /**
     * Get statistics untuk dashboard
     */
    public function getStats(): JsonResponse
    {
        try {
            $stats = $this->licenseTypeService->getStats();

            return response()->json([
                'success' => true,
                'data' => $stats,
                'timestamp' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch license types stats', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik',
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    // ========== HELPER METHODS ==========

    /**
     * Generate code dari name
     */
    private function generateCodeFromName(string $name): string
    {
        // Ambil huruf pertama dari setiap kata, maksimal 8 karakter
        $words = explode(' ', $name);
        $code = '';
        
        foreach ($words as $word) {
            if (strlen($code) < 8) {
                $code .= strtoupper(substr($word, 0, 2));
            }
        }
        
        // Jika masih kurang dari 3 karakter, ambil dari nama lengkap
        if (strlen($code) < 3) {
            $code = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $name), 0, 8));
        }
        
        // Pastikan unique
        $originalCode = $code;
        $counter = 1;
        
        while (LicenseType::where('code', $code)->exists()) {
            $code = $originalCode . $counter;
            $counter++;
        }
        
        return $code;
    }
}