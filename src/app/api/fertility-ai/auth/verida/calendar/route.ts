import type { NextApiHandler, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/verida-session';
import axios from 'axios';
import { RequestWithSession } from '@/lib/utils';


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


const handler: NextApiHandler = async (req, res: NextApiResponse) => {
  const sessionRequest = req as RequestWithSession;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const veridaToken = sessionRequest.session.veridaToken;
    // const veridaToken = req.session.veridaToken;
    if (!veridaToken) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated with Verida',
        authenticated: false
      });
    }

    // Extract query parameters
    const { startDate, endDate, type } = req.query;
    
    // Build query object
    const query: QueryFilter = {};
    
    if (startDate && typeof startDate === 'string') {
      query.startDate = { $gte: startDate };
    }
    
    if (endDate && typeof endDate === 'string') {
      query.endDate = { $lte: endDate };
    }
    
    if (type && typeof type === 'string') {
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
    
    // Return events to client
    return res.status(200).json({
      success: true,
      events: response.data.items || [],
      count: response.data.items?.length || 0
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch calendar events';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}

export default withSessionRoute(handler as unknown as NextApiHandler);
