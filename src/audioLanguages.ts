export interface AudioLanguageOption {
  code: string;
  label: string;
  native: string;
  region?: string;
}

export const UNIVERSAL_AUDIO_LANGUAGES: AudioLanguageOption[] = [
  // Indian Regional Languages
  { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी', region: 'India' },
  { code: 'mr-IN', label: 'Marathi', native: 'मराठी', region: 'Maharashtra' },
  { code: 'bn-IN', label: 'Bengali', native: 'বাংলা', region: 'West Bengal' },
  { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்', region: 'Tamil Nadu' },
  { code: 'te-IN', label: 'Telugu', native: 'తెలుగు', region: 'Andhra/Telangana' },
  { code: 'gu-IN', label: 'Gujarati', native: 'ગુજરાતી', region: 'Gujarat' },
  { code: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം', region: 'Kerala' },
  { code: 'pa-IN', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', region: 'Punjab' },
  { code: 'or-IN', label: 'Odia', native: 'ଓଡ଼ିଆ', region: 'Odisha' },
  { code: 'ur-IN', label: 'Urdu', native: 'اردو', region: 'India' },
  { code: 'as-IN', label: 'Assamese', native: 'অসমীয়া', region: 'Assam' },
  { code: 'sa-IN', label: 'Sanskrit', native: 'संस्कृतम्', region: 'Classical India' },
  { code: 'ne-NP', label: 'Nepali', native: 'नेपाली', region: 'Sikkim / Nepal' },
  { code: 'mai-IN', label: 'Maithili', native: 'मैथिली', region: 'Bihar' },
  { code: 'kok-IN', label: 'Konkani', native: 'कोंकणी', region: 'Goa' },

  // English variants
  { code: 'en-IN', label: 'Indian English', native: 'English (India)', region: 'Pan-India' },
  { code: 'en-US', label: 'US English', native: 'English (US)', region: 'North America' },
  { code: 'en-GB', label: 'British English', native: 'English (UK)', region: 'Europe' },

  // Major World Languages
  { code: 'es-ES', label: 'Spanish', native: 'Español', region: 'Spain & Latin America' },
  { code: 'fr-FR', label: 'French', native: 'Français', region: 'France & Canada' },
  { code: 'de-DE', label: 'German', native: 'Deutsch', region: 'Germany & Austria' },
  { code: 'ja-JP', label: 'Japanese', native: '日本語', region: 'Japan' },
  { code: 'zh-CN', label: 'Mandarin Chinese', native: '中文', region: 'East Asia' },
  { code: 'ru-RU', label: 'Russian', native: 'Русский', region: 'Eurasia' },
  { code: 'ar-SA', label: 'Arabic', native: 'العربية', region: 'Middle East' },
  { code: 'pt-BR', label: 'Portuguese', native: 'Português', region: 'Brazil & Portugal' },
  { code: 'it-IT', label: 'Italian', native: 'Italiano', region: 'Italy' },
  { code: 'ko-KR', label: 'Korean', native: '한국어', region: 'Korea' },
  { code: 'tr-TR', label: 'Turkish', native: 'Türkçe', region: 'Turkey' },
  { code: 'nl-NL', label: 'Dutch', native: 'Nederlands', region: 'Netherlands' },
  { code: 'vi-VN', label: 'Vietnamese', native: 'Tiếng Việt', region: 'Vietnam' },
  { code: 'id-ID', label: 'Indonesian', native: 'Bahasa Indonesia', region: 'Indonesia' },
  { code: 'th-TH', label: 'Thai', native: 'ไทย', region: 'Thailand' },
  { code: 'sw-KE', label: 'Swahili', native: 'Kiswahili', region: 'East Africa' },
  
  // Custom language input option
  { code: 'custom', label: '✨ Type Any Other Language...', native: 'Custom / Any Language', region: 'Global' }
];
