import { NextRequest } from 'next/server';
import { verifyCalendarAccess } from '@/lib/handlers/calendar-verify-handler';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return verifyCalendarAccess();
}
