import React, { useState, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { ArrowUpTrayIcon } from './icons';
import { extractTextFromImage } from '../services/geminiService';

interface EssayInputProps {
  onSubmit: (essayText: string) => void;
  isLoading: boolean;
}

const EssayInput: React.FC<EssayInputProps> = ({ onSubmit, isLoading }) => {
  const [essayText, setEssayText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
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
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Your Essay</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Paste your text below or upload a file to get feedback.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow p-4">
            <textarea
            className="w-full flex-grow p-3 text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            placeholder="Start writing or paste your essay here..."
            disabled={isLoading || isExtracting}
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.md,.png,.jpg,.jpeg,.pdf,.doc,.docx"
                className="hidden"
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                    type="button"
                    onClick={handleUploadClick}
                    className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    disabled={isLoading || isExtracting}
                >
                    {isExtracting ? (
                        <>
                            <LoadingSpinner />
                            <span>Extracting...</span>
                        </>
                    ) : (
                        <>
                            <ArrowUpTrayIcon />
                            <span>Upload</span>
                        </>
                    )}
                </button>
                <button
                    type="submit"
                    className="w-full flex-grow flex justify-center items-center gap-2 px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                    disabled={isLoading || isExtracting || !essayText.trim()}
                >
                    {isLoading ? <><LoadingSpinner /> Correcting...</> : 'Correct Essay'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default EssayInput;