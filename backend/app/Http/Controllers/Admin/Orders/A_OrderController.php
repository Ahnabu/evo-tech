<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\Admin\AdminOrderResource;
use Illuminate\Support\Facades\Validator;

class A_OrderController extends Controller
{
    /**
     * Helper method to convert fake order ID to real order ID
     */
    private function getRealOrderId(string $fakeOrderId): int
    {
        return (int) $fakeOrderId - (int) env('FAKEORDER');
    }

    /**
     * Helper method to find order by fake order ID
     */
    private function findOrderByFakeId(string $fakeOrderId): ?Order
    {
        return Order::find($this->getRealOrderId($fakeOrderId));
    }

    /**
     * get all the orders data.
     */

    public function getAllOrdersForAdmin(Request $request)
    {
        try {
            // Validation rules for query parameters
            $valRules = [
                'search' => 'nullable|string|max:255',
                'order_status' => 'nullable|string|in:placed,confirmed,picked_up,on_the_way,delivered,cancelled',
                'payment_status' => 'nullable|string|in:paid,pending,refunded,partial',
                'page' => 'nullable|integer|min:1',
                'limit' => 'nullable|integer|min:1|max:100',
            ];

            $valMessages = [
                'order_status.in' => 'Invalid order status',
                'payment_status.in' => 'Invalid payment status',
                'page.min' => 'Page number must be at least 1',
                'limit.min' => 'Limit must be at least 1',
                'limit.max' => 'Limit cannot exceed 100',
            ];

            $validator = Validator::make([
                'search' => $request->query('search'),
                'order_status' => $request->query('order_status'),
                'payment_status' => $request->query('payment_status'),
                'page' => $request->query('page'),
                'limit' => $request->query('limit'),
            ], $valRules, $valMessages);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400);
            }

            // Build the query with filtering
            $ordersQuery = Order::with('orderItems');

            // Search filter - search in customer info and order details
            $search = $request->query('search');
            if (!empty($search)) {
                $fakeOrderOffset = (int) env('FAKEORDER');
                $ordersQuery->where(function ($query) use ($search, $fakeOrderOffset) {
                    $query->where('firstname', 'like', "%{$search}%")
                        ->orWhere('lastname', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhereRaw('CAST((id + ?) AS CHAR) LIKE ?', [
                            $fakeOrderOffset,
                            "%{$search}%"
                        ]);
                });
            }

            // Order status filter
            $orderStatus = $request->query('order_status');
            if (!empty($orderStatus)) {
                $ordersQuery->where('order_status', $orderStatus);
            }

            // Payment status filter
            $paymentStatus = $request->query('payment_status');
            if (!empty($paymentStatus)) {
                $ordersQuery->where('payment_status', $paymentStatus);
            }

            // Apply ordering and pagination
            $orders = $ordersQuery->orderBy('created_at', 'desc')
                ->paginate($request->query('limit', 10)); // default limit is 10

            return response()->json([
                'orders_data' => AdminOrderResource::collection($orders->items()),
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total_orders' => $orders->total(),
                'per_page' => $orders->perPage(),
                'message' => 'Orders fetched successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error getting all orders for admin: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while getting all orders'], 500);
        }
    }

    public function getOrderDetailsById(string $orderId)
    {
        try {
            $order = $this->findOrderByFakeId($orderId);

            if (!$order) {
                return response()->json(['message' => 'No order data found'], 404);
            }

            $order->load('orderItems');

            // update viewed status, when the API is called
            if (!$order->viewed) {
                $order->update(['viewed' => true]);
            }

            return response()->json([
                'order_data' => new AdminOrderResource($order),
                'message' => 'Order details fetched',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error getting order details: ' . $e->getMessage(), [
                'order_id' => $orderId
            ]);
            return response()->json(['message' => 'An error occurred while getting order details'], 500);
        }
    }

    /**
     * Update order statuses (order_status, payment_status, tracking_code)
     */
    public function updateOrderStatuses(Request $request, string $orderId)
    {
        try {
            // Validation rules
            $valRules = [
                'order_status' => 'nullable|string|in:placed,confirmed,picked_up,on_the_way,delivered,cancelled',
                'payment_status' => 'nullable|string|in:paid,pending,refunded,partial',
                'tracking_code' => 'nullable|string|max:255',
            ];

            $valMessages = [
                'order_status.in' => 'Invalid order status.',
                'payment_status.in' => 'Invalid payment status.',
                'tracking_code.max' => 'Tracking code cannot exceed 255 characters',
            ];

            $validator = Validator::make($request->all(), $valRules, $valMessages);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400);
            }

            // Find the order
            $order = $this->findOrderByFakeId($orderId);

            if (!$order) {
                return response()->json(['message' => 'No order data found'], 404);
            }

            // Prepare update data
            $updateData = [];

            // Update order_status if provided
            if ($request->has('order_status') && !empty($request->input('order_status'))) {
                $newOrderStatus = $request->input('order_status');
                $updateData['order_status'] = $newOrderStatus;

                // Handle delivery date logic
                if ($newOrderStatus === 'delivered') {
                    // Set delivered_at to current time if it's null
                    if (is_null($order->delivered_at)) {
                        $updateData['delivered_at'] = now();
                    }
                } else {
                    // Set delivered_at to null if order_status is not 'delivered'
                    if (!is_null($order->delivered_at)) {
                        $updateData['delivered_at'] = null;
                    }
                }
            }

            // Update payment_status if provided
            if ($request->has('payment_status') && !empty($request->input('payment_status'))) {
                $updateData['payment_status'] = $request->input('payment_status');
            }

            // Update tracking_code if provided (can be null)
            if ($request->has('tracking_code')) {
                $updateData['tracking_code'] = $request->input('tracking_code') ?: null;
            }

            // Check if there's anything to update
            if (empty($updateData)) {
                return response()->json(['message' => 'No valid fields provided for update'], 400);
            }

            // Update the order
            $order->update($updateData);

            // Load relationships and return updated order
            $order->load('orderItems');

            return response()->json([
                'order_data' => new AdminOrderResource($order),
                'message' => 'Order updated successfully',
                'success' => true,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error updating order statuses: ' . $e->getMessage(), [
                'order_id' => $orderId,
                'request_data' => $request->all()
            ]);
            return response()->json(['message' => 'An error occurred while updating order'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function deleteAnOrder(string $orderId)
    {
        try {
            $order = $this->findOrderByFakeId($orderId);

            if (!$order) { // order not found
                return response()->json(['message' => 'No order data found'], 404);
            }

            $order->delete();

            return response()->json([
                'message' => 'Order got deleted',
                'success' => true,
            ], 200);
            // try end
        } catch (\Exception $e) {
            Log::error('Error deleting order data: ' . $e->getMessage(), [
                'order_id' => $orderId
            ]);
            return response()->json(['message' => 'An error occurred while deleting an order data'], 500);
        }
    }
}
