'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-pulse">
          <Image 
            src="/images/logo.svg" 
            alt="LifeSpring Logo" 
            width={80} 
            height={80}
            className="w-20 h-20"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-blue-600 mt-6">
          LifeSpring
        </h1>
        
        <div className="mt-8 flex space-x-2">
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
        </div>
      </div>
    </div>
  );
}