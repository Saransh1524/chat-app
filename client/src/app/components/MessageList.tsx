import React from "react";

interface Message {
  _id: string;
  username: string;
  text: string;
}

const MessageList = ({ messages }: { messages: Message[] }) => (
  <div className="flex flex-col space-y-2">
    {messages.map((msg) => (
      <div key={msg._id} className="bg-gray-400 p-2 rounded ">
        <strong>{msg.username}:</strong> {msg.text}
      </div>
    ))}
  </div>
);

export default MessageList;
