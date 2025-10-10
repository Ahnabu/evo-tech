<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class AdminSpecificationsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'specid' => Hashids::encode($this->id),
            'label' => $this->label,
            'value' => $this->value,
            'sortorder' => $this->sortorder,
        ];
    }
}
