import { generateGeminiResponse } from './geminiService';
import { classifierService, QueryType } from './classifierService';
import { databaseService } from './databaseService';
import { 
  getCampusNavigationData, 
  getNearbyLocations, 
  getLocationByName,
  getDistance
} from './campusNavigationService';

/**
 * Gets the current day of the week
 */
const getCurrentDayOfWeek = (): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  return days[today.getDay()];
};

/**
 * Gets tomorrow's day of the week
 */
const getTomorrowDayOfWeek = (): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return days[tomorrow.getDay()];
};

/**
 * Filters schedule data by day
 */
const filterScheduleByDay = (data: any[], dayFilter: string | undefined): any[] => {
  if (!dayFilter || !Array.isArray(data)) {
    return data;
  }
  
  // Convert filter to actual day name
  let targetDay: string;
  if (dayFilter === 'today') {
    targetDay = getCurrentDayOfWeek();
  } else if (dayFilter === 'tomorrow') {
    targetDay = getTomorrowDayOfWeek();
  } else {
    // Capitalize first letter to match day format in data
    targetDay = dayFilter.charAt(0).toUpperCase() + dayFilter.slice(1).toLowerCase();
  }
  
  console.log(`Filtering schedule for day: ${targetDay}`);
  console.log(`Original data count: ${data.length}`);
  const filteredData = data.filter(item => item.day === targetDay);
  console.log(`Filtered data count: ${filteredData.length}`);
  console.log(`First item day: ${data.length > 0 ? data[0].day : 'none'}`);
  return filteredData;
};

/**
 * Formats database results into a readable response
 */
const formatDatabaseResults = (data: any, category: string, dayFilter?: string): string => {
  try {
    console.log('Format database results - Category:', category, ', Day Filter:', dayFilter);
    console.log('Data sample:', data && Array.isArray(data) && data.length > 0 ? data[0] : 'empty');
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      if (category === 'SCHEDULE' && dayFilter) {
        // Special message for when no classes are found for a specific day
        if (dayFilter === 'today') {
          return `You don't have any classes scheduled for today (${getCurrentDayOfWeek()}).`;
        } else if (dayFilter === 'tomorrow') {
          return `You don't have any classes scheduled for tomorrow (${getTomorrowDayOfWeek()}).`;
        } else {
          return `You don't have any classes scheduled for ${dayFilter}.`;
        }
      }
      return "I couldn't find any relevant information in the database. Can you provide more details?";
    }

    switch (category) {
      case 'SCHEDULE':
        if (Array.isArray(data)) {
          // Handle day filtering
          let filteredData = data;
          if (dayFilter) {
            filteredData = filterScheduleByDay(data, dayFilter);
            
            if (filteredData.length === 0) {
              if (dayFilter === 'today') {
                return `You don't have any classes scheduled for today (${getCurrentDayOfWeek()}).`;
              } else if (dayFilter === 'tomorrow') {
                return `You don't have any classes scheduled for tomorrow (${getTomorrowDayOfWeek()}).`;
              } else {
                return `You don't have any classes scheduled for ${dayFilter}.`;
              }
            }
            
            // Customize intro message based on filter
            let introMessage = "Here's your schedule";
            if (dayFilter === 'today') {
              introMessage = `Here's your schedule for today (${getCurrentDayOfWeek()})`;
            } else if (dayFilter === 'tomorrow') {
              introMessage = `Here's your schedule for tomorrow (${getTomorrowDayOfWeek()})`;
            } else {
              introMessage = `Here's your schedule for ${dayFilter}`;
            }
            
            return `${introMessage}:\n\n${filteredData.map(schedule => 
              `• ${schedule.courseName} (${schedule.courseId})\n  ${schedule.startTime} - ${schedule.endTime}\n  Location: ${schedule.location}`
            ).join('\n\n')}`;
          }
          
          // Default schedule output for all days
          return `Here's your schedule:\n\n${data.map(schedule => 
            `• ${schedule.courseName} (${schedule.courseId})\n  ${schedule.day}, ${schedule.startTime} - ${schedule.endTime}\n  Location: ${schedule.location}`
          ).join('\n\n')}`;
        }
        break;

      case 'ASSIGNMENTS':
        if (Array.isArray(data)) {
          return `Here are your assignments:\n\n${data.map(assignment => 
            `• ${assignment.title} - ${assignment.courseName}\n  Due: ${assignment.dueDate.toLocaleDateString()}\n  ${assignment.description}`
          ).join('\n\n')}`;
        } else if (data.id) { // Single assignment
          return `Assignment: ${data.title}\nCourse: ${data.courseName}\nDue: ${data.dueDate.toLocaleDateString()}\n\nDescription: ${data.description}`;
        }
        break;

      case 'COURSES':
        if (Array.isArray(data)) {
          return `You are enrolled in the following courses:\n\n${data.map(course => 
            `• ${course.name} (${course.code})\n  Instructor: ${course.instructor}\n  Credits: ${course.credits}`
          ).join('\n\n')}`;
        }
        break;
        
      case 'REMINDERS':
        if (Array.isArray(data)) {
          return `Here are your reminders:\n\n${data.map(reminder => 
            `• ${reminder.title}\n  Date: ${reminder.date.toLocaleDateString()}, Time: ${reminder.time}\n  ${reminder.description}`
          ).join('\n\n')}`;
        }
        break;

      case 'LOCATION':
        if (Array.isArray(data)) {
          // For location queries requiring a list, make it brief
          return `Here are the campus locations:\n\n${data.map(location => 
            `• ${location.name} (${location.type})`
          ).join('\n')}`;
        } else if (data.id) { // Single location - direct and specific
          // Provide only the exact location information without additional text
          let result = `${data.name} is ${data.description}`;
          
          if (data.openingHours) {
            result += `\nOpening Hours: ${data.openingHours}`;
          }
          
          if (data.nearbyPlaces && data.nearbyPlaces.length > 0) {
            result += `\nNearby: ${data.nearbyPlaces.join(', ')}`;
          }
          
          return result;
        }
        break;

      default:
        return `Here's the information from the database:\n\n${JSON.stringify(data, null, 2)}`;
    }

    // Fallback generic formatting
    return `Here's the information from the database:\n\n${JSON.stringify(data, null, 2)}`;
  } catch (error) {
    console.error('Error formatting database results:', error);
    return "I found some information but had trouble formatting it. Please try asking in a different way.";
  }
};

/**
 * Enhances LLM responses with database information
 */
const enhanceResponseWithDatabaseInfo = async (
  query: string, 
  llmResponse: string, 
  databaseResults: any, 
  category: string
): Promise<string> => {
  // Extract day filter for schedule queries
  let dayFilter: string | undefined = undefined;
  if (category === 'SCHEDULE') {
    const classification = classifierService.classifyQuery(query);
    if (classification.extractedInfo?.dayFilter) {
      dayFilter = classification.extractedInfo.dayFilter;
    }
  }

  // For location queries, just return the formatted database results
  if (category === 'LOCATION') {
    return formatDatabaseResults(databaseResults, category);
  }
  
  // For other categories, combine database and LLM responses
  const databaseInfo = formatDatabaseResults(databaseResults, category, dayFilter);
  
  // Prefix the LLM response with the database information
  return `${databaseInfo}\n\nAdditional information:\n${llmResponse}`;
};

/**
 * Extracts database category from direct database command
 * For queries that start with the ! symbol
 */
const extractCategoryFromDirectCommand = (query: string): string | null => {
  // Remove the ! prefix and trim
  query = query.substring(1).trim().toLowerCase();
  
  // Check for assignment keywords first (to prevent misclassifications)
  if (query.includes('assignment') || query.includes('homework') || 
      query.includes('due') || query.includes('task') || 
      query.includes('project') || query.startsWith('assignment')) {
    return 'ASSIGNMENTS';
  }
  
  // Check for common keywords to determine category
  if (query.includes('schedule') || query.includes('class') || query.includes('timetable') ||
      query.includes('today') || query.includes('tomorrow') ||
      query.includes('monday') || query.includes('tuesday') || 
      query.includes('wednesday') || query.includes('thursday') || 
      query.includes('friday')) {
    return 'SCHEDULE';
  } else if (query.includes('course') || query.includes('subject') || query.includes('enrolled')) {
    return 'COURSES';
  } else if (query.includes('reminder') || query.includes('event')) {
    return 'REMINDERS';
  } else if (query.includes('campus') || query.includes('location') || query.includes('map') || 
             query.includes('building') || query.includes('gate') || query.includes('where') ||
             query.includes('library') || query.includes('cafeteria') || query.includes('food') ||
             query.includes('coffee') || query.includes('hostel') || query.includes('parking')) {
    return 'LOCATION';
  } else {
    // If no specific category is found, try to determine from context
    return null;
  }
};

/**
 * Processes a direct database command (query starting with !)
 */
const processDirectDatabaseCommand = async (query: string, studentId: string): Promise<string> => {
  try {
    // Extract the query category
    const category = extractCategoryFromDirectCommand(query);
    
    if (!category) {
      // If no category could be determined, use LLM to help categorize and then query
      const enhancedQuery = `The user is asking about their college data with this query: ${query.substring(1).trim()}. 
      What specific category of information are they looking for? 
      Is it about their schedule, assignments, courses, reminders, or campus locations?`;
      
      const llmCategorization = await generateGeminiResponse(enhancedQuery);
      
      // Use the LLM's response to determine what data to fetch
      let databaseResults = null;
      
      if (llmCategorization.toLowerCase().includes('schedule') && 
          !llmCategorization.toLowerCase().includes('assignment')) {
        databaseResults = await databaseService.getStudentSchedule(studentId);
        
        // Check for day-specific schedule requests
        const normalizedQuery = query.toLowerCase();
        let dayFilter;
        
        if (normalizedQuery.includes('today') || normalizedQuery.includes('today\'s') || 
            normalizedQuery.includes('todays')) {
          dayFilter = 'today';
        } else if (normalizedQuery.includes('tomorrow')) {
          dayFilter = 'tomorrow';
        } else {
          const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          for (const day of daysOfWeek) {
            if (normalizedQuery.includes(day)) {
              dayFilter = day;
              break;
            }
          }
        }
        
        return formatDatabaseResults(databaseResults, 'SCHEDULE', dayFilter);
      } else if (llmCategorization.toLowerCase().includes('assignment')) {
        databaseResults = await databaseService.getStudentAssignments(studentId);
        return formatDatabaseResults(databaseResults, 'ASSIGNMENTS');
      } else if (llmCategorization.toLowerCase().includes('course')) {
        databaseResults = await databaseService.getStudentCourses(studentId);
        return formatDatabaseResults(databaseResults, 'COURSES');
      } else if (llmCategorization.toLowerCase().includes('reminder')) {
        databaseResults = await databaseService.getStudentReminders(studentId);
        return formatDatabaseResults(databaseResults, 'REMINDERS');
      } else if (llmCategorization.toLowerCase().includes('location') || 
                llmCategorization.toLowerCase().includes('campus') ||
                llmCategorization.toLowerCase().includes('map') ||
                llmCategorization.toLowerCase().includes('building')) {
        databaseResults = await databaseService.getCampusLocations();
        return formatDatabaseResults(databaseResults, 'LOCATION');
      } else {
        return "I couldn't determine what college data you're looking for. Try being more specific or use one of these formats:\n!schedule - for your class schedule\n!assignments - for your homework\n!courses - for your enrolled courses\n!location - for campus locations and buildings";
      }
    }
    
    // Fetch data based on category
    let databaseResults;
    let dayFilter;
    
    // Check for specific assignment query
    if (category === 'ASSIGNMENTS') {
      console.log('Processing ASSIGNMENTS query');
      // Check if looking for a specific assignment
      const assignmentMatch = query.match(/assignment\s*(\d+)/i);
      if (assignmentMatch) {
        databaseResults = await databaseService.getAssignmentDetails(assignmentMatch[1]);
      } else {
        databaseResults = await databaseService.getStudentAssignments(studentId);
      }
      return formatDatabaseResults(databaseResults, 'ASSIGNMENTS');
    }

    // Check for day-specific queries if the category is SCHEDULE
    if (category === 'SCHEDULE') {
      const normalizedQuery = query.toLowerCase();
      
      if (normalizedQuery.includes('today') || normalizedQuery.includes('today\'s') || 
          normalizedQuery.includes('todays')) {
        dayFilter = 'today';
      } else if (normalizedQuery.includes('tomorrow')) {
        dayFilter = 'tomorrow';
      } else {
        const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        for (const day of daysOfWeek) {
          if (normalizedQuery.includes(day)) {
            dayFilter = day;
            break;
          }
        }
      }
    }
    
    switch (category) {
      case 'SCHEDULE':
        databaseResults = await databaseService.getStudentSchedule(studentId);
        console.log('Schedule database results:', databaseResults);
        if (databaseResults && Array.isArray(databaseResults) && databaseResults.length > 0) {
          console.log('Sample schedule item:', databaseResults[0]);
          console.log('Schedule item day format:', databaseResults[0].day);
        }
        break;
      case 'ASSIGNMENTS':
        // Check if looking for a specific assignment
        const assignmentMatch = query.match(/assignment\s*(\d+)/i);
        if (assignmentMatch) {
          databaseResults = await databaseService.getAssignmentDetails(assignmentMatch[1]);
        } else {
          databaseResults = await databaseService.getStudentAssignments(studentId);
        }
        break;
      case 'COURSES':
        databaseResults = await databaseService.getStudentCourses(studentId);
        break;
      case 'REMINDERS':
        databaseResults = await databaseService.getStudentReminders(studentId);
        break;
      case 'LOCATION':
        // Check if looking for a specific location
        const locationQuery = query.substring(1).trim();
        const specificLocation = extractSpecificLocation(locationQuery);
        if (specificLocation) {
          databaseResults = await databaseService.getCampusLocations(specificLocation);
        } else {
          databaseResults = await databaseService.getCampusLocations();
        }
        break;
      default:
        return "I couldn't determine what specific college data you're looking for. Try using !schedule, !assignments, !courses, !reminders, or !location.";
    }
    
    // Format and return the results
    return formatDatabaseResults(databaseResults, category, dayFilter);
  } catch (error) {
    console.error('Error processing direct database command:', error);
    return "I encountered an error while trying to fetch data from the database. Please try a different query format.";
  }
};

/**
 * Helper function to extract specific location from a query
 */
const extractSpecificLocation = (query: string): string | null => {
  // Normalize the query
  const normalizedQuery = query.toLowerCase();
  
  // List of common location keywords with variations
  const locationMappings = {
    // Gates
    'main gate': ['main gate', 'main entrance', 'entrance gate', 'gate 1', 'gate one'],
    'gate 2': ['gate 2', 'gate two', 'second gate', 'pharmacy gate'],
    'gate 3': ['gate 3', 'gate three', 'third gate', 'bike gate', 'two wheeler gate'],
    'gate 4': ['gate 4', 'gate four', 'fourth gate', 'car gate', 'parking gate'],
    'gate 5': ['gate 5', 'gate five', 'fifth gate', 'cottage gate'],
    'gate 6': ['gate 6', 'gate six', 'sixth gate', 'hostel gate'],
    
    // Buildings
    'library': ['library', 'central library', 'main library', 'study hall'],
    'coffee express': ['coffee', 'coffee express', 'coffee shop', 'mojito', 'cafe'],
    'lassi house': ['lassi', 'lassi house', 'lassi shop'],
    'campus mart': ['mart', 'campus mart', 'store', 'shop', 'campus store'],
    'cafeteria': ['cafeteria', 'canteen', 'dining hall', 'food court'],
    'hostel': ['hostel', 'boys hostel', 'dormitory', 'accommodation'],
    'administration': ['admin', 'administration', 'administration block', 'admin block', 'office'],
    'auditorium': ['auditorium', 'hall', 'event space', 'function hall'],
    'student affairs': ['student affairs', 'admissions', 'admission office', 'registration'],
    
    // Academic areas
    'pharmacy': ['pharmacy', 'pharmacy department', 'pharma'],
    'allied science': ['allied science', 'allied health', 'health sciences'],
    'polytechnic': ['polytechnic', 'poly', 'technical college'],
    'aigs': ['aigs'],
    'cprd': ['cprd'],
    
    // Sports and recreation
    'stadium': ['stadium', 'smt. nagarathnamma stadium', 'sports field', 'ground'],
    'volleyball court': ['volleyball', 'volleyball court'],
    'basketball courts': ['basketball', 'basketball court', 'basket ball', 'courts'],
    'view tube': ['view tube', 'recreation area', 'student recreation'],
    
    // Natural areas
    'green forest': ['forest', 'green forest', 'woods', 'trees'],
    'lake': ['lake', 'rain water lake', 'harvested lake', 'water body'],
    
    // Facilities
    'water treatment plant': ['water plant', 'treatment plant', 'water treatment'],
    'car parking': ['car park', 'car parking', 'automobile parking', 'four wheeler'],
    'two wheeler parking': ['bike parking', 'two wheeler', 'motorcycle', 'scooter', 'bike stand']
  };
  
  // Check for matches in the mappings
  for (const [location, keywords] of Object.entries(locationMappings)) {
    if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
      return location;
    }
  }
  
  // Check for exact mentions of facility types
  const facilityTypes = {
    'gate': ['gate', 'entrance', 'exit'],
    'parking': ['parking', 'park'],
    'food': ['food', 'eat', 'restaurant', 'cafe', 'dining'],
    'academic': ['class', 'classroom', 'lecture hall', 'department', 'study'],
    'sports': ['sport', 'play', 'game', 'athletic', 'recreation', 'fitness']
  };
  
  for (const [type, keywords] of Object.entries(facilityTypes)) {
    if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
      return type;
    }
  }
  
  return null;
};

/**
 * Process campus navigation specific queries
 */
const processCampusNavigationQuery = async (query: string): Promise<string> => {
  try {
    // Check if it's about nearby locations
    if (query.toLowerCase().includes('nearby') || query.toLowerCase().includes('close to')) {
      // Extract location
      const locationMatch = query.match(/(?:near|nearby|close to|around)\s+(.+?)(?:\?|$)/i);
      if (locationMatch && locationMatch[1]) {
        const locationName = locationMatch[1].trim();
        const location = getLocationByName(locationName);
        
        if (!location) {
          return `I couldn't find "${locationName}" on our campus map. Please try another location name.`;
        }
        
        // Get nearby places with distances (for internal sorting)
        const nearbyPlaces = getNearbyLocations(location.name, 3, true);
        if (nearbyPlaces.length === 0) {
          return `There are no notable locations near ${location.name}.`;
        }
        
        // Use the Euclidean distance data to create the response
        return `Places near ${location.name}:\n\n` + 
          nearbyPlaces.map(place => `• ${place.location.name}`).join('\n') +
          '\n\nLocations are listed in order of proximity based on Euclidean distance.';
      }
    }
    
    // Check if it's asking about specific location with enhanced pattern matching
    const locationMatch = query.match(/(?:where is|find|locate|show me|tell me about|how to reach|how to get to|direction to)\s+(?:the\s+)?(.+?)(?:\?|$|\s+is|\s+located)/i);
    if (locationMatch && locationMatch[1]) {
      const locationName = locationMatch[1].trim();
      const location = getLocationByName(locationName);
      
      if (!location) {
        return `I couldn't find "${locationName}" on our campus map. Please try another location name.`;
      }
      
      // Get nearby places with distances included
      const nearbyPlaces = getNearbyLocations(location.name, 3, true);
      
      return `${location.name} can be found on campus. Nearby locations include:\n\n` + 
        nearbyPlaces.map(place => `• ${place.location.name}`).join('\n') +
        '\n\nLocations are listed in order of proximity based on Euclidean distance. You can see these locations on the campus map in the Campus Navigation section.';
    }
    
    // Check for comparing distances between locations
    const distanceCompareMatch = query.match(/(?:distance|how far|far is|compare)\s+(?:from\s+)?(?:the\s+)?(.+?)\s+(?:to|and|from)\s+(?:the\s+)?(.+?)(?:\?|$)/i);
    if (distanceCompareMatch && distanceCompareMatch[1] && distanceCompareMatch[2]) {
      const location1Name = distanceCompareMatch[1].trim();
      const location2Name = distanceCompareMatch[2].trim();
      
      const location1 = getLocationByName(location1Name);
      const location2 = getLocationByName(location2Name);
      
      if (!location1) {
        return `I couldn't find "${location1Name}" on our campus map. Please try another location name.`;
      }
      
      if (!location2) {
        return `I couldn't find "${location2Name}" on our campus map. Please try another location name.`;
      }
      
      // Get the distance without revealing the actual number
      const distance = getDistance(location1.name, location2.name);
      
      // Use comparative language based on distance
      let proximityDescription = "";
      if (distance === null) {
        proximityDescription = "These locations are on campus, but I don't have exact proximity information.";
      } else if (distance < 100) {
        proximityDescription = `${location1.name} is very close to ${location2.name}.`;
      } else if (distance < 200) {
        proximityDescription = `${location1.name} is relatively close to ${location2.name}.`;
      } else if (distance < 350) {
        proximityDescription = `${location1.name} is at a moderate distance from ${location2.name}.`;
      } else if (distance < 500) {
        proximityDescription = `${location1.name} is quite far from ${location2.name}.`;
      } else {
        proximityDescription = `${location1.name} is very far from ${location2.name}.`;
      }
      
      return proximityDescription + " The proximity is calculated using Euclidean distance on the campus map.";
    }
    
    // Check for more general "where" queries
    if (query.toLowerCase().includes('where') && !query.toLowerCase().includes('where is')) {
      // Extract potential location names
      const words = query.toLowerCase().split(/\s+/);
      const navData = getCampusNavigationData();
      
      for (const location of navData.locations) {
        const locationNameLower = location.name.toLowerCase();
        if (words.some(word => locationNameLower.includes(word) || word.includes(locationNameLower))) {
          const nearbyPlaces = getNearbyLocations(location.name, 3, true);
          
          return `${location.name} can be found on campus. Nearby locations include:\n\n` + 
            nearbyPlaces.map(place => `• ${place.location.name}`).join('\n') +
            '\n\nLocations are listed in order of proximity based on Euclidean distance. You can view the exact location on the Campus Map section.';
        }
      }
    }
    
    // Handle request for all campus locations
    if (query.toLowerCase().includes('all locations') || 
        query.toLowerCase().includes('list all') || 
        query.toLowerCase().includes('show all') ||
        query.toLowerCase().includes('campus locations')) {
      const data = getCampusNavigationData();
      return `Here are all campus locations:\n\n` + 
        data.locations.map(location => `• ${location.name}`).join('\n') +
        '\n\nAll these locations are mapped with Euclidean distances for accurate proximity information. You can explore these locations in detail in the Campus Navigation section.';
    }
    
    // If it's a farthest/nearest query
    if (query.toLowerCase().includes('farthest') || query.toLowerCase().includes('furthest') || 
        query.toLowerCase().includes('nearest') || query.toLowerCase().includes('closest')) {
      
      const fromMatch = query.match(/(?:from|to)\s+(?:the\s+)?(.+?)(?:\?|$|\s+is|\s+located)/i);
      if (fromMatch && fromMatch[1]) {
        const locationName = fromMatch[1].trim();
        const location = getLocationByName(locationName);
        
        if (!location) {
          return `I couldn't find "${locationName}" on our campus map. Please try another location name.`;
        }
        
        const allDistances = [];
        const navData = getCampusNavigationData();
        
        for (const otherLocation of navData.locations) {
          if (otherLocation.name === location.name) continue;
          
          const distance = getDistance(location.name, otherLocation.name);
          if (distance !== null) {
            allDistances.push({ location: otherLocation, distance });
          }
        }
        
        // Sort by distance
        allDistances.sort((a, b) => a.distance - b.distance);
        
        if (query.toLowerCase().includes('nearest') || query.toLowerCase().includes('closest')) {
          // Get the nearest 3
          const nearest = allDistances.slice(0, 3);
          return `The nearest locations to ${location.name} are:\n\n` + 
            nearest.map(item => `• ${item.location.name}`).join('\n') +
            '\n\nLocations are listed in order of proximity based on Euclidean distance.';
        } else {
          // Get the farthest 3
          const farthest = allDistances.slice(-3).reverse();
          return `The farthest locations from ${location.name} are:\n\n` + 
            farthest.map(item => `• ${item.location.name}`).join('\n') +
            '\n\nLocations are listed in order of distance based on Euclidean distance.';
        }
      }
    }
    
    // If we reach here, it's a navigation query but doesn't match our patterns
    if (query.toLowerCase().includes('location') || 
        query.toLowerCase().includes('map') || 
        query.toLowerCase().includes('navigate') ||
        query.toLowerCase().includes('direction')) {
      return `I can help you navigate around campus using Euclidean distance calculations. You can ask me things like:\n\n` +
        `• "Where is the Central Library?"\n` +
        `• "What's near the Administration Block?"\n` +
        `• "How far is the Cafeteria from the Tennis Court?"\n` +
        `• "Which locations are closest to the Boys Hostel?"\n` +
        `• "Show me all campus locations"\n\n` +
        `Or you can visit the Campus Navigation section for an interactive map.`;
    }
    
    return null; // Return null if it doesn't match any navigation patterns
  } catch (error) {
    console.error('Error processing campus navigation query:', error);
    return "I encountered an error while processing your campus navigation request.";
  }
};

/**
 * Main assistant service that processes queries
 */
export const assistantService = {
  /**
   * Processes a user query and returns the appropriate response
   * @param query The user's query text
   * @returns A response from either the database, LLM, or a combination
   */
  async processQuery(query: string): Promise<string> {
    try {
      console.log('Processing query:', query);
      
      // Check for direct mentions of "today's classes" or similar
      const todayClassRegex = /today['']?s\s+class(es)?|class(es)?\s+today|class(es)?\s+for\s+today/i;
      if (todayClassRegex.test(query) && !query.toLowerCase().includes('assignment')) {
        console.log('Direct today class query detected!');
        // Directly get schedule and filter for today
        const studentId = localStorage.getItem('studentId') || '12345';
        const databaseResults = await databaseService.getStudentSchedule(studentId);
        return formatDatabaseResults(databaseResults, 'SCHEDULE', 'today');
      }
      
      // Check for direct mentions of assignments
      const assignmentRegex = /assignment(s)?|homework|due|task(s)?|project(s)?/i;
      if (assignmentRegex.test(query)) {
        console.log('Direct assignment query detected!');
        // Directly get assignments
        const studentId = localStorage.getItem('studentId') || '12345';
        const databaseResults = await databaseService.getStudentAssignments(studentId);
        return formatDatabaseResults(databaseResults, 'ASSIGNMENTS');
      }
      
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      
      // If not authenticated, only allow general knowledge queries
      if (!isAuthenticated) {
        return await generateGeminiResponse(
          `As a college assistant, I can only access your personal data when you're logged in. ${query}`
        );
      }
      
      // Get student ID from local storage
      let studentId = localStorage.getItem('studentId');
      
      // Fall back to default if not found in localStorage
      if (!studentId) {
        studentId = '12345';
      }
      
      // Check if this is a direct database command (starts with !)
      if (query.startsWith('!')) {
        console.log('Processing direct database command:', query);
        return await processDirectDatabaseCommand(query, studentId);
      }
      
      // Check if it's a campus navigation query - more comprehensive check
      const navigationKeywords = [
        'campus', 'map', 'location', 'where', 'find', 'nearby',
        'building', 'library', 'auditorium', 'cafeteria', 'hostel',
        'parking', 'navigate', 'direction', 'how to reach', 'how to get to'
      ];
      
      const isNavigationQuery = navigationKeywords.some(keyword => 
        query.toLowerCase().includes(keyword)
      );
      
      if (isNavigationQuery) {
        const navigationResponse = await processCampusNavigationQuery(query);
        
        // If the navigation function returned a response, use it
        // Otherwise, fall through to the general query processing
        if (navigationResponse) {
          return navigationResponse;
        }
      }
      
      // 1. Classify the query
      const classification = classifierService.classifyQuery(query);
      console.log('Query classification:', classification);

      // 2. Process based on query type
      if (classification.type === QueryType.DATABASE && classification.category) {
        // Get student ID from local storage (matches what we set in the AuthContext)
        let studentId = localStorage.getItem('studentId');
        
        // Fall back to extracted ID or default if not found in localStorage
        if (!studentId) {
          studentId = classification.extractedInfo?.studentId || '12345';
        }
        
        let databaseResults;
        
        // Special case for assignment queries to ensure they're not mistaken for schedules
        if (query.toLowerCase().includes('assignment') || 
            query.toLowerCase().includes('homework') || 
            query.toLowerCase().includes('due date') ||
            query.toLowerCase().includes('project') ||
            classification.category === 'ASSIGNMENTS') {
          
          console.log('Detected assignment query in classification flow');
          
          if (classification.extractedInfo?.assignmentId) {
            databaseResults = await databaseService.getAssignmentDetails(
              classification.extractedInfo.assignmentId
            );
          } else {
            databaseResults = await databaseService.getStudentAssignments(studentId);
          }
          
          return formatDatabaseResults(databaseResults, 'ASSIGNMENTS');
        }
        
        // 3. Fetch data from database based on category
        switch (classification.category) {
          case 'SCHEDULE':
            databaseResults = await databaseService.getStudentSchedule(studentId);
            console.log('Schedule database results:', databaseResults);
            if (databaseResults && Array.isArray(databaseResults) && databaseResults.length > 0) {
              console.log('Sample schedule item:', databaseResults[0]);
              console.log('Schedule item day format:', databaseResults[0].day);
            }
            break;
            
          case 'ASSIGNMENTS':
            if (classification.extractedInfo?.assignmentId) {
              databaseResults = await databaseService.getAssignmentDetails(
                classification.extractedInfo.assignmentId
              );
            } else {
              databaseResults = await databaseService.getStudentAssignments(studentId);
            }
            break;
            
          case 'COURSES':
            databaseResults = await databaseService.getStudentCourses(studentId);
            break;
            
          case 'REMINDERS':
            databaseResults = await databaseService.getStudentReminders(studentId);
            break;
            
          case 'LOCATION':
            // Check for specific location information in the query
            let locationName = null;
            
            if (classification.extractedInfo?.gateName) {
              locationName = `gate ${classification.extractedInfo.gateName}`;
            } else if (classification.extractedInfo?.buildingName) {
              locationName = classification.extractedInfo.buildingName;
            }
            
            databaseResults = await databaseService.getCampusLocations(locationName);
            break;
            
          default:
            // For other categories or when unsure, also get LLM response
            databaseResults = null;
        }
        
        // 4. Format database results into readable response
        if (databaseResults) {
          // For high confidence database queries, just return formatted results
          if (classification.confidence > 0.7) {
            if (classification.category === 'SCHEDULE' && classification.extractedInfo?.dayFilter) {
              return formatDatabaseResults(databaseResults, classification.category, classification.extractedInfo.dayFilter);
            }
            return formatDatabaseResults(databaseResults, classification.category);
          }
          
          // For medium confidence, enhance with LLM response
          const llmResponse = await generateGeminiResponse(query);
          return enhanceResponseWithDatabaseInfo(
            query, 
            llmResponse, 
            databaseResults, 
            classification.category
          );
        }
      }
      
      // 5. Default to LLM response for non-database queries
      return await generateGeminiResponse(query);
      
    } catch (error) {
      console.error('Error processing query:', error);
      return "I'm sorry, I encountered an error while processing your request. Please try again or ask in a different way.";
    }
  }
}; 