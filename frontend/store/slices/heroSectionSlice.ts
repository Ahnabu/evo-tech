import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HeroSectionDisplayType } from "@/schemas/admin/setupconfig/homepage/heroSection/heroSchema";

interface HeroSectionState {
    allHeroItems: {
        data: HeroSectionDisplayType[];
        fetched: boolean;
    };
}

const initialState: HeroSectionState = {
    allHeroItems: {
        data: [],
        fetched: false,
    }
};

const heroSectionSlice = createSlice({
    name: "heroSections",
    initialState,
    reducers: {
        setHeroSectionsList: (state, action: PayloadAction<{ data: HeroSectionDisplayType[]; fetchedStatus: boolean; }>) => {
            state.allHeroItems.data = action.payload.data;
            state.allHeroItems.fetched = action.payload.fetchedStatus;
        },

        addAHeroSection: (state, action: PayloadAction<HeroSectionDisplayType>) => {
            const newHeroItem = action.payload;
            
            // Shift existing hero items with sortorder >= newHeroItem.sortorder
            state.allHeroItems.data.forEach(heroItem => {
                if (heroItem.sortorder >= newHeroItem.sortorder) {
                    heroItem.sortorder++;
                }
            });
            
            // Add the new hero item
            state.allHeroItems.data.push(newHeroItem);
            
            // Ensure all hero items are properly ordered from 1 without gaps
            const sortedHeroItems = [...state.allHeroItems.data].sort((a, b) => a.sortorder - b.sortorder);
            sortedHeroItems.forEach((heroItem, index) => {
                if (heroItem.sortorder !== (index + 1)) {
                    heroItem.sortorder = index + 1;
                }
            });
            
            // reorder the hero items in the state
            state.allHeroItems.data = sortedHeroItems;
        },

        updateAHeroSection: (state, action: PayloadAction<HeroSectionDisplayType>) => {
            const updatedHeroItem = action.payload;
            const index = state.allHeroItems.data.findIndex(
                heroItem => heroItem.tcarousel_itemid === updatedHeroItem.tcarousel_itemid
            );
            
            if (index !== -1) {
                const oldHeroItem = state.allHeroItems.data[index];
                const oldSortorder = oldHeroItem.sortorder;
                const newSortorder = updatedHeroItem.sortorder;

                // First update the hero item fields (except sortorder initially)
                state.allHeroItems.data[index] = {
                    ...updatedHeroItem,
                    sortorder: oldSortorder,
                };

                // Handle sortorder changes
                if (oldSortorder !== newSortorder) {
                    if (newSortorder > oldSortorder) {
                        // Moving to a higher position: shift hero items down between old and new position
                        state.allHeroItems.data.forEach(heroItem => {
                            if (heroItem.tcarousel_itemid !== updatedHeroItem.tcarousel_itemid && 
                                heroItem.sortorder > oldSortorder && 
                                heroItem.sortorder <= newSortorder) {
                                heroItem.sortorder--;
                            }
                        });
                    } else {
                        // Moving to a lower position: shift hero items up between new and old position
                        state.allHeroItems.data.forEach(heroItem => {
                            if (heroItem.tcarousel_itemid !== updatedHeroItem.tcarousel_itemid && 
                                heroItem.sortorder >= newSortorder && 
                                heroItem.sortorder < oldSortorder) {
                                heroItem.sortorder++;
                            }
                        });
                    }

                    // update the current hero item's sortorder
                    state.allHeroItems.data[index].sortorder = newSortorder;

                    // Ensure all hero items are properly ordered from 1 without gaps
                    const sortedHeroItems = [...state.allHeroItems.data].sort((a, b) => a.sortorder - b.sortorder);
                    sortedHeroItems.forEach((heroItem, index) => {
                        if (heroItem.sortorder !== (index + 1)) {
                            heroItem.sortorder = index + 1;
                        }
                    });

                    // reorder the hero items in the state
                    state.allHeroItems.data = sortedHeroItems;
                }
            }
        },

        removeAHeroSection: (state, action: PayloadAction<{ carouselItemId: string; }>) => {
            const heroItemToRemove = state.allHeroItems.data.find(
                heroItem => heroItem.tcarousel_itemid === action.payload.carouselItemId
            );
            
            if (heroItemToRemove) {
                // Remove the hero item
                state.allHeroItems.data = state.allHeroItems.data.filter(
                    heroItem => heroItem.tcarousel_itemid !== action.payload.carouselItemId
                );
                
                // Shift down all hero items with higher sortorder
                state.allHeroItems.data.forEach(heroItem => {
                    if (heroItem.sortorder > heroItemToRemove.sortorder) {
                        heroItem.sortorder--;
                    }
                });
                
                // Ensure all hero items are properly ordered from 1 without gaps
                const sortedHeroItems = [...state.allHeroItems.data].sort((a, b) => a.sortorder - b.sortorder);
                sortedHeroItems.forEach((heroItem, index) => {
                    if (heroItem.sortorder !== (index + 1)) {
                        heroItem.sortorder = index + 1;
                    }
                });
                
                // reorder the hero items in the state
                state.allHeroItems.data = sortedHeroItems;
            }
        },

        clearHeroSectionsData: (state) => {
            state.allHeroItems.data = [];
            state.allHeroItems.fetched = false;
        },
    },
});

export const {
    setHeroSectionsList,
    addAHeroSection,
    updateAHeroSection,
    removeAHeroSection,
    clearHeroSectionsData,
} = heroSectionSlice.actions;

export default heroSectionSlice.reducer;
