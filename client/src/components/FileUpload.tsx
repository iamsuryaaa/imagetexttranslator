import React, { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2, FileText, Languages, BookOpen, Save, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFileUpload } from '@/hooks/useFileUpload';
import { formatFileSize } from '@/lib/api';
import { LanguageCode } from '@shared/schema';

interface FileUploadProps {
  onProcessComplete: (documentId: number, language: any, summarize: boolean) => void;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [autoRunAll, setAutoRunAll] = useState(true);

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
    setCurrentStep(1);
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
      onProcessComplete(result.document.id, targetLanguage, true); // Always summarize
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

  // Step content
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white mr-3">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium">Step 1: Extract Text</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Upload an image or document file. Our system will extract all text content.
            </p>
            
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
          </div>
        );
      
      case 2:
        return (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white mr-3">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium">Step 2: Summarize Content</h3>
            </div>
            <p className="text-gray-600 mb-4">
              We'll generate a concise summary of the extracted text, highlighting key points.
            </p>
          </div>
        );
      
      case 3:
        return (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white mr-3">
                <Languages className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium">Step 3: Translate & Speak</h3>
            </div>
            <p className="text-gray-600 mb-4">
              The summary will be translated to your chosen language and read aloud with text-to-speech.
            </p>
            
            <div className="mt-4">
              <Label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                Choose Target Language
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
          </div>
        );
      
      case 4:
        return (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white mr-3">
                <Save className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium">Step 4: Save Results</h3>
            </div>
            <p className="text-gray-600 mb-4">
              All your processed data is automatically saved to the database for future reference.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Next step button handler
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      handleProcessFile();
    }
  };

  // Process all steps handler
  const handleProcessAll = () => {
    handleProcessFile();
  };

  // Determine if next step button should be disabled
  const isNextDisabled = () => {
    if (currentStep === 1 && !file) return true;
    return isUploading || isProcessing;
  };

  return (
    <Card className="bg-white rounded-xl shadow-md mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">Document Processing Wizard</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress steps */}
        <div className="flex mb-8 justify-between">
          {[1, 2, 3, 4].map(step => (
            <div 
              key={step} 
              className={`relative flex flex-col items-center ${step <= currentStep ? 'text-primary' : 'text-gray-400'}`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step <= currentStep ? 'border-primary bg-primary-50' : 'border-gray-300'} mb-1`}>
                {step}
              </div>
              <div className="text-xs font-medium">
                {step === 1 && "Extract"}
                {step === 2 && "Summarize"}
                {step === 3 && "Translate"}
                {step === 4 && "Save"}
              </div>
              {step < 4 && (
                <div className={`absolute top-4 left-full w-[calc(100%-2rem)] h-0.5 -z-10 ${step < currentStep ? 'bg-primary' : 'bg-gray-300'}`} style={{width: 'calc(100% - 2rem)', transform: 'translateX(-50%)'}}></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Current step content */}
        {renderStepContent()}
        
        {/* Action buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || isUploading || isProcessing}
          >
            Previous Step
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="default"
              onClick={handleProcessAll}
              disabled={!file || isUploading || isProcessing}
              className="flex items-center gap-2"
            >
              {isUploading || isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Process All Steps
            </Button>
            
            <Button
              onClick={handleNextStep}
              disabled={isNextDisabled()}
              className="flex items-center gap-1"
            >
              {currentStep === 4 ? 'Start Processing' : 'Next Step'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
