import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Person,
  LocationOn,
  Agriculture,
  Notifications,
  Save,
  Edit,
  Cancel,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { farmer, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: {
      country: '',
      state: '',
      city: '',
    },
    farmDetails: {
      landSize: 0,
      landSizeUnit: 'acres',
      crops: [] as string[],
      farmingExperience: 0,
    },
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        sms: true,
        whatsapp: false,
      },
    },
  });

  const [cropInput, setCropInput] = useState('');

  const countries = [
    'India', 'United States', 'Canada', 'United Kingdom', 'Australia',
    'Germany', 'France', 'Spain', 'Brazil', 'China', 'Japan', 'South Africa'
  ];

  const landSizeUnits = [
    { value: 'acres', label: 'Acres' },
    { value: 'hectares', label: 'Hectares' },
    { value: 'square_meters', label: 'Square Meters' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ar', label: 'Arabic' },
  ];

  useEffect(() => {
    if (farmer) {
      setFormData({
        name: farmer.name || '',
        phone: farmer.phone || '',
        location: {
          country: farmer.location?.country || '',
          state: farmer.location?.state || '',
          city: farmer.location?.city || '',
        },
        farmDetails: {
          landSize: farmer.farmDetails?.landSize || 0,
          landSizeUnit: farmer.farmDetails?.landSizeUnit || 'acres',
          crops: farmer.farmDetails?.crops || [],
          farmingExperience: farmer.farmDetails?.farmingExperience || 0,
        },
        preferences: {
          language: farmer.preferences?.language || 'en',
          notifications: {
            email: farmer.preferences?.notifications?.email ?? true,
            sms: farmer.preferences?.notifications?.sms ?? true,
            whatsapp: farmer.preferences?.notifications?.whatsapp ?? false,
          },
        },
      });
    }
  }, [farmer]);

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('location.')) {
      const locationField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else if (field.startsWith('farmDetails.')) {
      const farmField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        farmDetails: {
          ...prev.farmDetails,
          [farmField]: value,
        },
      }));
    } else if (field.startsWith('preferences.notifications.')) {
      const notificationField = field.split('.')[2];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          notifications: {
            ...prev.preferences.notifications,
            [notificationField]: value,
          },
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAddCrop = () => {
    if (cropInput.trim() && !formData.farmDetails.crops.includes(cropInput.trim())) {
      setFormData(prev => ({
        ...prev,
        farmDetails: {
          ...prev.farmDetails,
          crops: [...prev.farmDetails.crops, cropInput.trim()],
        },
      }));
      setCropInput('');
    }
  };

  const handleRemoveCrop = (cropToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      farmDetails: {
        ...prev.farmDetails,
        crops: prev.farmDetails.crops.filter(crop => crop !== cropToRemove),
      },
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (farmer) {
      setFormData({
        name: farmer.name || '',
        phone: farmer.phone || '',
        location: {
          country: farmer.location?.country || '',
          state: farmer.location?.state || '',
          city: farmer.location?.city || '',
        },
        farmDetails: {
          landSize: farmer.farmDetails?.landSize || 0,
          landSizeUnit: farmer.farmDetails?.landSizeUnit || 'acres',
          crops: farmer.farmDetails?.crops || [],
          farmingExperience: farmer.farmDetails?.farmingExperience || 0,
        },
        preferences: {
          language: farmer.preferences?.language || 'en',
          notifications: {
            email: farmer.preferences?.notifications?.email ?? true,
            sms: farmer.preferences?.notifications?.sms ?? true,
            whatsapp: farmer.preferences?.notifications?.whatsapp ?? false,
          },
        },
      });
    }
    setEditing(false);
  };

  if (!farmer) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {t('profile.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your personal information, farm details, and preferences.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {farmer.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {farmer.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {farmer.location?.city}, {farmer.location?.state}, {farmer.location?.country}
              </Typography>
              <Box mt={2}>
                <Button
                  variant={editing ? 'outlined' : 'contained'}
                  startIcon={editing ? <Cancel /> : <Edit />}
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Farm Statistics
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Land Size:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {farmer.farmDetails?.landSize} {farmer.farmDetails?.landSizeUnit}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Crops:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {farmer.farmDetails?.crops?.length || 0}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Experience:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {farmer.farmDetails?.farmingExperience} years
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5">
                {editing ? 'Edit Profile' : 'Profile Information'}
              </Typography>
              {editing && (
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </Box>

            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t('profile.personalInfo')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('auth.name')}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!editing}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('auth.phone')}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!editing}
                />
              </Grid>

              {/* Location Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  {t('profile.location')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>{t('profile.country')}</InputLabel>
                  <Select
                    value={formData.location.country}
                    onChange={(e) => handleInputChange('location.country', e.target.value)}
                    label={t('profile.country')}
                    disabled={!editing}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label={t('profile.state')}
                  value={formData.location.state}
                  onChange={(e) => handleInputChange('location.state', e.target.value)}
                  disabled={!editing}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label={t('profile.city')}
                  value={formData.location.city}
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
                  disabled={!editing}
                />
              </Grid>

              {/* Farm Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  {t('profile.farmInfo')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('profile.landSize')}
                  type="number"
                  value={formData.farmDetails.landSize}
                  onChange={(e) => handleInputChange('farmDetails.landSize', parseFloat(e.target.value) || 0)}
                  disabled={!editing}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('profile.landSizeUnit')}</InputLabel>
                  <Select
                    value={formData.farmDetails.landSizeUnit}
                    onChange={(e) => handleInputChange('farmDetails.landSizeUnit', e.target.value)}
                    label={t('profile.landSizeUnit')}
                    disabled={!editing}
                  >
                    {landSizeUnits.map((unit) => (
                      <MenuItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('profile.farmingExperience')}
                  type="number"
                  value={formData.farmDetails.farmingExperience}
                  onChange={(e) => handleInputChange('farmDetails.farmingExperience', parseInt(e.target.value) || 0)}
                  disabled={!editing}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('profile.crops')}
                </Typography>
                {editing ? (
                  <Box display="flex" gap={1} mb={1}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add crop type..."
                      value={cropInput}
                      onChange={(e) => setCropInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCrop();
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddCrop}
                      disabled={!cropInput.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                ) : null}
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.farmDetails.crops.map((crop) => (
                    <Chip
                      key={crop}
                      label={crop}
                      onDelete={editing ? () => handleRemoveCrop(crop) : undefined}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              {/* Preferences */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  {t('profile.preferences')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('profile.language')}</InputLabel>
                  <Select
                    value={formData.preferences.language}
                    onChange={(e) => handleInputChange('preferences.language', e.target.value)}
                    label={t('profile.language')}
                    disabled={!editing}
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('profile.notifications')}
                </Typography>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.preferences.notifications.email}
                        onChange={(e) => handleInputChange('preferences.notifications.email', e.target.checked)}
                        disabled={!editing}
                      />
                    }
                    label={t('profile.emailNotifications')}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.preferences.notifications.sms}
                        onChange={(e) => handleInputChange('preferences.notifications.sms', e.target.checked)}
                        disabled={!editing}
                      />
                    }
                    label={t('profile.smsNotifications')}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.preferences.notifications.whatsapp}
                        onChange={(e) => handleInputChange('preferences.notifications.whatsapp', e.target.checked)}
                        disabled={!editing}
                      />
                    }
                    label={t('profile.whatsappNotifications')}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
