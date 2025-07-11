// Mock database for the College ERP system
// This module simulates database interactions that would be replaced by real API calls in production

import bcrypt from 'bcryptjs';

// Types for our database models
export interface Student {
  student_id: string;
  name: string;
  email: string;
  password: string; // Hashed password
}

export interface Class {
  class_id: string;
  course_name: string;
  start_time: string;
  end_time: string;
  location: string;
  student_id: string;
  day: string; // Day of the week
}

export interface Assignment {
  assignment_id: string;
  title: string;
  due_date: string;
  description: string;
  student_id: string;
  course_name: string;
  status: 'pending' | 'submitted' | 'graded';
}

export interface StudyMaterial {
  material_id: string;
  subject: string;
  title: string;
  description: string;
  url: string;
}

export interface Reminder {
  reminder_id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  student_id: string;
}

// Generate mock student data
const generateStudents = (): Student[] => {
  const students: Student[] = [];
  
  // List of Indian student names
  const indianNames = [
    "Arjun Sharma",
    "Priya Patel",
    "Vikram Singh",
    "Neha Gupta",
    "Rahul Verma",
    "Ananya Desai",
    "Aditya Kumar",
    "Kavya Reddy",
    "Rohan Joshi",
    "Ishaan Mehta",
    "Divya Malhotra",
    "Rishi Choudhury",
    "Nisha Kapoor",
    "Aryan Bose",
    "Meera Iyer"
  ];
  
  // Generate students with student IDs from AGS22BCDS001 to AGS22BCDS015
  for (let i = 1; i <= 15; i++) {
    const studentNum = i.toString().padStart(3, '0');
    const studentId = `AGS22BCDS${studentNum}`;
    
    students.push({
      student_id: studentId,
      name: indianNames[i - 1],
      email: `${studentId.toLowerCase()}@college.edu`,
      password: bcrypt.hashSync('password123', 10), // All students have the same password for demo
    });
  }
  
  return students;
};

// Generate mock class data
const generateClasses = (): Class[] => {
  const classes: Class[] = [];
  const subjects = [
    'Introduction to Computer Science',
    'Data Structures and Algorithms',
    'Database Management Systems',
    'Web Development',
    'Artificial Intelligence',
    'Machine Learning',
    'Computer Networks',
    'Operating Systems',
    'Software Engineering',
    'Cloud Computing'
  ];
  
  const locations = [
    'Main Building - Room 101',
    'Computer Science Block - Lab 2',
    'Technology Center - Room 305',
    'Engineering Block - Room 205',
    'Science Hall - Room 405'
  ];
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Generate classes for 10 students
  for (let i = 1; i <= 10; i++) {
    const studentNum = i.toString().padStart(3, '0');
    const studentId = `AGS22BCDS${studentNum}`;
    
    // Each student has classes distributed throughout the week
    for (let dayIndex = 0; dayIndex < daysOfWeek.length; dayIndex++) {
      const day = daysOfWeek[dayIndex];
      
      // Add 1-2 classes per day to make it more realistic
      const classesPerDay = 1 + Math.floor(Math.random() * 2);
      
      for (let j = 0; j < classesPerDay; j++) {
        const classId = `${day.substring(0, 3)}${j+1}_${i}`;
        const subjectIndex = (dayIndex * 2 + j + i) % subjects.length;
        
        // Create morning or afternoon classes
        const hourOffset = j * 3; // Space them out by 3 hours
        const hour = 9 + hourOffset;
        const startTime = `${hour}:00`;
        const endTime = `${hour + 1}:30`;
        
        classes.push({
          class_id: classId,
          course_name: subjects[subjectIndex],
          start_time: startTime,
          end_time: endTime,
          location: locations[(dayIndex + j) % locations.length],
          student_id: studentId,
          day: day
        });
      }
    }
  }
  
  return classes;
};

// Generate mock assignment data
const generateAssignments = (): Assignment[] => {
  const assignments: Assignment[] = [];
  const subjects = [
    'Introduction to Computer Science',
    'Data Structures and Algorithms',
    'Database Management Systems',
    'Web Development',
    'Artificial Intelligence',
    'Machine Learning',
    'Computer Networks',
    'Operating Systems',
    'Software Engineering',
    'Cloud Computing'
  ];
  
  // Generate assignments for 10 students
  for (let i = 1; i <= 10; i++) {
    const studentNum = i.toString().padStart(3, '0');
    const studentId = `AGS22BCDS${studentNum}`;
    
    // Each student has 5-8 assignments
    const numAssignments = 5 + Math.floor(Math.random() * 4);
    
    for (let j = 0; j < numAssignments; j++) {
      const assignmentId = `ASG${(100 + j).toString()}${i}`;
      const subjectIndex = (i + j) % subjects.length;
      
      // Due dates spread over next 14 days
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (j * 2) + Math.floor(Math.random() * 3));
      
      const status = j < 2 ? 'submitted' : j < 4 ? 'graded' : 'pending';
      
      assignments.push({
        assignment_id: assignmentId,
        title: `${subjects[subjectIndex]} - Assignment ${j + 1}`,
        due_date: dueDate.toISOString().split('T')[0],
        description: `Complete the assignment on ${subjects[subjectIndex]} topics covered in class.`,
        student_id: studentId,
        course_name: subjects[subjectIndex],
        status: status as 'pending' | 'submitted' | 'graded'
      });
    }
  }
  
  return assignments;
};

// Generate mock study material data
const generateStudyMaterials = (): StudyMaterial[] => {
  const materials: StudyMaterial[] = [];
  const subjects = [
    'Computer Science',
    'Data Structures',
    'Databases',
    'Web Development',
    'Artificial Intelligence',
    'Machine Learning',
    'Computer Networks',
    'Operating Systems',
    'Software Engineering',
    'Cloud Computing'
  ];
  
  // Generate 30 study materials
  for (let i = 0; i < 30; i++) {
    const materialId = `MAT${(100 + i).toString()}`;
    const subjectIndex = i % subjects.length;
    
    materials.push({
      material_id: materialId,
      subject: subjects[subjectIndex],
      title: `${subjects[subjectIndex]} - Study Resource ${Math.floor(i / subjects.length) + 1}`,
      description: `Comprehensive study material for ${subjects[subjectIndex]}.`,
      url: `https://example.com/materials/${materialId}.pdf`
    });
  }
  
  return materials;
};

// Generate mock reminder data
const generateReminders = (): Reminder[] => {
  const reminders: Reminder[] = [];
  
  // Generate reminders for 10 students
  for (let i = 1; i <= 10; i++) {
    const studentNum = i.toString().padStart(3, '0');
    const studentId = `AGS22BCDS${studentNum}`;
    
    // Each student has 3-5 reminders
    const numReminders = 3 + Math.floor(Math.random() * 3);
    
    for (let j = 0; j < numReminders; j++) {
      const reminderId = `REM${(100 + j).toString()}${i}`;
      
      // Dates spread over next 10 days
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + j + Math.floor(Math.random() * 5));
      
      const hour = 8 + Math.floor(Math.random() * 10);
      const minute = Math.floor(Math.random() * 60);
      const reminderTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      reminders.push({
        reminder_id: reminderId,
        title: `Reminder ${j + 1}`,
        date: reminderDate.toISOString().split('T')[0],
        time: reminderTime,
        description: `Important reminder for student activities.`,
        student_id: studentId
      });
    }
  }
  
  return reminders;
};

// Create mock database
export const mockDb = {
  students: generateStudents(),
  classes: generateClasses(),
  assignments: generateAssignments(),
  studyMaterials: generateStudyMaterials(),
  reminders: generateReminders(),
  
  // Authentication methods
  authenticate: (studentId: string, password: string): Student | null => {
    const student = mockDb.students.find(s => s.student_id === studentId);
    
    if (student && bcrypt.compareSync(password, student.password)) {
      // Return student without password
      const { password, ...studentWithoutPassword } = student;
      return studentWithoutPassword as Student;
    }
    
    return null;
  },
  
  // Data retrieval methods
  getStudentClasses: (studentId: string): Class[] => {
    console.log("Generating class schedule for student ID:", studentId);
    
    // Always generate a fixed schedule with 6 classes per day
    const defaultClasses = [];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Subjects - ensure there are at least 30 subjects (for 5 days × 6 classes)
    const subjects = [
      'Introduction to Computer Science',
      'Data Structures and Algorithms',
      'Database Management Systems',
      'Web Development',
      'Artificial Intelligence',
      'Machine Learning',
      'Computer Networks',
      'Operating Systems',
      'Software Engineering',
      'Cloud Computing',
      'Mobile App Development',
      'Cybersecurity Fundamentals',
      'Advanced Programming',
      'Theory of Computation',
      'Human-Computer Interaction',
      'Distributed Systems',
      'Computer Graphics',
      'Natural Language Processing',
      'Information Retrieval',
      'Big Data Analytics',
      'Blockchain Technology',
      'Internet of Things',
      'Quantum Computing',
      'Embedded Systems',
      'Robotics',
      'Virtual Reality Systems',
      'Computer Vision',
      'Ethical Hacking',
      'Digital Logic Design',
      'Advanced Mathematics for CS'
    ];
    
    const locations = [
      'Main Building - Room 101',
      'Computer Science Block - Lab 2',
      'Technology Center - Room 305',
      'Engineering Block - Room 205',
      'Science Hall - Room 405',
      'New Academic Building - Room 202'
    ];
    
    // Generate exactly 6 classes for each day of the week
    daysOfWeek.forEach((day, dayIndex) => {
      for (let classIndex = 0; classIndex < 6; classIndex++) {
        const classId = `${day.substring(0, 3)}${classIndex + 1}`;
        const subjectIndex = dayIndex * 6 + classIndex;
        
        // Create classes throughout the day
        const hour = 8 + classIndex; // Start at 8 AM
        const startTime = `${hour}:00`;
        const endTime = `${hour}:50`;
        
        defaultClasses.push({
          class_id: classId,
          course_name: subjects[subjectIndex % subjects.length],
          start_time: startTime,
          end_time: endTime,
          location: locations[classIndex % locations.length],
          student_id: studentId,
          day: day
        });
      }
    });
    
    return defaultClasses;
  },
  
  getStudentAssignments: (studentId: string): Assignment[] => {
    const assignments = mockDb.assignments.filter(a => a.student_id === studentId);
    
    // If no assignments found for this student, return some default assignments
    if (assignments.length === 0) {
      console.log("No assignments found for student ID:", studentId);
      
      // Generate some default assignments for this student
      const defaultAssignments = [];
      const subjects = [
        'Introduction to Computer Science',
        'Data Structures and Algorithms',
        'Database Management Systems',
        'Web Development',
        'Artificial Intelligence'
      ];
      
      // Create assignments with different statuses
      const now = new Date();
      
      for (let j = 0; j < 5; j++) {
        const assignmentId = `ASG${(100 + j).toString()}`;
        
        // Set due dates spread across next 10 days
        const dueDate = new Date();
        dueDate.setDate(now.getDate() + j * 2);
        
        // Different statuses based on index
        const status = j < 2 ? 'pending' : j < 4 ? 'submitted' : 'graded';
        
        defaultAssignments.push({
          assignment_id: assignmentId,
          title: `${subjects[j]} - Assignment ${j + 1}`,
          due_date: dueDate.toISOString().split('T')[0],
          description: `Complete the assignment on ${subjects[j]} topics covered in class.`,
          student_id: studentId,
          course_name: subjects[j],
          status: status as 'pending' | 'submitted' | 'graded'
        });
      }
      
      return defaultAssignments;
    }
    
    return assignments;
  },
  
  getStudyMaterialsBySubject: (subject: string): StudyMaterial[] => {
    if (!subject) {
      return mockDb.studyMaterials;
    }
    return mockDb.studyMaterials.filter(
      m => m.subject.toLowerCase().includes(subject.toLowerCase())
    );
  },
  
  getStudentReminders: (studentId: string): Reminder[] => {
    return mockDb.reminders.filter(r => r.student_id === studentId);
  },
  
  // Data mutation methods
  addReminder: (reminder: Omit<Reminder, 'reminder_id'>): Reminder => {
    const newReminder = {
      ...reminder,
      reminder_id: `REM${mockDb.reminders.length + 100}`
    };
    
    mockDb.reminders.push(newReminder);
    return newReminder;
  },
  
  deleteReminder: (reminderId: string): boolean => {
    const initialLength = mockDb.reminders.length;
    mockDb.reminders = mockDb.reminders.filter(r => r.reminder_id !== reminderId);
    return initialLength > mockDb.reminders.length;
  }
};
