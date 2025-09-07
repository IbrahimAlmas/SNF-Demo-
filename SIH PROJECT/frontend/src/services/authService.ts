import { api } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
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

export interface AuthResponse {
  token: string;
  farmer: {
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
  };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(farmerData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', farmerData);
    return response.data;
  },

  async getProfile(): Promise<AuthResponse['farmer']> {
    const response = await api.get('/profile');
    return response.data;
  },

  async updateProfile(profileData: Partial<RegisterRequest>): Promise<AuthResponse['farmer']> {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};