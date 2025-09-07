import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Fade, Slide, Zoom, CircularProgress } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LanguageSelector from './components/Language/LanguageSelector';
import NotificationCenter from './components/Notifications/NotificationCenter';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Advisory from './pages/Advisory/Advisory';
import AdvisoryHistory from './pages/Advisory/AdvisoryHistory';
import Practices from './pages/Practices/Practices';
import PracticeDetail from './pages/Practices/PracticeDetail';
import DigitalTwin from './pages/Simulation/DigitalTwin';
import Communication from './pages/Communication/Communication';
import Profile from './pages/Profile/Profile';
import Achievements from './pages/Gamification/Achievements';

// Services
import { localizationService } from './services/localizationService';

// Enhanced theme with animations and modern design
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    secondary: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2e7d32',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#1b5e20',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#2e7d32',
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: '#1b5e20',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#2e7d32',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 14px 0 rgba(46, 125, 50, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px 0 rgba(46, 125, 50, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1b5e20, #2e7d32)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-1px)',
            },
          },
        },
      },
    },
  },
});

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Detect user's language based on location
        const detectedLanguage = await localizationService.detectLanguage();
        if (detectedLanguage && detectedLanguage !== i18n.language) {
          i18n.changeLanguage(detectedLanguage);
        }
      } catch (error) {
        console.warn('Language detection failed:', error);
      } finally {
        // Add a minimum loading time for smooth animations
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 50%, #81c784 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated background elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                '50%': { transform: 'translateY(-20px) rotate(180deg)' },
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              right: '15%',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              animation: 'float 2s ease-in-out infinite reverse',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '20%',
              left: '20%',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              animation: 'float 2.5s ease-in-out infinite',
            }}
          />
          
          <Zoom in={true} timeout={1000}>
            <Box
              sx={{
                textAlign: 'center',
                color: 'white',
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '4px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 30px',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Fade in={true} timeout={1500}>
                <Box>
                  <h1 style={{ 
                    margin: 0, 
                    fontSize: '3rem', 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #ffffff, #e8f5e8)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    SFN Demo
                  </h1>
                  <p style={{ 
                    margin: '15px 0 0', 
                    fontSize: '1.2rem',
                    opacity: 0.9,
                    fontWeight: 300,
                  }}>
                    AI-Powered Sustainable Farming Network
                  </p>
                  <Box
                    sx={{
                      marginTop: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    {[0, 1, 2].map((index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: 'white',
                          animation: `pulse 1.5s ease-in-out infinite ${index * 0.2}s`,
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                            '50%': { opacity: 1, transform: 'scale(1.2)' },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Fade>
            </Box>
          </Zoom>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 50%, #f1f8e9 100%)',
          position: 'relative',
        }}
      >
        {/* Animated background pattern */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(46, 125, 50, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(129, 199, 132, 0.1) 0%, transparent 50%)
            `,
            zIndex: -1,
          }}
        />
        
        <Fade in={true} timeout={1000}>
          <LanguageProvider>
            <AuthProvider>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/advisory" element={
                    <ProtectedRoute>
                      <Advisory />
                    </ProtectedRoute>
                  } />
                  <Route path="/advisory/history" element={
                    <ProtectedRoute>
                      <AdvisoryHistory />
                    </ProtectedRoute>
                  } />
                  <Route path="/practices" element={
                    <ProtectedRoute>
                      <Practices />
                    </ProtectedRoute>
                  } />
                  <Route path="/practices/:id" element={
                    <ProtectedRoute>
                      <PracticeDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/simulation" element={
                    <ProtectedRoute>
                      <DigitalTwin />
                    </ProtectedRoute>
                  } />
                  <Route path="/communication" element={
                    <ProtectedRoute>
                      <Communication />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/achievements" element={
                    <ProtectedRoute>
                      <Achievements />
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirect unknown routes to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
                
                {/* Global Components */}
                <LanguageSelector />
                <NotificationCenter />
              </Layout>
            </AuthProvider>
          </LanguageProvider>
        </Fade>
      </Box>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
};

export default App;