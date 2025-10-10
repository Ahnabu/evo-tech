import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DiscountState = {
    discountAmount: number;
};

const initialState: DiscountState = {
    discountAmount: 0.0,
};

const discountSlice = createSlice({
    name: "discount",
    initialState,
    reducers: {
        setDiscountAmount: (state, action: PayloadAction<number>) => {
            state.discountAmount = action.payload;
        },
    },
});

export const { setDiscountAmount } = discountSlice.actions;

export default discountSlice.reducer;
