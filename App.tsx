
import React, { useState } from 'react';
import { Situation, AnalysisResult, MediaData } from './types';
import { SITUATION_CONFIGS } from './constants';
import SituationCard from './components/SituationCard';
import Recorder from './components/Recorder';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeCommunication } from './services/geminiService';

const App: React.FC = () => {
  const [situation, setSituation] = useState<Situation>(Situation.INTERVIEW);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleMediaCaptured = async (media: MediaData) => {
    setIsAnalyzing(true);
    try {
      const evaluation = await analyzeCommunication(media, situation);
      setResult(evaluation);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("分析中にエラーが発生しました。再度お試しください。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetApp = () => {
    setResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <i className="fas fa-headset text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Talk Advisor <span className="text-blue-600">Beta</span>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">使い方</a>
            <a href="#" className="hover:text-blue-600 transition-colors">事例紹介</a>
            <a href="#" className="hover:text-blue-600 transition-colors">よくある質問</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {!result && !isAnalyzing && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
                あなたのトークを、<br className="md:hidden" />
                <span className="text-blue-600">プロ級の評価で</span>改善。
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                最新のAIがあなたのコミュニケーションを分析。面接、プレゼン、日常会話など、
                場面に合わせた最適なフィードバックを提供します。
              </p>
            </div>

            <section className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-slate-800">1. シチュエーションを選ぶ</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {SITUATION_CONFIGS.map((config) => (
                  <SituationCard
                    key={config.id}
                    {...config}
                    isSelected={situation === config.id}
                    onSelect={setSituation}
                  />
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-slate-800">2. 撮影・録音する</h3>
              </div>
              <Recorder onMediaCaptured={handleMediaCaptured} />
            </section>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-brain text-blue-600 text-2xl animate-pulse"></i>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">AIが分析中...</h3>
              <p className="text-slate-500">
                コミュニケーションの明瞭さ、自信、表情、論理構成を詳しく調べています。<br />
                これには数秒から十数秒かかる場合があります。
              </p>
            </div>
            <div className="w-full max-w-md bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full animate-progress rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-1">Analysis Report</p>
                <h2 className="text-3xl font-black text-slate-900">分析結果</h2>
              </div>
              <div className="flex items-center space-x-2 text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 text-sm shadow-sm">
                <i className="fas fa-history text-xs"></i>
                <span>シーン: <strong>{SITUATION_CONFIGS.find(s => s.id === situation)?.label}</strong></span>
              </div>
            </div>
            <AnalysisDashboard result={result} onReset={resetApp} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <i className="fas fa-headset text-white"></i>
            </div>
            <span className="text-white font-bold">Talk Advisor</span>
          </div>
          <p className="text-sm">© 2024 Talk Advisor AI. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-github"></i></a>
            <a href="#" className="hover:text-white transition-colors"><i className="fas fa-envelope"></i></a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
