<?php

namespace Database\Factories;

use App\Models\ItemImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ItemImage>
 */
class ItemImageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ItemImage::class;


    /**
     * some random image sources
     *
     * @var array<int, string>
     */
    protected $imagesrcs = [
        "https://us.elegoo.com/cdn/shop/files/mars-5-ultra-resin-3d-printer_1_610x610_crop_center.jpg?v=1718953149",
        "https://us.elegoo.com/cdn/shop/files/mars-5-ultra-resin-3d-printer_2_610x610_crop_center.jpg?v=1718953149",
        "https://us.elegoo.com/cdn/shop/files/mars-5-ultra-resin-3d-printer_3_610x610_crop_center.jpg?v=1718953149",
        "https://us.elegoo.com/cdn/shop/files/mars-5-ultra-resin-3d-printer_4_610x610_crop_center.jpg?v=1718953149",
        "https://us.elegoo.com/cdn/shop/files/mars-5-ultra-resin-3d-printer_7_610x610_crop_center.jpg?v=1718953149"
    ]; 
    
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'imgsrc' => $this->faker->randomElement($this->imagesrcs),
            'imgtitle' => $this->faker->sentence(),
        ];
    }


    public function configure()
    {
        return $this->afterCreating(function (ItemImage $itemimage) {
            // Update the item's main image if this image is marked as main in item_images table
            if ($itemimage->is_main) {
                $itemimage->item->i_mainimg = $itemimage->imgsrc;
                $itemimage->item->save();
            }
        });
    }
    
}
