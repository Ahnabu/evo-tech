<?php

namespace App\Http\Controllers\LandingPage;

use App\Http\Controllers\Controller;
use App\Models\LandingpageTopCarousel;
use App\Http\Resources\LandingpageTopCarouselResource;
use App\Http\Resources\Admin\AdminLPTopCarouselResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Vinkla\Hashids\Facades\Hashids;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TopCarouselController extends Controller
{
    
    /**
     * Get the top carousel data for admin.
     */
    public function getTopCarouselItems_Admin()
    {
        try {
            $topCarouselItemsHere = LandingpageTopCarousel::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'topcarousel_data' => AdminLPTopCarouselResource::collection($topCarouselItemsHere),
                'message' => 'Top carousel data retrieved',
            ], 200);
            // try end
        } catch (\Exception $e) {
            
            Log::error('Error retrieving top carousel items: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while retrieving top carousel items'], 500);
        }
    }


    /**
     * Get the top carousel data.
     */
    public function getTopCarouselItems()
    {
        try {
            $topCarouselItems = LandingpageTopCarousel::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'topcarousel_data' => LandingpageTopCarouselResource::collection($topCarouselItems),
                'message' => 'Top carousel data retrieved successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            
            Log::error('Error retrieving top carousel items: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while retrieving top carousel items'], 500);
        }
    }


    /**
     * Store a new top carousel item in storage.
     */
    public function storeTopCarouselItem(Request $request)
    {
        try {
            $valrules = [
                'title' => 'required|string|max:255',
                'subtitle' => 'nullable|string|max:255',
                'more_text' => 'nullable|string',
                'button_text' => 'nullable|string|max:255',
                'button_url' => 'nullable|string|max:255',
                'image' => 'required|mimes:jpeg,png,jpg,webp',
                'sortorder' => 'required|integer|min:1',
            ];

            $validator = Validator::make($request->all(), $valrules);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            DB::beginTransaction();

            $newSortorder = intval($request->input('sortorder'));

            // Shift existing carousel items with sortorder >= new item's sortorder
            LandingpageTopCarousel::where('sortorder', '>=', $newSortorder)
                ->increment('sortorder');

            $carouselimage = $request->file('image');
            $carouselImageName = 'img_' . Str::uuid() . '.' . $carouselimage->getClientOriginalExtension();
            $carouselImagePath = $carouselimage->storeAs('lp_topcarousel', $carouselImageName, 'public');

            // Create the new carousel item
            LandingpageTopCarousel::create([
                'title' => $request->input('title'),
                'subtitle' => $request->input('subtitle'),
                'more_text' => $request->input('more_text'),
                'button_text' => $request->input('button_text'),
                'button_url' => $request->input('button_url'),
                'imgurl' => $carouselImagePath,
                'sortorder' => $newSortorder,
            ]);

            // Ensure all carousel items are properly ordered from 1 without gaps
            $allCarouselItems = LandingpageTopCarousel::orderBy('sortorder', 'asc')->get();
            foreach ($allCarouselItems as $index => $item) {
                if ($item->sortorder !== ($index + 1)) {
                    $item->update(['sortorder' => $index + 1]);
                }
            }

            DB::commit();

            $topCarouselItems = LandingpageTopCarousel::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'topcarousel_data' => AdminLPTopCarouselResource::collection($topCarouselItems),
                'message' => 'Top carousel item stored',
                'success' => true,
            ], 201);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error storing top carousel item: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while storing top carousel item'], 500);
        }
    }


    /**
     * Update the specified top carousel item in storage.
     */
    public function updateTopCarouselItem(Request $request, string $cItemId)
    {
        try {
            $carouselItem = LandingpageTopCarousel::find(intval(Hashids::decode($cItemId)[0] ?? 0));

            if (!$carouselItem) {
                return response()->json(['message' => 'Carousel item not found'], 404);
            }

            $valrules = [
                'title' => 'required|string|max:255',
                'subtitle' => 'nullable|string|max:255',
                'more_text' => 'nullable|string',
                'button_text' => 'nullable|string|max:255',
                'button_url' => 'nullable|string|max:255',
                'image' => 'nullable|mimes:jpeg,png,jpg,webp',
                'sortorder' => 'required|integer|min:1',
            ];

            $validator = Validator::make($request->all(), $valrules);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            DB::beginTransaction();

            $oldSortorder = $carouselItem->sortorder;
            $newSortorder = intval($request->input('sortorder'));

            $carouselImagePath = $carouselItem->imgurl;

            if ($request->hasFile('image')) {
                $carouselNewImage = $request->file('image');
                $carouselNewImageName = 'img_' . Str::uuid() . '.' . $carouselNewImage->getClientOriginalExtension();
                $carouselImagePath = $carouselNewImage->storeAs('lp_topcarousel', $carouselNewImageName, 'public');

                Storage::disk('public')->delete($carouselItem->imgurl); // delete the old image from storage
            }

            // Update the carousel item fields first
            $carouselItem->update([
                'title' => $request->input('title'),
                'subtitle' => $request->input('subtitle'),
                'more_text' => $request->input('more_text'),
                'button_text' => $request->input('button_text'),
                'button_url' => $request->input('button_url'),
                'imgurl' => $carouselImagePath,
            ]);

            // Handle sortorder changes
            if ($oldSortorder !== $newSortorder) {
                if ($newSortorder > $oldSortorder) {
                    // Moving to a higher position: shift items down between old and new position
                    LandingpageTopCarousel::where('sortorder', '>', $oldSortorder)
                        ->where('sortorder', '<=', $newSortorder)
                        ->where('id', '!=', $carouselItem->id)
                        ->decrement('sortorder');
                } else {
                    // Moving to a lower position: shift items up between new and old position
                    LandingpageTopCarousel::where('sortorder', '>=', $newSortorder)
                        ->where('sortorder', '<', $oldSortorder)
                        ->where('id', '!=', $carouselItem->id)
                        ->increment('sortorder');
                }

                // Update the current carousel item's sortorder
                $carouselItem->update(['sortorder' => $newSortorder]);

                // Ensure all carousel items are properly ordered from 1 without gaps
                $allCarouselItems = LandingpageTopCarousel::orderBy('sortorder', 'asc')->get();
                foreach ($allCarouselItems as $index => $item) {
                    if ($item->sortorder !== ($index + 1)) {
                        $item->update(['sortorder' => $index + 1]);
                    }
                }
            }

            DB::commit();

            $topCarouselItems = LandingpageTopCarousel::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'topcarousel_data' => AdminLPTopCarouselResource::collection($topCarouselItems),
                'message' => 'Top carousel item updated',
                'success' => true,
            ], 200);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error updating top carousel item: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while updating top carousel item'], 500);
        }
    }


    /**
     * Remove the specified top carousel item from storage.
     */
    public function deleteTopCarouselItem(string $cItemId)
    {
        try {
            $carouselItem = LandingpageTopCarousel::find(intval(Hashids::decode($cItemId)[0] ?? 0));

            if (!$carouselItem) {
                return response()->json(['message' => 'Carousel item not found'], 404);
            }

            DB::beginTransaction();

            $deletedSortorder = $carouselItem->sortorder;

            Storage::disk('public')->delete($carouselItem->imgurl); // delete the image from storage
            
            // Delete the carousel item
            $carouselItem->delete();

            // Shift down all carousel items with higher sortorder
            LandingpageTopCarousel::where('sortorder', '>', $deletedSortorder)
                ->decrement('sortorder');

            // Ensure all carousel items are properly ordered from 1 without gaps
            $allCarouselItems = LandingpageTopCarousel::orderBy('sortorder', 'asc')->get();
            foreach ($allCarouselItems as $index => $item) {
                if ($item->sortorder !== ($index + 1)) {
                    $item->update(['sortorder' => $index + 1]);
                }
            }

            DB::commit();

            $topCarouselItems = LandingpageTopCarousel::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'topcarousel_data' => AdminLPTopCarouselResource::collection($topCarouselItems),
                'message' => 'Top carousel item deleted',
                'success' => true,
            ], 200);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error deleting top carousel item: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while deleting top carousel item'], 500);
        }
    }

    
}
