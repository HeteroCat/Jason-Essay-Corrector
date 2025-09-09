// FIX: Import Chat type for chat functionality
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { CorrectionResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A brief, encouraging, one or two-sentence summary of the overall feedback."
    },
    scores: {
      type: Type.OBJECT,
      description: "An object containing scores from 1 to 10 for each writing category.",
      properties: {
        GRAMMAR: { type: Type.NUMBER, description: "Score for Grammar from 1 to 10." },
        SPELLING: { type: Type.NUMBER, description: "Score for Spelling from 1 to 10." },
        CLARITY: { type: Type.NUMBER, description: "Score for Clarity from 1 to 10." },
        STYLE: { type: Type.NUMBER, description: "Score for Style from 1 to 10." },
        PUNCTUATION: { type: Type.NUMBER, description: "Score for Punctuation from 1 to 10." },
        STRUCTURE: { type: Type.NUMBER, description: "Score for Structure from 1 to 10." },
      },
      required: ["GRAMMAR", "SPELLING", "CLARITY", "STYLE", "PUNCTUATION", "STRUCTURE"]
    },
    corrections: {
      type: Type.ARRAY,
      description: "An array of correction objects for the essay.",
      items: {
        type: Type.OBJECT,
        properties: {
          originalText: {
            type: Type.STRING,
            description: "The exact phrase or sentence from the original essay that needs correction."
          },
          suggestion: {
            type: Type.STRING,
            description: "The corrected or improved version of the text."
          },
          explanation: {
            type: Type.STRING,
            description: "A concise explanation of why the change is recommended (e.g., 'Incorrect verb tense', 'Spelling error')."
          },
          category: {
            type: Type.STRING,
            enum: ['GRAMMAR', 'SPELLING', 'CLARITY', 'STYLE', 'PUNCTUATION', 'STRUCTURE'],
            description: "The category of the correction."
          }
        },
        required: ["originalText", "suggestion", "explanation", "category"]
      }
    }
  },
  required: ["summary", "corrections", "scores"]
};


// FIX: Added chat functionality to allow users to ask follow-up questions.
let chat: Chat | null = null;

const initializeChat = (essay: string, corrections: CorrectionResponse) => {
    const systemInstruction = `You are an expert English teacher AI assistant. The user has submitted an essay and received corrections. 
The original essay was:
---
${essay}
---

The corrections provided were:
---
${JSON.stringify(corrections, null, 2)}
---

Your role is to answer follow-up questions from the user about their essay, the corrections, or general English writing advice. Be helpful, encouraging, and provide clear explanations. Keep your answers concise.`;

    chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction,
        }
    });
};


export const correctEssay = async (essayText: string): Promise<CorrectionResponse> => {
  if (!essayText.trim()) {
    throw new Error("Essay text cannot be empty.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please correct the following essay and provide feedback: \n\n---\n\n${essayText}`,
      config: {
        systemInstruction: "You are an expert English teacher and essay corrector. Your goal is to provide constructive feedback on the user's essay. Analyze the essay for grammar, spelling, clarity, style, punctuation, and overall structure. Provide specific suggestions for improvement and a score from 1 to 10 for each category in the requested JSON format. Be thorough and find all potential issues.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    
    // Validate the structure of the parsed response
    if (!parsedResponse.summary || !Array.isArray(parsedResponse.corrections) || !parsedResponse.scores) {
        throw new Error("Invalid response format from API.");
    }
    
    // FIX: Initialize chat session after successful correction
    initializeChat(essayText, parsedResponse);
    
    return parsedResponse as CorrectionResponse;
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get corrections from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};

// FIX: Added function to send messages to the initialized chat.
export const sendChatMessage = async (message: string): Promise<string> => {
    if (!chat) {
        throw new Error("Chat not initialized. Please correct an essay first.");
    }
    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending chat message:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get chat response from AI: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the AI.");
    }
};