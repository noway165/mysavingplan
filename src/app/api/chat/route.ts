import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Google Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Format prompt
    const userMessage = messages[messages.length - 1].content;
    const prompt = `Bạn là trợ lý tài chính AI của MySavingsPlan. Chuyên tư vấn cách tiết kiệm, quản lý tiền bạc và đầu tư thông minh, an toàn.
Câu hỏi của người dùng: "${userMessage}"
Hãy trả lời thân thiện, ngắn gọn, súc tích và có ví dụ thực tế.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      role: "ai",
      content: response.text,
    });
  } catch (error: unknown) {
    console.error("AI API Error:", error);
    const e = error as Error;
    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
