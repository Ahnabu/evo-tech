<?php

namespace App\Http\Controllers\ProductsAndAccessories;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Vinkla\Hashids\Facades\Hashids;
use App\Models\Item;
use App\Models\FeaturesSectionHeader;
use App\Models\FeaturesSectionSubsection;
use App\Models\SpecificationsSection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ItemSectionsController extends Controller
{

    /**
     * Store the features section data for a specific item.
     *
     */
    public function storeFeaturesSectionData(Request $request, string $itemId)
    {
        try {
            $item = Item::find(intval(Hashids::decode($itemId)[0] ?? 0));

            if (!$item) {
                return response()->json([
                    'message' => 'Item not found',
                ], 404);
            }

            // check if the item already has features data
            $itemHasExistingFeatures = FeaturesSectionHeader::where('item_id', $item->id)->exists() || FeaturesSectionSubsection::where('item_id', $item->id)->exists();

            if ($itemHasExistingFeatures) {
                return response()->json([
                    'message' => 'Item already has features, either update or remove existing features',
                ], 400);
            }

            $valRules = [
                'features_section' => 'required|array', // was an object with `headers` and `subsections`
                'features_section.headers' => 'nullable|array|min:1', // array of objects
                'features_section.headers.*.title' => 'required|string|max:255',
                'features_section.headers.*.image' => 'required|mimes:jpeg,png,jpg,webp',
                'features_section.subsections' => 'nullable|array|min:1', // array of objects
                'features_section.subsections.*.title' => 'required|string|max:255',
                'features_section.subsections.*.content' => 'required|string',
                'features_section.subsections.*.image' => 'required|mimes:jpeg,png,jpg,webp',
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400); // bad request
            }

            DB::beginTransaction();

            $uniqueFolderforItem = explode('/', $item->i_mainimg)[1]; // folder name from the existing main image path

            $headers = $request->input('features_section.headers');

            if (!empty($headers)) {
                $headerSortOrder = 1;

                foreach ($headers as $h_idx => $header) {
                    // handle image upload
                    $h_imagefile = $request->file("features_section.headers.$h_idx.image");
                    $h_ImgNameWithExt = 'img_' . Str::uuid() . '.' . $h_imagefile->getClientOriginalExtension();
                    $h_imagePath = $h_imagefile->storeAs('items/' . $uniqueFolderforItem . '/sections', $h_ImgNameWithExt, 'public');

                    FeaturesSectionHeader::create([
                        'title' => $header['title'],
                        'imgurl' => $h_imagePath,
                        'sortorder' => $headerSortOrder++,
                        'item_id' => $item->id,
                    ]);
                }
            }

            $subsections = $request->input('features_section.subsections');

            if (!empty($subsections)) {
                $subsectionSortOrder = 1;

                foreach ($subsections as $s_idx => $subsection) {
                    // handle image upload
                    $s_imagefile = $request->file("features_section.subsections.$s_idx.image");
                    $s_imageNameWithExt = 'img_' . Str::uuid() . '.' . $s_imagefile->getClientOriginalExtension();
                    $s_imagePath = $s_imagefile->storeAs('items/' . $uniqueFolderforItem . '/sections', $s_imageNameWithExt, 'public');

                    FeaturesSectionSubsection::create([
                        'title' => $subsection['title'],
                        'content' => $subsection['content'],
                        'imgurl' => $s_imagePath,
                        'sortorder' => $subsectionSortOrder++,
                        'item_id' => $item->id,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Features data stored successfully',
            ], 201);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error storing features data: ' . $e->getMessage());
            
            return response()->json(['message' => 'An error occurred while storing features data'], 500);
        }
    }

    /**
     * Update the features section data for a specific item.
     */
    public function updateFeaturesSectionData(Request $request, string $itemId)
    {
        try {
            $item = Item::find(intval(Hashids::decode($itemId)[0] ?? 0));

            if (!$item) {
                return response()->json([
                    'message' => 'Item not found',
                ], 404);
            }

            $valRules = [
                'features_section_old' => 'nullable|array', // was an object with `headers` and `subsections`
                'features_section_old.headers' => 'nullable|array|min:1', // array of objects
                'features_section_old.headers.*.id' => 'required|string',
                'features_section_old.headers.*.title' => 'required|string|max:255',
                'features_section_old.headers.*.image' => 'nullable|mimes:jpeg,png,jpg,webp',
                'features_section_old.headers.*.sortorder' => 'required|integer',
                'features_section_old.subsections' => 'nullable|array|min:1', // array of objects
                'features_section_old.subsections.*.id' => 'required|string',
                'features_section_old.subsections.*.title' => 'required|string|max:255',
                'features_section_old.subsections.*.content' => 'required|string',
                'features_section_old.subsections.*.image' => 'nullable|mimes:jpeg,png,jpg,webp',
                'features_section_old.subsections.*.sortorder' => 'required|integer',
                'features_section_new' => 'nullable|array', // was an object with `headers` and `subsections`
                'features_section_new.headers' => 'nullable|array|min:1', // array of objects
                'features_section_new.headers.*.title' => 'required|string|max:255',
                'features_section_new.headers.*.image' => 'required|mimes:jpeg,png,jpg,webp',
                'features_section_new.subsections' => 'nullable|array|min:1', // array of objects
                'features_section_new.subsections.*.title' => 'required|string|max:255',
                'features_section_new.subsections.*.content' => 'required|string',
                'features_section_new.subsections.*.image' => 'required|mimes:jpeg,png,jpg,webp',
                'remove_features_headers' => 'nullable|array|min:1', // array of header ids to remove
                'remove_features_headers.*' => 'required|string',
                'remove_features_subsections' => 'nullable|array|min:1', // array of subsection ids to remove
                'remove_features_subsections.*' => 'required|string',
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400); // bad request
            }

            DB::beginTransaction();

            $uniqueFolderforItem = explode('/', $item->i_mainimg)[1]; // folder name from the existing main image path

            $oldHeaders = $request->input('features_section_old.headers');

            if (!empty($oldHeaders)) {

                $decodedOldHeaderIds = array_map(function ($oldheader) { // create an array of ids
                    return intval(Hashids::decode($oldheader['id'])[0]);
                }, $oldHeaders);

                FeaturesSectionHeader::where('item_id', $item->id)
                ->whereIn('id', $decodedOldHeaderIds)
                ->update(['sortorder' => DB::raw('sortorder + 5000')]); // increase sortorder to avoid conflicts

                $updateFeaturesData = [];
                foreach ($oldHeaders as $h_idx => $oldHeader) {
                    $decodedHeaderId = intval(Hashids::decode($oldHeader['id'])[0]);

                    $oldheaderRecord = FeaturesSectionHeader::find($decodedHeaderId);

                    if (isset($oldHeader['image']) && $request->hasFile("features_section_old.headers.$h_idx.image")) {
                        // delete previous and upload new image
                        Storage::disk('public')->delete($oldheaderRecord->imgurl);
                        
                        $h_newimagefile = $request->file("features_section_old.headers.$h_idx.image");
                        $h_NewImgNameWithExt = 'img_' . Str::uuid() . '.' . $h_newimagefile->getClientOriginalExtension();
                        $h_imagePath = $h_newimagefile->storeAs('items/' . $uniqueFolderforItem . '/sections', $h_NewImgNameWithExt, 'public');
                    } else {
                        $h_imagePath = $oldheaderRecord->imgurl;
                    }

                    $updateFeaturesData[$decodedHeaderId] = [
                        'title' => $oldHeader['title'],
                        'imgurl' => $h_imagePath,
                        'sortorder' => $oldHeader['sortorder'],
                    ];
                }

                FeaturesSectionHeader::where('item_id', $item->id)
                ->whereIn('id', $decodedOldHeaderIds)
                ->get()
                ->each(function ($header) use ($updateFeaturesData) {
                    $header->update($updateFeaturesData[$header->id]);
                });
                
            }

            $oldSubsections = $request->input('features_section_old.subsections');

            if (!empty($oldSubsections)) {

                $decodedOldSubsectionIds = array_map(function ($oldsubsection) { // create an array of ids
                    return intval(Hashids::decode($oldsubsection['id'])[0]);
                }, $oldSubsections);

                FeaturesSectionSubsection::where('item_id', $item->id)
                ->whereIn('id', $decodedOldSubsectionIds)
                ->update(['sortorder' => DB::raw('sortorder + 5000')]); // increase sortorder to avoid conflicts

                $updateFeaturesData = [];
                foreach ($oldSubsections as $s_idx => $oldSubsection) {
                    $decodedSubsectionId = intval(Hashids::decode($oldSubsection['id'])[0]);

                    $oldsubsectionRecord = FeaturesSectionSubsection::find($decodedSubsectionId);

                    if (isset($oldSubsection['image']) && $request->hasFile("features_section_old.subsections.$s_idx.image")) {
                        // delete previous and upload new image
                        Storage::disk('public')->delete($oldsubsectionRecord->imgurl);
                        
                        $s_newimagefile = $request->file("features_section_old.subsections.$s_idx.image");
                        $s_NewImgNameWithExt = 'img_' . Str::uuid() . '.' . $s_newimagefile->getClientOriginalExtension();
                        $s_imagePath = $s_newimagefile->storeAs('items/' . $uniqueFolderforItem . '/sections', $s_NewImgNameWithExt, 'public');
                    } else {
                        $s_imagePath = $oldsubsectionRecord->imgurl;
                    }

                    $updateFeaturesData[$decodedSubsectionId] = [
                        'title' => $oldSubsection['title'],
                        'content' => $oldSubsection['content'],
                        'imgurl' => $s_imagePath,
                        'sortorder' => $oldSubsection['sortorder'],
                    ];
                }

                FeaturesSectionSubsection::where('item_id', $item->id)
                ->whereIn('id', $decodedOldSubsectionIds)
                ->get()
                ->each(function ($subsection) use ($updateFeaturesData) {
                    $subsection->update($updateFeaturesData[$subsection->id]);
                });
                
            }

            $newHeaders = $request->input('features_section_new.headers');

            if (!empty($newHeaders)) {
                $newHeaderSortOrder = FeaturesSectionHeader::where('item_id', $item->id)->max('sortorder') + 1; // max sortorder value + 1

                foreach ($newHeaders as $newh_idx => $newHeader) {
                    // handle image upload
                    $newh_newimagefile = $request->file("features_section_new.headers.$newh_idx.image");
                    $newh_NewImgNameWithExt = 'img_' . Str::uuid() . '.' . $newh_newimagefile->getClientOriginalExtension();
                    $newh_imagePath = $newh_newimagefile->storeAs('items/' . $uniqueFolderforItem . '/sections', $newh_NewImgNameWithExt, 'public');

                    FeaturesSectionHeader::create([
                        'title' => $newHeader['title'],
                        'imgurl' => $newh_imagePath,
                        'sortorder' => $newHeaderSortOrder++,
                        'item_id' => $item->id,
                    ]);
                }
            }

            $newSubsections = $request->input('features_section_new.subsections');

            if (!empty($newSubsections)) {
                $newSubsectionSortOrder = FeaturesSectionSubsection::where('item_id', $item->id)->max('sortorder') + 1; // max sortorder value + 1

                foreach ($newSubsections as $news_idx => $newSubsection) {
                    // handle image upload
                    $news_newimagefile = $request->file("features_section_new.subsections.$news_idx.image");
                    $news_NewImgNameWithExt = 'img_' . Str::uuid() . '.' . $news_newimagefile->getClientOriginalExtension();
                    $news_imagePath = $news_newimagefile->storeAs('items/' . $uniqueFolderforItem . '/sections', $news_NewImgNameWithExt, 'public');

                    FeaturesSectionSubsection::create([
                        'title' => $newSubsection['title'],
                        'content' => $newSubsection['content'],
                        'imgurl' => $news_imagePath,
                        'sortorder' => $newSubsectionSortOrder++,
                        'item_id' => $item->id,
                    ]);
                }
            }

            $removeFeatureHeaders = $request->input('remove_features_headers');

            if (!empty($removeFeatureHeaders)) {
                $featureHeaderIdsToRemove = array_map(function ($header) { // create an array of ids
                    return intval(Hashids::decode($header)[0]);
                }, $removeFeatureHeaders);

                FeaturesSectionHeader::where('item_id', $item->id)
                ->whereIn('id', $featureHeaderIdsToRemove)
                ->get()
                ->each(function ($headerToRemove) {
                    Storage::disk('public')->delete($headerToRemove->imgurl); // delete from storage
                    $headerToRemove->delete(); // delete from db
                });
            }

            $removeFeatureSubsections = $request->input('remove_features_subsections');

            if (!empty($removeFeatureSubsections)) {
                $featureSubsectionIdsToRemove = array_map(function ($subsection) { // create an array of ids
                    return intval(Hashids::decode($subsection)[0]);
                }, $removeFeatureSubsections);

                FeaturesSectionSubsection::where('item_id', $item->id)
                ->whereIn('id', $featureSubsectionIdsToRemove)
                ->get()
                ->each(function ($subsectionToRemove) {
                    Storage::disk('public')->delete($subsectionToRemove->imgurl); // delete from storage
                    $subsectionToRemove->delete(); // delete from db
                });
            }

            DB::commit();

            return response()->json([
                'message' => 'Features data updated successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error updating features data: ' . $e->getMessage());
            
            return response()->json(['message' => 'An error occurred while updating features data'], 500);
        }
    }

    /**
     * Store the specifications section data for a specific item.
     *
     */
    public function storeSpecsSectionData(Request $request, string $itemId)
    {
        try {
            $item = Item::find(intval(Hashids::decode($itemId)[0] ?? 0));

            if (!$item) {
                return response()->json([
                    'message' => 'Item not found',
                ], 404);
            }

            // check if the item already has specs data
            $itemHasExistingSpecs = SpecificationsSection::where('item_id', $item->id)->exists();

            if ($itemHasExistingSpecs) {
                return response()->json([
                    'message' => 'Item already has specs, either update or remove existing specs',
                ], 400);
            }

            $valRules = [
                'specs_section' => 'nullable|array|min:1', // array of objects
                'specs_section.*.label' => 'required|string|max:255',
                'specs_section.*.value' => 'required|string|max:255',
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400); // bad request
            }

            DB::beginTransaction();

            $specs = $request->input('specs_section');

            if (!empty($specs)) {
                $specsSortOrder = 1;

                foreach ($specs as $spec) {
                    SpecificationsSection::create([
                        'label' => $spec['label'],
                        'value' => $spec['value'],
                        'sortorder' => $specsSortOrder++,
                        'item_id' => $item->id,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Specs data stored successfully',
            ], 201);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error storing specs data: ' . $e->getMessage());
            
            return response()->json(['message' => 'An error occurred while storing specs data'], 500);
        }
    }

    /**
     * Update the specifications section data for a specific item.
     */
    public function updateSpecsSectionData(Request $request, string $itemId)
    {
        try {
            $item = Item::find(intval(Hashids::decode($itemId)[0] ?? 0));

            if (!$item) {
                return response()->json([
                    'message' => 'Item not found',
                ], 404);
            }

            $valRules = [
                'specs_section_old' => 'nullable|array|min:1', // array of objects
                'specs_section_old.*.id' => 'required|string',
                'specs_section_old.*.label' => 'required|string|max:255',
                'specs_section_old.*.value' => 'required|string|max:255',
                'specs_section_old.*.sortorder' => 'required|integer',
                'specs_section_new' => 'nullable|array|min:1', // array of objects
                'specs_section_new.*.label' => 'required|string|max:255',
                'specs_section_new.*.value' => 'required|string|max:255',
                'remove_specs' => 'nullable|array|min:1', // array of spec ids to remove
                'remove_specs.*' => 'required|string',
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400); // bad request
            }

            DB::beginTransaction();

            $specs = $request->input('specs_section_old');

            if (!empty($specs)) {

                $decodedIds = array_map(function ($spec) { // create an array of ids
                    return intval(Hashids::decode($spec['id'])[0]);
                }, $specs);

                SpecificationsSection::where('item_id', $item->id)
                ->whereIn('id', $decodedIds)
                ->update(['sortorder' => DB::raw('sortorder + 5000')]); // increase sortorder to avoid conflicts

                $updateSpecData = [];
                foreach ($specs as $spec) {
                    $decodedSpecId = intval(Hashids::decode($spec['id'])[0]);
                    $updateSpecData[$decodedSpecId] = [
                        'label' => $spec['label'],
                        'value' => $spec['value'],
                        'sortorder' => $spec['sortorder'],
                    ];
                }

                SpecificationsSection::where('item_id', $item->id)
                ->whereIn('id', $decodedIds)
                ->get()
                ->each(function ($spec) use ($updateSpecData) {
                    $spec->update($updateSpecData[$spec->id]);
                });
                
            }

            $newSpecs = $request->input('specs_section_new');

            if (!empty($newSpecs)) {
                $newSpecsSortOrder = SpecificationsSection::where('item_id', $item->id)->max('sortorder') + 1; // max sortorder value + 1

                foreach ($newSpecs as $newspec) {
                    SpecificationsSection::create([
                        'label' => $newspec['label'],
                        'value' => $newspec['value'],
                        'sortorder' => $newSpecsSortOrder++,
                        'item_id' => $item->id,
                    ]);
                }
            }

            $removeSpecs = $request->input('remove_specs');

            if (!empty($removeSpecs)) {
                $specIdsToRemove = array_map(function ($spec) { // create an array of ids
                    return intval(Hashids::decode($spec)[0]);
                }, $removeSpecs);

                SpecificationsSection::where('item_id', $item->id)
                ->whereIn('id', $specIdsToRemove)
                ->get()
                ->each(function ($specToRemove) {
                    $specToRemove->delete(); // delete from db
                });
            }

            DB::commit();

            return response()->json([
                'message' => 'Specs data updated successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error updating specs data: ' . $e->getMessage());
            
            return response()->json(['message' => 'An error occurred while updating specs data'], 500);
        }
    }

    /**
     * Remove the features data for a specific item.
     */
    public function removeAllFeaturesOfItem(string $itemId)
    {
        try {
            $item = Item::find(intval(Hashids::decode($itemId)[0] ?? 0));

            if (!$item) {
                return response()->json([
                    'message' => 'Item not found',
                ], 404);
            }

            DB::beginTransaction();

            $headers = FeaturesSectionHeader::where('item_id', $item->id)->get();

            if ($headers->isNotEmpty()) {
                $headers->each(function ($header) {
                    Storage::disk('public')->delete($header->imgurl); // delete from storage
                    $header->delete(); // delete from db
                });
            }

            $subsections = FeaturesSectionSubsection::where('item_id', $item->id)->get();

            if ($subsections->isNotEmpty()) {
                $subsections->each(function ($subsection) {
                    Storage::disk('public')->delete($subsection->imgurl); // delete from storage
                    $subsection->delete(); // delete from db
                });
            }

            DB::commit();

            return response()->json([
                'message' => 'All features removed successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error removing all features of an item: ' . $e->getMessage());
            
            return response()->json(['message' => 'An error occurred while removing all features'], 500);
        }
    }

    /**
     * Remove the specifications data for a specific item.
     */
    public function removeAllSpecsOfItem(string $itemId)
    {
        try {
            $item = Item::find(intval(Hashids::decode($itemId)[0] ?? 0));

            if (!$item) {
                return response()->json([
                    'message' => 'Item not found',
                ], 404);
            }

            DB::beginTransaction();

            $specs = SpecificationsSection::where('item_id', $item->id)->get();

            if ($specs->isNotEmpty()) {
                $specs->each(function ($spec) {
                    $spec->delete(); // delete from db
                });
            }

            DB::commit();

            return response()->json([
                'message' => 'All specs removed successfully',
            ], 200);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error removing all specs of an item: ' . $e->getMessage());
            
            return response()->json(['message' => 'An error occurred while removing all specs'], 500);
        }
    }
}
