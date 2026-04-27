"use client";

import { useState } from "react";
import { useGetProductsQuery } from "@/store/apiSlice";
import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy, Activity, Target, Waves, Flag, Goal, Shield, CircleDot,
  HandMetal, MoveUpRight, Grab, Globe, Circle, Dribbble, LocateFixed, Watch
} from "lucide-react";
import ProductCard from "@/components/features/ProductCard";

const CATEGORIES = [
  { cat: 'Cricket', Icon: Trophy },
  { cat: 'Tennis', Icon: Activity },
  { cat: 'Hockey', Icon: Target },
  { cat: 'Swimming', Icon: Waves },
  { cat: 'Golf', Icon: Flag },
  { cat: 'Soccer', Icon: Goal },
  { cat: 'Rugby', Icon: Shield },
  { cat: 'Baseball', Icon: CircleDot },
  { cat: 'Boxing', Icon: HandMetal },
  { cat: 'Badminton', Icon: MoveUpRight },
  { cat: 'Handball', Icon: Grab },
  { cat: 'Volleyball', Icon: Globe },
  { cat: 'Netball', Icon: Circle },
  { cat: 'Basketball', Icon: Dribbble },
  { cat: 'Pool', Icon: LocateFixed },
  { cat: 'Sports Accessories', Icon: Watch }
];

/* Number of categories visible on mobile before "View All" */
const MOBILE_CAT_LIMIT = 8;

export default function ModernStorefront() {
  const { data: products = [], isLoading: loading } = useGetProductsQuery();
  const [showAllCategories, setShowAllCategories] = useState(false);

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden py-24 sm:py-32">
        <Image
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop"
          alt="Hero Background"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>

        <div className="relative z-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 leading-tight">
            The Ultimate <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-orange-400">Global Sports Marketplace</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-gray-300 max-w-3xl font-light mb-10">
            Equip your passion and elevate your game with world class sporting goods from premium soccer boots to elite cricket gear. Shop the gear that fuels champions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="#products" className="px-8 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Start Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">Shop by Category</h2>
            <div className="h-1 w-20 mx-auto mt-4 rounded-full bg-brand"></div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {CATEGORIES
              .slice(0, showAllCategories ? undefined : MOBILE_CAT_LIMIT)
              .map(({ cat, Icon }, i) => (
                <Link href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`} key={i} className="group overflow-hidden rounded-xl cursor-pointer shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 bg-white flex flex-col items-center justify-center py-4 px-2">
                  <div className="h-9 w-9 mb-2 rounded-full bg-brand-50 text-brand flex items-center justify-center group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 tracking-tight text-center group-hover:text-pop transition-colors leading-tight">{cat}</h3>
                </Link>
              ))}
          </div>
          {/* Show "View All" on smaller screens when categories are truncated */}
          {!showAllCategories && (
            <div className="text-center mt-5 lg:hidden">
              <button
                onClick={() => setShowAllCategories(true)}
                className="text-sm font-bold text-brand hover:text-brand-dark transition"
              >
                View All Categories &rarr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Product Discovery */}
      <section id="products" className="py-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-dark">Trending Now</h2>
            <p className="mt-2 text-lg text-gray-500">Hand-picked by our curators for you.</p>
          </div>
          <Link href="/#categories" className="text-sm font-bold text-brand hover:text-brand-dark transition">View All &rarr;</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <h3 className="mt-2 text-xl font-bold text-gray-900">Scanning inventory...</h3>
            <p className="mt-2 text-gray-500">Checking local warehouses for available physical products.</p>
          </div>
        )}
      </section>

    </div>
  );
}