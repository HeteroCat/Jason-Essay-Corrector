import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { UserIcon, BotIcon, SendIcon } from './icons';
import { Translations } from '../lib/translations';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  t: Translations;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ chatHistory, onSendMessage, isLoading, t }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t.chatTitle}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.chatSubtitle}</p>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        <AnimatePresence initial={false}>
          {chatHistory.map((msg, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><BotIcon/></div>}
              <div className={`max-w-xs md:max-w-sm lg:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
               {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><UserIcon/></div>}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3"
            >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><BotIcon/></div>
                <div className="p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <LoadingSpinner />
                        <span>{t.chatThinking}</span>
                    </div>
                </div>
            </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.chatPlaceholder}
            className="flex-grow p-2 resize-none bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-800 dark:text-gray-200"
            rows={1}
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <SendIcon />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;