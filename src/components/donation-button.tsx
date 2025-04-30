// import { AIAgentService } from '@/lib/services/cheqd/ai-agents/ai-veramo-service';
// import { VeramoDataService } from '@/lib/services/cheqd/users/user-veramo-service';
// import { VerifiablePresentation } from '@veramo/core';
// import { useState } from 'react';
// import { useAccount } from 'wagmi';


// interface DonationItem {
//   id: string;
//   title: string;
//   description: string;
//   location: string;
//   requirements: string[];
//   compensation: string;
// }

// interface BookingModalProps {
//   donation: DonationItem;
//   onClose: () => void;
//   onComplete: (bookingRef: string) => void;
// }

// const BookingModal = ({ donation, onClose, onComplete }: BookingModalProps) => {
//   const [step, setStep] = useState<'preparing' | 'processing' | 'success' | 'error'>('preparing');
//   const [progress, setProgress] = useState(0);
//   const [bookingRef, setBookingRef] = useState('');
//   const [error, setError] = useState('');
//   const { address } = useAccount();

//   const handleBookDonation = async () => {
//     try {
//       setStep('processing');
//       setProgress(20);
      
//       // Initialize services
//       const veramoService = new VeramoDataService();
//       const aiAgentService = new AIAgentService();
      
//       // Get user DID from wallet address
//       const userDid = `did:ethr:${address}`;
//       setProgress(40);
      
//       // Define the booking form based on donation requirements
//       const bookingForm = {
//         id: `donation-booking-${donation.id}`,
//         name: `Booking for ${donation.title}`,
//         fields: [
//           {
//             name: 'fullName',
//             type: 'string',
//             description: 'Your full name',
//             required: true,
//             sensitive: true,
//           },
//           {
//             name: 'dateOfBirth',
//             type: 'date',
//             description: 'Your date of birth',
//             required: true,
//             sensitive: true,
//           },
//           {
//             name: 'healthQuestionnaire',
//             type: 'text',
//             description: 'Health questionnaire responses',
//             required: true,
//             sensitive: true,
//           },
//           ...donation.requirements.map(req => ({
//             name: req.toLowerCase().replace(/\s+/g, '_'),
//             type: 'boolean',
//             description: req,
//             required: true,
//             sensitive: false,
//           })),
//         ],
//       };
      
//       setProgress(60);
      
//       // Get user data from Veramo (in a real app, this would come from a form or stored credentials)
//       const userData = await veramoService.retrieveUserData(userDid, {
//         storageType: 'off-chain',
//         // encryptionKey: 'user-provided-key', // In real app, get this securely
//         encryptionType: 'asymmetric'
//       });
      
//       setProgress(80);
      
//       // Process with AI agent
//       const result = await aiAgentService.processFormWithAgent(
//         {
//           ...userData,
//           donationId: donation.id,
//           acceptedRequirements: donation.requirements.reduce((acc, req) => {
//             acc[req.toLowerCase().replace(/\s+/g, '_')] = true;
//             return acc;
//           }, {} as Record<string, boolean>),
//         },
//         {
//             formDefinition: bookingForm,
//             userDid,
//             presentation: {
//                 holder: userDid, // The DID of the holder/user
//                 '@context': [
//                     'https://www.w3.org/2018/credentials/v1'
//                 ]
//             } as VerifiablePresentation
//         }
//       );
      
//       setProgress(100);
//       setBookingRef(`${result.bookingRef}`);
//       setStep('success');
//       onComplete(`${result.bookingRef}`);
//     } catch (err) {
//       console.error('Booking failed:', err);
//       setError(err instanceof Error ? err.message : 'Unknown error');
//       setStep('error');
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         {step === 'preparing' && (
//           <div className="text-center">
//             <h3 className="text-lg font-medium mb-4">Book {donation.title}</h3>
//             <p className="mb-6">This will use your verified information to complete the booking.</p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 border rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleBookDonation}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md"
//               >
//                 Confirm Booking
//               </button>
//             </div>
//           </div>
//         )}
        
//         {step === 'processing' && (
//           <div className="text-center">
//             <h3 className="text-lg font-medium mb-4">Processing Your Booking</h3>
//             <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
//               <div 
//                 className="bg-blue-600 h-2.5 rounded-full" 
//                 style={{ width: `${progress}%` }}
//               ></div>
//             </div>
//             <p className="text-sm text-gray-600">
//               {progress < 30 && 'Preparing your data...'}
//               {progress >= 30 && progress < 60 && 'Verifying information...'}
//               {progress >= 60 && progress < 90 && 'Processing with clinic...'}
//               {progress >= 90 && 'Finalizing booking...'}
//             </p>
//           </div>
//         )}
        
//         {step === 'success' && (
//           <div className="text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium mb-2">Booking Confirmed!</h3>
//             <p className="mb-4">Your donation appointment has been scheduled.</p>
//             <div className="bg-gray-50 p-4 rounded-md mb-6">
//               <p className="font-mono text-sm">Reference: {bookingRef}</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md w-full"
//             >
//               Done
//             </button>
//           </div>
//         )}
        
//         {step === 'error' && (
//           <div className="text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium mb-2">Booking Failed</h3>
//             <p className="mb-4 text-red-600">{error}</p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 border rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleBookDonation}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// interface BookDonationButtonProps {
//   donation: DonationItem;
// }

// export const BookDonationButton = ({ donation }: BookDonationButtonProps) => {
//   const [showModal, setShowModal] = useState(false);
//   const [currentBooking, setCurrentBooking] = useState<string | null>(null);

//   return (
//     <>
//       <button
//         onClick={() => setShowModal(true)}
//         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//         disabled={!!currentBooking}
//       >
//         {currentBooking ? 'Booked ✓' : 'Book Donation'}
//       </button>
      
//       {showModal && (
//         <BookingModal
//           donation={donation}
//           onClose={() => setShowModal(false)}
//           onComplete={(ref) => {
//             setCurrentBooking(ref);
//             setTimeout(() => setShowModal(false), 3000);
//           }}
//         />
//       )}
//     </>
//   );
// };