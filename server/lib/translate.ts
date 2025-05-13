import { LanguageCode } from '@shared/schema';

// Using dictionary-based mock translations for demo purposes
// This is a basic implementation that works without external APIs
const mockTranslations: Record<LanguageCode, Record<string, string>> = {
  hi: {
    "Hello": "नमस्ते",
    "Welcome": "स्वागत है",
    "Thank you": "धन्यवाद",
    "How are you?": "आप कैसे हैं?",
    "Translate": "अनुवाद",
    "Text": "पाठ",
    "Document": "दस्तावेज़",
    "Language": "भाषा",
  },
  bn: {
    "Hello": "হ্যালো",
    "Welcome": "স্বাগতম",
    "Thank you": "ধন্যবাদ",
    "How are you?": "আপনি কেমন আছেন?",
    "Translate": "অনুবাদ করুন",
    "Text": "টেক্সট",
    "Document": "নথি",
    "Language": "ভাষা",
  },
  ta: {
    "Hello": "வணக்கம்",
    "Welcome": "வரவேற்கிறோம்",
    "Thank you": "நன்றி",
    "How are you?": "எப்படி இருக்கிறீர்கள்?",
    "Translate": "மொழிபெயர்",
    "Text": "உரை",
    "Document": "ஆவணம்",
    "Language": "மொழி",
  },
  te: {
    "Hello": "హలో",
    "Welcome": "స్వాగతం",
    "Thank you": "ధన్యవాదాలు",
    "How are you?": "మీరు ఎలా ఉన్నారు?",
    "Translate": "అనువదించు",
    "Text": "టెక్స్ట్",
    "Document": "పత్రం",
    "Language": "భాష",
  },
  mr: {
    "Hello": "नमस्कार",
    "Welcome": "स्वागत आहे",
    "Thank you": "धन्यवाद",
    "How are you?": "तुम्ही कसे आहात?",
    "Translate": "भाषांतर करा",
    "Text": "मजकूर",
    "Document": "दस्तऐवज",
    "Language": "भाषा",
  },
  kn: {
    "Hello": "ಹಲೋ",
    "Welcome": "ಸ್ವಾಗತ",
    "Thank you": "ಧನ್ಯವಾದಗಳು",
    "How are you?": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
    "Translate": "ಅನುವಾದಿಸಿ",
    "Text": "ಪಠ್ಯ",
    "Document": "ದಾಖಲೆ",
    "Language": "ಭಾಷೆ",
  },
  gu: {
    "Hello": "નમસ્તે",
    "Welcome": "સ્વાગત છે",
    "Thank you": "આભાર",
    "How are you?": "તમે કેમ છો?",
    "Translate": "અનુવાદ",
    "Text": "ટેક્સ્ટ",
    "Document": "દસ્તાવેજ",
    "Language": "ભાષા",
  },
};

/**
 * Simple free translation function that demonstrates functionality without using paid APIs
 * In a production environment, this would use a proper translation service or library
 * @param text The text to translate
 * @param targetLanguage The language code to translate to
 * @returns The translated text
 */
export async function translateText(text: string, targetLanguage: LanguageCode): Promise<string> {
  try {
    // This is a simple demo function that just adds a prefix to show translation would happen
    // In a real app, you'd use a proper translation library or service (many free options are available)
    
    // Add a short delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get demo translations for common words and phrases
    const dictionary = mockTranslations[targetLanguage] || {};
    
    // Simple word replacement
    let translatedText = text;
    
    // Replace known words with their translations
    Object.entries(dictionary).forEach(([original, translated]) => {
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      translatedText = translatedText.replace(regex, translated);
    });
    
    // Return the simulated translation with a note explaining this is a demo
    return `${translatedText}\n\n[This is a demo translation. In a production environment, this would use a real translation service.]`;
  } catch (error) {
    console.error('Error translating text:', error);
    return `[Translation demo for ${targetLanguage}]\n\n${text}`;
  }
}

/**
 * Always returns true since we're using a free built-in translation function
 * @returns True always
 */
export function isTranslationApiConfigured(): boolean {
  return true;
}
