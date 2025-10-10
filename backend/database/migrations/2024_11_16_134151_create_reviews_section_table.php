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
        Schema::create('reviews_section', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('rating'); // Rating out of 5
            $table->string('reviewer'); // Reviewer name
            $table->string('reviewer_email'); // Reviewer email
            $table->text('review_content'); // Review content
            $table->foreignId('item_id')->constrained('items')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews_section');
    }
};
