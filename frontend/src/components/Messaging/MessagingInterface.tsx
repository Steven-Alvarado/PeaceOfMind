import React, { useEffect, useState, useRef } from "react";
import { useMessaging } from "../../context/MessagingContext";
import VideoCall from "./VideoCall";
import { Video, Send, X } from "lucide-react";
import socket from "../../socket";

interface MessagingInterfaceProps {
  userId: number;
  userRole: "student" | "therapist";
  onClose: () => void;
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({
  userId,
  userRole,
  onClose,
}) => {
  const {
    conversations,
    currentConversation,
    messages,
    fetchConversations,
    setCurrentConversation,
    sendMessage,
    fetchMessages,
    createConversation,
    setMessages,
  } = useMessaging();

  const [newMessage, setNewMessage] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callRoomId, setCallRoomId] = useState<string | null>(null);
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

  // Handle real-time messaging and video calls
  useEffect(() => {
    if (currentConversation?.id) {
      fetchMessages(currentConversation.id);
      scrollToBottom();

      socket.emit("joinConversation", currentConversation.id);

      // Message reception
      const handleReceiveMessage = (message: any) => {
        if (message.conversation_id === currentConversation.id) {
          setMessages((prevMessages) => [...prevMessages, message]);
          scrollToBottom();
        }
      };

      // Incoming call
      const handleIncomingCall = (roomId: string) => {
        setIncomingCall(true);
        setCallRoomId(roomId);
      };

      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("incomingCall", handleIncomingCall);

      return () => {
        socket.emit("leaveConversation", currentConversation.id);
        socket.off("receiveMessage", handleReceiveMessage);
        socket.off("incomingCall", handleIncomingCall);
      };
    }
  }, [currentConversation]);

  // Scroll to bottom whenever messages are updated
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      if (!currentConversation) {
        console.warn("No current conversation. Cannot send a message.");
        return;
      }

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

  const handleStartConversation = async (studentId: number, therapistId: number) => {
    try {
      const newConversation = await createConversation(studentId, therapistId);

      if (!newConversation || !newConversation.id) {
        console.error("Invalid conversation data returned from API:", newConversation);
        alert("Failed to create a valid conversation.");
        return;
      }

      setCurrentConversation(newConversation);
      fetchMessages(newConversation.id);
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to create a conversation.");
    }
  };

  const handleStartVideoCall = () => {
    if (currentConversation?.id) {
      const roomId = `conversation_${currentConversation.id}`;
      socket.emit("startVideoCall", roomId);
      setCallRoomId(roomId);
      setIsVideoCallActive(true);
    } else {
      alert("Please select a conversation to start a video call.");
    }
  };

  const handleAcceptCall = () => {
    setIsVideoCallActive(true);
    setIncomingCall(false);
  };

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
    setCallRoomId(null);
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
                  key={conversation.id ?? `conversation-${conversation.student_id ?? Math.random()}`}
                  onClick={() => setCurrentConversation(conversation)}
                  className={`p-2 mb-2 flex items-center gap-2 cursor-pointer border rounded hover:bg-blue-200 ${currentConversation?.id === conversation.id ? "bg-blue-300" : ""
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
              <div className="flex flex-col h-full">
                <VideoCall roomId={callRoomId!} userId={userId} onEndCall={handleEndVideoCall} />
                <button
                  onClick={handleEndVideoCall}
                  className="mt-4 p-2 bg-blue-500 text-white rounded-lg self-center hover:bg-blue-600 transition"
                >
                  Back to Chat
                </button>
              </div>
            ) : incomingCall ? (
              <div className="flex flex-col h-full items-center justify-center">
                <p className="text-xl font-bold">Incoming Video Call...</p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleAcceptCall}
                    className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setIncomingCall(false)}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ) : currentConversation ? (
              <>
                {/* Chat interface */}
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
                  {messages.map((message, index) => (
                    <div
                      key={message.id ?? `message-${index}`}
                      className={`flex ${message.sender_id === userId ? "justify-end" : "justify-start"} mb-4`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${message.sender_id === userId
                            ? "bg-[#5E9ED9] text-white rounded-tr-none"
                            : "bg-gray-200 text-gray-900 rounded-tl-none"
                          }`}
                      >
                        <p>{message.message_content}</p>
                        <p className="text-xs mt-1 text-gray-500">
                          {message.sent_at
                            ? new Intl.DateTimeFormat("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "America/New_York",
                            }).format(new Date(message.sent_at))
                            : "Unknown time"}
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
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  No conversation selected.
                </h2>
                <p className="text-gray-500 mb-6">
                  Click on a conversation or start a new chat with a patient or therapist.
                </p>
                <button
                  onClick={() => handleStartConversation(userId, userRole === "student" ? userId : 0)}
                  className="bg-[#5E9ED9] text-white px-6 py-3 rounded-lg hover:bg-[#4b8bc4] transition"
                >
                  Start New Conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;
