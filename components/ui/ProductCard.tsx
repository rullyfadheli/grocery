"use client";

import React, { JSX } from "react";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  detail?: string;
  price?: number | null;
  final_price: number | null;
  stock: number;
  discount_percentage?: number;
}

// Context
import { useCartContext } from "@/app/context/cartContext";
import { useCartStore } from "@/store/CartStore";

export function ProductCard({
  id,
  image,
  name,
  detail,
  discount_percentage,
  price,
  final_price,
  stock,
}: ProductCardProps): JSX.Element {
  // Router
  const router = useRouter();

  // Local state
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  // Context state
  const { updateAddToCartTrigger } = useCartContext();

  // Store
  const { fetchCart } = useCartStore();

  // functions to Add to cart the items based in the user's token and product_id
  async function addToCart(product_id: string) {
    setIsLoading(true);

    try {
      const token: string = localStorage.getItem("access_token") as string;
      console.log("localToken", token);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/add-to-cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id,
          }),
        }
      );

      if (!response.ok) {
        const tokenResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/token`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        // console.log(tokenResponse);

        if (!tokenResponse.ok) {
          router.push("/login");
          return;
        }

        const newAccessToken = await tokenResponse.json();
        // console.log(newAccessToken);
        localStorage.setItem(
          "accessToken",
          newAccessToken[0].access_token as string
        );

        const newResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/add-to-cart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${newAccessToken[0].access_token}`,
            },
            body: JSON.stringify({
              product_id,
            }),
          }
        );

        const newData = await newResponse.json();
        // console.log(newData);
        updateAddToCartTrigger((prev) => {
          return !prev;
        });
        fetchCart(router, true);
        setIsAlertOpen(true);
        setAlertMessage(newData[0].message);
        return;
      } else {
        const data = await response.json();
        updateAddToCartTrigger((prev) => {
          return !prev;
        });
        fetchCart(router, true);
        setIsAlertOpen(true);
        setAlertMessage(data[0].message);
        return;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex-shrink-0 w-44 relative">
      <button
        // onClick={handleWishlist}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Toggle Wishlist"
      >
        {/* {isWishlisted(product.id) ? (
          <FaHeart className="w-5 h-5 text-red-500" />
        ) : (
          <FaRegHeart className="w-5 h-5" />
        )} */}
      </button>

      <div className="w-full h-24 mb-2 cursor-pointer">
        <Link href={`/products/${id}`}>
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={name}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-md"
              quality={50}
              priority={true}
            />
          </div>
        </Link>
      </div>

      <h3 className="font-semibold text-gray-800 text-sm truncate">{name}</h3>
      <p className="text-gray-500 text-xs mb-2">stock: {stock}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-baseline gap-1">
          <p
            className={`text-gray-900 font-bold text-base ${
              final_price === null ? "hidden" : "inline-block"
            }`}
          >
            ${final_price !== null && final_price.toFixed(2)}
          </p>
          {discount_percentage !== null && (
            <p
              className={`text-gray-400 text-base line-through text-xs${
                final_price === null ? "hidden" : "inline-block"
              }`}
            >
              {price}
            </p>
          )}
        </div>
        <button
          onClick={() => addToCart(id)}
          disabled={isLoading}
          className={`${
            isLoading
              ? "bg-primary cursor-not-allowed w-26 p-2"
              : "bg-primary hover:bg-green-600"
          } text-white rounded-lg p-4 px-5 w-12 h-8 flex items-center justify-center transition-colors text-sm`}
        >
          {isLoading ? <Spinner text={""} /> : "Add"}
        </button>
      </div>
      <Alert
        message={alertMessage}
        isOpen={isAlertOpen}
        onConfirm={() => setIsAlertOpen(false)}
      />
    </div>
  );
}
