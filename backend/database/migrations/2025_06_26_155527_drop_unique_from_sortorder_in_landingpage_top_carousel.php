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
        Schema::table('landingpage_top_carousel', function (Blueprint $table) {
            $table->dropUnique(['sortorder']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('landingpage_top_carousel', function (Blueprint $table) {
            $table->unique('sortorder');
        });
    }
};
