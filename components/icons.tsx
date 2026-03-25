import React from 'react';
import { 
  BookOpen, 
  SpellCheck, 
  Lightbulb, 
  PenTool, 
  Type, 
  Layout, 
  User, 
  Bot, 
  Send, 
  Upload 
} from 'lucide-react';

export const GrammarIcon: React.FC = () => <BookOpen className="h-4 w-4" />;
export const SpellingIcon: React.FC = () => <SpellCheck className="h-4 w-4" />;
export const ClarityIcon: React.FC = () => <Lightbulb className="h-4 w-4" />;
export const StyleIcon: React.FC = () => <PenTool className="h-4 w-4" />;
export const PunctuationIcon: React.FC = () => <Type className="h-4 w-4" />;
export const StructureIcon: React.FC = () => <Layout className="h-4 w-4" />;

export const UserIcon: React.FC = () => <User className="h-5 w-5 text-gray-500" />;
export const BotIcon: React.FC = () => <Bot className="h-5 w-5 text-gray-500" />;
export const SendIcon: React.FC = () => <Send className="h-5 w-5" />;
export const ArrowUpTrayIcon: React.FC = () => <Upload className="h-5 w-5" />;
