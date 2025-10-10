import { AddProductForm } from "@/components/admin/products/add-product-form";


const AdminCreateProductsPage = () => {
    return (
        <div className="w-full min-h-[100vh] md:min-h-[calc(100vh-64px)] h-fit flex flex-col px-5 md:px-7 py-6 bg-stone-100 font-inter">
            <h2 className="w-fit font-[600] text-stone-800 text-sm md:text-base mb-4 underline underline-offset-4">
                Add a new product
            </h2>
            <AddProductForm />
        </div>
    );
}

export default AdminCreateProductsPage;
