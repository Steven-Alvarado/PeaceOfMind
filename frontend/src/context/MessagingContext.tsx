import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  fetchConversations: (userId: number, role: "student" | "therapist") => void;
  fetchMessages: (conversationId: number) => void;
  setCurrentConversation: (conversation: Conversation) => void;
  sendMessage: (payload: MessagePayload) => void;
  createConversation: (studentId: number, therapistId: number) => Promise<Conversation>; 
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
    if (currentConversation?.id) {
      console.log("Joining conversation:", currentConversation.id);
  
      fetchMessages(currentConversation.id); 
  
      socket.emit("joinConversation", currentConversation.id);
  
      const handleReceiveMessage = (message: any) => {
        console.log("Message received via socket:", message);
      
        const normalizedMessage = {
          ...message,
          sent_at: message.sent_at ? new Date(message.sent_at).toISOString() : null, // Safeguard for invalid dates
        };
      
        if (message.conversationId === currentConversation?.id) {
          setMessages((prevMessages) => [...prevMessages, normalizedMessage]);
          
        } else {
          console.warn("Message received for a different conversation:", message.conversationId);
        }
      };
      
  
      socket.on("receiveMessage", handleReceiveMessage);
  
      return () => {
        console.log("Leaving conversation:", currentConversation.id);
        socket.emit("leaveConversation", currentConversation.id);
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [currentConversation]);
  
  const fetchConversations = async (userId: number, role: "student" | "therapist") => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/conversations/${userId}?role=${role}`
      );
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setConversations([]);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      if (!conversationId) {
        throw new Error("Invalid conversation ID");
      }
      const { data } = await axios.get<Message[]>(`${API_BASE_URL}/api/messages/${conversationId}`);
      setMessages(data); // Use `sent_at` as provided by the API
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]);
    }
  };
  
  

  const createConversation = async (studentId: number, therapistId: number) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/conversations/create`, {
        student_id: studentId,
        therapist_id: therapistId,
      });
      return data; // The created conversation
    } catch (error) {
      console.error("Failed to create conversation:", error);
      throw new Error("Could not create conversation.");
    }
  };

  const sendMessage = async (payload: MessagePayload) => {
    try {
      // Emit the message to the backend via Socket.IO
      socket.emit("sendMessage", payload);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  



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
        createConversation,
        setMessages,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};
