import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { AnalysisResult } from '../types';
import { MessageCircle, RefreshCcw, CheckCircle2, ChevronRight } from 'lucide-react';

interface ResultDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({ result, onReset }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* メインカード：グラフと要約 */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center">

          {/* グラフエリア（サイズ固定で確実に表示） */}
          <div className="flex justify-center items-center bg-slate-50 rounded-3xl p-6 shadow-inner">
            <RadarChart cx={150} cy={150} outerRadius={100} width={300} height={300} data={result.scores}>
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} axisLine={false} tick={false} />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                fill="#3b82f6"
                fillOpacity={0.5}
              />
            </RadarChart>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">総合評価</span>
              <h2 className="text-3xl font-bold text-slate-800 mt-2 leading-tight">{result.summary}</h2>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
              <MessageCircle className="text-blue-500 w-8 h-8 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 mb-1 text-sm">講師のアドバイス</h4>
                <p className="text-slate-600 italic text-sm leading-relaxed">「{result.advice}」</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 改善アドバイス (Before / After) */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            具体的な改善案
          </h3>
          <div className="space-y-6">
            {result.beforeAfter.map((item, idx) => (
              <div key={idx} className="space-y-3">
                <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-sm">
                  <span className="text-red-600 font-bold block mb-1">今の話し方:</span>
                  <p className="text-slate-700">{item.before}</p>
                </div>
                <div className="flex justify-center">
                  <ChevronRight className="w-5 h-5 text-slate-300 rotate-90 md:rotate-0" />
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-sm">
                  <span className="text-green-600 font-bold block mb-1">おすすめの話し方:</span>
                  <p className="text-slate-700 font-medium">{item.after}</p>
                </div>
                <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                  <span className="font-bold text-slate-600">理由:</span> {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ログとアクション */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl flex-grow flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4">ステップアップしましょう！</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              アドバイスを意識してもう一度練習すると、スコアがさらに伸びます。
            </p>
            <button
              onClick={onReset}
              className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-5 h-5" />
              新しい練習を始める
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3 text-sm">本日の成長ログ</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">✔ 分析完了</li>
              <li className="flex items-center gap-2">✔ スコア反映済み</li>
              <li className="flex items-center gap-2">✔ アドバイス生成済み</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDashboard;