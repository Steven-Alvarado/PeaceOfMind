import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import socket, { Message, MessagePayload } from "../socket";

interface Conversation {
  id: number;
  student_id: number;
  therapist_id: number;
  created_at: string;
  updated_at: string;
}

interface MessagingContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  fetchConversations: (userId: number, role: "student" | "therapist") => void;
  setCurrentConversation: (conversation: Conversation) => void;
  sendMessage: (payload: MessagePayload) => void;
  createConversation: (student_id: number, therapist_id: number) => Promise<void>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const useMessaging = (): MessagingContextType => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error("useMessaging must be used within a MessagingProvider");
  }
  return context;
};

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation.id);
      socket.emit("joinConversation", currentConversation.id);
    }
  }, [currentConversation]);

  /**
   * Fetch all conversations for a user based on their role.
   * @param userId The user ID.
   * @param role The role of the user ("student" or "therapist").
   */
  const fetchConversations = async (userId: number, role: string) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/conversations/${userId}?role=${role}`
      );
      setConversations(data.conversations);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };
  

  /**
   * Fetch all messages for a specific conversation.
   * @param conversationId The conversation ID.
   */
  const fetchMessages = async (conversationId: number) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/messages/${conversationId}`);
      setMessages(data.messages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  /**
   * Send a new message using the WebSocket connection.
   * @param payload The message payload.
   */
  const sendMessage = async (payload: MessagePayload) => {
    try {
      await axios.post(`http://localhost:5000/api/messages/send`, payload);
      socket.emit("sendMessage", payload); // Emit socket event for real-time update
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  /**
   * Create a new conversation between a student and a therapist.
   * @param student_id The student ID.
   * @param therapist_id The therapist ID.
   */
  const createConversation = async (student_id: number, therapist_id: number) => {
    try {
      const { data } = await axios.post<Conversation>(
        `http://localhost:5000/api/conversations/create`,
        { student_id, therapist_id }
      );
      setConversations((prev) => [...prev, data.conversations]);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      if (message.conversation_id === currentConversation?.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [currentConversation]);

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        fetchConversations,
        setCurrentConversation,
        sendMessage,
        createConversation,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};
