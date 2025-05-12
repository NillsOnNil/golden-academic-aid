
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { mockDb, Student } from '../lib/mockDb';

// Omit password from the student type for security
type AuthStudent = Omit<Student, 'password'>;

interface AuthContextType {
  currentUser: AuthStudent | null;
  loading: boolean;
  login: (studentId: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (studentId: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      setLoading(true);
      // In a real app, this would be an API call
      const user = mockDb.authenticate(studentId, password);
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      } else {
        setError('Invalid student ID or password');
        return false;
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
