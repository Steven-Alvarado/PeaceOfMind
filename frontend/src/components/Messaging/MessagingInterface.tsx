import React, { useEffect, useState } from "react";
import { useMessaging } from "../../context/MessagingContext";

interface MessagingInterfaceProps {
  userId: number;
  userRole: "student" | "therapist";
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({ userId, userRole }) => {
  const {
    conversations,
    currentConversation,
    messages,
    fetchConversations,
    fetchMessages,
    setCurrentConversation,
    sendMessage,
  } = useMessaging();

  const [newMessage, setNewMessage] = useState("");

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations(userId, userRole);
  }, [userId, userRole]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (currentConversation?.id) {
      console.log("Fetching messages for conversation:", currentConversation.id);
      fetchMessages(currentConversation.id);
    }
  }, [currentConversation]);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentConversation) {
      const receiverId =
        userRole === "student"
          ? currentConversation.therapist_id
          : currentConversation.student_id;
  
      const payload = {
        conversationId: currentConversation.id,
        senderId: userId,
        receiverId,
        messageContent: newMessage,
      };
  
      console.log("Sending message payload:", payload);
  
      sendMessage(payload); // Call the sendMessage function
      setNewMessage(""); // Clear the input field
    }
  };
  return (
    <div className="messaging-interface">
      {/* List of Conversations */}
      <div className="conversations">
        {Array.isArray(conversations) && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setCurrentConversation(conversation)}
              className={`conversation ${
                currentConversation?.id === conversation.id ? "active" : ""
              }`}
            >
              {userRole === "student" ? (
                <>
                  {conversation.therapist_first_name} {conversation.therapist_last_name} <br />
                  <small>{conversation.specialization}</small>
                </>
              ) : (
                <>
                  Student ID: {conversation.student_id}
                </>
              )}
            </div>
          ))
        ) : (
          <div>No conversations available.</div>
        )}
      </div>

      {/* Messages for Selected Conversation */}
      {currentConversation && (
        <div className="messages">
          <div className="messages-list">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sender_id === userId ? "sent" : "received"}`}
                >
                  <p>{message.message_content}</p>
                  <small>{new Date(message.sent_at).toLocaleString()}</small>
                </div>
              ))
            ) : (
              <p>No messages yet. Start the conversation!</p>
            )}
          </div>

          {/* Input for New Messages */}
          <div className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingInterface;
