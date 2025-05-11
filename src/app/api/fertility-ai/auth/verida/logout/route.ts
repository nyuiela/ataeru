import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/verida-session';
import { IronSession } from 'iron-session';

interface SessionData {
  veridaToken?: string;
}

interface RequestWithSession extends NextApiRequest {
  session: IronSession<SessionData>;
}

async function handler(req: RequestWithSession, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Clear Verida token from session
    req.session.veridaToken = undefined;
    await req.session.save();
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to log out'
    });
  }
}

export default withSessionRoute(handler as unknown as NextApiHandler);