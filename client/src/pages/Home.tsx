import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import ResultsSection from '@/components/ResultsSection';
import FeatureSection from '@/components/FeatureSection';
import LanguageShowcase from '@/components/LanguageShowcase';
import { processDocument, fetchDocument, getApiConfig } from '@/lib/api';
import { LanguageCode } from '@shared/schema';

export default function Home() {
  const { toast } = useToast();
  const [showResults, setShowResults] = useState(false);
  const [processingDetails, setProcessingDetails] = useState<{
    documentId: number;
    language: LanguageCode;
    summarize: boolean;
  } | null>(null);

  // Check API configuration status
  const configQuery = useQuery({
    queryKey: ['/api/config'],
    queryFn: getApiConfig,
  });

  // Check if APIs are not configured and show a warning toast
  React.useEffect(() => {
    if (configQuery.data) {
      const { translationApiConfigured, summarizationApiConfigured } = configQuery.data;
      
      if (!translationApiConfigured) {
        toast({
          title: "Translation API not configured",
          description: "Translation functionality will be limited without an API key",
          variant: "destructive",
        });
      }
      
      if (!summarizationApiConfigured) {
        toast({
          title: "Summarization API not configured",
          description: "Summarization functionality will be limited without an API key",
          variant: "destructive",
        });
      }
    }
  }, [configQuery.data, toast]);

  // Process document mutation
  const processMutation = useMutation({
    mutationFn: processDocument,
    onSuccess: () => {
      // Refetch document after processing
      if (processingDetails) {
        documentQuery.refetch();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch document query
  const documentQuery = useQuery({
    queryKey: ['/api/documents', processingDetails?.documentId],
    queryFn: () => processingDetails ? fetchDocument(processingDetails.documentId) : Promise.reject('No document ID'),
    enabled: !!processingDetails,
  });

  // Handle file processing
  const handleProcessComplete = (documentId: number, language: LanguageCode, summarize: boolean) => {
    setProcessingDetails({ documentId, language, summarize });
    
    // Process the document
    processMutation.mutate({
      documentId,
      targetLanguage: language,
      summarize,
    });
    
    // Show results section
    setShowResults(true);
  };

  // Reset form and start a new upload
  const handleNewUpload = () => {
    setShowResults(false);
    setProcessingDetails(null);
  };

  // Find the translation for the current language
  const getCurrentTranslation = () => {
    if (!documentQuery.data || !processingDetails) return null;
    
    return documentQuery.data.translations.find(
      translation => translation.language === processingDetails.language
    );
  };

  // Wait for translation to be available after processing
  const translation = processMutation.isPending ? null : getCurrentTranslation();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Scan, Translate & Summarize</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload an image or document and instantly translate text to multiple Indian languages. 
            Get summaries to quickly understand content.
          </p>
        </div>

        {!showResults ? (
          <FileUpload onProcessComplete={handleProcessComplete} />
        ) : (
          <ResultsSection
            originalText={documentQuery.data?.document.originalText || "Loading original text..."}
            translatedText={translation?.translatedText || 
              (processMutation.isPending ? "Translating..." : "Translation not found. Please try again.")}
            translatedLanguage={processingDetails?.language || "hi"}
            summary={documentQuery.data?.summary?.summary}
            onNewUpload={handleNewUpload}
          />
        )}

        <FeatureSection />
        <LanguageShowcase />
        
        {/* Language banner */}
        <div className="relative rounded-xl overflow-hidden mb-12">
          <div className="w-full h-64 bg-gradient-to-r from-primary-600 to-primary-800 flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Bridging Language Barriers</h2>
              <p className="max-w-2xl mx-auto text-white/90">
                Our platform makes communication seamless across India's diverse linguistic landscape.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
