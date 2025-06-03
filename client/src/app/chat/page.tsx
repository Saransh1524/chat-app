"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "@lib/socket";
import MessageList from "@components/MessageList";
import ChatInput from "@components/ChatInput";

interface Message {
  _id: string;
  username: string;
  text: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  // Get username from localStorage or default to "Anonymous"
  const username =
    typeof window !== "undefined"
      ? localStorage.getItem("username") || "Anonymous"
      : "Anonymous";
  const lastMessage = messages.length > 0 ? messages[messages.length - 1].text : "";
  useEffect(() => {
    // Load initial messages
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMessages(res.data);
      });

    // Listen for incoming messages
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listen for chat history
    socket.on("chat_history", (msgs) => {
      setMessages(msgs);
    });

    return () => {
      socket.off("receive_message");
      socket.off("chat_history");
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Real-Time Chat</h1>
      <MessageList messages={messages} />
      <ChatInput username={username} lastMessage={lastMessage} />
    </div>
  );
};

export default ChatPage;
