
import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-blue-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            トーク・アドバイザー <span className="text-blue-600">Talk Advisor</span>
          </h1>
        </div>
        <div className="hidden md:block text-sm text-slate-500 font-medium">
          あなたの話し方をAIがプロ級に添削
        </div>
      </div>
    </header>
  );
};

export default Header;
