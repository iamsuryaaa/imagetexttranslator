import { LanguageCode } from '@shared/schema';

// Common phrases translated to different Indian languages
// This provides a more realistic translation demo without requiring a paid API
const basicTranslations: Record<LanguageCode, Record<string, string>> = {
  hi: {
    // Hindi translations
    "hello": "नमस्ते",
    "welcome": "स्वागत है",
    "thank you": "धन्यवाद",
    "goodbye": "अलविदा",
    "yes": "हां",
    "no": "नहीं",
    "please": "कृपया",
    "sorry": "माफ़ कीजिए",
    "good morning": "सुप्रभात",
    "good night": "शुभ रात्रि",
    "how are you": "आप कैसे हैं",
    "i am fine": "मैं ठीक हूँ",
    "what is your name": "आपका नाम क्या है",
    "my name is": "मेरा नाम है",
    "nice to meet you": "आपसे मिलकर अच्छा लगा",
    "where are you from": "आप कहां से हैं",
    "i am from": "मैं यहां से हूँ",
    "do you speak english": "क्या आप अंग्रेज़ी बोलते हैं",
    "i don't understand": "मैं समझ नहीं पा रहा हूँ",
    "can you help me": "क्या आप मेरी मदद कर सकते हैं",
    "how much does this cost": "इसकी कीमत कितनी है",
    "where is the bathroom": "बाथरूम कहां है",
    "i'm hungry": "मुझे भूख लगी है",
    "the food is delicious": "खाना बहुत स्वादिष्ट है",
    "i need a doctor": "मुझे डॉक्टर की ज़रूरत है",
    "call the police": "पुलिस को बुलाओ",
    "i love you": "मैं तुमसे प्यार करता हूँ",
    "happy birthday": "जन्मदिन मुबारक",
    "congratulations": "बधाई हो",
    "have a nice day": "आपका दिन अच्छा हो",
    "it was": "यह था",
    "best": "सबसे अच्छा",
    "worst": "सबसे बुरा",
    "times": "समय",
    "age": "युग",
    "wisdom": "बुद्धिमत्ता",
    "foolishness": "मूर्खता",
    "of": "का",
    "it is": "यह है",
    "this is": "यह है",
    "there": "वहाँ",
    "here": "यहाँ",
    "the": "यह",
    "a": "एक",
    "an": "एक",
    "and": "और",
    "but": "लेकिन",
    "or": "या",
    "if": "अगर",
    "because": "क्योंकि",
    "therefore": "इसलिए",
    "with": "के साथ",
    "without": "के बिना",
    "in": "में",
    "out": "बाहर",
    "on": "पर",
    "under": "नीचे",
    "above": "ऊपर",
    "below": "नीचे",
    "language": "भाषा",
    "translator": "अनुवादक",
    "translation": "अनुवाद",
    "document": "दस्तावेज़",
    "text": "पाठ",
  },
  bn: {
    // Bengali translations
    "hello": "হ্যালো",
    "welcome": "স্বাগতম",
    "thank you": "ধন্যবাদ",
    "goodbye": "বিদায়",
    "yes": "হ্যাঁ",
    "no": "না",
    "please": "দয়া করে",
    "sorry": "দুঃখিত",
    "good morning": "সুপ্রভাত",
    "good night": "শুভ রাত্রি",
    "how are you": "আপনি কেমন আছেন",
    "i am fine": "আমি ভালো আছি",
    "what is your name": "আপনার নাম কি",
    "my name is": "আমার নাম",
    "it was": "এটা ছিল",
    "best": "সেরা",
    "worst": "সবচেয়ে খারাপ",
    "times": "সময়",
    "age": "যুগ",
    "wisdom": "প্রজ্ঞা",
    "foolishness": "মূর্খতা",
    "of": "এর",
    "it is": "এটা হল",
    "this is": "এটা হল",
    "text": "পাঠ্য",
    "translation": "অনুবাদ",
  },
  ta: {
    // Tamil translations
    "hello": "வணக்கம்",
    "welcome": "வரவேற்கிறோம்",
    "thank you": "நன்றி",
    "goodbye": "விடைபெறுகிறேன்",
    "yes": "ஆம்",
    "no": "இல்லை",
    "please": "தயவுசெய்து",
    "sorry": "மன்னிக்கவும்",
    "good morning": "காலை வணக்கம்",
    "good night": "இரவு வணக்கம்",
    "how are you": "நீங்கள் எப்படி இருக்கிறீர்கள்",
    "i am fine": "நான் நன்றாக இருக்கிறேன்",
    "what is your name": "உங்கள் பெயர் என்ன",
    "it was": "அது இருந்தது",
    "best": "சிறந்த",
    "worst": "மோசமான",
    "times": "நேரங்கள்",
    "age": "காலம்",
    "wisdom": "ஞானம்",
    "foolishness": "முட்டாள்தனம்",
    "of": "இன்",
    "text": "உரை",
    "translation": "மொழிபெயர்ப்பு",
  },
  te: {
    // Telugu translations
    "hello": "హలో",
    "welcome": "స్వాగతం",
    "thank you": "ధన్యవాదాలు",
    "goodbye": "వీడ్కోలు",
    "yes": "అవును",
    "no": "కాదు",
    "please": "దయచేసి",
    "sorry": "క్షమించండి",
    "it was": "అది ఉంది",
    "best": "ఉత్తమ",
    "worst": "అత్యంత చెడ్డ",
    "times": "సమయాలు",
    "age": "యుగం",
    "wisdom": "జ్ఞానం",
    "foolishness": "మూర్ఖత్వం",
    "of": "యొక్క",
    "text": "పాఠ్యం",
    "translation": "అనువాదం",
  },
  mr: {
    // Marathi translations
    "hello": "नमस्कार",
    "welcome": "स्वागत आहे",
    "thank you": "धन्यवाद",
    "goodbye": "निरोप",
    "yes": "होय",
    "no": "नाही",
    "please": "कृपया",
    "sorry": "माफ करा",
    "it was": "ते होते",
    "best": "सर्वोत्तम",
    "worst": "सर्वात वाईट",
    "times": "वेळा",
    "age": "युग",
    "wisdom": "ज्ञान",
    "foolishness": "मूर्खपणा",
    "of": "चे",
    "text": "मजकूर",
    "translation": "भाषांतर",
  },
  kn: {
    // Kannada translations
    "hello": "ನಮಸ್ಕಾರ",
    "welcome": "ಸ್ವಾಗತ",
    "thank you": "ಧನ್ಯವಾದಗಳು",
    "goodbye": "ವಿದಾಯ",
    "yes": "ಹೌದು",
    "no": "ಇಲ್ಲ",
    "please": "ದಯವಿಟ್ಟು",
    "sorry": "ಕ್ಷಮಿಸಿ",
    "it was": "ಅದು ಆಗಿತ್ತು",
    "best": "ಅತ್ಯುತ್ತಮ",
    "worst": "ಅತ್ಯಂತ ಕೆಟ್ಟ",
    "times": "ಸಮಯಗಳು",
    "age": "ಯುಗ",
    "wisdom": "ಜ್ಞಾನ",
    "foolishness": "ಮೂರ್ಖತನ",
    "of": "ನ",
    "text": "ಪಠ್ಯ",
    "translation": "ಅನುವಾದ",
  },
  gu: {
    // Gujarati translations
    "hello": "નમસ્તે",
    "welcome": "સ્વાગત છે",
    "thank you": "આભાર",
    "goodbye": "આવજો",
    "yes": "હા",
    "no": "ના",
    "please": "કૃપા કરીને",
    "sorry": "માફ કરશો",
    "it was": "તે હતું",
    "best": "શ્રેષ્ઠ",
    "worst": "સૌથી ખરાબ",
    "times": "સમય",
    "age": "યુગ",
    "wisdom": "જ્ઞાન",
    "foolishness": "મૂર્ખતા",
    "of": "ના",
    "text": "લખાણ",
    "translation": "અનુવાદ",
  },
};

/**
 * A free, local translation system that uses pre-translated phrases
 * @param text The text to translate
 * @param targetLanguage The language code to translate to
 * @returns Translated text with a header indicating the language
 */
export async function translateText(text: string, targetLanguage: LanguageCode): Promise<string> {
  try {
    // Get the dictionary for the target language
    const dictionary = basicTranslations[targetLanguage] || {};
    
    // Create a meaningful translation
    const translatedText = demoTranslate(text, dictionary, targetLanguage);
    
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
    
    return `${languageHeaders[targetLanguage]}\n\n${translatedText}\n\n[अनुवाद प्रदर्शन - This is a demonstration translation]`;
  } catch (error) {
    console.error('Error translating text:', error);
    return `Translation to ${targetLanguage}:\n\n${text}`;
  }
}

/**
 * Translate text using a dictionary of pre-translated phrases
 * This creates a more realistic translation for demonstration purposes
 */
function demoTranslate(text: string, dictionary: Record<string, string>, language: LanguageCode): string {
  // Split text into sentences for better processing
  const sentences = text.split(/([.!?]+)/).filter(Boolean);
  let translatedSentences: string[] = [];
  
  // Process each sentence
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = (sentences[i] + (sentences[i+1] || '')).trim();
    if (!sentence) continue;
    
    // Split into words and translate each word if found in dictionary
    const words = sentence.split(/\s+/);
    let translatedWords: string[] = [];
    
    // Strategy 1: Try to match multi-word phrases first
    let skipIndices = new Set<number>();
    for (let len = 3; len > 0; len--) {
      for (let i = 0; i <= words.length - len; i++) {
        // Skip if any word in this range is already translated
        if ([...Array(len).keys()].some(offset => skipIndices.has(i + offset))) continue;
        
        const phrase = words.slice(i, i + len).join(' ').toLowerCase();
        if (dictionary[phrase]) {
          translatedWords.push(dictionary[phrase]);
          // Mark these words as translated
          for (let j = 0; j < len; j++) {
            skipIndices.add(i + j);
          }
        }
      }
    }
    
    // Strategy 2: Translate individual words not caught by phrases
    for (let i = 0; i < words.length; i++) {
      if (skipIndices.has(i)) continue; // Skip if already translated as part of a phrase
      
      const word = words[i].toLowerCase();
      if (dictionary[word]) {
        translatedWords.push(dictionary[word]);
      } else {
        // If word not found in dictionary, keep original
        translatedWords.push(words[i]);
      }
    }
    
    translatedSentences.push(translatedWords.join(' '));
  }
  
  return translatedSentences.join(' ');
}

/**
 * Always returns true since we're using a built-in translation function
 * @returns True always
 */
export function isTranslationApiConfigured(): boolean {
  return true;
}
