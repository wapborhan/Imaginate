import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: "Prompt is required" },
        { status: 400 }
      );
    }

    // Initialize Gemini SDK
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });

    // Call the correct model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    // Extract image from inlineData
    for (const part of response.parts) {
      if (part.inlineData) {
        const imageBase64 = part.inlineData.data;

        return NextResponse.json({
          success: true,
          image: imageBase64, // frontend will prefix with data:image/png;base64,
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "No image generated.",
      },
      { status: 400 }
    );
  } catch (err) {
    console.error("Image generation error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Gemini image API is working",
  });
}
