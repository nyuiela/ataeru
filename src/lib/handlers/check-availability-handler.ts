import axios from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface EventFilter {
  startDate?: { $gte: string };
  endDate?: { $lte: string };
}

export async function checkAvailabilityHandler(
  startDate?: string,
  endDate?: string,
  userId?: string
) {
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

    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: startDate, endDate'
        },
        { status: 400 }
      );
    }

    // Encode schema URL in base64
    const schemaUrl = 'https://common.schemas.verida.io/social/event/v0.1.0/schema.json';
    const schemaUrlEncoded = Buffer.from(schemaUrl).toString('base64');

    // Fetch existing events in date range
    const response = await axios({
      method: 'POST',
      url: `${process.env.VERIDA_API_ENDPOINT}/ds/query/${schemaUrlEncoded}`,
      data: {
        query: {
          $or: [
            { startDate: { $gte: startDate, $lte: endDate } },
            { endDate: { $gte: startDate, $lte: endDate } },
            {
              $and: [
                { startDate: { $lte: startDate } },
                { endDate: { $gte: endDate } }
              ]
            }
          ]
        },
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

    const existingEvents = response.data.items || [];
    const slots = generateTimeSlots(startDate, endDate, existingEvents);

    return NextResponse.json({
      success: true,
      slots,
      availableSlots: slots.filter(slot => slot.available),
      events: existingEvents
    });
  } catch (error) {
    console.error('Error checking calendar availability:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check calendar availability'
      },
      { status: 500 }
    );
  }
}

function generateTimeSlots(startDate: string, endDate: string, existingEvents: any[]) {
  const slots: Array<{
    start: string;
    end: string;
    available: boolean;
  }> = [];

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const currentDate = new Date(startDateObj);
  while (currentDate <= endDateObj) {
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(9, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(17, 0, 0, 0);

      let slotStart = new Date(dayStart);
      while (slotStart < dayEnd) {
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(slotStart.getHours() + 1);

        const isOverlapping = existingEvents.some((event: any) => {
          const eventStart = new Date(event.startDate);
          const eventEnd = new Date(event.endDate);
          return (
            (slotStart >= eventStart && slotStart < eventEnd) ||
            (slotEnd > eventStart && slotEnd <= eventEnd) ||
            (slotStart <= eventStart && slotEnd >= eventEnd)
          );
        });

        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          available: !isOverlapping
        });

        slotStart = new Date(slotEnd);
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
}
