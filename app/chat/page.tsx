"use client";

import React, { JSX } from "react";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

// API
import ChatAPI from "@/lib/chatAPI";

// Components
import ChatHeader from "@/components/chat/ChatHeader";
import MessageBubble from "@/components/chat/MessageBubble";
import MessageInput from "@/components/chat/MessageInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import Alert from "@/components/utils/Alert";

// Types
import { Conversation, Message, Chat } from "@/types/Message";
import type { Token } from "@/types/product";

interface ErrorSocket {
  status: string;
  message: string;
}

// Custom hook
import { useApiWithAuth } from "@/hooks/auth";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
const SERVER_URL: string =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

/**
 * The main chat component that orchestrates the entire chat interface.
 * It manages socket connection, message state, and auto-scrolling.
 * @returns {JSX.Element} The complete chat page component.
 */
const ChatPage = (): JSX.Element => {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [conversationID, setConversationID] = useState<string>();
  const socketRef = useRef<Socket | null>(null);
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const apiWithauth = useApiWithAuth();
  const [alert, setAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Fetch the conversation at initial render
  useEffect(() => {
    async function fetchConversation() {
      const messageReceiver: string = "fc97e34c-faeb-412e-bca0-3563a5b2fe89";

      const res = (await apiWithauth(
        ChatAPI.startConversation,
        messageReceiver
      )) as Conversation[] | null;

      console.log("API Response:", res);

      if (!res || res.length === 0) {
        setAlertMessage("Failed to find conversation, please reload the page");
        setAlert(true);
        return;
      }

      const conversation = res[0];

      const formattedMessages = conversation.messages.map((msg) => {
        return {
          id: msg.rest.id,
          text: msg.rest.message,
          sender: msg.rest.isSender ? "user" : "admin",
          timestamp: new Date(msg.rest.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          conversation_id: conversation.id.toString(),
        };
      });

      // (5) Set state dengan data yang sudah diformat
      setMessages(formattedMessages);
      setConversationID(conversation.id.toString());
      return;
    }

    fetchConversation();
  }, []);

  // Effect for initializing and cleaning up socket connection
  useEffect(() => {
    let token: string | null = localStorage.getItem("access_token");
    // Connect to the socket server
    const socketInstance = io(SOCKET_SERVER_URL, {
      auth: {
        token: `Bearer ${token}`,
      },
    });
    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      console.log("connected");
      socketInstance.emit(`joinConversation_${conversationID}`);
    });

    socketInstance.on("connection_error", async () => {
      const res = await fetch(`${SERVER_URL}/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = (await res.json()) as unknown as Token;
      console.log(data);

      if (res.status !== 200) {
        router.push("/login");
        return;
      }

      const newToken = data[0].access_token as string;
      token = newToken;
    });

    // Chatbot sender ID from backend
    const CHATBOT_SENDER_ID = "00000000-0000-0000-0000-000000000000";

    // Listen for incoming messages from the server
    socketInstance.on("receiveMessage", (message: any) => {
      // Transform backend message format to frontend Chat format
      const formattedMessage: Chat = {
        id: message.id,
        text: message.message || message.text,
        sender: message.sender_id === CHATBOT_SENDER_ID ? "bot" : "admin",
        timestamp: new Date(
          message.created_at || Date.now()
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        conversation_id:
          message.conversation_id?.toString() || conversationID || "",
      };
      // Hide typing indicator when bot message is received
      if (message.sender_id === CHATBOT_SENDER_ID) {
        setIsTyping(false);
      }
      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    });

    // socketInstance.emit("joinConversation", conversationID);

    // Cleanup on component unmount
    return () => {
      console.log("Disconnecting from socket server...");
      socketInstance.disconnect();
    };
  }, [conversationID, setMessages]);

  // Effect for auto-scrolling to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!conversationID) {
      setAlert(true);
      setAlertMessage(
        "Failed to start the conversation, please reload the page"
      );
      return;
    }

    // Data to be sent to server
    const sendMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      conversation_id: conversationID,
    };

    // Optimistically update the UI
    setMessages((prevMessages) => [...prevMessages, sendMessage]);

    // Show typing indicator while waiting for bot response
    setIsTyping(true);

    // Emit the message to the server
    socketRef.current?.emit("sendMessage", sendMessage, (err: ErrorSocket) => {
      if (err.status === "error") {
        setAlert(true);
        setAlertMessage(err.message);
        return;
      }
    });
  };

  return (
    <>
      <Alert
        isOpen={alert}
        message={alertMessage}
        onConfirm={() => {
          setAlert(false);
        }}
      />
      <div className="flex justify-center bg-secondary">
        <div className="flex flex-col h-screen w-screen max-w-2xl mx-auto bg-gray-50">
          <ChatHeader adminName="Admin Support" />
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4"
          >
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </>
  );
};

export default ChatPage;
