type RawCartItem = {
  _id?: string;
  product?: {
    _id?: string;
    slug?: string;
    name?: string;
    price?: number;
    mainImage?: string;
    imageUrl?: string;
    category?: { slug?: string } | string;
    subcategory?: { slug?: string } | string;
    brand?: { slug?: string } | string;
    weight?: number;
    isPreOrder?: boolean;
    preOrderPrice?: number | null;
  } | null;
  quantity?: number;
  selectedColor?: string | null;
};

export const transformCartItems = (items: RawCartItem[] | undefined | null) => {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  return items.map((item) => {
    const product = item.product ?? {};

    const category = product.category;
    const subcategory = product.subcategory;
    const brand = product.brand;

    const extractSlug = (value: any) => {
      if (!value) return "";
      if (typeof value === "string") return value;
      return value.slug ?? "";
    };

    return {
      item_id: product._id || item._id || "",
      item_slug: product.slug || "",
      item_name: product.name || "Unnamed Product",
      item_price: product.price ?? 0,
      item_color: item.selectedColor || null,
      item_quantity: item.quantity ?? 0,
      item_imgurl: product.mainImage || product.imageUrl || "",
      item_category: extractSlug(category),
      item_subcategory: extractSlug(subcategory),
      item_brand: extractSlug(brand),
      item_weight: typeof product.weight === "number" ? product.weight : 0,
      item_isPreOrder: Boolean(product.isPreOrder),
      item_preorderPrice:
        typeof product.preOrderPrice === "number"
          ? product.preOrderPrice
          : null,
    };
  });
};
