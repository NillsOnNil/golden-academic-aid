import { CampusLocation, LocationDistances, NavigationData } from '../types/campusNavigator';

// Location data based on the map
const campusLocations: CampusLocation[] = [
  { id: 1, name: "Administration Block" },
  { id: 2, name: "Auditorium" },
  { id: 3, name: "Students Affairs/Admissions" },
  { id: 4, name: "Central Library" },
  { id: 5, name: "Basket Ball Courts" },
  { id: 6, name: "Volleyball Court" },
  { id: 7, name: "Cafeteria" },
  { id: 8, name: "View Tube" },
  { id: 9, name: "Boys Hostel" },
  { id: 10, name: "Green Forest" },
  { id: 11, name: "Rain Water Harvested Lake" },
  { id: 12, name: "Water Treatment Plant" },
  { id: 13, name: "Two Wheeler Parking" },
  { id: 14, name: "Car Parking" },
];

// Distance matrix for all campus locations
const distanceMatrix: LocationDistances = {
  "Loc1": {
    "Loc1": 0.00, "Loc2": 72.80, "Loc3": 70.71, "Loc4": 241.30, "Loc5": 137.57,
    "Loc6": 20.62, "Loc7": 311.33, "Loc8": 301.54, "Loc9": 539.00, "Loc10": 531.15,
    "Loc11": 379.64, "Loc12": 241.30, "Loc13": 119.27, "Loc14": 221.42
  },
  "Loc2": {
    "Loc1": 72.80, "Loc2": 0.00, "Loc3": 140.36, "Loc4": 311.33, "Loc5": 210.30,
    "Loc6": 93.41, "Loc7": 382.39, "Loc8": 369.09, "Loc9": 607.47, "Loc10": 602.52,
    "Loc11": 444.78, "Loc12": 293.47, "Loc13": 90.14, "Loc14": 150.08
  },
  "Loc3": {
    "Loc1": 70.71, "Loc2": 140.36, "Loc3": 0.00, "Loc4": 194.74, "Loc5": 81.39,
    "Loc6": 52.20, "Loc7": 259.28, "Loc8": 260.05, "Loc9": 491.76, "Loc10": 462.20,
    "Loc11": 309.23, "Loc12": 180.35, "Loc13": 185.81, "Loc14": 290.39
  },
  "Loc4": {
    "Loc1": 241.30, "Loc2": 311.33, "Loc3": 194.74, "Loc4": 0.00, "Loc5": 114.02,
    "Loc6": 222.04, "Loc7": 72.80, "Loc8": 67.08, "Loc9": 298.33, "Loc10": 344.82,
    "Loc11": 278.03, "Loc12": 270.00, "Loc13": 308.06, "Loc14": 449.44
  },
  "Loc5": {
    "Loc1": 137.57, "Loc2": 210.30, "Loc3": 81.39, "Loc4": 114.02, "Loc5": 0.00,
    "Loc6": 117.05, "Loc7": 178.04, "Loc8": 180.28, "Loc9": 410.37, "Loc10": 400.12,
    "Loc11": 272.95, "Loc12": 193.13, "Loc13": 230.87, "Loc14": 356.93
  },
  "Loc6": {
    "Loc1": 20.62, "Loc2": 93.41, "Loc3": 52.20, "Loc4": 222.04, "Loc5": 117.05,
    "Loc6": 0.00, "Loc7": 291.55, "Loc8": 283.20, "Loc9": 520.10, "Loc10": 510.88,
    "Loc11": 361.39, "Loc12": 228.04, "Loc13": 134.16, "Loc14": 241.87
  },
  "Loc7": {
    "Loc1": 311.33, "Loc2": 382.39, "Loc3": 259.28, "Loc4": 72.80, "Loc5": 178.04,
    "Loc6": 291.55, "Loc7": 0.00, "Loc8": 56.57, "Loc9": 233.45, "Loc10": 286.36,
    "Loc11": 260.00, "Loc12": 298.33, "Loc13": 380.79, "Loc14": 522.02
  },
  "Loc8": {
    "Loc1": 301.54, "Loc2": 369.09, "Loc3": 260.05, "Loc4": 67.08, "Loc5": 180.28,
    "Loc6": 283.20, "Loc7": 56.57, "Loc8": 0.00, "Loc9": 238.54, "Loc10": 340.00,
    "Loc11": 313.05, "Loc12": 331.36, "Loc13": 354.68, "Loc14": 500.90
  },
  "Loc9": {
    "Loc1": 539.00, "Loc2": 607.47, "Loc3": 491.76, "Loc4": 298.33, "Loc5": 410.37,
    "Loc6": 520.10, "Loc7": 233.45, "Loc8": 238.54, "Loc9": 0.00, "Loc10": 306.76,
    "Loc11": 414.37, "Loc12": 514.30, "Loc13": 590.34, "Loc14": 738.24
  },
  "Loc10": {
    "Loc1": 531.15, "Loc2": 602.52, "Loc3": 462.20, "Loc4": 344.82, "Loc5": 400.12,
    "Loc6": 510.88, "Loc7": 286.36, "Loc8": 340.00, "Loc9": 306.76, "Loc10": 0.00,
    "Loc11": 200.00, "Loc12": 371.21, "Loc13": 630.71, "Loc14": 752.40
  },
  "Loc11": {
    "Loc1": 379.64, "Loc2": 444.78, "Loc3": 309.23, "Loc4": 278.03, "Loc5": 272.95,
    "Loc6": 361.39, "Loc7": 260.00, "Loc8": 313.05, "Loc9": 414.37, "Loc10": 200.00,
    "Loc11": 0.00, "Loc12": 177.20, "Loc13": 493.36, "Loc14": 593.04
  },
  "Loc12": {
    "Loc1": 241.30, "Loc2": 293.47, "Loc3": 180.35, "Loc4": 270.00, "Loc5": 193.13,
    "Loc6": 228.04, "Loc7": 298.33, "Loc8": 331.36, "Loc9": 514.30, "Loc10": 371.21,
    "Loc11": 177.20, "Loc12": 0.00, "Loc13": 360.56, "Loc14": 434.17
  },
  "Loc13": {
    "Loc1": 119.27, "Loc2": 90.14, "Loc3": 185.81, "Loc4": 308.06, "Loc5": 230.87,
    "Loc6": 134.16, "Loc7": 380.79, "Loc8": 354.68, "Loc9": 590.34, "Loc10": 630.71,
    "Loc11": 493.36, "Loc12": 360.56, "Loc13": 0.00, "Loc14": 150.00
  },
  "Loc14": {
    "Loc1": 221.42, "Loc2": 150.08, "Loc3": 290.39, "Loc4": 449.44, "Loc5": 356.93,
    "Loc6": 241.87, "Loc7": 522.02, "Loc8": 500.90, "Loc9": 738.24, "Loc10": 752.40,
    "Loc11": 593.04, "Loc12": 434.17, "Loc13": 150.00, "Loc14": 0.00
  }
};

// Pre-calculate the nearby locations for each location
const buildNearbyLocationsMap = () => {
  const nearbyLocations: { [key: string]: any[] } = {};
  
  campusLocations.forEach((location, index) => {
    const locationKey = `Loc${index + 1}`;
    const distances = distanceMatrix[locationKey];
    
    // Convert distances object to array of {location, distance} pairs
    const distancesArray = Object.entries(distances)
      .filter(([key, _]) => key !== locationKey) // Filter out self
      .map(([key, distance]) => {
        const targetIndex = parseInt(key.replace('Loc', '')) - 1;
        return {
          location: campusLocations[targetIndex],
          distance
        };
      })
      // Sort by distance (ascending)
      .sort((a, b) => a.distance - b.distance);
    
    // Get top 3 closest locations
    nearbyLocations[location.name] = distancesArray.slice(0, 3);
  });
  
  return nearbyLocations;
};

const navigationData: NavigationData = {
  locations: campusLocations,
  nearbyLocations: buildNearbyLocationsMap(),
  distanceMatrix
};

/**
 * Get campus navigation data
 */
export const getCampusNavigationData = (): NavigationData => {
  return navigationData;
};

/**
 * Get the location by ID
 */
export const getLocationById = (id: number): CampusLocation | undefined => {
  return campusLocations.find(location => location.id === id);
};

/**
 * Get the location by name (case-insensitive partial match)
 */
export const getLocationByName = (name: string): CampusLocation | undefined => {
  const normalizedName = name.toLowerCase();
  return campusLocations.find(location => 
    location.name.toLowerCase().includes(normalizedName)
  );
};

/**
 * Get nearby locations for a specific location
 * @param locationName The name of the location
 * @param limit The maximum number of nearby locations to return (default: 3)
 * @param includeDistances Whether to include distance values in the result (default: false)
 */
export const getNearbyLocations = (
  locationName: string, 
  limit: number = 3,
  includeDistances: boolean = false
): { location: CampusLocation, distance: number }[] => {
  const allNearby = navigationData.nearbyLocations[locationName] || [];
  
  if (includeDistances) {
    return allNearby.slice(0, limit);
  } else {
    // Return without distance values for UI display
    return allNearby.slice(0, limit).map(item => ({
      location: item.location,
      distance: 0 // Replace actual distance with 0 to hide it
    }));
  }
};

/**
 * Get the distance between two locations
 */
export const getDistance = (location1Name: string, location2Name: string): number | null => {
  const location1 = getLocationByName(location1Name);
  const location2 = getLocationByName(location2Name);
  
  if (!location1 || !location2) {
    return null;
  }
  
  const key1 = `Loc${location1.id}`;
  const key2 = `Loc${location2.id}`;
  
  return distanceMatrix[key1][key2];
}; 