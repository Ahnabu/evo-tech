<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReviewsSection>
 */
class ReviewsSectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rating' => $this->faker->numberBetween(1, 5),
            'reviewer' => $this->faker->name(),
            'reviewer_email' => $this->faker->unique()->safeEmail(),
            'review_content' => $this->faker->paragraphs(2, true),
        ];
    }
}
