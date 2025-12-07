"use client";
import React, { JSX } from "react";
import { useRouter } from "next/navigation";

// Components
import { FiLogOut } from "react-icons/fi";
import Alert from "../utils/Alert";

// API
import UserAPI from "@/lib/userAPI";

// Context store
import { useWishlistStore } from "@/store/WishlistStore";
import { useCartStore } from "@/store/CartStore";
import { useAddressStore } from "@/store/addressStore";
import { useOrderStore } from "@/store/orderStore";

export default function LogoutButton(): JSX.Element {
  // states
  const [message, setMessage] = React.useState<string>("");
  const [alert, setAlert] = React.useState<boolean>(false);

  // router
  const router = useRouter();

  // Context
  const { clearWishlist } = useWishlistStore();
  const { clearCart } = useCartStore();
  const { clearCache } = useAddressStore();
  const { clearAll } = useOrderStore();

  async function handleLogout(event: React.FormEvent) {
    event.preventDefault();

    const token: string = localStorage.getItem("access_token") || "";
    const response: boolean = await UserAPI.logout(token);

    // Always remove local token
    localStorage.removeItem("access_token");

    if (!response) {
      setMessage("Server error, failed to signout");
      setAlert(true);
      return;
    }

    // Clear all stores
    clearWishlist();
    clearCart();
    clearCache();
    clearAll();
    console.log("Logout success");
    router.push("/login");
  }
  return (
    <>
      <Alert
        message={message}
        isOpen={alert}
        onConfirm={() => setAlert(false)}
      />
      <form
        className="flex w-full justify-center mt-20"
        onSubmit={(event) => {
          handleLogout(event);
        }}
      >
        <button className="bg-red-500 hover:bg-red-600 flex justify-center gap-4 w-[50%] px-4 py-3 text-white font-semibold rounded-lg">
          <FiLogOut size={20} />
          Logout
        </button>
      </form>
    </>
  );
}
