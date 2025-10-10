<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Item;

class FeaturesSectionSubsection extends Model
{
    /** @use HasFactory<\Database\Factories\FeaturesSectionSubsectionFactory> */
    use HasFactory;

    protected $table = 'features_section_subsections';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'imgurl',     // Path or URL for the subsection image
        'title',      // Subsection title
        'content',    // Rich text content of the subsection
        'sortorder',  // Order of subsections in relation to others
        'item_id',    // Foreign key referencing items table
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
