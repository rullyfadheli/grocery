"use client";

import React, { JSX } from "react";
import { Rating } from "@mui/material";

import Image from "next/image";

type Review = {
  id: string;
  created_at: string;
  product_id: string;
  user_id: string;
  comment: string;
  rating: number;
  username: string;
  profile_picture: string;
  message?: string;
};

type Props = {
  product_id: string;
  rating: number;
  review: number;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// const reviews = await getReviews();
export default function Reviews({
  product_id,
  rating,
  review,
}: Props): JSX.Element {
  const [reviews, setReviews] = React.useState<Review[]>([]);

  React.useEffect(() => {
    async function getReviews(): Promise<void> {
      console.log(product_id);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews?productID=${product_id}`,
        {
          cache: "no-store", // Hindari cache jika data dinamis
        }
      );
      const data = await res.json();
      console.log(data);

      setReviews(data);
    }

    getReviews();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-bold mb-1">Reviews & Ratings</h3>
      <div className="flex gap-2 py-1">
        <h1 className="font-extrabold text-3xl flex items-center">
          {rating ? Number(rating.toFixed(1)) : 0}
        </h1>
        <div className="flex flex-col">
          <Rating
            className="text-primary"
            size="medium"
            name="half-rating-read"
            defaultValue={rating ? rating : 0}
            precision={0.5}
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#5ac268", // amber
              },
            }}
            readOnly
          />
          <span className="text-xs text-gray-400">{review} Reviews</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2"></p>
      {reviews[0]?.message ? (
        <p className="text-primary">No reviews yet</p>
      ) : (
        reviews.slice(0, 2).map((review, index) => (
          <div key={index} className="pl-3 text-sm text-gray-800 mb-2">
            <div className="flex justify-between w-full">
              <div className="flex gap-4 items-center">
                <Image
                  src={review.profile_picture || "/images/profile-icon.png"}
                  height={20}
                  width={20}
                  alt="profile-icon"
                  className="rounded-md w-8 h-8"
                />
                <div>
                  <p className="text-lg">{review.username}</p>
                  <p className="text-gray-400 text-xs">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </div>

              <Rating
                className="text-primary"
                size="medium"
                name="half-rating-read"
                defaultValue={review.rating}
                precision={0.5}
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#5ac268", // amber
                  },
                }}
                readOnly
              />
            </div>
            <p className="my-2 pl-12">{review.comment || ""}</p>
          </div>
        ))
      )}
    </div>
  );
}
