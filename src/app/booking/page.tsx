'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/use-auth';
import { useAccount } from 'wagmi';
import DonorBookingForm from '@/components/booking/donor-booking';
// import Header from '@/components/Header';

export default function BookingPage() {
  const [isVeridaConnected, setIsVeridaConnected] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address, isConnected } = useAccount();
  const { isOnboarded } = useAuth();

  useEffect(() => {
    // Only check wallet connection
    if (!isConnected || !address) {
      toast.error('Wallet Required', {
        description: 'Please connect your wallet to proceed with booking',
      });
      router.push('/');
      return;
    }
    
    if (!isOnboarded) {
      toast.error('Onboarding Required', {
        description: 'Please complete the onboarding process',
      });
      router.push('/');
      return;
    }

    // Handle auth token if present in URL
    const authToken = searchParams.get('auth_token');
    if (authToken) {
      localStorage.setItem('veridaToken', authToken);
      setIsVeridaConnected(true);
      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else {
      // Check if we have a stored token
      const storedToken = localStorage.getItem('veridaToken');
      setIsVeridaConnected(!!storedToken);
    }
  }, [isConnected, router, isOnboarded, address, searchParams]);

  return (
    <main className='bg-white'>
      {/* <Header /> */}
      <div className="container mx-auto p-4">
        <DonorBookingForm
          donorId={address as string}
          hospitalId="default-hospital"
          isAuthenticated={isVeridaConnected}
        />
      </div>
    </main>
  );
}
