// Database configuration
// Replace these with your actual database credentials and connection details
const DB_CONFIG = {
  host: 'your-db-host',
  user: 'your-db-user',
  password: 'your-db-password',
  database: 'college_db'
};

// Types for database operations
export interface StudentInfo {
  id: string;
  name: string;
  email: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: Date;
  description: string;
}

export interface Schedule {
  id: string;
  courseId: string;
  courseName: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: Date;
  time: string;
  description: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  type: string;
  description: string;
  openingHours?: string;
  nearbyPlaces?: string[];
}

// This is a mock implementation. Replace with actual database connection and queries.
export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {
    // In a real implementation, you would initialize your database connection here
    console.log('Initializing database connection');
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Get student information
  async getStudentInfo(studentId: string): Promise<StudentInfo | null> {
    // Mock implementation - replace with actual database query
    console.log(`Fetching student info for ID: ${studentId}`);
    return {
      id: studentId,
      name: 'John Doe',
      email: `student${studentId}@college.edu`
    };
  }

  // Get student's course schedule
  async getStudentSchedule(studentId: string): Promise<Schedule[]> {
    // Mock implementation - replace with actual database query
    console.log(`Fetching schedule for student ID: ${studentId}`);
    return [
      // Monday classes
      {
        id: '1',
        courseId: 'CS101',
        courseName: 'Introduction to Computer Science',
        day: 'Monday',
        startTime: '9:00 AM',
        endTime: '10:00 AM',
        location: 'Building A, Room 101'
      },
      {
        id: '2',
        courseId: 'MATH201',
        courseName: 'Calculus II',
        day: 'Monday',
        startTime: '10:15 AM',
        endTime: '11:15 AM',
        location: 'Building B, Room 203'
      },
      {
        id: '3',
        courseId: 'PHY101',
        courseName: 'Physics I',
        day: 'Monday',
        startTime: '11:30 AM',
        endTime: '12:30 PM',
        location: 'Science Block, Room 105'
      },
      {
        id: '4',
        courseId: 'CHEM101',
        courseName: 'General Chemistry',
        day: 'Monday',
        startTime: '1:30 PM',
        endTime: '2:30 PM',
        location: 'Science Block, Lab 202'
      },
      {
        id: '5',
        courseId: 'ENG101',
        courseName: 'Technical Communication',
        day: 'Monday',
        startTime: '2:45 PM',
        endTime: '3:45 PM',
        location: 'Humanities Block, Room 304'
      },
      {
        id: '6',
        courseId: 'CS102',
        courseName: 'Programming Lab',
        day: 'Monday',
        startTime: '4:00 PM',
        endTime: '5:30 PM',
        location: 'Computer Lab 1, Building A'
      },
      
      // Tuesday classes
      {
        id: '7',
        courseId: 'MATH202',
        courseName: 'Differential Equations',
        day: 'Tuesday',
        startTime: '9:00 AM',
        endTime: '10:00 AM',
        location: 'Building B, Room 205'
      },
      {
        id: '8',
        courseId: 'CS201',
        courseName: 'Data Structures',
        day: 'Tuesday',
        startTime: '10:15 AM',
        endTime: '11:15 AM',
        location: 'Building A, Room 102'
      },
      {
        id: '9',
        courseId: 'PHY102',
        courseName: 'Physics II',
        day: 'Tuesday',
        startTime: '11:30 AM',
        endTime: '12:30 PM',
        location: 'Science Block, Room 106'
      },
      {
        id: '10',
        courseId: 'CHEM102',
        courseName: 'Organic Chemistry',
        day: 'Tuesday',
        startTime: '1:30 PM',
        endTime: '2:30 PM',
        location: 'Science Block, Lab 203'
      },
      {
        id: '11',
        courseId: 'SOC101',
        courseName: 'Sociology',
        day: 'Tuesday',
        startTime: '2:45 PM',
        endTime: '3:45 PM',
        location: 'Humanities Block, Room 305'
      },
      {
        id: '12',
        courseId: 'CS202',
        courseName: 'Algorithms Lab',
        day: 'Tuesday',
        startTime: '4:00 PM',
        endTime: '5:30 PM',
        location: 'Computer Lab 2, Building A'
      },
      
      // Wednesday classes
      {
        id: '13',
        courseId: 'CS301',
        courseName: 'Database Systems',
        day: 'Wednesday',
        startTime: '9:00 AM',
        endTime: '10:00 AM',
        location: 'Building A, Room 103'
      },
      {
        id: '14',
        courseId: 'MATH301',
        courseName: 'Linear Algebra',
        day: 'Wednesday',
        startTime: '10:15 AM',
        endTime: '11:15 AM',
        location: 'Building B, Room 206'
      },
      {
        id: '15',
        courseId: 'ELEC101',
        courseName: 'Basic Electronics',
        day: 'Wednesday',
        startTime: '11:30 AM',
        endTime: '12:30 PM',
        location: 'Electronics Block, Room 101'
      },
      {
        id: '16',
        courseId: 'CS302',
        courseName: 'Operating Systems',
        day: 'Wednesday',
        startTime: '1:30 PM',
        endTime: '2:30 PM',
        location: 'Building A, Room 104'
      },
      {
        id: '17',
        courseId: 'PSY101',
        courseName: 'Psychology',
        day: 'Wednesday',
        startTime: '2:45 PM',
        endTime: '3:45 PM',
        location: 'Humanities Block, Room 306'
      },
      {
        id: '18',
        courseId: 'ELEC102',
        courseName: 'Digital Electronics Lab',
        day: 'Wednesday',
        startTime: '4:00 PM',
        endTime: '5:30 PM',
        location: 'Electronics Lab 1'
      },
      
      // Thursday classes
      {
        id: '19',
        courseId: 'CS401',
        courseName: 'Computer Networks',
        day: 'Thursday',
        startTime: '9:00 AM',
        endTime: '10:00 AM',
        location: 'Building A, Room 105'
      },
      {
        id: '20',
        courseId: 'MATH401',
        courseName: 'Probability and Statistics',
        day: 'Thursday',
        startTime: '10:15 AM',
        endTime: '11:15 AM',
        location: 'Building B, Room 207'
      },
      {
        id: '21',
        courseId: 'CS402',
        courseName: 'Software Engineering',
        day: 'Thursday',
        startTime: '11:30 AM',
        endTime: '12:30 PM',
        location: 'Building A, Room 106'
      },
      {
        id: '22',
        courseId: 'CS403',
        courseName: 'Artificial Intelligence',
        day: 'Thursday',
        startTime: '1:30 PM',
        endTime: '2:30 PM',
        location: 'Building A, Room 107'
      },
      {
        id: '23',
        courseId: 'ECO101',
        courseName: 'Economics',
        day: 'Thursday',
        startTime: '2:45 PM',
        endTime: '3:45 PM',
        location: 'Humanities Block, Room 307'
      },
      {
        id: '24',
        courseId: 'CS404',
        courseName: 'Web Development Lab',
        day: 'Thursday',
        startTime: '4:00 PM',
        endTime: '5:30 PM',
        location: 'Computer Lab 3, Building A'
      },
      
      // Friday classes
      {
        id: '25',
        courseId: 'CS501',
        courseName: 'Cybersecurity',
        day: 'Friday',
        startTime: '9:00 AM',
        endTime: '10:00 AM',
        location: 'Building A, Room 108'
      },
      {
        id: '26',
        courseId: 'MATH501',
        courseName: 'Numerical Methods',
        day: 'Friday',
        startTime: '10:15 AM',
        endTime: '11:15 AM',
        location: 'Building B, Room 208'
      },
      {
        id: '27',
        courseId: 'CS502',
        courseName: 'Machine Learning',
        day: 'Friday',
        startTime: '11:30 AM',
        endTime: '12:30 PM',
        location: 'Building A, Room 109'
      },
      {
        id: '28',
        courseId: 'CS503',
        courseName: 'Cloud Computing',
        day: 'Friday',
        startTime: '1:30 PM',
        endTime: '2:30 PM',
        location: 'Building A, Room 110'
      },
      {
        id: '29',
        courseId: 'MGMT101',
        courseName: 'Principles of Management',
        day: 'Friday',
        startTime: '2:45 PM',
        endTime: '3:45 PM',
        location: 'Humanities Block, Room 308'
      },
      {
        id: '30',
        courseId: 'CS504',
        courseName: 'Project Work',
        day: 'Friday',
        startTime: '4:00 PM',
        endTime: '5:30 PM',
        location: 'Project Lab, Building A'
      }
    ];
  }

  // Get student's assignments
  async getStudentAssignments(studentId: string): Promise<Assignment[]> {
    // Mock implementation - replace with actual database query
    console.log(`Fetching assignments for student ID: ${studentId}`);
    return [
      {
        id: '1',
        title: 'Programming Assignment 1',
        courseId: 'CS101',
        courseName: 'Introduction to Computer Science',
        dueDate: new Date('2024-12-15'),
        description: 'Implement a simple sorting algorithm'
      },
      {
        id: '2',
        title: 'Problem Set 3',
        courseId: 'MATH201',
        courseName: 'Calculus II',
        dueDate: new Date('2024-12-10'),
        description: 'Solve integration problems from Chapter 5'
      }
    ];
  }

  // Get student's courses
  async getStudentCourses(studentId: string): Promise<Course[]> {
    // Mock implementation - replace with actual database query
    console.log(`Fetching courses for student ID: ${studentId}`);
    return [
      {
        id: '1',
        name: 'Introduction to Computer Science',
        code: 'CS101',
        instructor: 'Dr. Smith',
        credits: 3
      },
      {
        id: '2',
        name: 'Calculus II',
        code: 'MATH201',
        instructor: 'Dr. Johnson',
        credits: 4
      }
    ];
  }

  // Get detailed information about a specific assignment
  async getAssignmentDetails(assignmentId: string): Promise<Assignment | null> {
    // Mock implementation - replace with actual database query
    console.log(`Fetching details for assignment ID: ${assignmentId}`);
    return {
      id: assignmentId,
      title: 'Programming Assignment 1',
      courseId: 'CS101',
      courseName: 'Introduction to Computer Science',
      dueDate: new Date('2024-12-15'),
      description: 'Implement a simple sorting algorithm using the techniques learned in class. Submit your code and a brief report explaining your implementation approach.'
    };
  }

  // Get student's reminders
  async getStudentReminders(studentId: string): Promise<Reminder[]> {
    // Mock implementation - replace with actual database query
    console.log(`Fetching reminders for student ID: ${studentId}`);
    return [
      {
        id: '1',
        title: 'Study for CS101 Exam',
        date: new Date('2024-12-10'),
        time: '14:00',
        description: 'Review all material from chapters 1-5'
      },
      {
        id: '2',
        title: 'MATH201 Group Meeting',
        date: new Date('2024-12-08'),
        time: '15:30',
        description: 'Meet with study group in library room 302'
      },
      {
        id: '3',
        title: 'Office Hours with Dr. Smith',
        date: new Date('2024-12-09'),
        time: '11:00',
        description: 'Discuss final project requirements'
      }
    ];
  }

  // Get campus location data
  async getCampusLocations(locationName?: string): Promise<CampusLocation[] | CampusLocation | null> {
    console.log(`Fetching campus location data ${locationName ? 'for: ' + locationName : ''}`);
    
    const campusLocations = [
      {
        id: "gate_main",
        name: "Main Gate",
        type: "entrance",
        description: "Located at the main entrance of the campus. This gate opens only twice a day.",
        openingHours: "9 AM and 4 PM only",
        nearbyPlaces: ["Polytechnic", "AIGS", "Pharmacy", "Allied Science"]
      },
      {
        id: "gate_2",
        name: "Gate 2",
        type: "entrance",
        description: "Located near the Pharmacy department and leads to Campus Mart.",
        openingHours: "9 AM to 6 PM",
        nearbyPlaces: ["Pharmacy", "Campus Mart"]
      },
      {
        id: "gate_3",
        name: "Gate 3",
        type: "entrance",
        description: "Located at the back of the campus adjacent to the bike parking area.",
        openingHours: "9 AM to 8 PM",
        nearbyPlaces: ["Two Wheeler Parking"]
      },
      {
        id: "gate_4",
        name: "Gate 4",
        type: "entrance",
        description: "Located at the back of the campus next to the car parking area.",
        openingHours: "9 AM to 8 PM",
        nearbyPlaces: ["Car Parking"]
      },
      {
        id: "gate_5",
        name: "Gate 5",
        type: "entrance",
        description: "Located near the cottage area on the eastern side of campus.",
        openingHours: "9 AM, 12 PM-1:30 PM, and 4 PM only",
        nearbyPlaces: ["Cottage"]
      },
      {
        id: "gate_6",
        name: "Gate 6",
        type: "entrance",
        description: "Located near the hostel on the northern side of campus.",
        openingHours: "9 AM, 12 PM-1:30 PM, and 4 PM only",
        nearbyPlaces: ["Boys Hostel"]
      },
      {
        id: "admin_block",
        name: "Administration Block",
        type: "academic",
        description: "Located at the entrance area of the campus, right next to the Auditorium.",
        nearbyPlaces: ["Auditorium", "Students Affairs/Admissions"]
      },
      {
        id: "auditorium",
        name: "Auditorium",
        type: "academic",
        description: "Located next to the Administration Block near the center of the campus.",
        nearbyPlaces: ["Administration Block"]
      },
      {
        id: "student_affairs",
        name: "Students Affairs/Admissions",
        type: "academic",
        description: "Located inside the Administration Block on the ground floor.",
        nearbyPlaces: ["Administration Block"]
      },
      {
        id: "library",
        name: "Central Library",
        type: "academic",
        description: "Located below Coffee Express. Main library building with study spaces.",
        nearbyPlaces: ["Coffee Express", "Basket Ball Courts"]
      },
      {
        id: "basket_courts",
        name: "Basket Ball Courts",
        type: "sports",
        description: "Located adjacent to the Central Library, near the Volleyball Court.",
        nearbyPlaces: ["Central Library", "Volleyball Court"]
      },
      {
        id: "volleyball_court",
        name: "Volleyball Court",
        type: "sports",
        description: "Located next to the Basketball Courts, near the Stadium.",
        nearbyPlaces: ["Basket Ball Courts", "Stadium"]
      },
      {
        id: "cafeteria",
        name: "Cafeteria",
        type: "food",
        description: "Located near the View Tube in the northern part of the campus.",
        nearbyPlaces: ["View Tube"]
      },
      {
        id: "view_tube",
        name: "View Tube",
        type: "recreation",
        description: "Located between the Cafeteria and Boys Hostel in the northern area.",
        nearbyPlaces: ["Cafeteria", "Boys Hostel"]
      },
      {
        id: "boys_hostel",
        name: "Boys Hostel",
        type: "accommodation",
        description: "Located near Gate 6 in the northern part of the campus.",
        nearbyPlaces: ["Gate 6", "View Tube"]
      },
      {
        id: "green_forest",
        name: "Green Forest",
        type: "natural",
        description: "Located on the western side of the campus, adjacent to the Rain Water Harvested Lake.",
        nearbyPlaces: ["Rain Water Harvested Lake"]
      },
      {
        id: "lake",
        name: "Rain Water Harvested Lake",
        type: "natural",
        description: "Located between the Green Forest and the Stadium on the western side.",
        nearbyPlaces: ["Green Forest", "Stadium"]
      },
      {
        id: "water_plant",
        name: "Water Treatment Plant",
        type: "facility",
        description: "Located at the northwestern corner of the campus, near the Green Forest.",
        nearbyPlaces: ["Green Forest"]
      },
      {
        id: "two_wheeler",
        name: "Two Wheeler Parking",
        type: "parking",
        description: "Located near Gate 3 at the southern part of the campus.",
        nearbyPlaces: ["Gate 3"]
      },
      {
        id: "car_parking",
        name: "Car Parking",
        type: "parking",
        description: "Located near Gate 4 at the southeastern part of the campus.",
        nearbyPlaces: ["Gate 4"]
      },
      {
        id: "stadium",
        name: "Smt. Nagarathnamma Stadium",
        type: "sports",
        description: "Located in the center of the campus, between the Volleyball Court and Rain Water Harvested Lake.",
        nearbyPlaces: ["Volleyball Court", "Rain Water Harvested Lake"]
      },
      {
        id: "lassi_house",
        name: "Lassi House",
        type: "food",
        description: "Located directly behind the CPRD building, popular for refreshing lassi drinks.",
        nearbyPlaces: ["CPRD"]
      },
      {
        id: "coffee_express",
        name: "Coffee Express",
        type: "food",
        description: "Located directly above the Central Library, popular for mojito and coffee.",
        nearbyPlaces: ["Central Library"]
      },
      {
        id: "campus_mart",
        name: "Campus Mart",
        type: "shop",
        description: "Located near Gate 2, which leads to the Pharmacy department.",
        nearbyPlaces: ["Pharmacy", "Gate 2"]
      },
      {
        id: "cprd",
        name: "CPRD",
        type: "academic",
        description: "Located next to the Lassi House, in the eastern part of the campus.",
        nearbyPlaces: ["Lassi House"]
      },
      {
        id: "pharmacy",
        name: "Pharmacy Department",
        type: "academic",
        description: "Located near Gate 2, beside the Allied Science building.",
        nearbyPlaces: ["Allied Science", "Gate 2", "Campus Mart"]
      },
      {
        id: "allied_science",
        name: "Allied Science",
        type: "academic",
        description: "Located next to the Pharmacy Department, accessible from the Main Gate.",
        nearbyPlaces: ["Pharmacy", "Main Gate"]
      },
      {
        id: "polytechnic",
        name: "Polytechnic",
        type: "academic",
        description: "Located near the Main Gate, on the path branching left from the entrance.",
        nearbyPlaces: ["Main Gate", "AIGS"]
      },
      {
        id: "aigs",
        name: "AIGS",
        type: "academic",
        description: "Located next to the Polytechnic building, accessible from the Main Gate.",
        nearbyPlaces: ["Polytechnic", "Main Gate"]
      }
    ];
    
    if (locationName) {
      const normalizedName = locationName.toLowerCase();
      const location = campusLocations.find(location => 
        location.name.toLowerCase().includes(normalizedName) || 
        location.id.toLowerCase().includes(normalizedName)
      );
      return location || null;
    }
    
    return campusLocations;
  }

  // Custom query method for more complex queries
  async executeCustomQuery(query: string, params: any[]): Promise<any> {
    // This would be an actual database query in a real implementation
    console.log(`Executing custom query: ${query}`, params);
    return { message: 'Query executed successfully' };
  }
}

// Export a singleton instance
export const databaseService = DatabaseService.getInstance(); 