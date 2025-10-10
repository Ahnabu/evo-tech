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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('order_key')->unique(); // order key for showing details
            $table->string('firstname');
            $table->string('lastname')->nullable(); // Optional
            $table->string('phone');
            $table->string('email')->nullable(); // Optional
            $table->string('housestreet');
            $table->string('city');
            $table->string('subdistrict');
            $table->string('postcode')->nullable(); // Optional
            $table->string('country');
            $table->string('shipping_type');
            $table->string('pickup_point_id')->nullable(); // null if shipping_type is not pickup_point
            $table->string('payment_method');
            $table->string('transaction_id')->nullable(); // null if payment_method like 'cod' is selected
            $table->string('terms'); // accepted, not..., etc.
            $table->decimal('subtotal', 12, 2);
            $table->decimal('discount', 10, 2);
            $table->decimal('delivery_charge', 10, 2);
            $table->decimal('total_payable', 14, 2);
            $table->string('order_status')->default('placed');
            $table->string('payment_status');
            $table->string('tracking_code')->nullable(); // value only for active & null for cancelled/delivered orders
            $table->boolean('viewed')->default(false);
            $table->boolean('unpaid_notified')->default(false);
            $table->text('notes')->nullable(); // Optional
            $table->uuid('orderby_user_uuid')->nullable();
            $table->timestamp('delivered_at')->nullable(); // null if not delivered
            $table->timestamps();

            $table->foreign('orderby_user_uuid')->references('uuid')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
