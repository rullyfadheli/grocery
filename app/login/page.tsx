import React, { JSX } from "react";

import Link from "next/link";

import { Inter } from "next/font/google";

import LoginForm from "@/components/login/LoginForm";
import SocialLogin from "@/components/login/SocialLogin";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function HomePage(): Promise<JSX.Element> {
  return (
    <div className={`w-full ${inter.className} flex justify-center bg-primary`}>
      <main className="flex flex-col items-center justify-center min-h-screen p-8 w-full max-w-2xl bg-secondary">
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-6">
          Log in to your account using email or social networks
        </p>

        <div className="w-full max-w-md space-y-4">
          <SocialLogin />
          <LoginForm />
          <p className="text-center text-sm mt-4">
            Didn't have an account?
            <Link href="/signup" className="text-primary font-medium px-1">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
