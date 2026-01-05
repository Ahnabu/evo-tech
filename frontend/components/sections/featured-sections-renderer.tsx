

import axios from "@/utils/axios/axios";
import DynamicProductSlider from "@/components/carousels/dynamic-product-slider";
import axiosErrorLogger from "@/components/error/axios_error";

const getFeaturedSections = async () => {
    // This endpoint is public (no authentication required)
    // Use regular axios instance instead of axiosIntercept to avoid auth token issues
  
  try {
     const response = await axios.get("/products/featured-sections");
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
