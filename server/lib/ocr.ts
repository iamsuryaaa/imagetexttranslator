import Tesseract from 'tesseract.js';

/**
 * Extract text from an image using Tesseract OCR
 * @param imageBuffer The image buffer to process
 * @returns The extracted text
 */
export async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  try {
    const result = await Tesseract.recognize(
      imageBuffer,
      'eng', // English language for OCR
      { 
        logger: m => console.log(`OCR Progress: ${m.status} - ${Math.floor(m.progress * 100)}%`) 
      }
    );
    
    return result.data.text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error('Failed to extract text from image');
  }
}

/**
 * Extract text from a text file
 * @param textBuffer The text file buffer to process
 * @returns The extracted text
 */
export function extractTextFromTextFile(textBuffer: Buffer): string {
  try {
    return textBuffer.toString('utf-8');
  } catch (error) {
    console.error('Error extracting text from text file:', error);
    throw new Error('Failed to extract text from text file');
  }
}

/**
 * Simple function to determine if a file is likely to be an image
 * @param mimeType The MIME type of the file
 * @returns Whether the file is likely an image
 */
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Simple function to determine if a file is likely to be a text file
 * @param mimeType The MIME type of the file
 * @returns Whether the file is likely a text file
 */
export function isTextFile(mimeType: string): boolean {
  return mimeType === 'text/plain' || 
         mimeType === 'application/pdf' || 
         mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
}
