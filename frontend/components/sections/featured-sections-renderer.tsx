
import axiosIntercept from "@/utils/axios/axiosIntercept";
import DynamicProductSlider from "@/components/carousels/dynamic-product-slider";
import axiosErrorLogger from "@/components/error/axios_error";
import { stableUrl } from "@/utils/common/constants";

const getFeaturedSections = async () => {
    // We are on the server receiving requests from the user browser.
    // We can use the server-side axios interceptor (which just sets up cookies if needed)
    // or just a direct axios call if the endpoint is public.
    // The endpoint `/products/featured-sections` is public (check product.route.ts: `router.get("/featured-sections", ...)` has no auth middleware).
    
  const axiosClient = await axiosIntercept();
  
  try {
     const response = await axiosClient.get("/products/featured-sections");
     return response.data.data;
  } catch (error) {
     axiosErrorLogger({ error });
     return [];
  }
};

const FeaturedSectionsRenderer = async () => {
  const sections = await getFeaturedSections();

  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section: any) => {
        if (!section.isActive || !section.products || section.products.length === 0) return null;
        
        // Use category or subcategory slug for view more, or fallback to general products page
        let viewMoreUrl = "/products-and-accessories";
        if (section.category?.slug) {
            viewMoreUrl = `/category/${section.category.slug}`;
        } else if (section.subcategory?.slug) {
             viewMoreUrl = `/category/${section.subcategory.slug}`; // Assuming route structure
        }

        const formattedProducts = section.products.map((p: any) => ({
             id: p._id,
             name: p.name,
             slug: p.slug,
             price: p.price,
             prevPrice: p.previousPrice,
             image: p.mainImage,
             rating: 0 // Backend doesn't return rating in this optimized query, default to 0
        }));

        return (
          <DynamicProductSlider
            key={section._id}
            title={section.title}
            products={formattedProducts}
            viewMoreUrl={viewMoreUrl}
          />
        );
      })}
    </>
  );
};

export default FeaturedSectionsRenderer;
