
import React, { useState, useEffect } from 'react';
import { Loader2, Lightbulb } from 'lucide-react';
import { TALK_TIPS } from '../constants';

const AnalysisLoading: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TALK_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="mb-8">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">話し方を分析中...</h2>
      <p className="text-slate-500 mb-12">あなたの言葉から、もっと魅力を引き出すヒントを探しています。</p>

      <div className="max-w-md w-full bg-blue-50 p-6 rounded-2xl border border-blue-100 relative overflow-hidden">
        <div className="flex items-center gap-2 text-blue-600 mb-3 font-bold">
          <Lightbulb className="w-5 h-5" />
          <span>話し方のコツ (Tips)</span>
        </div>
        <p className="text-slate-700 leading-relaxed min-h-[4rem] flex items-center justify-center animate-in fade-in duration-500">
          {TALK_TIPS[tipIndex]}
        </p>
        <div className="mt-4 flex justify-center gap-1.5">
          {TALK_TIPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === tipIndex ? 'w-6 bg-blue-600' : 'w-1.5 bg-blue-200'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoading;
