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
        Schema::table('reviews_section', function (Blueprint $table) {
            $table->unique(['item_id', 'reviewer_email'], 'reviewer_email_unique_per_item');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews_section', function (Blueprint $table) {
            $table->dropUnique('reviewer_email_unique_per_item');
        });
    }
};
