import { GoogleGenAI } from "@google/genai";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// Initializes the GoogleGenAI client.
// It automatically looks for the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({ apiKey: "AIzaSyDDbstP6g3lddRP4vDbJvr9uyJH0mVoz2w" });

async function runChatbot() {
  // Use the chat service for multi-turn conversations
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    // Optional: Add a system instruction to define the chatbot's personality/role
    config: {
      systemInstruction: "You are a friendly and helpful assistant. Keep your responses concise."
    }
  });

  const rl = readline.createInterface({ input, output });

  console.log("Chatbot initialized. Type 'exit' to quit.");

  while (true) {
    const userInput = await rl.question("You: ");

    if (userInput.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      break;
    }

    try {
      // Send the user's message and get the response
      const result = await chat.sendMessage({ message: userInput });
      
      const responseText = result.text;
      console.log(`Gemini: ${responseText}`);
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  }
}

runChatbot();