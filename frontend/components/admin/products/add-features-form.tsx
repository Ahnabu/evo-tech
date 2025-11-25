"use client";

import { z } from "zod";
import axios from "axios";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EvoFormInputError } from "@/components/error/form-input-error";
import { FileUploader } from "@/components/file_upload/file-uploader";
import { featuresSectionSchema } from "@/schemas/admin/product/productfeaturesSchema";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";

interface Header {
    f_headerid: string;
    title: string;
    imgurl: string;
    sortorder: number;
}

interface Subsection {
    f_subsectionid: string;
    title: string;
    imgurl: string;
    content: string;
    sortorder: number;
}

interface ItemProps {
    itemInfo: {
        itemid: string;
        i_slug: string;
        i_sectionsdata?: {
            features_section?: {
                header?: Header[];
                subsections?: Subsection[];
            };
        };
    };
}

const AddProductFeaturesForm = ({ itemInfo, canUpdate = false }: ItemProps & { canUpdate: boolean; }) => {
    const [removeAllFeaturesPending, setRemoveAllFeaturesPending] = useState(false);
    const [oldHeaders, setOldHeaders] = useState<Header[]>(itemInfo.i_sectionsdata?.features_section?.header ?? []);
    const [oldSubSections, setOldSubSections] = useState<Subsection[]>(itemInfo.i_sectionsdata?.features_section?.subsections ?? []);

    // States for storing removed IDs
    const [headersToRemove, setHeadersToRemove] = useState<string[]>([]);
    const [subsectionsToRemove, setSubsectionsToRemove] = useState<string[]>([]);

    const { register, handleSubmit, control, reset, watch, formState: { errors, isSubmitting } } = useForm<z.infer<typeof featuresSectionSchema>>({
        resolver: zodResolver(featuresSectionSchema),
        defaultValues: {
            headers: [],
            subsections: [],
        },
    });

    const headers = watch("headers", []);
    const subsections = watch("subsections", []);

    const canSubmit = headers.length > 0 || subsections.length > 0;

    // Field array for headers
    const {
        fields: headerFields,
        append: appendHeader,
        remove: removeHeader,
    } = useFieldArray({
        control,
        name: "headers",
    });

    // Field array for subsections
    const {
        fields: subsectionFields,
        append: appendSubsection,
        remove: removeSubsection,
    } = useFieldArray({
        control,
        name: "subsections",
    });

    // Handler for removing a header
    const handleRemoveHeader = (headerId: string) => {
        setOldHeaders((prev) => prev.filter((header) => header.f_headerid !== headerId));
        setHeadersToRemove((prev) => [...prev, headerId]);
    };

    // Handler for removing a subsection
    const handleRemoveSubsection = (subsectionId: string) => {
        setOldSubSections((prev) =>
            prev.filter((subsection) => subsection.f_subsectionid !== subsectionId)
        );
        setSubsectionsToRemove((prev) => [...prev, subsectionId]);
    };


    const handleRemoveAllFeatures = async (itemId: string) => {
        setRemoveAllFeaturesPending(true);
        const delResponse = await axios.delete(`/api/admin/products/features/deleteall/${itemId}`)
            .then((res) => {
                return res.data;
            })
            .catch((error: any) => {
                if (error.response) {
                    toast.error(error.response.data.message ? error.response.data.message : "Something went wrong");
                } else {
                    toast.error("Something went wrong");
                }
                return null;
            }).finally(() => {
                setRemoveAllFeaturesPending(false);
            });

        if (delResponse && delResponse.message) {
            toast.success(`All features for this item are deleted`);
        }
    };


    const onSubmit = async (data: z.infer<typeof featuresSectionSchema>) => {

        const formdata = new FormData();
        let apiToUse: string;

        // for updating existing features
        if (canUpdate) {
            
            // Append headers (if any)
            if (data.headers && data.headers.length > 0) {
                data.headers.forEach((header, index) => {
                    formdata.append(`features_section_new[headers][${index}][title]`, header.title);
                    formdata.append(`features_section_new[headers][${index}][image]`, header.image);
                });
            }
            // Append subsections (if any)
            if (data.subsections && data.subsections.length > 0) {
                data.subsections.forEach((subsection, index) => {
                    formdata.append(`features_section_new[subsections][${index}][title]`, subsection.title);
                    formdata.append(`features_section_new[subsections][${index}][content]`, subsection.content);
                    formdata.append(`features_section_new[subsections][${index}][image]`, subsection.image);
                });
            }

            if (headersToRemove.length > 0) {
                headersToRemove.forEach((id) => {
                    formdata.append("remove_features_headers[]", id);
                });
            }
            if (subsectionsToRemove.length > 0) {
                subsectionsToRemove.forEach((id) => {
                    formdata.append("remove_features_subsections[]", id);
                });
            }

            apiToUse = `/api/admin/products/features/update/${itemInfo.itemid}`;

        } else { // for inserting features
            
            if (data.headers && data.headers.length > 0) {
                data.headers.forEach((header, index) => {
                    formdata.append(`features_section[headers][${index}][title]`, header.title);
                    formdata.append(`features_section[headers][${index}][image]`, header.image);
                });
            }
            
            if (data.subsections && data.subsections.length > 0) {
                data.subsections.forEach((subsection, index) => {
                    formdata.append(`features_section[subsections][${index}][title]`, subsection.title);
                    formdata.append(`features_section[subsections][${index}][content]`, subsection.content);
                    formdata.append(`features_section[subsections][${index}][image]`, subsection.image);
                });
            }

            apiToUse = `/api/admin/products/features/add/${itemInfo.itemid}`;
        }

        const response = await axios.post(apiToUse,
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
                    toast.error(error.response.data.message ? error.response.data.message : "Something went wrong");
                } else {
                    toast.error("Something went wrong");
                }
                return null;
            });

        if (response && response.message) {
            toast.success(canUpdate ? `Features updated` : `Features stored`);
            reset();
        }
    };



    return (
        <>
            <div className="w-full max-w-3xl p-4 space-y-8 font-inter">
                {/* Headers List */}
                <div>
                    <h2 className="text-base font-bold mb-4 text-stone-700">Headers List:</h2>
                    {oldHeaders.length === 0 ? (
                        <p className="text-sm text-stone-700 font-normal">No headers available.</p>
                    ) : (
                        <ul className="space-y-4">
                            {oldHeaders.map((header) => (
                                <li
                                    key={header.f_headerid}
                                    className="flex items-center justify-between border p-4 rounded shadow-sm gap-3"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="relative flex justify-center">
                                            <Image
                                                src={header.imgurl}
                                                alt={header.title}
                                                width={64}
                                                height={64}
                                                loading="lazy"
                                                className="aspect-square shrink-0 rounded-md object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{header.title}</p>
                                            <p className="text-xs text-gray-500">Sort Order: {header.sortorder}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveHeader(header.f_headerid)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Subsections List */}
                <div>
                    <h2 className="text-base font-bold mb-4 text-stone-700">Subsections List:</h2>
                    {oldSubSections.length === 0 ? (
                        <p className="text-sm text-stone-700 font-normal">No subsections available.</p>
                    ) : (
                        <ul className="space-y-4">
                            {oldSubSections.map((subsection) => (
                                <li
                                    key={subsection.f_subsectionid}
                                    className="flex items-center justify-between border p-4 rounded shadow-sm gap-3"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="relative flex justify-center">
                                            <Image
                                                src={subsection.imgurl}
                                                alt={subsection.title}
                                                width={64}
                                                height={64}
                                                loading="lazy"
                                                className="aspect-square shrink-0 rounded-md object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{subsection.title}</p>
                                            <p className="text-sm text-stone-600">{subsection.content}</p>
                                            <p className="text-xs text-gray-500">Sort Order: {subsection.sortorder}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveSubsection(subsection.f_subsectionid)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <form id="addproductfeaturesform" onSubmit={handleSubmit(onSubmit)} className="mt-5 max-w-3xl p-6 space-y-4 text-sm font-inter">
                {/* Headers Section */}
                <div>
                    <h3 className="text-[13px] leading-5 md:text-base font-[500] mb-2">Headers</h3>
                    {headerFields.map((field, index) => (
                        <div key={field.id} className="border p-4 mb-4 rounded">
                            <div>
                                <label className="block mb-1">Header Title</label>
                                <input
                                    type="text"
                                    {...register(`headers.${index}.title` as const)}
                                    className="w-full border p-2 rounded"
                                />
                                {errors.headers?.[index]?.title && (
                                    <EvoFormInputError>
                                        {errors.headers[index].title?.message}
                                    </EvoFormInputError>
                                )}
                            </div>
                            <div className="mt-2">
                                <label className="block mb-1">Header Image</label>
                                <Controller
                                    control={control}
                                    name={`headers.${index}.image` as const}
                                    render={({ field }) => (
                                        <div className="mt-1 block">
                                            <FileUploader
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                maxFileCount={1}
                                                maxSize={10 * 1024 * 1024}
                                            />
                                        </div>
                                    )}
                                />
                                {errors.headers?.[index]?.image && (
                                    <EvoFormInputError>
                                        {errors.headers?.[index]?.image?.message && String(errors.headers[index].image.message)}
                                    </EvoFormInputError>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => removeHeader(index)}
                                className="mt-5 bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Remove Header
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            appendHeader({ title: "", image: undefined as unknown as File })
                        }
                        className="bg-[#0866FF] text-white px-3 py-1 rounded"
                    >
                        {`+ Add Header`}
                    </button>
                </div>

                {/* Subsections Section */}
                <div>
                    <h3 className="text-[13px] leading-5 md:text-base font-[500] mb-2">Subsections</h3>
                    {subsectionFields.map((field, index) => (
                        <div key={field.id} className="border p-4 mb-4 rounded">
                            <div>
                                <label className="block mb-1">Subsection Title</label>
                                <input
                                    type="text"
                                    {...register(`subsections.${index}.title` as const)}
                                    className="w-full border p-2 rounded"
                                />
                                {errors.subsections?.[index]?.title && (
                                    <EvoFormInputError>
                                        {errors.subsections[index].title?.message}
                                    </EvoFormInputError>
                                )}
                            </div>
                            <div className="mt-2">
                                <label className="block mb-1">Subsection Content</label>
                                <textarea
                                    {...register(`subsections.${index}.content` as const)}
                                    className="w-full border p-2 rounded"
                                />
                                {errors.subsections?.[index]?.content && (
                                    <EvoFormInputError>
                                        {errors.subsections[index].content?.message}
                                    </EvoFormInputError>
                                )}
                            </div>
                            <div className="mt-2">
                                <label className="block mb-1">Subsection Image</label>
                                <Controller
                                    control={control}
                                    name={`subsections.${index}.image` as const}
                                    render={({ field }) => (
                                        <div className="mt-1 block">
                                            <FileUploader
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                maxFileCount={1}
                                                maxSize={10 * 1024 * 1024}
                                            />
                                        </div>
                                    )}
                                />
                                {errors.subsections?.[index]?.image && (
                                    <EvoFormInputError>
                                        {errors.subsections[index].image?.message && String(errors.subsections[index].image.message)}
                                    </EvoFormInputError>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => removeSubsection(index)}
                                className="mt-5 bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Remove Subsection
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            appendSubsection({
                                title: "",
                                content: "",
                                image: undefined as unknown as File,
                            })
                        }
                        className="bg-[#0866FF] text-white px-3 py-1 rounded"
                    >
                        {`+ Add Subsection`}
                    </button>
                </div>

                {/* Submit Button */}
                <div className="pt-10 w-full flex justify-end gap-3">
                    <button type="submit" aria-label="add product" disabled={isSubmitting || (!canSubmit && !(headersToRemove.length > 0 || subsectionsToRemove.length > 0))}
                        className="px-7 py-2 bg-stone-800 text-white rounded text-xs md:text-sm hover:bg-stone-900 disabled:bg-stone-600"
                    >
                        {canUpdate
                            ? (isSubmitting ? 'Updating...' : `Update Features`)
                            : (isSubmitting ? 'Adding...' : `Add Features`)
                        }
                    </button>
                </div>
            </form>
            
            <div className="w-full max-w-3xl flex justify-end px-6">
                <button disabled={!canUpdate}
                    onClick={() => handleRemoveAllFeatures(itemInfo.itemid)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm disabled:bg-red-400"
                >
                    {removeAllFeaturesPending ? `Removing...` : `Remove All Features`}
                </button>
            </div>
        </>
    );


}

export { AddProductFeaturesForm };
