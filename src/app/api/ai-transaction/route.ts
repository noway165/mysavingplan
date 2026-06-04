import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Google Gemini API key not configured" },
        { status: 500 }
      );
    }

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        type: {
          type: Type.STRING,
          description: "Phân loại giao dịch: 'expense' (chi tiêu) hoặc 'income' (thu nhập)",
          enum: ["expense", "income"]
        },
        amount: {
          type: Type.NUMBER,
          description: "Số tiền (VND). Ví dụ: 50k = 50000, 1 củ = 1000000"
        },
        category: {
          type: Type.STRING,
          description: "Danh mục. Đối với expense: 'food', 'shopping', 'transport', 'bills', 'entertainment', 'health', 'education', 'other'. Đối với income: 'salary', 'bonus', 'side_income', 'investment', 'other'"
        },
        description: {
          type: Type.STRING,
          description: "Mô tả ngắn gọn về giao dịch (vd: Trà sữa, Ăn trưa, Nhận lương)"
        }
      },
      required: ["type", "amount", "category", "description"]
    };

    const prompt = `Phân tích câu nói sau thành thông tin giao dịch tài chính: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(response.text);
    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error("AI API Error:", error);
    const e = error as Error;
    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
