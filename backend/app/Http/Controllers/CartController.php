<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Http\Requests\StoreCartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Http\Resources\CartResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Vinkla\Hashids\Facades\Hashids;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{

    /**
     * cart cookie validation
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


    private function getCartToken(Request $request)
    {
        if ($request->hasCookie('cart_t')) {
            return $request->cookie('cart_t');
        }

        if ($request->has('cart_t')) {
            return $request->input('cart_t');
        }

        return null;
    }


    /**
     * create a new guest user and add to cart.
     */
    public function createGuestUserAndCart(Request $request)
    {
        $newguest = User::create();

        if (!$newguest) {
            return response()->json(['message' => 'An error occurred while creating a new guest user'], 500);
        }

        $cartItem = Cart::create([
            'user_uuid' => $newguest->uuid,
            'item_id' => intval(Hashids::decode($request->item_id)[0]),
            'item_quantity' => $request->item_quantity,
            'item_price' => $request->item_price,
            'item_color' => $request->item_color,
        ]);

        if (!$cartItem) {
            return response()->json(['message' => 'An error occurred while adding item to cart'], 500);
        }

        $cartToken = $newguest->uuid . '?key=' . Hashids::encode($newguest->id);

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

        return response()->json([
            'cartdata' => CartResource::collection([$cartItem]),
            'ctoken' => $cartToken,
            'message' => 'Item added to cart',
        ], 201)->withCookie($cartcookie);
    }


    /**
     * Display a listing of the resource.
     */
    public function getCartOfUser(Request $request)
    {
        try {
            $cartToken = $request->cookie('cart_t') ?? $request->input('cart_t');

            if (!$cartToken) { // cart token does not exist
                return response()->json([
                    'cartdata' => [],
                    'message' => 'Cart not found',
                ], 200);
            }

            $cartTokenValidated = $this->validateCartToken($cartToken);

            if (!$cartTokenValidated) { // cart token exists but is invalid
                return response()->json([
                    'cartdata' => [],
                    'message' => 'Cart not found',
                ], 200);
            }

            $cartItems = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])
                ->orderBy('updated_at', 'asc')
                ->get();

            if ($request->hasCookie('cart_t')) {
                return response()->json([
                    'cartdata' => CartResource::collection($cartItems),
                    'ctoken' => $cartToken,
                ], 200);
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

                return response()->json([
                    'cartdata' => CartResource::collection($cartItems),
                    'ctoken' => $cartToken,
                ], 200)->withCookie($cartcookie);
            }
            // try end
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error retrieving cart data: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while retrieving cart data'], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function addToCart(Request $request)
    {
        try {
            $rules = [
                'item_id' => 'required|string',
                'item_quantity' => 'required|integer|min:1',
                'item_price' => 'required|numeric|min:0',
                'item_color' => 'nullable|string',
            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            if ($request->hasCookie('cart_t')) {
                $cartToken = $request->cookie('cart_t');

                $cartTokenValidated = $this->validateCartToken($cartToken);

                if (!$cartTokenValidated) {
                    return $this->createGuestUserAndCart($request);
                }

                $existingCartItem = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])
                    ->where('item_id', intval(Hashids::decode($request->input('item_id'))[0]))
                    ->where('item_color', $request->input('item_color'))
                    ->first();

                if ($existingCartItem) {
                    if ($existingCartItem->item_quantity >= 9999) {
                        return response()->json(['message' => 'Quantity limit reached'], 200);
                    }

                    $existingCartItem->update([
                        'item_quantity' => $existingCartItem->item_quantity + 1,
                    ]);

                    $cartItemsUpdated = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])
                        ->orderBy('updated_at', 'asc')
                        ->get();

                    return response()->json([
                        'cartdata' => CartResource::collection($cartItemsUpdated),
                        'ctoken' => $cartToken,
                        'message' => 'Item already in cart, quantity updated',
                    ], 200);
                }

                $cartItem = Cart::create([
                    'user_uuid' => $cartTokenValidated['user_uuid'],
                    'item_id' => intval(Hashids::decode($request->input('item_id'))[0]),
                    'item_quantity' => $request->input('item_quantity'),
                    'item_price' => $request->input('item_price'),
                    'item_color' => $request->input('item_color'),
                ]);

                if (!$cartItem) {
                    return response()->json(['message' => 'An error occurred while adding item to cart'], 500);
                }

                $cartItems = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])
                    ->orderBy('updated_at', 'asc')
                    ->get();

                return response()->json([
                    'cartdata' => CartResource::collection($cartItems),
                    'ctoken' => $cartToken,
                    'message' => 'Item added to cart',
                ], 201);
            } elseif ($request->has('cart_t')) {
                $cartToken = $request->input('cart_t');

                $cartTokenValidated = $this->validateCartToken($cartToken);

                if (!$cartTokenValidated) {
                    return $this->createGuestUserAndCart($request);
                }

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

                $existingCartItem = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])
                    ->where('item_id', intval(Hashids::decode($request->input('item_id'))[0]))
                    ->where('item_color', $request->input('item_color'))
                    ->first();

                if ($existingCartItem) {
                    if ($existingCartItem->item_quantity >= 9999) {
                        return response()->json(['message' => 'Quantity limit reached'], 200)->withCookie($cartcookie);
                    }

                    $existingCartItem->update([
                        'item_quantity' => $existingCartItem->item_quantity + 1,
                    ]);

                    $cartItemsUpdatedHere = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])
                        ->orderBy('updated_at', 'asc')
                        ->get();

                    return response()->json([
                        'cartdata' => CartResource::collection($cartItemsUpdatedHere),
                        'ctoken' => $cartToken,
                        'message' => 'Item already in cart, quantity updated',
                    ], 200)->withCookie($cartcookie);
                }

                $cartItem = Cart::create([
                    'user_uuid' => $cartTokenValidated['user_uuid'],
                    'item_id' => intval(Hashids::decode($request->input('item_id'))[0]),
                    'item_quantity' => $request->input('item_quantity'),
                    'item_price' => $request->input('item_price'),
                    'item_color' => $request->input('item_color'),
                ]);

                if (!$cartItem) {
                    return response()->json(['message' => 'An error occurred while adding item to cart'], 500);
                }

                $cartItems = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])
                    ->orderBy('updated_at', 'asc')
                    ->get();

                return response()->json([
                    'cartdata' => CartResource::collection($cartItems),
                    'ctoken' => $cartToken,
                    'message' => 'Item added to cart',
                ], 201)->withCookie($cartcookie);
            } else {
                return $this->createGuestUserAndCart($request);
            }
            // try end
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error adding item to cart: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while adding item to cart'], 500);
        }
    }


    /**
     * Update the specified cart item in storage.
     */
    public function updateSingleCartItem(Request $request)
    {
        try {
            $rules = [
                'item_id' => 'required|string',
                'item_quantity' => 'required|integer|min:1',
                'item_color' => 'nullable|string',
            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            if ($request->hasCookie('cart_t')) {
                $cartToken = $request->cookie('cart_t');

                $cartTokenValidated = $this->validateCartToken($cartToken);

                if (!$cartTokenValidated) {
                    return response()->json(['message' => 'Cart not found'], 404);
                }

                $cartItem = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])
                    ->where('item_id', intval(Hashids::decode($request->input('item_id'))[0] ?? 0))
                    ->where('item_color', $request->input('item_color'))
                    ->first();

                if (!$cartItem) {
                    return response()->json(['message' => 'Cart item not found'], 404);
                }

                $cartItem->update([
                    'item_quantity' => $request->input('item_quantity'),
                ]);

                return response()->json([
                    'ctoken' => $cartToken,
                    'message' => 'Cart item updated',
                ], 200);
            } elseif ($request->has('cart_t')) {
                $cartToken = $request->input('cart_t');

                $cartTokenValidated = $this->validateCartToken($cartToken);

                if (!$cartTokenValidated) {
                    return response()->json(['message' => 'Cart not found'], 404);
                }

                $cartItem = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])
                    ->where('item_id', intval(Hashids::decode($request->input('item_id'))[0] ?? 0))
                    ->where('item_color', $request->input('item_color'))
                    ->first();

                if (!$cartItem) {
                    return response()->json(['message' => 'Cart item not found'], 404);
                }

                $cartItem->update([
                    'item_quantity' => $request->input('item_quantity'),
                ]);

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

                return response()->json([
                    'ctoken' => $cartToken,
                    'message' => 'Cart item updated',
                ], 200)->withCookie($cartcookie);
            } else {
                return response()->json(['message' => 'Cart not found'], 404);
            }
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error updating cart item: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while updating cart item'], 500);
        }
    }


    public function updateBatchCartItems(Request $request)
    {
        try {
            $rules = [
                'items' => 'required|array|min:1',
                'items.*.item_id' => 'required|string',
                'items.*.item_quantity' => 'required|integer|min:1',
                'items.*.item_color' => 'nullable|string',
            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            // Get cart token from cookie or request
            $cartToken = $this->getCartToken($request);
            if (!$cartToken) {
                return response()->json(['message' => 'Cart not found'], 404);
            }

            $cartTokenValidated = $this->validateCartToken($cartToken);
            if (!$cartTokenValidated) {
                return response()->json(['message' => 'Cart not found'], 404);
            }

            $items = $request->input('items');
            $updatedItems = [];

            // Validate all items exist before updating any
            foreach ($items as $index => $item) {

                $cartItem = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])
                    ->where('item_id', intval(Hashids::decode($item['item_id'])[0] ?? 0))
                    ->where('item_color', $item['item_color'])
                    ->first();

                if (!$cartItem) {
                    return response()->json([
                        'message' => "A cart item was not found",
                    ], 404);
                }

                $updatedItems[] = [
                    'cart_item' => $cartItem,
                    'new_quantity' => $item['item_quantity'],
                    'item_data' => $item
                ];
            }

            // All items validated, now update in transaction
            DB::transaction(function () use ($updatedItems) {
                foreach ($updatedItems as $updateData) {
                    $updateData['cart_item']->update([
                        'item_quantity' => $updateData['new_quantity']
                    ]);
                }
            });

            // Prepare response with updated item details
            $responseItems = array_map(function ($updateData) {
                return [
                    'item_id' => $updateData['item_data']['item_id'],
                    'item_color' => $updateData['item_data']['item_color'],
                    'old_quantity' => $updateData['cart_item']->getOriginal('item_quantity'),
                    'new_quantity' => $updateData['new_quantity']
                ];
            }, $updatedItems);

            $response = [
                'ctoken' => $cartToken,
                'message' => 'Cart items updated',
                'updated_items' => $responseItems,
                'total_updated' => count($responseItems),
            ];

            // Handle cookie setting if cart_t came from request body
            if ($request->has('cart_t') && !$request->hasCookie('cart_t')) {
                $cartCookie = Cookie::make(
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

                return response()->json($response, 200)->withCookie($cartCookie);
            }

            return response()->json($response, 200);
        } catch (\Exception $e) {
            Log::error('Error updating cart items: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while updating cart items'], 500);
        }
    }


    /**
     * Remove the specified cart item from storage.
     */
    public function removeCartItem(Request $request)
    {
        try {
            $rules = [
                'item_id' => 'required|string',
                'item_color' => 'nullable|string',
            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            if ($request->hasCookie('cart_t')) {
                $cartToken = $request->cookie('cart_t');

                $cartTokenValidated = $this->validateCartToken($cartToken);

                if (!$cartTokenValidated) {
                    return response()->json(['message' => 'Cart not found'], 404);
                }

                $cartItem = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])
                    ->where('item_id', intval(Hashids::decode($request->input('item_id'))[0] ?? 0))
                    ->where('item_color', $request->input('item_color'))
                    ->first();

                if (!$cartItem) {
                    return response()->json(['message' => 'Cart item not found'], 404);
                }

                $cartItem->delete();

                return response()->json([
                    'ctoken' => $cartToken,
                    'message' => 'Cart item removed',
                ], 200);
            } elseif ($request->has('cart_t')) {
                $cartToken = $request->input('cart_t');

                $cartTokenValidated = $this->validateCartToken($cartToken);

                if (!$cartTokenValidated) {
                    return response()->json(['message' => 'Cart not found'], 404);
                }

                $cartItem = Cart::where('user_uuid', $cartTokenValidated['user_uuid'])
                    ->where('item_id', intval(Hashids::decode($request->input('item_id'))[0] ?? 0))
                    ->where('item_color', $request->input('item_color'))
                    ->first();

                if (!$cartItem) {
                    return response()->json(['message' => 'Cart item not found'], 404);
                }

                $cartItem->delete();

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

                return response()->json([
                    'ctoken' => $cartToken,
                    'message' => 'Cart item removed',
                ], 200)->withCookie($cartcookie);
            } else {
                return response()->json(['message' => 'Cart not found'], 404);
            }
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error deleting cart item: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while deleting cart item'], 500);
        }
    }
}
