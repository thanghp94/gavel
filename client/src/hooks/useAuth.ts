import { useState, useEffect, createContext, useContext } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'member' | 'exco';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userData = await api.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    setUser(response.user);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const response = await api.register(email, password, displayName);
    setUser(response.user);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return {
    user,
    login,
    register,
    logout,
    loading,
  };
};

export { AuthContext };