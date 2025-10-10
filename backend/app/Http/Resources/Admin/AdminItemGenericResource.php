<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class AdminItemGenericResource extends JsonResource
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
            'i_instock' => $this->i_instock,
            'i_mainimg' => asset('files/' . $this->i_mainimg),
            'i_category' => $this->i_category,
            'i_subcategory' => $this->i_subcategory ?? "",
            'i_brand' => $this->i_brand,
            'i_published' => $this->published,
        ];
    }
}
