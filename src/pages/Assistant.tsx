
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrainCircuit, Send, User, Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const GEMINI_API_KEY = 'AIzaSyBWdNy1-3VKXKCCFNs9R_iOIjQKEnxE9GU';
// Updated API URL to the correct endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

const Assistant = () => {
  const location = useLocation();
  const initialQuery = location.state?.searchQuery || '';
  const [input, setInput] = useState(initialQuery);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Process initial query if provided
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate response using Google Gemini API with updated endpoint
  const generateGeminiResponse = async (query: string): Promise<string> => {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful college assistant. Please answer the following question concisely and accurately: ${query}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate response');
      }

      const data = await response.json();
      // Updated response parsing for the v1 API format
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      throw error;
    }
  };

  const handleSendMessage = async (messageText: string = input) => {
    if (!messageText.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput(''); // Clear input field
    setLoading(true);
    
    try {
      // Get response from Gemini
      const response = await generateGeminiResponse(messageText);
      
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
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
                Ask me anything about your courses, assignments, or general academic questions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <div className="flex flex-col h-[calc(100%-8rem)]">
          <ScrollArea className="flex-grow p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <BrainCircuit className="h-12 w-12 text-college-gold mb-4" />
                <h3 className="text-lg font-semibold text-college-gold">How can I help you today?</h3>
                <p className="text-white/70 mt-2 max-w-sm">
                  Ask me about your courses, assignments, study tips, or any academic questions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
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
            )}
          </ScrollArea>
          
          <CardContent className="border-t border-college-gold/20 p-4">
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
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default Assistant;
