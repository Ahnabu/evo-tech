<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LandingpageTopCarouselResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'more_text' => $this->more_text,
            'button_text' => $this->button_text,
            'button_url' => $this->button_url,
            'imgurl' => asset('files/' . $this->imgurl),
        ];
    }
}
