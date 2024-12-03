import React, { useEffect, useRef, useState } from "react";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  AlertCircle,
} from "lucide-react";
import socket from "../../socket";

interface VideoCallProps {
  roomId: string;
  userId: number;
  onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId, userId, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let callTimer: NodeJS.Timeout | null = null;

    if (isConnected) {
      callTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [isConnected]);

  useEffect(() => {
    // Initialize the call when the component mounts
    const initCall = async () => {
      try {
        // Get local media stream
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = localStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        // Create peer connection
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" }, // Public STUN server
          ],
        });

        peerConnectionRef.current = peerConnection;

        // Add local tracks to peer connection
        localStream.getTracks().forEach((track) =>
          peerConnection.addTrack(track, localStream)
        );

        // Handle remote stream
        peerConnection.ontrack = (event) => {
          const [remoteStream] = event.streams;
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("sendIceCandidate", {
              roomId,
              candidate: event.candidate,
            });
          }
        };

        // Join room
        socket.emit("joinVideoRoom", { roomId, userId });

        // Handle signaling data
        socket.on("receiveSignal", async ({ type, data }) => {
          if (type === "offer") {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit("sendSignal", { roomId, type: "answer", data: answer });
          } else if (type === "answer") {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
          } else if (type === "candidate") {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });

        // Create and send offer if initiating the call
        if (roomId) {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          socket.emit("sendSignal", { roomId, type: "offer", data: offer });
        }

        setIsConnected(true);
      } catch (error) {
        setError("Failed to initialize call.");
        console.error(error);
      }
    };

    initCall();

    return () => {
      // Clean up on unmount
      peerConnectionRef.current?.close();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      socket.emit("leaveVideoRoom", roomId);
    };
  }, [roomId, userId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center p-4 rounded-lg">
      {/* Video Area */}
      <div className="relative flex-1 w-full bg-black rounded-lg overflow-hidden shadow-md">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video */}
        <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-md overflow-hidden border-2 border-white">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Status */}
        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-full">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
          <span className="text-sm font-medium text-gray-700">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {/* Call Timer */}
        {isConnected && (
          <div className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-gray-700">{formatTime(callDuration)}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex space-x-4">
        <button onClick={toggleMute} className="p-2 bg-gray-200 rounded-full">
          {isMuted ? <MicOff className="w-6 h-6 text-gray-800" /> : <Mic className="w-6 h-6 text-gray-800" />}
        </button>
        <button onClick={onEndCall} className="p-2 bg-red-500 rounded-full">
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
        <button onClick={toggleVideo} className="p-2 bg-gray-200 rounded-full">
          {isVideoEnabled ? <VideoOff className="w-6 h-6 text-gray-800" /> : <Video className="w-6 h-6 text-gray-800" />}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
