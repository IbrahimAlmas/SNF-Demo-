import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  Zoom,
  Grow,
  LinearProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Send,
  PhotoCamera,
  Science,
  Eco,
  WaterDrop,
  WbSunny,
  BugReport,
  LocalFlorist,
  Assessment,
  History,
  Refresh,
  Star,
  TrendingUp,
  Lightbulb,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Advisory: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [queryType, setQueryType] = useState<'text' | 'image'>('text');

  const quickQueries = [
    {
      title: 'Crop Disease Detection',
      description: 'Upload an image to identify plant diseases',
      icon: <BugReport />,
      color: '#f44336',
      type: 'image' as const,
    },
    {
      title: 'Soil Analysis',
      description: 'Get recommendations for soil improvement',
      icon: <Eco />,
      color: '#8d6e63',
      type: 'text' as const,
    },
    {
      title: 'Water Management',
      description: 'Optimize irrigation and water usage',
      icon: <WaterDrop />,
      color: '#2196f3',
      type: 'text' as const,
    },
    {
      title: 'Weather Impact',
      description: 'Understand weather effects on crops',
      icon: <WbSunny />,
      color: '#ff9800',
      type: 'text' as const,
    },
    {
      title: 'Fertilizer Advice',
      description: 'Get personalized fertilizer recommendations',
      icon: <LocalFlorist />,
      color: '#4caf50',
      type: 'text' as const,
    },
    {
      title: 'Yield Optimization',
      description: 'Maximize your crop yield potential',
      icon: <TrendingUp />,
      color: '#9c27b0',
      type: 'text' as const,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !imageFile) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResponse({
        type: queryType,
        query: query || 'Image analysis',
        response: `Based on your ${queryType === 'text' ? 'query' : 'image'}, here are my recommendations:

1. **Immediate Actions:**
   - Check soil moisture levels regularly
   - Apply organic compost to improve soil health
   - Monitor for signs of pest infestation

2. **Long-term Strategies:**
   - Implement crop rotation to prevent soil depletion
   - Consider companion planting for natural pest control
   - Invest in drip irrigation for water efficiency

3. **Expected Outcomes:**
   - 15-20% increase in yield within 3 months
   - Reduced water usage by 25%
   - Improved soil health and biodiversity

4. **Risk Factors to Watch:**
   - Monitor weather patterns for extreme conditions
   - Check for signs of nutrient deficiency
   - Regular pest and disease inspection

Would you like me to elaborate on any of these recommendations?`,
        confidence: 87,
        timestamp: new Date().toISOString(),
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleQuickQuery = (query: typeof quickQueries[0]) => {
    setQueryType(query.type);
    if (query.type === 'text') {
      setQuery(`I need help with ${query.title.toLowerCase()}`);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setQueryType('image');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in={true} timeout={1000}>
        <Box mb={4}>
          <Typography variant="h3" fontWeight="bold" mb={2}>
            AI Advisory Center
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={3}>
            Get personalized farming advice powered by artificial intelligence
          </Typography>
          
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip
              icon={<Science />}
              label="AI-Powered"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<Eco />}
              label="Sustainable"
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<Assessment />}
              label="Real-time"
              color="warning"
              variant="outlined"
            />
          </Box>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        {/* Query Input */}
        <Grid item xs={12} md={8}>
          <Slide direction="up" in={true} timeout={1000} delay={200}>
            <Paper
              elevation={8}
              sx={{
                p: 4,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(46, 125, 50, 0.1)',
              }}
            >
              <Typography variant="h5" fontWeight="bold" mb={3}>
                Ask Your Question
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Describe your farming challenge or question..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={queryType === 'image'}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontSize: '1.1rem',
                    },
                  }}
                />

                <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                  <Button
                    variant="contained"
                    startIcon={<PhotoCamera />}
                    component="label"
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                    }}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>

                  {imageFile && (
                    <Chip
                      label={`${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(2)} MB)`}
                      onDelete={() => setImageFile(null)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading || (!query.trim() && !imageFile)}
                  startIcon={isLoading ? <Refresh /> : <Send />}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
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
                  {isLoading ? 'Analyzing...' : 'Get AI Advice'}
                </Button>
              </form>

              {isLoading && (
                <Box mt={3}>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    AI is analyzing your query...
                  </Typography>
                  <LinearProgress
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      background: 'rgba(46, 125, 50, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              )}
            </Paper>
          </Slide>
        </Grid>

        {/* Quick Queries */}
        <Grid item xs={12} md={4}>
          <Slide direction="left" in={true} timeout={1000} delay={400}>
            <Paper
              elevation={8}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%)',
                border: '1px solid rgba(46, 125, 50, 0.1)',
                height: 'fit-content',
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Quick Queries
              </Typography>

              <List>
                {quickQueries.map((item, index) => (
                  <Grow
                    key={item.title}
                    in={true}
                    timeout={800}
                    delay={600 + index * 100}
                  >
                    <ListItem disablePadding sx={{ mb: 2 }}>
                      <ListItemButton
                        onClick={() => handleQuickQuery(item)}
                        sx={{
                          borderRadius: 3,
                          p: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: `${item.color}15`,
                            transform: 'translateX(8px)',
                          },
                        }}
                      >
                        <ListItemIcon>
                          <Avatar
                            sx={{
                              bgcolor: item.color,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {item.icon}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          secondary={item.description}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            fontSize: '0.95rem',
                          }}
                          secondaryTypographyProps={{
                            fontSize: '0.85rem',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Grow>
                ))}
              </List>
            </Paper>
          </Slide>
        </Grid>

        {/* Response */}
        {response && (
          <Grid item xs={12}>
            <Fade in={true} timeout={1000}>
              <Paper
                elevation={8}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
                  border: '1px solid rgba(46, 125, 50, 0.2)',
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 48,
                      height: 48,
                    }}
                  >
                    <Science />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      AI Recommendation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Confidence: {response.confidence}% • {new Date(response.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box ml="auto">
                    <Chip
                      icon={<Star />}
                      label="High Quality"
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box
                  sx={{
                    '& h3': {
                      color: 'primary.main',
                      fontWeight: 'bold',
                      mb: 2,
                      mt: 3,
                    },
                    '& h4': {
                      color: 'text.primary',
                      fontWeight: 'bold',
                      mb: 1,
                      mt: 2,
                    },
                    '& ul': {
                      pl: 3,
                      mb: 2,
                    },
                    '& li': {
                      mb: 1,
                    },
                    '& p': {
                      mb: 2,
                      lineHeight: 1.6,
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: response.response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                  }}
                />

                <Box mt={4} display="flex" gap={2} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    startIcon={<History />}
                    sx={{ borderRadius: 3 }}
                  >
                    Save to History
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Lightbulb />}
                    sx={{ borderRadius: 3 }}
                  >
                    Get More Details
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    sx={{
                      borderRadius: 3,
                      background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                    }}
                  >
                    Ask Follow-up
                  </Button>
                </Box>
              </Paper>
            </Fade>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Advisory;