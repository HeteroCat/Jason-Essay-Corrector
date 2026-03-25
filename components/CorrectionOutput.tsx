import React from 'react';
import { CorrectionResponse } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ScoreCard from './ScoreCard';
import { Translations } from '../lib/translations';

interface CorrectionOutputProps {
  correctionResult: CorrectionResponse | null;
  isLoading: boolean;
  error: string | null;
  t: Translations;
}

const CorrectionOutput: React.FC<CorrectionOutputProps> = ({ correctionResult, isLoading, error, t }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
          <LoadingSpinner />
          <p className="mt-4 text-lg font-medium">{t.loadingAnalysis}</p>
          <p className="text-sm">{t.loadingSubtitle}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-500 dark:text-red-400">
          <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
            <h3 className="text-lg font-bold">{t.errorTitle}</h3>
            <p className="mt-2">{error}</p>
          </div>
        </div>
      );
    }

    if (!correctionResult) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">{t.waitingTitle}</h3>
          <p className="mt-1 max-w-md">{t.waitingSubtitle}</p>
        </div>
      );
    }
    
    return (
        <div className="h-full overflow-y-auto p-1">
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">{t.aiSummaryTitle}</h3>
                <p className="mt-1 text-blue-700 dark:text-blue-300">{correctionResult.summary}</p>
            </div>
            
            {correctionResult.scores && <ScoreCard scores={correctionResult.scores} t={t} />}

            {correctionResult.corrections.length === 0 && !isLoading && (
                 <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">{t.excellentWorkTitle}</h3>
                    <p className="mt-1 max-w-md">{t.excellentWorkSubtitle}</p>
                </div>
            )}
        </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800/60 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t.feedbackTitle}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.feedbackSubtitle}</p>
        </div>
        <div className="flex-grow p-4 overflow-hidden">
            {renderContent()}
        </div>
    </div>
  );
};

export default CorrectionOutput;