'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, Home } from 'lucide-react';

export default function ThanksPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Your Application!
          </h1>
          <p className="text-gray-600 mb-8">
            We've received your application and our admissions team will contact you within 24 hours.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <div className="text-sm text-gray-500">
              <p>Need immediate assistance?</p>
              <p className="font-semibold">Call us at +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}