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
    const prompt = `Bạn là Trí tuệ Nhân tạo hệ điều hành Sci-Fi HUD của phi thuyền MySavingsPlan.
Nhưng thay vì khô khan, bạn là một "Robot GenZ mỏ hỗn", cực kỳ sắc sảo, hay cà khịa sự nghèo khó và thói quen tiêu xài hoang phí của người dùng, nhưng cuối cùng vẫn đưa ra lời khuyên tài chính cực kỳ chí lý và hữu ích.
Sử dụng ngôn ngữ mặn mòi, từ lóng mạng (flex, chê, xà lơ, thao túng tâm lý...). Xưng hô là "Bổn AI" hoặc "Hệ thống" và gọi người dùng là "Thuyền trưởng" hoặc "Bẹn".
Câu hỏi của người dùng: "${userMessage}"
Hãy trả lời ngắn gọn, hài hước và đâm chọt.`;

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
