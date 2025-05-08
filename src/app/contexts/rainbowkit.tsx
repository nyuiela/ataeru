"use client"
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { type Chain } from 'viem';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { AuthProvider } from './use-auth';
export const localhost
  = {
    id
      : 31337,
    name
      : 'Localhost',
    nativeCurrency
      : {
      name
        : 'Ether', symbol
        : 'ETH', decimals
        : 18
    },
    rpcUrls
      : {
      default
        : {
        http
          : ['http://127.0.0.1:8545']
      },
    },
    blockExplorers
      : {
      default
        : {
        name
          : 'Etherscan', url
          : 'https://etherscan.io'
      },
    },
    contracts
      : {
      ensRegistry
        : {
        address
          : '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
      },
      ensUniversalResolver
        : {
        address
          : '0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da',
        blockCreated
          : 16773775,
      },
      multicall3
        : {
        address
          : '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated
          : 14353601,
      },
    },
  } as const satisfies Chain

const projectId = process.env.RAINBOW_KIT_PROJECT_ID
const RAINVOW_KIT_PROJECT_ID = `${projectId}`
const config = getDefaultConfig({
  appName: 'Ataeru',
  projectId: `${RAINVOW_KIT_PROJECT_ID}`,
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia, localhost],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const RainbowProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowProvider;




