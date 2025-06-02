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
        Schema::create('license_activations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('license_id')->constrained('licenses')->onDelete('cascade');
            
            // Device Information
            $table->string('device_id', 255); // SHA256 hash of device fingerprint
            $table->string('device_name')->nullable(); // "Windows - MyComputer"
            $table->string('device_platform')->nullable(); // win32, darwin, linux
            $table->string('device_arch')->nullable(); // x64, arm64
            $table->string('hostname')->nullable();
            $table->string('username')->nullable();
            $table->json('device_details')->nullable(); // Full device info
            
            // Activation Status
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->timestamp('activated_at')->useCurrent();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('deactivated_at')->nullable();
            $table->text('deactivation_reason')->nullable();
            
            // App Information
            $table->string('app_version')->nullable();
            $table->string('app_build')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            
            // Security & Tracking
            $table->integer('usage_count')->default(0); // How many times opened
            $table->timestamp('first_seen_at')->nullable();
            $table->json('location_data')->nullable(); // Country, city if available
            $table->boolean('is_suspicious')->default(false);
            $table->text('suspicious_reason')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['license_id', 'status']);
            $table->index(['device_id', 'status']);
            $table->index('last_used_at');
            $table->unique(['license_id', 'device_id']); // One activation per device per license
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('license_activations');
    }
};
