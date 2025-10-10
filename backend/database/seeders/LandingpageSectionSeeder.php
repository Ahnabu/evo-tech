<?php

namespace Database\Seeders;

use App\Models\LandingpageSection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LandingpageSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LandingpageSection::factory()
            ->count(3)
            ->create();
    }
}
