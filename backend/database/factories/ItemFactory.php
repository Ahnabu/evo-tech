<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'i_name' => $this->faker->unique()->sentence(), // random sentence for the item name
            'i_slug' => $this->faker->unique()->slug(), // random unique slug
            'i_price' => $this->faker->randomFloat(2, 100, 100000), // random price between 100.00 and 100000.00
            'i_prevprice' => $this->faker->randomFloat(2, 100, 100000), // random prevprice between 100.00 and 100000.00
            'i_instock' => $this->faker->boolean(90), // 90% chance of being in stock
            'i_features' => $this->faker->optional(0.85)->sentences(5), // random array of 5 key features (will go into json column)
            'i_colors' => $this->faker->optional(0.35)->randomElements([
                ['name' => 'Black', 'hex' => '#000000'],
                ['name' => 'White', 'hex' => '#FFFFFF'],
                ['name' => 'Red', 'hex' => '#FF0000'],
                ['name' => 'Blue', 'hex' => '#0000FF'],
                ['name' => 'Green', 'hex' => '#00FF00'],
                ['name' => 'Yellow', 'hex' => '#FFFF00'],
            ], 3), // random array of 3 colors
            'i_mainimg' => "path-to-image", // default image path (to be updated by ItemImageFactory)
            'i_category' => $this->faker->randomElement(['3D Printers', 'Materials', 'Parts and Accessories']), // random category
            'i_subcategory' => $this->faker->optional(0.85)->randomElement(['FDM 3D Printers', 'Resin 3D Printers', 'Laser Engravers']), // random subcategory
            'i_brand' => $this->faker->company(), // random brand name
            'i_weight' => $this->faker->randomFloat(2, 250, 20000), // random weight between 0.1 and 200.0
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
