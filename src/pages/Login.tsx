import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen } from 'lucide-react';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId || !password) {
      return;
    }
    
    setIsLoading(true);
    const success = await login(studentId, password);
    
    if (success) {
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-college-black-gradient p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-college-gold" />
            <h1 className="text-2xl font-bold text-college-gold">College ERP Portal</h1>
          </div>
        </div>
        
        <Card className="border border-college-gold/20">
          <CardHeader>
            <CardTitle className="text-xl text-center">Student Login</CardTitle>
            <CardDescription className="text-center">
              Enter your college credentials to access the ERP system
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <label htmlFor="studentId" className="text-sm font-medium">
                  Student ID
                </label>
                <Input
                  id="studentId"
                  placeholder="e.g., AGS22BCDS001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  className="border-college-gold/30 focus-visible:ring-college-gold"
                />
                <p className="text-xs text-muted-foreground">
                  Use any ID between AGS22BCDS001 - AGS22BCDS010 (Demo Mode)
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-college-gold/30 focus-visible:ring-college-gold"
                />
                <p className="text-xs text-muted-foreground">
                  Use 'password123' for all accounts (Demo Mode)
                </p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-college-gold hover:bg-college-gold/80 text-black"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
