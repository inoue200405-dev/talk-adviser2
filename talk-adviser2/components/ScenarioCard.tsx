
import React from 'react';
import { Scenario } from '../types';
import { ICON_MAP } from '../constants';

interface ScenarioCardProps {
  scenario: Scenario;
  onClick: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left flex flex-col items-start gap-4"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {ICON_MAP[scenario.icon]}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">{scenario.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{scenario.description}</p>
      </div>
      <div className="mt-auto pt-4 flex flex-wrap gap-2">
        {scenario.criteria.slice(0, 3).map((item, i) => (
          <span key={i} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-slate-100 text-slate-500 rounded-full">
            {item}
          </span>
        ))}
      </div>
    </button>
  );
};

export default ScenarioCard;
