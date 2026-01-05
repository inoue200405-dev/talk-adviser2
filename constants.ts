
import { Situation } from './types';

export const SITUATION_CONFIGS = [
  { id: Situation.INTERVIEW, icon: 'fa-id-card', label: '面接', description: '自己PRや質疑応答の質を評価します' },
  { id: Situation.PRESENTATION, icon: 'fa-person-chalkboard', label: 'プレゼン', description: '説明の分かりやすさと説得力を評価します' },
  { id: Situation.NEGOTIATION, icon: 'fa-handshake', label: '交渉', description: '提案の論理性と妥協点への導きを評価します' },
  { id: Situation.CASUAL, icon: 'fa-comments', label: '雑談', description: '親しみやすさと会話の広がりを評価します' },
  { id: Situation.CUSTOMER_SERVICE, icon: 'fa-concierge-bell', label: '接客', description: '丁寧さと安心感を評価します' },
  { id: Situation.MEETING, icon: 'fa-users', label: '会議', description: '発言の的確さと建設的な意見を評価します' },
];

export const SYSTEM_INSTRUCTION = `
あなたはプロのコミュニケーションアドバイザーです。
ユーザーから提供された動画または音声データを分析し、指定されたシチュエーションに基づいて評価を行ってください。

以下のJSON形式で回答を返してください：
{
  "totalScore": number (0-100),
  "metrics": {
    "clarity": number (0-10),
    "confidence": number (0-10),
    "empathy": number (0-10),
    "logic": number (0-10)
  },
  "feedback": "全体的なフィードバック（日本語）",
  "strengths": ["良かった点1", "良かった点2"],
  "improvements": ["改善すべき点1", "改善すべき点2"],
  "transcription": "書き起こしテキスト"
}
`;
