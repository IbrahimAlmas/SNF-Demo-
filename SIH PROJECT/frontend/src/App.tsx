import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
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