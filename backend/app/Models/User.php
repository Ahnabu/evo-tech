<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\HasUuidCustom;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasUuidCustom;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'user_type',
        'firstname',
        'lastname',
        'email',
        'password',
        'phone',
        'default_shipping_address_id',
        'default_billing_address_id',
        'email_verified_at',
        'last_active_at',
        'reward_points',
        'newsletter_opt_in',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_active_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function addresses()
    {
        return $this->hasMany(Address::class, 'user_id', 'id');
    }

    public function cartItems()
    {
        return $this->hasMany(Cart::class, 'user_uuid', 'uuid');
    }

    public function wishlistItems()
    {
        return $this->hasMany(Wishlist::class, 'user_uuid', 'uuid');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'orderby_user_uuid', 'uuid');
    }

    public function accounts()
    {
        return $this->hasMany(Account::class, 'userId', 'uuid');
    }
}
