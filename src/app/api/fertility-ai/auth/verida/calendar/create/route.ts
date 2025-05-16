import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { 
      title, 
      startDate, 
      endDate, 
      location,
      description,
      type,
      attendees,
      notifyAttendees
    } = body;

    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, startDate, endDate'
        },
        { status: 400 }
      );
    }

    const eventData = {
      title,
      startDate,
      endDate,
      location,
      description,
      type: type || 'fertility-appointment',
      attendees: attendees || [],
      notifyAttendees: notifyAttendees || false,
      sourceApplication: process.env.NEXT_PUBLIC_APP_URL || 'https://fertility-care.app'
    };

    const schemaUrl = 'https://common.schemas.verida.io/social/event/v0.1.0/schema.json';
    const schemaUrlEncoded = Buffer.from(schemaUrl).toString('base64');

    const response = await axios({
      method: 'POST',
      url: `${process.env.VERIDA_API_ENDPOINT}/ds/save/${schemaUrlEncoded}`,
      data: {
        document: {
          ...eventData,
          schema: schemaUrl
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${veridaToken}`
      }
    });

    // Handle notifications if enabled
    if (notifyAttendees && attendees?.length > 0) {
      // Implement notification logic here
      console.log('Would notify attendees:', attendees);
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
