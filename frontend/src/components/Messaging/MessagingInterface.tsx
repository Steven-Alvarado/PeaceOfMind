import React, { useEffect, useState, useRef } from "react";
import { useMessaging } from "../../context/MessagingContext";
import VideoCall from "./VideoCall";
import { Video, Send, ChevronLeft, X } from "lucide-react";
import socket from "../../socket";

interface MessagingInterfaceProps {
  userId: number;
  userRole: "student" | "therapist";
  onClose: () => void;
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({ userId, userRole, onClose }) => {
  const {
    conversations,
    currentConversation,
    messages,
    fetchConversations,
    setCurrentConversation,
    sendMessage,
    fetchMessages,
  } = useMessaging();

  const [newMessage, setNewMessage] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations(userId, userRole);
  }, [userId, userRole]);

  // Manage real-time message updates and scroll behavior
  useEffect(() => {
    if (currentConversation?.id) {
      fetchMessages(currentConversation.id);
      scrollToBottom();

      socket.emit("joinConversation", currentConversation.id);

      const handleReceiveMessage = (message: any) => {
        if (message.conversation_id === currentConversation.id) {
          fetchMessages(currentConversation.id); // Ensure consistent state update
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.emit("leaveConversation", currentConversation.id);
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [currentConversation]);

  // Scroll to bottom whenever messages are updated
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      setNewMessage(""); // Clear the input box
    }
  };

  const handleStartVideoCall = () => {
    if (currentConversation?.id) {
      socket.emit("startVideoCall", currentConversation.id);
      setIsVideoCallActive(true);
    } else {
      alert("Please select a conversation to start a video call.");
    }
  };

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-4/5 h-4/5 max-w-6xl max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-1 right-1 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex h-full">
          {/* Sidebar */}
          <aside className="w-1/4 bg-blue-100 p-4 rounded-l-lg flex flex-col">
            <header className="mb-4">
              <h2 className="text-lg font-bold text-[#5E9ED9]">Messages</h2>
            </header>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setCurrentConversation(conversation)}
                  className={`p-2 mb-2 flex items-center gap-2 cursor-pointer border rounded hover:bg-blue-200 ${
                    currentConversation?.id === conversation.id ? "bg-blue-300" : ""
                  }`}
                >
                  <img
                    src={conversation.profile_picture || "https://via.placeholder.com/50"}
                    alt="Conversation"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {userRole === "student"
                        ? `${conversation.therapist_first_name} ${conversation.therapist_last_name}`
                        : `${conversation.student_first_name} ${conversation.student_last_name}`}
                    </h3>
                    {userRole === "student" && (
                      <p className="text-sm text-gray-500">{conversation.specialization}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Chat Section */}
          <div className="w-3/4 p-6 flex flex-col">
            {isVideoCallActive ? (
              <VideoCall
                conversationId={currentConversation?.id!}
                userId={userId}
                onEndCall={handleEndVideoCall}
              />
            ) : (
              <>
                <header className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={currentConversation?.profile_picture || "https://via.placeholder.com/50"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <h2 className="font-semibold text-gray-900">
                      {userRole === "student"
                        ? `${currentConversation?.therapist_first_name} ${currentConversation?.therapist_last_name}`
                        : `${currentConversation?.student_first_name} ${currentConversation?.student_last_name}`}
                    </h2>
                  </div>
                  <button
                    onClick={handleStartVideoCall}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Video className="w-6 h-6 text-gray-600" />
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === userId ? "justify-end" : "justify-start"
                      } mb-4`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          message.sender_id === userId
                            ? "bg-[#5E9ED9] text-white rounded-tr-none"
                            : "bg-gray-200 text-gray-900 rounded-tl-none"
                        }`}
                      >
                        <p>{message.message_content}</p>
                        <p className="text-xs mt-1 text-gray-500">
                          {new Date(message.sent_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 rounded-full bg-[#5E9ED9] text-white"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;
