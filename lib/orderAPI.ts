// Endpoint Url
const ENDPOINT_URL: string =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Types
import type { CompletedOrderItem, UpcomingOrderedItem } from "@/types/orders";
class OrderAPI {
  public static async getCompletedOrder(
    token: string
  ): Promise<CompletedOrderItem[] | false> {
    try {
      const response = await fetch(`${ENDPOINT_URL}/completed-orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.status !== 200) {
        return false;
      }

      const data = await response.json();
      return data as CompletedOrderItem[];
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public static async getUpcomingOrder(
    token: string
  ): Promise<UpcomingOrderedItem[] | false> {
    try {
      const response = await fetch(`${ENDPOINT_URL}/upcoming-orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.status !== 200) {
        return false;
      }

      const data = await response.json();
      return data as UpcomingOrderedItem[];
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public static async submitReview(
    token: string,
    product_id: string,
    comment: string,
    rating: number
  ): Promise<boolean> {
    try {
      const response = await fetch(`${ENDPOINT_URL}/submit-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id, comment, rating }),
      });

      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      console.log(data);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

export default OrderAPI;
