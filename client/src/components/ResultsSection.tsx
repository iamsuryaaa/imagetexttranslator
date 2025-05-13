import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, Copy, Download, FileText, 
  BookOpen, Languages, Save 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getLanguageDisplayName } from '@/lib/api';

interface ResultsSectionProps {
  originalText: string;
  translatedText: string;
  translatedLanguage: string;
  summary?: string;
  onNewUpload: () => void;
}

export default function ResultsSection({
  originalText,
  translatedText,
  translatedLanguage,
  summary,
  onNewUpload
}: ResultsSectionProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('original');
  const [copiedStates, setCopiedStates] = useState({
    original: false,
    translated: false,
    summary: false
  });

  // Handle copy to clipboard
  const handleCopy = (text: string, type: 'original' | 'translated' | 'summary') => {
    navigator.clipboard.writeText(text).then(() => {
      // Update copy state to show feedback
      setCopiedStates(prev => ({ ...prev, [type]: true }));
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }));
      }, 2000);
      
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied to your clipboard",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    });
  };

  // Handle download as text file
  const handleDownload = () => {
    let content = "";
    let filename = "text-translate-results.txt";
    
    // Include all content in the download
    content += "===== ORIGINAL TEXT =====\n\n";
    content += originalText;
    content += "\n\n===== TRANSLATED TEXT (" + getLanguageDisplayName(translatedLanguage) + ") =====\n\n";
    content += translatedText;
    
    if (summary) {
      content += "\n\n===== SUMMARY =====\n\n";
      content += summary;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your results are being downloaded as a text file",
    });
  };

  return (
    <Card className="bg-white rounded-xl shadow-md mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">Your Processed Results</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Steps process indicators */}
        <div className="flex mb-8 justify-between">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-2">
              <FileText className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium text-gray-600">Text Extracted</div>
          </div>
          
          <div className="flex-1 mx-2 flex items-center">
            <div className="h-0.5 w-full bg-green-500"></div>
          </div>
          
          {summary ? (
            <>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-2">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium text-gray-600">Summarized</div>
              </div>

              <div className="flex-1 mx-2 flex items-center">
                <div className="h-0.5 w-full bg-green-500"></div>
              </div>
            </>
          ) : null}
          
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-2">
              <Languages className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium text-gray-600">Translated</div>
          </div>
          
          <div className="flex-1 mx-2 flex items-center">
            <div className="h-0.5 w-full bg-green-500"></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-2">
              <Save className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium text-gray-600">Saved</div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 border-b border-gray-200 w-full justify-start">
            <TabsTrigger value="original" className="pb-4 px-1 data-[state=active]:border-primary data-[state=active]:text-primary">
              Original Text
            </TabsTrigger>
            <TabsTrigger value="translated" className="pb-4 px-1 data-[state=active]:border-primary data-[state=active]:text-primary">
              Translated ({getLanguageDisplayName(translatedLanguage)})
            </TabsTrigger>
            {summary && (
              <TabsTrigger value="summary" className="pb-4 px-1 data-[state=active]:border-primary data-[state=active]:text-primary">
                Summary
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="original" className="text-display">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-800">Original Text</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:text-primary-600 font-medium"
                onClick={() => handleCopy(originalText, 'original')}
              >
                {copiedStates.original ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                {copiedStates.original ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-gray-700 whitespace-pre-wrap">
              {originalText}
            </div>
          </TabsContent>

          <TabsContent value="translated" className="text-display">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h4 className="text-lg font-medium text-gray-800">{getLanguageDisplayName(translatedLanguage)} Translation</h4>
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-200"
                  onClick={() => {
                    // Text-to-speech functionality
                    if ('speechSynthesis' in window) {
                      // Stop any currently speaking synthesis
                      window.speechSynthesis.cancel();

                      // Get speech language code based on translated language
                      const speechLangMap: Record<string, string> = {
                        hi: 'hi-IN',
                        bn: 'bn-IN',
                        ta: 'ta-IN',
                        te: 'te-IN',
                        mr: 'mr-IN',
                        kn: 'kn-IN',
                        gu: 'gu-IN'
                      };
                      
                      // Create and configure the utterance
                      const utterance = new SpeechSynthesisUtterance(translatedText);
                      utterance.lang = speechLangMap[translatedLanguage] || 'en-US';
                      
                      // Speak the text
                      window.speechSynthesis.speak(utterance);
                      
                      toast({
                        title: "Text-to-Speech",
                        description: "Playing audio in " + getLanguageDisplayName(translatedLanguage),
                      });
                    } else {
                      toast({
                        title: "Text-to-Speech Not Supported",
                        description: "Your browser doesn't support text-to-speech functionality",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-1">
                    <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                    <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
                  </svg>
                  Play Audio
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary-600 font-medium"
                  onClick={() => handleCopy(translatedText, 'translated')}
                >
                  {copiedStates.translated ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                  {copiedStates.translated ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-gray-700 whitespace-pre-wrap">
              {translatedText}
            </div>
          </TabsContent>

          {summary && (
            <TabsContent value="summary" className="text-display">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <h4 className="text-lg font-medium text-gray-800">Summary</h4>
                  <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary-600 font-medium"
                  onClick={() => handleCopy(summary, 'summary')}
                >
                  {copiedStates.summary ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                  {copiedStates.summary ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-gray-700 whitespace-pre-wrap">
                {summary}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Results
        </Button>
        <Button onClick={onNewUpload}>
          New Upload
        </Button>
      </CardFooter>
    </Card>
  );
}
