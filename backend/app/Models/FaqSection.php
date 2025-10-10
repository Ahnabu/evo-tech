<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FaqSection extends Model
{
    /** @use HasFactory<\Database\Factories\FaqSectionFactory> */
    use HasFactory;

    protected $table = 'faqs_section';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'question',
        'answer',
        'sortorder',
        'i_category',
        'i_subcategory',
    ];

    protected function casts(): array
    {
        return [
            'sortorder' => 'integer',
        ];
    }

    /**
     * Scope to filter FAQs by category.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $category
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('i_category', $category);
    }
}
