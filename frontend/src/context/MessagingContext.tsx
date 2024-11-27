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
  fetchMessages: (conversationId: number) => void; // Added fetchMessages here
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
    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      if (message.conversation_id === currentConversation?.id) {
        setMessages((prev) => [...prev, message]);
      }
    });
  
    // Clean up when the component is unmounted
    return () => {
      socket.off("receiveMessage");
    };
  }, [currentConversation]);
  /**
   * Fetch all conversations for a user based on their role.
   * @param userId The user ID.
   * @param role The role of the user ("student" or "therapist").
   */
  const fetchConversations = async (userId: number, role: "student" | "therapist") => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/conversations/${userId}?role=${role}`
      );
      console.log("Fetched conversations from API:", response.data);
      setConversations(response.data); // Use the direct array from backend
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setConversations([]); // Reset conversations on failure
    }
  };

  /**
   * Fetch all messages for a specific conversation.
   * @param conversationId The conversation ID.
   */
  const fetchMessages = async (conversationId: number) => {
    try {
      const { data } = await axios.get<Message[]>(`http://localhost:5000/api/messages/${conversationId}`);
      console.log("Fetched messages:", data); // Debugging log
      setMessages(data); // Update the messages state
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]); // Prevent undefined issues by setting an empty array
    }
  };

  useEffect(() => {
    if (currentConversation?.id) {
      fetchMessages(currentConversation.id);
      socket.emit("joinConversation", currentConversation.id);
    }
  }, [currentConversation]);

  /**
   * Send a new message using the WebSocket connection.
   * @param payload The message payload.
   */
  const sendMessage = async (payload: MessagePayload) => {
    try {
      const { conversationId, senderId, receiverId, messageContent } = payload;
  
      // Ensure all required fields are present
      if (!conversationId || !senderId || !receiverId || !messageContent) {
        console.error("Missing required fields in payload:", payload);
        return;
      }
  
      // Optimistic update
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(), // Temporary ID for optimistic rendering
          conversation_id: conversationId,
          sender_id: senderId,
          receiver_id: receiverId,
          message_content: messageContent,
          sent_at: new Date().toISOString(), // Timestamp
          is_read: false, // Default read status
        },
      ]);
  
      // API request to send the message
      await axios.post("http://localhost:5000/api/messages/send", {
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        message_content: messageContent,
      });
  
      // Emit the WebSocket event for real-time updates
      socket.emit("sendMessage", payload);
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
      setConversations((prev) => [...prev, data]);
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
        fetchMessages, 
        setCurrentConversation,
        sendMessage,
        createConversation,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};
