import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockDb, Assignment } from '../lib/mockDb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BadgeCheck, Clock, FileText, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AddReminderButton from '@/components/AddReminderButton';

const Assignments = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  
  useEffect(() => {
    console.log("Current User in Assignments:", currentUser);
    
    if (currentUser) {
      // Fetch student name
      const student = mockDb.students.find(s => s.student_id === currentUser.student_id);
      if (student) {
        setStudentName(student.name);
      }
      
      // Fetch all assignments for the current student
      const allAssignments = mockDb.getStudentAssignments(currentUser.student_id);
      console.log("Retrieved Assignments:", allAssignments);
      
      // Apply search filter if provided
      if (searchQuery) {
        const filteredAssignments = allAssignments.filter(
          assignment => 
            assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.course_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setAssignments(filteredAssignments);
      } else {
        setAssignments(allAssignments);
      }
      
      setLoading(false);
    }
  }, [currentUser, searchQuery]);

  // Group assignments by status
  const pending = assignments.filter(a => a.status === 'pending');
  const submitted = assignments.filter(a => a.status === 'submitted');
  const graded = assignments.filter(a => a.status === 'graded');
  
  console.log("Assignments by status:", { 
    pending: pending.length, 
    submitted: submitted.length, 
    graded: graded.length,
    total: assignments.length
  });

  // Sort assignments by due date
  const sortByDueDate = (a: Assignment, b: Assignment) => 
    new Date(a.due_date).getTime() - new Date(b.due_date).getTime();

  pending.sort(sortByDueDate);
  submitted.sort(sortByDueDate);
  graded.sort(sortByDueDate);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-college-gold"></div>
      </div>
    );
  }

  // Render an assignment card
  const renderAssignment = (assignment: Assignment) => (
    <div 
      key={assignment.assignment_id} 
      className="p-4 rounded bg-black border border-college-gold/20 hover:bg-college-gold/5"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-college-gold">{assignment.title}</h3>
          <p className="text-sm text-white/70 mt-1">{assignment.course_name}</p>
          <p className="text-sm mt-2 text-white/90">{assignment.description}</p>
          
          <div className="flex items-center mt-3 text-white/70">
            <Clock className="h-4 w-4 mr-2 text-college-gold/80" />
            <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
          </div>

          <div className="mt-3">
            <AddReminderButton 
              title={`${assignment.title} Due`}
              description={`Assignment for ${assignment.course_name} - ${studentName}: ${assignment.description}`}
              date={assignment.due_date}
            />
          </div>
        </div>
        
        <Badge 
          className={`
            ${assignment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' : 
              assignment.status === 'submitted' ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 
              'bg-green-500/20 text-green-300 hover:bg-green-500/30'}
          `}
        >
          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">View and manage all your course assignments</p>
      </div>
      
      {searchQuery && (
        <Card className="bg-black border-college-gold/20">
          <CardContent className="pt-6">
            <p className="text-white">
              Search results for: <span className="text-college-gold font-medium">"{searchQuery}"</span>
            </p>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-black text-white border border-college-gold/20">
          <TabsTrigger 
            value="pending"
            className="data-[state=active]:bg-college-gold data-[state=active]:text-black flex items-center"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger 
            value="submitted"
            className="data-[state=active]:bg-college-gold data-[state=active]:text-black flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Submitted ({submitted.length})
          </TabsTrigger>
          <TabsTrigger 
            value="graded"
            className="data-[state=active]:bg-college-gold data-[state=active]:text-black flex items-center"
          >
            <BadgeCheck className="h-4 w-4 mr-2" />
            Graded ({graded.length})
          </TabsTrigger>
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-college-gold data-[state=active]:text-black"
          >
            All ({assignments.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-4">
          <Card className="bg-black text-white border-college-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-yellow-300" />
                Pending Assignments
              </CardTitle>
              <CardDescription className="text-white/70">
                Assignments that require your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pending.length > 0 ? (
                <div className="space-y-4">
                  {pending.map(renderAssignment)}
                </div>
              ) : (
                <p className="text-white/70">No pending assignments.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submitted" className="mt-4">
          <Card className="bg-black text-white border-college-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-300" />
                Submitted Assignments
              </CardTitle>
              <CardDescription className="text-white/70">
                Assignments you have submitted and are awaiting grades
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted.length > 0 ? (
                <div className="space-y-4">
                  {submitted.map(renderAssignment)}
                </div>
              ) : (
                <p className="text-white/70">No submitted assignments.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="graded" className="mt-4">
          <Card className="bg-black text-white border-college-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BadgeCheck className="h-5 w-5 mr-2 text-green-300" />
                Graded Assignments
              </CardTitle>
              <CardDescription className="text-white/70">
                Assignments that have been graded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {graded.length > 0 ? (
                <div className="space-y-4">
                  {graded.map(renderAssignment)}
                </div>
              ) : (
                <p className="text-white/70">No graded assignments.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          <Card className="bg-black text-white border-college-gold/20">
            <CardHeader>
              <CardTitle>All Assignments</CardTitle>
              <CardDescription className="text-white/70">
                Complete list of all your assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.sort(sortByDueDate).map(renderAssignment)}
                </div>
              ) : (
                <p className="text-white/70">No assignments found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assignments;
