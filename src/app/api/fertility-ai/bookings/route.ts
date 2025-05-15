import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import VeridaService from '@/lib/services/verida/verida-service';

interface BookingRequest {
  startDate: string;
  endDate: string;
  hospitalId: string;
  donorId: string;
  purpose: string;
}

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const veridaToken = (await cookies()).get('verida_token')?.value;
    
    if (!veridaToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Verida' },
        { status: 401 }
      );
    }

    const body = await request.json() as BookingRequest;
    const { startDate, endDate, hospitalId, donorId, purpose } = body;

    const veridaService = new VeridaService(veridaToken);

    // Create calendar event for the booking
    const event = await veridaService.createEvent({
      title: `Donation Appointment - ${purpose}`,
      startDate: startDate,
      endDate: endDate,
      description: `Donation appointment with hospital ${hospitalId}`,
      attendees: [
        { id: donorId, role: 'user' },
        { id: hospitalId, role: 'hospital' }
      ],
      id: ''
    });

    return NextResponse.json({
      success: true,
      booking: event
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const veridaToken = (await cookies()).get('verida_token')?.value;
    
    if (!veridaToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Verida' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required date parameters' },
        { status: 400 }
      );
    }

    const veridaService = new VeridaService(veridaToken);
    
    const events = await veridaService.getEvents({
      startDate: startDate,
      endDate: endDate
    });

    return NextResponse.json({
      success: true,
      bookings: events
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
