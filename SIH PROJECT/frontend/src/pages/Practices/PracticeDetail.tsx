import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Grid,
  Rating,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Eco,
  CheckCircle,
  AccessTime,
  AttachMoney,
  Star,
  TrendingUp,
  Send,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface PracticeDetail {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cost: 'low' | 'medium' | 'high';
  estimatedTime: string;
  benefits: string[];
  requirements: string[];
  steps: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
  images: string[];
  adoptionStats: {
    totalAdoptions: number;
    averageRating: number;
    totalRatings: number;
  };
  environmentalImpact: {
    carbonReduction: number;
    waterConservation: number;
    soilHealth: number;
    biodiversity: number;
  };
}

const PracticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [practice, setPractice] = useState<PracticeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adopted, setAdopted] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPracticeDetail(id);
    }
  }, [id]);

  const fetchPracticeDetail = async (practiceId: string) => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockPractice: PracticeDetail = {
        id: practiceId,
        title: 'Crop Rotation System',
        description: 'Implement a systematic crop rotation plan to improve soil health and reduce pest pressure.',
        detailedDescription: 'Crop rotation is a fundamental practice in sustainable agriculture that involves growing different types of crops in the same area in sequential seasons. This practice helps maintain soil fertility, reduces pest and disease pressure, and improves overall crop yield. A well-planned crop rotation system considers the nutrient needs of different crops, their root structures, and their susceptibility to pests and diseases.',
        category: 'crop_rotation',
        difficulty: 'beginner',
        cost: 'low',
        estimatedTime: '2-3 hours',
        benefits: [
          'Improves soil fertility and structure',
          'Reduces pest and disease pressure',
          'Increases crop yield and quality',
          'Reduces need for chemical inputs',
          'Improves water retention',
          'Supports beneficial soil microorganisms'
        ],
        requirements: [
          'Knowledge of crop families and their characteristics',
          'Planning tools (paper, digital, or software)',
          'Access to different crop seeds',
          'Basic understanding of soil types',
          'Time for planning and implementation'
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Analyze Your Current Situation',
            description: 'Assess your current crops, soil conditions, and pest/disease history. Identify problem areas and areas of success.'
          },
          {
            stepNumber: 2,
            title: 'Plan Your Rotation Sequence',
            description: 'Design a 3-4 year rotation plan considering crop families, nutrient needs, and seasonal requirements.'
          },
          {
            stepNumber: 3,
            title: 'Prepare Your Fields',
            description: 'Clear fields, test soil, and prepare for the first crop in your rotation sequence.'
          },
          {
            stepNumber: 4,
            title: 'Implement and Monitor',
            description: 'Plant according to your plan and monitor crop health, yields, and soil conditions throughout the season.'
          },
          {
            stepNumber: 5,
            title: 'Evaluate and Adjust',
            description: 'At the end of each season, evaluate the results and adjust your rotation plan for the following year.'
          }
        ],
        images: ['/images/crop-rotation-1.jpg', '/images/crop-rotation-2.jpg'],
        adoptionStats: {
          totalAdoptions: 1250,
          averageRating: 4.5,
          totalRatings: 89
        },
        environmentalImpact: {
          carbonReduction: 25,
          waterConservation: 15,
          soilHealth: 40,
          biodiversity: 30
        }
      };

      setPractice(mockPractice);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch practice details');
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = async () => {
    try {
      // Mock API call - replace with actual implementation
      console.log(`Adopting practice: ${id}`);
      setAdopted(true);
      
      // Update adoption stats
      if (practice) {
        setPractice({
          ...practice,
          adoptionStats: {
            ...practice.adoptionStats,
            totalAdoptions: practice.adoptionStats.totalAdoptions + 1
          }
        });
      }
    } catch (err) {
      console.error('Failed to adopt practice:', err);
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) return;

    try {
      setSubmittingReview(true);
      // Mock API call - replace with actual implementation
      console.log(`Submitting review for practice ${id}: ${rating} stars - ${review}`);
      
      // Update rating stats
      if (practice) {
        const newTotalRatings = practice.adoptionStats.totalRatings + 1;
        const newAverageRating = (
          (practice.adoptionStats.averageRating * practice.adoptionStats.totalRatings + rating) / 
          newTotalRatings
        );
        
        setPractice({
          ...practice,
          adoptionStats: {
            ...practice.adoptionStats,
            averageRating: newAverageRating,
            totalRatings: newTotalRatings
          }
        });
      }

      setRating(0);
      setReview('');
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
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

  if (!practice) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mt: 2 }}>
          Practice not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/practices')}
          sx={{ mb: 2 }}
        >
          Back to Practices
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Typography variant="h4" gutterBottom>
                {practice.title}
              </Typography>
              <Box display="flex" gap={1}>
                <Chip
                  label={practice.difficulty}
                  color={getDifficultyColor(practice.difficulty) as any}
                />
                <Chip
                  label={practice.cost}
                  color={getCostColor(practice.cost) as any}
                />
                <Chip
                  label={getCategoryLabel(practice.category)}
                  variant="outlined"
                />
              </Box>
            </Box>

            <Typography variant="body1" paragraph>
              {practice.description}
            </Typography>

            <Typography variant="body1" paragraph>
              {practice.detailedDescription}
            </Typography>

            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTime color="action" />
                <Typography variant="body2" color="text.secondary">
                  {practice.estimatedTime}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Star color="warning" />
                <Typography variant="body2" color="text.secondary">
                  {practice.adoptionStats.averageRating.toFixed(1)} ({practice.adoptionStats.totalRatings} reviews)
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp color="action" />
                <Typography variant="body2" color="text.secondary">
                  {practice.adoptionStats.totalAdoptions} adoptions
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<Eco />}
              onClick={handleAdopt}
              disabled={adopted}
              sx={{ mb: 3 }}
            >
              {adopted ? 'Adopted' : t('practices.adopt')}
            </Button>

            {adopted && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Congratulations! You have successfully adopted this practice. Check your dashboard for implementation guidance.
              </Alert>
            )}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Benefits
            </Typography>
            <List>
              {practice.benefits.map((benefit, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Requirements
            </Typography>
            <List>
              {practice.requirements.map((requirement, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${requirement}`} />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Implementation Steps
            </Typography>
            {practice.steps.map((step) => (
              <Card key={step.stepNumber} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Step {step.stepNumber}: {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Environmental Impact
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {practice.environmentalImpact.carbonReduction}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Carbon Reduction
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {practice.environmentalImpact.waterConservation}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Water Conservation
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {practice.environmentalImpact.soilHealth}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Soil Health
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {practice.environmentalImpact.biodiversity}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Biodiversity
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rate this Practice
            </Typography>
            <Box mb={2}>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue || 0)}
                size="large"
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write a review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              fullWidth
              startIcon={<Send />}
              onClick={handleSubmitReview}
              disabled={rating === 0 || submittingReview}
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Related Practices
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explore other sustainable practices in the same category.
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/practices')}
            >
              Browse All Practices
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PracticeDetail;
