// app/components/CombinedScoreCircle.tsx
import React from 'react';

const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
};

export const CombinedScoreCircle = ({ score }: { score: number }) => {
  const radius = 35; // Smaller radius
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colorClass = getScoreColor(score);

  return (
    <div className="relative flex items-center justify-center">
      {/* Reduced size from w-24 h-24 to w-20 h-20 */}
      <svg className="transform -rotate-90 w-20 h-20">
        <circle
          className="text-slate-700"
          strokeWidth="6" // Thinner stroke
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40" // Adjusted center
          cy="40" // Adjusted center
        />
        <circle
          className={colorClass}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
      </svg>
      {/* Adjusted font size */}
      <span className={`absolute text-xl font-bold ${colorClass}`}>
        {score > 0 ? score : 'N/A'}
      </span>
    </div>
  );
};