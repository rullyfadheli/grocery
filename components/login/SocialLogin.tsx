"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

// Components

export default function SocialLogin() {
  const router = useRouter();
  const [googleURI, setGoogleURI] = React.useState<string>();

  const handleAppleLogin = () => {
    // Integrasi Apple login
  };

  const handleGoogleLogin = async () => {
    router.push(`${process.env.NEXT_PUBLIC_SOCKET_URL}/auth/google`);
  };

  return (
    <div className="space-y-2">
      {/* <button
        onClick={handleAppleLogin}
        className="w-full py-2  border-1 border-primary bg-white text-black rounded-md"
      >
        <Image
          src="https://authjs.dev/img/providers/apple.svg"
          alt="Apple Logo"
          width={20}
          height={20}
          className="inline mr-2"
        />
        Login with Apple
      </button> */}
      <button
        onClick={handleGoogleLogin}
        className="w-full py-2  bg-white text-black rounded-md"
      >
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Apple Logo"
          width={20}
          height={20}
          className="inline mr-2"
        />
        Login with Google
      </button>
      <p className="text-center text-gray-500 text-sm">Or continue with:</p>
    </div>
  );
}
