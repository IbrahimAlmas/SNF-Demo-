export interface Advisory {
  id: string;
  farmerId: string;
  type: 'text' | 'image' | 'general';
  query: string;
  images?: AdvisoryImage[];
  response: AdvisoryResponse;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  location?: {
    country: string;
    state: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  cropInfo?: {
    cropType: string;
    growthStage: string;
    plantingDate: string;
  };
  feedback?: {
    rating: number;
    helpful: boolean;
    comments: string;
    submittedAt: string;
  };
  processingTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdvisoryImage {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
}

export interface AdvisoryResponse {
  text: string;
  confidence: number;
  recommendations: string[];
  relatedPractices?: string[];
  aiModel: string;
}

export interface AdvisoryQuery {
  query: string;
  cropInfo?: {
    cropType: string;
    growthStage: string;
    plantingDate: string;
  };
}

export interface AdvisoryImageQuery {
  query?: string;
  image: File;
}

export interface AdvisoryFeedback {
  rating: number;
  helpful: boolean;
  comments?: string;
}
