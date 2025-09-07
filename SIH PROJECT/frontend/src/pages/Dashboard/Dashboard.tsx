import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Fade,
  Slide,
  Zoom,
  Grow,
  Paper,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  TrendingUp,
  Eco,
  Science,
  Chat,
  Assessment,
  Star,
  Timeline,
  Notifications,
  Refresh,
  ArrowForward,
  Agriculture,
  WaterDrop,
  WbSunny,
  Cloud,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalFarmers: 0,
    activePractices: 0,
    advisoryQueries: 0,
    sustainabilityScore: 0,
  });

  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    humidity: 0,
    rainfall: 0,
    windSpeed: 0,
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [quickActions] = useState([
    {
      title: 'AI Advisory',
      description: 'Get personalized farming advice',
      icon: <Science />,
      color: '#4caf50',
      path: '/advisory',
    },
    {
      title: 'Sustainable Practices',
      description: 'Explore eco-friendly methods',
      icon: <Eco />,
      color: '#2e7d32',
      path: '/practices',
    },
    {
      title: 'Digital Twin',
      description: 'Simulate farm scenarios',
      icon: <Assessment />,
      color: '#ff9800',
      path: '/simulation',
    },
    {
      title: 'Communication',
      description: 'Connect with experts',
      icon: <Chat />,
      color: '#2196f3',
      path: '/communication',
    },
  ]);

  const [achievements] = useState([
    { name: 'Eco Warrior', progress: 100, maxProgress: 100, color: '#4caf50' },
    { name: 'Water Saver', progress: 75, maxProgress: 100, color: '#2196f3' },
    { name: 'Soil Guardian', progress: 60, maxProgress: 100, color: '#8d6e63' },
    { name: 'Crop Master', progress: 45, maxProgress: 100, color: '#ff9800' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch stats from backend
        const statsResponse = await fetch('/api/dashboard/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Fetch weather data
        const weatherResponse = await fetch('/api/weather/current');
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          setWeatherData(weatherData);
        }

        // Fetch recent activities
        const activitiesResponse = await fetch('/api/activities/recent');
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setRecentActivities(activitiesData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values if API fails
        setStats({
          totalFarmers: 0,
          activePractices: 0,
          advisoryQueries: 0,
          sustainabilityScore: 0,
        });
        setWeatherData({
          temperature: 0,
          humidity: 0,
          rainfall: 0,
          windSpeed: 0,
        });
        setRecentActivities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: number;
    delay?: number;
  }> = ({ title, value, icon, color, trend, delay = 0 }) => (
    <Grow in={true} timeout={1000 + delay}>
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          border: `1px solid ${color}30`,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${color}20`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
          },
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Avatar
              sx={{
                bgcolor: color,
                width: 56,
                height: 56,
                boxShadow: `0 8px 16px ${color}40`,
              }}
            >
              {icon}
            </Avatar>
            {trend && (
              <Chip
                icon={<TrendingUp />}
                label={`+${trend}%`}
                size="small"
                color="success"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
          <Typography variant="h4" fontWeight="bold" color={color} mb={1}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );

  const QuickActionCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    delay?: number;
  }> = ({ title, description, icon, color, delay = 0 }) => (
    <Slide direction="up" in={true} timeout={800 + delay}>
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: `0 20px 40px ${color}20`,
          },
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <Avatar
            sx={{
              bgcolor: color,
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
              boxShadow: `0 8px 16px ${color}40`,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {description}
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              background: `linear-gradient(45deg, ${color}, ${color}80)`,
              borderRadius: '20px',
              px: 3,
              py: 1,
            }}
          >
            Explore
          </Button>
        </CardContent>
      </Card>
    </Slide>
  );

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" color="text.secondary">
              Loading dashboard data...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in={true} timeout={1000}>
        <Box mb={4}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box>
              <Typography variant="h3" fontWeight="bold" mb={1}>
                Welcome to SFN Dashboard
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Your AI-powered sustainable farming companion
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Tooltip title="Refresh Data">
                <IconButton
                  color="primary"
                  onClick={() => window.location.reload()}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'rotate(180deg)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Badge badgeContent={recentActivities.length} color="error">
                <IconButton color="primary">
                  <Notifications />
                </IconButton>
              </Badge>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Farmers"
            value={stats.totalFarmers.toLocaleString()}
            icon={<Agriculture />}
            color="#4caf50"
            trend={12}
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Practices"
            value={stats.activePractices}
            icon={<Eco />}
            color="#2e7d32"
            trend={8}
            delay={200}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Advisory Queries"
            value={stats.advisoryQueries}
            icon={<Science />}
            color="#ff9800"
            trend={15}
            delay={400}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sustainability Score"
            value={`${Math.round(stats.sustainabilityScore)}%`}
            icon={<Star />}
            color="#9c27b0"
            delay={600}
          />
        </Grid>
      </Grid>

      {/* Weather and Quick Actions */}
      <Grid container spacing={3} mb={4}>
        {/* Weather Card */}
        <Grid item xs={12} md={4}>
          <Zoom in={true} timeout={1000} delay={800}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #2196f3, #21cbf3)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Current Weather
                  </Typography>
                  <WbSunny sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h3" fontWeight="bold" mb={2}>
                  {weatherData.temperature}°C
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <WaterDrop />
                      <Typography variant="body2">
                        Humidity: {weatherData.humidity}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Cloud />
                      <Typography variant="body2">
                        Rainfall: {weatherData.rainfall}mm
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} key={action.title}>
                <QuickActionCard
                  {...action}
                  delay={index * 200}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Recent Activities and Achievements */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={1000} delay={1200}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Recent Activities
                </Typography>
                <Box>
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <Slide
                        key={activity.id}
                        direction="right"
                        in={true}
                        timeout={600}
                        delay={1400 + index * 200}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={2}
                          p={2}
                          mb={2}
                          sx={{
                            borderRadius: 2,
                            background: `${activity.color}10`,
                            border: `1px solid ${activity.color}30`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: `${activity.color}20`,
                              transform: 'translateX(8px)',
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: activity.color,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {activity.icon}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="body2" fontWeight="medium">
                              {activity.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        </Box>
                      </Slide>
                    ))
                  ) : (
                    <Box textAlign="center" py={4}>
                      <Typography variant="body1" color="text.secondary" mb={2}>
                        No recent activities
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Start using the app to see your activities here
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={1000} delay={1400}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Your Achievements
                </Typography>
                <Box>
                  {achievements.map((achievement, index) => (
                    <Slide
                      key={achievement.name}
                      direction="left"
                      in={true}
                      timeout={600}
                      delay={1600 + index * 200}
                    >
                      <Box mb={3}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" fontWeight="medium">
                            {achievement.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {achievement.progress}/{achievement.maxProgress}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(achievement.progress / achievement.maxProgress) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: `${achievement.color}20`,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: achievement.color,
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                    </Slide>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;