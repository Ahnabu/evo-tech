<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\OrderItemResource;

class AdminOrderResource extends JsonResource
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
            'order_key' => $this->order_key,
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
            'transaction_id' => $this->transaction_id,
            'terms' => $this->terms,
            'subtotal' => $this->subtotal,
            'discount' => $this->discount,
            'delivery_charge' => $this->delivery_charge,
            'additional_charge' => $this->additional_charge,
            'total_payable' => $this->total_payable,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'order_date' => (new Carbon($this->created_at))->format('d-m-Y g:i:s A'),
            'delivery_date' => $this->delivered_at ? (new Carbon($this->delivered_at))->format('d-m-Y') : null,
            'tracking_code' => $this->tracking_code,
            'viewed' => $this->viewed,
            'unpaid_notified' => $this->unpaid_notified,
            'order_items' => OrderItemResource::collection($this->orderItems),
        ];
    }
}
