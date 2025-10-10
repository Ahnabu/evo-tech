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
        Schema::create('landingpage_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_title')->unique(); // no two sections with the same title
            $table->string('view_more_url')->nullable(); // null if not enough items
            $table->integer('sortorder'); // order of sections on landing page
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landingpage_sections');
    }
};
