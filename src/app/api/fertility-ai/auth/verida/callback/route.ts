import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { auth_token } = await request.json();

    if (!auth_token) {
      return NextResponse.json(
        { success: false, error: 'No auth token provided' },
        { status: 400 }
      );
    }

    // Store the token in an HTTP-only cookie
    (await
      // Store the token in an HTTP-only cookie
      cookies()).set('verida_token', auth_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Also store in sessionStorage for client-side checks
    // This will be done on the client side

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing auth callback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process authentication' },
      { status: 500 }
    );
  }
}