import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { User, Calendar as CalendarIcon, Mail, Clipboard } from 'lucide-react';
import VeridaService from '@/lib/services/verida/verida-service';
import { withSessionSsr } from '@/lib/verida-session';

// Add interfaces for user and events
interface User {
  id: string;
  role: 'donor' | 'hospital' | 'admin';
  name: string;
  email: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  location?: string;
  description?: string;
}

interface Invitation {
  id: string;
  title: string;
  from: string;
  status: 'pending' | 'accepted' | 'declined';
  date: string | Date;
  compensationOffered?: number;
}

interface Appointment {
  id: string;
  type: string;
  date: string | Date;
  hospitalName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  room?: string;
}

const Dashboard: NextPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const veridaServiceInstance = useMemo(() => new VeridaService(), []);

  // Add connectVerida function from DonorBookingForm
  const connectVerida = async (redirectPath?: string) => {
    try {
      setIsLoading(true);
      const authUrl = await veridaServiceInstance.generateAuthUrl(window.location.origin + (redirectPath || window.location.pathname));
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting to Verida:', error);
      setIsLoading(false);
    }
  };

  // Replace user references with currentUser
  // Update the fetchUserData function to use currentUser
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock user data for now
      setCurrentUser({
        id: '1',
        role: 'donor',
        name: 'John Doe',
        email: 'john@example.com'
      });

      // Fetch calendar events from Verida
      const startDates = { $gte: new Date().toISOString() }
      const eventsData = await veridaServiceInstance.getEvents({
        startDate: `${startDates}`
      });
      
      // Since eventsData is already an array, use it directly
      setCalendarEvents(eventsData);
      
      // Fetch other data depending on user role
      if (currentUser?.role === 'donor') {
        // Fetch donor-specific data like invitations
        const mockInvitations: Invitation[] = [
          {
            id: 'inv-1',
            title: 'Urgent Sperm Donation Request',
            from: 'Fertility Center Hospital',
            status: 'pending',
            date: new Date(2025, 4, 15),
            compensationOffered: 100
          },
          {
            id: 'inv-2',
            title: 'IVF Program Participation',
            from: 'Genesis Fertility Clinic',
            status: 'accepted',
            date: new Date(2025, 4, 22),
            compensationOffered: 150
          }
        ];
        setInvitations(mockInvitations);

        // Fetch appointments
        const mockAppointments: Appointment[] = [
          {
            id: 'app-1',
            type: 'Sperm Donation',
            date: new Date(2025, 4, 10, 14, 30),
            hospitalName: 'Fertility Center Hospital',
            status: 'scheduled',
            room: 'Room 304'
          },
          {
            id: 'app-2',
            type: 'Initial Screening',
            date: new Date(2025, 4, 5, 10, 0),
            hospitalName: 'Genesis Fertility Clinic',
            status: 'completed'
          }
        ];
        setAppointments(mockAppointments);
      } else if (currentUser?.role === 'hospital') {
        // Fetch hospital-specific data
        // For demo, using mock data
        const mockAppointments: Appointment[] = [
          {
            id: 'app-1',
            type: 'Sperm Donation',
            date: new Date(2025, 4, 10, 14, 30),
            hospitalName: 'John Smith',
            status: 'scheduled',
            room: 'Room 304'
          },
          {
            id: 'app-2',
            type: 'Initial Screening',
            date: new Date(2025, 4, 5, 10, 0),
            hospitalName: 'Michael Brown',
            status: 'completed'
          },
          {
            id: 'app-3',
            type: 'Fertility Consultation',
            date: new Date(2025, 4, 12, 11, 0),
            hospitalName: 'David Johnson',
            status: 'scheduled',
            room: 'Room 201'
          }
        ];
        setAppointments(mockAppointments);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [veridaServiceInstance, currentUser]);

  useEffect(() => {
    if (!isLoading) {
      window.location.href = '/login';
      return;
    }

    fetchUserData();
  }, [fetchUserData, isLoading]);

  // If not connected to Verida, show connect prompt
  if (isLoading == true) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <Head>
          <title>Dashboard | Fertility Care</title>
        </Head>
        
        <h1 className="text-3xl font-bold mb-6">Welcome to Fertility Care</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Connect to Verida</CardTitle>
            <CardDescription>
              To use all features of our platform, please connect your Verida account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Connecting with Verida allows us to:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>Access your calendar for scheduling</li>
              <li>Send and receive invitations</li>
              <li>Provide personalized recommendations</li>
              <li>Ensure your privacy and data security</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => connectVerida('/dashboard')}>
              Connect with Verida
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Head>
        <title>Dashboard | Fertility Care</title>
      </Head>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          {currentUser?.role === 'donor' ? (
            <Button asChild>
              <Link href="/booking">Book Donation</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/hospital/invites/create">Create Invitations</Link>
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Upcoming {currentUser?.role === 'donor' ? 'Appointments' : 'Sessions'}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{appointments.filter(a => a.status === 'scheduled').length}</p>
          </CardContent>
        </Card>
        
        {currentUser?.role === 'donor' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                <div className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Pending Invitations
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{invitations.filter(i => i.status === 'pending').length}</p>
            </CardContent>
          </Card>
        )}
        
        {currentUser?.role === 'hospital' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Active Donors
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24</p>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              <div className="flex items-center">
                <Clipboard className="mr-2 h-5 w-5" />
                {currentUser?.role === 'donor' ? 'Donation History' : 'Monthly Donations'}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{currentUser?.role === 'donor' ? appointments.filter(a => a.status === 'completed').length : 42}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Calendar</h2>
        <Tabs defaultValue="calendar">
          <TabsList className="mb-4">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar">
            <Card>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  className="rounded-md border"
                  disabled={(date: Date) => date < new Date()}
                  selected={new Date()}
                  initialFocus
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="list">
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6 text-center">Loading calendar events...</div>
                ) : calendarEvents.length === 0 ? (
                  <div className="p-6 text-center">
                    <p>No upcoming events found.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {calendarEvents.slice(0, 5).map((event, index) => (
                      <div key={index} className="p-4 flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-500">
                            {event.location || 'No location specified'}
                          </p>
                          {event.description && (
                            <p className="text-sm mt-1">{event.description}</p>
                          )}
                        </div>
                        <div className="text-sm text-right">
                          <p className="font-medium">
                            {format(new Date(event.startDate), 'MMM d, yyyy')}
                          </p>
                          <p className="text-gray-500">
                            {format(new Date(event.startDate), 'h:mm a')} - 
                            {format(new Date(event.endDate), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center border-t p-4">
                <Button variant="outline" asChild>
                  <Link href="/calendar">View Full Calendar</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {currentUser?.role === 'donor' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Invitations</h2>
            <Card>
              <CardContent className="p-0">
                {invitations.length === 0 ? (
                  <div className="p-6 text-center">
                    <p>No invitations found.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {invitations.map((invitation, index) => (
                      <div key={index} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{invitation.title}</h3>
                          <Badge variant={invitation.status === 'pending' ? 'outline' : (invitation.status === 'accepted' ? 'default' : 'destructive')}>
                            {invitation.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">From: {invitation.from}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm">
                            Date: {format(new Date(invitation.date), 'MMM d, yyyy')}
                          </p>
                          {invitation.compensationOffered && (
                            <p className="text-sm font-medium">
                              Compensation: ${invitation.compensationOffered}
                            </p>
                          )}
                        </div>
                        {invitation.status === 'pending' && (
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" className="flex-1">Accept</Button>
                            <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center border-t p-4">
                <Button variant="outline" asChild>
                  <Link href="/invitations">View All Invitations</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {currentUser?.role === 'hospital' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">5 New Donor Registrations</h3>
                      <Badge>New</Badge>
                    </div>
                    <p className="text-sm text-gray-500">Today at 9:42 AM</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">Invitation Campaign Completed</h3>
                    </div>
                    <p className="text-sm text-gray-500">Yesterday at 3:15 PM</p>
                    <p className="text-sm mt-1">15 invitations sent, 8 accepted</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">New Research Program Started</h3>
                    </div>
                    <p className="text-sm text-gray-500">April 28, 2025</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t p-4">
                <Button variant="outline" asChild>
                  <Link href="/hospital/activity">View All Activity</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {currentUser?.role === 'donor' ? 'My Appointments' : 'Upcoming Sessions'}
          </h2>
          <Card>
            <CardContent className="p-0">
              {appointments.length === 0 ? (
                <div className="p-6 text-center">
                  <p>No appointments found.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {appointments.slice(0, 3).map((appointment, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{appointment.type}</h3>
                        <Badge variant={
                          appointment.status === 'scheduled' ? 'default' : 
                          (appointment.status === 'completed' ? 'secondary' : 'destructive')
                        }>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {currentUser?.role === 'donor' 
                          ? `Hospital: ${appointment.hospitalName}` 
                          : `Donor: ${appointment.hospitalName}`}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm">
                          {format(new Date(appointment.date), 'MMM d, yyyy')} at {format(new Date(appointment.date), 'h:mm a')}
                        </p>
                        {appointment.room && (
                          <p className="text-sm font-medium">
                            {appointment.room}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t p-4">
              <Button variant="outline" asChild>
                <Link href={currentUser?.role === 'donor' ? '/appointments' : '/hospital/sessions'}>
                  View All {currentUser?.role === 'donor' ? 'Appointments' : 'Sessions'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const getBookingServerSideProps = withSessionSsr(async function getBookingServerSideProps({ req }) {
  const user = req.session.user;
  
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  return {
    props: {}
  };
});

export default Dashboard;