import { io, Socket } from "socket.io-client";

// Define the type of events your socket can emit and listen for
interface ServerToClientEvents {
  receiveMessage: (message: Message) => void;
}

interface ClientToServerEvents {
  sendMessage: (data: MessagePayload) => void;
  joinConversation: (conversationId: number) => void;
}

// Define the Message type (adjust based on your backend structure)
export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  message_content: string;
  sent_at: string;
}

// Define the payload type for sending messages
export interface MessagePayload {
  conversationId: number;
  senderId: number;
  receiverId: number;
  messageContent: string;
}

// Initialize the socket connection
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:5000", { autoConnect: false });

export default socket;
