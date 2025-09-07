export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: {
    country: string;
    state: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  farmDetails: {
    landSize: number;
    landSizeUnit: string;
    crops: string[];
    farmingExperience: number;
  };
  preferences: {
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      whatsapp: boolean;
    };
  };
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: {
    country: string;
    state: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  farmDetails: {
    landSize: number;
    landSizeUnit: string;
    crops: string[];
    farmingExperience: number;
  };
  preferences?: {
    language?: string;
    notifications?: {
      email: boolean;
      sms: boolean;
      whatsapp: boolean;
    };
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  farmer: Farmer;
  message: string;
}
