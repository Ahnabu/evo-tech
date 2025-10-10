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
        Schema::create('features_section_header', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // section header title
            $table->string('imgurl'); // Path or URL for the header image
            $table->unsignedInteger('sortorder')->default(0); // Order of section headers
            $table->foreignId('item_id')->constrained('items')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('features_section_header');
    }
};
