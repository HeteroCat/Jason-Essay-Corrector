import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import LoadingSpinner from './LoadingSpinner';
import { ArrowUpTrayIcon } from './icons';
import { extractTextFromImage } from '../services/geminiService';
import { Translations } from '../lib/translations';

interface EssayInputProps {
  onSubmit: (essayText: string) => void;
  isLoading: boolean;
  t: Translations;
}

const EssayInput: React.FC<EssayInputProps> = ({ onSubmit, isLoading, t }) => {
  const [essayText, setEssayText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(essayText);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    
    // Reset input to allow re-uploading the same file
    if(e.target) {
        e.target.value = '';
    }

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if (fileType === 'text/plain' || fileName.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setEssayText(text);
        setActiveTab('write');
      };
      reader.onerror = () => {
        alert('Error reading file.');
      };
      reader.readAsText(file);
    } else if (fileType.startsWith('image/')) {
      setIsExtracting(true);
      try {
        const extractedText = await extractTextFromImage(file);
        setEssayText(extractedText);
        setActiveTab('write');
      } catch (error) {
        alert(`Error extracting text from image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsExtracting(false);
      }
    } else if (
      fileType === 'application/pdf' ||
      fileName.endsWith('.doc') ||
      fileName.endsWith('.docx')
    ) {
      alert('Support for Word and PDF files is coming soon! For now, please use .txt, .md, or image files (PNG, JPG).');
    } else {
      alert('Unsupported file type. Please upload a .txt, .md, .png, or .jpg file.');
    }
  };


  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t.essayInputTitle}</h2>
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('write')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'write' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    {t.writeTab}
                </button>
                <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'preview' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    {t.previewTab}
                </button>
            </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow p-4 overflow-hidden">
            <div className="flex-grow relative mb-4">
                <div className="absolute inset-0">
                    {activeTab === 'write' ? (
                        <textarea
                            className="w-full h-full p-3 text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none overflow-y-auto"
                            value={essayText}
                            onChange={(e) => setEssayText(e.target.value)}
                            placeholder={t.essayInputPlaceholder}
                            disabled={isLoading || isExtracting}
                        />
                    ) : (
                        <div className="w-full h-full p-3 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg prose dark:prose-invert max-w-none">
                            {essayText ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{essayText}</ReactMarkdown>
                            ) : (
                                <p className="text-gray-400 italic">{t.essayInputPlaceholder}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.md,.png,.jpg,.jpeg,.pdf,.doc,.docx"
                className="hidden"
            />
            <div className="flex flex-row gap-3">
                <button
                    type="button"
                    onClick={handleUploadClick}
                    className="flex-shrink-0 flex justify-center items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    disabled={isLoading || isExtracting}
                >
                    {isExtracting ? (
                        <>
                            <LoadingSpinner />
                            <span>{t.uploadingButton}</span>
                        </>
                    ) : (
                        <>
                            <ArrowUpTrayIcon />
                            <span>{t.uploadButton}</span>
                        </>
                    )}
                </button>
                <button
                    type="submit"
                    className="w-full flex-grow flex justify-center items-center gap-2 px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                    disabled={isLoading || isExtracting || !essayText.trim()}
                >
                    {isLoading ? <><LoadingSpinner /> {t.correctingButton}</> : t.correctButton}
                </button>
            </div>
        </form>
    </div>
  );
};

export default EssayInput;