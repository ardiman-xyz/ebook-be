<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('license_types', function (Blueprint $table) {
            // Tambah field untuk discount system
            $table->decimal('original_price', 12, 2)->default(0)->after('price');
            $table->boolean('has_discount')->default(false)->after('original_price');
            $table->decimal('discount_percentage', 5, 2)->default(0)->after('has_discount');
            
            // Tambah field type untuk klasifikasi
            $table->enum('type', ['Trial', 'Standard', 'Lifetime', 'Enterprise'])->default('Standard')->after('max_devices');
            
            // Tambah field duration string yang lebih fleksibel
            $table->string('duration', 50)->nullable()->after('description');
            
            // Audit fields
            $table->unsignedBigInteger('created_by')->nullable()->after('sort_order');
            $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('license_types', function (Blueprint $table) {
            $table->dropColumn([
                'original_price',
                'has_discount', 
                'discount_percentage',
                'type',
                'duration',
                'created_by',
                'updated_by'
            ]);
        });
    }
};