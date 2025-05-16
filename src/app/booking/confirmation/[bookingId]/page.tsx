// "use client"

// import React, { useState, useEffect } from 'react';
// import { NextPage } from 'next';
// import { useRouter } from 'next/router';
// import Head from 'next/head';
// import Link from 'next/link';
// import { format } from 'date-fns';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { CalendarIcon, Clock, MapPin, FileText, AlertCircle, CheckCircle2, CalendarPlus } from 'lucide-react';
// import { withSessionSsr } from '@/lib/verida-session';

// interface BookingDetails {
//   id: string;
//   donorId: string;
//   donorName: string;
//   hospitalId: string;
//   hospitalName: string;
//   hospitalAddress: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   purpose: string;
//   status: 'confirmed' | 'pending' | 'cancelled';
//   room?: string;
//   additionalNotes?: string;
//   createdAt: string;
// }

// interface BookingConfirmationProps {
//   bookingId?: string;
// }

// interface FetchError {
//   message: string;
//   code?: string;
//   status?: number;
// }

// const BookingConfirmation: NextPage<BookingConfirmationProps> = ({ bookingId: initialBookingId }) => {
//   const router = useRouter();
//   const { bookingId: routerBookingId } = router.query;
//   const bookingId = initialBookingId || routerBookingId;

//   const [booking, setBooking] = useState<BookingDetails | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [calendarAdded, setCalendarAdded] = useState(false);
//   const [reminderAdded, setReminderAdded] = useState(false);

//   // Fetch booking details when bookingId is available
//   useEffect(() => {
//     const fetchBookingDetails = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         // Mock data
//         const mockBooking: BookingDetails = {
//           id: bookingId as string,
//           donorId: 'donor-123',
//           donorName: 'John Smith',
//           hospitalId: 'hospital-456',
//           hospitalName: 'Fertility Center Hospital',
//           hospitalAddress: '123 Medical Way, New York, NY 10001',
//           date: new Date(2025, 4, 15).toISOString(),
//           startTime: '14:30',
//           endTime: '15:30',
//           purpose: 'Sperm Donation',
//           status: 'confirmed',
//           room: 'Room 304',
//           additionalNotes: 'Please arrive 15 minutes early to complete paperwork.',
//           createdAt: new Date().toISOString()
//         };

//         setBooking(mockBooking);
//       } catch (err) {
//         const error = err as FetchError;
//         setError(error.message || 'Failed to fetch booking details');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (bookingId) {
//       fetchBookingDetails();
//     }
//   }, [bookingId]);

//   const addToCalendar = async () => {
//     if (!booking) return;

//     try {
//       // In a real app, you would call your API to create a calendar event
//       // const response = await axios.post('/api/calendar/create', {
//       //   title: `${booking.purpose} - ${booking.hospitalName}`,
//       //   startDate: `${booking.date}T${booking.startTime}:00`,
//       //   endDate: `${booking.date}T${booking.endTime}:00`,
//       //   location: booking.hospitalAddress,
//       //   description: `Room: ${booking.room}\n${booking.additionalNotes || ''}`,
//       //   type: 'fertility-appointment'
//       // });

//       // Mock successful response
//       setTimeout(() => {
//         setCalendarAdded(true);
//       }, 500);
//     } catch (err) {
//       console.error('Error adding to calendar:', err);
//     }
//   };

//   const setReminder = async () => {
//     if (!booking) return;

//     try {
//       // In a real app, you would call your API to set a reminder
//       // const response = await axios.post('/api/reminders/create', {
//       //   bookingId: booking.id,
//       //   reminderTime: '24h' // 24 hours before appointment
//       // });

//       // Mock successful response
//       setTimeout(() => {
//         setReminderAdded(true);
//       }, 500);
//     } catch (err) {
//       console.error('Error setting reminder:', err);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-4 max-w-3xl">
//         <Head>
//           <title>Booking Confirmation | Fertility Care</title>
//         </Head>

//         <div className="flex justify-center items-center h-64">
//           <div className="space-y-3 text-center">
//             {/* <Icons.spinner className="h-8 w-8 mx-auto animate-spin" /> */}
//             <p>Loading booking details...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !booking) {
//     return (
//       <div className="container mx-auto p-4 max-w-3xl">
//         <Head>
//           <title>Booking Error | Fertility Care</title>
//         </Head>

//         <Alert variant="destructive" className="mb-6">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>
//             {error || 'Booking details not found'}
//           </AlertDescription>
//         </Alert>

//         <div className="flex justify-center">
//           <Button asChild>
//             <Link href="/dashboard">Return to Dashboard</Link>
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 max-w-3xl">
//       <Head>
//         <title>Booking Confirmation | Fertility Care</title>
//       </Head>

//       <div className="text-center mb-8">
//         <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-green-100 mb-4">
//           <CheckCircle2 className="h-8 w-8 text-green-600" />
//         </div>
//         <h1 className="text-2xl font-bold mb-2">Booking Confirmed</h1>
//         <p className="text-gray-500">
//           Your donation appointment has been successfully scheduled
//         </p>
//       </div>

//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Appointment Details</CardTitle>
//           <CardDescription>
//             Booking ID: {booking.id}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex items-start gap-4">
//             <Avatar className="h-12 w-12 border">
//               <AvatarImage src="/hospital-logo.png" alt={booking.hospitalName} />
//               <AvatarFallback>{booking.hospitalName.substring(0, 2).toUpperCase()}</AvatarFallback>
//             </Avatar>
//             <div>
//               <h3 className="font-medium">{booking.hospitalName}</h3>
//               <p className="text-gray-500">{booking.hospitalAddress}</p>
//             </div>
//           </div>

//           <Separator />

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1">
//               <div className="flex items-center text-gray-500 text-sm">
//                 <CalendarIcon className="h-4 w-4 mr-2" />
//                 Date
//               </div>
//               <p className="font-medium">{format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}</p>
//             </div>

//             <div className="space-y-1">
//               <div className="flex items-center text-gray-500 text-sm">
//                 <Clock className="h-4 w-4 mr-2" />
//                 Time
//               </div>
//               <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
//             </div>

//             <div className="space-y-1">
//               <div className="flex items-center text-gray-500 text-sm">
//                 <FileText className="h-4 w-4 mr-2" />
//                 Purpose
//               </div>
//               <p className="font-medium">{booking.purpose}</p>
//             </div>

//             <div className="space-y-1">
//               <div className="flex items-center text-gray-500 text-sm">
//                 <MapPin className="h-4 w-4 mr-2" />
//                 Room
//               </div>
//               <p className="font-medium">{booking.room || 'To be assigned'}</p>
//             </div>
//           </div>

//           {booking.additionalNotes && (
//             <>
//               <Separator />
//               <div className="space-y-1">
//                 <h3 className="text-sm font-medium">Additional Notes</h3>
//                 <p className="text-sm text-gray-600">{booking.additionalNotes}</p>
//               </div>
//             </>
//           )}

//           <Separator />

//           <div className="flex flex-col gap-3">
//             <Button
//               variant="outline"
//               className="justify-start"
//               onClick={addToCalendar}
//               disabled={calendarAdded}
//             >
//               <CalendarPlus className="h-4 w-4 mr-2" />
//               {calendarAdded ? 'Added to Calendar' : 'Add to Calendar'}
//               {calendarAdded && <CheckCircle2 className="h-4 w-4 ml-2 text-green-600" />}
//             </Button>

//             <Button
//               variant="outline"
//               className="justify-start"
//               onClick={setReminder}
//               disabled={reminderAdded}
//             >
//               <AlertCircle className="h-4 w-4 mr-2" />
//               {reminderAdded ? 'Reminder Set' : 'Set Reminder (24h before)'}
//               {reminderAdded && <CheckCircle2 className="h-4 w-4 ml-2 text-green-600" />}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       <Alert className="mb-6">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Preparation Instructions</AlertTitle>
//         <AlertDescription>
//           <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
//             <li>Abstain from ejaculation for 2-5 days before your appointment</li>
//             <li>Stay well-hydrated 24 hours before donation</li>
//             <li>Bring a valid photo ID</li>
//             <li>Arrive 15 minutes early to complete paperwork</li>
//           </ul>
//         </AlertDescription>
//       </Alert>

//       <div className="flex justify-between">
//         <Button variant="outline" asChild>
//           <Link href="/dashboard">Return to Dashboard</Link>
//         </Button>

//         <Button asChild>
//           <Link href={`/bookings/${booking.id}`}>View Appointment Details</Link>
//         </Button>
//       </div>
//     </div>
//   );
// };

// export const getBookingServerSideProps = withSessionSsr(async function ({ req, params }) {
//   const user = req.session.user;
//   const { bookingId } = params || {};

//   if (!user) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       bookingId: bookingId || null
//     }
//   };
// });

// export default BookingConfirmation;


'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/use-auth';
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
