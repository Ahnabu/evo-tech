<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class AdminFeaturesSubsectionsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'f_subsectionid' => Hashids::encode($this->id),
            'imgurl' => asset('files/' . $this->imgurl),
            'title' => $this->title,
            'content' => $this->content,
            'sortorder' => $this->sortorder,
        ];
    }
}
