<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\FeaturesSectionHeader;
use App\Models\FeaturesSectionSubsection;
use App\Models\Item;
use App\Models\ItemImage;
use App\Models\ReviewImage;
use App\Models\ReviewsSection;
use App\Models\SpecificationsSection;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()
            ->hasAddresses(2)
            ->create([
                'firstname' => 'Test',
                'lastname' => 'User One',
                'email' => 'test1@example.com',
                'password' => bcrypt('!Test123'),
                'user_type' => 'registered',
                'email_verified_at' => now(),
            ]);

        Admin::factory()
        ->create([
            'firstname' => 'Mahfuz',
            'lastname' => 'Hasan',
            'email' => 'mahfuzhasan1@gmail.com',
            'password' => bcrypt('!EvoAdminMH1'),
            'role' => 'ADMIN',
            'email_verified_at' => now(),
        ]);


        Item::factory()
            ->count(40)
            ->has(
                ItemImage::factory()
                    ->count(5)
                    ->state(new Sequence(
                        fn($sequence) => [
                            'is_main' => $sequence->index%5 === 0, // First image is main
                            'sortorder' => $sequence->index%5 + 1, // Increment sort order
                        ]
                    )),
                'itemImages'
            )
            ->has(
                FeaturesSectionHeader::factory()
                    ->count(2)
                    ->state(new Sequence(
                        fn($sequence) => [
                            'sortorder' => $sequence->index%2 + 1, // Increment sort order
                        ]
                    )),
                'featuresHeader'
            )
            ->has(
                FeaturesSectionSubsection::factory()
                    ->count(7)
                    ->state(new Sequence(
                        fn($sequence) => [
                            'sortorder' => $sequence->index%7 + 1, // Increment sort order
                        ]
                    )),
                'featuresSubsections'
            )
            ->has(
                SpecificationsSection::factory()
                    ->count(36)
                    ->state(new Sequence(
                        fn($sequence) => [
                            'sortorder' => $sequence->index%36 + 1, // Increment sort order
                        ]
                    )),
                'specifications'
            )
            ->has(
                ReviewsSection::factory()
                    ->count(9)
                    ->has(
                        ReviewImage::factory()
                            ->count(5)
                            ->state(new Sequence(
                                    fn($sequence) => [
                                        'sortorder_user' => $sequence->index%5 + 1, // Increment sort order
                                    ]
                                )
                            ),
                        'reviewImages'
                    ),
                'reviews'
            )
            ->create();
    }
}
