'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/use-auth';
import { useAccount } from 'wagmi';
import DonorBookingForm from '@/components/booking/donor-booking';
import Header from '@/components/Header';

export default function BookingPage() {
  const [isVeridaConnected, setIsVeridaConnected] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { isOnboarded } = useAuth();

  useEffect(() => {
    // if (!isConnected) {
    //   toast.error('Wallet Required', {
    //     description: 'Please connect your wallet to proceed with booking',
    //   });
    //   router.push('/');
    //   return;
    // }
    if (!address) {
      toast.error('Onboarding Required', {
        description: 'Please complete the onboarding process',
      });
      router.push('/');
      return;
    } else {
      router.push('/booking')
    }
    checkVeridaConnection();
  }, [isConnected, router, isOnboarded, address]);

  const checkVeridaConnection = async () => {
    try {
      const response = await fetch('/api/fertility-ai/auth/verida/check');
      const data = await response.json();
      setIsVeridaConnected(data.isConnected);
      setIsVeridaConnected(true);
      // setIsLoading(false);
    } catch (error) {
      console.error('Error checking Verida connection:', error);
      setIsVeridaConnected(false);
      // setIsLoading(false);
    }
  };


  return (
    <main className='bg-white'>
      <Header />
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


// 'use client';

// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useAuth } from '../contexts/use-auth';
// import { useAccount } from 'wagmi';
// import DonorBookingForm from '@/components/booking/donor-booking';
// import Header from '@/components/Header';

// export default function BookingPage() {
//   const [isVeridaConnected, setIsVeridaConnected] = useState(false);
//   const [isProcessingAuth, setIsProcessingAuth] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { address, isConnected } = useAccount();
//   const { isOnboarded } = useAuth();

//   useEffect(() => {
//     // Check for auth_token in URL
//     const authToken = searchParams.get('auth_token');
    
//     if (authToken) {
//       handleVeridaCallback(authToken);
//     } else {
//       checkVeridaConnection();
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (!isConnected) {
//       toast.error('Wallet Required', {
//         description: 'Please connect your wallet to proceed with booking',
//       });
//       router.push('/');
//       return;
//     }
//     if (!address) {
//       toast.error('Onboarding Required', {
//         description: 'Please complete the onboarding process',
//       });
//       router.push('/');
//       return;
//     }
//   }, [isConnected, router, isOnboarded, address]);

//   const handleVeridaCallback = async (authToken: string) => {
//     setIsProcessingAuth(true);
//     try {
//       // Store the token
//       const response = await fetch('/api/fertility-ai/auth/verida/callback', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ auth_token: authToken }),
//       });

//       const data = await response.json();
      
//       if (data.success) {
//         setIsVeridaConnected(true);
//         // Remove auth_token from URL without page reload
//         const newUrl = window.location.pathname;
//         window.history.replaceState({}, '', newUrl);
        
//         toast.success('Connected', {
//           description: 'Successfully connected to Verida',
//         });
//       } else {
//         throw new Error(data.error || 'Failed to process authentication');
//       }
//     } catch (error) {
//       console.error('Error processing Verida callback:', error);
//       toast.error('Connection Failed', {
//         description: 'Failed to connect to Verida. Please try again.',
//       });
//       setIsVeridaConnected(false);
//     } finally {
//       setIsProcessingAuth(false);
//     }
//   };

//   const checkVeridaConnection = async () => {
//     try {
//       const response = await fetch('/api/fertility-ai/auth/verida/check');
//       const data = await response.json();
//       setIsVeridaConnected(data.isConnected);
//     } catch (error) {
//       console.error('Error checking Verida connection:', error);
//       setIsVeridaConnected(false);
//     }
//   };

//   if (isProcessingAuth) {
//     return (
//       <main className='bg-white'>
//         <Header />
//         <div className="container mx-auto p-4 text-center">
//           <div className="animate-pulse">Processing authentication...</div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className='bg-white'>
//       <Header />
//       <div className="container mx-auto p-4">
//         <DonorBookingForm
//           donorId={address as string}
//           hospitalId="default-hospital"
//           isAuthenticated={isVeridaConnected}
//         />
//       </div>
//     </main>
//   );
// }
