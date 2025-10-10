<?php

declare(strict_types=1);


namespace App\Http\Controllers\Taxonomy;

use App\Http\Controllers\Controller;
use App\Services\TaxonomyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TaxonomyController extends Controller
{
    protected $taxonomyService;

    /**
     * Create a new controller instance.
     */
    public function __construct(TaxonomyService $taxonomyService)
    {
        $this->taxonomyService = $taxonomyService;
    }

    /**
     * Get all taxonomy data including categories, subcategories, and brands.
     * This is a public API used for navbar rendering and admin dashboard.
     */
    public function getTaxonomyAllData()
    {
        try {
            $taxonomyData = $this->taxonomyService->getTaxonomyData();

            return response()->json([
                'taxonomy_data' => $taxonomyData,
                'message' => 'Taxonomy data retrieved successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            Log::error('Error retrieving taxonomy data: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while retrieving taxonomy data'], 500);
        }
    }
}
