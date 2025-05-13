import React from 'react';
import { Languages } from 'lucide-react';
import { FiTwitter, FiFacebook, FiLinkedin, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Languages className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-lg font-bold text-gray-800">TextTranslate</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Breaking language barriers with advanced OCR, translation, and summarization technologies.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-600 hover:text-primary" aria-label="Twitter">
                <FiTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary" aria-label="Facebook">
                <FiFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary" aria-label="LinkedIn">
                <FiLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary" aria-label="Instagram">
                <FiInstagram className="text-xl" />
              </a>
            </div>
            <p className="text-sm text-gray-600">Email: contact@texttranslate.com</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} TextTranslate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
