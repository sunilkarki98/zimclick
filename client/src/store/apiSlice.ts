import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { apiFetch } from '../services/api';
import type { Product, Cart, CartItem, User, Vendor, SubOrder } from '../types';
import type { CreateProductInput } from '../services/productService';

const customBaseQuery: BaseQueryFn<
  { url: string; method?: string; body?: any; options?: RequestInit },
  unknown,
  unknown
> = async ({ url, method = 'GET', body, options = {} }) => {
  try {
    const fetchOptions: RequestInit = {
      ...options,
      method,
    };
    if (body) {
      fetchOptions.body = body;
    }
    const result = await apiFetch(url, fetchOptions);
    return { data: result };
  } catch (axiosError) {
    let err = axiosError as any;
    return {
      error: {
        status: err.status || 500,
        data: err.data || err.message,
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: ['Product', 'Cart', 'AdminUser', 'AdminVendor', 'VendorOrder'],
  endpoints: (builder) => ({

    // PRODUCTS
    getProducts: builder.query<Product[], void>({
      query: () => ({ url: '/products' }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Product' as const, id })),
            { type: 'Product', id: 'LIST' },
          ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getMyProducts: builder.query<Product[], void>({
      query: () => ({ url: '/vendor/products' }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Product' as const, id })),
            { type: 'Product', id: 'VENDOR_LIST' },
          ]
          : [{ type: 'Product', id: 'VENDOR_LIST' }],
    }),
    createProduct: builder.mutation<Product, CreateProductInput>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: 'VENDOR_LIST' }],
    }),
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'VENDOR_LIST' }
      ],
    }),

    // CART
    getCart: builder.query<Cart, void>({
      query: () => ({ url: '/cart' }),
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<Cart, { productId: string; quantity: number }>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<Cart, { cartItemId: string; quantity: number }>({
      query: ({ cartItemId, quantity }) => ({
        url: `/cart/${cartItemId}`,
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation<Cart, string>({
      query: (cartItemId) => ({
        url: `/cart/${cartItemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),


    // ADMIN
    getAdminUsers: builder.query<User[], void>({
      query: () => ({ url: '/admin/users' }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'AdminUser' as const, id })),
            { type: 'AdminUser', id: 'LIST' },
          ]
          : [{ type: 'AdminUser', id: 'LIST' }],
    }),
    updateUserRole: builder.mutation<User, { userId: string; role: 'customer' | 'vendor' | 'admin' }>({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),
    getAdminVendors: builder.query<Vendor[], void>({
      query: () => ({ url: '/admin/vendors' }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'AdminVendor' as const, id })),
            { type: 'AdminVendor', id: 'LIST' },
          ]
          : [{ type: 'AdminVendor', id: 'LIST' }],
    }),
    toggleVendorStatus: builder.mutation<Vendor, { vendorId: string; isActive: boolean }>({
      query: ({ vendorId, isActive }) => ({
        url: `/admin/vendors/${vendorId}/status`,
        method: 'PUT',
        body: { isActive },
      }),
      invalidatesTags: [{ type: 'AdminVendor', id: 'LIST' }],
    }),
    adminDeleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),


    // VENDOR ORDERS
    getVendorOrders: builder.query<SubOrder[], void>({
      query: () => ({ url: '/vendor/orders' }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'VendorOrder' as const, id })),
            { type: 'VendorOrder', id: 'LIST' },
          ]
          : [{ type: 'VendorOrder', id: 'LIST' }],
    }),
    updateOrderStatus: builder.mutation<SubOrder, { subOrderId: string; status: SubOrder['status'] }>({
      query: ({ subOrderId, status }) => ({
        url: `/vendor/orders/${subOrderId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [{ type: 'VendorOrder', id: 'LIST' }],
    }),
  }),
});

export const {
  // Products
  useGetProductsQuery,
  useGetMyProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  // Cart
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  // Admin
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useGetAdminVendorsQuery,
  useToggleVendorStatusMutation,
  useAdminDeleteProductMutation,
  // Vendor Orders
  useGetVendorOrdersQuery,
  useUpdateOrderStatusMutation,
} = apiSlice;

