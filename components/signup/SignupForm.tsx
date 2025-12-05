"use client";

import React, { JSX } from "react";
import { useLoading } from "@/app/context/loading";

import LoadingAnimation from "../utils/LoadingAnimation";

function SignupForm(): JSX.Element {
  const [username, setUsername] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [mobile, setMobile] = React.useState<number>();
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

  const { isLoading, setLoading } = useLoading();
  const [message, setMessage] = React.useState<string>();
  const [color, setColor] = React.useState<boolean>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      alert("Please input a valid email address");
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
        return;
      }

      setMessage(data[0].message);
      setColor(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (err) {
      alert("Signup failed");
    }
    setLoading(false);
  }

  return (
    <div className="relative z-0">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="border border-primary rounded px-3 py-2 bg-transparent"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="email@example.com"
          className="border border-primary rounded px-3 py-2 bg-transparent"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Mobile number"
          className="border border-primary rounded px-3 py-2 bg-transparent"
          onChange={(e) => setMobile(parseInt(e.target.value))}
          required
        />
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="border border-primary rounded px-3 py-2 w-full bg-transparent"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="Confirm Password"
            className="border border-primary rounded px-3 py-2 w-full bg-transparent"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <p
          className={`font-medium ${
            color ? "text-red-500" : "text-green-500"
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
