'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import DonorBookingForm from '@/components/booking/donor-booking';
import { useAuth } from '@/app/contexts/use-auth';

export default function BookingPage() {
  const [isVeridaConnected, setIsVeridaConnected] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { isOnboarded } = useAuth();

  useEffect(() => {
    if (!isConnected) {
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
    } else {
      router.push('/booking')
    }
    checkVeridaConnection();
  }, [isConnected, router, isOnboarded]);

  const checkVeridaConnection = async () => {
    try {
      const response = await fetch('/api/fertility-ai/auth/verida/check');
      const data = await response.json();
      setIsVeridaConnected(data.isConnected);
      // setIsLoading(false);
    } catch (error) {
      console.error('Error checking Verida connection:', error);
      setIsVeridaConnected(false);
      // setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <DonorBookingForm
        donorId={address as string}
        hospitalId="default-hospital"
        isAuthenticated={isVeridaConnected}
      />
    </div>
  );
}
