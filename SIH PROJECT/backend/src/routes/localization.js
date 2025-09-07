const express = require('express');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Language mapping based on location
const LANGUAGE_MAPPING = {
  // Country-based mapping
  'IN': 'hi', // India - Hindi
  'US': 'en', // United States - English
  'GB': 'en', // United Kingdom - English
  'CA': 'en', // Canada - English
  'AU': 'en', // Australia - English
  'ES': 'es', // Spain - Spanish
  'MX': 'es', // Mexico - Spanish
  'AR': 'es', // Argentina - Spanish
  'FR': 'fr', // France - French
  'DE': 'de', // Germany - German
  'CN': 'zh', // China - Chinese
  'SA': 'ar', // Saudi Arabia - Arabic
  'EG': 'ar', // Egypt - Arabic
  'AE': 'ar', // UAE - Arabic
  
  // Region-based mapping
  'North America': 'en',
  'South America': 'es',
  'Europe': 'en',
  'Asia': 'en',
  'Africa': 'en',
  'Oceania': 'en'
};

// Supported languages configuration
const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    rtl: false
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    rtl: false
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true
  }
};

// @route   GET /api/localization/languages
// @desc    Get all supported languages
// @access  Public
router.get('/languages', async (req, res) => {
  try {
    const languages = Object.values(SUPPORTED_LANGUAGES);
    res.json({ languages });
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/localization/detect
// @desc    Detect language based on location
// @access  Public
router.post('/detect', async (req, res) => {
  try {
    const { country, state, city, coordinates } = req.body;

    let detectedLanguage = 'en'; // Default to English

    // Try to detect language based on country code
    if (country && LANGUAGE_MAPPING[country]) {
      detectedLanguage = LANGUAGE_MAPPING[country];
    }
    // Try to detect based on country name
    else if (country) {
      const countryCode = getCountryCode(country);
      if (countryCode && LANGUAGE_MAPPING[countryCode]) {
        detectedLanguage = LANGUAGE_MAPPING[countryCode];
      }
    }

    // Additional logic for specific regions
    if (state) {
      // Special cases for multilingual countries
      if (country === 'IN' && ['Punjab', 'Haryana', 'Delhi'].includes(state)) {
        detectedLanguage = 'hi';
      } else if (country === 'IN' && ['Tamil Nadu', 'Kerala', 'Karnataka'].includes(state)) {
        detectedLanguage = 'en'; // English is more common in South India
      }
    }

    const languageInfo = SUPPORTED_LANGUAGES[detectedLanguage];

    res.json({
      detectedLanguage: detectedLanguage,
      languageInfo,
      confidence: 0.8,
      detectionMethod: 'location_based'
    });
  } catch (error) {
    console.error('Language detection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/localization/translations/:language
// @desc    Get translations for a specific language
// @access  Public
router.get('/translations/:language', async (req, res) => {
  try {
    const { language } = req.params;

    if (!SUPPORTED_LANGUAGES[language]) {
      return res.status(400).json({ message: 'Unsupported language' });
    }

    // In a real implementation, you would load translations from files or database
    // For demo purposes, we'll return mock translations
    const translations = getMockTranslations(language);

    res.json({
      language,
      translations,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get translations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/localization/preference
// @desc    Update user's language preference
// @access  Private
router.put('/preference', [
  auth,
  body('language').isIn(Object.keys(SUPPORTED_LANGUAGES)).withMessage('Invalid language code')
], async (req, res) => {
  try {
    const { language } = req.body;

    // Update farmer's language preference
    req.farmer.preferences.language = language;
    await req.farmer.save();

    res.json({
      message: 'Language preference updated successfully',
      language: SUPPORTED_LANGUAGES[language]
    });
  } catch (error) {
    console.error('Update language preference error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/localization/current
// @desc    Get current user's language settings
// @access  Private
router.get('/current', auth, async (req, res) => {
  try {
    const currentLanguage = req.farmer.preferences.language || 'en';
    const languageInfo = SUPPORTED_LANGUAGES[currentLanguage];

    res.json({
      currentLanguage,
      languageInfo,
      supportedLanguages: Object.values(SUPPORTED_LANGUAGES)
    });
  } catch (error) {
    console.error('Get current language error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to get country code from country name
const getCountryCode = (countryName) => {
  const countryMap = {
    'India': 'IN',
    'United States': 'US',
    'United Kingdom': 'GB',
    'Canada': 'CA',
    'Australia': 'AU',
    'Spain': 'ES',
    'Mexico': 'MX',
    'Argentina': 'AR',
    'France': 'FR',
    'Germany': 'DE',
    'China': 'CN',
    'Saudi Arabia': 'SA',
    'Egypt': 'EG',
    'United Arab Emirates': 'AE'
  };
  return countryMap[countryName];
};

// Helper function to get mock translations
const getMockTranslations = (language) => {
  const translations = {
    en: {
      'app.title': 'SFN Demo - Sustainable Farming Network',
      'app.subtitle': 'AI-Powered Agricultural Advisory',
      'nav.dashboard': 'Dashboard',
      'nav.advisory': 'Advisory',
      'nav.practices': 'Practices',
      'nav.simulation': 'Digital Twin',
      'nav.communication': 'Communication',
      'nav.profile': 'Profile',
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.logout': 'Logout',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success'
    },
    hi: {
      'app.title': 'SFN डेमो - सतत कृषि नेटवर्क',
      'app.subtitle': 'AI-संचालित कृषि सलाह',
      'nav.dashboard': 'डैशबोर्ड',
      'nav.advisory': 'सलाह',
      'nav.practices': 'अभ्यास',
      'nav.simulation': 'डिजिटल ट्विन',
      'nav.communication': 'संचार',
      'nav.profile': 'प्रोफ़ाइल',
      'auth.login': 'लॉगिन',
      'auth.register': 'रजिस्टर',
      'auth.logout': 'लॉगआउट',
      'common.save': 'सहेजें',
      'common.cancel': 'रद्द करें',
      'common.delete': 'हटाएं',
      'common.edit': 'संपादित करें',
      'common.view': 'देखें',
      'common.loading': 'लोड हो रहा है...',
      'common.error': 'त्रुटि',
      'common.success': 'सफलता'
    },
    es: {
      'app.title': 'SFN Demo - Red de Agricultura Sostenible',
      'app.subtitle': 'Asesoramiento Agrícola Impulsado por IA',
      'nav.dashboard': 'Panel',
      'nav.advisory': 'Asesoramiento',
      'nav.practices': 'Prácticas',
      'nav.simulation': 'Gemelo Digital',
      'nav.communication': 'Comunicación',
      'nav.profile': 'Perfil',
      'auth.login': 'Iniciar Sesión',
      'auth.register': 'Registrarse',
      'auth.logout': 'Cerrar Sesión',
      'common.save': 'Guardar',
      'common.cancel': 'Cancelar',
      'common.delete': 'Eliminar',
      'common.edit': 'Editar',
      'common.view': 'Ver',
      'common.loading': 'Cargando...',
      'common.error': 'Error',
      'common.success': 'Éxito'
    }
  };

  return translations[language] || translations.en;
};

module.exports = router;
