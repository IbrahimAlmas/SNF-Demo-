// Service for language detection and localization
export const localizationService = {
  async detectLanguage(): Promise<string | null> {
    try {
      // First, check if user has a saved language preference
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        return savedLanguage;
      }

      // Try to detect language from browser
      const browserLanguage = navigator.language.split('-')[0];
      const supportedLanguages = ['en', 'hi', 'es', 'fr', 'de', 'zh', 'ar'];
      
      if (supportedLanguages.includes(browserLanguage)) {
        return browserLanguage;
      }

      // Try to detect language based on geolocation
      const geoLanguage = await this.detectLanguageByLocation();
      if (geoLanguage) {
        return geoLanguage;
      }

      // Default to English
      return 'en';
    } catch (error) {
      console.warn('Language detection failed:', error);
      return 'en';
    }
  },

  async detectLanguageByLocation(): Promise<string | null> {
    try {
      // Get user's location
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Map coordinates to likely languages
      // This is a simplified mapping - in production, you'd use a more sophisticated service
      const languageMap: { [key: string]: string } = {
        // India
        'IN': 'hi',
        // Spain
        'ES': 'es',
        // France
        'FR': 'fr',
        // Germany
        'DE': 'de',
        // China
        'CN': 'zh',
        // Saudi Arabia
        'SA': 'ar',
        // Mexico
        'MX': 'es',
        // Argentina
        'AR': 'es',
      };

      // Reverse geocoding to get country code
      const countryCode = await this.reverseGeocode(latitude, longitude);
      return languageMap[countryCode] || null;
    } catch (error) {
      console.warn('Location-based language detection failed:', error);
      return null;
    }
  },

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  },

  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      // Using a free reverse geocoding service
      // In production, you'd use a more reliable service like Google Maps API
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();
      return data.countryCode || 'US';
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return 'US'; // Default to US
    }
  },

  getLanguageName(code: string): string {
    const languageNames: { [key: string]: string } = {
      'en': 'English',
      'hi': 'हिन्दी',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'zh': '中文',
      'ar': 'العربية',
    };
    return languageNames[code] || 'English';
  },

  getLanguageFlag(code: string): string {
    const languageFlags: { [key: string]: string } = {
      'en': '🇺🇸',
      'hi': '🇮🇳',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'zh': '🇨🇳',
      'ar': '🇸🇦',
    };
    return languageFlags[code] || '🇺🇸';
  },
};