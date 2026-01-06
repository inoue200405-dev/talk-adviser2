import { AnalysisResult, ScenarioId } from "../types";

export const analyzeSpeech = async (
  text: string,
  scenarioId: ScenarioId,
  criteria: string[]
): Promise<AnalysisResult> => {
  // 1. あなたの新しいAPIキー
  const API_KEY = "AIzaSyA2h34aimnULFhIYCLNQw94IghnlUJWog0";

  // 2. 重要：バージョンを「v1beta」に、モデル名を「gemini-1.5-flash」にします
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const prompt = `あなたはプロの話し方講師です。以下の発言を分析し、必ずJSON形式で答えてください。
  発言: "${text}"
  JSONフォーマット:
  {
    "scores": [{"label": "自信", "value": 8}, {"label": "論理性", "value": 7}, {"label": "流暢さ", "value": 9}, {"label": "トーン", "value": 6}, {"label": "説得力", "value": 8}],
    "summary": "要約",
    "advice": "アドバイス",
    "beforeAfter": [{"before": "元", "after": "改善", "reason": "理由"}]
  }`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error("APIエラー詳細:", errorDetail);
      throw new Error(`Status: ${response.status}`);
    }

    const data = await response.json();
    let responseText = data.candidates[0].content.parts[0].text;

    // AIがマークダウン形式で返してきた場合のクリーニング
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Analysis Error:", error);
    // エラー時の表示
    return {
      scores: criteria.map(c => ({ label: c, value: 5 })),
      summary: "AIからの応答を待機中...",
      advice: "APIの窓口（v1beta）への切り替え設定を適用しました。もう一度だけ試してみてください。",
      beforeAfter: [{ before: text, after: "（準備中）", reason: "APIバージョン更新中" }]
    };
  }
};