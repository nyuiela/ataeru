import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function verifyCalendarAccess() {
  try {
    const token = (await cookies()).get('verida_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Not authenticated with Verida',
          authenticated: false 
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true
    });
  } catch (error) {
    console.error('Error verifying calendar access:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify calendar access'
      },
      { status: 500 }
    );
  }
}
