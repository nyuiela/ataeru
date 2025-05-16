import { getIronSession, IronSessionData } from 'iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

// Extend IronSessionData with our custom data
declare module 'iron-session' {
  interface IronSessionData {
    veridaToken?: string;
    user?: {
      id: string;
      role: 'donor' | 'hospital' | 'admin';
      name: string;
      email: string;
    };
  }
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'fertility_app_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

export async function withSessionRoute(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getIronSession<IronSessionData>(req, res, sessionOptions);
    (req as any).session = session;
    return handler(req, res);
  };
}

export async function withSessionSsr<P extends { [key: string]: unknown }>(
  handler: (context: any) => Promise<P>
) {
  return async (context: any) => {
    const session = await getIronSession(context.req, context.res, sessionOptions);
    context.req.session = session;
    return handler(context);
  };
}