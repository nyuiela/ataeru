import axios from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function createCalendarEventHandler(eventData: {
  title: string;
  startDate: string;
  endDate: string;
  location?: string;
  description?: string;
  type?: string;
  attendees?: string[];
  notifyAttendees?: boolean;
}) {
  try {
    // Get token from cookie
    const veridaToken = (await cookies()).get('verida_token')?.value;
    
    if (!veridaToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated with Verida',
          authenticated: false
        },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!eventData.title || !eventData.startDate || !eventData.endDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, startDate, endDate'
        },
        { status: 400 }
      );
    }

    // Create full event object with defaults
    const fullEventData = {
      ...eventData,
      type: eventData.type || 'fertility-appointment',
      attendees: eventData.attendees || [],
      notifyAttendees: eventData.notifyAttendees || false,
      sourceApplication: process.env.NEXT_PUBLIC_APP_URL || 'https://fertility-care.app'
    };

    // Encode schema URL in base64
    const schemaUrl = 'https://common.schemas.verida.io/social/event/v0.1.0/schema.json';
    const schemaUrlEncoded = Buffer.from(schemaUrl).toString('base64');

    // Make request to Verida API
    const response = await axios({
      method: 'POST',
      url: `${process.env.VERIDA_API_ENDPOINT}/ds/save/${schemaUrlEncoded}`,
      data: {
        document: {
          ...fullEventData,
          schema: schemaUrl
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${veridaToken}`
      }
    });

    // Handle notifications if enabled
    if (fullEventData.notifyAttendees && fullEventData.attendees.length > 0) {
      // Implement notification logic here
      console.log('Would notify attendees:', fullEventData.attendees);
    }

    return NextResponse.json({
      success: true,
      event: response.data.item || response.data,
      id: response.data.item?._id || response.data._id
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create calendar event'
      },
      { status: 500 }
    );
  }
}
