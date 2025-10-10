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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('i_name')->unique(); // Unique item name
            $table->string('i_slug')->unique(); // Unique slug for SEO-friendly URLs
            $table->decimal('i_price', 12, 2); // Current price
            $table->decimal('i_prevprice', 12, 2)->default(0.00); // Previous price defaults to 0
            $table->decimal('i_rating', 3, 1)->default(0.0); // Dynamic: average rating
            $table->unsignedInteger('i_reviews')->default(0); // Dynamic: number of reviews
            $table->boolean('i_instock')->default(true); // Stock status
            $table->json('i_features')->nullable(); // Key features stored in JSON format
            $table->json('i_colors')->nullable(); // Available colors stored in JSON format
            $table->string('i_mainimg'); // Path or URL of the main image
            $table->string('i_category'); // Item category
            $table->string('i_subcategory')->nullable(); // Item subcategory
            $table->string('i_brand'); // Item brand
            $table->decimal('i_weight', 12, 2)->nullable(); // Item weight
            $table->foreignId('landingpage_section_id')->nullable(); // Foreign key to landingpage_sections table
            $table->integer('landingpage_sortorder')->nullable(); // Sort order for landing page sections
            $table->boolean('published')->default(false); // whether the item is visible to the users
            $table->timestamps();
            
            $table->foreign('landingpage_section_id')->references('id')->on('landingpage_sections')->onDelete('set null');

            $table->unique(['landingpage_section_id', 'landingpage_sortorder']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
