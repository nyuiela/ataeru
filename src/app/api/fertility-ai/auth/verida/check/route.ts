import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const token = (await cookies()).get('verida_token');
    return NextResponse.json({ 
      isConnected: !!token?.value,
      // Don't send the actual token in the response
    });
  } catch (error) {
    console.error('Error checking Verida connection:', error);
    return NextResponse.json({ 
      isConnected: false,
      error: 'Failed to check connection status' 
    });
  }
}
