// Client Audio Player utility supporting raw PCM 24000Hz from Gemini TTS
// and native speech synthesis fallback in ANY language.

let currentAudioCtx: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;
let isAudioPlaying = false;

// Map common language names to BCP-47 language tags for SpeechSynthesis
export const LANGUAGE_VOICE_CODES: Record<string, string> = {
  'English': 'en-IN',
  'Hindi': 'hi-IN',
  'Marathi': 'mr-IN',
  'Bengali': 'bn-IN',
  'Tamil': 'ta-IN',
  'Telugu': 'te-IN',
  'Gujarati': 'gu-IN',
  'Kannada': 'kn-IN',
  'Malayalam': 'ml-IN',
  'Punjabi': 'pa-IN',
  'Odia': 'or-IN',
  'Urdu': 'ur-PK',
  'Spanish': 'es-ES',
  'French': 'fr-FR',
  'German': 'de-DE',
  'Japanese': 'ja-JP',
  'Arabic': 'ar-SA'
};

export const SUPPORTED_AUDIO_LANGUAGES = [
  { name: 'English', native: 'English', code: 'en-IN' },
  { name: 'Hindi', native: 'हिंदी (Hindi)', code: 'hi-IN' },
  { name: 'Marathi', native: 'मराठी (Marathi)', code: 'mr-IN' },
  { name: 'Bengali', native: 'বাংলা (Bengali)', code: 'bn-IN' },
  { name: 'Tamil', native: 'தமிழ் (Tamil)', code: 'ta-IN' },
  { name: 'Telugu', native: 'తెలుగు (Telugu)', code: 'te-IN' },
  { name: 'Gujarati', native: 'ગુજરાતી (Gujarati)', code: 'gu-IN' },
  { name: 'Kannada', native: 'ಕನ್ನಡ (Kannada)', code: 'kn-IN' },
  { name: 'Malayalam', native: 'മലയാളം (Malayalam)', code: 'ml-IN' },
  { name: 'Punjabi', native: 'ਪੰਜਾਬੀ (Punjabi)', code: 'pa-IN' },
  { name: 'Odia', native: 'ଓଡ଼ିଆ (Odia)', code: 'or-IN' },
  { name: 'Urdu', native: 'اردو (Urdu)', code: 'ur-PK' },
  { name: 'Spanish', native: 'Español (Spanish)', code: 'es-ES' },
  { name: 'French', native: 'Français (French)', code: 'fr-FR' },
  { name: 'German', native: 'Deutsch (German)', code: 'de-DE' }
];

export function stopCurrentAudio() {
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
    } catch {}
    currentSourceNode = null;
  }
  if (currentAudioCtx) {
    try {
      currentAudioCtx.close();
    } catch {}
    currentAudioCtx = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isAudioPlaying = false;
}

// Play raw PCM audio at 24000Hz (from gemini-3.8-flash-lite-tts)
export function playPcmAudio(
  base64Audio: string,
  sampleRate = 24000,
  onEnd?: () => void
) {
  stopCurrentAudio();

  try {
    const binary = atob(base64Audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    currentAudioCtx = new AudioContextClass({ sampleRate });

    const buffer = currentAudioCtx.createBuffer(1, float32.length, sampleRate);
    buffer.copyToChannel(float32, 0);

    const source = currentAudioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(currentAudioCtx.destination);

    source.onended = () => {
      isAudioPlaying = false;
      onEnd?.();
    };

    isAudioPlaying = true;
    currentSourceNode = source;
    source.start();
  } catch (err) {
    console.error('Error playing raw PCM audio:', err);
    onEnd?.();
  }
}

export function isCurrentlyPlaying() {
  return isAudioPlaying;
}

// Fallback to browser SpeechSynthesis
export function playSpeechSynthesis(
  text: string,
  language = 'English',
  onStart?: () => void,
  onEnd?: () => void
) {
  stopCurrentAudio();

  if (!('speechSynthesis' in window)) {
    console.warn('Speech audio is not supported in this browser.');
    onEnd?.();
    return;
  }

  const langCode = LANGUAGE_VOICE_CODES[language] || 'en-IN';
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.rate = 0.95;

  // Try to find the best native matching voice
  try {
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === langCode || v.lang.startsWith(langCode.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  } catch (err) {
    console.warn('Could not list voices', err);
  }

  utterance.onstart = () => {
    isAudioPlaying = true;
    onStart?.();
  };

  utterance.onend = () => {
    isAudioPlaying = false;
    onEnd?.();
  };

  utterance.onerror = () => {
    isAudioPlaying = false;
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}

// Main Universal Audio function: Calls Backend /api/ai/tts and plays audio in ANY language
export async function playAudioInLanguage({
  text,
  language = 'English',
  voiceName = 'Kore',
  onStart,
  onEnd,
  onError
}: {
  text: string;
  language?: string;
  voiceName?: string;
  onStart?: (translatedText: string) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}) {
  stopCurrentAudio();

  try {
    const res = await fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        targetLanguage: language,
        voiceName
      })
    });

    const data = await res.json();
    const spokenText = data.translatedText || text;

    onStart?.(spokenText);

    // If backend returned raw Gemini PCM audio
    if (data.audioBase64) {
      playPcmAudio(data.audioBase64, data.sampleRate || 24000, onEnd);
    } else {
      // Use localized SpeechSynthesis with the translated script
      playSpeechSynthesis(spokenText, language, undefined, onEnd);
    }

    return spokenText;
  } catch (err) {
    console.error('TTS audio playback error:', err);
    onError?.(err);
    // Offline / direct fallback
    playSpeechSynthesis(text, language, undefined, onEnd);
  }
}
