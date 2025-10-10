<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class AdminLandingSectionsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'sectionid' => Hashids::encode($this->id),
            'title' => $this->section_title,
            'view_more_url' => $this->view_more_url,
            'sortorder' => $this->sortorder,
            'items_count' => $this->items->count(),
        ];
    }
}
