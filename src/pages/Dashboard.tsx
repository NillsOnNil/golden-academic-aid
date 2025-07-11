import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockDb } from '../lib/mockDb';
import { 
  Sparkles, BookOpen, FileText, Clock, Bell, Lightbulb,
  CalendarDays, Bookmark, GraduationCap, Brain, Bot, History,
  MapPin
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Message } from '@/types/assistant';
import { assistantService } from '@/services/assistantService';
import ChatInput from '@/components/Assistant/ChatInput';
import MessageList from '@/components/Assistant/MessageList';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import CampusNavigationWidget from '@/components/CampusNavigationWidget';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 w-full rounded-md p-3 transition-colors
      ${active 
        ? 'bg-college-gold/20 text-college-gold' 
        : 'text-white/80 hover:bg-gray-900 hover:text-white'
      }`}
  >
    <div className="flex-shrink-0">{icon}</div>
    <span className="text-sm font-medium">{text}</span>
  </button>
);

const Dashboard = () => {
  const { isAuthenticated, studentId } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('Student');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const { toast } = useToast();
  
  // New chat function
  const startNewChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    if (isAuthenticated && studentId) {
      // Find student name
      const student = mockDb.students.find(s => s.student_id === studentId);
      if (student) {
        setStudentName(student.name);
      }
      
      setLoading(false);
      
      // Welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Namaste ${student?.name.split(' ')[0] || 'Student'}, I'm AIcharya. How can I assist you with your studies today?`,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    }
  }, [isAuthenticated, studentId]);

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
    setChatLoading(true);
    
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
      setChatLoading(false);
    }
  };

  // Extract first name
  const firstName = studentName.split(' ')[0] || 'Student';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-college-gold"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-black border-r border-college-gold/20 flex flex-col">
        {/* New Chat Button */}
        <div className="p-3">
          <Button 
            className="w-full bg-college-gold hover:bg-college-gold/80 text-black p-5 mb-4"
            onClick={startNewChat}
          >
            <Sparkles className="h-4 w-4 mr-2" /> New Chat
          </Button>
        </div>
        
        <ScrollArea className="flex-grow px-3 py-2">
          <div className="space-y-1">
            <SidebarItem 
              icon={<Bot className="h-5 w-5" />} 
              text="AI Chat" 
              active={true}
              onClick={() => {}}
            />
            
            <SidebarItem 
              icon={<CalendarDays className="h-5 w-5" />} 
              text="Classes"
              onClick={() => navigate('/dashboard/classes')}
            />
            
            <SidebarItem 
              icon={<FileText className="h-5 w-5" />} 
              text="Assignments"
              onClick={() => navigate('/dashboard/assignments')}
            />
            
            <SidebarItem 
              icon={<Bell className="h-5 w-5" />} 
              text="Reminders"
              onClick={() => navigate('/dashboard/reminders')}
            />
            
            <SidebarItem 
              icon={<BookOpen className="h-5 w-5" />} 
              text="Study Materials"
              onClick={() => navigate('/dashboard/study-materials')}
            />
            
            <SidebarItem 
              icon={<MapPin className="h-5 w-5" />} 
              text="Campus Map"
              onClick={() => navigate('/dashboard/campus-navigation')}
            />
          </div>
          
          <Separator className="my-4 bg-college-gold/20" />
          
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-white/50 px-3 mb-2">SUGGESTED PROMPTS</h3>
            
            <div className="space-y-2 text-sm">
              <button 
                className="w-full p-2 text-left rounded-md text-white/70 hover:bg-college-gold/10 hover:text-college-gold border border-college-gold/30"
                onClick={() => handleSendMessage("!Show me my pending assignments")}
              >
                !Show me my pending assignments
              </button>
              
              <button 
                className="w-full p-2 text-left rounded-md text-white/70 hover:bg-college-gold/10 hover:text-college-gold border border-college-gold/30"
                onClick={() => handleSendMessage("!What classes do I have today?")}
              >
                !What classes do I have today?
              </button>
              
              <button 
                className="w-full p-2 text-left rounded-md text-white/70 hover:bg-college-gold/10 hover:text-college-gold border border-college-gold/30"
                onClick={() => handleSendMessage("Where is the Administration Block?")}
              >
                Where is the Administration Block?
              </button>
              
              <button 
                className="w-full p-2 text-left rounded-md text-white/70 hover:bg-college-gold/10 hover:text-college-gold border border-college-gold/30"
                onClick={() => handleSendMessage("What's near the Central Library?")}
              >
                What's near the Central Library?
              </button>
              
              <button 
                className="w-full p-2 text-left rounded-md text-white/70 hover:bg-college-gold/10 hover:text-college-gold border border-college-gold/30"
                onClick={() => handleSendMessage("How far is the Cafeteria from the Tennis Court?")}
              >
                How far is the Cafeteria from the Tennis Court?
              </button>
              
              <button 
                className="w-full p-2 text-left rounded-md text-white/70 hover:bg-college-gold/10 hover:text-college-gold border border-college-gold/30"
                onClick={() => handleSendMessage("!Create a study plan for my upcoming exams")}
              >
                !Create a study plan for my upcoming exams
              </button>
            </div>

            <div className="mt-3 px-2 text-xs text-white/50">
              <p>Use ! prefix to access database commands</p>
            </div>
          </div>
        </ScrollArea>
        
        {/* User profile section */}
        <div className="p-3 border-t border-college-gold/20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-college-gold/20 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-college-gold" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-white truncate">{studentName}</p>
              <p className="text-xs text-white/50 truncate">{studentId}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-950">
        {/* Chat header */}
        <div className="p-4 border-b border-college-gold/20 flex items-center">
          <Sparkles className="h-6 w-6 text-college-gold mr-2" />
          <h2 className="text-xl font-semibold text-white">AIcharya</h2>
        </div>
        
        {/* Chat messages */}
        <ScrollArea className="flex-1 p-4">
          <MessageList messages={messages} loading={chatLoading} />
        </ScrollArea>
        
        {/* Input area */}
        <div className="border-t border-college-gold/20 p-4">
          <ChatInput onSendMessage={handleSendMessage} loading={chatLoading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
