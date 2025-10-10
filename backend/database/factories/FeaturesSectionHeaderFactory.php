<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FeaturesSectionHeader>
 */
class FeaturesSectionHeaderFactory extends Factory
{

    /**
     * some random image sources
     *
     * @var array<int, string>
     */
    protected $imagesrcs = [
        "https://us.elegoo.com/cdn/shop/files/Special-PLA-Slideshow_-_PC_1280x650_crop_center.jpg?v=1710304799",
        "https://us.elegoo.com/cdn/shop/files/PLA_MATTE-Slideshow_-_PC_1280x650_crop_center.jpg?v=1710304799"
    ];


    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'imgurl' => $this->faker->randomElement($this->imagesrcs),
        ];
    }
}
