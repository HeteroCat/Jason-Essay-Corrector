import React, { useState } from 'react';
import EssayInput from './components/EssayInput';
import CorrectionOutput from './components/CorrectionOutput';
import CorrectedEssayView from './components/CorrectedEssayView';
import ChatPanel from './components/ChatPanel';
import { correctEssay, sendChatMessage } from './services/geminiService';
import { CorrectionResponse, ChatMessage } from './types';

// FIX: Added App component content. This component was missing.
function App() {
  const [essayText, setEssayText] = useState<string>('');
  const [correctionResult, setCorrectionResult] = useState<CorrectionResponse | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCorrectEssay = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setCorrectionResult(null);
    setChatHistory([]);
    setEssayText(text);
    try {
      const result = await correctEssay(text);
      setCorrectionResult(result);
      if (result.corrections.length > 0) {
        setChatHistory([{ role: 'model', text: "Hello! I've reviewed your essay. Feel free to ask me any questions about the feedback." }]);
      } else {
        setChatHistory([{ role: 'model', text: "Excellent work on your essay! I couldn't find any specific issues. Do you have any other writing questions?" }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newUserMessage: ChatMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, newUserMessage]);
    setIsChatLoading(true);
    try {
        const botResponseText = await sendChatMessage(message);
        const newBotMessage: ChatMessage = { role: 'model', text: botResponseText };
        setChatHistory(prev => [...prev, newBotMessage]);
    } catch (err) {
        const errorMessage: ChatMessage = { role: 'model', text: `Sorry, I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}` };
        setChatHistory(prev => [...prev, errorMessage]);
    } finally {
        setIsChatLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 font-sans">
      <header className="bg-white dark:bg-gray-800/50 shadow-md backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            AI Essay Corrector
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Get instant feedback on your writing with the Gemini API.
          </p>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="lg:col-span-1 h-[calc(100vh-12rem)] min-h-[400px]">
            <EssayInput onSubmit={handleCorrectEssay} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-1 h-[calc(100vh-12rem)] min-h-[400px]">
             <CorrectionOutput correctionResult={correctionResult} isLoading={isLoading} error={error} />
          </div>
        </div>

        {correctionResult && !isLoading && !error && (
           <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
                <div className="lg:col-span-3 h-[calc(100vh-12rem)] min-h-[400px]">
                     <CorrectedEssayView essayText={essayText} corrections={correctionResult.corrections} />
                </div>
                 <div className="lg:col-span-2 h-[calc(100vh-12rem)] min-h-[400px]">
                    <ChatPanel chatHistory={chatHistory} onSendMessage={handleSendMessage} isLoading={isChatLoading} />
                </div>
           </div>
        )}
      </main>
    </div>
  );
}

export default App;
