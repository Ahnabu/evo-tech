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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'
import axios from 'axios'
import { createSubcategorySchema, updateSubcategorySchema, CreateSubcategoryInput, UpdateSubcategoryInput } from '@/schemas/admin/product/taxonomySchemas'
import { frontBaseURL } from '@/lib/env-vars'
import { AddingDialog } from '@/components/dialogs/adding-dialog'
import { EditingDialog } from '@/components/dialogs/editing-dialog'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { addASubcategory, updateASubcategory } from '@/store/slices/subcategorySlice'
import { useTaxonomy } from '@/hooks/use-taxonomy'
import React from 'react'
import Link from 'next/link'

interface SubcategoryDataType {
    id: string
    name: string
    slug: string
    sortorder: number
    active: boolean
    category: {
        id: string
        name: string
        slug: string
        active: boolean
    }
}

interface SubcategoryFormProps {
    mode?: 'create' | 'update';
    subcategoryData?: SubcategoryDataType;
    onSuccess?: () => void;
}

interface UpdateSubcategoryFormProps extends Omit<SubcategoryFormProps, 'mode' | 'subcategoryData'> {
    subcategoryData: SubcategoryDataType;
}

const SubcategoryForm = ({ mode = 'create', subcategoryData, onSuccess }: SubcategoryFormProps) => {
    const isUpdate = mode === 'update';
    const dispatch = useDispatch<AppDispatch>();
    const { getCategoriesForSelect } = useTaxonomy();
    const categories = getCategoriesForSelect();

    const form = useForm<CreateSubcategoryInput | UpdateSubcategoryInput>({
        resolver: zodResolver(isUpdate ? updateSubcategorySchema : createSubcategorySchema),
        defaultValues: (isUpdate && subcategoryData) ? {
            name: subcategoryData.name,
            slug: subcategoryData.slug,
            category_id: subcategoryData.category.id,
            sortorder: subcategoryData.sortorder.toString(),
            active: subcategoryData.active,
        } : {
            name: '',
            slug: '',
            category_id: '',
            sortorder: '',
            active: true,
        },
    })

    const onSubmit = async (values: CreateSubcategoryInput | UpdateSubcategoryInput) => {
        const payload = {
            name: values.name,
            slug: values.slug,
            category_id: values.category_id,
            sortorder: parseInt(values.sortorder, 10), // string to integer conversion for backend API
            active: values.active.toString(), // boolean to string conversion for backend API
        }

        const url = isUpdate
            ? `${frontBaseURL}/api/admin/taxonomy/subcategories/${subcategoryData!.id}`
            : `${frontBaseURL}/api/admin/taxonomy/subcategories`

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
            toast.success(isUpdate ? `Subcategory updated` : `Subcategory created`);
            form.reset();
            // update Redux state with the new subcategory (if created) or edited subcategory (if updated)
            if (isUpdate) {
                dispatch(updateASubcategory(response.subcategory_data));
            } else {
                dispatch(addASubcategory(response.subcategory_data));
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
                            <FormLabel className="block text-xs font-medium text-left">Subcategory Name*</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter subcategory name"
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
                    name="category_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-medium text-left">Category*</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={form.formState.isSubmitting}
                                >
                                    <SelectTrigger className="w-full text-xs border border-gray-300 rounded-md p-2 bg-transparent focus:outline-none focus:ring-1 ring-stone-300 focus:ring-stone-200">
                                        <SelectValue placeholder={<span className={field.value === "" ? "text-stone-400" : ""}>Select a category</span>} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.length > 0 ? categories.map((category) => (
                                            <SelectItem key={`${category.id}-forsubcat`} value={category.id}>
                                                {category.label}
                                            </SelectItem>
                                        )) :
                                            <div className="flex flex-col items-center justify-center gap-2 text-xs text-stone-500 py-2">
                                                <p>No categories found</p>
                                                <Link href="/control/categories" className="text-evoAdminAccent hover:underline">Add a category</Link>
                                            </div>
                                        }
                                    </SelectContent>
                                </Select>
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
                        aria-label={isUpdate ? "update subcategory" : "create subcategory"}
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

// Add Subcategory Form
const AddSubcategoryForm = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSuccess = () => {
        setIsOpen(false); // close the dialog on success
    };

    return (
        <AddingDialog
            buttonText={"Add New Subcategory"}
            dialogTitle={"Create New Subcategory"}
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <SubcategoryForm mode="create" onSuccess={handleSuccess} />
        </AddingDialog>
    );
}

// Update Subcategory Form
const UpdateSubcategoryForm = ({ subcategoryData }: UpdateSubcategoryFormProps) => {
    const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);

    const handleSuccess = () => {
        setIsUpdateOpen(false); // close the dialog on success
    };

    return (
        <EditingDialog
            buttonText={"Update Subcategory"}
            dialogTitle={"Update Subcategory"}
            open={isUpdateOpen}
            onOpenChange={setIsUpdateOpen}
        >
            <SubcategoryForm mode="update" subcategoryData={subcategoryData} onSuccess={handleSuccess} />
        </EditingDialog>
    );
}

export { AddSubcategoryForm, UpdateSubcategoryForm };
