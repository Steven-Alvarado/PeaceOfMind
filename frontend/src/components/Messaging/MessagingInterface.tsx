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
    setCurrentConversation,
    sendMessage,
  } = useMessaging();

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (userId && userRole) {
      fetchConversations(userId, userRole);
    } else {
      console.error("userId or userRole is undefined");
    }
  }, [userId, userRole, fetchConversations]);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentConversation) {
      const receiverId =
        userRole === "student"
          ? currentConversation.therapist_id
          : currentConversation.student_id;

      sendMessage({
        conversationId: currentConversation.id,
        senderId: userId,
        receiverId,
        messageContent: newMessage,
      });
      setNewMessage("");
    }
  };

  return (
    <div className="messaging-interface">
      <div className="conversations">
        <h3>Conversations</h3>
        {conversations?.length > 0 ? (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setCurrentConversation(conversation)}
              className={`conversation ${
                currentConversation?.id === conversation.id ? "active" : ""
              }`}
            >
              {userRole === "student"
                ? `Therapist ID: ${conversation.therapist_id}`
                : `Student ID: ${conversation.student_id}`}
            </div>
          ))
        ) : (
          <p>No conversations available</p>
        )}
      </div>

      {currentConversation && (
        <div className="messages">
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender_id === userId ? "sent" : "received"}`}
              >
                {message.message_content}
              </div>
            ))}
          </div>

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
