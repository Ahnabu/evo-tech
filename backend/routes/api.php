<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use App\Http\Controllers\ProductsAndAccessories\ItemController;
use App\Http\Controllers\ProductsAndAccessories\ItemSectionsController;
use App\Http\Controllers\Admin\ProductsAndAccessories\A_ItemController;
use App\Http\Controllers\Admin\Orders\A_OrderController;
use App\Http\Controllers\LandingPage\TopCarouselController;
use App\Http\Controllers\LandingPage\TrustedByController;
use App\Http\Controllers\LandingPage\SectionsController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Auth\RegistrationController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Taxonomy\TaxonomyController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Admin\ProductsAndAccessories\A_CategoryController;
use App\Http\Controllers\Admin\ProductsAndAccessories\A_SubcategoryController;
use App\Http\Controllers\Admin\ProductsAndAccessories\A_BrandController;
use Illuminate\Http\Request;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Here is where you can register API routes for your application.
|
*/


Route::get('/unauthorized-user', function () {
    return response()->json(['message' => 'Please Login First'], 401);
})->name('unauthorized.login');


// auth routes----------------------------------------------------------------
Route::post('/signin-user', [LoginController::class, 'signin'])->name('signin.user');
Route::post('/signin-oauthuser', [LoginController::class, 'oauthSignin'])->name('signin.oauthuser');
Route::post('/signup-user', [RegistrationController::class, 'signupUser'])->name('signup.user');


// admin accessible routes goes here--------------------------------------------------------------------------
// Route::middleware(['verifyJWT'])->prefix('admin')->name('admin.')->group(static function (): void {
Route::prefix('admin')->name('admin.')->group(static function (): void {

    // landing page routes
    Route::get('/lp/topcarousel', [TopCarouselController::class, 'getTopCarouselItems_Admin'])->name('lptcarousel.view');
    Route::post('/lp/topcarousel/add', [TopCarouselController::class, 'storeTopCarouselItem'])->name('lptcarousel.add');
    Route::post('/lp/topcarousel/update/{cItemId}', [TopCarouselController::class, 'updateTopCarouselItem'])->name('lptcarousel.update');
    Route::delete('/lp/topcarousel/delete/{cItemId}', [TopCarouselController::class, 'deleteTopCarouselItem'])->name('lptcarousel.delete');
    
    Route::get('/lp/sections', [SectionsController::class, 'getItemSections_Admin'])->name('lpsections.view');
    Route::post('/lp/sections/create', [SectionsController::class, 'storeNewItemSection'])->name('lpsections.create');
    Route::put('/lp/sections/update/{sectionId}', [SectionsController::class, 'updateItemSection'])->name('lpsections.update');
    Route::delete('/lp/sections/delete/{sectionId}', [SectionsController::class, 'deleteItemSection'])->name('lpsections.delete');

    Route::get('/lp/ourclients', [TrustedByController::class, 'getTrustedByItems_Admin'])->name('lpourclients.view');
    Route::post('/lp/ourclients/add', [TrustedByController::class, 'storeTrustedByItem'])->name('lpourclients.add');
    Route::post('/lp/ourclients/update/{trustedByItemId}', [TrustedByController::class, 'updateTrustedByItem'])->name('lpourclients.update');
    Route::delete('/lp/ourclients/delete/{trustedByItemId}', [TrustedByController::class, 'deleteTrustedByItem'])->name('lpourclients.delete');

    // item routes
    Route::get('/items/allitems', [A_ItemController::class, 'getAllItemsForAdmin'])->name('viewitems.all');
    Route::get('/items/item/{itemSlug}', [A_ItemController::class, 'getSpecificItemBySlugForAdmin'])->name('viewitem.byslug');
    Route::post('/items/create', [A_ItemController::class, 'storeNewItem'])->name('item.create');
    Route::post('/items/update/{itemId}', [A_ItemController::class, 'updateAnItem'])->name('item.update');
    Route::delete('/items/delete/{itemId}', [A_ItemController::class, 'deleteAnItem'])->name('item.delete');
    Route::patch('/items/{itemId}/toggle-published', [A_ItemController::class, 'togglePublishedStatus'])->name('item.toggle_published');

    // category routes
    Route::get('/category/all', [A_CategoryController::class, 'getAllCategories'])->name('category.all');
    Route::get('/category/view/{categoryId}', [A_CategoryController::class, 'getCategoryDetails'])->name('category.details');
    Route::post('/category/create', [A_CategoryController::class, 'createNewCategory'])->name('category.create');
    Route::put('/category/update/{categoryId}', [A_CategoryController::class, 'updateCategory'])->name('category.update');
    Route::delete('/category/delete/{categoryId}', [A_CategoryController::class, 'deleteCategory'])->name('category.delete');

    // subcategory routes
    Route::get('/subcategory/all', [A_SubcategoryController::class, 'getAllSubcategories'])->name('subcategory.all');
    Route::get('/subcategory/view/{subcategoryId}', [A_SubcategoryController::class, 'getSubcategoryDetails'])->name('subcategory.details');
    Route::post('/subcategory/create', [A_SubcategoryController::class, 'createNewSubcategory'])->name('subcategory.create');
    Route::put('/subcategory/update/{subcategoryId}', [A_SubcategoryController::class, 'updateSubcategory'])->name('subcategory.update');
    Route::delete('/subcategory/delete/{subcategoryId}', [A_SubcategoryController::class, 'deleteSubcategory'])->name('subcategory.delete');

    // brand routes
    Route::get('/brand/all', [A_BrandController::class, 'getAllBrands'])->name('brand.all');
    Route::get('/brand/view/{brandId}', [A_BrandController::class, 'getBrandDetails'])->name('brand.details');
    Route::post('/brand/create', [A_BrandController::class, 'createNewBrand'])->name('brand.create');
    Route::post('/brand/update/{brandId}', [A_BrandController::class, 'updateBrand'])->name('brand.update');
    Route::delete('/brand/delete/{brandId}', [A_BrandController::class, 'deleteBrand'])->name('brand.delete');

    // item sections routes
    Route::post('/item/{itemId}/features/add', [ItemSectionsController::class, 'storeFeaturesSectionData'])->name('ifeatures.add');
    Route::post('/item/{itemId}/features/update', [ItemSectionsController::class, 'updateFeaturesSectionData'])->name('ifeatures.update');
    Route::delete('/item/{itemId}/features/deleteall', [ItemSectionsController::class, 'removeAllFeaturesOfItem'])->name('ifeatures.deleteall');
    
    Route::post('/item/{itemId}/specs/add', [ItemSectionsController::class, 'storeSpecsSectionData'])->name('ispecifications.add');
    Route::post('/item/{itemId}/specs/update', [ItemSectionsController::class, 'updateSpecsSectionData'])->name('ispecifications.update');
    Route::delete('/item/{itemId}/specs/deleteall', [ItemSectionsController::class, 'removeAllSpecsOfItem'])->name('ispecifications.deleteall');

    // order routes
    Route::get('/order/allorders', [A_OrderController::class, 'getAllOrdersForAdmin'])->name('order.all');
    Route::get('/order/view/{orderId}', [A_OrderController::class, 'getOrderDetailsById'])->name('order.details');
    Route::put('/order/update-statuses/{orderId}', [A_OrderController::class, 'updateOrderStatuses'])->name('order.update.statuses');
    Route::delete('/order/delete/{orderId}', [A_OrderController::class, 'deleteAnOrder'])->name('order.delete');
});



// taxonomy routes
Route::name('taxonomy.')->group(static function (): void {
    Route::get('/taxonomy/alldata', [TaxonomyController::class, 'getTaxonomyAllData'])->name('alldata');
});


// landing page routes
Route::name('landingpage.')->group(static function (): void {

    Route::get('/landingpage/topcarousel', [TopCarouselController::class, 'getTopCarouselItems'])->name('topcarousel.view');
    Route::get('/landingpage/itemsections', [SectionsController::class, 'getItemSections'])->name('sections.view');
    Route::get('/landingpage/ourclients', [TrustedByController::class, 'getTrustedByItems'])->name('ourclients.view');
});


// items routes
Route::name('items.')->group(static function (): void {
    
    Route::get('/items/category/{category}', [ItemController::class, 'getAllItemsByCategory'])->name('bycategory');
    Route::get('/items/item/{itemSlug}', [ItemController::class, 'getSpecificItemBySlug'])->name('byslug');
    Route::get('/item/{itemId}/reviews', [ItemController::class, 'getReviewsForAnItem'])->name('itemreviews');
});


// reviews routes
Route::name('reviews.')->group(static function (): void {

});


// cart routes
Route::name('cart.')->group(static function (): void {

    Route::get('/cart', [CartController::class, 'getCartOfUser'])->name('ofuser');
    Route::post('/cart/add', [CartController::class, 'addToCart'])->name('additem');
    Route::put('/cart/update', [CartController::class, 'updateSingleCartItem'])->name('updateitem');
    Route::put('/cart/updatebatch', [CartController::class, 'updateBatchCartItems'])->name('updatebatch');
    Route::delete('/cart/remove', [CartController::class, 'removeCartItem'])->name('removeitem');
});


// order routes
Route::name('order.')->group(static function (): void {

    Route::get('/order/{orderId}', [OrderController::class, 'showOrderInfoByID'])->name('showbyOrderid');
    Route::post('/order/place', [OrderController::class, 'placeNewOrder'])->name('placeorder');
});




/*
|--------------------------------------------------------------------------------------
| Fallback routes, to prevent a rendered HTML page in /api/* routes,
| The '/' route is also included since the fallback is not triggered on the root route
|--------------------------------------------------------------------------------------
*/
Route::get('/', function (): void {
    throw new NotFoundHttpException('API resource not found');
});
Route::fallback(function (): void {
    throw new NotFoundHttpException('API resource not found');
});
