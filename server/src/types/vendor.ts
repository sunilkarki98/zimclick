import type { Vendor as PrismaVendor } from "../generated/client";

export type Vendor = PrismaVendor;

export interface CreateVendorInput {
  storeName: string;
  description?: string;
  logo?: string;
}
