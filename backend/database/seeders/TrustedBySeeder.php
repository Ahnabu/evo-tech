<?php

namespace Database\Seeders;

use App\Models\TrustedBy;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TrustedBySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TrustedBy::factory()
            ->count(10)
            ->create();
    }
}
