<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Category;
use Vinkla\Hashids\Facades\Hashids;

class TaxonomyService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }


    public function getTaxonomyData()
    {
        return Category::active()
            ->ordered()
            ->with([
                'subcategories' => function ($query) {
                    $query->active()->ordered();
                },
                'subcategories.brands' => function ($query) {
                    $query->active()->orderBy('subcategory_brand.sortorder');
                },
                'brands' => function ($query) {
                    $query->active()->orderBy('category_brand.sortorder');
                }
            ])
            ->get()
            ->map(function ($category) {
                return [
                    'id' => Hashids::encode($category->id),
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'url' => $category->url,
                    'has_subcategories' => $category->subcategories->isNotEmpty(),
                    'subcategories' => $category->subcategories->map(function ($subcategory) use ($category) {
                        return [
                            'id' => Hashids::encode($subcategory->id),
                            'name' => $subcategory->name,
                            'slug' => $subcategory->slug,
                            'url' => $subcategory->url,
                            'brands' => $subcategory->brands->map(function ($brand) use ($category, $subcategory) {
                                return [
                                    'id' => Hashids::encode($brand->id),
                                    'name' => $brand->name,
                                    'slug' => $brand->slug,
                                    'url' => $brand->getUrlForContext($category, $subcategory),
                                ];
                            }),
                        ];
                    }),
                    'direct_brands' => $category->brands->map(function ($brand) use ($category) {
                        return [
                            'id' => Hashids::encode($brand->id),
                            'name' => $brand->name,
                            'slug' => $brand->slug,
                            'url' => $brand->getUrlForContext($category),
                        ];
                    }),
                ];
            });
    }
}
