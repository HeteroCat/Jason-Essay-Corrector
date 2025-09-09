import React from 'react';
import { Correction, CorrectionCategory } from '../types';

const categoryStyles: { [key in CorrectionCategory]: { bg: string; text: string; } } = {
  [CorrectionCategory.GRAMMAR]: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200' },
  [CorrectionCategory.SPELLING]: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200' },
  [CorrectionCategory.CLARITY]: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200' },
  [CorrectionCategory.STYLE]: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-800 dark:text-purple-200' },
  [CorrectionCategory.PUNCTUATION]: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200' },
  [CorrectionCategory.STRUCTURE]: { bg: 'bg-indigo-100 dark:bg-indigo-900/50', text: 'text-indigo-800 dark:text-indigo-200' },
};

const CorrectionHighlight: React.FC<{ correction: Correction }> = ({ correction }) => {
    const styles = categoryStyles[correction.category] || categoryStyles.GRAMMAR;
    return (
        <span className={`relative group rounded px-1 py-0.5 cursor-pointer ${styles.bg} ${styles.text}`}>
            {correction.suggestion}
            {/* TOOLTIP: Positioned below the highlight to prevent being obscured by the card header. */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <p className="font-bold border-b border-gray-600 pb-1 mb-2 capitalize">{correction.category.toLowerCase()}</p>
                <p className="text-gray-400">Original:</p>
                <p className="line-through decoration-red-400 mb-2">{correction.originalText}</p>
                <p className="text-gray-400">Explanation:</p>
                <p>{correction.explanation}</p>
                {/* Arrow pointing up */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-gray-800"></div>
            </div>
        </span>
    );
};


const CorrectedEssayView: React.FC<{ essayText: string, corrections: Correction[] }> = ({ essayText, corrections }) => {
    
    const renderEssayWithCorrections = () => {
        if (!corrections || corrections.length === 0) {
            return essayText;
        }

        let lastIndex = 0;
        const parts: (string | React.ReactNode)[] = [];

        const sortedCorrections = [...corrections]
            .map(c => ({...c, index: essayText.indexOf(c.originalText)}))
            .filter(c => c.index !== -1)
            .sort((a, b) => a.index - b.index);
        
        let uniqueKey = 0;

        sortedCorrections.forEach(correction => {
            if (correction.index < lastIndex) return; 
            
            parts.push(essayText.substring(lastIndex, correction.index));
            parts.push(<CorrectionHighlight key={uniqueKey++} correction={correction} />);
            lastIndex = correction.index + correction.originalText.length;
        });

        parts.push(essayText.substring(lastIndex));
        
        return parts;
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Corrected Essay</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hover over highlights for details.</p>
            </div>
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                   {renderEssayWithCorrections()}
                </div>
            </div>
        </div>
    );
};

export default CorrectedEssayView;