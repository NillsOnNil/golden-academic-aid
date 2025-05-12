
import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, Search, Bell, Settings, Menu, X, LogOut,
  BookOpenCheck, Book, FileText, Video, CalendarDays, User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SearchBar from './SearchBar';

const MainLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Navigation items
  const academicsItems = [
    { name: 'Classes', path: '/dashboard/classes', icon: <Book className="h-5 w-5" /> },
    { name: 'Assignments', path: '/dashboard/assignments', icon: <FileText className="h-5 w-5" /> },
    { name: 'Study Materials', path: '/dashboard/study-materials', icon: <BookOpenCheck className="h-5 w-5" /> },
    { name: 'Lectures', path: '/dashboard/lectures', icon: <Video className="h-5 w-5" /> },
  ];

  // Check if path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-black border-b border-college-gold/20 sticky top-0 z-10">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto flex justify-between items-center h-16">
          {/* Logo and brand */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-college-gold" />
            <span className="font-bold text-lg text-white hidden sm:inline">College ERP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Academics Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`text-white hover:bg-college-gold/10 hover:text-college-gold ${location.pathname.includes('/dashboard/') && !location.pathname.includes('settings') && !location.pathname.includes('reminders') ? 'bg-college-gold/10 text-college-gold' : ''}`}>
                  <BookOpenCheck className="h-5 w-5 mr-2" />
                  Academics
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border border-college-gold/20 text-white">
                {academicsItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center space-x-2 text-white hover:text-college-gold">
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reminders */}
            <Link to="/dashboard/reminders">
              <Button variant="ghost" className={`text-white hover:bg-college-gold/10 hover:text-college-gold ${isActive('/dashboard/reminders') ? 'bg-college-gold/10 text-college-gold' : ''}`}>
                <Bell className="h-5 w-5 mr-2" />
                Reminders
              </Button>
            </Link>

            {/* Settings */}
            <Link to="/dashboard/settings">
              <Button variant="ghost" className={`text-white hover:bg-college-gold/10 hover:text-college-gold ${isActive('/dashboard/settings') ? 'bg-college-gold/10 text-college-gold' : ''}`}>
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Button>
            </Link>
          </div>

          {/* Search bar - visible on larger screens */}
          <div className="hidden md:block w-1/3 max-w-md">
            <SearchBar />
          </div>

          {/* User menu */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-college-gold/10 hover:text-college-gold">
                  <User className="h-5 w-5" />
                  <span className="ml-2 hidden sm:inline">{currentUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black border border-college-gold/20 text-white">
                <DropdownMenuItem className="text-white">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-college-gold/20" />
                <DropdownMenuItem onClick={logout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-college-gold/20 p-4">
            <div className="mb-4">
              <SearchBar />
            </div>
            
            <nav className="space-y-2">
              <div className="font-medium text-white px-2 py-1">Academics</div>
              {academicsItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`flex items-center space-x-2 p-2 rounded hover:bg-college-gold/10 ${location.pathname === item.path ? 'bg-college-gold/10 text-college-gold' : 'text-white'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <Link 
                to="/dashboard/reminders"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-college-gold/10 ${location.pathname === '/dashboard/reminders' ? 'bg-college-gold/10 text-college-gold' : 'text-white'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bell className="h-5 w-5" />
                <span>Reminders</span>
              </Link>
              
              <Link 
                to="/dashboard/settings"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-college-gold/10 ${location.pathname === '/dashboard/settings' ? 'bg-college-gold/10 text-college-gold' : 'text-white'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 w-full justify-start p-2 text-red-500 hover:bg-red-500/10"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow container px-4 py-6 mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 bg-black text-white/60 text-center text-sm">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} College ERP + LLM Portal</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
