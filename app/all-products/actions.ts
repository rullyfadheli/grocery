// app/products/actions.ts
"use server";

import { Product, ProductCategory } from "@/types/product";

// Type
type Cursor = {
  date: string;
  id: string;
} | null;

// URL endpoint

const URL_ENDPOINT = process.env.API_URL;

/**
 * Fetches a paginated list of products from the external API using cursor-based pagination.
 * This function is a Next.js Server Action and is executed only on the server.
 *
 * @param {Cursor | null} cursor - The cursor object containing the `createdAt` timestamp and `id`
 * of the last product from the previous page. If `null`, it fetches the first page.
 * @param {number} [limit=10] - The number of products to fetch per page. Defaults to 10.
 * @returns {Promise<Product[]>} A promise that resolves to an array of products.
 * Returns an empty array if the fetch fails or no more products are available.
 */
export async function fetchProducts(
  paramsCategory: string,
  paramsSearch: string
): Promise<Product[]> {
  //   cursor: Cursor,
  //   limit: number = 10
  const API_ENDPOINT = `${URL_ENDPOINT}/initial-products`;
  //   const params = new URLSearchParams({
  //     limit: String(limit),
  //   });

  //   if (!cursor) {
  //     console.log("Cursor data is required");
  //     return [];
  //   }

  try {
    if (paramsCategory || paramsSearch) {
      return [];
    }
    const response = await fetch(`${API_ENDPOINT}`);

    if (!response.ok) {
      console.error("Failed to fetch products from API");
      return [];
    }

    const products: Product[] = await response.json();
    // console.log(products);
    return products;
  } catch (error) {
    console.error("Error in fetchProducts action:", error);
    return [];
  }
}

export async function fetchMoreProductsFromDB(
  serial: number
): Promise<Product[]> {
  //   cursor: Cursor,
  //   limit: number = 10
  const API_ENDPOINT = `${URL_ENDPOINT}/more-products?serial=${serial}`;
  //   const params = new URLSearchParams({
  //     limit: String(limit),
  //   });

  //   if (!cursor) {
  //     console.log("Cursor data is required");
  //     return [];
  //   }

  try {
    const response = await fetch(`${API_ENDPOINT}`);

    if (!response.ok) {
      console.error("Failed to fetch products from API");
      return [];
    }

    const products: Product[] = await response.json();
    // console.log(products);
    return products;
  } catch (error) {
    console.error("Error in fetchProducts action:", error);
    return [];
  }
}

export async function fetchProductByCategory(
  category: string
): Promise<ProductCategory | null> {
  const response = await fetch(
    `${URL_ENDPOINT}/product-by-category?category=${category}`
  );
  // if (response.status !== 200) {
  //   return null;
  // }

  const data = await response.json();
  console.log(data);
  return data as ProductCategory;
}

export async function searchproduct(keyword: string): Promise<Product[]> {
  try {
    const response = await fetch(
      `${URL_ENDPOINT}/search-product?keyword=${keyword}`
    );

    if (response.status !== 200) {
      return [];
    }

    const data = (await response.json()) as Product[];
    return data;
  } catch (error) {
    return [];
  }
}
