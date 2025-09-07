import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Divider,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Fade,
  Slide,
  Zoom,
  Grow,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Person,
  LocationOn,
  Phone,
  Email,
  Agriculture,
  Eco,
  Settings,
  Notifications,
  Security,
  Language,
  Palette,
  CloudUpload,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

interface FarmerProfile {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    profileImage?: string;
  };
  farmInfo: {
    farmName: string;
    farmSize: number;
    farmType: string;
    crops: string[];
    soilType: string;
    irrigationMethod: string;
  };
  preferences: {
    language: string;
    notifications: boolean;
    theme: string;
    units: string;
  };
  sustainability: {
    score: number;
    practices: string[];
    certifications: string[];
  };
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [profile, setProfile] = useState<FarmerProfile>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      profileImage: '',
    },
    farmInfo: {
      farmName: '',
      farmSize: 0,
      farmType: '',
      crops: [],
      soilType: '',
      irrigationMethod: '',
    },
    preferences: {
      language: 'en',
      notifications: true,
      theme: 'light',
      units: 'metric',
    },
    sustainability: {
      score: 0,
      practices: [],
      certifications: [],
    },
  });

  const [editProfile, setEditProfile] = useState<FarmerProfile>(profile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setEditProfile(data);
        } else {
          // If no profile exists, use user data
          setProfile({
            ...profile,
            personalInfo: {
              name: user?.name || '',
              email: user?.email || '',
              phone: '',
              location: '',
              profileImage: '',
            },
          });
          setEditProfile({
            ...profile,
            personalInfo: {
              name: user?.name || '',
              email: user?.email || '',
              phone: '',
              location: '',
              profileImage: '',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (section: keyof FarmerProfile, field: string, value: any) => {
    setEditProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (section: keyof FarmerProfile, field: string, value: string[]) => {
    setEditProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editProfile),
      });

      if (response.ok) {
        setProfile(editProfile);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to save profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('personalInfo', 'profileImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const farmTypes = ['Organic', 'Conventional', 'Mixed', 'Hydroponic', 'Greenhouse'];
  const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty', 'Chalky'];
  const irrigationMethods = ['Drip', 'Sprinkler', 'Flood', 'Manual', 'Automated'];
  const commonCrops = ['Wheat', 'Rice', 'Corn', 'Soybean', 'Potato', 'Tomato', 'Lettuce', 'Carrot'];

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <Typography variant="h6" color="text.secondary">
              Loading profile...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in={true} timeout={1000}>
        <Box mb={4}>
          <Typography variant="h3" fontWeight="bold" mb={2}>
            Profile Settings
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your personal and farm information
          </Typography>
        </Box>
      </Fade>

      {message && (
        <Fade in={true}>
          <Alert
            severity={message.type}
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        </Fade>
      )}

      <Grid container spacing={4}>
        {/* Profile Overview Card */}
        <Grid item xs={12} md={4}>
          <Slide direction="right" in={true} timeout={1000} delay={200}>
            <Card
              sx={{
                height: 'fit-content',
                background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 100,
                  height: 100,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  transform: 'translate(30px, -30px)',
                }}
              />
              <CardContent sx={{ position: 'relative', zIndex: 1, p: 4 }}>
                <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                  <Avatar
                    src={profile.personalInfo.profileImage}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 3,
                      border: '4px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <Person sx={{ fontSize: 60 }} />
                  </Avatar>
                  
                  <Typography variant="h5" fontWeight="bold" mb={1}>
                    {profile.personalInfo.name || 'Farmer'}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                    {profile.farmInfo.farmName || 'Farm Name'}
                  </Typography>

                  <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center" mb={3}>
                    <Chip
                      label={`${profile.farmInfo.farmSize || 0} acres`}
                      size="small"
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                    />
                    <Chip
                      label={profile.farmInfo.farmType || 'Farm Type'}
                      size="small"
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                    />
                  </Box>

                  <Typography variant="h4" fontWeight="bold" mb={1}>
                    {profile.sustainability.score}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Sustainability Score
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Slide direction="left" in={true} timeout={1000} delay={400}>
            <Paper elevation={8} sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                  },
                }}
              >
                <Tab label="Personal Info" icon={<Person />} />
                <Tab label="Farm Details" icon={<Agriculture />} />
                <Tab label="Preferences" icon={<Settings />} />
                <Tab label="Sustainability" icon={<Eco />} />
              </Tabs>

              <Box p={4}>
                {/* Personal Information Tab */}
                {activeTab === 0 && (
                  <Fade in={true} timeout={500}>
                    <Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                        <Typography variant="h6" fontWeight="bold">
                          Personal Information
                        </Typography>
                        <Box>
                          {isEditing ? (
                            <Box display="flex" gap={1}>
                              <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSave}
                                disabled={isSaving}
                                size="small"
                              >
                                Save
                              </Button>
                              <Button
                                variant="outlined"
                                startIcon={<Cancel />}
                                onClick={handleCancel}
                                size="small"
                              >
                                Cancel
                              </Button>
                            </Box>
                          ) : (
                            <Button
                              variant="outlined"
                              startIcon={<Edit />}
                              onClick={() => setIsEditing(true)}
                              size="small"
                            >
                              Edit
                            </Button>
                          )}
                        </Box>
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            value={isEditing ? editProfile.personalInfo.name : profile.personalInfo.name}
                            onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={isEditing ? editProfile.personalInfo.email : profile.personalInfo.email}
                            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            value={isEditing ? editProfile.personalInfo.phone : profile.personalInfo.phone}
                            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Location"
                            value={isEditing ? editProfile.personalInfo.location : profile.personalInfo.location}
                            onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                              src={isEditing ? editProfile.personalInfo.profileImage : profile.personalInfo.profileImage}
                              sx={{ width: 80, height: 80 }}
                            >
                              <Person sx={{ fontSize: 40 }} />
                            </Avatar>
                            {isEditing && (
                              <Box>
                                <input
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  id="profile-image-upload"
                                  type="file"
                                  onChange={handleImageUpload}
                                />
                                <label htmlFor="profile-image-upload">
                                  <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<PhotoCamera />}
                                    size="small"
                                  >
                                    Upload Photo
                                  </Button>
                                </label>
                              </Box>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Fade>
                )}

                {/* Farm Details Tab */}
                {activeTab === 1 && (
                  <Fade in={true} timeout={500}>
                    <Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                        <Typography variant="h6" fontWeight="bold">
                          Farm Information
                        </Typography>
                        <Box>
                          {isEditing ? (
                            <Box display="flex" gap={1}>
                              <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSave}
                                disabled={isSaving}
                                size="small"
                              >
                                Save
                              </Button>
                              <Button
                                variant="outlined"
                                startIcon={<Cancel />}
                                onClick={handleCancel}
                                size="small"
                              >
                                Cancel
                              </Button>
                            </Box>
                          ) : (
                            <Button
                              variant="outlined"
                              startIcon={<Edit />}
                              onClick={() => setIsEditing(true)}
                              size="small"
                            >
                              Edit
                            </Button>
                          )}
                        </Box>
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Farm Name"
                            value={isEditing ? editProfile.farmInfo.farmName : profile.farmInfo.farmName}
                            onChange={(e) => handleInputChange('farmInfo', 'farmName', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Farm Size (acres)"
                            type="number"
                            value={isEditing ? editProfile.farmInfo.farmSize : profile.farmInfo.farmSize}
                            onChange={(e) => handleInputChange('farmInfo', 'farmSize', Number(e.target.value))}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            select
                            label="Farm Type"
                            value={isEditing ? editProfile.farmInfo.farmType : profile.farmInfo.farmType}
                            onChange={(e) => handleInputChange('farmInfo', 'farmType', e.target.value)}
                            disabled={!isEditing}
                            SelectProps={{ native: true }}
                          >
                            <option value="">Select Farm Type</option>
                            {farmTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            select
                            label="Soil Type"
                            value={isEditing ? editProfile.farmInfo.soilType : profile.farmInfo.soilType}
                            onChange={(e) => handleInputChange('farmInfo', 'soilType', e.target.value)}
                            disabled={!isEditing}
                            SelectProps={{ native: true }}
                          >
                            <option value="">Select Soil Type</option>
                            {soilTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            select
                            label="Irrigation Method"
                            value={isEditing ? editProfile.farmInfo.irrigationMethod : profile.farmInfo.irrigationMethod}
                            onChange={(e) => handleInputChange('farmInfo', 'irrigationMethod', e.target.value)}
                            disabled={!isEditing}
                            SelectProps={{ native: true }}
                          >
                            <option value="">Select Irrigation Method</option>
                            {irrigationMethods.map((method) => (
                              <option key={method} value={method}>
                                {method}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Crops (comma-separated)"
                            placeholder="e.g., Wheat, Rice, Corn"
                            value={isEditing ? editProfile.farmInfo.crops.join(', ') : profile.farmInfo.crops.join(', ')}
                            onChange={(e) => handleArrayChange('farmInfo', 'crops', e.target.value.split(',').map(crop => crop.trim()).filter(crop => crop))}
                            disabled={!isEditing}
                            helperText="Enter crops separated by commas"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Fade>
                )}

                {/* Preferences Tab */}
                {activeTab === 2 && (
                  <Fade in={true} timeout={500}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" mb={3}>
                        Preferences
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            select
                            label="Language"
                            value={isEditing ? editProfile.preferences.language : profile.preferences.language}
                            onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                            disabled={!isEditing}
                            SelectProps={{ native: true }}
                          >
                            <option value="en">English</option>
                            <option value="hi">हिन्दी</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="zh">中文</option>
                            <option value="ar">العربية</option>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            select
                            label="Units"
                            value={isEditing ? editProfile.preferences.units : profile.preferences.units}
                            onChange={(e) => handleInputChange('preferences', 'units', e.target.value)}
                            disabled={!isEditing}
                            SelectProps={{ native: true }}
                          >
                            <option value="metric">Metric</option>
                            <option value="imperial">Imperial</option>
                          </TextField>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={isEditing ? editProfile.preferences.notifications : profile.preferences.notifications}
                                onChange={(e) => handleInputChange('preferences', 'notifications', e.target.checked)}
                                disabled={!isEditing}
                              />
                            }
                            label="Enable Notifications"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Fade>
                )}

                {/* Sustainability Tab */}
                {activeTab === 3 && (
                  <Fade in={true} timeout={500}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" mb={3}>
                        Sustainability Metrics
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Card sx={{ p: 3, background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)' }}>
                            <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
                              {profile.sustainability.score}%
                            </Typography>
                            <Typography variant="body1" color="text.secondary" mb={3}>
                              Overall Sustainability Score
                            </Typography>
                            <Box display="flex" gap={1} flexWrap="wrap">
                              {profile.sustainability.practices.map((practice, index) => (
                                <Chip
                                  key={index}
                                  label={practice}
                                  color="success"
                                  variant="outlined"
                                  size="small"
                                />
                              ))}
                            </Box>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                  </Fade>
                )}
              </Box>
            </Paper>
          </Slide>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;