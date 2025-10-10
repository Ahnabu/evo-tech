<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\ProductsAndAccessories;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Resources\Admin\AdminCategoryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Vinkla\Hashids\Facades\Hashids;

class A_CategoryController extends Controller
{
    /**
     * Get all categories for admin.
     */
    public function getAllCategories()
    {
        try {
            $categories = Category::with(['subcategories', 'brands'])
                ->orderBy('sortorder', 'asc')
                ->get();

            return response()->json([
                'categories_data' => AdminCategoryResource::collection($categories),
                'message' => 'Categories retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving categories data: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while retrieving categories'], 500);
        }
    }

    /**
     * Get specific category details by ID.
     */
    public function getCategoryDetails(string $categoryId)
    {
        try {
            $category = Category::with(['subcategories.brands', 'brands'])
                ->find(intval(Hashids::decode($categoryId)[0] ?? 0));

            if (!$category) {
                return response()->json(['message' => 'Category not found'], 404);
            }

            $categoryData = [
                'id' => Hashids::encode($category->id),
                'name' => $category->name,
                'slug' => $category->slug,
                'sortorder' => $category->sortorder,
                'active' => $category->active,
                'url' => $category->url,
                'subcategories' => $category->subcategories->map(function ($subcategory) {
                    return [
                        'id' => Hashids::encode($subcategory->id),
                        'name' => $subcategory->name,
                        'slug' => $subcategory->slug,
                        'sortorder' => $subcategory->sortorder,
                        'active' => $subcategory->active,
                        'brands_count' => $subcategory->brands->count(),
                    ];
                }),
                'brands' => $category->brands->map(function ($brand) {
                    return [
                        'id' => Hashids::encode($brand->id),
                        'name' => $brand->name,
                        'slug' => $brand->slug,
                        'active' => $brand->active,
                    ];
                }),
                'created_at' => Carbon::parse($category->created_at)->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::parse($category->updated_at)->format('Y-m-d H:i:s'),
            ];

            return response()->json([
                'category_data' => $categoryData,
                'message' => 'Category retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving category data: ' . $e->getMessage(), ['category_id' => $categoryId]);

            return response()->json(['message' => 'An error occurred while retrieving the category'], 500);
        }
    }

    /**
     * Create a new category.
     */
    public function createNewCategory(Request $request)
    {
        try {
            $valRules = [
                'name' => 'required|string|unique:categories,name|max:255',
                'slug' => 'required|string|unique:categories,slug|max:255|regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                'sortorder' => 'required|integer|min:1',
                'active' => 'required|string|in:true,false',
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400);
            }

            DB::beginTransaction();

            $newSortorder = intval($request->input('sortorder'));

            // Shift existing categories with sortorder >= new category's sortorder
            Category::where('sortorder', '>=', $newSortorder)
                ->increment('sortorder');

            // Create the new category
            $category = Category::create([
                'name' => $request->input('name'),
                'slug' => $request->input('slug'),
                'sortorder' => $newSortorder,
                'active' => filter_var($request->input('active'), FILTER_VALIDATE_BOOLEAN),
            ]);

            // Ensure all categories are properly ordered from 1 without gaps
            $allCategories = Category::orderBy('sortorder', 'asc')->get();
            foreach ($allCategories as $index => $cat) {
                if ($cat->sortorder !== ($index + 1)) {
                    $cat->update(['sortorder' => $index + 1]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'category_data' => new AdminCategoryResource($category->load(['subcategories', 'brands'])),
                'message' => 'Category created successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating category: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while creating category'], 500);
        }
    }

    /**
     * Update an existing category.
     */
    public function updateCategory(Request $request, string $categoryId)
    {
        try {
            $category = Category::find(intval(Hashids::decode($categoryId)[0] ?? 0));

            if (!$category) {
                return response()->json(['message' => 'Category not found'], 404);
            }

            $valRules = [
                'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($category->id)],
                'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('categories', 'slug')->ignore($category->id)],
                'sortorder' => 'required|integer|min:1',
                'active' => 'required|string|in:true,false',
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400);
            }

            DB::beginTransaction();

            $oldSortorder = $category->sortorder;
            $newSortorder = intval($request->input('sortorder'));

            // Update the category fields first
            $category->update([
                'name' => $request->input('name'),
                'slug' => $request->input('slug'),
                'active' => filter_var($request->input('active'), FILTER_VALIDATE_BOOLEAN),
            ]);

            // Handle sortorder changes
            if ($oldSortorder !== $newSortorder) {
                if ($newSortorder > $oldSortorder) {
                    // Moving to a higher position: shift categories down between old and new position
                    Category::where('sortorder', '>', $oldSortorder)
                        ->where('sortorder', '<=', $newSortorder)
                        ->where('id', '!=', $category->id)
                        ->decrement('sortorder');
                } else {
                    // Moving to a lower position: shift categories up between new and old position
                    Category::where('sortorder', '>=', $newSortorder)
                        ->where('sortorder', '<', $oldSortorder)
                        ->where('id', '!=', $category->id)
                        ->increment('sortorder');
                }

                // Update the current category's sortorder
                $category->update(['sortorder' => $newSortorder]);

                // Ensure all categories are properly ordered from 1 without gaps
                $allCategories = Category::orderBy('sortorder', 'asc')->get();
                foreach ($allCategories as $index => $cat) {
                    if ($cat->sortorder !== ($index + 1)) {
                        $cat->update(['sortorder' => $index + 1]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'category_data' => new AdminCategoryResource($category->load(['subcategories', 'brands'])),
                'message' => 'Category updated successfully',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating category: ' . $e->getMessage(), ['category_id' => $categoryId]);

            return response()->json(['message' => 'An error occurred while updating category'], 500);
        }
    }

    /**
     * Delete a category.
     */
    public function deleteCategory(string $categoryId)
    {
        try {
            $category = Category::find(intval(Hashids::decode($categoryId)[0] ?? 0));

            if (!$category) {
                return response()->json(['message' => 'Category not found'], 404);
            }

            // Check if category has subcategories
            if ($category->subcategories()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete category with existing subcategories'
                ], 400);
            }

            DB::beginTransaction();

            $deletedSortorder = $category->sortorder;

            // Detach all brands before deleting
            $category->brands()->detach();

            // Delete the category
            $category->delete();

            // Shift down all categories with higher sortorder
            Category::where('sortorder', '>', $deletedSortorder)
                ->decrement('sortorder');

            // Ensure all categories are properly ordered from 1 without gaps
            $allCategories = Category::orderBy('sortorder', 'asc')->get();
            foreach ($allCategories as $index => $cat) {
                if ($cat->sortorder !== ($index + 1)) {
                    $cat->update(['sortorder' => $index + 1]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting category: ' . $e->getMessage(), ['category_id' => $categoryId]);

            return response()->json(['message' => 'An error occurred while deleting category'], 500);
        }
    }
}
