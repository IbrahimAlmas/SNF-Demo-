import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Pagination,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FilterList,
  Eco,
  Star,
  TrendingUp,
  AccessTime,
  AttachMoney,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Practice {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cost: 'low' | 'medium' | 'high';
  estimatedTime: string;
  benefits: string[];
  images: string[];
  adoptionStats: {
    totalAdoptions: number;
    averageRating: number;
    totalRatings: number;
  };
  isFeatured: boolean;
}

const Practices: React.FC = () => {
  const { t } = useTranslation();
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    cost: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'soil_health',
    'water_management',
    'crop_rotation',
    'pest_management',
    'organic_farming',
    'energy_efficiency',
    'waste_management',
    'biodiversity',
    'climate_adaptation'
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const costs = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  useEffect(() => {
    fetchPractices();
  }, [page, searchTerm, filters]);

  const fetchPractices = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockPractices: Practice[] = [
        {
          id: '1',
          title: 'Crop Rotation System',
          description: 'Implement a systematic crop rotation plan to improve soil health and reduce pest pressure.',
          category: 'crop_rotation',
          difficulty: 'beginner',
          cost: 'low',
          estimatedTime: '2-3 hours',
          benefits: [
            'Improves soil fertility',
            'Reduces pest and disease pressure',
            'Increases crop yield',
            'Reduces need for chemical inputs'
          ],
          images: ['/images/crop-rotation.jpg'],
          adoptionStats: {
            totalAdoptions: 1250,
            averageRating: 4.5,
            totalRatings: 89
          },
          isFeatured: true
        },
        {
          id: '2',
          title: 'Drip Irrigation System',
          description: 'Install a water-efficient drip irrigation system to conserve water and improve crop health.',
          category: 'water_management',
          difficulty: 'intermediate',
          cost: 'medium',
          estimatedTime: '1-2 days',
          benefits: [
            'Saves up to 50% water',
            'Reduces weed growth',
            'Improves crop quality',
            'Reduces labor costs'
          ],
          images: ['/images/drip-irrigation.jpg'],
          adoptionStats: {
            totalAdoptions: 890,
            averageRating: 4.7,
            totalRatings: 67
          },
          isFeatured: true
        },
        {
          id: '3',
          title: 'Composting System',
          description: 'Create a composting system to recycle organic waste and improve soil health.',
          category: 'waste_management',
          difficulty: 'beginner',
          cost: 'low',
          estimatedTime: '3-4 hours',
          benefits: [
            'Reduces waste',
            'Improves soil structure',
            'Adds nutrients naturally',
            'Reduces fertilizer costs'
          ],
          images: ['/images/composting.jpg'],
          adoptionStats: {
            totalAdoptions: 2100,
            averageRating: 4.3,
            totalRatings: 156
          },
          isFeatured: false
        },
        {
          id: '4',
          title: 'Integrated Pest Management',
          description: 'Implement IPM strategies to control pests using biological and cultural methods.',
          category: 'pest_management',
          difficulty: 'intermediate',
          cost: 'medium',
          estimatedTime: '1-2 weeks',
          benefits: [
            'Reduces pesticide use',
            'Maintains beneficial insects',
            'Improves crop quality',
            'Reduces costs long-term'
          ],
          images: ['/images/ipm.jpg'],
          adoptionStats: {
            totalAdoptions: 675,
            averageRating: 4.6,
            totalRatings: 45
          },
          isFeatured: true
        },
        {
          id: '5',
          title: 'Cover Cropping',
          description: 'Plant cover crops during off-season to protect and improve soil health.',
          category: 'soil_health',
          difficulty: 'beginner',
          cost: 'low',
          estimatedTime: '2-3 hours',
          benefits: [
            'Prevents soil erosion',
            'Adds organic matter',
            'Suppresses weeds',
            'Improves soil structure'
          ],
          images: ['/images/cover-crops.jpg'],
          adoptionStats: {
            totalAdoptions: 1580,
            averageRating: 4.4,
            totalRatings: 112
          },
          isFeatured: false
        },
        {
          id: '6',
          title: 'Solar-Powered Irrigation',
          description: 'Install solar panels to power irrigation systems and reduce energy costs.',
          category: 'energy_efficiency',
          difficulty: 'advanced',
          cost: 'high',
          estimatedTime: '3-5 days',
          benefits: [
            'Reduces energy costs',
            'Environmentally friendly',
            'Low maintenance',
            'Long-term savings'
          ],
          images: ['/images/solar-irrigation.jpg'],
          adoptionStats: {
            totalAdoptions: 234,
            averageRating: 4.8,
            totalRatings: 28
          },
          isFeatured: true
        }
      ];

      // Apply filters
      let filteredPractices = mockPractices;
      
      if (searchTerm) {
        filteredPractices = filteredPractices.filter(practice =>
          practice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          practice.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filters.category) {
        filteredPractices = filteredPractices.filter(practice =>
          practice.category === filters.category
        );
      }

      if (filters.difficulty) {
        filteredPractices = filteredPractices.filter(practice =>
          practice.difficulty === filters.difficulty
        );
      }

      if (filters.cost) {
        filteredPractices = filteredPractices.filter(practice =>
          practice.cost === filters.cost
        );
      }

      setPractices(filteredPractices);
      setTotalPages(Math.ceil(filteredPractices.length / 6));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch practices');
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = async (practiceId: string) => {
    try {
      // Mock API call - replace with actual implementation
      console.log(`Adopting practice: ${practiceId}`);
      
      // Update local state
      setPractices(prev => prev.map(practice =>
        practice.id === practiceId
          ? {
              ...practice,
              adoptionStats: {
                ...practice.adoptionStats,
                totalAdoptions: practice.adoptionStats.totalAdoptions + 1
              }
            }
          : practice
      ));
    } catch (err) {
      console.error('Failed to adopt practice:', err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
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

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {t('practices.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover and adopt sustainable farming practices to improve your farm's productivity and environmental impact.
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder={t('practices.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {getCategoryLabel(category)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                label="Difficulty"
              >
                <MenuItem value="">All Levels</MenuItem>
                {difficulties.map((diff) => (
                  <MenuItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Cost</InputLabel>
              <Select
                value={filters.cost}
                onChange={(e) => setFilters({ ...filters, cost: e.target.value })}
                label="Cost"
              >
                <MenuItem value="">All Costs</MenuItem>
                {costs.map((cost) => (
                  <MenuItem key={cost.value} value={cost.value}>
                    {cost.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Practices Grid */}
      <Grid container spacing={3}>
        {practices.map((practice) => (
          <Grid item xs={12} sm={6} md={4} key={practice.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {practice.images[0] && (
                <CardMedia
                  component="img"
                  height="200"
                  image={practice.images[0]}
                  alt={practice.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="h6" component="h2">
                    {practice.title}
                  </Typography>
                  {practice.isFeatured && (
                    <Chip label="Featured" color="primary" size="small" />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {practice.description}
                </Typography>

                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                  <Chip
                    label={practice.difficulty}
                    color={getDifficultyColor(practice.difficulty) as any}
                    size="small"
                  />
                  <Chip
                    label={practice.cost}
                    color={getCostColor(practice.cost) as any}
                    size="small"
                  />
                  <Chip
                    label={getCategoryLabel(practice.category)}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {practice.estimatedTime}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Star fontSize="small" color="warning" />
                    <Typography variant="body2" color="text.secondary">
                      {practice.adoptionStats.averageRating.toFixed(1)}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <TrendingUp fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {practice.adoptionStats.totalAdoptions} adoptions
                    </Typography>
                  </Box>
                </Box>

                <Box mt="auto">
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Eco />}
                    onClick={() => handleAdopt(practice.id)}
                    sx={{ mb: 1 }}
                  >
                    {t('practices.adopt')}
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {practices.length === 0 && (
        <Box textAlign="center" py={4}>
          <Eco sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No practices found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters.
          </Typography>
        </Box>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default Practices;
