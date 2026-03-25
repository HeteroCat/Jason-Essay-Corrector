import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Correction, CorrectionCategory } from '../types';
import { Translations } from '../lib/translations';

const categoryStyles: { [key in CorrectionCategory]: { bg: string; text: string; border: string } } = {
  [CorrectionCategory.GRAMMAR]: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-900 dark:text-blue-100', border: 'border-blue-300 dark:border-blue-700' },
  [CorrectionCategory.SPELLING]: { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-900 dark:text-red-100', border: 'border-red-300 dark:border-red-700' },
  [CorrectionCategory.CLARITY]: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-900 dark:text-green-100', border: 'border-green-300 dark:border-green-700' },
  [CorrectionCategory.STYLE]: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-900 dark:text-purple-100', border: 'border-purple-300 dark:border-purple-700' },
  [CorrectionCategory.PUNCTUATION]: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-900 dark:text-yellow-100', border: 'border-yellow-300 dark:border-yellow-700' },
  [CorrectionCategory.STRUCTURE]: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-900 dark:text-indigo-100', border: 'border-indigo-300 dark:border-indigo-700' },
};

const CorrectionHighlight: React.FC<{ correction: Correction; t: Translations }> = ({ correction, t }) => {
    const styles = categoryStyles[correction.category] || categoryStyles.GRAMMAR;
    
    const categoryTranslations: { [key: string]: string } = {
        clarity: t.clarity,
        grammar: t.grammar,
        punctuation: t.punctuation,
        spelling: t.spelling,
        structure: t.structure,
        style: t.style,
    };
    
    return (
        <span className="relative group inline-block">
            <span className={`rounded px-1 py-0.5 cursor-help ${styles.bg} ${styles.text} border-b border-current/30 transition-colors hover:bg-opacity-80`}>
                {correction.suggestion || <span className="opacity-50 italic">{t.deleted}</span>}
            </span>
            
            {/* TOOLTIP */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 scale-95 group-hover:scale-100 origin-bottom">
                <div className="flex items-center justify-between border-b border-gray-700 pb-1.5 mb-1.5">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-blue-400">
                        {categoryTranslations[correction.category.toLowerCase()] || correction.category.toLowerCase()}
                    </span>
                </div>
                <div className="space-y-2">
                    <div>
                        <p className="text-gray-500 font-bold text-[9px] uppercase mb-0.5">{t.tooltipOriginal}</p>
                        <p className="line-through text-gray-300 decoration-red-500/50">{correction.originalText}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold text-[9px] uppercase mb-0.5">{t.tooltipExplanation}</p>
                        <p className="leading-relaxed text-gray-100">{correction.explanation}</p>
                    </div>
                </div>
                {/* Arrow */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-gray-900"></span>
            </span>
        </span>
    );
};


const CorrectedEssayView: React.FC<{ essayText: string, corrections: Correction[], t: Translations }> = ({ essayText, corrections, t }) => {
    
    const renderEssayWithCorrections = () => {
        if (!corrections || corrections.length === 0) {
            return <div className="whitespace-pre-wrap">{essayText}</div>;
        }

        const result: React.ReactNode[] = [];
        let lastIndex = 0;
        
        // Find all occurrences and sort them
        const sorted = [...corrections]
            .map((c, i) => ({ 
                ...c, 
                originalIndex: i, 
                index: essayText.indexOf(c.originalText) 
            }))
            .filter(c => c.index !== -1)
            .sort((a, b) => a.index - b.index);

        sorted.forEach((c, i) => {
            // Add text before correction
            if (c.index > lastIndex) {
                result.push(essayText.substring(lastIndex, c.index));
            }
            // Add correction highlight
            result.push(<CorrectionHighlight key={`corr-${i}`} correction={c} t={t} />);
            lastIndex = c.index + c.originalText.length;
        });
        
        // Add remaining text
        if (lastIndex < essayText.length) {
            result.push(essayText.substring(lastIndex));
        }
        
        return <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">{result}</div>;
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t.correctedEssayTitle}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.correctedEssaySubtitle}</p>
            </div>
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="text-lg max-w-none">
                   {renderEssayWithCorrections()}
                </div>
            </div>
        </div>
    );
};

export default CorrectedEssayView;