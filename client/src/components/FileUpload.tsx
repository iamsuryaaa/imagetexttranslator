import React, { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFileUpload } from '@/hooks/useFileUpload';
import { formatFileSize } from '@/lib/api';
import { LanguageCode } from '@shared/schema';

interface FileUploadProps {
  onProcessComplete: (documentId: number, language: string, summarize: boolean) => void;
}

export default function FileUpload({ onProcessComplete }: FileUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    file,
    filePreview,
    isUploading,
    uploadProgress,
    uploadError,
    uploadResult,
    handleFileChange,
    uploadSelectedFile,
    resetUpload
  } = useFileUpload();

  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>('hi');
  const [summarize, setSummarize] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (uploadAreaRef.current) {
      uploadAreaRef.current.classList.add('dragover');
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    if (uploadAreaRef.current) {
      uploadAreaRef.current.classList.remove('dragover');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (uploadAreaRef.current) {
      uploadAreaRef.current.classList.remove('dragover');
    }
    
    if (e.dataTransfer.files.length) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  }, [handleFileChange]);

  // Handle clicking on upload area
  const handleUploadAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Process the uploaded file
  const handleProcessFile = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to process",
        variant: "destructive",
      });
      return;
    }

    try {
      // First upload the file if not already uploaded
      let result = uploadResult;
      if (!result) {
        setIsProcessing(true);
        result = await uploadSelectedFile();
        if (!result) {
          throw new Error(uploadError || "Failed to upload file");
        }
      }

      // File is uploaded, now call onProcessComplete with document ID
      onProcessComplete(result.document.id, targetLanguage, summarize);
    } catch (error) {
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-md mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">Upload Your File</CardTitle>
      </CardHeader>
      <CardContent>
        {/* File Upload Area */}
        <div
          ref={uploadAreaRef}
          className={`upload-area border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 ${!file ? '' : 'hidden'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadAreaClick}
        >
          <div className="mb-4">
            <Upload className="h-10 w-10 text-gray-400 mx-auto" />
          </div>
          <p className="text-gray-600 mb-2">
            Drag and drop your file here or <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-sm text-gray-500">
            Supports: JPG, PNG, PDF, DOCX, TXT (Max: 10MB)
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf,.docx,.txt"
            onChange={handleFileInputChange}
          />
        </div>
        
        {/* File Preview */}
        {file && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-4">
              {/* Preview icon or thumbnail */}
              <div className="flex-shrink-0">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="File preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-xs">
                      {file.name.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)} • {file.type.split('/')[0].charAt(0).toUpperCase() + file.type.split('/')[0].slice(1)}
                </p>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress value={uploadProgress} className="mt-2 h-2" />
                )}
                
                {uploadError && (
                  <p className="text-sm text-red-500 mt-1">{uploadError}</p>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  disabled={isUploading || isProcessing}
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Processing Options */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Selector */}
          <div>
            <Label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Translate to Language
            </Label>
            <Select
              value={targetLanguage}
              onValueChange={(value) => setTargetLanguage(value as LanguageCode)}
              disabled={isUploading || isProcessing}
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                <SelectItem value="kn">Kannada (ಕನ್ನಡ)</SelectItem>
                <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Summarize Toggle */}
          <div>
            <Label htmlFor="summarize" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Options
            </Label>
            <div className="flex items-center">
              <Checkbox
                id="summarize"
                checked={summarize}
                onCheckedChange={(checked) => setSummarize(checked === true)}
                disabled={isUploading || isProcessing}
              />
              <label htmlFor="summarize" className="ml-2 block text-sm text-gray-700">
                Summarize text content
              </label>
            </div>
          </div>
        </div>
        
        {/* Processing Button */}
        <div className="mt-6">
          {!isUploading && !isProcessing ? (
            <Button
              onClick={handleProcessFile}
              disabled={!file || isUploading || isProcessing}
              className="w-full sm:w-auto"
            >
              Process File
            </Button>
          ) : (
            <Button
              disabled
              className="w-full sm:w-auto bg-primary-100 text-primary-700"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUploading ? 'Uploading...' : 'Processing...'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
