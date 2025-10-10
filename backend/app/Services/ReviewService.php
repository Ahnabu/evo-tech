<?php

declare(strict_types=1);

namespace App\Services;

use App\Http\Resources\ReviewResource;
use App\Models\ReviewsSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReviewService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }


    /**
     * Get the review count per star for a specific product.
     *
     * @param int $itemId The ID of the product.
     * @return array Array of review counts per star (e.g. [5, 4, 3, 2, 1])
     */
    public function getReviewCountPerStar(int $itemId): array
    {
        $reviewCounts = array_fill(0, 5, 0); // init with 0 for counts per each star

        $counts = ReviewsSection::where('item_id', $itemId)
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->pluck('count', 'rating') // makes associative array with rating as key and count as value
            ->toArray(); // convert collection to array

        // Fill the reviewCounts array based on the ratings
        if (!empty($counts)) {
            foreach ($counts as $rating => $count) {
                if ($rating >= 1 && $rating <= 5) {
                    $reviewCounts[5 - $rating] = $count;
                }
            }
        }

        return $reviewCounts;
    }


    /**
     * Get the reviews data for a specific product.
     *
     */
    public function getReviewsforAnItem(Request $request, int $itemId): array
    {
        try {
            $sortBy = $request->query('sortby', 'mosthelpful'); // default sort by most helpful

            $sortvalues = [
                'mosthelpful' => 'rating',
                'newest' => 'updated_at',
            ];

            if (!array_key_exists($sortBy, $sortvalues)) {
                $sortBy = 'mosthelpful'; // default if invalid value was provided
            }

            $reviews = ReviewsSection::where('item_id', $itemId)
                ->where('published', true)
                ->orderBy($sortvalues[$sortBy], 'desc')
                ->paginate(3);

            return [
                'reviews_count_perstar' => $this->getReviewCountPerStar($itemId),
                'reviews_data' => ReviewResource::collection($reviews->items()), // get only the items from the paginator
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'total_reviews' => $reviews->total(),
                'count_on_current' => $reviews->count(),
            ];
            // try end
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error retrieving reviews data: ' . $e->getMessage());

            return [
                'reviews_count_perstar' => [0, 0, 0, 0, 0],
                'reviews_data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'total_reviews' => 0,
                'count_on_current' => 0,
            ];
        }
    }
}
