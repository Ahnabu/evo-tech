<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ItemImageResource;
use Vinkla\Hashids\Facades\Hashids;

class AdminItemDetailsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'itemid' => Hashids::encode($this->id),
            'i_name' => $this->i_name,
            'i_slug' => $this->i_slug,
            'i_price' => $this->i_price,
            'i_prevprice' => $this->i_prevprice,
            'i_rating' => $this->i_rating,
            'i_reviews' => $this->i_reviews,
            'i_instock' => $this->i_instock,
            'i_features' => $this->i_features,
            'i_colors' => $this->i_colors,
            'i_mainimg' => asset('files/' . $this->i_mainimg),
            'i_category' => $this->i_category,
            'i_subcategory' => $this->i_subcategory ?? "",
            'i_brand' => $this->i_brand,
            'i_weight' => $this->i_weight,
            'landing_section_id' => $this->landingpage_section_id ? Hashids::encode($this->landingpage_section_id) : null,
            'i_images' => ItemImageResource::collection($this->itemImages),
        ];
    }
}
