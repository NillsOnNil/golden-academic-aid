import React, { useState } from 'react';
import { Bell, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { mockDb } from '../lib/mockDb';
import { useAuth } from '../contexts/AuthContext';

interface AddReminderButtonProps {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'link';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const AddReminderButton: React.FC<AddReminderButtonProps> = ({
  title: initialTitle = '',
  description: initialDescription = '',
  date: initialDate = '',
  time: initialTime = '',
  buttonVariant = 'ghost',
  buttonSize = 'sm',
  className = ''
}) => {
  const { currentUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(initialTime || '');
  const [description, setDescription] = useState(initialDescription);
  const { toast } = useToast();

  const handleAddReminder = () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to add reminders.",
        variant: "destructive"
      });
      return;
    }

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
      mockDb.addReminder({
        title,
        date,
        time,
        description,
        student_id: currentUser.student_id
      });

      setIsDialogOpen(false);
      
      // Reset form if it was manually entered (not from props)
      if (!initialTitle) {
        setTitle('');
        setDescription('');
      }

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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant}
          size={buttonSize}
          className={`text-college-gold hover:text-college-gold/80 ${className}`}
        >
          <Bell className="h-4 w-4 mr-2" />
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
  );
};

export default AddReminderButton; 