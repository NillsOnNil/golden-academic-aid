
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { mockDb, StudyMaterial } from '../lib/mockDb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Search, BookOpen } from 'lucide-react';

const StudyMaterials = () => {
  const location = useLocation();
  const initialSearchQuery = location.state?.searchQuery || '';
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Get unique subjects for the filter
  const subjects = [...new Set(mockDb.studyMaterials.map(m => m.subject))];
  
  useEffect(() => {
    // Initial fetch of materials
    fetchMaterials();
  }, [initialSearchQuery]);

  const fetchMaterials = () => {
    setLoading(true);
    
    // Get materials based on subject filter
    let filteredMaterials = mockDb.getStudyMaterialsBySubject(selectedSubject);
    
    // Apply search filter if provided
    if (searchQuery) {
      filteredMaterials = filteredMaterials.filter(
        material => 
          material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setMaterials(filteredMaterials);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMaterials();
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    // Wait for state update and then fetch
    setTimeout(() => {
      fetchMaterials();
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Study Materials</h1>
        <p className="text-muted-foreground">Access course materials and resources</p>
      </div>
      
      <Card className="bg-black border-college-gold/20">
        <CardHeader>
          <CardTitle className="text-white">Search Study Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by title or description..."
                  className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="w-full sm:w-64">
                <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                  <SelectTrigger className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-college-gold/20 text-white">
                    <SelectItem value="">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit" 
                className="bg-college-gold hover:bg-college-gold/80 text-black"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-college-gold"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {materials.length > 0 ? (
            materials.map((material) => (
              <Card 
                key={material.material_id} 
                className="bg-black text-white border-college-gold/20 flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 text-college-gold mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <CardTitle className="text-college-gold">{material.title}</CardTitle>
                      <CardDescription className="text-white/70 mt-1">
                        Subject: {material.subject}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-white/90">{material.description}</p>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Button 
                    className="w-full bg-transparent border border-college-gold text-college-gold hover:bg-college-gold hover:text-black"
                    onClick={() => window.open(material.url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Material
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="bg-black text-white border-college-gold/20 col-span-full">
              <CardContent className="py-6 text-center">
                <FileText className="h-8 w-8 mx-auto text-white/40 mb-2" />
                <p className="text-white/70">No study materials found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyMaterials;
