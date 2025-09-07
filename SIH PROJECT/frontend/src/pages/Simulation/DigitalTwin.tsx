import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Science,
  Agriculture,
  WaterDrop,
  WbSunny,
  AttachMoney,
  TrendingUp,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface SimulationInput {
  landSize: number;
  landSizeUnit: string;
  cropType: string;
  soilType: string;
  climateZone: string;
  waterAvailability: string;
  budget: number;
  sustainabilityGoals: string[];
}

interface SimulationResult {
  simulationId: string;
  timestamp: string;
  results: {
    estimatedYield: number;
    estimatedRevenue: number;
    estimatedCosts: number;
    estimatedProfit: number;
    sustainabilityScore: number;
    carbonFootprint: number;
    waterUsage: number;
    soilHealth: number;
  };
  recommendations: {
    category: string;
    priority: string;
    title: string;
    description: string;
    impact: string;
    cost: string;
    timeline: string;
  }[];
  riskAssessment: {
    weatherRisk: string;
    marketRisk: string;
    pestRisk: string;
    overallRisk: string;
  };
  timeline: {
    plantingSeason: string;
    harvestSeason: string;
    totalDuration: string;
  };
}

const DigitalTwin: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState<SimulationInput>({
    landSize: 0,
    landSizeUnit: 'acres',
    cropType: '',
    soilType: '',
    climateZone: '',
    waterAvailability: '',
    budget: 0,
    sustainabilityGoals: [],
  });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const landSizeUnits = [
    { value: 'acres', label: 'Acres' },
    { value: 'hectares', label: 'Hectares' },
    { value: 'square_meters', label: 'Square Meters' },
  ];

  const cropTypes = [
    'Wheat', 'Rice', 'Corn', 'Soybean', 'Tomato', 'Potato',
    'Cotton', 'Sugarcane', 'Barley', 'Oats', 'Rye'
  ];

  const soilTypes = [
    { value: 'sandy', label: 'Sandy' },
    { value: 'clay', label: 'Clay' },
    { value: 'loamy', label: 'Loamy' },
    { value: 'silty', label: 'Silty' },
  ];

  const climateZones = [
    { value: 'tropical', label: 'Tropical' },
    { value: 'subtropical', label: 'Subtropical' },
    { value: 'temperate', label: 'Temperate' },
    { value: 'continental', label: 'Continental' },
    { value: 'arid', label: 'Arid' },
  ];

  const waterAvailabilityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const sustainabilityGoalsOptions = [
    'soil_health',
    'water_management',
    'biodiversity',
    'organic_farming',
    'efficiency',
    'profitability',
  ];

  const handleInputChange = (field: keyof SimulationInput, value: any) => {
    setInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSustainabilityGoalToggle = (goal: string) => {
    setInput(prev => ({
      ...prev,
      sustainabilityGoals: prev.sustainabilityGoals.includes(goal)
        ? prev.sustainabilityGoals.filter(g => g !== goal)
        : [...prev.sustainabilityGoals, goal]
    }));
  };

  const handleRunSimulation = async () => {
    if (!input.landSize || !input.cropType || !input.soilType || !input.climateZone || !input.waterAvailability) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock simulation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockResult: SimulationResult = {
        simulationId: `sim_${Date.now()}`,
        timestamp: new Date().toISOString(),
        results: {
          estimatedYield: 3.5 * (input.landSize * (input.landSizeUnit === 'acres' ? 0.404686 : input.landSizeUnit === 'square_meters' ? 0.0001 : 1)),
          estimatedRevenue: 250 * (input.landSize * (input.landSizeUnit === 'acres' ? 0.404686 : input.landSizeUnit === 'square_meters' ? 0.0001 : 1)),
          estimatedCosts: 150 * (input.landSize * (input.landSizeUnit === 'acres' ? 0.404686 : input.landSizeUnit === 'square_meters' ? 0.0001 : 1)),
          estimatedProfit: 100 * (input.landSize * (input.landSizeUnit === 'acres' ? 0.404686 : input.landSizeUnit === 'square_meters' ? 0.0001 : 1)),
          sustainabilityScore: Math.min(95, 70 + (input.sustainabilityGoals.length * 5) + (input.waterAvailability === 'high' ? 10 : input.waterAvailability === 'medium' ? 5 : 0)),
          carbonFootprint: Math.max(0.5, 2.0 - (input.sustainabilityGoals.length * 0.2)),
          waterUsage: Math.max(2000, 5000 - (input.waterAvailability === 'high' ? 1000 : 0)),
          soilHealth: Math.min(100, 60 + (input.sustainabilityGoals.includes('soil_health') ? 20 : 0)),
        },
        recommendations: [
          {
            category: 'sustainability',
            priority: 'high',
            title: 'Improve Sustainability Practices',
            description: 'Implement crop rotation and organic farming methods to improve sustainability score',
            impact: 'Increase sustainability score by 15-20 points',
            cost: 'medium',
            timeline: '3-6 months'
          },
          {
            category: 'water_management',
            priority: 'high',
            title: 'Optimize Water Usage',
            description: 'Implement drip irrigation and water conservation techniques',
            impact: 'Reduce water usage by 30-40%',
            cost: 'high',
            timeline: '2-4 months'
          },
          {
            category: 'soil_health',
            priority: 'medium',
            title: 'Improve Soil Health',
            description: 'Add organic matter, implement cover cropping, and reduce tillage',
            impact: 'Improve soil health by 20-25 points',
            cost: 'low',
            timeline: '6-12 months'
          }
        ],
        riskAssessment: {
          weatherRisk: input.waterAvailability === 'low' ? 'high' : 'medium',
          marketRisk: 'medium',
          pestRisk: 'low',
          overallRisk: 'medium'
        },
        timeline: {
          plantingSeason: 'March-April',
          harvestSeason: 'August-September',
          totalDuration: '6 months'
        }
      };

      setResult(mockResult);
    } catch (err: any) {
      setError(err.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {t('simulation.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Run digital twin simulations to predict crop outcomes and optimize your farming operations.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Simulation Parameters
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Land Size"
                  type="number"
                  value={input.landSize}
                  onChange={(e) => handleInputChange('landSize', parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={input.landSizeUnit}
                    onChange={(e) => handleInputChange('landSizeUnit', e.target.value)}
                    label="Unit"
                  >
                    {landSizeUnits.map((unit) => (
                      <MenuItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Crop Type *</InputLabel>
                  <Select
                    value={input.cropType}
                    onChange={(e) => handleInputChange('cropType', e.target.value)}
                    label="Crop Type *"
                  >
                    {cropTypes.map((crop) => (
                      <MenuItem key={crop} value={crop}>
                        {crop}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Soil Type *</InputLabel>
                  <Select
                    value={input.soilType}
                    onChange={(e) => handleInputChange('soilType', e.target.value)}
                    label="Soil Type *"
                  >
                    {soilTypes.map((soil) => (
                      <MenuItem key={soil.value} value={soil.value}>
                        {soil.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Climate Zone *</InputLabel>
                  <Select
                    value={input.climateZone}
                    onChange={(e) => handleInputChange('climateZone', e.target.value)}
                    label="Climate Zone *"
                  >
                    {climateZones.map((zone) => (
                      <MenuItem key={zone.value} value={zone.value}>
                        {zone.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Water Availability *</InputLabel>
                  <Select
                    value={input.waterAvailability}
                    onChange={(e) => handleInputChange('waterAvailability', e.target.value)}
                    label="Water Availability *"
                  >
                    {waterAvailabilityOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Budget ($)"
                  type="number"
                  value={input.budget}
                  onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Sustainability Goals
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {sustainabilityGoalsOptions.map((goal) => (
                    <Chip
                      key={goal}
                      label={goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      onClick={() => handleSustainabilityGoalToggle(goal)}
                      color={input.sustainabilityGoals.includes(goal) ? 'primary' : 'default'}
                      variant={input.sustainabilityGoals.includes(goal) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Science />}
              onClick={handleRunSimulation}
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? 'Running Simulation...' : 'Run Simulation'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {loading && (
            <Paper sx={{ p: 3 }}>
              <Box textAlign="center">
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Running Simulation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analyzing your farming parameters and generating predictions...
                </Typography>
                <LinearProgress sx={{ mt: 2 }} />
              </Box>
            </Paper>
          )}

          {result && (
            <Box>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Simulation Results
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {result.results.estimatedYield.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estimated Yield (tons)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        ${result.results.estimatedRevenue.toFixed(0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estimated Revenue
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        ${result.results.estimatedCosts.toFixed(0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estimated Costs
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="info.main">
                        {result.results.sustainabilityScore}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sustainability Score
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>
                <List>
                  {result.recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle2">
                              {rec.title}
                            </Typography>
                            <Chip
                              label={rec.priority}
                              color={getPriorityColor(rec.priority) as any}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" paragraph>
                              {rec.description}
                            </Typography>
                            <Box display="flex" gap={1} flexWrap="wrap">
                              <Chip label={`Impact: ${rec.impact}`} size="small" variant="outlined" />
                              <Chip label={`Cost: ${rec.cost}`} size="small" variant="outlined" />
                              <Chip label={`Timeline: ${rec.timeline}`} size="small" variant="outlined" />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Risk Assessment
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h6" color={getRiskColor(result.riskAssessment.weatherRisk)}>
                        {result.riskAssessment.weatherRisk.toUpperCase()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Weather Risk
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h6" color={getRiskColor(result.riskAssessment.overallRisk)}>
                        {result.riskAssessment.overallRisk.toUpperCase()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Overall Risk
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DigitalTwin;
