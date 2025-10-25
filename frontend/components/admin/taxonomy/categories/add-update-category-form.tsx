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
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import axios from 'axios'
import { createCategorySchema, updateCategorySchema, CreateCategoryInput, UpdateCategoryInput } from '@/schemas/admin/product/taxonomySchemas'
import { frontBaseURL } from '@/lib/env-vars'
import { AddingDialog } from '@/components/dialogs/adding-dialog'
import { EditingDialog } from '@/components/dialogs/editing-dialog'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { addACategory, updateACategory } from '@/store/slices/categorySlice'
import React from 'react'

interface CategoryDataType {
    id: string
    name: string
    slug: string
    sortorder: number
    active: boolean
}

interface CategoryFormProps {
    mode?: 'create' | 'update';
    categoryData?: CategoryDataType;
    onSuccess?: () => void;
}

interface UpdateCategoryFormProps extends Omit<CategoryFormProps, 'mode' | 'categoryData'> {
    categoryData: CategoryDataType;
}

const CategoryForm = ({ mode = 'create', categoryData, onSuccess }: CategoryFormProps) => {
    const isUpdate = mode === 'update';
    const dispatch = useDispatch<AppDispatch>();

    const form = useForm<CreateCategoryInput | UpdateCategoryInput>({
        resolver: zodResolver(isUpdate ? updateCategorySchema : createCategorySchema),
        defaultValues: (isUpdate && categoryData) ? {
            name: categoryData.name,
            slug: categoryData.slug,
            sortorder: categoryData.sortorder.toString(),
            active: categoryData.active,
        } : {
            name: '',
            slug: '',
            sortorder: '',
            active: true,
        },
    })

    const onSubmit = async (values: CreateCategoryInput | UpdateCategoryInput) => {
        const payload = {
            name: values.name,
            slug: values.slug,
            sortorder: parseInt(values.sortorder, 10), // string to integer conversion for backend API
            active: values.active.toString(), // boolean to string conversion for backend API
        }

        const url = isUpdate
            ? `/api/admin/taxonomy/categories/${categoryData!.id}`
            : `/api/admin/taxonomy/categories`

        const method = isUpdate ? 'PUT' : 'POST'

        const response = await axios({
            method,
            url,
            data: payload,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true,
        }).then((res) => {
            return res.data
        }).catch((error: any) => {
            if (error.response) {
                toast.error(error.response.data.message || "Something went wrong")
            } else {
                toast.error("Something went wrong")
            }
            return null
        })

        if (response && response.success) {
            toast.success(isUpdate ? `Category updated` : `Category created`);
            form.reset();
            // update Redux state with the new category (if created) or edited category (if updated)
            if (isUpdate) {
                dispatch(updateACategory(response.category_data));
            } else {
                dispatch(addACategory(response.category_data));
            }
            onSuccess?.();
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-medium text-left">Category Name*</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter category name"
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
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-medium text-left">Slug*</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter URL slug (lowercase, hyphens only)"
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
                    name="sortorder"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-medium text-left">Sort Order*</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter sort order (numeric)"
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
                    name="active"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-xs font-medium">Active Status</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={form.formState.isSubmitting}
                                    />
                                </FormControl>
                            </div>
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
                        aria-label={isUpdate ? "update category" : "create category"}
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="px-5 py-2 bg-stone-800 text-white rounded text-xs md:text-xs hover:bg-stone-900 disabled:bg-stone-600"
                    >
                        {form.formState.isSubmitting ? (isUpdate ? 'Updating...' : 'Creating...') : (isUpdate ? 'Update' : 'Create')}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

// Add Category Form
const AddCategoryForm = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSuccess = () => {
        setIsOpen(false); // close the dialog on success
    };

    return (
        <AddingDialog
            buttonText={"Add New Category"}
            dialogTitle={"Create New Category"}
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <CategoryForm mode="create" onSuccess={handleSuccess} />
        </AddingDialog>
    );
}

// Update Category Form
const UpdateCategoryForm = ({ categoryData }: UpdateCategoryFormProps) => {
    const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);

    const handleSuccess = () => {
        setIsUpdateOpen(false); // close the dialog on success
    };

    return (
        <EditingDialog
            buttonText={"Update Category"}
            dialogTitle={"Update Category"}
            open={isUpdateOpen}
            onOpenChange={setIsUpdateOpen}
        >
            <CategoryForm mode="update" categoryData={categoryData} onSuccess={handleSuccess} />
        </EditingDialog>
    );
}

export { AddCategoryForm, UpdateCategoryForm };
