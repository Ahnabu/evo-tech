<?php

namespace App\Http\Controllers\LandingPage;

use App\Http\Controllers\Controller;
use App\Models\TrustedBy;
use App\Http\Resources\Admin\AdminLPTrustedByResource;
use App\Http\Resources\LandingTrustedByResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Vinkla\Hashids\Facades\Hashids;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TrustedByController extends Controller
{

    /**
     * Get the trusted by data for admin.
     */
    public function getTrustedByItems_Admin()
    {
        try {
            $trustedClientsHere = TrustedBy::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'ourclientsdata' => AdminLPTrustedByResource::collection($trustedClientsHere),
                'message' => 'trusted clients retrieved successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error retrieving trusted by data: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while retrieving trusted by data'], 500);
        }
    }


    /**
     * Get the trusted by data.
     */
    public function getTrustedByItems()
    {
        try {
            $trustedClients = TrustedBy::where('is_active', true)
                ->orderBy('sortorder', 'asc')
                ->get();

            return response()->json([
                'ourclientsdata' => LandingTrustedByResource::collection($trustedClients),
                'message' => 'trusted clients retrieved successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error retrieving trusted by data: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while retrieving trusted by data'], 500);
        }
    }


    /**
     * store the trusted by item.
     */
    public function storeTrustedByItem(Request $request)
    {
        try {
            $valrules = [
                'brand_name' => 'required|string|max:255',
                'brand_logo' => 'required|mimes:jpeg,png,jpg,webp',
                'brand_url' => 'nullable|string|max:255',
                'sortorder' => 'required|integer|min:1',
                'is_active' => 'required|string|in:true,false',
            ];

            $validator = Validator::make($request->all(), $valrules);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            DB::beginTransaction();

            $newSortorder = intval($request->input('sortorder'));

            // Shift existing trusted by items with sortorder >= new item's sortorder
            TrustedBy::where('sortorder', '>=', $newSortorder)
                ->increment('sortorder');

            $brandLogo = $request->file('brand_logo');
            $brandLogoFileName = 'img_' . Str::uuid() . '.' . $brandLogo->getClientOriginalExtension();
            $brandLogoPath = $brandLogo->storeAs('ourclients', $brandLogoFileName, 'public');

            // Create the new trusted by item
            TrustedBy::create([
                'brand_name' => $request->input('brand_name'),
                'brand_logo' => $brandLogoPath,
                'brand_url' => $request->input('brand_url'),
                'sortorder' => $newSortorder,
                'is_active' => filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN),
            ]);

            // Ensure all trusted by items are properly ordered from 1 without gaps
            $allTrustedByItems = TrustedBy::orderBy('sortorder', 'asc')->get();
            foreach ($allTrustedByItems as $index => $item) {
                if ($item->sortorder !== ($index + 1)) {
                    $item->update(['sortorder' => $index + 1]);
                }
            }

            DB::commit();

            $trustedByCollection = TrustedBy::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'ourclientsdata' => AdminLPTrustedByResource::collection($trustedByCollection),
                'message' => 'trusted by item stored',
                'success' => true,
            ], 201);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error storing trusted by item: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while storing trusted by item'], 500);
        }
    }


    /**
     * update a trusted by item.
     */
    public function updateTrustedByItem(Request $request, string $trustedByItemId)
    {
        try {
            $trustedByItem = TrustedBy::find(intval(Hashids::decode($trustedByItemId)[0] ?? 0));

            if (!$trustedByItem) {
                return response()->json(['message' => 'Trusted by item not found'], 404);
            }

            $valrules = [
                'brand_name' => 'required|string|max:255',
                'brand_logo' => 'nullable|mimes:jpeg,png,jpg,webp',
                'brand_url' => 'nullable|string|max:255',
                'sortorder' => 'required|integer|min:1',
                'is_active' => 'required|string|in:true,false',
            ];

            $validator = Validator::make($request->all(), $valrules);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            DB::beginTransaction();

            $oldSortorder = $trustedByItem->sortorder;
            $newSortorder = intval($request->input('sortorder'));

            $brandLogoPath = $trustedByItem->brand_logo;
            if ($request->hasFile('brand_logo')) {
                $newbrandLogo = $request->file('brand_logo');
                $newbrandLogoFileName = 'img_' . Str::uuid() . '.' . $newbrandLogo->getClientOriginalExtension();
                $brandLogoPath = $newbrandLogo->storeAs('ourclients', $newbrandLogoFileName, 'public');

                Storage::disk('public')->delete($trustedByItem->brand_logo); // delete the old image from storage
            }

            // Update the trusted by item fields first
            $trustedByItem->update([
                'brand_name' => $request->input('brand_name'),
                'brand_logo' => $brandLogoPath,
                'brand_url' => $request->input('brand_url'),
                'is_active' => filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN),
            ]);

            // Handle sortorder changes
            if ($oldSortorder !== $newSortorder) {
                if ($newSortorder > $oldSortorder) {
                    // Moving to a higher position: shift items down between old and new position
                    TrustedBy::where('sortorder', '>', $oldSortorder)
                        ->where('sortorder', '<=', $newSortorder)
                        ->where('id', '!=', $trustedByItem->id)
                        ->decrement('sortorder');
                } else {
                    // Moving to a lower position: shift items up between new and old position
                    TrustedBy::where('sortorder', '>=', $newSortorder)
                        ->where('sortorder', '<', $oldSortorder)
                        ->where('id', '!=', $trustedByItem->id)
                        ->increment('sortorder');
                }

                // Update the current trusted by item's sortorder
                $trustedByItem->update(['sortorder' => $newSortorder]);

                // Ensure all trusted by items are properly ordered from 1 without gaps
                $allTrustedByItems = TrustedBy::orderBy('sortorder', 'asc')->get();
                foreach ($allTrustedByItems as $index => $item) {
                    if ($item->sortorder !== ($index + 1)) {
                        $item->update(['sortorder' => $index + 1]);
                    }
                }
            }

            DB::commit();

            $trustedByCollection = TrustedBy::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'ourclientsdata' => AdminLPTrustedByResource::collection($trustedByCollection),
                'message' => 'trusted by item updated',
                'success' => true,
            ], 200);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error updating trusted by item: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while updating trusted by item'], 500);
        }
    }


    /**
     * delete a trusted by item.
     */
    public function deleteTrustedByItem(string $trustedByItemId)
    {
        try {
            $trustedByItem = TrustedBy::find(intval(Hashids::decode($trustedByItemId)[0] ?? 0));

            if (!$trustedByItem) {
                return response()->json(['message' => 'Trusted by item not found'], 404);
            }

            DB::beginTransaction();

            $deletedSortorder = $trustedByItem->sortorder;

            Storage::disk('public')->delete($trustedByItem->brand_logo); // delete the image from storage

            // Delete the trusted by item
            $trustedByItem->delete();

            // Shift down all trusted by items with higher sortorder
            TrustedBy::where('sortorder', '>', $deletedSortorder)
                ->decrement('sortorder');

            // Ensure all trusted by items are properly ordered from 1 without gaps
            $allTrustedByItems = TrustedBy::orderBy('sortorder', 'asc')->get();
            foreach ($allTrustedByItems as $index => $item) {
                if ($item->sortorder !== ($index + 1)) {
                    $item->update(['sortorder' => $index + 1]);
                }
            }

            DB::commit();

            $trustedByCollection = TrustedBy::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'ourclientsdata' => AdminLPTrustedByResource::collection($trustedByCollection),
                'message' => 'trusted by item deleted',
                'success' => true,
            ], 200);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error deleting trusted by item: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while deleting trusted by item'], 500);
        }
    }


}
