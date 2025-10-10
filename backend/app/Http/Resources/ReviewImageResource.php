<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class ReviewImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'rimgid' => Hashids::encode($this->id),
            'imgurl' => $this->imgurl, // to be replaced with storage url
            'sortorder_user' => $this->sortorder_user,
            'updated_at' => $this->updated_at,
        ];
    }
}
