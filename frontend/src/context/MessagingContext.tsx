import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";

interface Conversation {
  id: number;
  student_id: number;
  therapist_id: number;
  therapist_first_name?: string;
  therapist_last_name?: string;
  specialization?: string;
  created_at: string;
  updated_at: string;
  student_first_name?: string;
  student_last_name?: string;
  profile_picture?: string;
}

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  message_content: string;
  sent_at: string;
}

interface MessagePayload {
  conversationId: number;
  senderId: number;
  receiverId: number;
  messageContent: string;
}

interface MessagingContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  fetchConversations: (userId: number, role: "student" | "therapist") => void;
  fetchMessages: (conversationId: number) => void;
  setCurrentConversation: (conversation: Conversation) => void;
  sendMessage: (payload: MessagePayload) => void;
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
    const handleReceiveMessage = (message: Message) => {
      if (message.conversation_id === currentConversation?.id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [currentConversation]);

  const fetchConversations = async (userId: number, role: "student" | "therapist") => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/conversations/${userId}?role=${role}`
      );
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setConversations([]);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const { data } = await axios.get<Message[]>(
        `http://localhost:5000/api/messages/${conversationId}`
      );
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]);
    }
  };

  const sendMessage = async (payload: MessagePayload) => {
    try {
      const { conversationId, senderId, receiverId, messageContent } = payload;

      const optimisticMessage: Message = {
        id: Date.now(),
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        message_content: messageContent,
        sent_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      await axios.post("http://localhost:5000/api/messages/send", {
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        message_content: messageContent,
      });

      socket.emit("sendMessage", payload);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (currentConversation?.id) {
      fetchMessages(currentConversation.id);
      socket.emit("joinConversation", currentConversation.id);
    }
  }, [currentConversation]);

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        fetchConversations,
        fetchMessages,
        setCurrentConversation,
        sendMessage,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};
