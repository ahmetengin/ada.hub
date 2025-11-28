import { GoogleGenAI, Chat } from "@google/genai";
import { ADA_SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;

export const initializeChat = async (): Promise<Chat> => {
  if (chatSession) return chatSession;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables.");
    // In a real app, we'd handle this more gracefully, but for this demo structure:
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: ADA_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      tools: [{ googleMaps: {} }],
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<{ text: string; groundingMetadata?: any }> => {
  try {
    const chat = await initializeChat();
    const result = await chat.sendMessage({ message });
    return {
      text: result.text || "I processed that, but have no text response.",
      groundingMetadata: result.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      text: "I am currently unable to connect to the neural network. Please try again later.",
      groundingMetadata: null
    };
  }
};