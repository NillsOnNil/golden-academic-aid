
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockDb, Class } from '../lib/mockDb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin } from 'lucide-react';

const Classes = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (currentUser) {
      // Fetch all classes for the current student
      const allClasses = mockDb.getStudentClasses(currentUser.student_id);
      
      // Apply search filter if provided
      if (searchQuery) {
        const filteredClasses = allClasses.filter(
          cls => cls.course_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setClasses(filteredClasses);
      } else {
        setClasses(allClasses);
      }
      
      setLoading(false);
    }
  }, [currentUser, searchQuery]);

  // Group classes by days for weekly view
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // We're simulating classes spread across different days for demonstration
  const classesByDay = daysOfWeek.map((day, index) => {
    // In a real app, classes would be filtered based on their actual day
    // Here we're just distributing them among weekdays for demonstration
    return {
      day,
      classes: classes.filter((_, i) => i % daysOfWeek.length === index)
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-college-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Class Schedule</h1>
        <p className="text-muted-foreground">View your weekly class schedule and details</p>
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
      
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="bg-black text-white border border-college-gold/20">
          <TabsTrigger 
            value="weekly"
            className="data-[state=active]:bg-college-gold data-[state=active]:text-black"
          >
            Weekly View
          </TabsTrigger>
          <TabsTrigger 
            value="list"
            className="data-[state=active]:bg-college-gold data-[state=active]:text-black"
          >
            List View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="mt-4">
          <div className="space-y-6">
            {classesByDay.map((daySchedule) => (
              <Card key={daySchedule.day} className="bg-black text-white border-college-gold/20">
                <CardHeader>
                  <CardTitle className="text-college-gold">{daySchedule.day}</CardTitle>
                </CardHeader>
                <CardContent>
                  {daySchedule.classes.length > 0 ? (
                    <div className="space-y-4">
                      {daySchedule.classes.map((classItem) => (
                        <div 
                          key={classItem.class_id} 
                          className="p-4 rounded bg-black border border-college-gold/20 hover:bg-college-gold/5"
                        >
                          <h3 className="font-semibold text-college-gold">{classItem.course_name}</h3>
                          <div className="grid gap-2 mt-2">
                            <div className="flex items-center text-white/70">
                              <Clock className="h-4 w-4 mr-2 text-college-gold/80" />
                              <span>{classItem.start_time} - {classItem.end_time}</span>
                            </div>
                            <div className="flex items-center text-white/70">
                              <MapPin className="h-4 w-4 mr-2 text-college-gold/80" />
                              <span>{classItem.location}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/70">No classes scheduled for {daySchedule.day}.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <Card className="bg-black text-white border-college-gold/20">
            <CardHeader>
              <CardTitle>All Classes</CardTitle>
              <CardDescription className="text-white/70">
                Complete list of your registered classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classes.length > 0 ? (
                <div className="space-y-4">
                  {classes.map((classItem) => (
                    <div 
                      key={classItem.class_id} 
                      className="p-4 rounded bg-black border border-college-gold/20 hover:bg-college-gold/5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-college-gold">{classItem.course_name}</h3>
                          <div className="grid gap-2 mt-2">
                            <div className="flex items-center text-white/70">
                              <Clock className="h-4 w-4 mr-2 text-college-gold/80" />
                              <span>{classItem.start_time} - {classItem.end_time}</span>
                            </div>
                            <div className="flex items-center text-white/70">
                              <MapPin className="h-4 w-4 mr-2 text-college-gold/80" />
                              <span>{classItem.location}</span>
                            </div>
                            <div className="flex items-center text-white/70">
                              <Calendar className="h-4 w-4 mr-2 text-college-gold/80" />
                              <span>Class ID: {classItem.class_id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">No classes found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Classes;
