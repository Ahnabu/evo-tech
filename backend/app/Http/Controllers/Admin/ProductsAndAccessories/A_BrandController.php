<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\ProductsAndAccessories;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Subcategory;
use App\Http\Resources\Admin\AdminBrandResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Vinkla\Hashids\Facades\Hashids;
use Carbon\Carbon;

class A_BrandController extends Controller
{
    /**
     * Get all brands for admin.
     */
    public function getAllBrands()
    {
        try {
            $brands = Brand::with(['categories', 'subcategories'])
                ->orderBy('name', 'asc')
                ->get();

            return response()->json([
                'brands_data' => AdminBrandResource::collection($brands),
                'message' => 'Brands retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving brands data: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while retrieving brands'], 500);
        }
    }

    /**
     * Get specific brand details by ID.
     */
    public function getBrandDetails(string $brandId)
    {
        try {
            $brand = Brand::with(['categories', 'subcategories.category'])
                ->find(intval(Hashids::decode($brandId)[0] ?? 0));

            if (!$brand) {
                return response()->json(['message' => 'Brand not found'], 404);
            }

            $brandData = [
                'id' => Hashids::encode($brand->id),
                'name' => $brand->name,
                'slug' => $brand->slug,
                'active' => $brand->active,
                'categories' => $brand->categories->map(function ($category) {
                    return [
                        'id' => Hashids::encode($category->id),
                        'name' => $category->name,
                        'slug' => $category->slug,
                        'active' => $category->active,
                    ];
                }),
                'subcategories' => $brand->subcategories->map(function ($subcategory) {
                    return [
                        'id' => Hashids::encode($subcategory->id),
                        'name' => $subcategory->name,
                        'slug' => $subcategory->slug,
                        'active' => $subcategory->active,
                        'category' => [
                            'id' => Hashids::encode($subcategory->category->id),
                            'name' => $subcategory->category->name,
                            'slug' => $subcategory->category->slug,
                            'active' => $subcategory->category->active,
                        ],
                    ];
                }),
                'created_at' => Carbon::parse($brand->created_at)->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::parse($brand->updated_at)->format('Y-m-d H:i:s'),
            ];

            return response()->json([
                'brand_data' => $brandData,
                'message' => 'Brand retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving brand data: ' . $e->getMessage(), ['brand_id' => $brandId]);

            return response()->json(['message' => 'An error occurred while retrieving the brand'], 500);
        }
    }

    /**
     * Create a new brand.
     */
    public function createNewBrand(Request $request)
    {
        try {
            $valRules = [
                'name' => 'required|string|unique:brands,name|max:255',
                'slug' => 'required|string|unique:brands,slug|max:255|regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                'active' => 'required|string|in:true,false',
                'categories' => 'nullable|array',
                'categories.*.id' => 'required|string',
                'categories.*.sortorder' => 'required|integer|min:1',
                'subcategories' => 'nullable|array',
                'subcategories.*.id' => 'required|string',
                'subcategories.*.sortorder' => 'required|integer|min:1',
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400);
            }

            DB::beginTransaction();

            $brand = Brand::create([
                'name' => $request->input('name'),
                'slug' => $request->input('slug'),
                'active' => filter_var($request->input('active'), FILTER_VALIDATE_BOOLEAN),
            ]);

            // Attach categories if provided
            if ($request->has('categories') && !empty($request->input('categories'))) {
                $categoryAttachments = [];
                foreach ($request->input('categories') as $categoryData) {
                    $categoryId = intval(Hashids::decode($categoryData['id'])[0] ?? 0);
                    if (Category::find($categoryId)) {
                        $categoryAttachments[$categoryId] = ['sortorder' => $categoryData['sortorder']];
                    }
                }
                if (!empty($categoryAttachments)) {
                    $brand->categories()->attach($categoryAttachments);
                }
            }

            // Attach subcategories if provided
            if ($request->has('subcategories') && !empty($request->input('subcategories'))) {
                $subcategoryAttachments = [];
                foreach ($request->input('subcategories') as $subcategoryData) {
                    $subcategoryId = intval(Hashids::decode($subcategoryData['id'])[0] ?? 0);
                    if (Subcategory::find($subcategoryId)) {
                        $subcategoryAttachments[$subcategoryId] = ['sortorder' => $subcategoryData['sortorder']];
                    }
                }
                if (!empty($subcategoryAttachments)) {
                    $brand->subcategories()->attach($subcategoryAttachments);
                }
            }

            DB::commit();

            return response()->json([
                'brand_data' => new AdminBrandResource($brand->load(['categories', 'subcategories'])),
                'message' => 'Brand has been created',
                'success' => true,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating brand: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while creating brand'], 500);
        }
    }

    /**
     * Update an existing brand.
     */
    public function updateBrand(Request $request, string $brandId)
    {
        try {
            $brand = Brand::find(intval(Hashids::decode($brandId)[0] ?? 0));

            if (!$brand) {
                return response()->json(['message' => 'Brand not found'], 404);
            }

            $valRules = [
                'name' => ['required', 'string', 'max:255', Rule::unique('brands', 'name')->ignore($brand->id)],
                'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('brands', 'slug')->ignore($brand->id)],
                'active' => 'required|string|in:true,false',
                'categories' => 'nullable|array',
                'categories.*.id' => 'required|string',
                'categories.*.sortorder' => 'required|integer|min:1',
                'subcategories' => 'nullable|array',
                'subcategories.*.id' => 'required|string',
                'subcategories.*.sortorder' => 'required|integer|min:1',
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400);
            }

            DB::beginTransaction();

            $brand->update([
                'name' => $request->input('name'),
                'slug' => $request->input('slug'),
                'active' => filter_var($request->input('active'), FILTER_VALIDATE_BOOLEAN),
            ]);

            // Sync categories
            if ($request->has('categories')) {
                $categoryAttachments = [];
                if (!empty($request->input('categories'))) {
                    foreach ($request->input('categories') as $categoryData) {
                        $categoryId = intval(Hashids::decode($categoryData['id'])[0] ?? 0);
                        if (Category::find($categoryId)) {
                            $categoryAttachments[$categoryId] = ['sortorder' => $categoryData['sortorder']];
                        }
                    }
                }
                $brand->categories()->sync($categoryAttachments);
            }

            // Sync subcategories
            if ($request->has('subcategories')) {
                $subcategoryAttachments = [];
                if (!empty($request->input('subcategories'))) {
                    foreach ($request->input('subcategories') as $subcategoryData) {
                        $subcategoryId = intval(Hashids::decode($subcategoryData['id'])[0] ?? 0);
                        if (Subcategory::find($subcategoryId)) {
                            $subcategoryAttachments[$subcategoryId] = ['sortorder' => $subcategoryData['sortorder']];
                        }
                    }
                }
                $brand->subcategories()->sync($subcategoryAttachments);
            }

            DB::commit();

            return response()->json([
                'brand_data' => new AdminBrandResource($brand->load(['categories', 'subcategories'])),
                'message' => 'Brand has been updated',
                'success' => true,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating brand: ' . $e->getMessage(), ['brand_id' => $brandId]);

            return response()->json(['message' => 'An error occurred while updating brand'], 500);
        }
    }

    /**
     * Delete a brand.
     */
    public function deleteBrand(string $brandId)
    {
        try {
            $brand = Brand::find(intval(Hashids::decode($brandId)[0] ?? 0));

            if (!$brand) {
                return response()->json(['message' => 'Brand not found'], 404);
            }

            DB::beginTransaction();

            // Detach all categories and subcategories before deleting
            $brand->categories()->detach();
            $brand->subcategories()->detach();
            
            $brand->delete();

            DB::commit();

            return response()->json([
                'message' => 'Brand got deleted',
                'success' => true,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting brand: ' . $e->getMessage(), ['brand_id' => $brandId]);

            return response()->json(['message' => 'An error occurred while deleting brand'], 500);
        }
    }
}
