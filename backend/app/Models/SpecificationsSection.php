<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Item;

class SpecificationsSection extends Model
{
    /** @use HasFactory<\Database\Factories\SpecificationsSectionFactory> */
    use HasFactory;

    protected $table = 'specifications_section';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'label',      // specification label (e.g., weight, dimensions)
        'value',      // specification value (e.g., 10 kg, 10x10x10 cm)
        'sortorder',  // order of the specifications
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
