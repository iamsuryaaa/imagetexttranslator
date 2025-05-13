import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Copy, Download } from 'lucide-react';
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
        <CardTitle className="text-xl font-semibold text-gray-800">Results</CardTitle>
      </CardHeader>
      <CardContent>
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
