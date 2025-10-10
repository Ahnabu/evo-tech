<?php

namespace App\Http\Resources\User;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "uuid" => $this->uuid,
            "firstname" => $this->firstname,
            "lastname" => $this->lastname,
            "email" => $this->email,
            "phone" => $this->phone,
            "email_verified_at" => $this->email_verified_at ? (new Carbon($this->email_verified_at))->format('d-m-Y g:i:s A') : null,
            "last_active_at" => $this->last_active_at ? (new Carbon($this->last_active_at))->format('d-m-Y g:i:s A') : null,
            "reward_points" => $this->reward_points,
            "newsletter_opt_in" => $this->newsletter_opt_in,
            "addresses" => AddressResource::collection($this->addresses),
        ];
    }
}
