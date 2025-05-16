import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if user has a Verida token in cookies
    const token = (await cookies()).get('verida_token');
    
    if (!token) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Not authenticated with Verida'
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: true,
      authenticated: true,
      token: token.value
    });
  } catch (error) {
    console.error('Error getting auth token:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve authentication status'
    }, { status: 500 });
  }
}