// app/products/page.tsx

// Components
import SearchBar from "@/components/all-products/searchBar";
import { CategorySidebar } from "@/components/ui/CategorySidebar";
import ProductGrid from "@/components/all-products/ProductGrid";

// Types
import type { Product } from "@/types/product";

// Actions
import { fetchProducts } from "./actions";

import { staticCategories } from "@/data/mockData";

// The page component receives a `searchParams` prop by default
export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // This function will return [] when the url has a category or a keyword params to prevent API call,
  // so the initial product will be clear and will be replaced by product-by-category or search result
  const initialProducts = await fetchProducts(
    params?.category as string,
    params?.keyword as string
  );

  // console.log("Current category from URL query:", params?.category);

  const categories = staticCategories;

  return (
    <div className="flex justify-center min-h-screen bg-secondary">
      <div className="flex flex-col bg-white w-screen md:max-w-3xl relative">
        <header className="fixed top-0 left-0 right-0 z-20 bg-secondary">
          <div className="w-full md:max-w-3xl mx-auto bg-white">
            <SearchBar />
          </div>
        </header>
        <div className="flex relative justify-between md:px-5">
          <CategorySidebar subCategories={categories} />
          <main className="flex w-3/4 ml-[25%] mt-15">
            <ProductGrid initialProducts={initialProducts as Product[]} />
          </main>
        </div>
      </div>
    </div>
  );
}
