/**
 * Free text summarization implementation using extractive summarization
 * This basic algorithm works by identifying key sentences in the text without requiring any API
 */

/**
 * Calculate the frequency of each word in the text
 * @param text Text to analyze 
 * @returns Map with word frequencies
 */
function getWordFrequency(text: string): Map<string, number> {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/);
  
  const frequency = new Map<string, number>();
  
  // Common English stop words to exclude
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
    'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'from', 'that',
    'this', 'it', 'i', 'we', 'you', 'he', 'she', 'they', 'them'
  ]);
  
  words.forEach(word => {
    if (word.length > 1 && !stopWords.has(word)) {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    }
  });
  
  return frequency;
}

/**
 * Score each sentence based on word importance
 * @param sentences List of sentences in the text
 * @param wordFrequency Map of word frequencies
 * @returns Array of sentence scores
 */
function scoreSentences(sentences: string[], wordFrequency: Map<string, number>): number[] {
  return sentences.map(sentence => {
    const words = sentence.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (wordFrequency.has(word)) {
        score += wordFrequency.get(word) || 0;
      }
    });
    
    // Normalize by sentence length to prevent bias toward longer sentences
    return score / Math.max(1, words.length);
  });
}

/**
 * Summarize text using a simple extractive summarization algorithm (free, no API needed)
 * @param text The text to summarize
 * @param maxLength Optional maximum length for the summary (used as a guideline)
 * @returns The summarized text
 */
export async function summarizeText(text: string, maxLength: number = 250): Promise<string> {
  try {
    // Split text into sentences (simple splitting by periods, question marks, and exclamation points)
    const sentences = text
      .replace(/([.?!])\s+/g, "$1|")
      .split("|")
      .filter(sentence => sentence.trim().length > 0);
    
    // Return the original text if it's already shorter than the target length
    if (text.length <= maxLength || sentences.length <= 3) {
      return "Summary: " + text;
    }
    
    // Calculate word frequency
    const wordFrequency = getWordFrequency(text);
    
    // Score sentences
    const sentenceScores = scoreSentences(sentences, wordFrequency);
    
    // Determine how many sentences to include in the summary
    // Typically aim for about 1/3 of the original content or enough to meet maxLength
    const targetSentenceCount = Math.max(
      3,
      Math.min(
        Math.ceil(sentences.length / 3),
        Math.ceil(sentences.length * (maxLength / text.length) * 2)
      )
    );
    
    // Create pairs of [score, index] for sorting
    const scoredIndexes = sentenceScores.map((score, index) => [score, index]);
    
    // Sort by score in descending order
    scoredIndexes.sort((a, b) => (b[0] as number) - (a[0] as number));
    
    // Get the top N sentences by score
    const topIndexes = scoredIndexes
      .slice(0, targetSentenceCount)
      .map(pair => pair[1] as number)
      .sort(); // Sort by original position to maintain flow
    
    // Construct the summary
    const summaryText = topIndexes.map(index => sentences[index]).join(' ');
    
    // Add a title prefix to make it clear this is a summary
    return "Key Points Summary:\n\n" + summaryText;
  } catch (error) {
    console.error('Error summarizing text:', error);
    // In case of error, return a subset of the original text
    const words = text.split(/\s+/);
    if (words.length > 50) {
      return "Brief Summary:\n\n" + words.slice(0, 50).join(' ') + '...';
    }
    return "Summary:\n\n" + text;
  }
}

/**
 * Always returns true since we're using a built-in summarization function
 * @returns True always
 */
export function isSummarizationApiConfigured(): boolean {
  return true;
}
