import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Mock user data
const MOCK_USER_ADMIN = {
  id: '1',
  name: 'Administrador',
  email: 'admin@bellasoft.com',
  role: 'admin',
};
const MOCK_USER_DEMO = {
  id: '2',
  name: 'Demonstração',
  email: 'demo@bellasoft.com',
  role: 'demo',
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('bellasoft_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For now, we'll just check against our mock data
    if (email === 'admin@bellasoft.com' && password === 'admin2707') {
      setUser(MOCK_USER_ADMIN);
      localStorage.setItem('bellasoft_user', JSON.stringify(MOCK_USER_ADMIN));
      return true;
    } else if (email === 'demo@bellasoft.com' && password === 'demo123'){
      setUser(MOCK_USER_DEMO);
      localStorage.setItem('bellasoft_user', JSON.stringify(MOCK_USER_DEMO));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bellasoft_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};