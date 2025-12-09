import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const explainPhysics = async (radius: number, question?: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment to use the AI explanation feature.";
  }

  const prompt = `
    You are an expert theoretical physicist and science communicator.
    The user is looking at a visualization of a Black Hole's Event Horizon (Schwarzschild metric).
    
    Current Simulation Parameters:
    - Schwarzschild Radius (r_s): ${radius.toFixed(2)} units.
    - The visualization shows a contour plot of space-time curvature (potential well).
    - Inside the radius, the plot is "flipped" or void, representing the region where the metric signature changes (Space and Time swap roles).

    User Question: ${question || "Explain the concept of the 'Space-Time Flip' at the horizon shown in this simulation."}

    Keep the explanation concise (under 150 words), engaging, and accessible to a general audience. Use markdown for formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to retrieve explanation from the cosmos. Please try again later.";
  }
};