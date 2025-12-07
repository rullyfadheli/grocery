// components/ProductGrid.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import {
  fetchMoreProductsFromDB,
  fetchProductByCategory,
  searchproduct,
} from "@/app/all-products/actions";
import InfiniteScroll from "react-infinite-scroll-component";
import SpecialCard from "@/components/all-products/SpecialCard";
import SkeletonCard from "@/components/all-products/SkeletonCard";
import ErrorMessage from "@/components/all-products/ErrorMessage";

// Types
import type { Product } from "@/types/product";
import type { ProductCategory } from "@/types/product";
interface ProductGridProps {
  initialProducts: Product[];
}

type Cursor = {
  serial_id: number;
} | null;

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const params = useSearchParams();
  // Getting category value from url params
  const category: string | null = params.get("category");

  const searchQuery: string | null = params.get("keyword");

  // Inisialisasi cursor dari produk terakhir yang di-load oleh server
  const [cursor, setCursor] = useState<Cursor>(() => {
    if (initialProducts.length === 0) {
      return null;
    }
    const lastProduct = initialProducts[initialProducts.length - 1];
    return { serial_id: lastProduct.serial_id };
  });

  const fetchCategoryOrProduct = useCallback(async () => {
    // If category from query params exists, call this function and return the value
    // console.log(category);
    setIsLoading(true);
    setError(null);

    try {
      if (category) {
        const categoryData: ProductCategory | null =
          await fetchProductByCategory(category);
        console.log(categoryData);

        // Update the product grid data if the categoryData response was succeed
        if (categoryData) {
          setProducts(categoryData as Product[]);
          return;
        }

        setProducts([]);
        return;
      }

      // Update the product grid data if the search response was succeed
      if (searchQuery) {
        const searchResult: Product[] = await searchproduct(searchQuery);
        setProducts(searchResult);
        return;
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products. Please try again."
      );
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, searchQuery]);

  useEffect(() => {
    fetchCategoryOrProduct();
  }, [fetchCategoryOrProduct]);

  const [hasMore, setHasMore] = useState<boolean>(initialProducts.length > 0);

  const fetchMoreProducts = async () => {
    if (!cursor) {
      setHasMore(false);
      return;
    }

    if (category) {
      console.log(category);
      const categoryData = await fetchProductByCategory(category);
      setProducts(categoryData as Product[]);
      return;
    }
    // Call the server action with the calculated page number
    const newProducts = await fetchMoreProductsFromDB(
      products[products.length - 1].serial_id
    );

    if (newProducts.length === 0) {
      setHasMore(false);
      return;
    }

    setProducts((prevProducts) => [...prevProducts, ...newProducts]);

    // update the cursor data
    const lastProduct = newProducts[newProducts.length - 1];
    setCursor({ serial_id: lastProduct.serial_id });
  };

  return (
    <div className="grid gap-2 w-full">
      {/* Loading State */}
      {isLoading && <SkeletonCard count={10} />}

      {/* Error State */}
      {!isLoading && error && (
        <ErrorMessage message={error} onRetry={fetchCategoryOrProduct} />
      )}

      {/* Products Grid */}
      {!isLoading && !error && (
        <InfiniteScroll
          dataLength={products.length}
          next={fetchMoreProducts}
          hasMore={hasMore}
          loader={<SkeletonCard count={2} />}
          endMessage={
            <p className="text-center my-4 text-primary col-span-full">
              <b>All caught!</b>
            </p>
          }
          className="col-span-full grid grid-cols-2 md:grid-cols-3 gap-2"
        >
          {products.map((product, index) => (
            <SpecialCard
              key={index}
              id={product.id}
              image={product.image}
              name={product.name}
              detail={product.detail}
              price={product.price}
              final_price={product.final_price}
              discount_percentage={product.discount_percentage}
              stock={product.stock}
            />
          ))}
        </InfiniteScroll>
      )}

      {/* Empty State */}
      {!isLoading && !error && products.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
}
