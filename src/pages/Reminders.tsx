
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockDb, Reminder } from '../lib/mockDb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Trash2, Plus, Calendar, Clock, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Reminders = () => {
  const { currentUser } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchReminders();
    }
  }, [currentUser]);

  const fetchReminders = () => {
    setLoading(true);
    const userReminders = mockDb.getStudentReminders(currentUser!.student_id);
    setReminders(userReminders);
    setLoading(false);
  };

  const handleAddReminder = () => {
    if (!title || !date || !time) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Add new reminder
      const newReminder = mockDb.addReminder({
        title,
        date,
        time,
        description,
        student_id: currentUser!.student_id
      });

      // Update state with new reminder
      setReminders([...reminders, newReminder]);

      // Reset form fields
      setTitle('');
      setDate('');
      setTime('');
      setDescription('');

      // Close dialog
      setIsAddDialogOpen(false);

      toast({
        title: "Reminder Added",
        description: "Your reminder has been successfully added."
      });
    } catch (error) {
      console.error('Error adding reminder', error);
      toast({
        title: "Error",
        description: "Failed to add reminder. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReminder = (reminderId: string) => {
    try {
      const success = mockDb.deleteReminder(reminderId);
      
      if (success) {
        // Update state by removing deleted reminder
        setReminders(reminders.filter(r => r.reminder_id !== reminderId));
        
        toast({
          title: "Reminder Deleted",
          description: "Your reminder has been successfully deleted."
        });
      } else {
        throw new Error('Failed to delete reminder');
      }
    } catch (error) {
      console.error('Error deleting reminder', error);
      toast({
        title: "Error",
        description: "Failed to delete reminder. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Sort reminders by date and time
  const sortedReminders = [...reminders].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`).getTime();
    const dateB = new Date(`${b.date}T${b.time}`).getTime();
    return dateA - dateB;
  });

  // Filter reminders by today, upcoming, and past
  const today = new Date().toISOString().split('T')[0];
  const todayReminders = sortedReminders.filter(r => r.date === today);
  const upcomingReminders = sortedReminders.filter(r => r.date > today);
  const pastReminders = sortedReminders.filter(r => r.date < today);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-college-gold"></div>
      </div>
    );
  }

  const renderRemindersList = (remindersList: Reminder[]) => (
    <div className="space-y-4">
      {remindersList.length > 0 ? (
        remindersList.map((reminder) => (
          <div 
            key={reminder.reminder_id} 
            className="p-4 rounded bg-black border border-college-gold/20 hover:bg-college-gold/5"
          >
            <div className="flex items-start justify-between">
              <div className="flex">
                <Bell className="h-5 w-5 text-college-gold mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-college-gold">{reminder.title}</h3>
                  {reminder.description && (
                    <p className="text-white/90 mt-1">{reminder.description}</p>
                  )}
                  <div className="flex items-center mt-2 text-sm text-white/70">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-3">{new Date(reminder.date).toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{reminder.time}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteReminder(reminder.reminder_id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center border border-dashed border-college-gold/20 rounded-lg">
          <Bell className="h-8 w-8 mx-auto text-white/40 mb-2" />
          <p className="text-white/70">No reminders found.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reminders</h1>
          <p className="text-muted-foreground">Keep track of important dates and events</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-college-gold hover:bg-college-gold/80 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black text-white border border-college-gold/20">
            <DialogHeader>
              <DialogTitle className="text-college-gold">Add New Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter reminder title"
                  className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Date
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm font-medium">
                    Time
                  </label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details about this reminder"
                  className="min-h-24 border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                />
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  className="bg-college-gold hover:bg-college-gold/80 text-black"
                  onClick={handleAddReminder}
                >
                  Add Reminder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="bg-black border-college-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-college-gold" />
            My Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="bg-black text-white border border-college-gold/20">
              <TabsTrigger 
                value="today"
                className="data-[state=active]:bg-college-gold data-[state=active]:text-black"
              >
                Today ({todayReminders.length})
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming"
                className="data-[state=active]:bg-college-gold data-[state=active]:text-black"
              >
                Upcoming ({upcomingReminders.length})
              </TabsTrigger>
              <TabsTrigger 
                value="past"
                className="data-[state=active]:bg-college-gold data-[state=active]:text-black"
              >
                Past ({pastReminders.length})
              </TabsTrigger>
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-college-gold data-[state=active]:text-black"
              >
                All ({sortedReminders.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-4">
              {renderRemindersList(todayReminders)}
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-4">
              {renderRemindersList(upcomingReminders)}
            </TabsContent>
            
            <TabsContent value="past" className="mt-4">
              {renderRemindersList(pastReminders)}
            </TabsContent>
            
            <TabsContent value="all" className="mt-4">
              {renderRemindersList(sortedReminders)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reminders;
