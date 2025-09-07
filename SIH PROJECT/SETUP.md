# SFN Demo - Complete Setup Guide

## 🚀 **Quick Start (Recommended)**

### **Step 1: Install Dependencies**
```bash
# Navigate to project directory
cd "D:\SIH PROJECT"

# Install all dependencies (root, backend, frontend)
npm run install:all
```

### **Step 2: Set Up Environment Variables**
```bash
# Copy the example environment file
copy backend\env.example backend\.env

# Edit backend\.env with your configuration
```

**Required Environment Variables:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/sfn-demo

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Optional: Twilio (for SMS/WhatsApp)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### **Step 3: Start the Application**
```bash
# Start both backend and frontend
npm run dev
```

### **Step 4: Access the Application**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

---

## 📋 **Detailed Setup Instructions**

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### **1. Database Setup**

#### **Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Download from: https://www.mongodb.com/try/download/community

# Start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

#### **Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in `backend/.env`

### **2. Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy env.example .env

# Edit .env with your configuration
notepad .env

# Start backend server
npm run dev
```

### **3. Frontend Setup**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm start
```

---

## 🔧 **Configuration Options**

### **Environment Variables Explained**

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/sfn-demo` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `PORT` | Backend server port | No | `5000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:3000` |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | No | - |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | No | - |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | No | - |

### **JWT Secret Generation**
```bash
# Generate a random JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🎯 **Features Overview**

### **✅ Fully Functional Features**
- **User Authentication** - Register, Login, JWT tokens
- **Profile Management** - Complete farmer profile with farm details
- **Sustainable Practices** - Add, edit, delete, implement practices
- **AI Advisory** - Text and image-based farming advice
- **Dashboard** - Real-time statistics and activities
- **Multi-language Support** - 7 languages with auto-detection
- **Responsive Design** - Works on all devices
- **Real-time Updates** - Live data refresh

### **🔧 Backend API Endpoints**

#### **Authentication**
- `POST /api/auth/register` - Register new farmer
- `POST /api/auth/login` - Login farmer
- `GET /api/auth/me` - Get current farmer

#### **Profile Management**
- `GET /api/profile` - Get farmer profile
- `PUT /api/profile` - Update farmer profile

#### **Sustainable Practices**
- `GET /api/practices/my-practices` - Get farmer's practices
- `POST /api/practices` - Create new practice
- `PUT /api/practices/:id` - Update practice
- `DELETE /api/practices/:id` - Delete practice
- `POST /api/practices/:id/implement` - Implement practice

#### **AI Advisory**
- `POST /api/advisory/text` - Get text-based advice
- `POST /api/advisory/image` - Get image-based advice
- `GET /api/advisory/history` - Get advisory history

#### **Dashboard**
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activities` - Get recent activities
- `GET /api/weather/current` - Get weather data

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. MongoDB Connection Error**
```
Error: MongoDB connection error
```
**Solution:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

#### **2. Port Already in Use**
```
Error: Port 5000 is already in use
```
**Solution:**
```bash
# Kill process using port 5000
npx kill-port 5000

# Or change port in backend/.env
PORT=5001
```

#### **3. CORS Error**
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution:**
- Check `FRONTEND_URL` in backend/.env
- Ensure backend is running on correct port

#### **4. JWT Token Error**
```
Error: jwt malformed
```
**Solution:**
- Generate new JWT secret
- Clear browser localStorage
- Login again

#### **5. Module Not Found Error**
```
Error: Cannot resolve module './App'
```
**Solution:**
```bash
# Clean install
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **PowerShell Execution Policy Error**
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled
```
**Solution:**
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or use Command Prompt instead
cmd
```

---

## 📱 **Usage Guide**

### **1. First Time Setup**
1. Open http://localhost:3000
2. Click "Sign up here" to register
3. Fill in your farmer details
4. Complete your profile setup

### **2. Adding Sustainable Practices**
1. Go to "Sustainable Practices" page
2. Click the "+" floating button
3. Fill in practice details
4. Save and implement

### **3. Getting AI Advice**
1. Go to "AI Advisory" page
2. Type your question or upload an image
3. Get personalized recommendations
4. Save to history for future reference

### **4. Managing Profile**
1. Go to "Profile" page
2. Update personal and farm information
3. Set preferences and language
4. View sustainability metrics

---

## 🔄 **Development Commands**

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Start backend only
npm run backend:dev

# Start frontend only
npm run frontend:dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📊 **Database Schema**

### **Farmer Collection**
```javascript
{
  name: String,
  email: String,
  phone: String,
  location: String,
  farmInfo: {
    farmName: String,
    farmSize: Number,
    farmType: String,
    crops: [String],
    soilType: String,
    irrigationMethod: String
  },
  preferences: {
    language: String,
    notifications: Boolean,
    theme: String,
    units: String
  }
}
```

### **Practice Collection**
```javascript
{
  title: String,
  description: String,
  category: String,
  difficulty: String,
  cost: String,
  environmentalImpact: Number,
  economicBenefit: Number,
  implementationSteps: [String],
  requirements: [String],
  benefits: [String],
  challenges: [String],
  resources: [String],
  farmerId: ObjectId,
  isImplemented: Boolean,
  implementationDate: Date,
  progress: Number,
  notes: String
}
```

---

## 🎨 **Customization**

### **Adding New Languages**
1. Create new translation file in `frontend/src/i18n/locales/`
2. Add language to `i18n.ts` configuration
3. Update language selector component

### **Adding New Practice Categories**
1. Update categories array in `frontend/src/pages/Practices/Practices.tsx`
2. Add corresponding icons and colors
3. Update backend validation if needed

### **Customizing Theme**
1. Edit `frontend/src/App.tsx` theme configuration
2. Modify colors, typography, and component styles
3. Add custom animations and transitions

---

## 📈 **Performance Optimization**

### **Frontend**
- Images are optimized and lazy-loaded
- Components use React.memo for re-render optimization
- API calls are debounced and cached
- Bundle is code-split for faster loading

### **Backend**
- Database queries are optimized with indexes
- API responses are compressed
- Rate limiting prevents abuse
- Caching reduces database load

---

## 🔒 **Security Features**

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation and sanitization
- Helmet.js security headers

---

## 📞 **Support**

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Check browser console for errors
5. Verify network connectivity

---

## 🎉 **You're All Set!**

Your SFN Demo application is now ready to use! Start by registering a new account and exploring the features. The application is fully functional with real data entry and management capabilities.

**Happy Farming! 🌱**
