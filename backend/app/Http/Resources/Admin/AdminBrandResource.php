<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class AdminBrandResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => Hashids::encode($this->id),
            'name' => $this->name,
            'slug' => $this->slug,
            'active' => $this->active,
            'categories_count' => $this->categories->count(),
            'subcategories_count' => $this->subcategories->count(),
            'categories' => $this->categories->map(function ($category) {
                return [
                    'id' => Hashids::encode($category->id),
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'active' => $category->active,
                ];
            }),
            'subcategories' => $this->subcategories->map(function ($subcategory) {
                return [
                    'id' => Hashids::encode($subcategory->id),
                    'name' => $subcategory->name,
                    'slug' => $subcategory->slug,
                    'active' => $subcategory->active,
                ];
            }),
            'total_associations' => $this->categories->count() + $this->subcategories->count(),
            'created_at' => Carbon::parse($this->created_at)->format('d-m-Y H:i:s'),
            'updated_at' => Carbon::parse($this->updated_at)->format('d-m-Y H:i:s'),
        ];
    }
}
