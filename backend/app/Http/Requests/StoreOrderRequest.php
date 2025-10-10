<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // authenticated user or guest both can create an order
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'firstname' => 'required|string|max:255',
            'lastname' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|string|email|max:150',
            'housestreet' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'subdistrict' => 'required|string|max:255',
            'postcode' => 'nullable|string|max:20',
            'country' => 'required|string|max:255',
            'shippingType' => 'required|string|in:regular_delivery,express_delivery,pickup_point',
            'pickupPointId' => 'nullable|string',
            'paymentMethod' => 'required|string|max:50',
            'transactionId' => 'nullable|string|max:150',
            'terms' => 'required|string|max:50',
            'subTotal' => 'required|numeric|min:0',
            'discount' => 'required|numeric|min:0',
            'deliveryCharge' => 'required|numeric|min:0',
            'additionalCharge' => 'required|numeric|min:0',
            'totalPayable' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array',
        ];
    }

    /**
     * Customize the validation error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'firstname.required' => 'Firstname is required',
            'phone.required' => 'Phone no is required',
            'housestreet.required' => 'House & street is required',
            'city.required' => 'City is required',
            'subdistrict.required' => 'Subdistrict is required',
            'country.required' => 'Country is required',
            'shippingType.required' => 'Select a valid shipping type',
            'paymentMethod.required' => 'Select a valid payment method',
            'terms.required' => 'Accept terms and conditions to proceed',
            'subTotal.required' => 'Subtotal is required',
            'discount.required' => 'Discount amount is required',
            'deliveryCharge.required' => 'Delivery charge is required',
            'additionalCharge.required' => 'Additional charge is required',
            'totalPayable.required' => 'Total payable amount is required',
            'items.required' => 'Add items to cart to proceed',
        ];
    }
}
