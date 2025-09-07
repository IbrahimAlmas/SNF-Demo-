export interface Practice {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  cost: 'low' | 'medium' | 'high';
  benefits: string[];
  requirements: string[];
  steps: PracticeStep[];
  images: string[];
  videos: PracticeVideo[];
  resources: PracticeResource[];
  tags: string[];
  applicableCrops: string[];
  applicableRegions: PracticeRegion[];
  environmentalImpact: {
    carbonReduction: number;
    waterConservation: number;
    soilHealth: number;
    biodiversity: number;
  };
  adoptionStats: {
    totalAdoptions: number;
    successRate: number;
    averageRating: number;
    totalRatings: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeStep {
  stepNumber: number;
  title: string;
  description: string;
  image?: string;
}

export interface PracticeVideo {
  title: string;
  url: string;
  duration?: string;
}

export interface PracticeResource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'document' | 'website';
}

export interface PracticeRegion {
  country: string;
  state: string;
  climate: string;
}

export interface PracticeFilters {
  category?: string;
  difficulty?: string;
  cost?: string;
  crop?: string;
  country?: string;
  search?: string;
  sortBy?: string;
}

export interface PracticeAdoption {
  practiceId: string;
  adoptedAt: string;
  status: 'adopted' | 'in_progress' | 'completed';
  notes?: string;
}

export interface PracticeRating {
  practiceId: string;
  rating: number;
  review?: string;
}
