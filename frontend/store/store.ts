import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/store/slices/cartslice";
import discountReducer from "@/store/slices/discountSlice";
import productReducer from "@/store/slices/productSlice";
import orderReducer from "@/store/slices/orderSlice";
import heroSectionReducer from "@/store/slices/heroSectionSlice";
import featuredSectionReducer from "@/store/slices/featuredSectionSlice";
import ourClientsReducer from "@/store/slices/ourClientsSlice";
import taxonomyReducer from "@/store/slices/taxonomySlice";
import categoryReducer from "@/store/slices/categorySlice";
import subcategoryReducer from "@/store/slices/subcategorySlice";
import brandReducer from "@/store/slices/brandSlice";


const store = configureStore({
    reducer: {
        shoppingcart: cartReducer,
        discount: discountReducer,
        products: productReducer,
        orders: orderReducer,
        heroSections: heroSectionReducer,
        featuredSections: featuredSectionReducer,
        ourClients: ourClientsReducer,
        taxonomy: taxonomyReducer,
        categories: categoryReducer,
        subcategories: subcategoryReducer,
        brands: brandReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
