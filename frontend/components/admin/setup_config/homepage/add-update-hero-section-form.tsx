'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { toast } from 'sonner'
import axios from 'axios'
import { heroAddSchema, heroUpdateSchema, HeroAddFormValues, HeroUpdateFormValues, HeroSectionDisplayType } from '@/schemas/admin/setupconfig/homepage/heroSection/heroSchema'
import { frontBaseURL } from '@/lib/env-vars'
import { useDispatch } from "react-redux";
import { AppDispatch } from '@/store/store';
import { setHeroSectionsList } from "@/store/slices/heroSectionSlice";
import { AddingDialog } from '@/components/dialogs/adding-dialog'
import { EditingDialog } from '@/components/dialogs/editing-dialog'
import React from 'react';
import { FileUploader } from '@/components/file_upload/file-uploader'
import Image from 'next/image'

interface HeroSectionFormProps {
    mode?: 'create' | 'update';
    sectionData?: HeroSectionDisplayType;
    onSuccess?: () => void;
}

interface UpdateHeroSectionFormProps extends Omit<HeroSectionFormProps, 'mode' | 'sectionData'> {
    sectionData: HeroSectionDisplayType;
}

const HeroSectionForm = ({ mode = 'create', sectionData, onSuccess }: HeroSectionFormProps) => {
    const isUpdate = mode === 'update';
    const dispatch = useDispatch<AppDispatch>();

    const form = useForm<HeroAddFormValues | HeroUpdateFormValues>({
        resolver: zodResolver(isUpdate ? heroUpdateSchema : heroAddSchema),
        defaultValues: (isUpdate && sectionData) ? {
            title: sectionData.title,
            subtitle: sectionData.subtitle || '',
            more_text: sectionData.more_text || '',
            button_text: sectionData.button_text || '',
            button_url: sectionData.button_url || '',
            sortorder: sectionData.sortorder.toString(),
            image: [], // to replace the old one with a new image
        } : {
            title: '',
            subtitle: '',
            more_text: '',
            button_text: '',
            button_url: '',
            sortorder: '',
            image: [],
        },
    })

    const onSubmit = async (values: HeroAddFormValues | HeroUpdateFormValues) => {
        const formData = new FormData();

        formData.append('title', values.title);
        formData.append('sortorder', values.sortorder);

        if (values.subtitle) {
            formData.append('subtitle', values.subtitle);
        }
        if (values.more_text) {
            formData.append('more_text', values.more_text);
        }
        if (values.button_text) {
            formData.append('button_text', values.button_text);
        }
        if (values.button_url) {
            formData.append('button_url', values.button_url);
        }

        // Handle image upload
        if (values.image) {
            formData.append('image', values.image);
        }

        const url = isUpdate
            ? `${frontBaseURL}/api/admin/setupconfig/homepage/hero/${sectionData!.tcarousel_itemid}`
            : `${frontBaseURL}/api/admin/setupconfig/homepage/hero`

        const method = isUpdate ? 'POST' : 'POST' // Both are POST for image upload to the Laravel backend

        const response = await axios({
            method,
            url,
            data: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true,
        }).then((res) => {
            return res.data;
        })
            .catch((error: any) => {
                if (error.response) {
                    toast.error(error.response.data.message || "Something went wrong");
                } else {
                    toast.error("Something went wrong");
                }
                return null;
            });

        if (response && response.success && response.topcarousel_data) {
            toast.success(isUpdate ? `Hero section item updated` : `Hero section item created`);
            // update Redux state with the new section data
            dispatch(setHeroSectionsList({
                data: response.topcarousel_data,
                fetchedStatus: true,
            }));
            form.reset();
            onSuccess?.();
        }
    }

    return (
        <div className="max-h-[18.75rem] overflow-y-auto p-1.5">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-xs font-medium text-left">Title*</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter hero section title"
                                        {...field}
                                        disabled={form.formState.isSubmitting}
                                        className="block w-full text-xs border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none placeholder:text-stone-400 placeholder:text-xs"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Current Image (if updating) */}
                    {isUpdate && (
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-medium text-left">Current Image</p>
                            <div className={`relative w-full h-24 group`}>
                                <Image
                                    src={sectionData!.imgurl}
                                    alt="current hero section image"
                                    fill
                                    sizes="100%"
                                    className="object-cover object-center rounded-md"
                                />
                            </div>
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <p className="block text-xs font-medium text-left cursor-default">
                                    {!isUpdate ? 'Carousel Image*' : 'New Image (Replace the old one)'}
                                </p>
                                <FormControl>
                                    <div className="mt-1 block">
                                        <FileUploader
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            maxFileCount={1}
                                            maxSize={3 * 1024 * 1024} // 3MB
                                            className="lg:min-h-32"
                                            accept={{
                                                "image/jpeg": [],
                                                "image/png": [],
                                                "image/webp": [],
                                            }}
                                            disabled={form.formState.isSubmitting}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sortorder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-xs font-medium text-left">Sorting Order*</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter order (numeric)"
                                        {...field}
                                        disabled={form.formState.isSubmitting}
                                        className="block w-full text-xs border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none placeholder:text-stone-400 placeholder:text-xs"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subtitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-xs font-medium text-left">Subtitle (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter subtitle"
                                        {...field}
                                        disabled={form.formState.isSubmitting}
                                        className="block w-full text-xs border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none placeholder:text-stone-400 placeholder:text-xs"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="more_text"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-xs font-medium text-left">More Text (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter additional text"
                                        {...field}
                                        disabled={form.formState.isSubmitting}
                                        className="block w-full text-xs border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none placeholder:text-stone-400 placeholder:text-xs"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="button_text"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-xs font-medium text-left">Button Text (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter button text"
                                        {...field}
                                        disabled={form.formState.isSubmitting}
                                        className="block w-full text-xs border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none placeholder:text-stone-400 placeholder:text-xs"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="button_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-xs font-medium text-left">Button URL (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter button URL"
                                        {...field}
                                        disabled={form.formState.isSubmitting}
                                        className="block w-full text-xs border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none placeholder:text-stone-400 placeholder:text-xs"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-3 w-full flex justify-end gap-2">
                        <Button
                            aria-label="reset form fields"
                            type="button"
                            disabled={form.formState.isSubmitting}
                            className="px-5 py-2 text-stone-800 rounded text-xs md:text-xs disabled:bg-stone-300 disabled:text-stone-500"
                            variant="outline"
                            onClick={() => form.reset()}
                        >
                            Reset
                        </Button>
                        <Button
                            aria-label={isUpdate ? "update hero section" : "create hero section"}
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="px-5 py-2 bg-stone-800 text-white rounded text-xs md:text-xs hover:bg-stone-900 disabled:bg-stone-600"
                        >
                            {form.formState.isSubmitting ? (isUpdate ? 'Updating...' : 'Creating...') : (isUpdate ? 'Update' : 'Create')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

// Add Hero Section Form
const AddHeroSectionForm = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSuccess = () => {
        setIsOpen(false); // close the dialog on success
    };

    return (
        <AddingDialog
            buttonText="Add New Hero Item"
            dialogTitle="Create New Hero Item"
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <HeroSectionForm mode="create" onSuccess={handleSuccess} />
        </AddingDialog>
    );
}

// Update Hero Section Form
const UpdateHeroSectionForm = ({ sectionData }: UpdateHeroSectionFormProps) => {
    const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);

    const handleSuccess = () => {
        setIsUpdateOpen(false); // close the dialog on success
    };

    return (
        <EditingDialog
            buttonText={"Update Hero Item"}
            dialogTitle={"Update Hero Item"}
            open={isUpdateOpen}
            onOpenChange={setIsUpdateOpen}
        >
            <HeroSectionForm mode="update" sectionData={sectionData} onSuccess={handleSuccess} />
        </EditingDialog>
    );
}

export { AddHeroSectionForm, UpdateHeroSectionForm };
