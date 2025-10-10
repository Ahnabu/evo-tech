<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "house_and_street" => $this->house_and_street,
            "subdistrict" => $this->subdistrict,
            "city" => $this->city,
            "postal_code" => $this->postal_code,
            "country" => $this->country,
            "is_default_address" => $this->is_default_address,
        ];
    }
}
