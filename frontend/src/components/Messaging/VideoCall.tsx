import React, { useRef, useEffect, useState } from "react";
import socket from "../../socket"; // Import your configured socket instance

interface VideoCallProps {
  conversationId: number;
  userId: number;
  onEndCall: () => void; // Callback to handle end call action
}

const VideoCall: React.FC<VideoCallProps> = ({ conversationId, userId, onEndCall }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [isCalling, setIsCalling] = useState(false);

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }, // Public STUN server
      // Add TURN server details if needed for production
    ],
  };

  useEffect(() => {
    // Initialize WebRTC connection
    peerConnectionRef.current = new RTCPeerConnection(iceServers);

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          conversationId,
          candidate: event.candidate,
        });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Socket listeners for signaling
    socket.on("offer", async (offer) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        socket.emit("answer", { conversationId, answer });
      }
    });

    socket.on("answer", async (answer) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("iceCandidate", async (candidate) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Error adding received ICE candidate:", error);
        }
      }
    });

    // Cleanup on unmount
    return () => {
      peerConnectionRef.current?.close();
      socket.off("offer");
      socket.off("answer");
      socket.off("iceCandidate");
    };
  }, [conversationId]);

  const startCall = async () => {
    try {
      setIsCalling(true);
      socket.emit("joinConversation", conversationId);

      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      localStream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, localStream);
      });

      const offer = await peerConnectionRef.current?.createOffer();
      await peerConnectionRef.current?.setLocalDescription(offer);

      socket.emit("offer", { conversationId, offer });
    } catch (error) {
      console.error("Error starting call:", error);
      setIsCalling(false);
    }
  };

  const endCall = () => {
    setIsCalling(false);
    peerConnectionRef.current?.close();
    peerConnectionRef.current = new RTCPeerConnection(iceServers); // Reinitialize for future calls
    socket.emit("leaveConversation", conversationId);
    onEndCall(); // Notify parent component to close the video call UI
  };

  return (
    <div className="video-call">
      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted className="local-video" />
        <video ref={remoteVideoRef} autoPlay className="remote-video" />
      </div>
      <div className="call-controls">
        {!isCalling ? (
          <button onClick={startCall} className="start-call">
            Start Call
          </button>
        ) : (
          <button onClick={endCall} className="end-call">
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
