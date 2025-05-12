
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Search, ExternalLink, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

// Available subjects for the dropdown
const availableSubjects = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'History',
  'Literature',
  'Engineering'
];

const YOUTUBE_API_KEY = 'AIzaSyASbpVgtjiCncjjzJm8qSkajW7fK8SHO_w';

const Lectures = () => {
  const location = useLocation();
  const initialSearchQuery = location.state?.searchQuery || '';
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VideoResult[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // If we have an initial search query from navigation, perform search
    if (initialSearchQuery) {
      handleSearch(new Event('submit') as unknown as React.FormEvent);
    }
  }, []);

  // Search YouTube using the YouTube Data API
  const searchYouTubeVideos = async (query: string) => {
    setLoading(true);
    
    try {
      const fullQuery = subject ? `${subject} ${query}` : query;
      const encodedQuery = encodeURIComponent(fullQuery);
      
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodedQuery}&maxResults=4&type=video&safeSearch=strict&key=${YOUTUBE_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch videos');
      }
      
      const videos: VideoResult[] = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt
      }));
      
      setResults(videos);
    } catch (error) {
      console.error('Error searching YouTube', error);
      toast({
        title: "Search Error",
        description: "Could not fetch lecture videos. Please try again.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      searchYouTubeVideos(searchQuery);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lecture Videos</h1>
        <p className="text-muted-foreground">Watch educational videos related to your subjects</p>
      </div>
      
      <Card className="bg-black border-college-gold/20">
        <CardHeader>
          <CardTitle className="text-white">Search Lecture Videos</CardTitle>
          <CardDescription className="text-white/70">
            Find educational videos on any topic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="subject" className="text-sm font-medium text-white/70 mb-1 block">
                  Subject
                </label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger 
                    id="subject"
                    className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                  >
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-college-gold/20 text-white">
                    {availableSubjects.map((subj) => (
                      <SelectItem key={subj} value={subj}>
                        {subj}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="topic" className="text-sm font-medium text-white/70 mb-1 block">
                  Topic/Concept
                </label>
                <Input
                  id="topic"
                  placeholder="e.g., Algorithms, Calculus"
                  className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="bg-college-gold hover:bg-college-gold/80 text-black"
              disabled={loading}
            >
              {loading ? (
                <>Searching...</>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Videos
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-college-gold"></div>
        </div>
      ) : (
        <>
          {results.length > 0 && (
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <p className="text-muted-foreground">Found {results.length} videos</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((video) => (
              <Card 
                key={video.id} 
                className="bg-black text-white border-college-gold/20 flex flex-col"
              >
                <div className="aspect-video w-full bg-black/50 overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start">
                    <Video className="h-5 w-5 text-college-gold mt-1 mr-2 flex-shrink-0" />
                    <CardTitle className="text-college-gold">{video.title}</CardTitle>
                  </div>
                  <div className="flex items-center text-white/70 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-white/90">{video.description}</p>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Button 
                    className="w-full bg-transparent border border-college-gold text-college-gold hover:bg-college-gold hover:text-black"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch Video
                  </Button>
                </div>
              </Card>
            ))}
            
            {searchQuery && results.length === 0 && !loading && (
              <Card className="bg-black text-white border-college-gold/20 col-span-full">
                <CardContent className="py-6 text-center">
                  <Video className="h-8 w-8 mx-auto text-white/40 mb-2" />
                  <p className="text-white/70">No videos found for your search. Try different keywords.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Lectures;
