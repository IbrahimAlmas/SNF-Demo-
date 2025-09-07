export interface Gamification {
  xp: number;
  level: number;
  badges: Badge[];
  achievements: Achievement[];
  stats: GamificationStats;
  xpNeeded: number;
  xpProgress: number;
  lastActivity: string;
}

export interface Badge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'sustainability' | 'knowledge' | 'community' | 'achievement';
}

export interface Achievement {
  achievementId: string;
  name: string;
  description: string;
  completedAt: string;
  xpReward: number;
}

export interface GamificationStats {
  advisoryQueries: number;
  practicesAdopted: number;
  daysActive: number;
  communityContributions: number;
}

export interface LeaderboardEntry {
  rank: number;
  farmer: {
    name: string;
    location: {
      country: string;
      state: string;
      city: string;
    };
  };
  xp: number;
  level: number;
  badgeCount: number;
  stats: GamificationStats;
}

export interface GamificationAction {
  action: 'advisory_query' | 'practice_adopted' | 'daily_active';
  metadata?: any;
}

export interface GamificationResult {
  leveledUp: boolean;
  newLevel: number;
  xpGained: number;
  badgesEarned: Badge[];
}
