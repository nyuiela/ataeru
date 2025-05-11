import { NextResponse } from 'next/server';
import { IronSession } from 'iron-session';
import VeridaService from '@/lib/services/verida/verida-service';
import { NextApiRequest } from 'next';

interface SessionData {
  veridaToken?: string;
}

interface BookingRequest {
  startDate: string;
  endDate: string;
  hospitalId: string;
  donorId: string;
  purpose: string;
}

interface RequestWithSession extends NextApiRequest {
  json(): unknown;
  session: IronSession<SessionData>;
}


export async function POST(req: RequestWithSession) {
  try {
    if (!req.session.veridaToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Verida' },
        { status: 401 }
      );
    }

    const body = await req.json() as BookingRequest;
    const { startDate, endDate, hospitalId, donorId, purpose } = body;

    const veridaService = new VeridaService(req.session.veridaToken);

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

export async function GET(req: RequestWithSession) {
  try {    
    if (!req.session.veridaToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Verida' },
        { status: 401 }
      );
    }

    if (!req.url) {
      return NextResponse.json(
        { error: 'Invalid request URL' },
        { status: 400 }
      );
    }
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const veridaService = new VeridaService(req.session.veridaToken);

    const startDates = { $gte: startDate }
    const endDates = { $lte: endDate }

    const events = await veridaService.getEvents({
        startDate: `${startDates}`,
        endDate: `${endDates}`
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
