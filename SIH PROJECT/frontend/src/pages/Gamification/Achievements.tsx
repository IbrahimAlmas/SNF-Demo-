import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  TrendingUp,
  School,
  Eco,
  Schedule,
  Nature,
  Help,
  Quiz,
  Park,
  CalendarToday,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Badge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'sustainability' | 'knowledge' | 'community' | 'achievement';
}

interface Achievement {
  achievementId: string;
  name: string;
  description: string;
  completedAt: string;
  xpReward: number;
}

interface GamificationStats {
  xp: number;
  level: number;
  xpNeeded: number;
  xpProgress: number;
  badges: Badge[];
  achievements: Achievement[];
  stats: {
    advisoryQueries: number;
    practicesAdopted: number;
    daysActive: number;
    communityContributions: number;
  };
}

interface LeaderboardEntry {
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
}

const Achievements: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [gamification, setGamification] = useState<GamificationStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGamificationData();
    fetchLeaderboard();
  }, []);

  const fetchGamificationData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockGamification: GamificationStats = {
        xp: 750,
        level: 3,
        xpNeeded: 250,
        xpProgress: 75,
        badges: [
          {
            badgeId: 'first_query',
            name: 'First Question',
            description: 'Asked your first advisory question',
            icon: 'help_outline',
            earnedAt: '2024-01-10T10:30:00Z',
            category: 'knowledge'
          },
          {
            badgeId: 'curious_farmer',
            name: 'Curious Farmer',
            description: 'Asked 10 advisory questions',
            icon: 'quiz',
            earnedAt: '2024-01-12T14:20:00Z',
            category: 'knowledge'
          },
          {
            badgeId: 'first_practice',
            name: 'Sustainable Starter',
            description: 'Adopted your first sustainable practice',
            icon: 'eco',
            earnedAt: '2024-01-15T09:15:00Z',
            category: 'sustainability'
          },
          {
            badgeId: 'green_thumb',
            name: 'Green Thumb',
            description: 'Adopted 5 sustainable practices',
            icon: 'park',
            earnedAt: '2024-01-18T16:45:00Z',
            category: 'sustainability'
          },
          {
            badgeId: 'active_member',
            name: 'Active Member',
            description: 'Used the platform for 7 consecutive days',
            icon: 'schedule',
            earnedAt: '2024-01-20T08:00:00Z',
            category: 'achievement'
          }
        ],
        achievements: [
          {
            achievementId: 'first_week',
            name: 'First Week Complete',
            description: 'Successfully completed your first week on the platform',
            completedAt: '2024-01-20T08:00:00Z',
            xpReward: 100
          },
          {
            achievementId: 'sustainability_champion',
            name: 'Sustainability Champion',
            description: 'Adopted 10 sustainable practices',
            completedAt: '2024-01-22T12:30:00Z',
            xpReward: 200
          }
        ],
        stats: {
          advisoryQueries: 12,
          practicesAdopted: 8,
          daysActive: 15,
          communityContributions: 3
        }
      };

      setGamification(mockGamification);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch gamification data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      // Mock data - replace with actual API call
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          rank: 1,
          farmer: { name: 'John Smith', location: { country: 'US', state: 'California', city: 'Fresno' } },
          xp: 2500,
          level: 8,
          badgeCount: 15
        },
        {
          rank: 2,
          farmer: { name: 'Maria Garcia', location: { country: 'ES', state: 'Andalusia', city: 'Seville' } },
          xp: 2200,
          level: 7,
          badgeCount: 12
        },
        {
          rank: 3,
          farmer: { name: 'Ahmed Hassan', location: { country: 'EG', state: 'Cairo', city: 'Cairo' } },
          xp: 2000,
          level: 6,
          badgeCount: 10
        },
        {
          rank: 4,
          farmer: { name: 'Priya Patel', location: { country: 'IN', state: 'Gujarat', city: 'Ahmedabad' } },
          xp: 1800,
          level: 6,
          badgeCount: 9
        },
        {
          rank: 5,
          farmer: { name: 'You', location: { country: 'US', state: 'Texas', city: 'Houston' } },
          xp: 750,
          level: 3,
          badgeCount: 5
        }
      ];

      setLeaderboard(mockLeaderboard);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  };

  const getBadgeIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'help_outline': <Help />,
      'quiz': <Quiz />,
      'eco': <Eco />,
      'park': <Park />,
      'schedule': <Schedule />,
      'school': <School />,
      'nature': <Nature />,
      'calendar_today': <CalendarToday />,
    };
    return iconMap[iconName] || <Star />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sustainability': return 'success';
      case 'knowledge': return 'primary';
      case 'community': return 'info';
      case 'achievement': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!gamification) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mt: 2 }}>
          No gamification data available
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {t('gamification.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your progress, earn badges, and see how you rank among other farmers.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tab icon={<EmojiEvents />} label="Overview" />
          <Tab icon={<Star />} label="Badges" />
          <Tab icon={<TrendingUp />} label="Leaderboard" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            {/* Level and XP Progress */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 60, height: 60 }}>
                    <Typography variant="h4" color="white">
                      {gamification.level}
                    </Typography>
                  </Avatar>
                  <Box>
                    <Typography variant="h5">
                      Level {gamification.level}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {gamification.xp} XP
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={gamification.xpProgress}
                  sx={{ mb: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {gamification.xpNeeded} XP to next level
                </Typography>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Help color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">{gamification.stats.advisoryQueries}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Advisory Queries
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Eco color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">{gamification.stats.practicesAdopted}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Practices Adopted
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Schedule color="info" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">{gamification.stats.daysActive}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Days Active
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Star color="warning" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">{gamification.badges.length}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Badges Earned
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Badges ({gamification.badges.length})
            </Typography>
            <Grid container spacing={2}>
              {gamification.badges.map((badge) => (
                <Grid item xs={12} sm={6} md={4} key={badge.badgeId}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: `${getCategoryColor(badge.category)}.main`, mx: 'auto', mb: 2, width: 60, height: 60 }}>
                        {getBadgeIcon(badge.icon)}
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        {badge.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {badge.description}
                      </Typography>
                      <Chip
                        label={badge.category}
                        color={getCategoryColor(badge.category) as any}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        Earned: {formatDate(badge.earnedAt)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {gamification.achievements.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Achievements ({gamification.achievements.length})
                </Typography>
                <List>
                  {gamification.achievements.map((achievement) => (
                    <ListItem key={achievement.achievementId} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <EmojiEvents />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={achievement.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {achievement.description}
                            </Typography>
                            <Box display="flex" gap={1} mt={1}>
                              <Chip label={`+${achievement.xpReward} XP`} size="small" color="success" />
                              <Typography variant="caption" color="text.secondary">
                                Completed: {formatDate(achievement.completedAt)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Global Leaderboard
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Farmer</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell align="right">Level</TableCell>
                    <TableCell align="right">XP</TableCell>
                    <TableCell align="right">Badges</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.map((entry) => (
                    <TableRow key={entry.rank} sx={{ bgcolor: entry.farmer.name === 'You' ? 'action.hover' : 'transparent' }}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {entry.rank <= 3 && (
                            <EmojiEvents color={entry.rank === 1 ? 'warning' : entry.rank === 2 ? 'info' : 'success'} sx={{ mr: 1 }} />
                          )}
                          {entry.rank}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={entry.farmer.name === 'You' ? 'bold' : 'normal'}>
                          {entry.farmer.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {entry.farmer.location.city}, {entry.farmer.location.state}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip label={entry.level} color="primary" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {entry.xp.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {entry.badgeCount}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Achievements;
