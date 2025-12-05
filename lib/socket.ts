import { io } from "socket.io-client";

/**
 * @fileoverview Initializes and exports the Socket.IO client instance.
 */

// The URL of the backend server.
const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export const socket = io(URL, {
  /**
   * Disables automatic connection.
   * Connection will be established manually when the component mounts.
   */
  autoConnect: false,
});
