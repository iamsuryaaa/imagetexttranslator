import { LanguageCode } from '@shared/schema';
import translate from 'google-translate-api-x';

/**
 * Language codes for text-to-speech support
 * These are the codes used by the Web Speech API
 */
export const speechLanguageCodes: Record<LanguageCode, string> = {
  hi: 'hi-IN', // Hindi
  bn: 'bn-IN', // Bengali
  ta: 'ta-IN', // Tamil
  te: 'te-IN', // Telugu
  mr: 'mr-IN', // Marathi
  kn: 'kn-IN', // Kannada
  gu: 'gu-IN', // Gujarati
};

/**
 * Translate text using free Google Translate API
 * This provides accurate translations without requiring API keys
 * @param text The text to translate
 * @param targetLanguage The language code to translate to
 * @returns Translated text
 */
export async function translateText(text: string, targetLanguage: LanguageCode): Promise<string> {
  try {
    // Use the free Google Translate API
    const result = await translate(text, { to: targetLanguage });
    
    // Define language headers
    const languageHeaders = {
      hi: "हिंदी अनुवाद:",
      bn: "বাংলা অনুবাদ:",
      ta: "தமிழ் மொழிபெயர்ப்பு:",
      te: "తెలుగు అనువాదం:",
      mr: "मराठी अनुवाद:",
      kn: "ಕನ್ನಡ ಅನುವಾದ:",
      gu: "ગુજરાતી અનુવાદ:"
    };
    
    // Return the translated text with a header
    return `${languageHeaders[targetLanguage]}\n\n${result.text}`;
  } catch (error) {
    console.error('Error translating text:', error);
    // Fallback to a simple translation placeholder
    return `Translation to ${targetLanguage}:\n\n${getFallbackTranslation(text, targetLanguage)}`;
  }
}

/**
 * Fallback translation when the API fails
 * This is a simplified version that just replaces the text with a message
 */
function getFallbackTranslation(text: string, language: LanguageCode): string {
  const messages: Record<LanguageCode, string> = {
    hi: "अनुवाद सेवा अस्थायी रूप से अनुपलब्ध है, कृपया बाद में पुन: प्रयास करें।",
    bn: "অনুবাদ পরিষেবা অস্থায়ীভাবে অনুপলব্ধ, অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
    ta: "மொழிபெயர்ப்பு சேவை தற்காலிகமாக இல்லை, பின்னர் மீண்டும் முயற்சிக்கவும்.",
    te: "అనువాద సేవ తాత్కాలికంగా అందుబాటులో లేదు, దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.",
    mr: "अनुवाद सेवा तात्पुरती अनुपलब्ध आहे, कृपया नंतर पुन्हा प्रयत्न करा.",
    kn: "ಅನುವಾದ ಸೇವೆಯು ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ, ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    gu: "અનુવાદ સેવા અસ્થાયી રૂપે અનુપલબ્ધ છે, કૃપા કરીને પછી ફરી પ્રયાસ કરો.",
  };
  
  // Return a message that translation service is temporarily unavailable in the target language
  return messages[language] || text;
}

/**
 * Generate speech synthesis markup for the translated text
 * @param text The text to speak
 * @param language The language code for speech
 * @returns HTML markup with speech functionality
 */
export function generateSpeechMarkup(text: string, language: LanguageCode): string {
  const speechLang = speechLanguageCodes[language] || 'en-US';
  
  // Clean the text for speech synthesis (remove headers and notes)
  const cleanText = text.split('\n\n')[1] || text;
  
  return `
    <div class="speech-container">
      <button 
        class="speech-button" 
        onclick="speakText(this)" 
        data-text="${encodeURIComponent(cleanText)}" 
        data-lang="${speechLang}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
          <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
          <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
        </svg>
        Listen
      </button>
    </div>
    <script>
      function speakText(button) {
        const text = decodeURIComponent(button.getAttribute('data-text'));
        const lang = button.getAttribute('data-lang');
        
        // Stop any currently speaking synthesis
        window.speechSynthesis.cancel();
        
        // Create a new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        
        // Set button state to playing
        button.classList.add('speaking');
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg> Playing...';
        
        // Reset button when speech ends
        utterance.onend = () => {
          button.classList.remove('speaking');
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg> Listen';
        };
        
        // Play the speech
        window.speechSynthesis.speak(utterance);
      }
    </script>
    <style>
      .speech-container {
        margin-top: 15px;
      }
      .speech-button {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 8px 16px;
        background-color: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        color: #374151;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .speech-button:hover {
        background-color: #e5e7eb;
      }
      .speech-button.speaking {
        background-color: #e5e7eb;
        color: #4f46e5;
      }
    </style>
  `;
}

/**
 * Always returns true since we're using the free Google Translate API
 * @returns True always
 */
export function isTranslationApiConfigured(): boolean {
  return true;
}
