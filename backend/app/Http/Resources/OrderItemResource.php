<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class OrderItemResource extends JsonResource
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
            'item_image' => $this->item->i_mainimg,
            'item_name' => $this->item->i_name,
            'item_price' => $this->item_price,
            'item_quantity' => $this->item_quantity,
            'item_color' => $this->item_color,
        ];
    }
}
