import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/verida-session';
import { IronSession } from 'iron-session';
import { IronSessionData } from 'iron-session';

interface RequestWithSession extends NextApiRequest {
  session: IronSession<IronSessionData>;
}

async function handler(req: RequestWithSession, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Check if user has a Verida token in session
    const token = req.session.veridaToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'Not authenticated with Verida'
      });
    }
    
    return res.status(200).json({
      success: true,
      authenticated: true,
      token
    });
  } catch (error) {
    console.error('Error getting auth token:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve authentication status'
    });
  }
}

// Wrap the handler with proper type assertions
export default withSessionRoute(handler as unknown as NextApiHandler);