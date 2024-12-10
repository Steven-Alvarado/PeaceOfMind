const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

import { io } from "socket.io-client";

const socket = io(API_BASE_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to backend via WebSocket");
});

socket.on("connect_error", (err) => {
  console.error("WebSocket connection error:", err.message);
});

export default socket;