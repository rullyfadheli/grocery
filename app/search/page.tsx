"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoChevronBack, IoSearch, IoClose } from "react-icons/io5";
import { ProductGridCard } from "@/components/ui/ProductGridCard";
import { Product } from "@/types/product";

function SearchPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    const currentQuery = searchParams.get("q");
    if (currentQuery) {
      setIsLoading(true);
      setResults([]);
      setError(null);

      const fetchProducts = async () => {
        try {
          const API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/all-products/search?q=${currentQuery}`;
          console.log(`Fetching from: ${API_ENDPOINT}`);

          const response = await fetch(API_ENDPOINT);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setResults(data);
        } catch (err) {
          setError("Gagal memuat data. Silakan coba lagi.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProducts();
    }
  }, [searchParams]);

  const renderResults = () => {
    if (isLoading) {
      return (
        <p className="text-center text-gray-500 mt-8">Mencari produk...</p>
      );
    }

    if (error) {
      return <p className="text-center text-red-500 mt-8">{error}</p>;
    }

    if (searchParams.get("q") && results.length === 0) {
      return (
        <div className="text-center mt-8 px-4">
          <IoSearch size={60} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            Produk Tidak Ditemukan
          </h2>
          <p className="text-gray-500 mt-1">
            Kami tidak dapat menemukan produk yang cocok dengan pencarian "
            {searchParams.get("q")}".
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {results.map((product) => (
          <ProductGridCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="relative bg-white max-w-screen-md mx-auto shadow-lg min-h-screen">
        <header className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-700">
              <IoChevronBack size={24} />
            </button>
            <form onSubmit={handleSearch} className="relative flex-grow">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk di sini..."
                className="w-full bg-gray-100 border border-transparent rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <IoClose size={20} />
                </button>
              )}
            </form>
          </div>
        </header>

        <main className="p-4">{renderResults()}</main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageComponent />
    </Suspense>
  );
}
