<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrustedBy>
 */
class TrustedByFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'brand_name' => $this->faker->company(),
            'brand_logo' => $this->faker->imageUrl(200, 200, 'brands', true),
            'brand_url' => $this->faker->optional(0.7)->url(),
            'sortorder' => $this->faker->unique()->numberBetween(1, 100),
        ];
    }
}
