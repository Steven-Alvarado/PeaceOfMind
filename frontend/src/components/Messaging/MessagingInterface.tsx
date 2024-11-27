import React, { useEffect, useState } from "react";
import { useMessaging } from "../../context/MessagingContext";
import VideoCall from "./VideoCall";
import { Video, Send, ChevronLeft, X } from "lucide-react";

interface MessagingInterfaceProps {
  userId: number;
  userRole: "student" | "therapist";
  onClose: () => void; // Add a prop for closing the modal
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({ userId, userRole, onClose }) => {
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
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  useEffect(() => {
    fetchConversations(userId, userRole);
  }, [userId, userRole]);

  useEffect(() => {
    if (currentConversation?.id) {
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

      sendMessage(payload);
      setNewMessage("");
    }
  };

  const handleStartVideoCall = () => {
    if (currentConversation?.id) {
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
        {/* Close Button */}
        <button
          onClick={onClose} // Close modal on click
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
              {Array.isArray(conversations) && conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setCurrentConversation(conversation)}
                    className={`p-2 mb-2 flex items-center gap-2 cursor-pointer border rounded hover:bg-blue-200 ${
                      currentConversation?.id === conversation.id ? "bg-blue-300" : ""
                    }`}
                  >
                    <img
                      src="https://via.placeholder.com/50" // Replace with avatar if available
                      alt="Conversation"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {userRole === "student"
                          ? `${conversation.therapist_first_name} ${conversation.therapist_last_name}`
                          : `Student ID: ${conversation.student_id}`}
                      </h3>
                      {userRole === "student" && (
                        <p className="text-sm text-gray-500">{conversation.specialization}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No conversations available.</p>
              )}
            </div>
          </aside>

          {/* Main Chat Area */}
          <div className="w-3/4 p-6 flex flex-col">
            {isVideoCallActive ? (
              <div className="relative h-full">
                <div className="absolute top-0 left-0 z-10">
                  <button
                    onClick={handleEndVideoCall}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 text-white"
                  >
                    <ChevronLeft size={20} />
                    Back to Chat
                  </button>
                </div>
                <VideoCall
                  conversationId={currentConversation?.id!}
                  userId={userId}
                  onEndCall={handleEndVideoCall}
                />
              </div>
            ) : (
              <>
                <header className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://via.placeholder.com/50" // Replace with avatar if available
                      alt="Active conversation"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {userRole === "student"
                          ? `${currentConversation?.therapist_first_name} ${currentConversation?.therapist_last_name}`
                          : `Student ID: ${currentConversation?.student_id}`}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={handleStartVideoCall}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Video className="w-6 h-6 text-gray-600" />
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto mb-4">
                  {messages.length > 0 ? (
                    messages.map((message) => (
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
                          <p
                            className={`text-xs mt-1 ${
                              message.sender_id === userId ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(message.sent_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 rounded-full bg-[#5E9ED9] text-white hover:bg-blue-300"
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
