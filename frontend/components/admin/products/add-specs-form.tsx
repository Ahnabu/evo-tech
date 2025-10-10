"use client";

import { z } from "zod";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EvoFormInputError } from "@/components/error/form-input-error";
import { specsSectionSchema } from "@/schemas/admin/product/productspecsSchema";
import { toast } from "sonner";
import { useState } from "react";

interface Spec {
    specid: string;
    label: string;
    value: string;
    sortorder: number;
};

interface ItemProps {
    itemInfo: {
        itemid: string;
        i_slug: string;
        i_sectionsdata?: {
            specifications_section?: Spec[];
        };
    };
}

const AddProductSpecsForm = ({ itemInfo, canUpdate = false }: ItemProps & { canUpdate: boolean; }) => {
    const [removeAllSpecsPending, setRemoveAllSpecsPending] = useState(false);
    const [oldSpecs, setOldSpecs] = useState<Spec[]>(itemInfo.i_sectionsdata?.specifications_section ?? []);

    // States for storing removed IDs
    const [specsToRemove, setSpecsToRemove] = useState<string[]>([]);

    const { register, handleSubmit, control, reset, watch, formState: { errors, isSubmitting } } = useForm<z.infer<typeof specsSectionSchema>>({
        resolver: zodResolver(specsSectionSchema),
        defaultValues: {
            specs: [],
        },
    });

    const specs = watch("specs", []);

    const canSubmit = specs.length > 0;

    // Field array for headers
    const {
        fields: specFields,
        append: appendSpec,
        remove: removeSpec,
    } = useFieldArray({
        control,
        name: "specs",
    });

    // Handler for removing a spec
    const handleRemoveSpec = (specId: string) => {
        setOldSpecs((prev) => prev.filter((spec) => spec.specid !== specId));
        setSpecsToRemove((prev) => [...prev, specId]);
    };


    const handleRemoveAllFeatures = async (itemId: string) => {
        setRemoveAllSpecsPending(true);
        const delResponse = await axios.delete(`/api/admin/products/specifications/deleteall/${itemId}`)
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
                setRemoveAllSpecsPending(false);
            });

        if (delResponse && delResponse.message) {
            toast.success(`All specifications for this item are deleted`);
        }
    };


    const onSubmit = async (data: z.infer<typeof specsSectionSchema>) => {

        const formdata = new FormData();
        let apiToUse: string;

        // for updating existing specs
        if (canUpdate) {
            // Append specs_section_new if present
            if (data.specs && data.specs.length > 0) {
                data.specs.forEach((spec, index) => {
                    formdata.append(`specs_section_new[${index}][label]`, spec.label);
                    formdata.append(`specs_section_new[${index}][value]`, spec.value);
                });
            }

            // Append remove_specs if present
            if (specsToRemove.length > 0) {
                specsToRemove.forEach((specId) => {
                    formdata.append("remove_specs[]", specId);
                });
            }

            apiToUse = `/api/admin/products/specifications/update/${itemInfo.itemid}`;

        } else { // for inserting specs

            if (data.specs && data.specs.length > 0) {
                data.specs.forEach((spec, index) => {
                    formdata.append(`specs_section[${index}][label]`, spec.label);
                    formdata.append(`specs_section[${index}][value]`, spec.value);
                });
            }

            apiToUse = `/api/admin/products/specifications/add/${itemInfo.itemid}`;
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
            toast.success(canUpdate ? `Specifications updated` : `Specifications stored`);
            reset();
        }
    };



    return (
        <>
            <div className="w-full max-w-3xl p-4 space-y-8 font-inter">
                {/* Specs List */}
                <div>
                    <h2 className="text-base font-bold mb-4 text-stone-700">Specifications List:</h2>
                    {oldSpecs.length === 0 ? (
                        <p className="text-sm text-stone-700 font-normal">No Specs available.</p>
                    ) : (
                        <ul className="space-y-4">
                            {oldSpecs.map((spec) => (
                                <li
                                    key={spec.specid}
                                    className="flex items-center justify-between border px-4 py-2 rounded shadow-sm shadow-stone-400 gap-3"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-full">
                                            <p className="text-sm font-semibold w-full truncate">{spec.label}</p>
                                            <p className="text-sm font-semibold text-gray-500 w-full truncate">{spec.value}</p>
                                            {/* <p className="text-xs text-gray-500 w-full truncate">{`Sort Order: ${spec.sortorder}`}</p> */}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveSpec(spec.specid)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <form id="addproductspecsform" onSubmit={handleSubmit(onSubmit)} className="mt-5 max-w-3xl p-6 space-y-4 text-sm font-inter">
                {/* Subsections Section */}
                <div>
                    <h3 className="text-[13px] leading-5 md:text-base font-[500] mb-2">Specifications</h3>
                    {specFields.map((field, index) => (
                        <div key={field.id} className="border p-4 mb-4 rounded">
                            <div>
                                <label className="block mb-1">Label</label>
                                <input
                                    type="text"
                                    {...register(`specs.${index}.label` as const)}
                                    className="w-full border p-2 rounded"
                                />
                                {errors.specs?.[index]?.label && (
                                    <EvoFormInputError>
                                        {errors.specs[index].label?.message}
                                    </EvoFormInputError>
                                )}
                            </div>
                            <div className="mt-2">
                                <label className="block mb-1">Value</label>
                                <input
                                    type="text"
                                    {...register(`specs.${index}.value` as const)}
                                    className="w-full border p-2 rounded"
                                />
                                {errors.specs?.[index]?.value && (
                                    <EvoFormInputError>
                                        {errors.specs[index].value?.message}
                                    </EvoFormInputError>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => removeSpec(index)}
                                className="mt-5 bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Remove Specification
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            appendSpec({
                                label: "",
                                value: "",
                            })
                        }
                        className="bg-[#0866FF] text-white px-3 py-1 rounded"
                    >
                        {`+ Add Specification`}
                    </button>
                </div>

                {/* Submit Button */}
                <div className="pt-10 w-full flex justify-end gap-3">

                    <button type="submit" aria-label="add product" disabled={isSubmitting || (!canSubmit && !(specsToRemove.length > 0))}
                        className="px-7 py-2 bg-stone-800 text-white rounded text-xs md:text-sm hover:bg-stone-900 disabled:bg-stone-600"
                    >
                        {canUpdate
                            ? (isSubmitting ? 'Updating...' : `Update Specs`)
                            : (isSubmitting ? 'Adding...' : `Add Specs`)
                        }
                    </button>
                </div>
            </form>

            <div className="w-full max-w-3xl flex justify-end px-6">
                <button disabled={!canUpdate}
                    onClick={() => handleRemoveAllFeatures(itemInfo.itemid)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm disabled:bg-red-400"
                >
                    {removeAllSpecsPending ? `Removing...` : `Remove All Specs`}
                </button>
            </div>
        </>
    );


}

export { AddProductSpecsForm };
