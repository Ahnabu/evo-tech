<?php

namespace App\Http\Controllers\Admin\ProductsAndAccessories;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminFeaturesHeaderResource;
use App\Http\Resources\Admin\AdminFeaturesSubsectionsResource;
use App\Http\Resources\Admin\AdminSpecificationsResource;
use App\Http\Resources\Admin\AdminItemDetailsResource;
use App\Http\Resources\Admin\AdminItemGenericResource;
use App\Models\Item;
use App\Models\ItemImage;
use App\Models\LandingpageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Vinkla\Hashids\Facades\Hashids;
use Illuminate\Support\Facades\Validator;



class A_ItemController extends Controller
{

    public function getAllItemsForAdmin(Request $request)
    {
        try {
            // Validation rules for query parameters
            $valRules = [
                'search' => 'nullable|string|max:255',
                'category' => 'nullable|string|max:255',
                'subcategory' => 'nullable|string|max:255',
                'brand' => 'nullable|string|max:255',
                'page' => 'nullable|integer|min:1',
                'limit' => 'nullable|integer|min:1|max:100',
            ];

            $valMessages = [
                'page.min' => 'Page number must be at least 1',
                'limit.min' => 'Limit must be at least 1',
                'limit.max' => 'Limit cannot exceed 100',
            ];

            $validator = Validator::make([
                'search' => $request->query('search'),
                'category' => $request->query('category'),
                'subcategory' => $request->query('subcategory'),
                'brand' => $request->query('brand'),
                'page' => $request->query('page'),
                'limit' => $request->query('limit'),
            ], $valRules, $valMessages);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400);
            }

            // Build the query with filtering
            $itemsQuery = Item::query();

            // Search filter - search in item name
            if ($request->has('search') && !empty($request->query('search'))) {
                $search = $request->query('search');
                $itemsQuery->where('i_name', 'like', "%{$search}%");
            }

            // Category filter
            if ($request->has('category') && !empty($request->query('category'))) {
                $category = $request->query('category');
                if ($category !== 'all') {
                    $itemsQuery->where('i_category', $category);
                }
            }

            // Subcategory filter
            if ($request->has('subcategory') && !empty($request->query('subcategory'))) {
                $subcategory = $request->query('subcategory');
                if ($subcategory !== 'all') {
                    $itemsQuery->where('i_subcategory', $subcategory);
                }
            }

            // Brand filter
            if ($request->has('brand') && !empty($request->query('brand'))) {
                $brand = $request->query('brand');
                if ($brand !== 'all') {
                    $itemsQuery->where('i_brand', $brand);
                }
            }

            // Apply ordering and pagination
            $items = $itemsQuery->orderBy('updated_at', 'desc')
                ->paginate($request->query('limit', 10)); // default limit is 10

            return response()->json([
                'items_data' => AdminItemGenericResource::collection($items->items()),
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
    public function getSpecificItemBySlugForAdmin(Request $request, string $itemSlug)
    {
        try {

            $item = Item::where('i_slug', $itemSlug)->first();

            if (!$item) {
                return response()->json(['message' => 'Item not found'], 404);
            }

            $itemFormatted = (new AdminItemDetailsResource($item))->toArray($request);

            $itemFormatted['i_sectionsdata'] = [
                'features_section' => [
                    'header' => AdminFeaturesHeaderResource::collection($item->featuresHeader),
                    'subsections' => AdminFeaturesSubsectionsResource::collection($item->featuresSubsections),
                ],
                'specifications_section' => AdminSpecificationsResource::collection($item->specifications),
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
     * Toggle the published status of an item
     * 
     * @param string $itemId
     * @return \Illuminate\Http\JsonResponse
     */
    public function togglePublishedStatus(string $itemId)
    {
        try {

            $item = Item::find(intval(Hashids::decode($itemId)[0] ?? 0));

            if (!$item) {
                return response()->json(['message' => 'Item not found'], 404);
            }

            // Toggle the published status
            $item->published = !$item->published;
            $item->save();

            // Return the updated status
            return response()->json([
                'message' => 'Published status updated successfully',
                'published' => $item->published,
            ], 200);
            // try end
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error toggling published status: ' . $e->getMessage(), ['item_id' => $itemId]);

            return response()->json(['message' => 'An error occurred while updating publication status'], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function storeNewItem(Request $request)
    {
        try {
            $valRules = [
                'item_name' => 'required|string|unique:items,i_name|max:255',
                'item_slug' => 'required|string|unique:items,i_slug|max:255',
                'item_price' => 'required|numeric|min:0',
                'item_prevprice' => 'required|numeric|min:0',
                'item_instock' => 'required|string|in:true,false',
                'item_features' => 'nullable|array',
                'item_colors' => 'nullable|array',
                'item_mainimg' => 'required|mimes:jpeg,png,jpg,webp',
                'item_category' => 'required|string',
                'item_subcategory' => 'nullable|string',
                'item_brand' => 'required|string',
                'item_weight' => 'nullable|numeric|min:0',
                'landing_section_id' => 'nullable|string',
                'additional_images' => 'nullable|array',
                'additional_images.*' => 'mimes:jpeg,png,jpg,webp', // validate each item in the array using *
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400); // bad request
            }

            // validation passed--------------------------------------------

            $lpSectionId = $request->input('landing_section_id');
            $landingpageSectionId = null;

            if (!is_null($lpSectionId)) {
                $landingpageSectionId = intval(Hashids::decode($lpSectionId)[0] ?? 0);
                $landingpageSection = LandingpageSection::find($landingpageSectionId);

                if (!$landingpageSection) {
                    return response()->json(['message' => 'Landingpage section not found'], 404);
                }
            }

            $landingpageSortOrder = Item::getNextLandingpageSortorder($landingpageSectionId);

            // handle main image upload
            $mainImage = $request->file('item_mainimg');

            $uniqueFolderforItem = 'evo_' . Str::random(7) . time();
            $mainImgNamewithExt = 'img_' . Str::uuid() . '.' . $mainImage->getClientOriginalExtension();

            $itemMainImgPath = $mainImage->storeAs('items/' . $uniqueFolderforItem, $mainImgNamewithExt, 'public');

            $imageSortorder = 1;

            DB::beginTransaction();

            $newItem = Item::create([
                'i_name' => $request->input('item_name'),
                'i_slug' => $request->input('item_slug'),
                'i_price' => $request->input('item_price'),
                'i_prevprice' => $request->input('item_prevprice'),
                'i_instock' => filter_var($request->input('item_instock'), FILTER_VALIDATE_BOOLEAN),
                'i_features' => $request->input('item_features'), // nullable
                'i_colors' => $request->input('item_colors'), // nullable
                'i_mainimg' => $itemMainImgPath,
                'i_category' => $request->input('item_category'),
                'i_subcategory' => $request->input('item_subcategory'), // nullable
                'i_brand' => $request->input('item_brand'),
                'i_weight' => $request->input('item_weight'), // nullable
                'landingpage_section_id' => $landingpageSectionId, // nullable
                'landingpage_sortorder' => $landingpageSortOrder, // nullable
            ]);

            // save the required main image first
            ItemImage::create([
                'imgsrc' => $itemMainImgPath,
                'imgtitle' => $mainImgNamewithExt,
                'sortorder' => $imageSortorder,
                'is_main' => true,
                'item_id' => $newItem->id,
            ]);

            // handle additional images
            if ($request->hasFile('additional_images')) {
                foreach ($request->file('additional_images') as $imgFile) {
                    $additionalImgNamewithExt = 'img_' . Str::uuid() . '.' . $imgFile->getClientOriginalExtension();

                    $additionalImgPath = $imgFile->storeAs('items/' . $uniqueFolderforItem, $additionalImgNamewithExt, 'public');

                    ItemImage::create([
                        'imgsrc' => $additionalImgPath,
                        'imgtitle' => $additionalImgNamewithExt,
                        'sortorder' => ++$imageSortorder,
                        'is_main' => false,
                        'item_id' => $newItem->id,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'item_id' => Hashids::encode($newItem->id),
                'item_name' => $newItem->i_name,
                'item_slug' => $newItem->i_slug,
                'message' => 'Item stored successfully',
            ], 201);
            // try end
        } catch (\Exception $e) {
            DB::rollBack(); // the transaction will be rolled back if an exception occurs

            Log::error('Error storing item data: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while storing item data'], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function updateAnItem(Request $request, string $itemId)
    {
        try {
            $item = Item::find(intval(Hashids::decode($itemId)[0] ?? 0));

            if (!$item) {
                return response()->json(['message' => 'Item not found'], 404);
            }

            $valRules = [
                'item_name' => ['required', 'string', 'max:255', Rule::unique('items', 'i_name')->ignore($item->id)],
                'item_slug' => ['required', 'string', 'max:255', Rule::unique('items', 'i_slug')->ignore($item->id)],
                'item_price' => 'required|numeric|min:0',
                'item_prevprice' => 'required|numeric|min:0',
                'item_instock' => 'required|string|in:true,false',
                'item_features' => 'nullable|array',
                'item_colors' => 'nullable|array',
                'item_category' => 'required|string',
                'item_subcategory' => 'nullable|string',
                'item_brand' => 'required|string',
                'item_weight' => 'nullable|numeric|min:0',
                'landing_section_id' => 'nullable|string',
                'item_newmainimg' => 'nullable|mimes:jpeg,png,jpg,webp', // optional new main image
                'item_newmainfromexisting' => 'nullable|string', // optional new main image from existing images
                'additional_newimages' => 'nullable|array',
                'additional_newimages.*' => 'mimes:jpeg,png,jpg,webp', // validate each new item in the array using *
                'remove_additional_images' => 'nullable|array', // optional array of image ids to remove
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400); // bad request
            }
            // validation passed--------------------------------------------

            $lpSectionId = $request->input('landing_section_id');
            $landingpageSectionId = null;

            if (!is_null($lpSectionId)) {
                $landingpageSectionId = intval(Hashids::decode($lpSectionId)[0] ?? 0);
                $landingpageSection = LandingpageSection::find($landingpageSectionId);

                if (!$landingpageSection) {
                    return response()->json(['message' => 'Landingpage section not found'], 404);
                }
            }

            if (is_null($landingpageSectionId)) { // if the landingpage section id is not set, set the sort order to null
                $landingpageSortOrder = null;
            } elseif (intval($landingpageSectionId) !== $item->landingpage_section_id) { // if the landingpage section id is changed, get the next sort order
                $landingpageSortOrder = Item::getNextLandingpageSortorder($landingpageSectionId);
            } else { // if the landingpage section id is not changed, use the existing sort order
                $landingpageSortOrder = $item->landingpage_sortorder;
            }

            DB::beginTransaction();

            $uniqueFolderforItem = explode('/', $item->i_mainimg)[1]; // folder name from the existing main image path

            if ($request->hasFile('item_newmainimg')) { // handle new main image upload
                $newmainImage = $request->file('item_newmainimg');

                $mainImgNamewithExt = 'img_' . Str::uuid() . '.' . $newmainImage->getClientOriginalExtension();

                $itemMainImgPath = $newmainImage->storeAs('items/' . $uniqueFolderforItem, $mainImgNamewithExt, 'public');

                $item->makeSpaceForNewMainImage(); // method from Item model to update in the item_images table

                $item->update([
                    'i_mainimg' => $itemMainImgPath,
                ]);

                // save the new main image
                ItemImage::create([
                    'imgsrc' => $itemMainImgPath,
                    'imgtitle' => $mainImgNamewithExt,
                    'sortorder' => 1,
                    'is_main' => true,
                    'item_id' => $item->id,
                ]);
            }

            // handle new main image from existing images
            if (!$request->hasFile('item_newmainimg') && $request->has('item_newmainfromexisting') && !empty($request->input('item_newmainfromexisting'))) {
                $selectedImage = ItemImage::find(intval(Hashids::decode($request->input('item_newmainfromexisting'))[0] ?? 0));

                if ($selectedImage) {
                    $item->setMainImageFromExisting($selectedImage); // method from Item model
                }
            }

            $item->update([
                'i_name' => $request->input('item_name'),
                'i_slug' => $request->input('item_slug'),
                'i_price' => $request->input('item_price'),
                'i_prevprice' => $request->input('item_prevprice'),
                'i_instock' => filter_var($request->input('item_instock'), FILTER_VALIDATE_BOOLEAN),
                'i_features' => $request->input('item_features'), // nullable
                'i_colors' => $request->input('item_colors'), // nullable
                'i_category' => $request->input('item_category'),
                'i_subcategory' => $request->input('item_subcategory'), // nullable
                'i_brand' => $request->input('item_brand'),
                'i_weight' => $request->input('item_weight'), // nullable
                'landingpage_section_id' => $landingpageSectionId, // nullable
                'landingpage_sortorder' => $landingpageSortOrder, // nullable
            ]);

            // handle additional new images
            if ($request->hasFile('additional_newimages')) {
                $imageSortorder = ItemImage::where('item_id', $item->id)->max('sortorder') + 1;

                foreach ($request->file('additional_newimages') as $imgFile) {
                    $additionalImgNamewithExt = 'img_' . Str::uuid() . '.' . $imgFile->getClientOriginalExtension();

                    $additionalImgPath = $imgFile->storeAs('items/' . $uniqueFolderforItem, $additionalImgNamewithExt, 'public');

                    ItemImage::create([
                        'imgsrc' => $additionalImgPath,
                        'imgtitle' => $additionalImgNamewithExt,
                        'sortorder' => $imageSortorder++,
                        'is_main' => false,
                        'item_id' => $item->id,
                    ]);
                }
            }

            // handle removing previous additional images
            if ($request->has('remove_additional_images') && !empty($request->input('remove_additional_images'))) {
                foreach ($request->remove_additional_images as $remimgId) {
                    $imgId = intval(Hashids::decode($remimgId)[0] ?? 0);

                    $imgToRemove = ItemImage::find($imgId);

                    if ($imgToRemove) {
                        Storage::disk('public')->delete($imgToRemove->imgsrc); // delete the image from storage
                        $imgToRemove->delete();
                    }
                }

                $item->reorderImages(); // method from Item model to reorder the images
            }

            DB::commit();

            return response()->json([
                'message' => 'Item updated successfully',
                'item_name' => $item->i_name,
                'item_slug' => $item->i_slug,
            ], 200);
            // try end
        } catch (\Exception $e) {
            DB::rollBack(); // the transaction will be rolled back if an exception occurs

            Log::error('Error updating item data: ' . $e->getMessage(), ['item_id' => $itemId]); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while updating item data'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function deleteAnItem(string $itemId)
    {
        try {
            $item = Item::find(intval(Hashids::decode($itemId)[0] ?? 0));

            if (!$item) {
                return response()->json(['message' => 'Item not found'], 404);
            }

            // delete item images from storage to free up space
            $itemImages = $item->itemImages;
            foreach ($itemImages as $img) {
                Storage::disk('public')->delete($img->imgsrc);
            }

            $item->delete();

            return response()->json([
                'message' => 'Item deleted successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            Log::error('Error deleting item: ' . $e->getMessage(), ['item_id' => $itemId]); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while deleting item'], 500);
        }
    }
}
