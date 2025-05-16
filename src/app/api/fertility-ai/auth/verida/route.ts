import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/verida-session';

export async function GET(req: NextRequest) {
  try {
    // Get session using iron-session with Edge Runtime
    const session = await getIronSession(await cookies(), sessionOptions);

    // Get the redirect URL from query or use default
    const { searchParams } = new URL(req.url);
    const redirectUrl = searchParams.get('redirectUrl') || `${process.env.NEXT_PUBLIC_APP_URL}/booking`;

    // Define scopes needed for fertility app
    const scopesList = [
      // API access scopes
      'api:db-create', 'api:db-update', 'api:db-query',
      'api:ds-get-by-id', 'api:ds-create', 'api:ds-update', 'api:ds-query', 'api:ds-delete',
      'api:llm-prompt', 'api:llm-agent-prompt', 'api:llm-profile-prompt',
      'api:search-chat-threads', 'api:search-ds', 'api:search-universal',
      'api:connections-profiles', 'api:connections-status',

      // Data scopes
      'ds:rwd:social-following',
      'ds:rwd:social-post',
      'ds:rwd:social-email',
      'ds:rwd:favourite',
      'ds:rwd:file',
      'ds:rwd:social-chat-group',
      'ds:rwd:social-chat-message',
      'ds:rwd:social-calendar',
      'ds:rwd:social-event'
    ];
    
    // Verida application DID (should be in environment variables)
    const appDID = process.env.VERIDA_APP_DID || 'did:vda:polpos:0x4B1e1B8868c0ce3Cacb0866caEeDd885FcA9Cd23';
    
    // Store the redirect URL in session for callback validation
    // session.redirectUrl = redirectUrl;
    await session.save();
    
    // Construct URL with multiple scope parameters
    let authUrl = 'https://app.verida.ai/auth?';
    
    // Add each scope individually
    scopesList.forEach(scope => {
      authUrl += `scopes=${encodeURIComponent(scope)}&`;
    });
    
    // Add redirect URL and appDID
    authUrl += `redirectUrl=${encodeURIComponent(redirectUrl)}&appDID=${appDID}`;
    
    return new Response(JSON.stringify({
      success: true,
      authUrl,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to generate authentication URL',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
