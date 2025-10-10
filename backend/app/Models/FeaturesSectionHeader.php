<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Item;

class FeaturesSectionHeader extends Model
{
    /** @use HasFactory<\Database\Factories\FeaturesSectionHeaderFactory> */
    use HasFactory;

    protected $table = 'features_section_header';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',     // Features - section header item title
        'imgurl',    // Path or URL for the header item image
        'sortorder', // Order of features section header item in relation to other items
        'item_id',   // Foreign key referencing items table
    ];

    protected function casts(): array
    {
        return [
            'sortorder' => 'integer',
        ];
    }


    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'id');
    }

}
