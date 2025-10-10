<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;

class AdminLPTrustedByResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'trustedbyid' => Hashids::encode($this->id),
            'brand_name' => $this->brand_name,
            'brand_logosrc' => asset('files/' . $this->brand_logo),
            'brand_url' => $this->brand_url,
            'sortorder' => $this->sortorder,
            'is_active' => $this->is_active,
            'last_modified_at' => (new Carbon($this->updated_at))->format('d-m-Y g:i:s A'),
        ];
    }
}
