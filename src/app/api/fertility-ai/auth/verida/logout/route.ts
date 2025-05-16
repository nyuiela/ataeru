import { NextRequest } from 'next/server';
import { handleLogout } from '@/lib/handlers/logout-handler';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return handleLogout();
}