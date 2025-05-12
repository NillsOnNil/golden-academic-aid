
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockDb, Class, Assignment } from '../lib/mockDb';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Clock, Calendar, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [todayClasses, setTodayClasses] = useState<Class[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // Fetch today's classes
      const classes = mockDb.getStudentClasses(currentUser.student_id);
      setTodayClasses(classes.slice(0, 3)); // Limit to 3 for demonstration
      
      // Fetch upcoming assignments
      const assignments = mockDb.getStudentAssignments(currentUser.student_id);
      // Sort by due date
      const sortedAssignments = [...assignments].sort((a, b) => 
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      );
      setUpcomingAssignments(sortedAssignments.slice(0, 3)); // Limit to 3
      
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-college-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-black rounded-lg p-6 border border-college-gold/20">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {currentUser?.name}
        </h1>
        <p className="text-white/70">
          Student ID: <span className="text-college-gold">{currentUser?.student_id}</span>
        </p>
      </div>

      {/* Quick search */}
      <Card className="bg-black border-college-gold/20">
        <CardHeader>
          <CardTitle className="text-white">How can we help you today?</CardTitle>
          <CardDescription className="text-white/70">
            Search for information or ask any question
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button 
              variant="outline" 
              className="justify-start text-white border-college-gold/30 hover:bg-college-gold/10"
              onClick={() => navigate('/dashboard/classes')}
            >
              <Calendar className="mr-2 h-4 w-4 text-college-gold" />
              View my class schedule
            </Button>
            <Button 
              variant="outline" 
              className="justify-start text-white border-college-gold/30 hover:bg-college-gold/10"
              onClick={() => navigate('/dashboard/assignments')}
            >
              <FileText className="mr-2 h-4 w-4 text-college-gold" />
              Check my assignments
            </Button>
            <Button 
              variant="outline" 
              className="justify-start text-white border-college-gold/30 hover:bg-college-gold/10"
              onClick={() => navigate('/dashboard/study-materials')}
            >
              <BookOpen className="mr-2 h-4 w-4 text-college-gold" />
              Browse study materials
            </Button>
            <Button 
              variant="outline" 
              className="justify-start text-white border-college-gold/30 hover:bg-college-gold/10"
              onClick={() => navigate('/dashboard/assistant')}
            >
              <Clock className="mr-2 h-4 w-4 text-college-gold" />
              Ask the AI assistant
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's classes */}
        <Card className="bg-black text-white border-college-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-college-gold" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayClasses.length > 0 ? (
              <div className="space-y-4">
                {todayClasses.map((classItem) => (
                  <div 
                    key={classItem.class_id} 
                    className="p-3 rounded bg-black border border-college-gold/20 hover:bg-college-gold/5"
                  >
                    <h3 className="font-medium text-college-gold">{classItem.course_name}</h3>
                    <div className="text-sm text-white/70 mt-1">
                      <p>{classItem.start_time} - {classItem.end_time}</p>
                      <p>{classItem.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/70">No classes scheduled for today.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="link" 
              className="text-college-gold p-0 hover:text-college-gold/80"
              onClick={() => navigate('/dashboard/classes')}
            >
              View all classes <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Upcoming assignments */}
        <Card className="bg-black text-white border-college-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-college-gold" />
              Upcoming Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAssignments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAssignments.map((assignment) => (
                  <div 
                    key={assignment.assignment_id} 
                    className="p-3 rounded bg-black border border-college-gold/20 hover:bg-college-gold/5"
                  >
                    <h3 className="font-medium text-college-gold">{assignment.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-white/70">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        assignment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                        assignment.status === 'submitted' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/70">No upcoming assignments.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="link" 
              className="text-college-gold p-0 hover:text-college-gold/80"
              onClick={() => navigate('/dashboard/assignments')}
            >
              View all assignments <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
