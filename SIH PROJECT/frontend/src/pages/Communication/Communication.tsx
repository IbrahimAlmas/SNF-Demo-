import React, { useState } from 'react';
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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Send,
  Message,
  Sms,
  WhatsApp,
  Email,
  History,
  Template,
  Broadcast,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface MessageTemplate {
  id: string;
  name: string;
  message: string;
  category: string;
  channels: string[];
}

interface MessageHistory {
  id: string;
  type: 'sms' | 'whatsapp' | 'email';
  to: string;
  message: string;
  status: 'sent' | 'delivered' | 'failed';
  timestamp: string;
}

const Communication: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [messageData, setMessageData] = useState({
    to: '',
    message: '',
    channel: 'sms',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const templates: MessageTemplate[] = [
    {
      id: '1',
      name: 'Advisory Response Ready',
      message: 'Your agricultural advisory query has been processed. Check the app for detailed recommendations.',
      category: 'advisory',
      channels: ['sms', 'whatsapp']
    },
    {
      id: '2',
      name: 'Urgent Advisory',
      message: 'URGENT: Your crop shows signs of disease. Immediate action required. Check the app for treatment recommendations.',
      category: 'advisory',
      channels: ['sms', 'whatsapp']
    },
    {
      id: '3',
      name: 'Practice Reminder',
      message: 'Reminder: Time to implement your adopted sustainable practice. Check the app for step-by-step guidance.',
      category: 'practices',
      channels: ['sms', 'whatsapp']
    },
    {
      id: '4',
      name: 'Weather Alert',
      message: 'Weather Alert: Heavy rain expected in your area. Take necessary precautions for your crops.',
      category: 'weather',
      channels: ['sms', 'whatsapp']
    },
    {
      id: '5',
      name: 'Level Up',
      message: '🎉 Congratulations! You have reached level {level} and earned {xp} XP. Keep farming sustainably!',
      category: 'gamification',
      channels: ['sms', 'whatsapp']
    }
  ];

  const messageHistory: MessageHistory[] = [
    {
      id: '1',
      type: 'sms',
      to: '+1234567890',
      message: 'Your crop disease query has been answered',
      status: 'delivered',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'whatsapp',
      to: '+1234567890',
      message: 'Weather alert: Heavy rain expected',
      status: 'sent',
      timestamp: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      type: 'email',
      to: 'farmer@example.com',
      message: 'Monthly farming report available',
      status: 'delivered',
      timestamp: '2024-01-13T09:15:00Z'
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSendMessage = async () => {
    if (!messageData.to || !messageData.message) {
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess(`Message sent successfully via ${messageData.channel.toUpperCase()}`);
      setMessageData({ to: '', message: '', channel: 'sms' });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = (template: MessageTemplate) => {
    setMessageData(prev => ({
      ...prev,
      message: template.message,
      channel: template.channels[0]
    }));
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Sms />;
      case 'whatsapp': return <WhatsApp />;
      case 'email': return <Email />;
      default: return <Message />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'sent': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {t('communication.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Send messages via SMS, WhatsApp, or email to farmers and manage your communication history.
        </Typography>
      </Box>

      <Paper>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Send />} label="Send Message" />
          <Tab icon={<Template />} label="Templates" />
          <Tab icon={<History />} label="Message History" />
          <Tab icon={<Broadcast />} label="Broadcast" />
        </Tabs>

        <Box p={3}>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Send New Message
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Channel</InputLabel>
                      <Select
                        value={messageData.channel}
                        onChange={(e) => setMessageData(prev => ({ ...prev, channel: e.target.value }))}
                        label="Channel"
                      >
                        <MenuItem value="sms">SMS</MenuItem>
                        <MenuItem value="whatsapp">WhatsApp</MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="To (Phone/Email)"
                      value={messageData.to}
                      onChange={(e) => setMessageData(prev => ({ ...prev, to: e.target.value }))}
                      placeholder="+1234567890 or email@example.com"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Message"
                      value={messageData.message}
                      onChange={(e) => setMessageData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Type your message here..."
                    />
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : getChannelIcon(messageData.channel)}
                    onClick={handleSendMessage}
                    disabled={loading || !messageData.to || !messageData.message}
                    size="large"
                  >
                    {loading ? 'Sending...' : `Send via ${messageData.channel.toUpperCase()}`}
                  </Button>
                </Box>

                {success && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {success}
                  </Alert>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Tips
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText primary="SMS: Keep messages under 160 characters" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText primary="WhatsApp: Supports longer messages and media" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText primary="Email: Best for detailed information" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Message Templates
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Use pre-defined templates for common messages.
              </Typography>

              <Grid container spacing={2}>
                {templates.map((template) => (
                  <Grid item xs={12} md={6} key={template.id}>
                    <Card>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Typography variant="h6">
                            {template.name}
                          </Typography>
                          <Chip label={template.category} size="small" />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {template.message}
                        </Typography>

                        <Box display="flex" gap={1} mb={2}>
                          {template.channels.map((channel) => (
                            <Chip
                              key={channel}
                              icon={getChannelIcon(channel)}
                              label={channel.toUpperCase()}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleUseTemplate(template)}
                        >
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Message History
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                View your recent message activity.
              </Typography>

              <List>
                {messageHistory.map((message) => (
                  <ListItem key={message.id} divider>
                    <ListItemIcon>
                      {getChannelIcon(message.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">
                            To: {message.to}
                          </Typography>
                          <Chip
                            label={message.status}
                            color={getStatusColor(message.status) as any}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" paragraph>
                            {message.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(message.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Broadcast Message
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Send the same message to multiple farmers at once.
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                Broadcast functionality requires additional setup and farmer consent. Contact support for more information.
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Target Group</InputLabel>
                    <Select
                      label="Target Group"
                      disabled
                    >
                      <MenuItem value="all">All Farmers</MenuItem>
                      <MenuItem value="region">By Region</MenuItem>
                      <MenuItem value="crop">By Crop Type</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Channel</InputLabel>
                    <Select
                      label="Channel"
                      disabled
                    >
                      <MenuItem value="sms">SMS</MenuItem>
                      <MenuItem value="whatsapp">WhatsApp</MenuItem>
                      <MenuItem value="email">Email</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Broadcast Message"
                    placeholder="Type your broadcast message here..."
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<Broadcast />}
                    disabled
                    size="large"
                  >
                    Send Broadcast
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Communication;
