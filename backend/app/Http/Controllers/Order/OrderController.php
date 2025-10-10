<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Vinkla\Hashids\Facades\Hashids;

class OrderController extends Controller
{

    /**
     * Validate the cart token
     *
     * @param string $cartToken
     * @return array|bool
     */
    public function validateCartToken(string $cartToken)
    {
        if (str_contains($cartToken, '?')) {
            [$user_uuid, $hashedid] = explode('?', $cartToken);
            parse_str($hashedid, $queryStrings); // an associative array of query strings

            $cartkey = $queryStrings['key'] ?? null;

            if ($cartkey) {
                $userRecord = User::where('uuid', $user_uuid)->first();

                if ($userRecord && $userRecord->id === intval((Hashids::decode($cartkey)[0]))) {
                    return [
                        'user_uuid' => $user_uuid,
                        'c_key' => $cartkey,
                    ];
                }

                return false;
            }

            return false;
        }

        return false;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function placeNewOrder(StoreOrderRequest $request)
    {
        try {
            $cartToken = $request->cookie('cart_t') ?? $request->input('cart_t');

            if (!$cartToken) { // cart token does not exist
                return response()->json([
                    'message' => 'Sorry, the order could not be placed',
                ], 400);
            }

            $cartTokenValidated = $this->validateCartToken($cartToken);

            if (!$cartTokenValidated) { // cart token exists but is invalid
                return response()->json([
                    'message' => 'Sorry, the order could not be placed',
                ], 400);
            }

            $existingCart = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])->first();

            if (!$existingCart) { // cart token is valid but user has no cart items
                return response()->json([
                    'message' => 'Sorry, the order could not be placed',
                ], 400);
            }

            $validatedRequest = $request->validated();

            $paymentStatus = ($validatedRequest['paymentMethod'] === 'cod')
                ? 'pending'
                : ($validatedRequest['transactionId'] ? 'pending' : 'pending');

            DB::beginTransaction();

            $order = Order::create([
                'firstname' => $validatedRequest['firstname'],
                'lastname' => $validatedRequest['lastname'],
                'phone' => $validatedRequest['phone'],
                'email' => $validatedRequest['email'],
                'housestreet' => $validatedRequest['housestreet'],
                'city' => $validatedRequest['city'],
                'subdistrict' => $validatedRequest['subdistrict'],
                'postcode' => $validatedRequest['postcode'],
                'country' => $validatedRequest['country'],
                'shipping_type' => $validatedRequest['shippingType'],
                'pickup_point_id' => $validatedRequest['pickupPointId'],
                'payment_method' => $validatedRequest['paymentMethod'],
                'transaction_id' => $validatedRequest['transactionId'],
                'terms' => $validatedRequest['terms'],
                'subtotal' => $validatedRequest['subTotal'],
                'discount' => $validatedRequest['discount'],
                'delivery_charge' => $validatedRequest['deliveryCharge'],
                'additional_charge' => $validatedRequest['additionalCharge'],
                'total_payable' => $validatedRequest['totalPayable'],
                'notes' => $validatedRequest['notes'],
                'orderby_user_uuid' => $cartTokenValidated['user_uuid'],
                'payment_status' => $paymentStatus,
            ]);

            // Creating related order items
            foreach ($validatedRequest['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'item_id' => intval(Hashids::decode($item['item_id'])[0]),
                    'item_quantity' => $item['item_quantity'],
                    'item_price' => $item['item_price'],
                    'item_color' => $item['item_color'],
                ]);
            }

            // Deleting the cart records for the user
            Cart::where('user_uuid', $cartTokenValidated['user_uuid'])->delete();

            DB::commit(); // after commit, the transaction will be saved permanently

            $apiResponse = [
                'orderdata' => [
                    'orderid' => intval($order->id + (int) env('FAKEORDER')),
                    'order_key' => $order->order_key,
                ],
                'ctoken' => $cartToken,
                'message' => 'Order placed',
                'success' => true,
            ];

            if ($request->hasCookie('cart_t')) {
                return response()->json($apiResponse, 201);
            } else {

                $cartcookie = Cookie::make(
                    'cart_t',
                    $cartToken,
                    60 * 24 * 60, // 60 days
                    '/', // path
                    null, // domain
                    false, // secure
                    true, // httpOnly
                    false, // raw
                    'Lax' // sameSite
                );

                return response()->json($apiResponse, 201)->withCookie($cartcookie);
            }
            // try end
        } catch (\Exception $e) {
            DB::rollBack(); // the transaction will be rolled back if an exception occurs

            Log::error('Error placing order: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while placing order'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function showOrderInfoByID(Request $request, string $orderId)
    {
        try {
            $order = Order::find(((int) $orderId - (int) env('FAKEORDER')));

            if (!$order) { // order not found
                return response()->json(['message' => 'No order data found'], 404);
            }

            if ($order->order_key !== $request->query('orderkey', null)) { // order found but order key does not match
                return response()->json(['message' => 'Unauthorized access to order data'], 401);
            }

            return response()->json([
                'orderdata' => new OrderResource($order),
                'message' => 'Order retrieved successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            Log::error('Error retrieving order data: ' . $e->getMessage(), ['order_id' => $orderId]);

            return response()->json(['message' => 'An error occurred while retrieving order details'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
