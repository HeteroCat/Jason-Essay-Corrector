import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Correction, CorrectionCategory } from '../types';
import { Translations } from '../lib/translations';

const categoryStyles: { [key in CorrectionCategory]: { bg: string; text: string; } } = {
  [CorrectionCategory.GRAMMAR]: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200' },
  [CorrectionCategory.SPELLING]: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200' },
  [CorrectionCategory.CLARITY]: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200' },
  [CorrectionCategory.STYLE]: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-800 dark:text-purple-200' },
  [CorrectionCategory.PUNCTUATION]: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200' },
  [CorrectionCategory.STRUCTURE]: { bg: 'bg-indigo-100 dark:bg-indigo-900/50', text: 'text-indigo-800 dark:text-indigo-200' },
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
        <span className={`relative group rounded px-1 py-0.5 cursor-pointer inline ${styles.bg} ${styles.text}`}>
            {correction.suggestion}
            {/* TOOLTIP: Positioned below the highlight to prevent being obscured by the card header. */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <p className="font-bold border-b border-gray-600 pb-1 mb-2 capitalize">{categoryTranslations[correction.category.toLowerCase()] || correction.category.toLowerCase()}</p>
                <p className="text-gray-400">{t.tooltipOriginal}</p>
                <p className="line-through decoration-red-400 mb-2">{correction.originalText}</p>
                <p className="text-gray-400">{t.tooltipExplanation}</p>
                <p>{correction.explanation}</p>
                {/* Arrow pointing up */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-gray-800"></div>
            </div>
        </span>
    );
};


const CorrectedEssayView: React.FC<{ essayText: string, corrections: Correction[], t: Translations }> = ({ essayText, corrections, t }) => {
    
    const renderEssayWithCorrections = () => {
        if (!corrections || corrections.length === 0) {
            return <ReactMarkdown remarkPlugins={[remarkGfm]}>{essayText}</ReactMarkdown>;
        }

        // Sort corrections by index to process them in order
        const sortedCorrections = [...corrections]
            .map(c => ({...c, index: essayText.indexOf(c.originalText)}))
            .filter(c => c.index !== -1)
            .sort((a, b) => b.index - a.index); // Process from end to start to avoid index shifts
        
        let processedText = essayText;
        sortedCorrections.forEach((correction, i) => {
            // Use a special Markdown link syntax that we can intercept
            // We use a unique ID to map back to the correction object
            const placeholder = `[${correction.suggestion}](correction:${corrections.indexOf(correction)})`;
            processedText = processedText.substring(0, correction.index) + 
                            placeholder + 
                            processedText.substring(correction.index + correction.originalText.length);
        });

        return (
            <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    a: ({ href, children }) => {
                        if (href?.startsWith('correction:')) {
                            const index = parseInt(href.split(':')[1]);
                            const correction = corrections[index];
                            return <CorrectionHighlight correction={correction} t={t} />;
                        }
                        return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{children}</a>;
                    }
                }}
            >
                {processedText}
            </ReactMarkdown>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t.correctedEssayTitle}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.correctedEssaySubtitle}</p>
            </div>
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed">
                   {renderEssayWithCorrections()}
                </div>
            </div>
        </div>
    );
};

export default CorrectedEssayView;