"use client";

import { z } from "zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EvoFormInputError } from "@/components/error/form-input-error";
import { FileUploader } from "@/components/file_upload/file-uploader";
import { AddProductSchema } from "@/schemas/admin/product/productschemas";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/all_utils";

import { IoIosAddCircle } from "react-icons/io";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ItemBrandOptions } from "@/dal/product-inputs";
import Link from "next/link";
import { useTaxonomy } from "@/hooks/use-taxonomy";
import { useFeaturedSections } from "@/hooks/use-featured-sections";

const AddProductForm = () => {
    const router = useRouter();
    const { getCategoriesForSelect, getSubcategoriesForSelect } = useTaxonomy();
    const { getSectionsForSelect } = useFeaturedSections();
    const categories = getCategoriesForSelect();
    const featuredSections = getSectionsForSelect();

    const { register, handleSubmit, control, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<z.infer<typeof AddProductSchema>>({
        resolver: zodResolver(AddProductSchema),
        defaultValues: {
            item_name: "",
            item_slug: "",
            item_price: "",
            item_prevprice: "0",
            item_instock: true,
            item_mainimg: [],
            item_features: [],
            item_colors: [],
            item_category: "",
            item_subcategory: "",
            item_brand: "",
            item_weight: "",
            landing_section_id: "",
            additional_images: [],
        },
    });


    // Dynamic fields for item features
    const {
        fields: featureFields,
        append: appendFeature,
        remove: removeFeature
    } = useFieldArray({
        control,
        name: "item_features"
    });

    // Dynamic fields for item colors
    const {
        fields: colorFields,
        append: appendColor,
        remove: removeColor
    } = useFieldArray({
        control,
        name: "item_colors"
    });

    const generateSlug = () => {
        const itemName = watch("item_name");
        const generatedSlug = slugify(itemName);
        setValue("item_slug", generatedSlug, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };

    const subcategories = getSubcategoriesForSelect(watch("item_category"));

    const onSubmit = async (data: z.infer<typeof AddProductSchema>) => {
        const formdata = new FormData();

        formdata.append('item_name', data.item_name);
        formdata.append('item_slug', data.item_slug);
        formdata.append('item_price', data.item_price);
        formdata.append('item_prevprice', data.item_prevprice);
        formdata.append('item_instock', String(Boolean(data.item_instock)));
        formdata.append('item_mainimg', data.item_mainimg);
        if (data.item_features) {
            data.item_features.forEach((feature: string) => {
                formdata.append('item_features[]', feature);
            });
        }
        if (data.item_colors) {
            data.item_colors.forEach((color: string) => {
                formdata.append('item_colors[]', color);
            });
        }
        formdata.append('item_category', data.item_category);
        formdata.append('item_subcategory', data.item_subcategory ?? '');
        formdata.append('item_brand', data.item_brand);
        formdata.append('item_weight', data.item_weight ?? '');
        formdata.append('landing_section_id', data.landing_section_id ?? '');
        if (data.additional_images && Array.isArray(data.additional_images)) {
            data.additional_images.forEach((file: File) => {
                formdata.append('additional_images[]', file);
            });
        }

        const response = await axios.post(`/api/admin/products`,
            formdata,
            {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
                withCredentials: true,
            },
        ).then((res) => {
            return res.data;
        })
            .catch((error: any) => {
                if (error.response) {
                    const errorMessage = error.response.data.message || "Something went wrong";
                    toast.error(errorMessage);
                } else if (error.request) {
                    toast.error("Something went wrong - check your network connection");
                } else {
                    toast.error("Something went wrong");
                }
                return null;
            });

        if (response && response.message && response.item_name) {
            toast.success(`Item '${response.item_name}' created`);
            reset();
            router.push(`/control/products`);
        }
    };


    return (
        <form id="addproductform" onSubmit={handleSubmit(onSubmit)} className="max-w-3xl p-6 space-y-4 text-sm font-roboto">
            {/* Item Name */}
            <div>
                <label className="block text-sm font-medium">Name*</label>
                <input
                    type="text"
                    {...register("item_name")}
                    disabled={isSubmitting}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none focus:ring-1 ring-stone-300 focus:ring-stone-600"
                />
                {errors.item_name && (
                    <EvoFormInputError>{errors.item_name.message}</EvoFormInputError>
                )}
            </div>

            {/* Item Slug */}
            <div>
                <div className="w-fit flex gap-3 items-center">
                    <label className="block text-sm font-medium">Slug*</label>
                    <button
                        onClick={generateSlug}
                        type="button"
                        aria-label="generate slug"
                        disabled={isSubmitting}
                        className="w-fit px-2 py-0.5 text-xs text-stone-50 bg-stone-800 hover:bg-stone-900 rounded-[6px] disabled:bg-stone-600 disabled:cursor-default"
                    >
                        generate
                    </button>
                </div>
                <input
                    type="text"
                    {...register("item_slug")}
                    disabled={isSubmitting}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none focus:ring-1 ring-stone-300 focus:ring-stone-600"
                />
                {errors.item_slug && (
                    <EvoFormInputError>{errors.item_slug.message}</EvoFormInputError>
                )}
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Price*</label>
                    <input
                        type="text"
                        {...register("item_price")}
                        disabled={isSubmitting}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none focus:ring-1 ring-stone-300 focus:ring-stone-600"
                    />
                    {errors.item_price && (
                        <EvoFormInputError>{errors.item_price.message}</EvoFormInputError>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Previous Price</label>
                    <input
                        type="text"
                        {...register("item_prevprice")}
                        disabled={isSubmitting}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none focus:ring-1 ring-stone-300 focus:ring-stone-600"
                    />
                    {errors.item_prevprice && (
                        <EvoFormInputError>{errors.item_prevprice.message}</EvoFormInputError>
                    )}
                </div>
            </div>

            {/* In Stock (Boolean as a Checkbox) */}
            <div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <label className="text-sm font-medium">In Stock</label>
                    <Controller
                        control={control}
                        name="item_instock"
                        render={({ field }) => (
                            <div className="min-[500px]:max-lg:justify-self-start justify-self-end">
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                        )}
                    />
                </div>

                {errors.item_instock && (
                    <EvoFormInputError>{errors.item_instock.message}</EvoFormInputError>
                )}
            </div>

            {/* Item Features (Dynamic Array of Text Inputs) */}
            <div>
                <label className="block text-sm font-medium">
                    Key Features <span className="text-gray-500 text-xs">(If applicable)</span>
                </label>
                {featureFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2 mt-1">
                        <input
                            type="text"
                            {...register(`item_features.${index}` as const)}
                            placeholder="write key feature"
                            disabled={isSubmitting}
                            className="block w-full border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none focus:ring-1 ring-stone-300 focus:ring-stone-600 placeholder:text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            disabled={isSubmitting}
                            className="text-red-600 text-xs font-[500]"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => appendFeature('')}
                    disabled={isSubmitting}
                    className="mt-2 text-[#0866FF] text-xs font-[500] flex items-center"
                >
                    <IoIosAddCircle className="inline size-5 mr-1" />Add Feature
                </button>
                {errors.item_features && (
                    <EvoFormInputError>{(errors.item_features as any).message}</EvoFormInputError>
                )}
            </div>

            {/* Item Colors (Dynamic Array of Text Inputs) */}
            <div>
                <label className="block text-sm font-medium">
                    Colors <span className="text-gray-500 text-xs">(If applicable)</span>
                </label>
                {colorFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2 mt-1">
                        <input
                            type="text"
                            {...register(`item_colors.${index}` as const)}
                            placeholder="{ name: colorname, hex: #XXXXXX }"
                            disabled={isSubmitting}
                            className="block w-full border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none focus:ring-1 ring-stone-300 focus:ring-stone-600 placeholder:text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => removeColor(index)}
                            disabled={isSubmitting}
                            className="text-red-600 text-xs font-[500]"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => appendColor('')}
                    disabled={isSubmitting}
                    className="mt-2 text-[#0866FF] text-xs font-[500] flex items-center"
                >
                    <IoIosAddCircle className="inline size-5 mr-1" />Add Color
                </button>
                {errors.item_colors && (
                    <EvoFormInputError>{(errors.item_colors as any).message}</EvoFormInputError>
                )}
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                {/* Main Image */}
                <div>
                    <label className="block text-sm font-medium">
                        Main Image* <span className="text-gray-500 text-xs">{`(will be shown 1st)`}</span>
                    </label>
                    <p className="text-[0.6875rem] leading-3 text-muted-foreground">{`(only jpeg/png/jpg/webp)`}</p>
                    <div>
                        {/* accept="image/jpeg, image/png, image/jpg, image/webp" */}
                        <Controller
                            control={control}
                            name="item_mainimg"
                            render={({ field }) => (
                                <div className="mt-1 block">
                                    <FileUploader
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        maxFileCount={1}
                                        maxSize={2 * 1024 * 1024}
                                        className="lg:min-h-32"
                                        accept={{
                                            "image/jpeg": [],
                                            "image/png": [],
                                            "image/webp": [],
                                        }}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            )}
                        />
                    </div>
                    {errors.item_mainimg && (
                        <EvoFormInputError>{errors.item_mainimg?.message?.toString()}</EvoFormInputError>
                    )}
                </div>

                {/* Additional Images */}
                <div>
                    <label className="block text-sm font-medium">Additional Images</label>
                    <p className="text-[0.6875rem] leading-3 text-muted-foreground">{`(only jpeg/png/jpg/webp)`}</p>
                    <div>
                        {/* accept="image/jpeg, image/png, image/jpg, image/webp" */}
                        <Controller
                            control={control}
                            name="additional_images"
                            render={({ field }) => (
                                <div className="mt-1 block">
                                    <FileUploader
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        maxFileCount={10}
                                        maxSize={2 * 1024 * 1024}
                                        multiple
                                        className="lg:min-h-32"
                                        accept={{
                                            "image/jpeg": [],
                                            "image/png": [],
                                            "image/webp": [],
                                        }}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            )}
                        />
                    </div>
                    {errors.additional_images && (
                        <EvoFormInputError>{errors.additional_images?.message?.toString()}</EvoFormInputError>
                    )}
                </div>
            </div>

            {/* Category and Subcategory */}
            <div className="grid lg:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Category*</label>
                    <Controller
                        control={control}
                        name="item_category"
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none focus:ring-1 ring-stone-200 focus:ring-stone-200">
                                    <SelectValue placeholder={<span className={`text-stone-400`}>Select a category</span>} />
                                </SelectTrigger>
                                <SelectContent>
                                    {(categories.length > 0 && field.value !== "") && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs bg-stone-500/10 text-rose-500 mb-2"
                                            onClick={() => {
                                                field.onChange("");
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    )}
                                    {(categories.length > 0) ? categories.map((option) => (
                                        <SelectItem key={option.id} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    )) :
                                        <div className="flex flex-col items-center justify-center gap-2 text-xs text-stone-500 py-2">
                                            <p>No categories found</p>
                                            <Link href="/control/categories" className="text-evoAdminAccent hover:underline">Add a category</Link>
                                        </div>
                                    }
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.item_category && (
                        <EvoFormInputError>{errors.item_category.message}</EvoFormInputError>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Subcategory <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <Controller
                        control={control}
                        name="item_subcategory"
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none focus:ring-1 ring-stone-300 focus:ring-stone-200">
                                    <SelectValue placeholder={<span className={`text-stone-400`}>Select a subcategory</span>} />
                                </SelectTrigger>
                                <SelectContent>
                                    {(subcategories.length > 0 && field.value !== "") && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs bg-stone-500/10 text-rose-500 mb-2"
                                            onClick={() => {
                                                field.onChange("");
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    )}
                                    {(subcategories.length > 0) ? subcategories.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    )) :
                                        <div className="flex flex-col items-center justify-center gap-2 text-xs text-stone-500 py-2">
                                            <p>No subcategories found for the selected category</p>
                                            <Link href="/control/subcategories" className="text-evoAdminAccent hover:underline">Add a subcategory</Link>
                                        </div>
                                    }
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.item_subcategory && (
                        <EvoFormInputError>{errors.item_subcategory.message}</EvoFormInputError>
                    )}
                </div>
            </div>

            {/* Brand */}
            <div className="grid lg:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Brand*</label>
                    <Controller
                        control={control}
                        name="item_brand"
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none focus:ring-1 ring-stone-300 focus:ring-stone-200">
                                    <SelectValue placeholder={<span className={`text-stone-400`}>Select a brand</span>} />
                                </SelectTrigger>
                                <SelectContent>
                                    {(ItemBrandOptions.length > 0 && field.value !== "") && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs bg-stone-500/10 text-rose-500 mb-2"
                                            onClick={() => {
                                                field.onChange("");
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    )}
                                    {(ItemBrandOptions.length > 0) && ItemBrandOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.slug}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.item_brand && (
                        <EvoFormInputError>{errors.item_brand.message}</EvoFormInputError>
                    )}
                </div>
            </div>

            {/* Weight and Landing Section ID */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">
                        {`Weight (grams) `}<span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        {...register("item_weight")}
                        disabled={isSubmitting}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none focus:ring-1 ring-stone-300 focus:ring-stone-600"
                    />
                    {errors.item_weight && (
                        <EvoFormInputError>{errors.item_weight.message}</EvoFormInputError>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Add to Featured <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <Controller
                        control={control}
                        name="landing_section_id"
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none focus:ring-1 ring-stone-300 focus:ring-stone-200">
                                    <SelectValue placeholder={<span className={`text-stone-400`}>Select a section</span>} />
                                </SelectTrigger>
                                <SelectContent>
                                    {(featuredSections.length > 0 && field.value !== "") && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs bg-stone-500/10 text-rose-500 mb-2"
                                            onClick={() => {
                                                field.onChange("");
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    )}
                                    {(featuredSections.length > 0) ? featuredSections.map((option) => (
                                        <SelectItem key={`L_Featured_${option.value}`} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    )) :
                                        <div className="flex flex-col items-center justify-center gap-2 text-xs text-stone-500 py-2">
                                            <p>No featured sections found</p>
                                            <Link href="/control/setup-config/homepage-config/featured-sections" className="text-evoAdminAccent hover:underline">Add a featured section</Link>
                                        </div>
                                    }
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.landing_section_id && (
                        <EvoFormInputError>{errors.landing_section_id.message}</EvoFormInputError>
                    )}
                </div>
            </div>


            {/* Action Buttons */}
            <div className="pt-10 w-full flex justify-end gap-2">
                <Link href={`/control/products`}
                    className={`px-5 py-2 bg-stone-300 text-stone-800 rounded text-xs md:text-sm hover:bg-stone-200 disabled:bg-stone-400 transition-colors duration-100 ease-linear shadow 
                        ${isSubmitting ? 'pointer-events-none' : ''}`}
                >
                    Cancel
                </Link>
                <button type="submit" aria-label="add product" disabled={isSubmitting}
                    className="px-7 py-2 bg-stone-800 text-white rounded text-xs md:text-sm hover:bg-stone-950 disabled:bg-stone-600 transition-colors duration-100 ease-linear shadow"
                >
                    {isSubmitting ? `Adding...` : `Add Product`}
                </button>
            </div>
        </form>
    );
}

export { AddProductForm };
