<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LandingpageSection>
 */
class LandingpageSectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'section_title' => $this->faker->words(3, true), // random 3-word title
            'view_more_url' => $this->faker->unique()->slug(), // random unique slug
            'sortorder' => $this->faker->unique()->numberBetween(1, 10), // random unique number between 1 and 10
        ];
    }
}
