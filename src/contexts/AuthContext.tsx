import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  studentId: string;
  error: string | null;
  login: (studentId: string, password: string) => Promise<boolean>;
  logout: () => void;
  currentUser: { student_id: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [studentId, setStudentId] = useState<string>(
    localStorage.getItem('studentId') || 'AGS22BCDS001'
  );
  const [error, setError] = useState<string | null>(null);

  // Create currentUser object based on authentication status
  const currentUser = isAuthenticated ? { student_id: studentId } : null;

  const login = async (studentId: string, password: string): Promise<boolean> => {
    // This would be a real API call in production
    try {
      setError(null);
      
      // Simple validation for demo mode
      if (!studentId.match(/^AGS22BCDS\d{3}$/)) {
        setError('Invalid Student ID format. Use format: AGS22BCDS001');
        return false;
      }
      
      if (password !== 'password123') {
        setError('Invalid password. Use: password123');
        return false;
      }
      
      // Mock successful login
      setIsAuthenticated(true);
      setStudentId(studentId);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('studentId', studentId);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('studentId');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, studentId, error, login, logout, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
