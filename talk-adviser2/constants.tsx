
import React from 'react';
import { Briefcase, Mic2, MessageSquare, AlertCircle, TrendingUp, Scale } from 'lucide-react';
import { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'interview',
    title: '面接',
    description: '信頼感と結論先行の話し方を磨く',
    icon: 'Briefcase',
    criteria: ['信頼感', '結論先行', '論理性', '敬語', '誠実さ']
  },
  {
    id: 'presentation',
    title: '発表',
    description: '聞き取りやすさと抑揚を意識する',
    icon: 'Mic2',
    criteria: ['聞き取りやすさ', '抑揚', '自信', '構成', '視線']
  },
  {
    id: 'daily',
    title: '日常会話',
    description: '共感力と親しみやすさを高める',
    icon: 'MessageSquare',
    criteria: ['共感力', '親しみやすさ', '返報性', '表現力', '傾聴']
  },
  {
    id: 'trouble',
    title: 'トラブル対応',
    description: '誠実さと正確な語彙で対応する',
    icon: 'AlertCircle',
    criteria: ['誠実さ', '正確な語彙', '解決志向', '冷静さ', '共感']
  },
  {
    id: 'sales',
    title: 'セールス',
    description: '熱意とベネフィットを提示する',
    icon: 'TrendingUp',
    criteria: ['熱意', 'ベネフィット提示', '訴求力', '信頼構築', 'ヒアリング']
  },
  {
    id: 'debate',
    title: '議論',
    description: '論理構成と客観性を重視する',
    icon: 'Scale',
    criteria: ['論理構成', '客観性', '反論力', '根拠', '簡潔さ']
  }
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-6 h-6" />,
  Mic2: <Mic2 className="w-6 h-6" />,
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  AlertCircle: <AlertCircle className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />
};

export const TALK_TIPS = [
  "「えー」「あのー」などのフィラーを減らすだけで、一気に知的に見えます。",
  "大事なポイントの前で1〜2秒の「間」を置くと、相手の印象に残りやすくなります。",
  "結論から話し始める「PREP法」は、ビジネスシーンで最も効果的です。",
  "視線を合わせるのが苦手な場合は、相手の眉間やネクタイの結び目を見ると自然です。",
  "笑顔は最強の武器。話し始める瞬間に口角を上げる習慣をつけましょう。",
  "相手の話の語尾を繰り返す「バックトラッキング」は、深い共感を生みます。"
];
