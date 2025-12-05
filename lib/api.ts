import { type Product } from "@/types/product";
import type { ApiResponseMessage } from "@/types/product";
import type { Token } from "@/types/product";
import type { Cart } from "@/types/cart";
import type { Coupon } from "@/types/coupon";

import type {
  NominatimResponse,
  AddressPayload,
  ServerResponse,
  Address,
} from "@/types/Address";

import type { Wishlist } from "@/types/wishlist";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
/**
 * ProductAPI class provides methods for interacting with product-related endpoints.
 * Handles product retrieval, wishlist management, authentication tokens, and cart operations.
 */
class ProductAPI {
  /**
   * Retrieves a product by its ID.
   *
   * @param id - The unique identifier for the product
   * @returns Promise resolving to Product object on success, or error message string on failure
   * @throws Will log API errors to console and return error message
   *
   * @example
   * ```typescript
   * const product = await ProductAPI.getProductById("123");
   * if (typeof product === "string") {
   * console.error("Error:", product);
   * } else {
   * console.log("Product:", product.name);
   * }
   * ```
   */
  async getProductById(id: string): Promise<Product | string> {
    const response = await fetch(
      `${API_BASE_URL}/product-by-id?productID=${id}`
    );

    const result: Product | ApiResponseMessage[] = await response.json();

    if (response.status !== 200) {
      console.warn("API error:", (result as ApiResponseMessage[])[0].message);
      return (result as ApiResponseMessage[])[0].message;
    }

    return result as Product;
  }

  /**
   * Retrieves the user's wishlist items.
   *
   * @param token - Bearer authentication token
   * @returns Promise resolving to array of wishlist items on success, or false on failure
   *
   * @example
   * ```typescript
   * const wishlist = await ProductAPI.getWishList(userToken);
   * if (wishlist && Array.isArray(wishlist)) {
   * console.log(`Found ${wishlist.length} items in wishlist`);
   * }
   * ```
   */
  public async getWishList(token: string): Promise<false | Wishlist> {
    // console.log("token", token);
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      return false;
    }
    // console.log(response);
    const data = await response.json();
    // console.log(data);

    return data;
  }

  public async addToWishlist(
    token: string,
    product_id: string
  ): Promise<false | ApiResponseMessage[]> {
    const response = await fetch(`${API_BASE_URL}/add-to-wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id }),
    });

    if (response.status !== 201) {
      return false;
    }

    const data = await response.json();

    return data as ApiResponseMessage[];
  }

  /**
   * Fetches a refresh token from the server using HTTP-only cookies.
   *
   * @returns Promise resolving to Token object on success, or false on failure
   * @note Uses credentials: "include" to send HTTP-only cookies
   *
   * @example
   * ```typescript
   * const token = await ProductAPI.getRefreshToken();
   * if (token) {
   * console.log("Token refreshed successfully");
   * }
   * ```
   */
  public async getRefreshToken(): Promise<false | Token> {
    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      // console.log(data);

      if (response.status !== 200) {
        return false;
      }

      return data as Token;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /**
   * Retrieves products marked as best deals.
   *
   * @returns Promise resolving to Product object on success, or false on failure
   * @throws Will log API errors to console when status is not 200
   *
   * @example
   * ```typescript
   * const deals = await ProductAPI.getBestDeals();
   * if (deals) {
   * console.log("Best deals loaded");
   * }
   * ```
   */
  public async getBestDeals(): Promise<Product[] | false> {
    try {
      const response = await fetch(`${API_BASE_URL}/best-deal`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.status !== 200) {
        console.warn("API error:", data[0].message as string);
        return false;
      }

      return data as Product[];
    } catch (error) {
      return false;
    }
  }

  /**
   * Retrieves a list of popular products.
   *
   * @returns Promise resolving to Product object on success, or false on failure
   * @throws Will log API errors to console when status is not 200
   *
   * @example
   * ```typescript
   * const popular = await ProductAPI.getPopularProducts();
   * if (popular) {
   * console.log("Popular products loaded");
   * }
   * ```
   */
  public async getPopularProducts(): Promise<Product[] | false> {
    const response = await fetch(`${API_BASE_URL}/popular-products`, {
      method: "GET",
    });

    const data = await response.json();

    if (response.status !== 200) {
      console.warn("API error:", data[0].message as string);
      return false;
    }

    return data as Product[];
  }

  /**
   * Adds a product to the user's shopping cart.
   *
   * @param product_id - The unique identifier of the product to add
   * @param token - Bearer authentication token
   * @returns Promise resolving to success message string on success (201), or false on failure
   *
   * @example
   * ```typescript
   * const result = await ProductAPI.addToCart("product123", userToken);
   * if (result) {
   * console.log("Success:", result);
   * } else {
   * console.error("Failed to add item to cart");
   * }
   * ```
   */
  public async addToCart(
    token: string,
    product_id: string
  ): Promise<string | boolean> {
    const response = await fetch(`${API_BASE_URL}/add-to-cart`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id }),
    });

    if (response.status !== 201) {
      return false;
    }
    const data = await response.json();

    return data[0].message as string;
  }

  public async getCartItems(token: string): Promise<Cart | false> {
    const response = await fetch(`${API_BASE_URL}/shopping-cart`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      return false;
    }

    const data = await response.json();

    return data as Cart;
  }

  public async getCoupons(token: string): Promise<Coupon | false> {
    const response = await fetch(`${API_BASE_URL}/coupons`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status !== 200 || data.length === 0) {
      console.warn("API error:", data);
      return false;
    }

    return data as Coupon;
  }

  public async removeCartItem(
    token: string,
    product_id: string
  ): Promise<false | ApiResponseMessage> {
    const response = await fetch(`${API_BASE_URL}/delete-cart-item`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id }),
    });

    const message = await response.json();

    console.log("product_id", product_id);
    console.log(message);

    if (response.status !== 200) {
      return false;
    }

    return message as ApiResponseMessage;
  }

  /**
   * Fetches the display name of an address from OpenStreetMap using coordinates.
   *
   * @param lat - The latitude.
   * @param lon - The longitude.
   * @returns A promise that resolves to the full address string, or null if not found.
   */
  public async getAddressDisplayName(
    lat: number,
    lon: number
  ): Promise<string | null> {
    console.log(lat, lon);
    // Construct the Nominatim API URL for reverse geocoding.
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
      const response = await fetch(url, {
        headers: {
          // IMPORTANT: Add a descriptive User-Agent header.
          // Nominatim's usage policy requires this.
          // Replace 'MyAppName/1.0 (your-email@example.com)' with your app's details.
          "User-Agent": "FR Grocery APP/1.0 (frgrocery1@gmail.com)",
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data: NominatimResponse = await response.json();

      // The API can return a 200 OK with an error message in the JSON body.
      if (data.error) {
        console.error("API Error:", data.error);
        return null;
      }

      return data.display_name || null;
    } catch (error) {
      console.error("Failed to fetch address:", error);
      return null;
    }
  }

  /**
   * Sends address data to a server using the POST method with an Authorization header.
   *
   * @param payload - The object containing latitude, longitude, and a label.
   * @param token - The authorization token (e.g., a JWT) for the request header.
   * @returns A promise that resolves to the server's parsed JSON response, or null if the request fails.
   */
  public async sendAddressData(
    payload: AddressPayload,
    token: string
  ): Promise<ServerResponse | null> {
    const url = `${API_BASE_URL}/add-address`;
    console.log(payload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          // Specifies that the body of this request is in JSON format
          "Content-Type": "application/json",
          // Adds the authorization header, using the standard Bearer Token scheme
          authorization: `Bearer ${token}`,
        },
        // Converts the JavaScript payload object into a JSON string for transmission
        body: JSON.stringify({
          lat: payload.lat,
          lng: payload.lon,
          label: payload.label,
        }),
      });

      // Parse the JSON response body from the server
      const data: ServerResponse = await response.json();
      console.log(data);

      // If the response is not 'ok' (e.g., status codes 401, 404, 500), throw an error
      if (!response.ok) {
        return null;
      }

      return data;
    } catch (error) {
      console.error(
        "❌ An error occurred while sending data to the server:",
        error
      );
      return null;
    }
  }

  /**
   * Fetches a list of addresses from the server.
   *
   * @param token - The authorization token required for the API call.
   * @returns A promise that resolves to an array of addresses, or null if an error occurs.
   */
  public async getUserAddress(token: string): Promise<Address[] | null> {
    const url = `${API_BASE_URL}/address`;

    try {
      const response = await fetch(url, {
        method: "GET", // Method for fetching data
        headers: {
          // Add the Authorization header with the Bearer token
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Check if the server responded with an error status
      if (!response.ok) {
        return null;
      }

      const result: Address[] = await response.json();
      // console.log(result);
      return result as Address[];
    } catch (error) {
      console.error("❌ Failed to fetch addresses:", error);
      return null;
    }
  }

  /**
   * Increases the quantity of a specific item in the user's shopping cart.
   *
   * @param token - The Bearer authentication token for authorization.
   * @param product_id - The unique identifier of the product whose quantity will be increased.
   * @returns A promise that resolves to a message object on success (status 200), or false on failure.
   *
   * @example
   * ```typescript
   * const result = await ProductAPI.increaseCartQuantity(userToken, "product123");
   * if (result) {
   * console.log("Success:", result[0].message);
   * } else {
   * console.error("Failed to increase item quantity.");
   * }
   * ```
   */
  public async increaseCartQuantity(
    token: string,
    product_id: string
  ): Promise<ApiResponseMessage | false> {
    const response = await fetch(`${API_BASE_URL}/increase-cart-quantity`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      console.warn("API error:", data);
      return false;
    }

    return data as ApiResponseMessage;
  }

  /**
   * Decreases the quantity of a specific item in the user's shopping cart.
   *
   * @param token - The Bearer authentication token for authorization.
   * @param product_id - The unique identifier of the product whose quantity will be decreased.
   * @returns A promise that resolves to a message object on success (status 200), or false on failure.
   *
   * @example
   * ```typescript
   * const result = await ProductAPI.decreaseCartQuantity(userToken, "product123");
   * if (result) {
   * console.log("Success:", result[0].message);
   * } else {
   * console.error("Failed to decrease item quantity.");
   * }
   * ```
   */
  public async decreaseCartQuantity(
    token: string,
    product_id: string
  ): Promise<ApiResponseMessage | false> {
    const response = await fetch(`${API_BASE_URL}/decrease-cart-quantity`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      console.warn("API error:", data);
      return false;
    }

    return data as ApiResponseMessage;
  }

  /**
   * Authenticates a user with email and password.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise that resolves to a Token object on success, or false on failure.
   *
   * @example
   * ```typescript
   * const credentials = { email: "user@example.com", password: "password123" };
   * const tokenData = await ProductAPI.login(credentials.email, credentials.password);
   * if (tokenData) {
   * console.log("Login successful. Token:", tokenData.accessToken);
   * } else {
   * console.error("Login failed.");
   * }
   * ```
   */
  public async login(email: string, password: string): Promise<Token | false> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        // Asumsikan server mengirim pesan error dalam format { message: '...' }
        const errorMessage = data.message || "Invalid credentials";
        console.warn("API error:", errorMessage);
        return false;
      }

      return data as Token;
    } catch (error) {
      console.error("An error occurred during login:", error);
      return false;
    }
  }

  async removeItemFromWishlist(
    token: string,
    product_id: string
  ): Promise<boolean> {
    try {
      console.log(product_id);
      const response = await fetch(`${API_BASE_URL}/remove-from-wishlist`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id }),
      });

      // if (response.status !== 200) {
      //     return false;
      // }
      const data = await response.json();
      console.log(data);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default new ProductAPI();
