import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCampusNavigationData, getNearbyLocations, getLocationByName } from '@/services/campusNavigationService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CampusLocation } from '@/types/campusNavigator';
import { AlertCircle, MapPin, Navigation } from 'lucide-react';

const CampusNavigator: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [nearbyLocations, setNearbyLocations] = useState<any[]>([]);
  const [allLocations, setAllLocations] = useState<CampusLocation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const navData = getCampusNavigationData();
      setAllLocations(navData.locations);
      if (selectedLocation) {
        const nearby = getNearbyLocations(selectedLocation);
        setNearbyLocations(nearby);
      }
    } catch (err) {
      setError('Error loading navigation data');
      console.error(err);
    }
  }, [selectedLocation]);

  const handleLocationChange = (locationId: string) => {
    const location = allLocations.find(loc => loc.id === parseInt(locationId));
    if (location) {
      setSelectedLocation(location.name);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <MapPin className="h-5 w-5 mr-2 text-college-gold" />
          Campus Navigator
        </CardTitle>
        <CardDescription>Find your way around campus</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center p-3 text-red-500 bg-red-50 rounded">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Location</label>
                <Select onValueChange={handleLocationChange} value={selectedLocation ? allLocations.find(loc => loc.name === selectedLocation)?.id.toString() : ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {allLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedLocation && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Nearby Places:</h3>
                  {nearbyLocations.length > 0 ? (
                    <ul className="space-y-2">
                      {nearbyLocations.map((nearby, index) => (
                        <li key={index} className="flex items-center p-2 bg-slate-50 rounded">
                          <Navigation className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{nearby.location.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No nearby locations found</p>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">
                    Locations are displayed in order of proximity to the selected location.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Proximity is calculated using Euclidean distance on the campus map.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CampusNavigator; 