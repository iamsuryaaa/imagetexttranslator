import React from 'react';
import { Link } from 'wouter';
import { Languages } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Languages className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-bold text-gray-800">TextTranslate</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/">
                Home
              </Link>
            </li>
            <li>
              <Link href="/history">
                History
              </Link>
            </li>
            <li>
              <Link href="/about">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
