import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  Alert,
  Fade,
  Slide,
  Zoom,
  Grow,
  Fab,
  Tooltip,
  Badge,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Eco,
  WaterDrop,
  WbSunny,
  BugReport,
  LocalFlorist,
  TrendingUp,
  Star,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Schedule,
  Assessment,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface SustainablePractice {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  cost: 'Low' | 'Medium' | 'High';
  environmentalImpact: number;
  economicBenefit: number;
  implementationSteps: string[];
  requirements: string[];
  benefits: string[];
  challenges: string[];
  resources: string[];
  isImplemented: boolean;
  implementationDate?: string;
  progress?: number;
  rating?: number;
  notes?: string;
}

const Practices: React.FC = () => {
  const { t } = useTranslation();
  const [practices, setPractices] = useState<SustainablePractice[]>([]);
  const [filteredPractices, setFilteredPractices] = useState<SustainablePractice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPractice, setEditingPractice] = useState<SustainablePractice | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = [
    'Water Management',
    'Soil Health',
    'Pest Control',
    'Crop Rotation',
    'Energy Efficiency',
    'Waste Management',
    'Biodiversity',
    'Climate Adaptation',
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const costs = ['Low', 'Medium', 'High'];
  const statuses = ['All', 'Implemented', 'Not Implemented', 'In Progress'];

  useEffect(() => {
    fetchPractices();
  }, []);

  useEffect(() => {
    filterPractices();
  }, [practices, searchTerm, filterCategory, filterDifficulty, filterStatus]);

  const fetchPractices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/practices/my-practices', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPractices(data.practices || []);
      } else {
        // If no practices exist, show empty state
        setPractices([]);
      }
    } catch (error) {
      console.error('Error fetching practices:', error);
      setMessage({ type: 'error', text: 'Failed to load practices' });
      setPractices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPractices = () => {
    let filtered = practices;

    if (searchTerm) {
      filtered = filtered.filter(practice =>
        practice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        practice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        practice.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(practice => practice.category === filterCategory);
    }

    if (filterDifficulty) {
      filtered = filtered.filter(practice => practice.difficulty === filterDifficulty);
    }

    if (filterStatus === 'Implemented') {
      filtered = filtered.filter(practice => practice.isImplemented);
    } else if (filterStatus === 'Not Implemented') {
      filtered = filtered.filter(practice => !practice.isImplemented);
    } else if (filterStatus === 'In Progress') {
      filtered = filtered.filter(practice => practice.progress && practice.progress > 0 && practice.progress < 100);
    }

    setFilteredPractices(filtered);
  };

  const handleAddPractice = () => {
    setEditingPractice({
      _id: '',
      title: '',
      description: '',
      category: '',
      difficulty: 'Beginner',
      estimatedTime: '',
      cost: 'Low',
      environmentalImpact: 0,
      economicBenefit: 0,
      implementationSteps: [''],
      requirements: [''],
      benefits: [''],
      challenges: [''],
      resources: [''],
      isImplemented: false,
    });
    setOpenDialog(true);
  };

  const handleEditPractice = (practice: SustainablePractice) => {
    setEditingPractice(practice);
    setOpenDialog(true);
  };

  const handleSavePractice = async () => {
    if (!editingPractice) return;

    try {
      const method = editingPractice._id ? 'PUT' : 'POST';
      const url = editingPractice._id ? `/api/practices/${editingPractice._id}` : '/api/practices';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editingPractice),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Practice saved successfully!' });
        fetchPractices();
        setOpenDialog(false);
        setEditingPractice(null);
      } else {
        throw new Error('Failed to save practice');
      }
    } catch (error) {
      console.error('Error saving practice:', error);
      setMessage({ type: 'error', text: 'Failed to save practice' });
    }
  };

  const handleDeletePractice = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this practice?')) return;

    try {
      const response = await fetch(`/api/practices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Practice deleted successfully!' });
        fetchPractices();
      } else {
        throw new Error('Failed to delete practice');
      }
    } catch (error) {
      console.error('Error deleting practice:', error);
      setMessage({ type: 'error', text: 'Failed to delete practice' });
    }
  };

  const handleImplementPractice = async (practice: SustainablePractice) => {
    try {
      const response = await fetch(`/api/practices/${practice._id}/implement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          isImplemented: !practice.isImplemented,
          implementationDate: !practice.isImplemented ? new Date().toISOString() : undefined,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Practice status updated!' });
        fetchPractices();
      } else {
        throw new Error('Failed to update practice status');
      }
    } catch (error) {
      console.error('Error updating practice status:', error);
      setMessage({ type: 'error', text: 'Failed to update practice status' });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Water Management': return <WaterDrop />;
      case 'Soil Health': return <Eco />;
      case 'Pest Control': return <BugReport />;
      case 'Crop Rotation': return <LocalFlorist />;
      case 'Energy Efficiency': return <WbSunny />;
      case 'Waste Management': return <Assessment />;
      case 'Biodiversity': return <TrendingUp />;
      default: return <Eco />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <Typography variant="h6" color="text.secondary">
              Loading sustainable practices...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in={true} timeout={1000}>
        <Box mb={4}>
          <Typography variant="h3" fontWeight="bold" mb={2}>
            Sustainable Practices
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={3}>
            Discover and implement eco-friendly farming practices
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

      {/* Search and Filters */}
      <Slide direction="down" in={true} timeout={1000} delay={200}>
        <Paper elevation={4} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search practices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  label="Difficulty"
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {difficulties.map((difficulty) => (
                    <MenuItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('');
                  setFilterDifficulty('');
                  setFilterStatus('');
                }}
                sx={{ borderRadius: 2 }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Slide>

      {/* Practices Grid */}
      <Grid container spacing={3}>
        {filteredPractices.length > 0 ? (
          filteredPractices.map((practice, index) => (
            <Grid item xs={12} sm={6} md={4} key={practice._id}>
              <Grow in={true} timeout={800} delay={index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          mr: 2,
                        }}
                      >
                        {getCategoryIcon(practice.category)}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {practice.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {practice.category}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={3} sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
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
                        label={practice.estimatedTime}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Environmental Impact
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {practice.environmentalImpact}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={practice.environmentalImpact}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        mb: 2,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'success.main',
                        },
                      }}
                    />

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Economic Benefit
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        {practice.economicBenefit}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={practice.economicBenefit}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        mb: 2,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'primary.main',
                        },
                      }}
                    />

                    {practice.isImplemented && (
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <CheckCircle color="success" fontSize="small" />
                        <Typography variant="body2" color="success.main" fontWeight="medium">
                          Implemented
                        </Typography>
                        {practice.implementationDate && (
                          <Typography variant="caption" color="text.secondary">
                            ({new Date(practice.implementationDate).toLocaleDateString()})
                          </Typography>
                        )}
                      </Box>
                    )}

                    {practice.progress && practice.progress > 0 && practice.progress < 100 && (
                      <Box mb={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {practice.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={practice.progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: 'warning.main',
                            },
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleEditPractice(practice)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      startIcon={practice.isImplemented ? <CheckCircle /> : <Schedule />}
                      onClick={() => handleImplementPractice(practice)}
                      color={practice.isImplemented ? 'success' : 'primary'}
                    >
                      {practice.isImplemented ? 'Implemented' : 'Implement'}
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePractice(practice._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Fade in={true} timeout={1000}>
              <Paper
                elevation={4}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%)',
                }}
              >
                <Eco sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  No Practices Found
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={4}>
                  {searchTerm || filterCategory || filterDifficulty || filterStatus
                    ? 'Try adjusting your search criteria'
                    : 'Start by adding your first sustainable practice'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddPractice}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                  }}
                >
                  Add Practice
                </Button>
              </Paper>
            </Fade>
          </Grid>
        )}
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add practice"
        onClick={handleAddPractice}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1b5e20, #2e7d32)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Add />
      </Fab>

      {/* Add/Edit Practice Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            {editingPractice?._id ? 'Edit Practice' : 'Add New Practice'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {editingPractice && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Practice Title"
                    value={editingPractice.title}
                    onChange={(e) => setEditingPractice({
                      ...editingPractice,
                      title: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={editingPractice.description}
                    onChange={(e) => setEditingPractice({
                      ...editingPractice,
                      description: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={editingPractice.category}
                      onChange={(e) => setEditingPractice({
                        ...editingPractice,
                        category: e.target.value
                      })}
                      label="Category"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      value={editingPractice.difficulty}
                      onChange={(e) => setEditingPractice({
                        ...editingPractice,
                        difficulty: e.target.value as any
                      })}
                      label="Difficulty"
                    >
                      {difficulties.map((difficulty) => (
                        <MenuItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Estimated Time"
                    value={editingPractice.estimatedTime}
                    onChange={(e) => setEditingPractice({
                      ...editingPractice,
                      estimatedTime: e.target.value
                    })}
                    placeholder="e.g., 2-3 hours, 1 week"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Cost</InputLabel>
                    <Select
                      value={editingPractice.cost}
                      onChange={(e) => setEditingPractice({
                        ...editingPractice,
                        cost: e.target.value as any
                      })}
                      label="Cost"
                    >
                      {costs.map((cost) => (
                        <MenuItem key={cost} value={cost}>
                          {cost}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Environmental Impact (%)"
                    value={editingPractice.environmentalImpact}
                    onChange={(e) => setEditingPractice({
                      ...editingPractice,
                      environmentalImpact: Number(e.target.value)
                    })}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Economic Benefit (%)"
                    value={editingPractice.economicBenefit}
                    onChange={(e) => setEditingPractice({
                      ...editingPractice,
                      economicBenefit: Number(e.target.value)
                    })}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Implementation Steps (one per line)"
                    value={editingPractice.implementationSteps.join('\n')}
                    onChange={(e) => setEditingPractice({
                      ...editingPractice,
                      implementationSteps: e.target.value.split('\n').filter(step => step.trim())
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Requirements (one per line)"
                    value={editingPractice.requirements.join('\n')}
                    onChange={(e) => setEditingPractice({
                      ...editingPractice,
                      requirements: e.target.value.split('\n').filter(req => req.trim())
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Benefits (one per line)"
                    value={editingPractice.benefits.join('\n')}
                    onChange={(e) => setEditingPractice({
                      ...editingPractice,
                      benefits: e.target.value.split('\n').filter(benefit => benefit.trim())
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Challenges (one per line)"
                    value={editingPractice.challenges.join('\n')}
                    onChange={(e) => setEditingPractice({
                      ...editingPractice,
                      challenges: e.target.value.split('\n').filter(challenge => challenge.trim())
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Resources (one per line)"
                    value={editingPractice.resources.join('\n')}
                    onChange={(e) => setEditingPractice({
                      ...editingPractice,
                      resources: e.target.value.split('\n').filter(resource => resource.trim())
                    })}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePractice}
            startIcon={<Save />}
            sx={{
              background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
            }}
          >
            Save Practice
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Practices;