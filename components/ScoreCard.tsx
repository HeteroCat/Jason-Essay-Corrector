import React from 'react';
import { Scores, CorrectionCategory } from '../types';
import { GrammarIcon, SpellingIcon, ClarityIcon, StyleIcon, PunctuationIcon, StructureIcon } from './icons';

interface ScoreCardProps {
  scores: Scores;
}

const categoryDetails: { [key in CorrectionCategory]: { icon: JSX.Element; order: number } } = {
  [CorrectionCategory.CLARITY]: { icon: <ClarityIcon />, order: 1 },
  [CorrectionCategory.GRAMMAR]: { icon: <GrammarIcon />, order: 2 },
  [CorrectionCategory.PUNCTUATION]: { icon: <PunctuationIcon />, order: 3 },
  [CorrectionCategory.SPELLING]: { icon: <SpellingIcon />, order: 4 },
  [CorrectionCategory.STRUCTURE]: { icon: <StructureIcon />, order: 5 },
  [CorrectionCategory.STYLE]: { icon: <StyleIcon />, order: 6 },
};

const getBarColor = (score: number) => {
  if (score >= 8) return 'bg-green-500';
  if (score >= 5) return 'bg-yellow-500';
  return 'bg-red-500';
};

const ScoreBar: React.FC<{ score: number }> = ({ score }) => {
  const width = score > 0 ? `${score * 10}%` : '0%';
  const color = getBarColor(score);

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width }}></div>
    </div>
  );
};

const ScoreCard: React.FC<ScoreCardProps> = ({ scores }) => {
  const sortedScores = Object.entries(scores)
    .filter(([category]) => category in categoryDetails)
    .sort(([catA], [catB]) => categoryDetails[catA as CorrectionCategory].order - categoryDetails[catB as CorrectionCategory].order);

  return (
    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Score Breakdown</h3>
      <div className="space-y-4">
        {sortedScores.map(([category, score]) => {
          if (score === undefined) return null;
          const details = categoryDetails[category as CorrectionCategory];
          return (
            <div key={category} className="grid grid-cols-12 items-center gap-x-4">
              <div className="col-span-4 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">{details.icon}</span>
                <span className="font-medium capitalize">{category.toLowerCase()}</span>
              </div>
              <div className="col-span-6">
                <ScoreBar score={score} />
              </div>
              <div className="col-span-2 text-right font-semibold text-gray-700 dark:text-gray-200">
                {score} / 10
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoreCard;
