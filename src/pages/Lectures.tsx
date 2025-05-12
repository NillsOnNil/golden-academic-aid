
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Video, Search, ExternalLink, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

const Lectures = () => {
  const location = useLocation();
  const initialSearchQuery = location.state?.searchQuery || '';
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VideoResult[]>([]);
  const { toast } = useToast();

  // Mock YouTube search functionality
  // In real application, this would connect to the YouTube Data API
  const searchYouTubeLectures = async (query: string) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app, this would come from YouTube API
      const mockYouTubeResults: VideoResult[] = [
        {
          id: 'video1',
          title: `${query} - Comprehensive Lecture Part 1`,
          description: 'Learn the fundamentals and core concepts.',
          thumbnail: 'https://via.placeholder.com/320x180.png?text=Lecture+Thumbnail',
          publishedAt: '2023-09-15'
        },
        {
          id: 'video2',
          title: `Advanced ${query} Concepts`,
          description: 'Deep dive into advanced topics and applications.',
          thumbnail: 'https://via.placeholder.com/320x180.png?text=Advanced+Lecture',
          publishedAt: '2023-10-02'
        },
        {
          id: 'video3',
          title: `${query} Tutorial for Beginners`,
          description: 'Step-by-step guide for beginners.',
          thumbnail: 'https://via.placeholder.com/320x180.png?text=Tutorial',
          publishedAt: '2023-08-20'
        },
        {
          id: 'video4',
          title: `${query} - Practice Problems and Solutions`,
          description: 'Work through common problems with detailed solutions.',
          thumbnail: 'https://via.placeholder.com/320x180.png?text=Practice+Problems',
          publishedAt: '2023-11-05'
        }
      ];
      
      setResults(mockYouTubeResults);
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
    
    const fullQuery = subject ? `${subject} ${searchQuery}` : searchQuery;
    
    if (fullQuery.trim()) {
      searchYouTubeLectures(fullQuery);
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
                <Input
                  id="subject"
                  placeholder="e.g., Computer Science, Mathematics"
                  className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
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
                    // In a real app, this would link to the actual video
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
