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
        Schema::create('specifications_section', function (Blueprint $table) {
            $table->id();
            $table->string('label'); // Specification label (e.g., weight, dimensions)
            $table->string('value'); // Value of the label (e.g., 10 kg, 10x10x10 cm)
            $table->unsignedInteger('sortorder')->default(0); // Display order
            $table->foreignId('item_id')->constrained('items')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('specifications_section');
    }
};
