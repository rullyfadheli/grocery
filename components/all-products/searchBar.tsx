"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

const SearchBar = ({ placeholder = "Search" }) => {
  // Internal state management for the input value
  const [query, setQuery] = useState<string>("");

  // Next.js router for navigation
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/all-products?keyword=${query}`);
  };

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
      className="flex w-full items-center gap-3 p-2"
    >
      {/* Back Arrow Button - now using FiArrowLeft */}
      <Link
        href={"/"}
        className="flex-shrink-0 cursor-pointer rounded-full p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
      >
        <FiArrowLeft className="h-6 w-6" /> {/* React Icon */}
      </Link>

      {/* Search Input Wrapper */}
      <div className="flex flex-grow items-center rounded-lg bg-gray-100 px-3 py-2">
        {/* Search Icon - now using FiSearch */}
        <FiSearch className="mr-2 h-5 w-5 text-gray-500" /> {/* React Icon */}
        <input
          type="text"
          className="w-full bg-transparent text-base text-gray-900 placeholder-gray-500 focus:outline-none"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button
        // href={`/all-products?keyword=${query}`}
        type="submit"
        className="bg-primary p-3 rounded-full"
      >
        <FiSearch />
      </button>
    </form>
  );
};

export default SearchBar;
