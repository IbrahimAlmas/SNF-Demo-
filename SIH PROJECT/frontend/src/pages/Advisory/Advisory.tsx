import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Send,
  Upload,
  Help,
  Image as ImageIcon,
  CheckCircle,
  Warning,
  Info,
  History,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface AdvisoryQuery {
  id: string;
  type: 'text' | 'image';
  query: string;
  response: {
    text: string;
    confidence: number;
    recommendations: string[];
  };
  timestamp: Date;
  status: 'processing' | 'completed' | 'failed';
}

const Advisory: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [textQuery, setTextQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AdvisoryQuery | null>(null);
  const [error, setError] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTextSubmit = async () => {
    if (!textQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResponse: AdvisoryQuery = {
        id: `query_${Date.now()}`,
        type: 'text',
        query: textQuery,
        response: {
          text: 'Based on your description, this appears to be early blight affecting your tomato plants. The symptoms you\'ve described are consistent with this fungal disease that commonly affects tomatoes.',
          confidence: 0.87,
          recommendations: [
            'Apply copper-based fungicide every 7-10 days',
            'Improve air circulation by pruning dense foliage',
            'Water at the base of plants to avoid wetting leaves',
            'Remove and destroy affected plant material',
            'Consider crop rotation for next season'
          ]
        },
        timestamp: new Date(),
        status: 'completed'
      };

      setCurrentResponse(mockResponse);
      setTextQuery('');
    } catch (err: any) {
      setError(err.message || 'Failed to process query');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSubmit = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError('');

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockResponse: AdvisoryQuery = {
        id: `query_${Date.now()}`,
        type: 'image',
        query: 'Crop disease analysis',
        response: {
          text: 'I can see signs of early blight on your tomato plants. The dark spots with concentric rings are characteristic of this fungal disease. The yellowing leaves and brown lesions are typical symptoms.',
          confidence: 0.92,
          recommendations: [
            'Apply copper fungicide immediately',
            'Remove affected leaves carefully to prevent spread',
            'Improve air circulation around plants',
            'Avoid overhead watering',
            'Consider using resistant varieties next season'
          ]
        },
        timestamp: new Date(),
        status: 'completed'
      };

      setCurrentResponse(mockResponse);
      setImageFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {t('advisory.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get AI-powered agricultural advice for your farming challenges.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab icon={<Help />} label={t('advisory.textQuery')} />
              <Tab icon={<ImageIcon />} label={t('advisory.imageQuery')} />
            </Tabs>

            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t('advisory.askQuestion')}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder={t('advisory.queryPlaceholder')}
                  value={textQuery}
                  onChange={(e) => setTextQuery(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                  onClick={handleTextSubmit}
                  disabled={loading || !textQuery.trim()}
                  size="large"
                >
                  {loading ? 'Processing...' : t('advisory.submitQuery')}
                </Button>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t('advisory.uploadImage')}
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    mb: 2,
                  }}
                >
                  <Upload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Upload Crop Image
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Upload a clear image of your crop, plant, or field for AI analysis
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Button variant="outlined" component="span">
                      Choose Image
                    </Button>
                  </label>
                  {imageFile && (
                    <Box mt={2}>
                      <Typography variant="body2" color="primary">
                        Selected: {imageFile.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                  onClick={handleImageSubmit}
                  disabled={loading || !imageFile}
                  size="large"
                  fullWidth
                >
                  {loading ? 'Analyzing Image...' : 'Analyze Image'}
                </Button>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {currentResponse && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6">
                      {t('advisory.response')}
                    </Typography>
                    <Chip
                      label={getConfidenceLabel(currentResponse.response.confidence)}
                      color={getConfidenceColor(currentResponse.response.confidence) as any}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body1" paragraph>
                    {currentResponse.response.text}
                  </Typography>

                  {currentResponse.response.recommendations.length > 0 && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {t('advisory.recommendations')}
                      </Typography>
                      <List>
                        {currentResponse.response.recommendations.map((rec, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText primary={rec} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      startIcon={<History />}
                      onClick={() => window.location.href = '/advisory/history'}
                    >
                      View Query History
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tips for Better Results
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Info color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Be Specific"
                    secondary="Provide detailed descriptions of symptoms, conditions, and context"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Include Context"
                    secondary="Mention weather, soil type, crop variety, and recent treatments"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Clear Images"
                    secondary="Upload high-quality images with good lighting and focus"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Follow Up"
                    secondary="Ask follow-up questions if you need clarification"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<History />}
                  onClick={() => window.location.href = '/advisory/history'}
                >
                  View History
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Help />}
                  onClick={() => setActiveTab(0)}
                >
                  Ask New Question
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ImageIcon />}
                  onClick={() => setActiveTab(1)}
                >
                  Upload Image
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Advisory;