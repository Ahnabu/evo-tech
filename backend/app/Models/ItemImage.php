<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Item;

class ItemImage extends Model
{
    /** @use HasFactory<\Database\Factories\ItemImageFactory> */
    use HasFactory;

    protected $table = 'item_images';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'imgsrc',    // Image path or URL
        'imgtitle',  // Title/description of the image
        'sortorder', // Order of the image in relation to others
        'is_main',   // Whether this image is the main image for the item
        'item_id',   // Foreign key referring to items table
    ];
    
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected function casts(): array
    {
        return [
            'sortorder' => 'integer',
            'is_main' => 'boolean',
        ];
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'id');
    }
}
