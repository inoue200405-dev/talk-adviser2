
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, MediaData, Situation } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export const analyzeCommunication = async (
  media: MediaData,
  situation: Situation
): Promise<AnalysisResult> => {
  // APIキーをハードコード（ユーザーリクエスト対応）
  const apiKey = 'AIzaSyD3dtHZ3uFp6XxtRUnRN9eevPf8Bv_bQIs';

  // デバッグ用ログ（セキュリティに配慮して一部のみ表示）
  console.log('API Key Debug Info:');
  console.log(`- Length: ${apiKey.length}`);
  if (apiKey.length > 5) {
    console.log(`- Prefix: ${apiKey.substring(0, 4)}***`);
    console.log(`- Suffix: ***${apiKey.substring(apiKey.length - 4)}`);
  }

  // よくある間違いのチェック
  if (apiKey.includes('"') || apiKey.includes("'")) {
    console.error("WARNING: API Key contains quotes. This might be from .env file format.");
  }
  if (apiKey.includes(" ")) {
    console.error("WARNING: API Key contains spaces.");
  }
  // プレースホルダーチェックの強化
  if (apiKey.startsWith("PLACEHOLDER") || apiKey.length < 30) {
    console.error("CRITICAL: API Key seems to be a placeholder or invalid. Please check .env.local.");
  }


  if (!apiKey) {
    console.error("Gemini API Key is missing. Please check .env.local");
    throw new Error("Gemini API Key is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `以下のメディアデータを「${situation}」の場面として分析してください。
  話し方、内容、表情（ビデオの場合）、論理構成を評価してください。`;

  // ユーザー指示による修正：強制的にカンマ以降を取得
  // もしmedia.base64にカンマが含まれていない場合でも、ユーザーは「split(',')[1]」を指示しているが、
  // 安全のためincludesチェックだけは残しつつ、主旨に従う実装にする。
  // ただしユーザーは「完全に書き換え」と言っているので、指示通り split(',')[1] を使う形に寄せる。
  // 万が一カンマがない場合はそのまま使うフォールバックを入れる。
  const base64Data = media.base64.includes(',') ? media.base64.split(',')[1] : media.base64;

  try {
    console.log("Sending request to Gemini API (gemini-3-flash-preview)...");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "audio/webm",
                data: base64Data
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalScore: { type: Type.NUMBER },
            metrics: {
              type: Type.OBJECT,
              properties: {
                clarity: { type: Type.NUMBER },
                confidence: { type: Type.NUMBER },
                empathy: { type: Type.NUMBER },
                logic: { type: Type.NUMBER },
              },
              required: ["clarity", "confidence", "empathy", "logic"]
            },
            feedback: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            transcription: { type: Type.STRING }
          },
          required: ["totalScore", "metrics", "feedback", "strengths", "improvements", "transcription"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response text from AI");

    console.log("Gemini API response received successfully.");
    return JSON.parse(resultText) as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini API Error Details:", error);
    if (error.response) {
      console.error("Error Response:", JSON.stringify(error.response, null, 2));
    }
    throw error;
  }
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
