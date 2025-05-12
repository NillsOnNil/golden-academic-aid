
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Bell, LogOut, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [classReminders, setClassReminders] = useState(true);
  const [examReminders, setExamReminders] = useState(true);
  
  const handleSaveProfile = () => {
    // In a real app, this would update the user's profile in the database
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated."
    });
  };
  
  const handleChangePassword = () => {
    // Validate passwords
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would verify the current password and update to the new password
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully."
    });
    
    // Clear password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const handleSaveNotifications = () => {
    // In a real app, this would update notification preferences in the database
    toast({
      title: "Notification Preferences Saved",
      description: "Your notification settings have been updated."
    });
  };
  
  const handleLogout = () => {
    logout();
    // Navigation is handled by the MainLayout component when currentUser is null
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-black text-white border border-college-gold/20">
          <TabsTrigger 
            value="profile"
            className="data-[state=active]:bg-college-gold data-[state=active]:text-black"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="password"
            className="data-[state=active]:bg-college-gold data-[state=active]:text-black"
          >
            Password
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-college-gold data-[state=active]:text-black"
          >
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-4">
          <Card className="bg-black border-college-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <User className="h-5 w-5 mr-2 text-college-gold" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-white/70">
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-id" className="text-white">
                  Student ID
                </Label>
                <Input
                  id="student-id"
                  value={currentUser?.student_id || ''}
                  disabled
                  className="border-college-gold/30 bg-black/50 text-white/70"
                />
                <p className="text-xs text-white/50">Student ID cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                />
              </div>
              
              <Button 
                className="bg-college-gold hover:bg-college-gold/80 text-black mt-2"
                onClick={handleSaveProfile}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password" className="mt-4">
          <Card className="bg-black border-college-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Lock className="h-5 w-5 mr-2 text-college-gold" />
                Change Password
              </CardTitle>
              <CardDescription className="text-white/70">
                Update your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-white">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                />
                <p className="text-xs text-white/50">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-college-gold/30 focus-visible:ring-college-gold bg-black/50 text-white"
                />
              </div>
              
              <Button 
                className="bg-college-gold hover:bg-college-gold/80 text-black mt-2"
                onClick={handleChangePassword}
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <Card className="bg-black border-college-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Bell className="h-5 w-5 mr-2 text-college-gold" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-white/70">
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-white">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-white/50">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  className="data-[state=checked]:bg-college-gold"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="assignment-reminders" className="text-white">
                    Assignment Reminders
                  </Label>
                  <p className="text-sm text-white/50">
                    Get notified about upcoming assignments
                  </p>
                </div>
                <Switch
                  id="assignment-reminders"
                  checked={assignmentReminders}
                  onCheckedChange={setAssignmentReminders}
                  className="data-[state=checked]:bg-college-gold"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="class-reminders" className="text-white">
                    Class Reminders
                  </Label>
                  <p className="text-sm text-white/50">
                    Get notified before your classes
                  </p>
                </div>
                <Switch
                  id="class-reminders"
                  checked={classReminders}
                  onCheckedChange={setClassReminders}
                  className="data-[state=checked]:bg-college-gold"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="exam-reminders" className="text-white">
                    Exam Reminders
                  </Label>
                  <p className="text-sm text-white/50">
                    Get notified about upcoming exams
                  </p>
                </div>
                <Switch
                  id="exam-reminders"
                  checked={examReminders}
                  onCheckedChange={setExamReminders}
                  className="data-[state=checked]:bg-college-gold"
                />
              </div>
              
              <Button 
                className="bg-college-gold hover:bg-college-gold/80 text-black mt-4"
                onClick={handleSaveNotifications}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-black border-college-gold/20 border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-400">Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="bg-red-900 hover:bg-red-800 text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
