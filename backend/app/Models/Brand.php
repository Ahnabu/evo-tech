<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{

    protected $fillable = [
        'name',
        'slug',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    // Relationships
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_brand')
            ->withPivot('sortorder')
            ->withTimestamps()
            ->where('categories.active', true)
            ->orderBy('categories.sortorder');
    }

    public function subcategories()
    {
        return $this->belongsToMany(Subcategory::class, 'subcategory_brand')
            ->withPivot('sortorder')
            ->withTimestamps()
            ->where('subcategories.active', true)
            ->orderBy('subcategories.sortorder');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    // URL Generation for brand within specific category/subcategory context
    public function getUrlForContext($category, $subcategory = null)
    {
        if ($subcategory) {
            return "/{$category->slug}/{$subcategory->slug}/{$this->slug}";
        }
        return "/{$category->slug}/{$this->slug}";
    }
}
