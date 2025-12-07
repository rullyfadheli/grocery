import React, { JSX } from "react";
import Link from "next/link";

// UI components
import { SearchProducts } from "@/components/home/SearchProducts";
import { CategoryGrid } from "@/components/ui/CategoryGrid";
import { PromoBanner } from "@/components/ui/PromoBanner";
import { BestDeals } from "@/components/ui/BestDeals";
import LocationHeader from "@/components/home/LocationHeader";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import PopularProducts from "../home/PopularProducts";

// Types
import type { Category } from "@/types/UI";
import type { Product } from "@/types/product";

interface HomeViewProps {
  staticCategories: Category[];
}
// interface SearchProducts {
//   onSortClick?: () => void;
// }

// API
import ProductAPI from "@/lib/api";

export default async function HomeView({
  staticCategories,
}: HomeViewProps): Promise<JSX.Element> {
  // Product data from server
  const popularProduct: false | Product[] =
    await ProductAPI.getPopularProducts();

  const bestDeals: false | Product[] = await ProductAPI.getBestDeals();
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 max-w-sm md:max-w-2xl mx-auto">
      <header className="py-4 flex justify-between items-center">
        <LocationHeader />
        <Link href="/cart" className="relative text-gray-600">
          <HiOutlineShoppingBag className="w-7 h-7" />
        </Link>
      </header>
      <SearchProducts />

      <div className="space-y-8 mt-6">
        <CategoryGrid categories={staticCategories} />
        <PromoBanner />
        <BestDeals bestDealsProduct={bestDeals} />
        <PopularProducts popularProduct={popularProduct} />
      </div>
    </div>
  );
}
