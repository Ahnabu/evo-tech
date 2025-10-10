<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'item_id' => Hashids::encode($this->item_id),
            'item_name' => $this->item->i_name,
            'item_slug' => $this->item->i_slug,
            'item_imgurl' => asset('files/' . $this->item->i_mainimg),
            'item_category' => $this->item->i_category,
            'item_subcategory' => $this->item->i_subcategory ?? null,
            'item_brand' => $this->item->i_brand,
            'item_weight' => $this->item->i_weight ?? null,
            'item_color' => $this->item_color ?? null,
            'item_quantity' => $this->item_quantity,
            'item_price' => $this->item_price,
        ];
    }
}
