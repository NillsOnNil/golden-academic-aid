
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Query classification service
const classifyQuery = async (query: string): Promise<{ category: 'ERP' | 'LLM', intent: string }> => {
  // In a real application, this would call the API endpoint
  // POST /api/classify
  
  // Simple keyword-based classification for demo purposes
  const erpKeywords = [
    'class', 'classes', 'assignment', 'assignments', 'study', 'material',
    'materials', 'lecture', 'lectures', 'schedule', 'due', 'exam', 'course'
  ];
  
  const queryLower = query.toLowerCase();
  
  // Check if query contains any ERP keywords
  const containsErpKeyword = erpKeywords.some(keyword => queryLower.includes(keyword));
  
  if (containsErpKeyword) {
    // Determine ERP intent
    if (queryLower.includes('class') || queryLower.includes('schedule')) {
      return { category: 'ERP', intent: 'classes' };
    } else if (queryLower.includes('assignment')) {
      return { category: 'ERP', intent: 'assignments' };
    } else if (queryLower.includes('material') || queryLower.includes('study')) {
      return { category: 'ERP', intent: 'study-materials' };
    } else if (queryLower.includes('lecture')) {
      return { category: 'ERP', intent: 'lectures' };
    }
    
    // Default ERP intent if not specific
    return { category: 'ERP', intent: 'dashboard' };
  }
  
  // If not ERP, classify as LLM
  return { category: 'LLM', intent: 'general' };
};

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Classify the query
      const classification = await classifyQuery(query);
      
      if (classification.category === 'ERP') {
        // Navigate to appropriate ERP section based on intent
        navigate(`/dashboard/${classification.intent}`, { 
          state: { searchQuery: query } 
        });
      } else {
        // Navigate to LLM assistant with the query
        navigate('/dashboard/assistant', { 
          state: { searchQuery: query } 
        });
      }
    } catch (error) {
      console.error('Search classification failed', error);
      toast({
        title: "Search Error",
        description: "Could not process your search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="text"
        placeholder="Search classes, assignments, or ask anything..."
        className="pl-4 pr-10 border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button 
        type="submit"
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-college-gold/10 text-college-gold"
        disabled={isSearching || !query}
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default SearchBar;
