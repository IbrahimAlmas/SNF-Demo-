import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Chip,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Agriculture,
  Help,
  Eco,
  Science,
  TrendingUp,
  Star,
  Schedule,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface DashboardStats {
  advisoryQueries: number;
  practicesAdopted: number;
  simulationRuns: number;
  sustainabilityScore: number;
  recentActivities: {
    id: string;
    type: 'advisory' | 'practice' | 'simulation' | 'achievement';
    title: string;
    description: string;
    timestamp: Date;
    status: 'completed' | 'pending' | 'failed';
  }[];
  recommendations: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: 'advisory' | 'practice' | 'simulation';
  }[];
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { farmer } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockStats: DashboardStats = {
        advisoryQueries: 12,
        practicesAdopted: 8,
        simulationRuns: 5,
        sustainabilityScore: 75,
        recentActivities: [
          {
            id: '1',
            type: 'advisory',
            title: 'Crop Disease Query',
            description: 'Asked about tomato blight symptoms',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'completed',
          },
          {
            id: '2',
            type: 'practice',
            title: 'Adopted Crop Rotation',
            description: 'Successfully implemented crop rotation practice',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            status: 'completed',
          },
          {
            id: '3',
            type: 'simulation',
            title: 'Digital Twin Simulation',
            description: 'Ran simulation for corn yield prediction',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            status: 'completed',
          },
          {
            id: '4',
            type: 'achievement',
            title: 'Level Up!',
            description: 'Reached level 3 and earned 100 XP',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: 'completed',
          },
        ],
        recommendations: [
          {
            id: '1',
            title: 'Improve Soil Health',
            description: 'Consider implementing cover cropping to improve soil health',
            priority: 'high',
            category: 'practice',
          },
          {
            id: '2',
            title: 'Water Management',
            description: 'Install drip irrigation system to optimize water usage',
            priority: 'medium',
            category: 'practice',
          },
          {
            id: '3',
            title: 'Weather Alert',
            description: 'Heavy rain expected in your area. Take necessary precautions.',
            priority: 'high',
            category: 'advisory',
          },
        ],
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'advisory':
        return <Help color="primary" />;
      case 'practice':
        return <Eco color="success" />;
      case 'simulation':
        return <Science color="info" />;
      case 'achievement':
        return <Star color="warning" />;
      default:
        return <Info />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Schedule color="warning" />;
      case 'failed':
        return <Warning color="error" />;
      default:
        return <Info />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {farmer?.name || 'Farmer'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your sustainable farming journey.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Help />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats?.advisoryQueries || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Advisory Queries
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => navigate('/advisory')}
              >
                Ask Question
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Eco />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats?.practicesAdopted || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Practices Adopted
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => navigate('/practices')}
              >
                Browse Practices
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Science />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats?.simulationRuns || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Simulations Run
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => navigate('/simulation')}
              >
                Run Simulation
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats?.sustainabilityScore || 0}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sustainability Score
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stats?.sustainabilityScore || 0}
                sx={{ mt: 1, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {stats?.recentActivities.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemIcon>
                      {getActivityIcon(activity.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            {getStatusIcon(activity.status)}
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(activity.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              <List>
                {stats?.recommendations.map((rec) => (
                  <ListItem key={rec.id} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2">
                            {rec.title}
                          </Typography>
                          <Chip
                            label={rec.priority}
                            color={getPriorityColor(rec.priority) as any}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {rec.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Help />}
                  onClick={() => navigate('/advisory')}
                  sx={{ py: 1.5 }}
                >
                  Ask AI Question
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Eco />}
                  onClick={() => navigate('/practices')}
                  sx={{ py: 1.5 }}
                >
                  Browse Practices
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Science />}
                  onClick={() => navigate('/simulation')}
                  sx={{ py: 1.5 }}
                >
                  Run Simulation
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Star />}
                  onClick={() => navigate('/achievements')}
                  sx={{ py: 1.5 }}
                >
                  View Achievements
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;