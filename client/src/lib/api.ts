import { apiRequest } from './queryClient';
import { LanguageCode, ProcessDocumentRequest } from '@shared/schema';

export interface UploadFileResponse {
  document: {
    id: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    originalText: string | null;
    processed: boolean;
    uploadedAt: string;
  }
}

export interface ProcessDocumentResponse {
  document: {
    id: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    originalText: string;
    processed: boolean;
    uploadedAt: string;
  };
  translation: {
    id: number;
    documentId: number;
    language: string;
    translatedText: string;
    createdAt: string;
  };
  summary?: {
    id: number;
    documentId: number;
    language: string;
    summary: string;
    createdAt: string;
  } | null;
}

export interface FetchDocumentResponse {
  document: {
    id: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    originalText: string;
    processed: boolean;
    uploadedAt: string;
  };
  translations: Array<{
    id: number;
    documentId: number;
    language: string;
    translatedText: string;
    createdAt: string;
  }>;
  summary?: {
    id: number;
    documentId: number;
    language: string;
    summary: string;
    createdAt: string;
  } | null;
}

export interface ApiConfig {
  translationApiConfigured: boolean;
  summarizationApiConfigured: boolean;
}

/**
 * Upload a file for text extraction
 */
export async function uploadFile(file: File): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${errorText}`);
  }
  
  return response.json();
}

/**
 * Process a document by translating and/or summarizing it
 */
export async function processDocument(options: ProcessDocumentRequest): Promise<ProcessDocumentResponse> {
  const { documentId, targetLanguage, summarize } = options;
  const res = await apiRequest("POST", `/api/documents/${documentId}/process`, {
    targetLanguage,
    summarize,
  });
  
  return res.json();
}

/**
 * Fetch a document by ID
 */
export async function fetchDocument(documentId: number): Promise<FetchDocumentResponse> {
  const res = await apiRequest("GET", `/api/documents/${documentId}`);
  return res.json();
}

/**
 * Get API configuration status
 */
export async function getApiConfig(): Promise<ApiConfig> {
  const res = await apiRequest("GET", "/api/config");
  return res.json();
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

/**
 * Get display name for language code
 */
export function getLanguageDisplayName(code: string): string {
  const languageMap: Record<string, string> = {
    hi: "Hindi",
    bn: "Bengali",
    ta: "Tamil",
    te: "Telugu",
    mr: "Marathi",
    kn: "Kannada",
    gu: "Gujarati",
    original: "Original Language"
  };
  
  return languageMap[code] || code;
}
