'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <Image 
            src="https://i.imgur.com/FvaUo3S.jpg" 
            alt="404 Not Found" 
            width={500} 
            height={400}
            className="mx-auto mb-8 rounded-lg shadow-lg"
          />
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            This page is unavaible, try again later..
          </p>
          
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}