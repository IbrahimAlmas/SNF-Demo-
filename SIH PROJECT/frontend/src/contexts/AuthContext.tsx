import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

export interface Farmer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: {
    country: string;
    state: string;
    city: string;
  };
  farmDetails?: {
    landSize: number;
    landSizeUnit: string;
    crops: string[];
    farmingExperience: number;
  };
  preferences?: {
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      whatsapp: boolean;
    };
  };
}

interface AuthContextType {
  farmer: Farmer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (farmerData: Partial<Farmer> & { password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<Farmer>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token and get farmer data
          const farmerData = await authService.getProfile();
          setFarmer(farmerData);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      setFarmer(response.farmer);
    } catch (error) {
      throw error;
    }
  };

  const register = async (farmerData: Partial<Farmer> & { password: string }) => {
    try {
      const response = await authService.register(farmerData);
      localStorage.setItem('token', response.token);
      setFarmer(response.farmer);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setFarmer(null);
  };

  const updateProfile = async (profileData: Partial<Farmer>) => {
    try {
      const updatedFarmer = await authService.updateProfile(profileData);
      setFarmer(updatedFarmer);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    farmer,
    isAuthenticated: !!farmer,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};