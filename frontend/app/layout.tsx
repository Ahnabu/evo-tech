import "./globals.css";
import type { Metadata } from "next";
import { inter, roboto } from "@/utils/fonts";
import { Providers } from "./providers";
import { EvoToaster } from "@/components/ui/evo_toaster";
import ScrollBacktoTop from "@/components/scrolltotop";
import { backAPIURL } from "@/lib/env-vars";
import { TaxonomyProvider } from "@/components/providers/taxonomy-provider";
import type { TaxonomyCategory } from "@/store/slices/taxonomySlice";
import { ConditionalLayout } from "@/components/layout/conditional-layout";

export const metadata: Metadata = {
  title: {
    template: "%s | Evo-Tech Bangladesh",
    default: "Evo-Tech Bangladesh",
  },
  description: "An e-commerce website for shopping tech products",
};

// fetch taxonomy data from the API
async function fetchTaxonomyData(): Promise<TaxonomyCategory[]> {
  try {
    if (!backAPIURL) {
      console.error('NEXT_PUBLIC_BACKEND_URL is not defined');
      return [];
    }
    
    // Fetch categories and subcategories separately since /taxonomy/alldata doesn't exist yet
    const [categoriesRes, subcategoriesRes, brandsRes] = await Promise.all([
      fetch(`${backAPIURL}/categories?limit=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        next: { revalidate: 300 },
      }),
      fetch(`${backAPIURL}/subcategories?limit=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        next: { revalidate: 300 },
      }),
      fetch(`${backAPIURL}/brands?limit=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        next: { revalidate: 300 },
      }),
    ]);

    if (!categoriesRes.ok || !subcategoriesRes.ok || !brandsRes.ok) {
      console.warn('Failed to fetch some taxonomy data');
      return [];
    }

    const categoriesData = await categoriesRes.json();
    const subcategoriesData = await subcategoriesRes.json();
    const brandsData = await brandsRes.json();
    
    // Transform the data into the expected format
    if (categoriesData?.data && Array.isArray(categoriesData.data)) {
      const categories: TaxonomyCategory[] = categoriesData.data.map((cat: any) => {
        // Find subcategories for this category
        const categorySubcategories = subcategoriesData?.data?.filter((sub: any) => 
          sub.category?._id === cat._id || sub.category === cat._id
        ) || [];
        
        // Find brands for this category and its subcategories
        const categoryBrands = brandsData?.data?.filter((brand: any) => {
          // Check if brand is directly associated with category or any of its subcategories
          return true; // For now, include all brands
        }) || [];
        
        return {
          id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          has_subcategories: categorySubcategories.length > 0,
          subcategories: categorySubcategories.map((sub: any) => ({
            id: sub._id,
            name: sub.name,
            slug: sub.slug,
            description: sub.description || '',
            brands: brandsData?.data?.map((brand: any) => ({
              id: brand._id,
              name: brand.name,
              slug: brand.slug,
              description: brand.description || '',
            })) || [],
          })),
          direct_brands: categoryBrands.map((brand: any) => ({
            id: brand._id,
            name: brand.name,
            slug: brand.slug,
            description: brand.description || '',
          })),
        };
      });
      
      return categories;
    }
    
    console.error('Invalid categories data structure in API response');
    return [];
  } catch (error) {
    console.error('Error fetching taxonomy data:', error);
    return [];
  }
}

const RootLayout = async ({ children }: { children: React.ReactNode; }) => {
  // Fetch taxonomy data on the server
  const taxonomyData = await fetchTaxonomyData();

  return (
    <html lang="en" dir="ltr" className="light">
      <body className={`${inter} ${roboto} antialiased`}>
        <Providers>
          <TaxonomyProvider initialData={taxonomyData}>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <ScrollBacktoTop />
            <EvoToaster />
            <div id="modal-root"></div>
          </TaxonomyProvider>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
