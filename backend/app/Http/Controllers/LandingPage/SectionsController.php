<?php

namespace App\Http\Controllers\LandingPage;

use App\Http\Controllers\Controller;
use App\Models\LandingpageSection;
use App\Http\Resources\Admin\AdminLandingSectionsResource;
use App\Http\Resources\LandingItemSectionsResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Vinkla\Hashids\Facades\Hashids;

class SectionsController extends Controller
{

    /**
     * Display a listing of items sections for admin.
     */
    public function getItemSections_Admin()
    {
        try {
            $landingSectionsHere = LandingpageSection::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'sections_data' => AdminLandingSectionsResource::collection($landingSectionsHere),
                'message' => 'data retrieved successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error retrieving landingpage sections data: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while retrieving landingpage sections data'], 500);
        }
    }

    /**
     * Display a listing of items sections.
     */
    public function getItemSections()
    {
        try {
            $landingSections = LandingpageSection::with('items')->orderBy('sortorder', 'asc')->get();

            return response()->json([
                'sections_data' => LandingItemSectionsResource::collection($landingSections),
                'message' => 'data retrieved successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error retrieving landingpage sections data: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while retrieving landingpage sections data'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeNewItemSection(Request $request)
    {
        try {
            $valrules = [
                'title' => 'required|string|unique:landingpage_sections,section_title|max:255',
                'view_more_url' => 'nullable|string|max:255',
                'sortorder' => 'required|integer|min:1',
            ];

            $validator = Validator::make($request->all(), $valrules);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            DB::beginTransaction();

            $newSortorder = intval($request->input('sortorder'));

            // Shift existing sections with sortorder >= new section's sortorder
            LandingpageSection::where('sortorder', '>=', $newSortorder)
                ->increment('sortorder');

            // Create the new section
            LandingpageSection::create([
                'section_title' => $request->input('title'),
                'view_more_url' => $request->input('view_more_url'),
                'sortorder' => $newSortorder,
            ]);

            // Ensure all sections are properly ordered from 1 without gaps
            $allSections = LandingpageSection::orderBy('sortorder', 'asc')->get();
            foreach ($allSections as $index => $sect) {
                if ($sect->sortorder !== ($index + 1)) {
                    $sect->update(['sortorder' => $index + 1]);
                }
            }

            DB::commit();

            $landingSections = LandingpageSection::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'sections_data' => AdminLandingSectionsResource::collection($landingSections),
                'message' => 'Landingpage items section created',
            ], 201);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error storing landingpage items section: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while storing landingpage items section'], 500);
        }
    }

    /**
     * Update the specified resource.
     */
    public function updateItemSection(Request $request, string $sectionId)
    {
        try {
            $section = LandingpageSection::find(intval(Hashids::decode($sectionId)[0] ?? 0));

            if (!$section) {
                return response()->json(['message' => 'Section not found'], 404);
            }

            $valrules = [
                'title' => ['required', 'string', 'max:255', Rule::unique('landingpage_sections', 'section_title')->ignore($section->id)],
                'view_more_url' => 'nullable|string|max:255',
                'sortorder' => 'required|integer|min:1',
            ];

            $validator = Validator::make($request->all(), $valrules);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            DB::beginTransaction();

            $oldSortorder = $section->sortorder;
            $newSortorder = intval($request->input('sortorder'));

            // Update the section fields first
            $section->update([
                'section_title' => $request->input('title'),
                'view_more_url' => $request->input('view_more_url'),
            ]);

            // Handle sortorder changes
            if ($oldSortorder !== $newSortorder) {
                if ($newSortorder > $oldSortorder) {
                    // Moving to a higher position: shift sections down between old and new position
                    LandingpageSection::where('sortorder', '>', $oldSortorder)
                        ->where('sortorder', '<=', $newSortorder)
                        ->where('id', '!=', $section->id)
                        ->decrement('sortorder');
                } else {
                    // Moving to a lower position: shift sections up between new and old position
                    LandingpageSection::where('sortorder', '>=', $newSortorder)
                        ->where('sortorder', '<', $oldSortorder)
                        ->where('id', '!=', $section->id)
                        ->increment('sortorder');
                }

                // Update the current section's sortorder
                $section->update(['sortorder' => $newSortorder]);

                // Ensure all sections are properly ordered from 1 without gaps
                $allSections = LandingpageSection::orderBy('sortorder', 'asc')->get();
                foreach ($allSections as $index => $sect) {
                    if ($sect->sortorder !== ($index + 1)) {
                        $sect->update(['sortorder' => $index + 1]);
                    }
                }
            }

            DB::commit();

            $landingSections = LandingpageSection::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'sections_data' => AdminLandingSectionsResource::collection($landingSections),
                'message' => 'Landingpage items section updated',
            ], 200);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error updating landingpage items section: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while updating landingpage items section'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function deleteItemSection(string $sectionId)
    {
        try {
            $section = LandingpageSection::find(intval(Hashids::decode($sectionId)[0] ?? 0));

            if (!$section) {
                return response()->json(['message' => 'Section not found'], 404);
            }

            DB::beginTransaction();

            $deletedSortorder = $section->sortorder;

            // Delete the section
            $section->delete();

            // Shift down all sections with higher sortorder
            LandingpageSection::where('sortorder', '>', $deletedSortorder)
                ->decrement('sortorder');

            // Ensure all sections are properly ordered from 1 without gaps
            $allSections = LandingpageSection::orderBy('sortorder', 'asc')->get();
            foreach ($allSections as $index => $sect) {
                if ($sect->sortorder !== ($index + 1)) {
                    $sect->update(['sortorder' => $index + 1]);
                }
            }

            DB::commit();

            $landingSections = LandingpageSection::orderBy('sortorder', 'asc')->get();

            return response()->json([
                'sections_data' => AdminLandingSectionsResource::collection($landingSections),
                'message' => 'Landingpage items section deleted',
            ], 200);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error deleting landingpage items section: ' . $e->getMessage()); // Logging the exception for debugging

            return response()->json(['message' => 'An error occurred while deleting landingpage items section'], 500);
        }
    }

}
