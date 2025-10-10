<?php

namespace Database\Seeders;

use App\Models\LandingpageSection;
use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $randomIds = [
            1 => [1, 2, 3, 4, 5],
            2 => [6, 7, 8, 9, 10],
            3 => [11, 12, 13, 14, 15],
        ];

        $landingpageSections = LandingpageSection::all();

        $landingpageSections->each(function ($section) use ($randomIds) {
            $fetchedItems = Item::whereIn('id', $randomIds[$section->id])
                ->get();

            foreach ($fetchedItems as $index => $item) {
                $item->update([
                    'landingpage_section_id' => $section->id,
                    'landingpage_sortorder' => $index + 1,
                ]);
            };
        });
    }
}
