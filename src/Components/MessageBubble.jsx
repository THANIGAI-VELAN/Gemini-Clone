import React from "react";

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} items-start`}
    >
      {!isUser && (
        <div className="bg-blue-600 w-9 h-9 rounded-full flex items-center justify-center text-white mr-3">
          G
        </div>
      )}

      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-[#2A2B31] text-gray-200 rounded-bl-none"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export default MessageBubble;
