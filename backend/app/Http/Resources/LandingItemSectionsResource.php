<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LandingItemSectionsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'title' => $this->section_title,
            'view_more_url' => $this->view_more_url,
            'items' => ItemGenericResource::collection($this->items->where('published', true)),
        ];
    }
}
