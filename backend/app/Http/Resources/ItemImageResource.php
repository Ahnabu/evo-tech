<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class ItemImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'imgid' => Hashids::encode($this->id),
            'imgsrc' => asset('files/' . $this->imgsrc),
            'imgtitle' => $this->imgtitle,
            'ismain' => $this->is_main,
        ];
    }
}
