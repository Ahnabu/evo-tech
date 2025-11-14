import { z } from "zod";
export declare const LandingSectionValidation: {
    createLandingSectionValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            subtitle: z.ZodOptional<z.ZodString>;
            sectionType: z.ZodOptional<z.ZodEnum<["featured", "new_arrival", "best_seller", "trending", "custom"]>>;
            category: z.ZodOptional<z.ZodString>;
            subcategory: z.ZodOptional<z.ZodString>;
            products: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            sortOrder: z.ZodOptional<z.ZodNumber>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            products?: string[] | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
        }, {
            title: string;
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            products?: string[] | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            title: string;
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            products?: string[] | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
        };
    }, {
        body: {
            title: string;
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            products?: string[] | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
        };
    }>;
    updateLandingSectionValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            subtitle: z.ZodOptional<z.ZodString>;
            sectionType: z.ZodOptional<z.ZodEnum<["featured", "new_arrival", "best_seller", "trending", "custom"]>>;
            category: z.ZodOptional<z.ZodString>;
            subcategory: z.ZodOptional<z.ZodString>;
            products: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            sortOrder: z.ZodOptional<z.ZodNumber>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            title?: string | undefined;
            products?: string[] | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
        }, {
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            title?: string | undefined;
            products?: string[] | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            title?: string | undefined;
            products?: string[] | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
        };
    }, {
        body: {
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            title?: string | undefined;
            products?: string[] | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
        };
    }>;
};
//# sourceMappingURL=landingsection.validation.d.ts.map