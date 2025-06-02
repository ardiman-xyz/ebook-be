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
        Schema::create('license_types', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique(); 
            $table->string('name'); 
            $table->text('description');
            $table->integer('duration_days')->nullable(); // null = lifetime
            $table->integer('max_devices')->default(1);
            $table->decimal('price', 10, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->json('features'); // ["read", "print", "export"]
            $table->json('restrictions')->nullable(); // {"watermark": true, "print_limit": 10}
            $table->boolean('is_trial')->default(false);
            $table->boolean('is_lifetime')->default(false);
            $table->boolean('requires_online_activation')->default(true);
            $table->boolean('allows_offline_usage')->default(true);
            $table->integer('offline_grace_days')->default(7);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->index(['code', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('license_types');
    }
};
