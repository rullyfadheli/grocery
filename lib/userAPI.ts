// Types
import type { Users } from "@/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class UserAPI {
  public static async getUserProfile(token: string): Promise<Users[] | null> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      return null;
    }

    const data = await response.json();
    console.log(data);
    return data as Users[];
  }

  public static async editUserProfile(
    token: string,
    username: string,
    email: string,
    mobile: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/edit-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          mobile,
        }),
      });

      if (response.status !== 200) {
        return false;
      }

      const data = await response.json();
      console.log(data);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public static async removeAddress(
    token: string,
    address_id: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/delete-address`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address_id }),
      });

      const data = await response.json();
      console.log(data);

      if (response.status !== 200) {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public static async logout(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      // Check if response is successful (200-299)
      if (!response.ok) {
        return false;
      }

      // Only try to parse JSON if there's content
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log(data);
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public static async requestResetPassword(
    email: string
  ): Promise<string | false> {
    try {
      const response = await fetch(`${API_BASE_URL}/request-reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data);

      return data[0].message as string;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public static async changePassword(
    token: string,
    password: string
  ): Promise<string | false> {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reset_password: password }),
      });

      // if (response.status !== 200) {
      //   return false;
      // }

      const data = await response.json();
      console.log(data);
      return data[0].message as string;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

export default UserAPI;
