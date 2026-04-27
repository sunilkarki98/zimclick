"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  useGetMyProductsQuery, 
  useCreateProductMutation, 
  useDeleteProductMutation 
} from "@/store/apiSlice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than $0"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  description: z.string().optional()
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function VendorProductsPage() {
  const { data: products = [], isLoading: loading } = useGetMyProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      price: 0,
      brand: "",
      stock: 0,
      imageUrl: "",
      description: ""
    }
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId).unwrap();
      toast.success("Product deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to delete product");
    } finally {
      setDeleteId(null);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await createProduct({
        name: data.name,
        price: data.price,
        stock: data.stock,
        brand: data.brand,
        description: data.description,
        images: data.imageUrl ? [data.imageUrl] : [],
        attributes: {},
        categoryIds: [],
        tagIds: []
      }).unwrap();
      
      toast.success("Product created successfully");
      setIsModalOpen(false);
      reset();
    } catch (err: any) {
      toast.error(err?.data?.error || err.message || "Failed to create product");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{p.name}</div>
                      <div className="text-sm text-gray-500">{p.brand}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${p.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.stock > 10 ? 'bg-green-100 text-green-800' : p.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setDeleteId(p.id)} className="text-red-600 hover:text-red-900 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  <div className="animate-pulse flex flex-col items-center gap-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </td>
              </tr>
            )}
            {products.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="text-gray-500 mb-4">No products found in your catalog.</div>
                  <Button onClick={() => setIsModalOpen(true)} variant="outline">Create your first product</Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input {...register("name")} error={errors.name?.message} placeholder="Premium Soccer Cleats" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <Input type="number" step="0.01" {...register("price")} error={errors.price?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <Input type="number" {...register("stock")} error={errors.stock?.message} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <Input {...register("brand")} error={errors.brand?.message} placeholder="Nike" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <Input type="url" {...register("imageUrl")} error={errors.imageUrl?.message} placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className={`flex w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 transition-all resize-none ${errors.description ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus-visible:ring-brand"}`}
                  rows={3} 
                  {...register("description")} 
                />
                {errors.description && <p className="mt-1 text-xs text-red-500 font-medium">{errors.description.message}</p>}
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isCreating}>
                  Create Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone and will remove the product from the marketplace."
        confirmText="Delete Product"
      />
    </div>
  );
}
