<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
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
            "role" => $this->role,
            "email_verified_at" => $this->email_verified_at ? (new Carbon($this->email_verified_at))->format('d-m-Y g:i:s A') : null,
            "last_active_at" => $this->last_active_at ? (new Carbon($this->last_active_at))->format('d-m-Y g:i:s A') : null,
        ];
    }
}
