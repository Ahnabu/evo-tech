<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class AdminSubcategoryResource extends JsonResource
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
            'sortorder' => $this->sortorder,
            'active' => $this->active,
            'url' => $this->url,
            'category' => [
                'id' => Hashids::encode($this->category->id),
                'name' => $this->category->name,
                'slug' => $this->category->slug,
                'active' => $this->category->active,
            ],
            'brands_count' => $this->brands->count(),
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::parse($this->updated_at)->format('Y-m-d H:i:s'),
        ];
    }
} 