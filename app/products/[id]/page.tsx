import ProductDetails from "@/components/products/ProductDetails";
import ProductAPi from "@/lib/api";

// Types
import type { Product } from "@/types/product";
import type { Review } from "@/types/reviews";
import type { ProductCategory } from "@/types/product";

// Components
import ErrorMessage from "@/components/utils/ErrorMessage";

const getReviews = async (productId: string): Promise<false | Review[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reviews?productID=${productId}`,
    {
      cache: "no-store",
    }
  );

  if (res.status !== 200) {
    return false;
  }

  const data = await res.json();
  return data as Review[];
};

const getSimilarProducts = async (
  category: string,
  productID: string
): Promise<ProductCategory | false> => {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/similar-product?category=${encodeURIComponent(
      category
    )}&productID=${productID}`,
    {
      cache: "no-store",
    }
  );

  if (res.status !== 200) {
    return false;
  }

  const data = await res.json();
  return data as ProductCategory;
};
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // console.log("productID", id);
  const product = await ProductAPi.getProductById(id);

  // console.log("product response", product);
  if (!Array.isArray(product)) {
    return <ErrorMessage message={product as string} />;
  }
  const similarProduct = await getSimilarProducts(product[0].category, id);
  console.log(similarProduct);

  const initialReviews = await getReviews(product[0].id);
  return (
    <ProductDetails
      product={product as Product[]}
      initialReviews={initialReviews}
      initialSimilarProducts={similarProduct}
    />
  );
}
