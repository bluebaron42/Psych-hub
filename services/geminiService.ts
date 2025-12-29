import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Lesson, Level } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema for a Lesson
const lessonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The main title of the lesson" },
    description: { type: Type.STRING, description: "A brief summary of what the lesson covers" },
    slides: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["title", "content", "quiz"] },
          title: { type: Type.STRING },
          content: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Bullet points or paragraphs for the slide content"
          },
          speakerNotes: { type: Type.STRING, description: "Teacher notes for this slide" }
        },
        required: ["id", "type", "title", "content"]
      }
    }
  },
  required: ["title", "description", "slides"]
};

export const generateLessonContent = async (topic: string, level: Level, context?: string): Promise<Lesson | null> => {
  try {
    const prompt = `
      Create a comprehensive Psychology lesson plan for ${level} level students (AQA Specification).
      Topic: ${topic}.
      Context: ${context || 'Focus on key theories, studies, and evaluations.'}
      
      Requirements:
      1. First slide must be a Title slide.
      2. Include 3-5 Content slides explaining theories or studies.
      3. Include 1 'quiz' slide at the end with a question in the title and the answer as a bullet point (hidden until revealed).
      4. Ensure tone is academic yet accessible.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        systemInstruction: "You are an expert Psychology teacher specializing in the AQA curriculum. You create clear, structured slide decks.",
        temperature: 0.4 // Keep it factual
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        id: `gen-${Date.now()}`
      } as Lesson;
    }
    return null;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
