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
        Schema::table('item_images', function (Blueprint $table) {
            $table->unique(['item_id', 'sortorder']);
        });
        Schema::table('features_section_header', function (Blueprint $table) {
            $table->unique(['item_id', 'sortorder']);
        });
        Schema::table('features_section_subsections', function (Blueprint $table) {
            $table->unique(['item_id', 'sortorder']);
        });
        Schema::table('specifications_section', function (Blueprint $table) {
            $table->unique(['item_id', 'sortorder']);
        });
        Schema::table('review_images', function (Blueprint $table) {
            $table->unique(['review_id', 'sortorder_user']);
        });
        Schema::table('faqs_section', function (Blueprint $table) {
            $table->unique(['i_category', 'sortorder']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item_images', function (Blueprint $table) {
            $table->dropUnique(['item_id', 'sortorder']);
        });
        Schema::table('features_section_header', function (Blueprint $table) {
            $table->dropUnique(['item_id', 'sortorder']);
        });
        Schema::table('features_section_subsections', function (Blueprint $table) {
            $table->dropUnique(['item_id', 'sortorder']);
        });
        Schema::table('specifications_section', function (Blueprint $table) {
            $table->dropUnique(['item_id', 'sortorder']);
        });
        Schema::table('review_images', function (Blueprint $table) {
            $table->dropUnique(['review_id', 'sortorder_user']);
        });
        Schema::table('faqs_section', function (Blueprint $table) {
            $table->dropUnique(['i_category', 'sortorder']);
        });
    }
};
