import { useState } from 'react';
import { uploadFile, UploadFileResponse } from '@/lib/api';

export interface FileUploadHook {
  file: File | null;
  filePreview: string | null;
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  uploadResult: UploadFileResponse | null;
  handleFileChange: (file: File | null) => void;
  uploadSelectedFile: () => Promise<UploadFileResponse | null>;
  resetUpload: () => void;
}

export function useFileUpload(): FileUploadHook {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadFileResponse | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      resetUpload();
      return;
    }

    // Set the file for uploading
    setFile(selectedFile);
    setUploadError(null);

    // Create a preview for image files
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For non-image files, clear the preview
      setFilePreview(null);
    }
  };

  const uploadSelectedFile = async (): Promise<UploadFileResponse | null> => {
    if (!file) {
      setUploadError('No file selected');
      return null;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      const result = await uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);
      return result;
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setFilePreview(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    setUploadResult(null);
  };

  return {
    file,
    filePreview,
    isUploading,
    uploadProgress,
    uploadError,
    uploadResult,
    handleFileChange,
    uploadSelectedFile,
    resetUpload,
  };
}
