'use client';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { 
    selectTaxonomyCategories, 
    selectTaxonomyLoading, 
    selectTaxonomyError, 
    selectTaxonomyInitialized,
    selectCategoryBySlug,
    selectSubcategoryBySlug,
    type TaxonomyCategory,
    type TaxonomySubcategory,
    type TaxonomyBrand
} from '@/store/slices/taxonomySlice';

/**
 * Custom hook for accessing taxonomy data from Redux store
 * Provides categories, loading state, error state, and utility functions
 */
export const useTaxonomy = () => {
    const categories = useSelector((state: RootState) => selectTaxonomyCategories(state));
    const isLoading = useSelector((state: RootState) => selectTaxonomyLoading(state));
    const error = useSelector((state: RootState) => selectTaxonomyError(state));
    const isInitialized = useSelector((state: RootState) => selectTaxonomyInitialized(state));

    // Utility functions for easy data access
    const getCategoryBySlug = (slug: string): TaxonomyCategory | undefined => {
        return categories.find(category => category.slug === slug);
    };

    const getSubcategoryBySlug = (categorySlug: string, subcategorySlug: string): TaxonomySubcategory | undefined => {
        const category = getCategoryBySlug(categorySlug);
        return category?.subcategories.find(subcat => subcat.slug === subcategorySlug);
    };

    const getAllBrands = (): TaxonomyBrand[] => {
        const allBrands: TaxonomyBrand[] = [];
        
        categories.forEach(category => {
            // Add direct brands from category
            allBrands.push(...category.direct_brands);
            
            // Add brands from subcategories
            category.subcategories.forEach(subcategory => {
                allBrands.push(...subcategory.brands);
            });
        });

        // Remove duplicates based on ID
        const uniqueBrands = allBrands.filter((brand, index, self) => 
            index === self.findIndex(b => b.id === brand.id)
        );

        return uniqueBrands;
    };

    const getCategoriesForSelect = () => {
        return categories.map(category => ({
            value: category.slug,
            label: category.name,
            id: category.id
        }));
    };

    const getSubcategoriesForSelect = (categorySlug?: string) => {
        if (!categorySlug) return [];
        
        const category = getCategoryBySlug(categorySlug);
        if (!category) return [];

        return category.subcategories.map(subcategory => ({
            value: subcategory.slug,
            label: subcategory.name,
            id: subcategory.id
        }));
    };

    const getBrandsForSelect = (categorySlug?: string, subcategorySlug?: string) => {
        if (!categorySlug) {
            // Return all brands if no category specified
            return getAllBrands().map(brand => ({
                value: brand.slug,
                label: brand.name,
                id: brand.id
            }));
        }

        const category = getCategoryBySlug(categorySlug);
        if (!category) return [];

        if (subcategorySlug) {
            // Return brands for specific subcategory
            const subcategory = category.subcategories.find(sub => sub.slug === subcategorySlug);
            return subcategory?.brands.map(brand => ({
                value: brand.slug,
                label: brand.name,
                id: brand.id
            })) || [];
        } else {
            // Return direct brands for category
            return category.direct_brands.map(brand => ({
                value: brand.slug,
                label: brand.name,
                id: brand.id
            }));
        }
    };

    return {
        // Data
        categories,
        isLoading,
        error,
        isInitialized,
        
        // Utility functions
        getCategoryBySlug,
        getSubcategoryBySlug,
        getAllBrands,
        getCategoriesForSelect,
        getSubcategoriesForSelect,
        getBrandsForSelect,
        
        // Computed values
        hasCategories: categories.length > 0,
        totalCategories: categories.length,
        totalSubcategories: categories.reduce((total, cat) => total + cat.subcategories.length, 0),
        totalBrands: getAllBrands().length,
    };
};

/**
 * Hook specifically for accessing category data by slug
 */
export const useCategory = (slug: string) => {
    const category = useSelector((state: RootState) => selectCategoryBySlug(slug)(state));
    return category;
};

/**
 * Hook specifically for accessing subcategory data by slugs
 */
export const useSubcategory = (categorySlug: string, subcategorySlug: string) => {
    const subcategory = useSelector((state: RootState) => 
        selectSubcategoryBySlug(categorySlug, subcategorySlug)(state)
    );
    return subcategory;
};