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

interface ConversationResponse {
  message: string;
  conversation: {
    id: number;
    student_id: number;
    therapist_id: number;
    created_at: string;
    updated_at: string;
  }
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
  const [potentialConversationPartners, setPotentialConversationPartners] = useState<any[]>([]);
  const [showPotentialPartners, setShowPotentialPartners] = useState(false);

  const fetchPotentialConversationPartners = async () => {
    try {
      let endpoint = "";
      if (userRole === "student") {
        // Endpoint to get the therapist for a student
        endpoint = `http://localhost:5000/api/relationships/${userId}`;
      } else {
        // Endpoint to get the students for a therapist
        endpoint = `http://localhost:5000/api/relationships/therapist/${userId}`;
      }
  
      const response = await fetch(endpoint);
      const data = await response.json();
  
      let partners = [];
      if (userRole === "student") {
        // Student's relationship response contains a single object
        const relationship = data.relationship;
        if (relationship) {
          partners = [
            {
              id: relationship.current_therapist_id,
              first_name: relationship.current_therapist_first_name,
              last_name: relationship.current_therapist_last_name,
            },
          ];
        }
      } else {
        // Therapist's relationships response contains an array
        const relationships = data.relationships || [];
        partners = relationships.map((relationship: {
          student_id: number;
          student_first_name: string;
          student_last_name: string;
        }) => ({
          id: relationship.student_id,
          first_name: relationship.student_first_name,
          last_name: relationship.student_last_name,
        }));
      }
  
      setPotentialConversationPartners(partners);
      setShowPotentialPartners(true);
    } catch (error) {
      console.error("Error fetching potential conversation partners:", error);
      setPotentialConversationPartners([]); // Fallback to an empty array
    }
  };
  

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations(userId, userRole);
  }, [userId, userRole]);

  // Handle real-time messaging and video calls
  useEffect(() => {
    if (currentConversation?.id) {
      fetchMessages(currentConversation.id); // Fetch messages for the current conversation
      scrollToBottom();
  
      socket.emit("joinConversation", currentConversation.id); // Join the room for the current conversation
  
      const handleReceiveMessage = (message: any) => {
        console.log("Message received via socket:", message);
  
        // Check if the message belongs to the current conversation
        if (message.conversation_id === currentConversation.id) {
          setMessages((prevMessages) => [...prevMessages, message]);
          scrollToBottom();
        } else {
          console.warn(
            "Message received for a different conversation:",
            message.conversation_id
          );
        }
      };
  
      socket.on("receiveMessage", handleReceiveMessage);
  
      return () => {
        socket.emit("leaveConversation", currentConversation.id); // Leave the room
        socket.off("receiveMessage", handleReceiveMessage); // Remove listener
      };
    }
  }, [currentConversation]);
  

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      const response = await createConversation(studentId, therapistId);
      console.log("Create conversation response:", response);
      
      if (response?.conversation) {  // Check for the conversation property
        setCurrentConversation(response.conversation); // Access the conversation object
        fetchMessages(response.conversation.id); // Use the conversation id
        setShowPotentialPartners(false); 
      } else {
        console.error("Invalid conversation data returned from API:", response);
        alert("Failed to create conversation properly.");
      }
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
            <button
              onClick={fetchPotentialConversationPartners}
              className="bg-[#5E9ED9] text-white px-4 py-2 mb-4 rounded-lg hover:bg-[#4b8bc4] transition"
            >
              Start New Conversation
            </button>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id ?? `conversation-${conversation.student_id ?? Math.random()}`}
                  onClick={() => setCurrentConversation(conversation)}
                  className={`p-2 mb-2 flex items-center gap-2 cursor-pointer border rounded hover:bg-blue-200 ${
                    currentConversation?.id === conversation.id ? "bg-blue-300" : ""
                  }`}
                >
                  <img
                    src={
                      userRole === "student"
                        ? `http://localhost:5000/api/profilePicture/therapist/${conversation.therapist_id}`
                        : `http://localhost:5000/api/profilePicture/${conversation.student_id}`
                    }
                    alt="Conversation"
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.onerror = null;
                      imgElement.src = "http://localhost:5000/uploads/default-profile.png";
                    }}
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
            {showPotentialPartners ? (
              <div className="flex flex-col h-full">
                <h2 className="text-xl font-semibold mb-4">
                  {userRole === "student" ? "Your Therapist" : "Your Assigned Students"}
                </h2>
                <div className="overflow-y-auto">
                  {potentialConversationPartners.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleStartConversation(
                          userRole === "student" ? userId : partner.id,
                          userRole === "student" ? partner.id : userId
                        );
                        setShowPotentialPartners(false);
                      }}
                    >
                      <img
                        src={`http://localhost:5000/api/profilePicture/${userRole === "student" ? "therapist" : ""}/${partner.id}`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full mr-4"
                        onError={(e) => {
                          const imgElement = e.target as HTMLImageElement;
                          imgElement.onerror = null;
                          imgElement.src = "http://localhost:5000/uploads/default-profile.png";
                        }}
                      />
                      <div>
                        <h3 className="font-semibold">
                          {partner.first_name} {partner.last_name}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowPotentialPartners(false)}
                  className="mt-4 p-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : currentConversation ? (
              <>
                {/* Chat interface */}
                <header className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        userRole === "student"
                          ? `http://localhost:5000/api/profilePicture/therapist/${currentConversation?.therapist_id}`
                          : `http://localhost:5000/api/profilePicture/${currentConversation?.student_id}`
                      }
                      alt="Profile"
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.onerror = null;
                        imgElement.src = "http://localhost:5000/uploads/default-profile.png";
                      }}
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
                  Start a New Conversation
                </h2>
                <button
                  onClick={fetchPotentialConversationPartners}
                  className="bg-[#5E9ED9] text-white px-6 py-3 rounded-lg hover:bg-[#4b8bc4] transition"
                >
                  Find Conversation Partner
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
