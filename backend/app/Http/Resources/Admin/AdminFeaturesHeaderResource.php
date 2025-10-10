<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class AdminFeaturesHeaderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'f_headerid' => Hashids::encode($this->id),
            'title' => $this->title,
            'imgurl' => asset('files/' . $this->imgurl),
            'sortorder' => $this->sortorder,
        ];
    }
}
