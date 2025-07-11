// Simple ML model to classify queries as either database-related or general knowledge
enum QueryType {
  DATABASE = 'database',
  LLM = 'llm'
}

export interface ClassificationResult {
  type: QueryType;
  confidence: number;
  category?: string;
  extractedInfo?: {
    studentId?: string;
    courseId?: string;
    assignmentId?: string;
    [key: string]: any;
  };
}

// Database-related keywords for simple classification
const DATABASE_KEYWORDS = [
  'schedule', 'class schedule', 'timetable', 'classes', 
  'assignment', 'assignments', 'homework', 'due date', 'deadline',
  'course', 'courses', 'my course', 'my classes', 'enrolled',
  'grade', 'grades', 'transcript', 'score', 'marks',
  'professor', 'instructor', 'teacher', 'faculty',
  'semester', 'term',
  'exam', 'test', 'quiz', 'final',
  'syllabus', 'curriculum',
  'enrollment', 'register', 'registration',
  'when is', 'where is', 'what time',
  'campus', 'location', 'building', 'gate', 'map', 'where is', 'how to get to',
  'library', 'cafeteria', 'parking', 'stadium', 'hostel', 'entrance', 'exit',
  'food', 'eat', 'coffee', 'lassi', 'store', 'shop', 'mart'
];

// Categories for database queries
const QUERY_CATEGORIES = {
  SCHEDULE: [
    'schedule', 'timetable', 'when is', 'what time', 'where is', 'my classes',
    'today', 'today\'s', 'todays', 'class today', 'classes today', 
    'tomorrow', 'tomorrow\'s', 'tomorrows', 
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
    'this week', 'next week'
  ],
  ASSIGNMENTS: ['assignment', 'homework', 'due date', 'deadline', 'submission'],
  COURSES: ['course', 'enrolled', 'my course', 'my classes', 'curriculum', 'syllabus'],
  GRADES: ['grade', 'score', 'marks', 'transcript', 'gpa'],
  LOCATION: [
    // Campus areas
    'campus', 'location', 'building', 'map', 'where is', 'how to get to', 'where can i find',
    'where are', 'take me to', 'directions to', 'way to', 'located', 'situated',
    
    // Specific locations
    'gate', 'entrance', 'exit', 'main gate', 'library', 'cafeteria', 'parking', 
    'hostel', 'coffee', 'lassi', 'mart', 'department', 'block', 'stadium',
    'administration', 'auditorium', 'court', 'basketball', 'tennis', 'view tube',
    
    // Academic areas
    'pharmacy', 'allied science', 'polytechnic', 'aigs', 'cprd',
    
    // Opening hours and timings
    'opening', 'closing', 'hours', 'timings', 'when does', 'open', 'close', 'time'
  ]
};

export class ClassifierService {
  // This is a simplified classifier model
  // In a production environment, you would use a proper ML model
  // trained on labeled data with more sophisticated features

  /**
   * Classifies a query as either database-related or general knowledge
   * @param query The user's query text
   * @returns Classification result indicating type, confidence, and extracted info
   */
  classifyQuery(query: string): ClassificationResult {
    const normalizedQuery = query.toLowerCase();
    
    // Count matches with database keywords
    let databaseKeywordMatches = 0;
    for (const keyword of DATABASE_KEYWORDS) {
      if (normalizedQuery.includes(keyword)) {
        databaseKeywordMatches++;
      }
    }
    
    // Calculate confidence based on keyword matches
    const totalKeywords = DATABASE_KEYWORDS.length;
    const confidence = Math.min(databaseKeywordMatches * 0.15, 0.95); // Cap at 95%
    
    // Determine category and extract info if database query
    if (confidence > 0.3) {
      const category = this.determineCategory(normalizedQuery);
      const extractedInfo = this.extractRelevantInfo(normalizedQuery, category);
      
      return {
        type: QueryType.DATABASE,
        confidence,
        category,
        extractedInfo
      };
    }
    
    return {
      type: QueryType.LLM,
      confidence: 1 - confidence,
    };
  }
  
  /**
   * Determines the specific category of a database query
   */
  private determineCategory(query: string): string {
    for (const [category, keywords] of Object.entries(QUERY_CATEGORIES)) {
      for (const keyword of keywords) {
        if (query.includes(keyword)) {
          return category;
        }
      }
    }
    return 'UNKNOWN';
  }
  
  /**
   * Extracts relevant information from the query based on its category
   */
  private extractRelevantInfo(query: string, category: string): Record<string, any> {
    const extractedInfo: Record<string, any> = {};
    
    // Try to get student ID from localStorage if available
    // (this would come from AuthContext in components)
    try {
      const studentId = localStorage.getItem('studentId');
      if (studentId) {
        extractedInfo.studentId = studentId;
      } else {
        // Default ID as fallback
        extractedInfo.studentId = '12345';
      }
    } catch (error) {
      // In case localStorage is not available (e.g., in SSR contexts)
      extractedInfo.studentId = '12345';
    }
    
    // Extract course ID if present (e.g., "CS101", "MATH201")
    const courseIdMatch = query.match(/\b([A-Z]{2,4})\s*(\d{3})\b/i);
    if (courseIdMatch) {
      extractedInfo.courseId = courseIdMatch[0].replace(/\s+/g, '');
    }
    
    // Extract assignment number/ID if present
    const assignmentMatch = query.match(/assignment\s*(\d+)/i);
    if (assignmentMatch) {
      extractedInfo.assignmentId = assignmentMatch[1];
    }
    
    // Extract schedule-specific information if the category is SCHEDULE
    if (category === 'SCHEDULE') {
      const normalizedQuery = query.toLowerCase();
      
      // Check for "today" or "today's" in the query
      if (normalizedQuery.includes('today') || normalizedQuery.includes('today\'s') || 
          normalizedQuery.includes('todays') || normalizedQuery.match(/today[''s]/)) {
        extractedInfo.dayFilter = 'today';
        console.log('Setting day filter to "today" from query:', query);
      }
      
      // Check for specific days of the week
      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      for (const day of daysOfWeek) {
        if (normalizedQuery.includes(day)) {
          extractedInfo.dayFilter = day;
          console.log(`Setting day filter to "${day}" from query:`, query);
          break;
        }
      }
      
      // Check for "tomorrow" in the query
      if (normalizedQuery.includes('tomorrow')) {
        extractedInfo.dayFilter = 'tomorrow';
        console.log('Setting day filter to "tomorrow" from query:', query);
      }
      
      // Add more pattern matching for schedule questions
      if (normalizedQuery.includes('class today') || normalizedQuery.includes('classes today') ||
          normalizedQuery.includes('today\'s class') || normalizedQuery.includes('today\'s classes') ||
          normalizedQuery.includes('todays class') || normalizedQuery.includes('todays classes')) {
        extractedInfo.dayFilter = 'today';
        console.log('Setting day filter to "today" from class today pattern:', query);
      }
    }
    
    // Extract location information if the category is LOCATION
    if (category === 'LOCATION') {
      // Try to extract specific location names
      const locationPatterns = [
        // Gates with numbers
        { regex: /gate\s*(\d+|main)/i, key: 'gateName' },
        
        // Building and facility names
        { 
          regex: /(main gate|gate \d|administration|auditorium|student affairs|library|cafeteria|hostel|parking|stadium|coffee|lassi|campus mart|pharmacy|allied science|polytechnic|aigs|cprd|basketball|tennis|view tube|green forest|lake|water treatment)/i, 
          key: 'buildingName' 
        },
        
        // Location types
        { regex: /(entrance|exit|building|department|block|gate|court|shop|store|cafe)/i, key: 'locationType' },
        
        // Query types
        { regex: /(open|close|timing|hour|time)/i, key: 'queryType', value: 'hours' },
        { regex: /(where|location|find|direction|how to get|way to)/i, key: 'queryType', value: 'location' },
        { regex: /(near|nearby|close to|adjacent)/i, key: 'queryType', value: 'nearby' },
      ];
      
      locationPatterns.forEach(pattern => {
        const match = query.match(pattern.regex);
        if (match) {
          if (pattern.value) {
            extractedInfo[pattern.key] = pattern.value;
          } else {
            extractedInfo[pattern.key] = match[1].toLowerCase();
          }
        }
      });
    }
    
    return extractedInfo;
  }
}

// Singleton instance
export const classifierService = new ClassifierService();
export { QueryType }; 