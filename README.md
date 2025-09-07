    # SFN Demo - AI-Powered Sustainable Farming Network

A comprehensive demo application that assists farmers through AI-powered agricultural advisory, promotes sustainable farming practices, incorporates gamification for user engagement, and ensures multilingual accessibility based on user location.

## 🌱 Features

### Core Functionality
- **AI-Powered Agricultural Advisory**: Text and image-based queries with AI analysis
- **Sustainable Practices Library**: Browse, search, and adopt sustainable farming practices
- **Digital Twin Simulation**: Run simulations to predict crop outcomes and optimize farming
- **Gamification Platform**: XP, badges, levels, and leaderboards to encourage engagement
- **Multi-Channel Communication**: SMS and WhatsApp integration for alerts and notifications
- **Multilingual Support**: Automatic language detection based on location with manual override
- **Farmer Profile Management**: Complete registration, authentication, and profile management

### Technical Features
- **Responsive Design**: Mobile-first approach with Material-UI components
    - **Real-time Updates**: Live notifications and status updates
    - **Image Processing**: AI-powered crop disease detection from images
- **Location Services**: Automatic language detection based on geolocation
- **Security**: JWT authentication with secure API endpoints
- **Scalable Architecture**: Microservices-ready backend with MongoDB

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **i18next** for internationalization
- **Axios** for API communication
- **TensorFlow.js** for client-side AI processing

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Twilio** for SMS/WhatsApp integration
- **Hugging Face Transformers** for NLP (mock implementation)

### Development Tools
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality
- **Concurrently** for running multiple services
- **Nodemon** for development hot reloading

## 📁 Project Structure

```
sfn-demo/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts (Auth, Language)
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   ├── i18n/           # Internationalization files
│   │   └── App.tsx         # Main application component
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── app.js          # Express application
│   └── package.json
├── package.json            # Root package.json for scripts
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sfn-demo
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Environment Configuration

#### Backend Environment
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sfn-demo
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
NODE_ENV=development

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Hugging Face API (Optional)
HUGGING_FACE_API_KEY=your-hugging-face-api-key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment
Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the Application

#### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

#### Individual Services
```bash
# Backend only
npm run backend:dev

# Frontend only
npm run frontend:dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new farmer
- `POST /api/auth/login` - Login farmer
- `GET /api/auth/me` - Get current farmer
- `POST /api/auth/refresh` - Refresh JWT token

### Advisory Endpoints
- `POST /api/advisory/text` - Submit text-based advisory query
- `POST /api/advisory/image` - Submit image-based advisory query
- `GET /api/advisory/history` - Get farmer's advisory history
- `GET /api/advisory/:id` - Get specific advisory by ID
- `POST /api/advisory/:id/feedback` - Submit feedback for advisory

### Practices Endpoints
- `GET /api/practices` - Get all sustainable practices
- `GET /api/practices/featured` - Get featured practices
- `GET /api/practices/:id` - Get specific practice
- `POST /api/practices/:id/adopt` - Adopt a practice
- `POST /api/practices/:id/rate` - Rate a practice

### Gamification Endpoints
- `GET /api/gamification` - Get farmer's gamification data
- `POST /api/gamification/action` - Record gamification action
- `GET /api/gamification/leaderboard` - Get leaderboard
- `GET /api/gamification/badges` - Get all available badges

### Digital Twin Endpoints
- `POST /api/digital-twin/simulate` - Run simulation
- `GET /api/digital-twin/templates` - Get simulation templates
- `GET /api/digital-twin/crops` - Get supported crops

### Communication Endpoints
- `POST /api/communication/sms` - Send SMS message
- `POST /api/communication/whatsapp` - Send WhatsApp message
- `POST /api/communication/broadcast` - Send broadcast message
- `GET /api/communication/templates` - Get message templates

### Localization Endpoints
- `GET /api/localization/languages` - Get supported languages
- `POST /api/localization/detect` - Detect language from location
- `GET /api/localization/translations/:language` - Get translations
- `PUT /api/localization/preference` - Update language preference

## 🌍 Internationalization

The application supports 7 languages:
- English (en) - Default
- Hindi (hi)
- Spanish (es)
- French (fr)
- German (de)
- Chinese (zh)
- Arabic (ar)

Language detection is automatic based on user location, with manual override available.

## 🎮 Gamification System

### XP and Levels
- Earn XP for various activities (advisory queries, practice adoptions, daily activity)
- Level up based on XP accumulation
- Visual progress indicators

### Badges
- **Knowledge Badges**: First Question, Curious Farmer, Expert Advisor
- **Sustainability Badges**: Sustainable Starter, Green Thumb, Sustainability Champion
- **Achievement Badges**: Active Member, Dedicated Farmer

### Leaderboard
- Global leaderboard with farmer rankings
- Sortable by XP, level, or badge count
- Privacy-focused (shows only name and location)

## 🔧 Development

### Code Structure
- **Frontend**: Component-based architecture with TypeScript
- **Backend**: RESTful API with Express.js and MongoDB
- **State Management**: React Context for global state
- **Styling**: Material-UI with custom theme

### Key Features Implementation
1. **AI Advisory**: Mock implementations ready for real AI integration
2. **Image Processing**: File upload with validation and processing
3. **Real-time Updates**: WebSocket-ready architecture
4. **Security**: JWT tokens with refresh mechanism
5. **Responsive Design**: Mobile-first approach

### Adding New Features
1. Create API endpoints in `backend/src/routes/`
2. Add corresponding frontend services in `frontend/src/services/`
3. Create UI components in `frontend/src/components/`
4. Add page components in `frontend/src/pages/`
5. Update types in `frontend/src/types/`

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `build/` folder
3. Set environment variables for API URL

### Backend Deployment (Heroku/AWS)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy the backend application
4. Update frontend API URL

### Environment Variables for Production
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secure JWT secret
- `TWILIO_*`: Twilio credentials for SMS/WhatsApp
- `HUGGING_FACE_API_KEY`: For AI features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the code comments for implementation details

## 🔮 Future Enhancements

- Real AI integration with Hugging Face Transformers
- Advanced image processing with TensorFlow.js
- Real-time notifications with WebSockets
- Mobile app development with React Native
- Advanced analytics and reporting
- Integration with IoT devices
- Blockchain integration for supply chain tracking

---

**Built with ❤️ for sustainable agriculture and farmer empowerment.**
