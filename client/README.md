# Zimclick Client (Frontend)

This is the Next.js frontend for the Zimclick Sports Marketplace. It interacts seamlessly with the Express/Prisma backend and uses Redux Toolkit for robust global state management.

## Architecture & Tech Stack

- **Framework**: Next.js 14+ (App Router).
- **Styling**: Tailwind CSS & Lucide React for modern, responsive icons.
- **State Management**: Redux Toolkit (RTK).
- **Data Fetching**: RTK Query. API logic is centralized in `store/apiSlice.ts`, which automatically manages loading states and caching.
- **Authentication**: Supabase Auth wrapped tightly into an `authSlice` to maintain a single source of truth globally.

## Project Structure

- `src/app/`: Next.js App Router definitions. Contains user types (`customer`, `vendor`, `admin`) wrapped in specialized layouts.
- `src/components/`: Reusable React components.
- `src/store/`: Global Redux store, including `authSlice`, `cartSlice`, and the RTK Query `apiSlice`.
- `src/services/`: Legacy API fetch wrappers (being deprecated in favor of RTK Query).

## Performance Optimizations

- **Image Rendering**: Uses `next/image` to serve modern formats (WebP/AVIF) and handle responsive lazy loading.
- **RTK Query Caching**: Navigating between product pages feels instant because the Redux cache prevents redundant HTTP requests.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in `.env.local` (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_API_URL`).
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the UI at `http://localhost:3000`.
