const express = require('express');
const twilio = require('twilio');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize Twilio client (only if credentials are provided)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } catch (error) {
    console.warn('Twilio initialization failed:', error.message);
  }
}

// @route   POST /api/communication/sms
// @desc    Send SMS message
// @access  Private
router.post('/sms', [
  auth,
  body('to').isMobilePhone().withMessage('Valid phone number is required'),
  body('message').trim().isLength({ min: 1, max: 1600 }).withMessage('Message must be between 1 and 1600 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { to, message } = req.body;

    // In production, you would validate that the farmer has SMS notifications enabled
    if (!req.farmer.preferences.notifications.sms) {
      return res.status(400).json({ message: 'SMS notifications are disabled for this account' });
    }

    if (!twilioClient) {
      // Mock response when Twilio is not configured
      res.json({
        message: 'SMS sent successfully (demo mode)',
        sms: {
          sid: `demo_sms_${Date.now()}`,
          status: 'sent',
          to: to,
          from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
          body: message,
          createdAt: new Date().toISOString()
        }
      });
      return;
    }

    try {
      const smsMessage = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });

      res.json({
        message: 'SMS sent successfully',
        sms: {
          sid: smsMessage.sid,
          status: smsMessage.status,
          to: smsMessage.to,
          from: smsMessage.from,
          body: smsMessage.body,
          createdAt: smsMessage.dateCreated
        }
      });
    } catch (twilioError) {
      console.error('Twilio SMS error:', twilioError);
      res.status(500).json({ 
        message: 'Failed to send SMS',
        error: twilioError.message
      });
    }
  } catch (error) {
    console.error('SMS communication error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/communication/whatsapp
// @desc    Send WhatsApp message
// @access  Private
router.post('/whatsapp', [
  auth,
  body('to').isMobilePhone().withMessage('Valid phone number is required'),
  body('message').trim().isLength({ min: 1, max: 4096 }).withMessage('Message must be between 1 and 4096 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { to, message } = req.body;

    // In production, you would validate that the farmer has WhatsApp notifications enabled
    if (!req.farmer.preferences.notifications.whatsapp) {
      return res.status(400).json({ message: 'WhatsApp notifications are disabled for this account' });
    }

    if (!twilioClient) {
      // Mock response when Twilio is not configured
      res.json({
        message: 'WhatsApp message sent successfully (demo mode)',
        whatsapp: {
          sid: `demo_whatsapp_${Date.now()}`,
          status: 'sent',
          to: `whatsapp:${to}`,
          from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER || '+1234567890'}`,
          body: message,
          createdAt: new Date().toISOString()
        }
      });
      return;
    }

    try {
      const whatsappMessage = await twilioClient.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: `whatsapp:${to}`
      });

      res.json({
        message: 'WhatsApp message sent successfully',
        whatsapp: {
          sid: whatsappMessage.sid,
          status: whatsappMessage.status,
          to: whatsappMessage.to,
          from: whatsappMessage.from,
          body: whatsappMessage.body,
          createdAt: whatsappMessage.dateCreated
        }
      });
    } catch (twilioError) {
      console.error('Twilio WhatsApp error:', twilioError);
      res.status(500).json({ 
        message: 'Failed to send WhatsApp message',
        error: twilioError.message
      });
    }
  } catch (error) {
    console.error('WhatsApp communication error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/communication/broadcast
// @desc    Send broadcast message to multiple farmers
// @access  Private
router.post('/broadcast', [
  auth,
  body('message').trim().isLength({ min: 1, max: 1600 }).withMessage('Message must be between 1 and 1600 characters'),
  body('channels').isArray().withMessage('Channels must be an array'),
  body('channels.*').isIn(['sms', 'whatsapp', 'email']).withMessage('Invalid channel type'),
  body('farmerIds').optional().isArray().withMessage('Farmer IDs must be an array'),
  body('criteria').optional().isObject().withMessage('Criteria must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { message, channels, farmerIds, criteria } = req.body;

    // In a real implementation, you would:
    // 1. Query farmers based on criteria or farmerIds
    // 2. Filter farmers based on their notification preferences
    // 3. Send messages through appropriate channels
    // 4. Track delivery status

    // For demo purposes, we'll return a mock response
    const mockResults = {
      totalRecipients: farmerIds ? farmerIds.length : 100,
      channels: channels.map(channel => ({
        channel,
        sent: Math.floor(Math.random() * 50) + 10,
        failed: Math.floor(Math.random() * 5),
        pending: Math.floor(Math.random() * 10)
      })),
      messageId: `broadcast_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    res.json({
      message: 'Broadcast message queued successfully',
      results: mockResults
    });
  } catch (error) {
    console.error('Broadcast communication error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/communication/templates
// @desc    Get message templates
// @access  Public
router.get('/templates', async (req, res) => {
  try {
    const templates = {
      advisory: [
        {
          id: 'advisory_response',
          name: 'Advisory Response',
          message: 'Your agricultural advisory query has been processed. Check the app for detailed recommendations.',
          channels: ['sms', 'whatsapp']
        },
        {
          id: 'urgent_advisory',
          name: 'Urgent Advisory',
          message: 'URGENT: Your crop shows signs of disease. Immediate action required. Check the app for treatment recommendations.',
          channels: ['sms', 'whatsapp']
        }
      ],
      practices: [
        {
          id: 'practice_reminder',
          name: 'Practice Reminder',
          message: 'Reminder: Time to implement your adopted sustainable practice. Check the app for step-by-step guidance.',
          channels: ['sms', 'whatsapp']
        },
        {
          id: 'practice_success',
          name: 'Practice Success',
          message: 'Congratulations! You have successfully implemented a sustainable practice. Keep up the great work!',
          channels: ['sms', 'whatsapp']
        }
      ],
      gamification: [
        {
          id: 'level_up',
          name: 'Level Up',
          message: '🎉 Congratulations! You have reached level {level} and earned {xp} XP. Keep farming sustainably!',
          channels: ['sms', 'whatsapp']
        },
        {
          id: 'badge_earned',
          name: 'Badge Earned',
          message: '🏆 You earned a new badge: {badge_name}! {badge_description}',
          channels: ['sms', 'whatsapp']
        }
      ],
      weather: [
        {
          id: 'weather_alert',
          name: 'Weather Alert',
          message: 'Weather Alert: {weather_condition} expected in your area. Take necessary precautions for your crops.',
          channels: ['sms', 'whatsapp']
        },
        {
          id: 'irrigation_reminder',
          name: 'Irrigation Reminder',
          message: 'Irrigation reminder: Based on weather conditions, your crops may need watering today.',
          channels: ['sms', 'whatsapp']
        }
      ]
    };

    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/communication/history
// @desc    Get communication history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // In a real implementation, you would query a communication history collection
    // For demo purposes, we'll return mock data
    const mockHistory = Array.from({ length: limit }, (_, i) => ({
      id: `comm_${skip + i + 1}`,
      type: ['sms', 'whatsapp', 'email'][Math.floor(Math.random() * 3)],
      to: req.farmer.phone,
      message: 'Sample message content...',
      status: ['sent', 'delivered', 'failed'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }));

    res.json({
      communications: mockHistory,
      pagination: {
        currentPage: page,
        totalPages: 5,
        totalItems: 50,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get communication history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
