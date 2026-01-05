
import React from 'react';
import { Situation } from '../types';

interface SituationCardProps {
  id: Situation;
  icon: string;
  label: string;
  description: string;
  isSelected: boolean;
  onSelect: (id: Situation) => void;
}

const SituationCard: React.FC<SituationCardProps> = ({
  id,
  icon,
  label,
  description,
  isSelected,
  onSelect
}) => {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`flex flex-col items-center p-6 rounded-2xl transition-all duration-300 border-2 ${
        isSelected
          ? 'bg-blue-50 border-blue-600 shadow-md transform scale-[1.02]'
          : 'bg-white border-transparent hover:border-gray-200 hover:shadow-sm'
      }`}
    >
      <div className={`w-14 h-14 flex items-center justify-center rounded-full mb-4 ${
        isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
      }`}>
        <i className={`fas ${icon} text-xl`}></i>
      </div>
      <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>
        {label}
      </h3>
      <p className="text-xs text-center text-gray-500 leading-relaxed">
        {description}
      </p>
    </button>
  );
};

export default SituationCard;
