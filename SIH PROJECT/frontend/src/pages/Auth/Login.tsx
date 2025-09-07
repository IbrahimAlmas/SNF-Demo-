import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Slide,
  Zoom,
  Grow,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Agriculture,
  Eco,
  Science,
  Star,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@sfn.com',
      password: 'demo123',
    });
  };

  const features = [
    {
      icon: <Science />,
      title: 'AI-Powered Advisory',
      description: 'Get personalized farming recommendations',
      color: '#4caf50',
    },
    {
      icon: <Eco />,
      title: 'Sustainable Practices',
      description: 'Learn eco-friendly farming methods',
      color: '#2e7d32',
    },
    {
      icon: <Agriculture />,
      title: 'Digital Twin',
      description: 'Simulate farm scenarios',
      color: '#ff9800',
    },
    {
      icon: <Star />,
      title: 'Gamification',
      description: 'Earn rewards for sustainable practices',
      color: '#9c27b0',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 50%, #81c784 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-30px) rotate(180deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 4s ease-in-out infinite reverse',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 5s ease-in-out infinite',
        }}
      />

      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 4,
            alignItems: 'center',
          }}
        >
          {/* Left Side - Features */}
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Fade in={true} timeout={1000}>
              <Box>
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  color="white"
                  mb={2}
                  sx={{
                    background: 'linear-gradient(45deg, #ffffff, #e8f5e8)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Welcome to SFN
                </Typography>
                <Typography
                  variant="h5"
                  color="rgba(255, 255, 255, 0.9)"
                  mb={4}
                  sx={{ fontWeight: 300 }}
                >
                  AI-Powered Sustainable Farming Network
                </Typography>

                <Box sx={{ display: 'grid', gap: 3 }}>
                  {features.map((feature, index) => (
                    <Slide
                      key={feature.title}
                      direction="right"
                      in={true}
                      timeout={800}
                      delay={1200 + index * 200}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          p: 3,
                          borderRadius: 3,
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.2)',
                            transform: 'translateX(10px)',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: feature.color,
                            width: 56,
                            height: 56,
                            boxShadow: `0 8px 16px ${feature.color}40`,
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="white"
                            mb={1}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="rgba(255, 255, 255, 0.8)"
                          >
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Slide>
                  ))}
                </Box>
              </Box>
            </Fade>
          </Box>

          {/* Right Side - Login Form */}
          <Box>
            <Zoom in={true} timeout={1000} delay={800}>
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #2e7d32, #4caf50)',
                  },
                }}
              >
                <Box textAlign="center" mb={4}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      boxShadow: '0 8px 16px rgba(46, 125, 50, 0.3)',
                    }}
                  >
                    <Agriculture sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="primary" mb={1}>
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to your SFN account
                  </Typography>
                </Box>

                {error && (
                  <Fade in={true}>
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  </Fade>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      mb: 3,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                      boxShadow: '0 8px 16px rgba(46, 125, 50, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1b5e20, #2e7d32)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 20px rgba(46, 125, 50, 0.4)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleDemoLogin}
                    sx={{
                      mb: 3,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    Try Demo Account
                  </Button>
                </form>

                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      component={RouterLink}
                      to="/register"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Sign up here
                    </Link>
                  </Typography>
                </Box>
              </Paper>
            </Zoom>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;