
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '../types';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onReset }) => {
  const chartData = [
    { subject: '明瞭さ', A: result.metrics.clarity * 10, fullMark: 100 },
    { subject: '自信', A: result.metrics.confidence * 10, fullMark: 100 },
    { subject: '共感力', A: result.metrics.empathy * 10, fullMark: 100 },
    { subject: '論理構成', A: result.metrics.logic * 10, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-[12px] border-blue-50">
            <div className="text-center">
              <span className="text-5xl font-black text-blue-600">{result.totalScore}</span>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total Score</span>
            </div>
            <svg className="absolute inset-0 -rotate-90 w-full h-full">
              <circle
                cx="96" cy="96" r="84"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 84}`}
                strokeDashoffset={`${2 * Math.PI * 84 * (1 - result.totalScore / 100)}`}
                className="text-blue-600 transition-all duration-1000 ease-out"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
              <Radar
                name="Score"
                dataKey="A"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-comment-dots text-blue-600 mr-2"></i>
            アドバイザーの評価
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            {result.feedback}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-check-circle text-green-600 mr-2"></i>
            ストロングポイント
          </h3>
          <ul className="space-y-3">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start text-gray-600 text-sm">
                <span className="bg-green-100 text-green-700 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-[10px] font-bold">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-arrow-alt-circle-up text-orange-600 mr-2"></i>
            改善のヒント
          </h3>
          <ul className="space-y-3">
            {result.improvements.map((imp, i) => (
              <li key={i} className="flex items-start text-gray-600 text-sm">
                <span className="bg-orange-100 text-orange-700 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-[10px] font-bold">
                  {i + 1}
                </span>
                {imp}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-file-alt text-gray-500 mr-2"></i>
            書き起こし
          </h3>
          <div className="max-h-40 overflow-y-auto p-4 bg-gray-50 rounded-xl text-gray-500 text-xs leading-loose">
            {result.transcription || "（書き起こしテキストはありません）"}
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-12">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 font-bold transition-colors"
        >
          <i className="fas fa-redo"></i>
          <span>新しく計測する</span>
        </button>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
