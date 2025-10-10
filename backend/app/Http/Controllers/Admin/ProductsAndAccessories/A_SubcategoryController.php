<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\ProductsAndAccessories;

use App\Http\Controllers\Controller;
use App\Models\Subcategory;
use App\Models\Category;
use App\Http\Resources\Admin\AdminSubcategoryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Vinkla\Hashids\Facades\Hashids;
use Carbon\Carbon;

class A_SubcategoryController extends Controller
{
    /**
     * Get all subcategories for admin.
     */
    public function getAllSubcategories()
    {
        try {
            $subcategories = Subcategory::with(['category', 'brands'])
                ->orderBy('sortorder', 'asc')
                ->get();

            return response()->json([
                'subcategories_data' => AdminSubcategoryResource::collection($subcategories),
                'message' => 'Subcategories retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving subcategories data: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while retrieving subcategories'], 500);
        }
    }

    /**
     * Get specific subcategory details by ID.
     */
    public function getSubcategoryDetails(string $subcategoryId)
    {
        try {
            $subcategory = Subcategory::with(['category', 'brands'])
                ->find(intval(Hashids::decode($subcategoryId)[0] ?? 0));

            if (!$subcategory) {
                return response()->json(['message' => 'Subcategory not found'], 404);
            }

            $subcategoryData = [
                'id' => Hashids::encode($subcategory->id),
                'name' => $subcategory->name,
                'slug' => $subcategory->slug,
                'sortorder' => $subcategory->sortorder,
                'active' => $subcategory->active,
                'url' => $subcategory->url,
                'category' => [
                    'id' => Hashids::encode($subcategory->category->id),
                    'name' => $subcategory->category->name,
                    'slug' => $subcategory->category->slug,
                    'active' => $subcategory->category->active,
                ],
                'brands' => $subcategory->brands->map(function ($brand) {
                    return [
                        'id' => Hashids::encode($brand->id),
                        'name' => $brand->name,
                        'slug' => $brand->slug,
                        'active' => $brand->active,
                    ];
                }),
                'created_at' => Carbon::parse($subcategory->created_at)->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::parse($subcategory->updated_at)->format('Y-m-d H:i:s'),
            ];

            return response()->json([
                'subcategory_data' => $subcategoryData,
                'message' => 'Subcategory retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving subcategory data: ' . $e->getMessage(), ['subcategory_id' => $subcategoryId]);

            return response()->json(['message' => 'An error occurred while retrieving the subcategory'], 500);
        }
    }

    /**
     * Create a new subcategory.
     */
    public function createNewSubcategory(Request $request)
    {
        try {
            $valRules = [
                'name' => 'required|string|max:255',
                'slug' => [
                    'required',
                    'string',
                    'max:255',
                    'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                    Rule::unique('subcategories')->where(function ($query) use ($request) {
                        return $query->where('category_id', intval(Hashids::decode($request->input('category_id'))[0] ?? 0));
                    }),
                ],
                'category_id' => 'required|string',
                'sortorder' => 'required|integer|min:1',
                'active' => 'required|string|in:true,false',
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400);
            }

            $categoryId = intval(Hashids::decode($request->input('category_id'))[0] ?? 0);
            $category = Category::find($categoryId);

            if (!$category) {
                return response()->json(['message' => 'Category not found'], 404);
            }

            DB::beginTransaction();

            $newSortorder = intval($request->input('sortorder'));

            // Shift existing subcategories with sortorder >= new subcategory's sortorder within the same category
            Subcategory::where('category_id', $categoryId)
                ->where('sortorder', '>=', $newSortorder)
                ->increment('sortorder');

            // Create the new subcategory
            $subcategory = Subcategory::create([
                'name' => $request->input('name'),
                'slug' => $request->input('slug'),
                'category_id' => $categoryId,
                'sortorder' => $newSortorder,
                'active' => filter_var($request->input('active'), FILTER_VALIDATE_BOOLEAN),
            ]);

            // Ensure all subcategories within this category are properly ordered from 1 without gaps
            $allSubcategories = Subcategory::where('category_id', $categoryId)
                ->orderBy('sortorder', 'asc')
                ->get();
            foreach ($allSubcategories as $index => $subcat) {
                if ($subcat->sortorder !== ($index + 1)) {
                    $subcat->update(['sortorder' => $index + 1]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'subcategory_data' => new AdminSubcategoryResource($subcategory->load(['category', 'brands'])),
                'message' => 'Subcategory created successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating subcategory: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while creating subcategory'], 500);
        }
    }

    /**
     * Update an existing subcategory.
     */
    public function updateSubcategory(Request $request, string $subcategoryId)
    {
        try {
            $subcategory = Subcategory::find(intval(Hashids::decode($subcategoryId)[0] ?? 0));

            if (!$subcategory) {
                return response()->json(['message' => 'Subcategory not found'], 404);
            }

            $valRules = [
                'name' => 'required|string|max:255',
                'slug' => [
                    'required',
                    'string',
                    'max:255',
                    'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                    Rule::unique('subcategories')->where(function ($query) use ($request, $subcategory) {
                        return $query->where('category_id', intval(Hashids::decode($request->input('category_id'))[0] ?? 0))
                            ->where('id', '!=', $subcategory->id);
                    }),
                ],
                'category_id' => 'required|string',
                'sortorder' => 'required|integer|min:1',
                'active' => 'required|string|in:true,false',
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400);
            }

            $categoryId = intval(Hashids::decode($request->input('category_id'))[0] ?? 0);
            $category = Category::find($categoryId);

            if (!$category) {
                return response()->json(['message' => 'Category not found'], 404);
            }

            DB::beginTransaction();

            $oldSortorder = $subcategory->sortorder;
            $oldCategoryId = $subcategory->category_id;
            $newSortorder = intval($request->input('sortorder'));

            // Update the subcategory fields first
            $subcategory->update([
                'name' => $request->input('name'),
                'slug' => $request->input('slug'),
                'category_id' => $categoryId,
                'active' => filter_var($request->input('active'), FILTER_VALIDATE_BOOLEAN),
            ]);

            // Handle sortorder changes within the same category or when moving to a different category
            if ($oldCategoryId !== $categoryId) {
                // Moving to a different category
                
                // Shift down subcategories in the old category
                Subcategory::where('category_id', $oldCategoryId)
                    ->where('sortorder', '>', $oldSortorder)
                    ->decrement('sortorder');

                // Ensure proper ordering in old category
                $oldCategorySubcategories = Subcategory::where('category_id', $oldCategoryId)
                    ->orderBy('sortorder', 'asc')
                    ->get();
                foreach ($oldCategorySubcategories as $index => $subcat) {
                    if ($subcat->sortorder !== ($index + 1)) {
                        $subcat->update(['sortorder' => $index + 1]);
                    }
                }

                // Shift up subcategories in the new category
                Subcategory::where('category_id', $categoryId)
                    ->where('sortorder', '>=', $newSortorder)
                    ->where('id', '!=', $subcategory->id)
                    ->increment('sortorder');

                // Update the current subcategory's sortorder
                $subcategory->update(['sortorder' => $newSortorder]);

                // Ensure proper ordering in new category
                $newCategorySubcategories = Subcategory::where('category_id', $categoryId)
                    ->orderBy('sortorder', 'asc')
                    ->get();
                foreach ($newCategorySubcategories as $index => $subcat) {
                    if ($subcat->sortorder !== ($index + 1)) {
                        $subcat->update(['sortorder' => $index + 1]);
                    }
                }
            } elseif ($oldSortorder !== $newSortorder) {
                // Staying in the same category but changing sortorder
                
                if ($newSortorder > $oldSortorder) {
                    // Moving to a higher position: shift subcategories down between old and new position
                    Subcategory::where('category_id', $categoryId)
                        ->where('sortorder', '>', $oldSortorder)
                        ->where('sortorder', '<=', $newSortorder)
                        ->where('id', '!=', $subcategory->id)
                        ->decrement('sortorder');
                } else {
                    // Moving to a lower position: shift subcategories up between new and old position
                    Subcategory::where('category_id', $categoryId)
                        ->where('sortorder', '>=', $newSortorder)
                        ->where('sortorder', '<', $oldSortorder)
                        ->where('id', '!=', $subcategory->id)
                        ->increment('sortorder');
                }

                // Update the current subcategory's sortorder
                $subcategory->update(['sortorder' => $newSortorder]);

                // Ensure all subcategories within this category are properly ordered from 1 without gaps
                $allSubcategories = Subcategory::where('category_id', $categoryId)
                    ->orderBy('sortorder', 'asc')
                    ->get();
                foreach ($allSubcategories as $index => $subcat) {
                    if ($subcat->sortorder !== ($index + 1)) {
                        $subcat->update(['sortorder' => $index + 1]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'subcategory_data' => new AdminSubcategoryResource($subcategory->load(['category', 'brands'])),
                'message' => 'Subcategory updated successfully',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating subcategory: ' . $e->getMessage(), ['subcategory_id' => $subcategoryId]);

            return response()->json(['message' => 'An error occurred while updating subcategory'], 500);
        }
    }

    /**
     * Delete a subcategory.
     */
    public function deleteSubcategory(string $subcategoryId)
    {
        try {
            $subcategory = Subcategory::find(intval(Hashids::decode($subcategoryId)[0] ?? 0));

            if (!$subcategory) {
                return response()->json(['message' => 'Subcategory not found'], 404);
            }

            DB::beginTransaction();

            $deletedSortorder = $subcategory->sortorder;
            $categoryId = $subcategory->category_id;

            // Detach all brands before deleting
            $subcategory->brands()->detach();
            
            // Delete the subcategory
            $subcategory->delete();

            // Shift down all subcategories with higher sortorder within the same category
            Subcategory::where('category_id', $categoryId)
                ->where('sortorder', '>', $deletedSortorder)
                ->decrement('sortorder');

            // Ensure all subcategories within this category are properly ordered from 1 without gaps
            $allSubcategories = Subcategory::where('category_id', $categoryId)
                ->orderBy('sortorder', 'asc')
                ->get();
            foreach ($allSubcategories as $index => $subcat) {
                if ($subcat->sortorder !== ($index + 1)) {
                    $subcat->update(['sortorder' => $index + 1]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Subcategory deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting subcategory: ' . $e->getMessage(), ['subcategory_id' => $subcategoryId]);

            return response()->json(['message' => 'An error occurred while deleting subcategory'], 500);
        }
    }
} 