"use client";

import React, { JSX } from "react";
import { useLoading } from "@/app/context/loading";
import { toast } from "sonner";

import LoadingAnimation from "../utils/LoadingAnimation";

function SignupForm(): JSX.Element {
  const [username, setUsername] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [mobile, setMobile] = React.useState<number>();
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>();
  const [color, setColor] = React.useState<boolean>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast("Passwords do not match");
      return;
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      toast("Please input a valid email address");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ username, email, mobile, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setMessage(data[0].message || "Signup failed");
        setLoading(false);
        setColor(false);
        toast.error(data[0].message);
        return;
      }

      // console.log(data[0]);
      setMessage(data[0].message);
      setColor(true);
      toast.success(
        "Register success, please check your email for verification"
      );
      // await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (err) {
      toast.error("Signup failed, please try again");
    }
    setLoading(false);
  }

  return (
    <div className="relative z-0">
      <form
        className="flex flex-col gap-3"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
      >
        <input
          type="text"
          placeholder="Username"
          className="border border-primary rounded px-3 py-2 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          required
        />
        <input
          type="email"
          placeholder="email@example.com"
          className="border border-primary rounded px-3 py-2 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <input
          type="tel"
          placeholder="Mobile number"
          className="border border-primary rounded px-3 py-2 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          onChange={(e) => setMobile(parseInt(e.target.value))}
          disabled={isLoading}
          required
        />
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="border border-primary rounded px-3 py-2 w-full bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="Confirm Password"
            className="border border-primary rounded px-3 py-2 w-full bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <p
          className={`font-medium ${
            color ? "text-green-500" : "text-red-500"
          } `}
        >
          {message}
        </p>
        <button
          type="submit"
          className="bg-primary text-white rounded py-2 mt-2 font-semibold flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Processing...
            </>
          ) : (
            "Signup"
          )}
        </button>
      </form>

      {isLoading && <LoadingAnimation />}
    </div>
  );
}

export default SignupForm;
