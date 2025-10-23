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
    
    const response = await fetch(`${backAPIURL}/api/taxonomy/alldata`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      next: { revalidate: 300 }, // 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('Taxonomy API not yet implemented - returning empty data');
        return [];
      }
      console.error(`Failed to fetch taxonomy data: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    
    // Validate the response structure
    if (data && data.taxonomy_data && Array.isArray(data.taxonomy_data)) {
      return data.taxonomy_data as TaxonomyCategory[];
    } else {
      console.error('Invalid taxonomy data structure in API response');
      return [];
    }
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
