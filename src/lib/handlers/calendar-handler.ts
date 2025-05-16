import axios from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface QueryFilter {
  startDate?: { $gte: string };
  endDate?: { $lte: string };
  type?: string;
}

interface CalendarEvent {
  id: string;
  startDate: string;
  endDate: string;
  type?: string;
  title: string;
  description?: string;
}

export async function getCalendarEvents(
  startDate?: string,
  endDate?: string,
  type?: string
) {
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

    // Build query object
    const query: QueryFilter = {};
    
    if (startDate) {
      query.startDate = { $gte: startDate };
    }
    
    if (endDate) {
      query.endDate = { $lte: endDate };
    }
    
    if (type) {
      query.type = type;
    }
    
    // Encode schema URL in base64
    const schemaUrl = 'https://common.schemas.verida.io/social/event/v0.1.0/schema.json';
    const schemaUrlEncoded = Buffer.from(schemaUrl).toString('base64');
    
    // Make request to Verida API
    const response = await axios<{ items: CalendarEvent[] }>({
      method: 'POST',
      url: `${process.env.VERIDA_API_ENDPOINT}/ds/query/${schemaUrlEncoded}`,
      data: {
        query,
        options: {
          sort: [{ startDate: "asc" }],
          limit: 100
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${veridaToken}`
      }
    });
    
    return NextResponse.json({
      success: true,
      events: response.data.items || [],
      count: response.data.items?.length || 0
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch calendar events'
      },
      { status: 500 }
    );
  }
}
