import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function handleLogout() {
  try {
    // Remove the Verida token cookie
    (await cookies()).delete('verida_token');

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to log out'
      },
      { status: 500 }
    );
  }
}
