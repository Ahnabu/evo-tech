<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subcategory extends Model
{

    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'sortorder',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'sortorder' => 'integer',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function brands()
    {
        return $this->belongsToMany(Brand::class, 'subcategory_brand')
            ->withTimestamps()
            ->where('brands.active', true);
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
        return "/{$this->category->slug}/{$this->slug}";
    }
}
