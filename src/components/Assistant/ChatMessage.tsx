
import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '@/types/assistant';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.role === 'user'
            ? 'bg-college-gold text-black ml-12'
            : 'bg-gray-800 text-white mr-12'
        }`}
      >
        <div className="flex items-start">
          <div className={`rounded-full p-1 mr-2 ${
            message.role === 'user' 
              ? 'bg-black/10' 
              : 'bg-college-gold/10'
          }`}>
            {message.role === 'user' ? (
              <User className="h-3 w-3" />
            ) : (
              <Bot className="h-3 w-3 text-college-gold" />
            )}
          </div>
          <div>
            <div className="text-sm whitespace-pre-wrap">
              {message.content}
            </div>
            <div className="mt-1 text-xs opacity-70">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
