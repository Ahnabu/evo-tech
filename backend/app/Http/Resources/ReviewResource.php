<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'reviewid' => Hashids::encode($this->id),
            'rating' => $this->rating,
            'reviewer' => $this->reviewer,
            'reviewer_email' => $this->reviewer_email,
            'review_content' => $this->review_content,
            'review_images' => ReviewImageResource::collection($this->reviewImages),
            'updated_at' => $this->updated_at,
            'created_at' => $this->created_at,
        ];
    }
}
