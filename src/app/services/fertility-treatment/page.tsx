'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FertilityTreatmentRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/forms/fertility-treatment');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Redirecting to Fertility Treatment Form...</p>
      </div>
    </div>
  );
} 