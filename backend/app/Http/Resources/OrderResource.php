<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'orderid' => strval($this->id + (int) env('FAKEORDER')),
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'phone' => $this->phone,
            'email' => $this->email,
            'housestreet' => $this->housestreet,
            'city' => $this->city,
            'subdistrict' => $this->subdistrict,
            'postcode' => $this->postcode,
            'country' => $this->country,
            'notes' => $this->notes,
            'shipping_type' => $this->shipping_type,
            'pickup_point_id' => $this->pickup_point_id,
            'payment_method' => $this->payment_method,
            'subtotal' => $this->subtotal,
            'discount' => $this->discount,
            'delivery_charge' => $this->delivery_charge,
            'additional_charge' => $this->additional_charge,
            'total_payable' => $this->total_payable,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'order_date' => (new Carbon($this->created_at))->format('d-m-Y g:i:s A'),
            'delivery_date' => $this->delivered_at ? (new Carbon($this->delivered_at))->format('d-m-Y g:i:s A') : null,
            'order_items' => OrderItemResource::collection($this->orderItems),
        ];
    }
}
