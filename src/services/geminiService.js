import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function smartSearch(query) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user is looking for: "${query}". 
      Provide a concise summary of what this is, and if it's a game, suggest where they might find unblocked versions or similar games. 
      Format the response in clean Markdown.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Search error:", error);
    return { text: "Search failed. Please try again later.", sources: [] };
  }
}
