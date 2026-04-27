export type UserRole = "customer" | "vendor" | "admin";
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export type SubOrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  userId: string;
  storeName: string;
  description: string | null;
  logo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  brand: string;
  stock: number;
  description: string | null;
  images: string[];
  attributes: Record<string, any> | null;
  weight: number | null;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
  categories?: Category[];
  tags?: Tag[];
  vendor?: Vendor;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  selectedAttributes: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  subOrderId: string | null;
  productId: string;
  quantity: number;
  price: number;
  selectedAttributes: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface SubOrder {
  id: string;
  orderId: string;
  vendorId: string;
  subtotal: number;
  status: SubOrderStatus;
  createdAt: string;
  updatedAt: string;
  vendor?: Vendor;
  items?: OrderItem[];
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  paymentStatus: string | null;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  subOrders?: SubOrder[];
}
