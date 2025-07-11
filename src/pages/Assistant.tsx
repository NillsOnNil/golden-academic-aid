import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrainCircuit, Database } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/types/assistant';
import { assistantService } from '@/services/assistantService';

// Import refactored components
import ChatInput from '@/components/Assistant/ChatInput';
import MessageList from '@/components/Assistant/MessageList';

const Assistant = () => {
  const location = useLocation();
  const initialQuery = location.state?.searchQuery || '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Process initial query if provided
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, []);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      // Get response from our enhanced assistant service
      const response = await assistantService.processQuery(messageText);
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response', error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground">Get help with your questions and academic needs</p>
      </div>
      
      <Card className="bg-black border-college-gold/20 overflow-hidden h-[calc(100vh-14rem)]">
        <CardHeader className="bg-black border-b border-college-gold/20">
          <div className="flex items-center">
            <BrainCircuit className="h-6 w-6 text-college-gold mr-2" />
            <div>
              <CardTitle className="text-white">College Assistant</CardTitle>
              <CardDescription className="text-white/70">
                Ask me anything about your courses, assignments, schedule, or general academic questions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <div className="flex flex-col h-[calc(100%-8rem)]">
          <ScrollArea className="flex-grow p-4">
            <MessageList messages={messages} loading={loading} />
          </ScrollArea>
          
          <CardContent className="border-t border-college-gold/20 p-4">
            <ChatInput onSendMessage={handleSendMessage} loading={loading} />
            <div className="flex items-center mt-2 text-xs text-white/50">
              <Database className="h-3 w-3 mr-1 text-college-gold/80" />
              <span>Tip: Use <span className="text-college-gold font-medium">!</span> to directly query the database (e.g., "!schedule", "!assignments")</span>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default Assistant;
