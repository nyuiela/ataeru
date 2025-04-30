// "use client"
// import { VeramoDataService } from '@/lib/services/cheqd/users/user-veramo-service';
// import { IBookingDetails } from '@/lib/types/cheqd';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// interface BookingCredentialSubject {
//   bookingRef: string;
//   appointmentDate: string;
//   status: 'pending' | 'accepted' | 'declined';
//   donationId: string;
// }

// export interface ExtendedBooking extends IBookingDetails {
//   status: 'pending' | 'accepted' | 'declined';
// }

// const BookingConfirmationPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const bookingRef = searchParams.get('bookingRef');
//   const [booking, setBooking] = useState<ExtendedBooking | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (!bookingRef) return;

//     const fetchBooking = async () => {
//       try {
//         const veramoService = new VeramoDataService();

//         const credentials = await veramoService.agent.dataStoreORMGetVerifiableCredentials({
//           where: [
//             { column: 'type', value: ['DonationBooking'] },
//             { column: 'id', value: [`${bookingRef}`] },
//           ],
//         });

//         if (credentials.length === 0) {
//           throw new Error('Booking not found');
//         }

//         const bookingCredential = credentials[0];
//         const subject = bookingCredential.verifiableCredential.credentialSubject as BookingCredentialSubject;

//         setBooking({
//           bookingRef: subject.bookingRef,
//           date: new Date(subject.appointmentDate).toLocaleString(),
//           status: subject.status,
//           donationId: subject.donationId,
//         });
//       } catch (err) {
//         console.error('Failed to fetch booking:', err);
//         setError(err instanceof Error ? err.message : 'Unknown error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooking();
//   }, [bookingRef]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-md mx-auto mt-10 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//         <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
//         <p className="text-red-600 mb-4">{error}</p>
//         <button
//           onClick={() => router.push('/donations')}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md"
//         >
//           Back to Donations
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10 bg-white border border-gray-200 rounded-lg p-6">
//       <div className="text-center mb-6">
//         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//           <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
//         <h2 className="text-2xl font-bold mb-2">Booking Confirmed</h2>
//         <p className="text-gray-600">Your donation appointment is scheduled</p>
//       </div>

//       <div className="space-y-4 mb-6">
//         <div>
//           <h3 className="font-medium text-gray-500">Reference</h3>
//           <p className="font-mono">{booking?.bookingRef}</p>
//         </div>
//         <div>
//           <h3 className="font-medium text-gray-500">Appointment Date</h3>
//           <p>{booking?.date}</p>
//         </div>
//         <div>
//           <h3 className="font-medium text-gray-500">Status</h3>
//           <p className="capitalize">{booking?.status}</p>
//         </div>
//       </div>

//       <div className="flex flex-col space-y-3">
//         <button
//           onClick={() => router.push('/donations')}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md"
//         >
//           Back to Donations
//         </button>
//         <button
//           onClick={() => router.push('/profile/appointments')}
//           className="px-4 py-2 border rounded-md"
//         >
//           View All Appointments
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BookingConfirmationPage;


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
            This page is unavaible, try again later.
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