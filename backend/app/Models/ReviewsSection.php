<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewsSection extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewsSectionFactory> */
    use HasFactory;

    protected $table = 'reviews_section';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'rating',          // Rating value (e.g., 4 out of 5)
        'reviewer',        // Name of the reviewer
        'reviewer_email',  // Email of the reviewer
        'review_content',  // Detailed content of the review
        'item_id',         // Foreign key referencing the items table
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'id');
    }

    public function reviewImages()
    {
        return $this->hasMany(ReviewImage::class, 'review_id', 'id')->orderBy('sortorder_user', 'asc');
    }
}
