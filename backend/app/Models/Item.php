<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\ItemImage;

class Item extends Model
{
    /** @use HasFactory<\Database\Factories\ItemFactory> */
    use HasFactory;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'i_name',
        'i_slug',
        'i_price',
        'i_prevprice',
        'i_instock',
        'i_features',
        'i_colors',
        'i_mainimg',
        'i_category',
        'i_subcategory',
        'i_brand',
        'i_weight',
        'landingpage_section_id',
        'landingpage_sortorder',
        'published',
    ];


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'i_instock' => 'boolean',
            'i_features' => 'array',
            'i_colors' => 'array',
            'i_price' => 'float',
            'i_prevprice' => 'float',
            'i_rating' => 'float',
            'i_reviews' => 'integer',
            'i_weight' => 'float',
            'landingpage_section_id' => 'integer',
            'landingpage_sortorder' => 'integer',
            'published' => 'boolean',
        ];
    }

    
    public function landingpageSection()
    {
        return $this->belongsTo(LandingpageSection::class, 'landingpage_section_id', 'id');
    }

    public function itemImages()
    {
        return $this->hasMany(ItemImage::class, 'item_id', 'id')->orderBy('sortorder', 'asc');
    }

    public function featuresHeader()
    {
        return $this->hasMany(FeaturesSectionHeader::class, 'item_id', 'id')->orderBy('sortorder', 'asc');
    }

    public function featuresSubsections()
    {
        return $this->hasMany(FeaturesSectionSubsection::class, 'item_id', 'id')->orderBy('sortorder', 'asc');
    }

    public function specifications()
    {
        return $this->hasMany(SpecificationsSection::class, 'item_id', 'id')->orderBy('sortorder', 'asc');
    }

    public function reviews()
    {
        return $this->hasMany(ReviewsSection::class, 'item_id', 'id');
    }

    public function cart()
    {
        return $this->hasMany(Cart::class, 'item_id', 'id');
    }

    public function wishlist()
    {
        return $this->hasMany(Wishlist::class, 'item_id', 'id');
    }

    public function orders()
    {
        return $this->hasMany(OrderItem::class, 'item_id', 'id');
    }

    public static function getNextLandingpageSortorder($sectionId)
    {
        if (is_null($sectionId)) {
            return null;
        }
        $maxSortOrder = self::where('landingpage_section_id', $sectionId)->max('landingpage_sortorder');
        return $maxSortOrder ? $maxSortOrder + 1 : 1;
    }

    public function setMainImageFromExisting(ItemImage $itemImage)
    {
        // transaction to ensure atomic updates
        DB::transaction(function () use ($itemImage) {

            ItemImage::where('item_id', $this->id)
                ->update(['is_main' => false, 'sortorder' => DB::raw('sortorder + 2000')]); // increase sortorder for all images

            $itemImage->update(['is_main' => true, 'sortorder' => 1]); // Set the selected image as main

            $this->update(['i_mainimg' => $itemImage->imgsrc]); // Update the main image URL in the items table

            $this->reorderImages(); // to ensure the other images are sorted correctly
        });
    }

    public function makeSpaceForNewMainImage()
    {
        // transaction to ensure atomic updates
        DB::transaction(function () {

            ItemImage::where('item_id', $this->id)
                ->update(['is_main' => false, 'sortorder' => DB::raw('sortorder + 2000')]); // increase sortorder for all images

            $this->reorderImages(); // to ensure the other images are sorted correctly
        });
    }

    public function reorderImages()
    {
        // Ensure the other images are sorted correctly (adjust sortorder to be unique)
        ItemImage::where('item_id', $this->id)
            ->where('is_main', false) // Exclude the main image
            ->orderBy('sortorder')  // using the existing sortorder
            ->get()
            ->each(function ($image, $index) {
                $image->update(['sortorder' => $index + 2]); // Start from 2 to leave space for main image
            });
    }
}
