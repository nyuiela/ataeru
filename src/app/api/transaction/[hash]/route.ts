import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: { hash: string } }
) {
  try {
    const client = createPublicClient({
      chain: mainnet,
      transport: http()
    });

    const receipt = await client.getTransactionReceipt({
      hash: context.params.hash as `0x${string}`
    });

    return NextResponse.json(receipt);
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction receipt' },
      { status: 500 }
    );
  }
}