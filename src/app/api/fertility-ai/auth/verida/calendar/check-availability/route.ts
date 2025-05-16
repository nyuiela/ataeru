import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { withSessionRoute } from '@/lib/verida-session';
import { RequestWithSession } from '@/lib/utils';
import { NextRequest } from 'next/server';
import { checkAvailabilityHandler } from '@/lib/handlers/check-availability-handler';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const sessionRequest = req as RequestWithSession;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated with Verida
    // const veridaToken = req.session.veridaToken;
    const veridaToken = sessionRequest.session.veridaToken;
    if (!veridaToken) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated with Verida',
        authenticated: false
      });
    }

    // Extract query parameters
    const { startDate, endDate, userId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: startDate, endDate'
      });
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
            // Events that start within the range
            { startDate: { $gte: startDate, $lte: endDate } },
            // Events that end within the range
            { endDate: { $gte: startDate, $lte: endDate } },
            // Events that span the entire range
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

    // Generate time slots (e.g., hourly slots from 9am to 5pm)
    const startDateObj = new Date(startDate as string);
    const endDateObj = new Date(endDate as string);

    const slots: Array<{
      start: string;
      end: string;
      available: boolean;
    }> = [];

    // Loop through each day in the date range
    const currentDate = new Date(startDateObj);
    while (currentDate <= endDateObj) {
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        // Generate slots for this day (9am-5pm)
        const dayStart = new Date(currentDate);
        dayStart.setHours(9, 0, 0, 0);

        const dayEnd = new Date(currentDate);
        dayEnd.setHours(17, 0, 0, 0);

        // Create hourly slots
        let slotStart = new Date(dayStart);
        while (slotStart < dayEnd) {
          const slotEnd = new Date(slotStart);
          slotEnd.setHours(slotStart.getHours() + 1);

          // Check if this slot overlaps with any existing events
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

          // Move to next slot
          slotStart = new Date(slotEnd);
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Return available slots to client
    return res.status(200).json({
      success: true,
      slots,
      availableSlots: slots.filter(slot => slot.available),
      events: existingEvents
    });
  } catch (error: any) {
    console.error('Error checking calendar availability:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to check calendar availability'
    });
  }
};

withSessionRoute(handler);

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;

  return checkAvailabilityHandler(startDate, endDate);
}