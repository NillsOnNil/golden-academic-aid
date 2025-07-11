import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CampusNavigationWidget: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    navigate('/dashboard/campus-navigation');
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-college-gold" />
          Campus Navigator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Find your way around campus with the location explorer.
        </p>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-100 p-2 rounded text-center">
            <p className="text-xs font-medium">14</p>
            <p className="text-xs text-muted-foreground">Locations</p>
          </div>
          <div className="bg-slate-100 p-2 rounded text-center">
            <p className="text-xs font-medium">Interactive</p>
            <p className="text-xs text-muted-foreground">Map</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleNavigate}
        >
          <Compass className="h-4 w-4 mr-2" />
          Explore Campus
        </Button>
      </CardContent>
    </Card>
  );
};

export default CampusNavigationWidget; 