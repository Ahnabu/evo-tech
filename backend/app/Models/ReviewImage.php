<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewImage extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewImageFactory> */
    use HasFactory;

    protected $table = 'review_images';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'imgurl',
        'sortorder_user',
        'review_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'sortorder_user' => 'integer',
    ];
    

    public function review()
    {
        return $this->belongsTo(ReviewsSection::class, 'review_id', 'id');
    }
}
