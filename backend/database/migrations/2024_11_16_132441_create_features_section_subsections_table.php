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
        Schema::create('features_section_subsections', function (Blueprint $table) {
            $table->id();
            $table->string('imgurl'); // Path or URL of the subsection image
            $table->string('title'); // Subsection Title
            $table->text('content'); // Subsection Rich Text Content
            $table->unsignedInteger('sortorder')->default(0); // Order of the subsections
            $table->foreignId('item_id')->constrained('items')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('features_section_subsections');
    }
};
