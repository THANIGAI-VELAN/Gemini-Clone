import React, { useState, useRef, useEffect } from "react";
import { Plus, SlidersHorizontal, Mic, Send, PlusCircleIcon, PlusIcon, Mic2, Mic2Icon } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import assets from "../assets/assets";


// Initialize GoogleGenAI client
const ai = new GoogleGenAI({ 
  apiKey: "AIzaSyDDbstP6g3lddRP4vDbJvr9uyJH0mVoz2w" 
});

// Note: Import these in your actual project:
import Sidebar from "./Sidebar/Sidebar";
 import { UserButton, useUser, useClerk } from "@clerk/clerk-react";




function ChatInterface() {
   const { user } = useUser();

 const { openSignIn } = useClerk();


  const [input, setInput] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  // Initialize chat session when component mounts
  useEffect(() => {
    chatRef.current = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are a friendly and helpful assistant. Keep your responses concise."
      }
    });
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Handle sending messages to Gemini API using @google/genai
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setChatStarted(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      // Send message using the chat session
      const result = await chatRef.current.sendMessage({ message: userMessage });
      
      // Extract response text
      const aiResponse = result.text || "Sorry, I couldn't generate a response.";

      // Add AI response to chat
      setMessages((prev) => [...prev, { role: "assistant", text: aiResponse }]);
    } catch (error) {
      console.error("Error fetching from Gemini:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I encountered an error. Please check your API key and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-[#0E0F11] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1 px-10 py-6 relative">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-semibold">Gemini</h1>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <button
                onClick={() => openSignIn({ redirectUrl: "/chat" })}
                className="px-5 py-2.5 rounded-full text-sm font-medium 
                           bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                           hover:from-blue-500 hover:to-purple-500
                           shadow-[0_0_12px_rgba(59,130,246,0.5)] 
                           transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* --- Before Chat Starts --- */}
        {!chatStarted ? (
          <div className="flex flex-col items-center justify-center grow text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#3B82F6] mb-10">
              Hello, {user?.firstName || "Guest! Ask Gemini Anything."}
            </h1>

            {/* Input Box */}
            <div className="flex items-center w-full max-w-2xl bg-[#1C1C1E] rounded-3xl px-6 py-4 
                            shadow-[0_0_15px_rgba(59,130,246,0.1)] border border-gray-800 
                            hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] transition">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Gemini"
                className="grow bg-transparent outline-none text-gray-300 text-lg"
              />
              <div className="flex items-center gap-4 text-gray-400">
                <Plus className="w-5 h-5 cursor-pointer hover:text-gray-200 transition" />
                <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200 transition">
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="text-sm hidden sm:inline">Tools</span>
                </div>
                <Mic className="w-5 h-5 cursor-pointer hover:text-gray-200 transition" />
              </div>
            </div>

            {/* Suggestion Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {["🍌 Create Image", "Write", "Build", "Deep Research", "Learn"].map(
                (label, idx) => (
                  <button
                    key={idx}
                    className="bg-[#1C1C1E] px-6 py-2 rounded-full text-gray-300 
                               hover:bg-[#2C2C2E] transition 
                               shadow-[0_0_10px_rgba(59,130,246,0.1)] 
                               hover:shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          /* --- After Chat Starts --- */
          <div className="flex flex-col flex-1 overflow-hidden mx-50">
            <div className="flex-1 overflow-y-auto space-y-6 px-2 custom-scrollbar mb-4 mx-50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                ><img src={assets.gemini_icon} alt=""  className={`  ${
                    msg.role === "user" ? "w-0 h-0" : "w-10 h-10"}`}/>
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-[#363636] text-gray-200 rounded-bl-none border border-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#1C1C1E] px-4 py-3 rounded-2xl text-gray-400 animate-pulse">
                    Gemini is thinking...
                  </div>
                </div>
              )}
              {/* Gemini Icon at the end */}
              <div className="flex items-end flex-row">
         
              <div ref={messagesEndRef} />
              </div>
            </div>

                 {/* Input Section */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="bg-[#1C1C1E] rounded-3xl px-6 py-4 mb-6 shadow-[0_0_15px_rgba(59,130,246,0.1)] border border-gray-800 transition">
                <div className="flex items-start gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent outline-none text-gray-300 text-lg py-2"
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading}
                    className="flex items-center gap-2 m-4 cursor-pointer text-gray-400 "
                  >
                    <Send className="w-6 h-6 cursor-pointer hover:text-gray-200  rounded-full  transition" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-3 text-gray-400">
                  <Plus className="w-5 h-5 cursor-pointer hover:text-gray-200 transition" />
                  <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200 transition">
                    <SlidersHorizontal className="w-5 h-5" />
                    <span className="text-sm hidden sm:inline">Tools</span>
                  </div>
                  <Mic className="w-5 h-5 cursor-pointer hover:text-gray-200 transition" />
                </div>
              </div>
            </div>
            {/* Input Section */}
            {/* <div className="flex  items-center w-full bg-[#1C1C1E] rounded-3xl px-8 py-4 mb-15 
                            shadow-[0_0_15px_rgba(59,130,246,0.1)] border border-gray-800 
                            hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] transition">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="grow bg-transparent outline-none text-gray-300 text-lg"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="flex items-center gap-5 cursor-pointer hover:text-gray-200 transition"
              >
                <Send className="w-5 h-5 text-gray-400 m-2" />
              </button>
              <div className="flex  items-center gap-4 text-gray-400">
                <Plus className="w-5 h-5 cursor-pointer hover:text-gray-200 transition" />
                <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200 transition">
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="text-sm hidden sm:inline">Tools</span>
                </div>
                <Mic className="w-5 h-5 cursor-pointer hover:text-gray-200 transition" />
              </div>
            </div> */}
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

export default ChatInterface;