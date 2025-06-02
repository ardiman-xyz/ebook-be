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
        Schema::create('license_usage_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('license_id')->constrained('licenses')->onDelete('cascade');
            $table->foreignId('activation_id')->constrained('license_activations')->onDelete('cascade');
            
            // Session Information
            $table->string('session_id');
            $table->timestamp('session_start');
            $table->timestamp('session_end')->nullable();
            $table->integer('session_duration')->nullable(); // in seconds
            
            // Usage Details
            $table->string('action'); // app_start, app_close, feature_used, page_view
            $table->string('feature_used')->nullable(); // read, print, export, etc
            $table->json('action_data')->nullable(); // Additional action details
            
            // Content Usage
            $table->integer('pages_viewed')->default(0);
            $table->integer('pages_printed')->default(0);
            $table->integer('pages_exported')->default(0);
            $table->integer('search_queries')->default(0);
            $table->integer('bookmarks_created')->default(0);
            $table->integer('notes_created')->default(0);
            
            // Technical Details
            $table->string('app_version')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->json('system_info')->nullable();
            
            // Performance & Errors
            $table->integer('load_time_ms')->nullable(); // App load time
            $table->json('errors')->nullable(); // Any errors during session
            $table->boolean('crashed')->default(false);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['license_id', 'session_start']);
            $table->index(['activation_id', 'action']);
            $table->index('session_start');
            $table->index('action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('license_usage_logs');
    }
};
