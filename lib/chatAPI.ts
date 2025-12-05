const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

import type { Conversation } from "@/types/Message";

class ChatAPI {
  public static async startConversation(
    token: string,
    receiver: string
  ): Promise<Conversation[] | null> {
    try {
      const res = await fetch(`${SERVER_URL}/api/start-conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipient_id: receiver }),
      });

      const data = (await res.json()) as Conversation[];
      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public static async createConversation(
    token: string,
    receiver: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${SERVER_URL}/api/create-conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messageReceiver: receiver }),
      });

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

export default ChatAPI;
