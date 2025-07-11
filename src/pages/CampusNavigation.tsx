import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CampusNavigator from '@/components/CampusNavigator';
import { MapPin, CompassIcon } from 'lucide-react';
import { getCampusNavigationData } from '@/services/campusNavigationService';
import { CampusLocation } from '@/types/campusNavigator';

const CampusNavigation: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <MapPin className="h-6 w-6 mr-2 text-college-gold" />
        Campus Navigation
      </h1>
      
      <CampusNavigator />
      
      <div className="mt-8 text-sm text-muted-foreground">
        <p>The campus navigation system helps students and visitors find their way around campus facilities.</p>
        <p className="mt-2">Our navigation system uses Euclidean distance calculations for precise proximity information between locations.</p>
        <p className="mt-2">For detailed directions between locations, please visit the campus information desks or ask at the administration office.</p>
      </div>
    </div>
  );
};

export default CampusNavigation; 