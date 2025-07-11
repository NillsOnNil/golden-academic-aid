import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Info } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, loading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput(''); // Reset to empty string after sending
    }
  };

  // Focus the input field when component mounts
  useEffect(() => {
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
      // Place cursor at the end of the input
      const length = inputElement.value.length;
      inputElement.setSelectionRange(length, length);
    }
  }, []);

  return (
    <div>
      <div className="flex items-center mb-2 text-xs text-college-gold/80 bg-black/30 p-2 rounded-md border border-college-gold/20">
        <Info className="h-3 w-3 mr-1 flex-shrink-0" />
        <span>Use <span className="font-bold">!</span> for class schedules, <span className="font-bold">!assignment</span> for homework, <span className="font-bold">!location</span> for campus navigation</span>
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white w-full"
            disabled={loading}
            type="text"
            placeholder="Ask about schedules, assignments, or campus locations..."
          />
        </div>
        <Button 
          type="submit" 
          className="bg-college-gold hover:bg-college-gold/80 text-black"
          disabled={loading || !input.trim()}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
