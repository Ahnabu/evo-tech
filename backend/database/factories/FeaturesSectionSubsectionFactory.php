<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FeaturesSectionSubsection>
 */
class FeaturesSectionSubsectionFactory extends Factory
{

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
            'imgurl' => $this->faker->randomElement($this->imagesrcs),
            'title' => $this->faker->sentence(),
            'content' => $this->faker->paragraphs(3, true),
        ];
    }
}
