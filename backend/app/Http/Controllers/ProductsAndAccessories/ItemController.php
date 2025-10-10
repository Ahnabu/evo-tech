<?php

declare(strict_types=1);

namespace App\Http\Controllers\ProductsAndAccessories;

use App\Http\Controllers\Controller;
use App\Http\Resources\FeaturesHeaderResource;
use App\Http\Resources\FeaturesSubsectionsResource;
use App\Http\Resources\ItemDetailsResource;
use App\Http\Resources\ItemGenericResource;
use App\Http\Resources\SpecificationsResource;
use App\Models\Item;
use App\Models\Category;
use App\Services\ReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Vinkla\Hashids\Facades\Hashids;
use Illuminate\Support\Facades\Validator;

class ItemController extends Controller
{

    protected $reviewService;

    /**
     * Inject Service instance into the controller
     *
     * @param ReviewService $reviewService
     */
    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }


    /**
     * Display a listing of the items.
     */
    public function getAllItemsByCategory(Request $request, string $category)
    {
        try {
            // fetch from the category table first
            $categoryFetched = Category::active()
                ->ordered()
                ->get()
                ->pluck('name', 'slug') // slug is the key, name is the value
                ->toArray();

            if (empty($categoryFetched)) {
                return response()->json(['message' => 'No categories added yet'], 404);
            }

            $valRules = [
                'category' => 'required|string|in:all,' . implode(',', array_keys($categoryFetched)),
                'perpage' => 'nullable|integer|min:1',    // optional pagination parameter
                'instock' => 'nullable|string|in:true,false', // optional filter parameter
            ];

            $valMessages = [
                'category.in' => 'Invalid category',
                'perpage.min' => 'The perpage parameter must be at least 1',
            ];

            $validator = Validator::make([
                'category' => $category,
                'perpage' => $request->query('perpage'),
                'instock' => $request->query('instock'),
            ], $valRules, $valMessages);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400); // bad request
            }
            // validation passed--------------------------------------------

            if ($category === 'all') {
                $items = Item::where('published', true)
                    ->when(
                        $request->has('instock'),
                        function ($query) use ($request) {
                            $query->where('i_instock', filter_var($request->query('instock'), FILTER_VALIDATE_BOOLEAN));
                        }
                    )
                    ->orderBy('updated_at', 'desc')
                    ->paginate($request->perpage ?? 12); // default per page is 12
            } else {
                $items = Item::where('published', true)
                    ->where('i_category', $category)
                    ->when(
                        $request->has('instock'),
                        function ($query) use ($request) {
                            $query->where('i_instock', filter_var($request->query('instock'), FILTER_VALIDATE_BOOLEAN));
                        }
                    )
                    ->orderBy('updated_at', 'desc')
                    ->paginate($request->perpage ?? 12);
            }

            return response()->json([
                'items_data' => ItemGenericResource::collection($items->items()),
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'total_items' => $items->total(),
                'per_page' => $items->perPage(),
                'message' => 'Items retrieved successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error retrieving items data: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while retrieving items'], 500);
        }
    }


    /**
     * Get a specific item by slug.
     */
    public function getSpecificItemBySlug(Request $request, string $itemSlug)
    {
        try {

            $item = Item::where('i_slug', $itemSlug)
                ->where('published', true)
                ->first();

            if (!$item) {
                return response()->json(['message' => 'Item not found'], 404);
            }

            $itemFormatted = (new ItemDetailsResource($item))->toArray($request);

            $itemFormatted['i_sectionsdata'] = [
                'features_section' => [
                    'header' => FeaturesHeaderResource::collection($item->featuresHeader),
                    'subsections' => FeaturesSubsectionsResource::collection($item->featuresSubsections),
                ],
                'specifications_section' => SpecificationsResource::collection($item->specifications),
            ];

            return response()->json([
                'item_data' => $itemFormatted,
                'message' => 'Item retrieved successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error retrieving item data: ' . $e->getMessage(), ['i_slug' => $itemSlug]);

            return response()->json(['message' => 'An error occurred while retrieving the item'], 500);
        }
    }


    /**
     * Get reviews for a specific item.
     */
    public function getReviewsForAnItem(Request $request, string $itemId)
    {
        try {
            $item = Item::where('published', true)
                ->find(intval(Hashids::decode($itemId)[0] ?? 0));

            if (!$item) {
                return response()->json(['message' => 'Item not found to find reviews for'], 404);
            }

            $reviewsData = $this->reviewService->getReviewsforAnItem($request, $item->id);

            return response()->json([
                'reviewsalldata' => $reviewsData,
                'message' => 'Reviews retrieved successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error retrieving reviews data: ' . $e->getMessage(), ['item_id' => $itemId]);

            return response()->json(['message' => 'An error occurred while retrieving reviews'], 500);
        }
    }
}
