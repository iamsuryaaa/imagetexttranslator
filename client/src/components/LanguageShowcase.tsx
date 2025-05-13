import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Language {
  name: string;
  nativeName: string;
  code: string;
}

const languages: Language[] = [
  { name: 'Hindi', nativeName: 'हिन्दी', code: 'hi' },
  { name: 'Bengali', nativeName: 'বাংলা', code: 'bn' },
  { name: 'Tamil', nativeName: 'தமிழ்', code: 'ta' },
  { name: 'Telugu', nativeName: 'తెలుగు', code: 'te' },
  { name: 'Marathi', nativeName: 'मराठी', code: 'mr' },
  { name: 'Kannada', nativeName: 'ಕನ್ನಡ', code: 'kn' },
  { name: 'Gujarati', nativeName: 'ગુજરાતી', code: 'gu' },
];

export default function LanguageShowcase() {
  return (
    <Card className="bg-white rounded-xl shadow-md mb-12">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 text-center">
          Supported Indian Languages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {languages.map((language) => (
            <div 
              key={language.code}
              className="p-4 border border-gray-200 rounded-lg text-center hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <p className="font-medium text-gray-800">{language.nativeName}</p>
              <p className="text-sm text-gray-600">{language.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
