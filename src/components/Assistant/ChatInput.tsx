
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

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
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        placeholder="Type your question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
        disabled={loading}
      />
      <Button 
        type="submit" 
        className="bg-college-gold hover:bg-college-gold/80 text-black"
        disabled={loading || !input.trim()}
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
};

export default ChatInput;
