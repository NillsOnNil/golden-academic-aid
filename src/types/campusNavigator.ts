export interface CampusLocation {
  id: number;
  name: string;
}

export interface NearbyLocation {
  location: CampusLocation;
  distance: number;
}

export interface LocationDistances {
  [locationKey: string]: {
    [otherLocationKey: string]: number;
  };
}

export interface NavigationData {
  locations: CampusLocation[];
  nearbyLocations: {
    [locationKey: string]: NearbyLocation[];
  };
  distanceMatrix: LocationDistances;
} 