<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class AdminLPTopCarouselResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'tcarousel_itemid' => Hashids::encode($this->id),
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'more_text' => $this->more_text,
            'button_text' => $this->button_text,
            'button_url' => $this->button_url,
            'imgurl' => asset('files/' . $this->imgurl),
            'sortorder' => $this->sortorder,
            'last_modified_at' => (new Carbon($this->updated_at))->format('d-m-Y g:i:s A'),
        ];
    }
}
