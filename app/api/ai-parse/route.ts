import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { rawText, filename } = await req.json();
    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json({ error: "rawText is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    let extractedData = null;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a German linguistics and grammar expert. Extract German vocabulary, verbs with fixed prepositions, connectors, and grammar rules from the provided text into a clean JSON structure.
Text:
"""
${rawText}
"""

Return ONLY a valid JSON object with the following schema:
{
  "vocabulary": [
    {
      "german": "string",
      "article": "der" | "die" | "das" | "pl" | null,
      "plural": "string" | null,
      "type": "verb" | "substantiv" | "adjektiv" | "connector",
      "preposition": "string" | null,
      "governedCase": "Akk" | "Dat" | "Gen" | null,
      "meaningTr": "string",
      "meaningEn": "string",
      "example": "string"
    }
  ],
  "connectors": [
    {
      "name": "string",
      "group": "position_0" | "nebensatz" | "position_1" | "zweiteilig",
      "meaningTr": "string",
      "meaningEn": "string",
      "formula": "string",
      "example": "string"
    }
  ],
  "notesSummary": "string"
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[0]);
        }
      } catch (geminiErr: any) {
        console.warn("Gemini API call failed, falling back to local file save:", geminiErr.message);
      }
    }

    // Save to /data/raw directory
    const safeName = (filename || `synced_note_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, "_") + ".txt";
    const rawDir = path.resolve("./data/raw");
    if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });
    fs.writeFileSync(path.join(rawDir, safeName), rawText, "utf-8");

    return NextResponse.json({
      success: true,
      savedFile: safeName,
      extractedData,
      message: extractedData
        ? "AI parsed successfully and raw note saved."
        : "Raw note saved to /data/raw. Run sync to index."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
