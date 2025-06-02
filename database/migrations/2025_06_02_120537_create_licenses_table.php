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
        Schema::create('licenses', function (Blueprint $table) {
            $table->id();
            $table->string('license_key', 50)->unique(); // FULL-2024-ABCD-1234
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('license_type_id')->constrained('license_types');
            
            // License Status
            $table->enum('status', ['active', 'expired', 'suspended', 'revoked'])->default('active');
            $table->text('status_reason')->nullable(); // Reason for suspension/revocation
            
            // Dates
            $table->timestamp('issued_at')->useCurrent();
            $table->timestamp('activated_at')->nullable();
            $table->timestamp('expires_at')->nullable(); // null = lifetime
            $table->timestamp('last_verified_at')->nullable();
            
            // Usage Limits
            $table->integer('max_devices');
            $table->integer('devices_used')->default(0);
            $table->json('custom_features')->nullable(); // Override default features
            $table->json('custom_restrictions')->nullable(); // Override default restrictions
            
            // Purchase Info
            $table->string('order_id')->nullable();
            $table->decimal('purchase_price', 10, 2)->nullable();
            $table->string('purchase_currency', 3)->default('USD');
            $table->string('payment_method')->nullable();
            
            // Admin Info
            $table->foreignId('created_by')->nullable()->constrained('users'); // Admin who created
            $table->text('admin_notes')->nullable();
            $table->json('metadata')->nullable(); // Additional data
            
            $table->timestamps();
            
            // Indexes
            $table->index(['license_key', 'status']);
            $table->index(['customer_id', 'status']);
            $table->index(['expires_at', 'status']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('licenses');
    }
};
