# Gymclick Server (Backend)

This is the Express & Prisma backend powering the Gymclick Sports Marketplace. It handles users, multi-vendor functionality, products, orders, and authentication synchronization with Supabase.

## Architecture

- **Framework**: Node.js with Express and TypeScript.
- **Database ORM**: Prisma (PostgreSQL).
- **Authentication**: JWT token validation, utilizing Supabase for identity management.
- **Routing**: API Routes located in `src/routes`.
- **Business Logic**: Controllers/Services located in `src/services` (e.g., `productService`, `orderService`).

## Data Model (Prisma)

The application utilizes a multi-vendor marketplace structure:
- **User**: Standard customer or platform Admin.
- **Vendor**: An entity tied to a User that owns Products.
- **Product**: Physical goods sold by a Vendor.
- **Order / SubOrder**: A customer's checkout creates one master `Order`, which is split into `SubOrder`s for each vendor involved.

## Scalability & Concurrency Guardrails

- **Atomic Decrementing**: Product stock is decremented atomically via database locks to prevent race conditions during checkout.
- **Batched Updates**: Checkout operations execute using `updateMany` to prevent N+1 querying.
- **Pagination**: Endpoints use `limit` and `offset` constraints to prevent database exhaustion.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in `.env` (Database URL, Supabase config).
3. Push Prisma schema:
   ```bash
   npx prisma db push
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
