import React from 'react';
import { Scan, Languages, FileText } from 'lucide-react';

export default function FeatureSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <Scan className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Optical Character Recognition</h3>
        <p className="text-gray-600">Extract text from images and documents with high accuracy using advanced OCR technology.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <Languages className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Indian Language Translation</h3>
        <p className="text-gray-600">Translate text to multiple Indian languages including Hindi, Bengali, Tamil, and more.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Intelligent Summarization</h3>
        <p className="text-gray-600">Get concise summaries of your content to quickly understand the main points.</p>
      </div>
    </div>
  );
}
