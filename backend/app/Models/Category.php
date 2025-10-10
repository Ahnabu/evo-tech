<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{

    protected $fillable = [
        'name',
        'slug',
        'sortorder',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'sortorder' => 'integer',
    ];

    // Relationships
    public function subcategories()
    {
        return $this->hasMany(Subcategory::class)
            ->where('active', true)
            ->orderBy('sortorder');
    }

    public function brands()
    {
        return $this->belongsToMany(Brand::class, 'category_brand')
            ->withTimestamps()
            ->where('brands.active', true);
    }

    // Get all brands (direct + from subcategories)
    public function allBrands()
    {
        $directBrands = $this->brands()->get();
        $subcategoryBrands = $this->subcategories()
            ->with('brands')
            ->get()
            ->pluck('brands')
            ->flatten()
            ->unique('id');

        return $directBrands->merge($subcategoryBrands)->unique('id')->sortBy('name');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sortorder');
    }

    // URL Generation using custom accessor (e.g. modelinstance->url, naming conventions)
    public function getUrlAttribute()
    {
        return "/{$this->slug}";
    }

    public function reorderAllCategories()
    {
        Category::ordered()
            ->get()
            ->each(function ($category, $index) {
                $category->update(['sortorder' => $index + 1]);
            });
    }
}
