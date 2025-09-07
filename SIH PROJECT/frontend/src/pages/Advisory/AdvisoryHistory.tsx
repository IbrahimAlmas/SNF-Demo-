import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Card,
  CardContent,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Visibility,
  ThumbUp,
  ThumbDown,
  Help,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface AdvisoryHistoryItem {
  id: string;
  query: string;
  type: 'text' | 'image';
  response: {
    text: string;
    confidence: number;
    recommendations: string[];
  };
  status: 'completed' | 'processing' | 'failed';
  createdAt: string;
  feedback?: {
    rating: number;
    helpful: boolean;
  };
}

const AdvisoryHistory: React.FC = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<AdvisoryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockHistory: AdvisoryHistoryItem[] = [
        {
          id: '1',
          query: 'My tomato plants have yellow leaves with brown spots. What could be wrong?',
          type: 'text',
          response: {
            text: 'Based on your description, this appears to be early blight affecting your tomato plants. The symptoms you\'ve described are consistent with this fungal disease.',
            confidence: 0.87,
            recommendations: [
              'Apply copper-based fungicide every 7-10 days',
              'Improve air circulation by pruning dense foliage',
              'Water at the base of plants to avoid wetting leaves'
            ]
          },
          status: 'completed',
          createdAt: '2024-01-15T10:30:00Z',
          feedback: {
            rating: 5,
            helpful: true
          }
        },
        {
          id: '2',
          query: 'Crop disease analysis',
          type: 'image',
          response: {
            text: 'I can see signs of early blight on your tomato plants. The dark spots with concentric rings are characteristic of this fungal disease.',
            confidence: 0.92,
            recommendations: [
              'Apply copper fungicide immediately',
              'Remove affected leaves carefully',
              'Improve air circulation around plants'
            ]
          },
          status: 'completed',
          createdAt: '2024-01-14T14:20:00Z'
        },
        {
          id: '3',
          query: 'What is the best time to plant corn in my region?',
          type: 'text',
          response: {
            text: 'For your region, the optimal planting time for corn is typically between mid-April and early May, when soil temperatures reach 50-55°F.',
            confidence: 0.78,
            recommendations: [
              'Test soil temperature before planting',
              'Ensure soil is well-drained',
              'Consider weather forecast for frost-free period'
            ]
          },
          status: 'completed',
          createdAt: '2024-01-13T09:15:00Z',
          feedback: {
            rating: 4,
            helpful: true
          }
        }
      ];

      setHistory(mockHistory);
      setTotalPages(1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (id: string, helpful: boolean) => {
    try {
      // Mock API call - replace with actual implementation
      console.log(`Feedback for ${id}: ${helpful ? 'helpful' : 'not helpful'}`);
      
      // Update local state
      setHistory(prev => prev.map(item => 
        item.id === id 
          ? { ...item, feedback: { rating: helpful ? 5 : 1, helpful } }
          : item
      ));
    } catch (err) {
      console.error('Failed to submit feedback:', err);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          {t('advisory.history')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your past advisory queries and responses.
        </Typography>
      </Box>

      {history.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Help sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {t('advisory.noHistory')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start by asking your first question in the Advisory section.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {history.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {item.type === 'image' ? (
                      <ImageIcon color="primary" />
                    ) : (
                      <Help color="primary" />
                    )}
                    <Typography variant="h6">
                      {item.type === 'image' ? 'Image Query' : 'Text Query'}
                    </Typography>
                    <Chip
                      label={getConfidenceLabel(item.response.confidence)}
                      color={getConfidenceColor(item.response.confidence) as any}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(item.createdAt)}
                  </Typography>
                </Box>

                <Typography variant="body1" paragraph>
                  <strong>Query:</strong> {item.query}
                </Typography>

                <Typography variant="body1" paragraph>
                  <strong>Response:</strong> {item.response.text}
                </Typography>

                {item.response.recommendations.length > 0 && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Recommendations:
                    </Typography>
                    <List dense>
                      {item.response.recommendations.map((rec, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemText
                            primary={`• ${rec}`}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    {item.feedback ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" color="text.secondary">
                          Feedback: {item.feedback.helpful ? 'Helpful' : 'Not Helpful'}
                        </Typography>
                        <Chip
                          label={`${item.feedback.rating}/5`}
                          color={item.feedback.helpful ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    ) : (
                      <Box display="flex" gap={1}>
                        <Typography variant="body2" color="text.secondary">
                          Was this helpful?
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleFeedback(item.id, true)}
                          color="success"
                        >
                          <ThumbUp />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleFeedback(item.id, false)}
                          color="error"
                        >
                          <ThumbDown />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  <IconButton>
                    <Visibility />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default AdvisoryHistory;
