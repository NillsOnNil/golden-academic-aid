
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrainCircuit, Loader2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { Message } from '@/types/assistant';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <BrainCircuit className="h-12 w-12 text-college-gold mb-4" />
        <h3 className="text-lg font-semibold text-college-gold">How can I help you today?</h3>
        <p className="text-white/70 mt-2 max-w-sm">
          Ask me about your courses, assignments, study tips, or any academic questions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
      
      {loading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg p-3 bg-gray-800 text-white">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-college-gold" />
              <span>Thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
