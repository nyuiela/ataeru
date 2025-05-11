/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { withSessionRoute } from '@/lib/verida-session';
import { RequestWithSession } from '@/lib/utils';


async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionRequest = req as RequestWithSession;
  if (req.method !== 'POST') {
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

    // Extract event data from request body
    const { 
      title, 
      startDate, 
      endDate, 
      location,
      description,
      type,
      attendees,
      notifyAttendees
    } = req.body;
    
    // Validate required fields
    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, startDate, endDate'
      });
    }
    
    // Create event object
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
    
    // Encode schema URL in base64
    const schemaUrl = 'https://common.schemas.verida.io/social/event/v0.1.0/schema.json';
    const schemaUrlEncoded = Buffer.from(schemaUrl).toString('base64');
    
    // Make request to Verida API
    const response = await axios({
      method: 'POST',
      url: `${process.env.VERIDA_API_ENDPOINT}/ds/create/${schemaUrlEncoded}`,
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
    
    // If notification is enabled, send email to attendees
    if (notifyAttendees && attendees && attendees.length > 0) {
      // In a real implementation, you would integrate with an email service
      // or use Verida's messaging capabilities
      console.log('Notification would be sent to attendees:', attendees);
    }
    
    // Return created event to client
    return res.status(200).json({
      success: true,
      event: response.data.item || response.data,
      id: response.data.item?._id || response.data._id
    });
  } catch (error: any) {
    console.error('Error creating calendar event:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create calendar event'
    });
  }
}

export default withSessionRoute(handler);
