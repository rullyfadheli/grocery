"use client";
import React, { JSX } from "react";
import { useRouter } from "next/navigation";
// Context
import { useLoading } from "@/app/context/loading";
// components
import Alert from "../utils/Alert";
// API
import ProductAPi from "@/lib/api";
// types
import type { Token } from "@/types/product";

type Props = {
  product_id: string;
  price: number;
};

export default function AddToCart({ price, product_id }: Props): JSX.Element {
  const [alert, setAlert] = React.useState<boolean>(false);
  const [alertMessage, setAlertMessage] = React.useState<string>("");

  // Router
  const router = useRouter();

  // Ubah handleSubmit menjadi handleClick untuk button
  async function handleClick() {
    const token = localStorage.getItem("access_token") as string;
    if (!token) {
      router.push("/login");
      return;
    }

    const response: string | boolean = await ProductAPi.addToCart(
      product_id,
      token
    );

    if (!response) {
      const tokenData = await ProductAPi.getRefreshToken();
      console.log("tokenData", tokenData);

      if (!tokenData) {
        router.push("/login");
        return;
      }

      const newAccessToken = (tokenData as Token)[0].access_token;
      console.log(newAccessToken);
      localStorage.setItem("access_token", newAccessToken);

      // Resend the request
      const retryResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/add-to-cart`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_id }),
        }
      );
      const retryData = await retryResponse.json();
      setAlertMessage(retryData[0].message as string);
      setAlert(true);
      return;
    }

    setAlertMessage(response as string);
    setAlert(true);
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between w-full">
      <Alert
        message={alertMessage}
        isOpen={alert}
        onConfirm={() => setAlert(false)}
      />
      <button
        onClick={handleClick}
        className="bg-primary text-white w-full px-4 py-2 rounded text-sm font-medium"
      >
        Add to Cart | ${price.toFixed(2)}
      </button>
    </div>
  );
}
