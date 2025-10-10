<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuidOrder;

class Order extends Model
{
    use HasUuidOrder;

    //
    protected $table = 'orders';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'phone',
        'email',
        'housestreet',
        'city',
        'subdistrict',
        'postcode',
        'country',
        'shipping_type',
        'pickup_point_id',
        'payment_method',
        'transaction_id',
        'terms',
        'subtotal',
        'discount',
        'delivery_charge',
        'additional_charge',
        'total_payable',
        'order_status',
        'payment_status',
        'notes',
        'tracking_code',
        'viewed',
        'unpaid_notified',
        'orderby_user_uuid',
        'delivered_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subtotal' => 'float',
            'discount' => 'float',
            'delivery_charge' => 'float',
            'additional_charge' => 'float',
            'total_payable' => 'float',
            'delivered_at' => 'datetime',
            'pickup_point_id' => 'integer',
            'viewed' => 'boolean',
            'unpaid_notified' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'orderby_user_uuid', 'uuid');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'id');
    }
}
