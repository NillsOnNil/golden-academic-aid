
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
  
  // Generate 10 mock students
  for (let i = 1; i <= 10; i++) {
    const studentNum = i.toString().padStart(3, '0');
    const studentId = `AGS22BCDS${studentNum}`;
    
    students.push({
      student_id: studentId,
      name: `Student ${i}`,
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
  
  // Generate classes for 10 students
  for (let i = 1; i <= 10; i++) {
    const studentNum = i.toString().padStart(3, '0');
    const studentId = `AGS22BCDS${studentNum}`;
    
    // Each student has 4-5 classes
    const numClasses = 4 + Math.floor(Math.random() * 2);
    
    for (let j = 0; j < numClasses; j++) {
      const classId = `CS${(100 + j).toString()}${i}`;
      const subjectIndex = (i + j) % subjects.length;
      
      // Create morning and afternoon classes
      const hour = 9 + (j * 2);
      const startTime = `${hour}:00`;
      const endTime = `${hour + 1}:30`;
      
      classes.push({
        class_id: classId,
        course_name: subjects[subjectIndex],
        start_time: startTime,
        end_time: endTime,
        location: locations[j % locations.length],
        student_id: studentId
      });
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
    return mockDb.classes.filter(c => c.student_id === studentId);
  },
  
  getStudentAssignments: (studentId: string): Assignment[] => {
    return mockDb.assignments.filter(a => a.student_id === studentId);
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
